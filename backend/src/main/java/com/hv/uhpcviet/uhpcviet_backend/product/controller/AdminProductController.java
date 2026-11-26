package com.hv.uhpcviet.uhpcviet_backend.product.controller;

import com.hv.uhpcviet.uhpcviet_backend.product.dto.AdminProductResponse;
import com.hv.uhpcviet.uhpcviet_backend.product.service.ProductService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {

    private final ProductService productService;

    public AdminProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<AdminProductResponse> getProducts() {
        return productService.getAllAdminProducts();
    }
}
