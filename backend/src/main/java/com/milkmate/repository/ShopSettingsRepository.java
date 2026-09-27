package com.milkmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.milkmate.entity.ShopSettings;

public interface ShopSettingsRepository
        extends JpaRepository<ShopSettings, Long> {
}