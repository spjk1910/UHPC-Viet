package com.hv.uhpcviet.uhpcviet_backend.product.controller;

import com.hv.uhpcviet.uhpcviet_backend.product.dto.ProductCreateRequest;
import com.hv.uhpcviet.uhpcviet_backend.product.dto.ProductResponse;
import com.hv.uhpcviet.uhpcviet_backend.product.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @PostMapping(value = "/{slug}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProductResponse uploadProductImage(
            @PathVariable String slug,
            @RequestParam("file") MultipartFile image,
            @RequestParam(defaultValue = "en") String locale
    ) {
        return productService.uploadProductImage(slug, image, locale);
    }

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody ProductCreateRequest product,
            @RequestParam(defaultValue = "en") String locale
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(productService.createProduct(product, locale));
    }

    @PutMapping("/{slug}")
    public ProductResponse updateProduct(
            @PathVariable String slug,
            @RequestBody ProductResponse product,
            @RequestParam(defaultValue = "en") String locale
    ) {
        return productService.updateProduct(slug, product, locale);
    }
}