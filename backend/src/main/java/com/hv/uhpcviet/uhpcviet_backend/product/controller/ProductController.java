package com.hv.uhpcviet.uhpcviet_backend.product.controller;

import com.hv.uhpcviet.uhpcviet_backend.product.dto.ProductResponse;
import com.hv.uhpcviet.uhpcviet_backend.product.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<ProductResponse> getAllProducts(
            @RequestParam(defaultValue = "en") String locale
    ) {
        return productService.getAllProducts(locale);
    }

    @GetMapping("/{slug}")
    public ProductResponse getProductBySlug(
            @PathVariable String slug,
            @RequestParam(defaultValue = "en") String locale
    ) {
        return productService.getProductBySlug(slug, locale);
    }
}