package com.milkmate.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.milkmate.entity.Payment;

public interface PaymentRepository
        extends JpaRepository<Payment, Long> {

    List<Payment> findByCustomerId(Long customerId);

    List<Payment> findByBillingMonth(String billingMonth);
}