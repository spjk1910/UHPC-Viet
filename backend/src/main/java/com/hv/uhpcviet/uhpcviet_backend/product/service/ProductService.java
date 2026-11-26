package com.hv.uhpcviet.uhpcviet_backend.product.service;

import com.hv.uhpcviet.uhpcviet_backend.exception.ResourceNotFoundException;
import com.hv.uhpcviet.uhpcviet_backend.exception.BadRequestException;
import com.hv.uhpcviet.uhpcviet_backend.exception.ResourceConflictException;
import com.hv.uhpcviet.uhpcviet_backend.product.dto.ProductCreateRequest;
import com.hv.uhpcviet.uhpcviet_backend.product.dto.ProductModelCreateRequest;
import com.hv.uhpcviet.uhpcviet_backend.product.dto.ProductModelResponse;
import com.hv.uhpcviet.uhpcviet_backend.product.dto.ProductResponse;
import com.hv.uhpcviet.uhpcviet_backend.product.entity.Product;
import com.hv.uhpcviet.uhpcviet_backend.product.entity.ProductModel;
import com.hv.uhpcviet.uhpcviet_backend.product.entity.ProductType;
import com.hv.uhpcviet.uhpcviet_backend.product.repository.ProductRepository;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final EntityManager entityManager;
    private final ProductImageStorageService productImageStorageService;

    public ProductService(
            ProductRepository productRepository,
            EntityManager entityManager,
            ProductImageStorageService productImageStorageService
    ) {
        this.productRepository = productRepository;
        this.entityManager = entityManager;
        this.productImageStorageService = productImageStorageService;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts(String locale) {
        String validatedLocale = LocaleValidator.validate(locale);
        return productRepository.findAllByOrderByProductIdAsc().stream()
                .map(product -> mapToResponse(product, validatedLocale))
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductBySlug(String slug, String locale) {
        String validatedLocale = LocaleValidator.validate(locale);
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return mapToResponse(product, validatedLocale);
    }

    @Transactional
    public ProductResponse uploadProductImage(String slug, MultipartFile image, String locale) {
        String validatedLocale = LocaleValidator.validate(locale);
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        product.setImageUrl(productImageStorageService.store(image));
        Product updated = productRepository.save(product);
        return mapToResponse(updated, validatedLocale);
    }

    @Transactional
    public ProductResponse createProduct(ProductCreateRequest request, String locale) {
        String validatedLocale = LocaleValidator.validate(locale);
        if (productRepository.existsById(request.productId())) {
            throw new ResourceConflictException("Product ID already exists");
        }
        if (productRepository.existsBySlug(request.slug())) {
            throw new ResourceConflictException("Product slug already exists");
        }

        ProductType productType;
        try {
            productType = ProductType.valueOf(request.productType().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            throw new BadRequestException("Invalid product type");
        }

        requireLocalizedObject(request.productName(), "productName");
        requireLocalizedObject(request.shortDescription(), "shortDescription");
        requireLocalizedObject(request.shortAdvantage(), "shortAdvantage");
        requireLocalizedObject(request.description(), "description");
        requireLocalizedObject(request.guide(), "guide");
        if (request.multipleVariant()) {
            requireLocalizedObject(request.selectionName(), "selectionName");
        } else if (request.selectionName() != null) {
            throw new BadRequestException(
                    "selectionName must be omitted when multipleVariant is false");
        }

        Product product = new Product(
                request.productId(),
                productType,
                request.productName(),
                request.shortDescription(),
                request.shortAdvantage(),
                request.description(),
                request.guide(),
                request.imageUrl(),
                request.slug(),
                request.multipleVariant(),
                request.selectionName());

        if (request.models() != null) {
            for (ProductModelCreateRequest modelRequest : request.models()) {
                requireLocalizedObject(modelRequest.productName(), "model productName");
                requireLocalizedObject(modelRequest.variant(), "model variant");
                product.addModel(new ProductModel(
                        modelRequest.modelId(),
                        product,
                        modelRequest.productName(),
                        modelRequest.variant()));
            }
        }

        entityManager.persist(product);
        return mapToResponse(product, validatedLocale);
    }

    @Transactional
    public ProductResponse updateProduct(String slug, ProductResponse request, String locale) {
        String validatedLocale = LocaleValidator.validate(locale);
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (request.productType() != null) {
            try {
                product.setProductType(ProductType.valueOf(request.productType().toUpperCase()));
            } catch (IllegalArgumentException exception) {
                throw new BadRequestException("Invalid product type");
            }
        }
        if (request.slug() != null && !request.slug().isBlank()) {
            product.setSlug(request.slug());
        }
        if (request.name() != null) {
            product.setProductName(updateLocalizedValue(
                    product.getProductName(), validatedLocale, request.name()));
        }
        if (request.shortDescription() != null) {
            product.setShortDescription(updateLocalizedValue(
                    product.getShortDescription(), validatedLocale, request.shortDescription()));
        }
        if (request.shortAdvantage() != null) {
            product.setShortAdvantage(updateLocalizedValue(
                    product.getShortAdvantage(), validatedLocale, request.shortAdvantage()));
        }
        if (request.description() != null) {
            product.setDescription(updateLocalizedValue(
                    product.getDescription(), validatedLocale, request.description()));
        }
        if (request.guide() != null) {
            product.setGuide(updateLocalizedValue(
                    product.getGuide(), validatedLocale, request.guide()));
        }
        if (request.imageUrl() != null) {
            product.setImageUrl(request.imageUrl());
        }
        product.setMultipleVariant(request.multipleVariant());
        if (request.selectionName() != null) {
            product.setSelectionName(request.selectionName());
        }

        Product updated = productRepository.save(product);
        return mapToResponse(updated, validatedLocale);
    }

    private Map<String, Object> updateLocalizedValue(
            Map<String, Object> existing, String locale, Object value) {
        Map<String, Object> updated = existing == null
                ? new HashMap<>()
                : new HashMap<>(existing);
        updated.put(locale, value);
        return updated;
    }

    private void requireLocalizedObject(Map<String, Object> value, String fieldName) {
        if (value == null || !value.containsKey("en") || !value.containsKey("vi")) {
            throw new BadRequestException(
                    fieldName + " must contain both 'en' and 'vi' values");
        }
    }

    private ProductResponse mapToResponse(Product product, String locale) {
        return new ProductResponse(
                product.getProductId(),
                product.getSlug(),
                product.getProductType().name().toLowerCase(),
                localizedValue(product.getProductName(), locale),
                localizedValue(product.getShortDescription(), locale),
                localizedObject(product.getShortAdvantage(), locale),
                localizedValue(product.getDescription(), locale),
                localizedValue(product.getGuide(), locale),
                product.getImageUrl(),
                product.isMultipleVariant(),
                product.getSelectionName(),
                product.getModels().stream().map(this::mapModel).toList());
    }

    private ProductModelResponse mapModel(ProductModel model) {
        return new ProductModelResponse(
                model.getModelId(), model.getProductName(), model.getVariant());
    }

    private String localizedValue(Map<String, Object> values, String locale) {
        if (values == null) {
            return null;
        }
        Object value = values.getOrDefault(locale, values.get("vi"));
        return value == null ? null : String.valueOf(value);
    }

    private Object localizedObject(Map<String, Object> values, String locale) {
        if (values == null) {
            return null;
        }
        return values.getOrDefault(locale, values.get("vi"));
    }
}
