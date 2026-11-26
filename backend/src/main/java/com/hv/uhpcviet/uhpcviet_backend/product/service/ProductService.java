package com.hv.uhpcviet.uhpcviet_backend.product.service;

import com.hv.uhpcviet.uhpcviet_backend.exception.ResourceNotFoundException;
import com.hv.uhpcviet.uhpcviet_backend.exception.BadRequestException;
import com.hv.uhpcviet.uhpcviet_backend.exception.ResourceConflictException;
import com.hv.uhpcviet.uhpcviet_backend.product.dto.ProductCreateRequest;
import com.hv.uhpcviet.uhpcviet_backend.product.dto.AdminProductModelResponse;
import com.hv.uhpcviet.uhpcviet_backend.product.dto.AdminProductResponse;
import com.hv.uhpcviet.uhpcviet_backend.product.dto.ProductModelCreateRequest;
import com.hv.uhpcviet.uhpcviet_backend.product.dto.ProductModelResponse;
import com.hv.uhpcviet.uhpcviet_backend.product.dto.ProductResponse;
import com.hv.uhpcviet.uhpcviet_backend.product.entity.Product;
import com.hv.uhpcviet.uhpcviet_backend.product.entity.ProductModel;
import com.hv.uhpcviet.uhpcviet_backend.product.entity.ProductType;
import com.hv.uhpcviet.uhpcviet_backend.product.repository.ProductRepository;
import jakarta.persistence.EntityManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

@Service
public class ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

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
    public List<AdminProductResponse> getAllAdminProducts() {
        return productRepository.findAllByOrderByProductIdAsc().stream()
                .map(this::mapToAdminResponse)
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

        String previousImageUrl = product.getImageUrl();
        String newImageUrl = productImageStorageService.store(image);
        product.setImageUrl(newImageUrl);
        scheduleImageReplacementCleanup(previousImageUrl, newImageUrl, product.getProductId());
        Product updated = productRepository.save(product);
        return mapToResponse(updated, validatedLocale);
    }

    @Transactional
    public ProductResponse createProduct(ProductCreateRequest request, String locale) {
        String validatedLocale = LocaleValidator.validate(locale);
        validateProductRequest(request);
        if (productRepository.existsById(request.productId())) {
            throw new ResourceConflictException("Product ID already exists");
        }
        if (productRepository.existsBySlug(request.slug())) {
            throw new ResourceConflictException("Product slug already exists");
        }

        ProductType productType = parseProductType(request.productType());

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

        replaceModels(product, request.models());

        entityManager.persist(product);
        return mapToResponse(product, validatedLocale);
    }

    @Transactional
    public ProductResponse updateProduct(
            String slug,
            ProductCreateRequest request,
            String locale
    ) {
        String validatedLocale = LocaleValidator.validate(locale);
        validateProductRequest(request);
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!product.getProductId().equals(request.productId())) {
            throw new BadRequestException("productId cannot be changed");
        }
        if (productRepository.existsBySlugAndProductIdNot(request.slug(), product.getProductId())) {
            throw new ResourceConflictException("Product slug already exists");
        }
        ProductType productType = parseProductType(request.productType());
        product.setProductType(productType);
        product.setSlug(request.slug());
        product.setProductName(request.productName());
        product.setShortDescription(request.shortDescription());
        product.setShortAdvantage(request.shortAdvantage());
        product.setDescription(request.description());
        product.setGuide(request.guide());
        String previousImageUrl = product.getImageUrl();
        product.setImageUrl(request.imageUrl());
        product.setMultipleVariant(request.multipleVariant());
        product.setSelectionName(request.selectionName());
        replaceModels(product, request.models());

        Product updated = productRepository.save(product);
        if (!Objects.equals(previousImageUrl, updated.getImageUrl())) {
            scheduleImageCleanupAfterCommit(previousImageUrl, updated.getProductId());
        }
        return mapToResponse(updated, validatedLocale);
    }

    @Transactional
    public void deleteProduct(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        productRepository.delete(product);
        scheduleImageCleanupAfterCommit(product.getImageUrl(), product.getProductId());
    }

    private void scheduleImageReplacementCleanup(
            String previousImageUrl,
            String newImageUrl,
            String productId
    ) {
        boolean previousImageIsShared = previousImageUrl != null
                && productRepository.existsByImageUrlAndProductIdNot(previousImageUrl, productId);

        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                if (previousImageUrl != null && !previousImageIsShared) {
                    cleanupImage(previousImageUrl, productId);
                }
            }

            @Override
            public void afterCompletion(int status) {
                if (status == STATUS_ROLLED_BACK) {
                    cleanupImage(newImageUrl, productId);
                }
            }
        });
    }

    private void scheduleImageCleanupAfterCommit(String imageUrl, String productId) {
        if (imageUrl == null
                || productRepository.existsByImageUrlAndProductIdNot(imageUrl, productId)) {
            return;
        }

        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                cleanupImage(imageUrl, productId);
            }
        });
    }

    private void cleanupImage(String imageUrl, String productId) {
        try {
            productImageStorageService.deleteIfManaged(imageUrl);
        } catch (IllegalStateException exception) {
            logger.error("Could not clean up stored image for product {}", productId, exception);
        }
    }

    private void requireLocalizedObject(Map<String, Object> value, String fieldName) {
        if (value == null || !value.containsKey("en") || !value.containsKey("vi")) {
            throw new BadRequestException(
                    fieldName + " must contain both 'en' and 'vi' values");
        }
    }

    private void validateProductRequest(ProductCreateRequest request) {
        parseProductType(request.productType());
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

        Set<String> modelIds = new HashSet<>();
        if (request.models() != null) {
            for (ProductModelCreateRequest model : request.models()) {
                if (!modelIds.add(model.modelId())) {
                    throw new BadRequestException("Duplicate model ID: " + model.modelId());
                }
                requireLocalizedObject(model.productName(), "model productName");
                requireLocalizedObject(model.variant(), "model variant");
            }
        }
    }

    private ProductType parseProductType(String productType) {
        try {
            return ProductType.valueOf(productType.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            throw new BadRequestException("Invalid product type");
        }
    }

    private void replaceModels(Product product, List<ProductModelCreateRequest> requests) {
        Map<String, ProductModel> existingModels = new HashMap<>();
        product.getModels().forEach(model -> existingModels.put(model.getModelId(), model));

        List<ProductModel> replacement = requests == null ? List.of() : requests.stream()
                .map(request -> {
                    ProductModel existing = existingModels.get(request.modelId());
                    if (existing == null) {
                        return new ProductModel(
                                request.modelId(), product, request.productName(), request.variant());
                    }
                    existing.setProductName(request.productName());
                    existing.setVariant(request.variant());
                    return existing;
                })
                .toList();
        product.replaceModels(replacement);
    }

    private AdminProductResponse mapToAdminResponse(Product product) {
        return new AdminProductResponse(
                product.getProductId(),
                product.getSlug(),
                product.getProductType().name().toLowerCase(Locale.ROOT),
                product.getProductName(),
                product.getShortDescription(),
                product.getShortAdvantage(),
                product.getDescription(),
                product.getGuide(),
                productImageStorageService.toPublicImagePath(product.getImageUrl()),
                product.isMultipleVariant(),
                product.getSelectionName(),
                product.getModels().stream()
                        .map(model -> new AdminProductModelResponse(
                                model.getModelId(), model.getProductName(), model.getVariant()))
                        .toList());
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
                productImageStorageService.toPublicImagePath(product.getImageUrl()),
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
