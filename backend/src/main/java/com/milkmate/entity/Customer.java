package com.milkmate.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String mobile;

    private String address;

    private Double quantity;

    private String shift;


    public Customer() {
    }


    public Customer(String name, String mobile, String address,
                    Double quantity, String shift) {

        this.name = name;
        this.mobile = mobile;
        this.address = address;
        this.quantity = quantity;
        this.shift = shift;
    }


    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }


    public String getName() {
        return name;
    }


    public void setName(String name) {
        this.name = name;
    }


    public String getMobile() {
        return mobile;
    }


    public void setMobile(String mobile) {
        this.mobile = mobile;
    }


    public String getAddress() {
        return address;
    }


    public void setAddress(String address) {
        this.address = address;
    }


    public Double getQuantity() {
        return quantity;
    }


    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }


    public String getShift() {
        return shift;
    }


    public void setShift(String shift) {
        this.shift = shift;
    }
}