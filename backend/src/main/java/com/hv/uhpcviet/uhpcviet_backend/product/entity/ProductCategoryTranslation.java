package com.hv.uhpcviet.uhpcviet_backend.product.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

@Entity
@Table(name = "product_category_translations")
public class ProductCategoryTranslation {

    @EmbeddedId
    private ProductCategoryTranslationId id;

    @MapsId("categoryId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private ProductCategory category;

    @Column(nullable = false)
    private String name;

    public ProductCategoryTranslation() {
    }

    public ProductCategoryTranslation(ProductCategory category, String locale, String name) {
        this.category = category;
        this.id = new ProductCategoryTranslationId(null, locale);
        this.name = name;
    }

    public ProductCategoryTranslationId getId() {
        return id;
    }

    public void setId(ProductCategoryTranslationId id) {
        this.id = id;
    }

    public ProductCategory getCategory() {
        return category;
    }

    public void setCategory(ProductCategory category) {
        this.category = category;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocale() {
        return id != null ? id.getLocale() : null;
    }
}
