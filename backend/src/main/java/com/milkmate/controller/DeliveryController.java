package com.milkmate.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.milkmate.entity.Delivery;
import com.milkmate.repository.DeliveryRepository;
import com.milkmate.service.Fast2SmsService;

@RestController
@RequestMapping("/api/deliveries")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174"
})
public class DeliveryController {

    private final DeliveryRepository deliveryRepository;

    private final Fast2SmsService fast2SmsService;

    public DeliveryController(
            DeliveryRepository deliveryRepository,
            Fast2SmsService fast2SmsService) {

        this.deliveryRepository = deliveryRepository;
        this.fast2SmsService = fast2SmsService;
    }

    @GetMapping
    public List<Delivery> getAllDeliveries() {

        return deliveryRepository.findAll();
    }

    @PostMapping
    public Delivery addDelivery(
            @RequestBody Delivery delivery) {

        delivery.setDayClosed(false);
        delivery.setDeliveryDate(LocalDate.now());

        return deliveryRepository.save(delivery);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDelivery(
            @PathVariable Long id,
            @RequestBody Delivery delivery) {

        Delivery existingDelivery =
                deliveryRepository.findById(id)
                .orElse(null);

        if (existingDelivery == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Delivery not found");
        }

        if (Boolean.TRUE.equals(
                existingDelivery.getDayClosed())) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                        "This delivery is locked because the day is closed"
                    );
        }

        String oldStatus =
                existingDelivery.getStatus();

        String newStatus =
                delivery.getStatus();

        existingDelivery.setCustomerName(
                delivery.getCustomerName()
        );

        existingDelivery.setMobile(
                delivery.getMobile()
        );

        existingDelivery.setAddress(
                delivery.getAddress()
        );

        existingDelivery.setQuantity(
                delivery.getQuantity()
        );

        existingDelivery.setShift(
                delivery.getShift()
        );

        existingDelivery.setDeliveryTime(
                delivery.getDeliveryTime()
        );

        existingDelivery.setStatus(
                newStatus
        );

        Delivery savedDelivery =
                deliveryRepository.save(existingDelivery);

        if ("Delivered".equalsIgnoreCase(newStatus)
                && !"Delivered".equalsIgnoreCase(oldStatus)) {

            String message =
                    "MilkMate: Your "
                    + existingDelivery.getQuantity()
                    + " litre milk delivery has been completed today. Thank you.";

            fast2SmsService.sendSms(
                    existingDelivery.getMobile(),
                    message
            );
        }

        return ResponseEntity.ok(savedDelivery);
    }

    @PutMapping("/close-day")
    public ResponseEntity<?> closeDay() {

        LocalDate today = LocalDate.now();

        List<Delivery> deliveries =
                deliveryRepository.findAll();

        for (Delivery delivery : deliveries) {

            if (today.equals(
                    delivery.getDeliveryDate())) {

                delivery.setDayClosed(true);

                deliveryRepository.save(delivery);
            }
        }

        return ResponseEntity.ok(
                "Today's deliveries have been locked"
        );
    }
}