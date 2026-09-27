package com.milkmate.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.milkmate.entity.ShopSettings;
import com.milkmate.repository.ShopSettingsRepository;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174"
})
public class ShopSettingsController {

    private final ShopSettingsRepository shopSettingsRepository;

    public ShopSettingsController(
            ShopSettingsRepository shopSettingsRepository) {

        this.shopSettingsRepository = shopSettingsRepository;
    }

    @GetMapping
    public ShopSettings getSettings() {

        return shopSettingsRepository
                .findAll()
                .stream()
                .findFirst()
                .orElse(null);
    }

    @PostMapping
    public ShopSettings saveSettings(
            @RequestBody ShopSettings settings) {

        ShopSettings existingSettings =
                shopSettingsRepository
                .findAll()
                .stream()
                .findFirst()
                .orElse(null);

        if (existingSettings != null) {

            existingSettings.setShopName(
                    settings.getShopName());

            existingSettings.setOwnerName(
                    settings.getOwnerName());

            existingSettings.setMobile(
                    settings.getMobile());

            existingSettings.setMilkPrice(
                    settings.getMilkPrice());

            existingSettings.setMorningDeliveryTime(
                    settings.getMorningDeliveryTime());

            existingSettings.setEveningDeliveryTime(
                    settings.getEveningDeliveryTime());

            return shopSettingsRepository
                    .save(existingSettings);
        }

        return shopSettingsRepository.save(settings);
    }
}