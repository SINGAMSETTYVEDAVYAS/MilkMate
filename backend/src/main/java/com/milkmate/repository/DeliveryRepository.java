package com.milkmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.milkmate.entity.Delivery;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {

}