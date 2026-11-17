package com.hv.uhpcviet.uhpcviet_backend.product.service;

import com.hv.uhpcviet.uhpcviet_backend.exception.ResourceNotFoundException;
import com.hv.uhpcviet.uhpcviet_backend.product.dto.ProductResponse;
import com.hv.uhpcviet.uhpcviet_backend.product.entity.Product;
import com.hv.uhpcviet.uhpcviet_backend.product.entity.ProductTranslation;
import com.hv.uhpcviet.uhpcviet_backend.product.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts(String locale) {
        final String validatedLocale = LocaleValidator.validate(locale);

        return productRepository.findAllActiveWithTranslations()
                .stream()
                .map(product -> mapToResponse(product, validatedLocale))
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductBySlug(String slug, String locale) {
        final String validatedLocale = LocaleValidator.validate(locale);

        Product product = productRepository
                .findActiveBySlugWithTranslations(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        return mapToResponse(product, validatedLocale);
    }

    private ProductResponse mapToResponse(Product product, String locale) {
        ProductTranslation translation = product.getTranslations()
                .stream()
                .filter(item -> locale.equals(item.getLocale()))
                .findFirst()
                .orElse(null);

        var categoryTranslation = product.getCategory()
                .getTranslations()
                .stream()
                .filter(item -> locale.equals(item.getLocale()))
                .findFirst()
                .orElse(null);

        return new ProductResponse(
                product.getId(),
                product.getSlug(),
                translation != null ? translation.getName() : null,
                translation != null ? translation.getDescription() : null,
                product.getImageUrl(),
                product.getCategory().getSlug(),
                categoryTranslation != null ? categoryTranslation.getName() : null);
    }
}