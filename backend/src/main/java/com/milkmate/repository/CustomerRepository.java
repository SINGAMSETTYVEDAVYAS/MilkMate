package com.milkmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.milkmate.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

}