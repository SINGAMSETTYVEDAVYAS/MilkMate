package com.milkmate.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "shop_settings")
public class ShopSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String shopName;

    private String ownerName;

    private String mobile;

    private Double milkPrice;

    private String morningDeliveryTime;

    private String eveningDeliveryTime;

    public ShopSettings() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public Double getMilkPrice() {
        return milkPrice;
    }

    public void setMilkPrice(Double milkPrice) {
        this.milkPrice = milkPrice;
    }

    public String getMorningDeliveryTime() {
        return morningDeliveryTime;
    }

    public void setMorningDeliveryTime(
            String morningDeliveryTime) {

        this.morningDeliveryTime =
                morningDeliveryTime;
    }

    public String getEveningDeliveryTime() {
        return eveningDeliveryTime;
    }

    public void setEveningDeliveryTime(
            String eveningDeliveryTime) {

        this.eveningDeliveryTime =
                eveningDeliveryTime;
    }
}