# MilkMate – Milk Delivery Management System

MilkMate is a full-stack web application designed to help milk shop owners manage customers, daily milk deliveries, billing, payments, reports, and shop settings from one place.

## Features

- Customer management
- Daily milk delivery management
- Morning and evening delivery shifts
- Delivery status tracking
- Close Day feature to lock completed deliveries
- Monthly billing and payment tracking
- Payment status management
- Delivery and billing reports
- Shop settings management
- Milk price configuration
- SMS integration using Fast2SMS

## Technologies Used

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Java
- Spring Boot
- Spring Data JPA
- REST APIs
- Maven

### Database
- MySQL

### SMS
- Fast2SMS API

## Project Structure

MilkMate/
+-- frontend/
+-- backend/

## Frontend Setup

1. Open the frontend folder:

   cd frontend

2. Install dependencies:

   npm install

3. Start the React application:

   npm run dev

The frontend runs on:

http://localhost:5173

## Backend Setup

1. Open the backend folder in Eclipse or another Java IDE.

2. Configure MySQL database:

   Database name: milkmate

3. Configure the required environment variables:

   DB_PASSWORD
   FAST2SMS_API_KEY

4. Run the Spring Boot application.

The backend runs on:

http://localhost:8080

## Database

Create a MySQL database named:

milkmate

Spring Boot automatically creates and updates the required tables using JPA.

## Main Modules

- Dashboard
- Customers
- Deliveries
- Billing
- Reports
- Settings

## Author

Vedavya Singamsetty

## Project

MilkMate – Milk Delivery Management System
