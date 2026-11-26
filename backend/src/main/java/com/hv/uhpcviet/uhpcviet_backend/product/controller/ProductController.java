package com.hv.uhpcviet.uhpcviet_backend.product.controller;

import com.hv.uhpcviet.uhpcviet_backend.product.dto.ProductCreateRequest;
import com.hv.uhpcviet.uhpcviet_backend.product.dto.ProductResponse;
import com.hv.uhpcviet.uhpcviet_backend.product.service.ProductImageStorageService;
import com.hv.uhpcviet.uhpcviet_backend.product.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final ProductImageStorageService productImageStorageService;

    public ProductController(
            ProductService productService,
            ProductImageStorageService productImageStorageService
    ) {
        this.productService = productService;
        this.productImageStorageService = productImageStorageService;
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

    @GetMapping("/images/{objectName}")
    public ResponseEntity<StreamingResponseBody> getProductImage(
            @PathVariable String objectName
    ) {
        MediaType contentType = MediaType.parseMediaType(
                productImageStorageService.getImageContentType(objectName));
        StreamingResponseBody image = outputStream ->
                productImageStorageService.copyImageTo(objectName, outputStream);

        return ResponseEntity.ok()
                .contentType(contentType)
                .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS).cachePublic())
                .body(image);
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
            @Valid @RequestBody ProductCreateRequest product,
            @RequestParam(defaultValue = "en") String locale
    ) {
        return productService.updateProduct(slug, product, locale);
    }

    @DeleteMapping("/{slug}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable String slug) {
        productService.deleteProduct(slug);
    }
}