package com.milkmate.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.milkmate.entity.Payment;
import com.milkmate.repository.PaymentRepository;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174"
})
public class PaymentController {

    private final PaymentRepository paymentRepository;

    public PaymentController(
            PaymentRepository paymentRepository) {

        this.paymentRepository = paymentRepository;
    }

    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @GetMapping("/customer/{customerId}")
    public List<Payment> getPaymentsByCustomer(
            @PathVariable Long customerId) {

        return paymentRepository
                .findByCustomerId(customerId);
    }

    @PostMapping
    public Payment addPayment(
            @RequestBody Payment payment) {

        return paymentRepository.save(payment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePayment(
            @PathVariable Long id,
            @RequestBody Payment payment) {

        Payment existingPayment =
                paymentRepository.findById(id)
                .orElse(null);

        if (existingPayment == null) {
            return ResponseEntity
                    .notFound()
                    .build();
        }

        existingPayment.setCustomerId(
                payment.getCustomerId());

        existingPayment.setBillingMonth(
                payment.getBillingMonth());

        existingPayment.setAmount(
                payment.getAmount());

        existingPayment.setPaid(
                payment.getPaid());

        Payment updatedPayment =
                paymentRepository.save(existingPayment);

        return ResponseEntity.ok(updatedPayment);
    }

    @PostMapping("/mark-paid")
    public ResponseEntity<?> markPaid(
            @RequestBody Payment payment) {

        payment.setPaid(true);

        Payment savedPayment =
                paymentRepository.save(payment);

        return ResponseEntity.ok(savedPayment);
    }
}