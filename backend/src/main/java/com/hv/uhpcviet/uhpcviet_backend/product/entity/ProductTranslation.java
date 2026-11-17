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
@Table(name = "product_translations")
public class ProductTranslation {

    @EmbeddedId
    private ProductTranslationId id;

    @MapsId("productId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    public ProductTranslation() {
    }

    public ProductTranslation(Product product, String locale, String name, String description) {
        this.product = product;
        this.id = new ProductTranslationId(null, locale);
        this.name = name;
        this.description = description;
    }

    public ProductTranslationId getId() {
        return id;
    }

    public void setId(ProductTranslationId id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocale() {
        return id != null ? id.getLocale() : null;
    }
}
