package com.hv.uhpcviet.uhpcviet_backend.product.entity;

import jakarta.persistence.Column;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @Column(name = "product_id", length = 100)
    private String productId;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "product_type", nullable = false)
    private ProductType productType;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "product_name", nullable = false, columnDefinition = "jsonb")
    private Map<String, Object> productName;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "short_description", nullable = false, columnDefinition = "jsonb")
    private Map<String, Object> shortDescription;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "short_advantage", nullable = false, columnDefinition = "jsonb")
    private Map<String, Object> shortAdvantage;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "description", nullable = false, columnDefinition = "jsonb")
    private Map<String, Object> description;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "guide", nullable = false, columnDefinition = "jsonb")
    private Map<String, Object> guide;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "multiple_variant", nullable = false)
    private boolean multipleVariant;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "selection_name", columnDefinition = "jsonb")
    private Map<String, Object> selectionName;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductModel> models = new ArrayList<>();

    protected Product() {
    }

    public Product(
            String productId,
            ProductType productType,
            Map<String, Object> productName,
            Map<String, Object> shortDescription,
            Map<String, Object> shortAdvantage,
            Map<String, Object> description,
            Map<String, Object> guide,
            String imageUrl,
            String slug,
            boolean multipleVariant,
            Map<String, Object> selectionName
    ) {
        this.productId = productId;
        this.productType = productType;
        this.productName = productName;
        this.shortDescription = shortDescription;
        this.shortAdvantage = shortAdvantage;
        this.description = description;
        this.guide = guide;
        this.imageUrl = imageUrl;
        this.slug = slug;
        this.multipleVariant = multipleVariant;
        this.selectionName = selectionName;
    }

    public String getProductId() {
        return productId;
    }

    public ProductType getProductType() {
        return productType;
    }

    public Map<String, Object> getProductName() {
        return productName;
    }

    public Map<String, Object> getShortDescription() {
        return shortDescription;
    }

    public Map<String, Object> getShortAdvantage() {
        return shortAdvantage;
    }

    public Map<String, Object> getDescription() {
        return description;
    }

    public Map<String, Object> getGuide() {
        return guide;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getSlug() {
        return slug;
    }

    public boolean isMultipleVariant() {
        return multipleVariant;
    }

    public Map<String, Object> getSelectionName() {
        return selectionName;
    }

    public List<ProductModel> getModels() {
        return models;
    }

    public void addModel(ProductModel model) {
        models.add(model);
    }

    public void replaceModels(List<ProductModel> replacement) {
        models.clear();
        models.addAll(replacement);
    }

    public void setProductType(ProductType productType) {
        this.productType = productType;
    }

    public void setProductName(Map<String, Object> productName) {
        this.productName = productName;
    }

    public void setShortDescription(Map<String, Object> shortDescription) {
        this.shortDescription = shortDescription;
    }

    public void setShortAdvantage(Map<String, Object> shortAdvantage) {
        this.shortAdvantage = shortAdvantage;
    }

    public void setDescription(Map<String, Object> description) {
        this.description = description;
    }

    public void setGuide(Map<String, Object> guide) {
        this.guide = guide;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public void setMultipleVariant(boolean multipleVariant) {
        this.multipleVariant = multipleVariant;
    }

    public void setSelectionName(Map<String, Object> selectionName) {
        this.selectionName = selectionName;
    }
}
