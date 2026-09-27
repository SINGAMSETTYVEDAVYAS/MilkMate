package com.milkmate.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.milkmate.entity.Customer;
import com.milkmate.repository.CustomerRepository;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174"
})
public class CustomerController {

    private final CustomerRepository customerRepository;

    public CustomerController(
            CustomerRepository customerRepository) {

        this.customerRepository = customerRepository;
    }

    @GetMapping
    public List<Customer> getAllCustomers() {

        return customerRepository.findAll();
    }

    @PostMapping
    public Customer addCustomer(
            @RequestBody Customer customer) {

        return customerRepository.save(customer);
    }

    @GetMapping("/{id}")
    public Customer getCustomerById(
            @PathVariable Long id) {

        return customerRepository
                .findById(id)
                .orElse(null);
    }

    @PutMapping("/{id}")
    public Customer updateCustomer(
            @PathVariable Long id,
            @RequestBody Customer customer) {

        Customer existingCustomer =
                customerRepository
                .findById(id)
                .orElse(null);

        if (existingCustomer == null) {
            return null;
        }

        existingCustomer.setName(
                customer.getName()
        );

        existingCustomer.setMobile(
                customer.getMobile()
        );

        existingCustomer.setAddress(
                customer.getAddress()
        );

        existingCustomer.setQuantity(
                customer.getQuantity()
        );

        existingCustomer.setShift(
                customer.getShift()
        );

        return customerRepository.save(
                existingCustomer
        );
    }

    @DeleteMapping("/{id}")
    public String deleteCustomer(
            @PathVariable Long id) {

        if (!customerRepository.existsById(id)) {
            return "Customer not found";
        }

        customerRepository.deleteById(id);

        return "Customer deleted successfully";
    }
}