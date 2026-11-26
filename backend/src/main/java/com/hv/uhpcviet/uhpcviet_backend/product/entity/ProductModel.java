package com.hv.uhpcviet.uhpcviet_backend.product.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;

@Entity
@Table(name = "product_models")
public class ProductModel {

    @Id
    @Column(name = "model_id", length = 100)
    private String modelId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "product_name", nullable = false, columnDefinition = "jsonb")
    private Map<String, Object> productName;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "variant", nullable = false, columnDefinition = "jsonb")
    private Map<String, Object> variant;

    protected ProductModel() {
    }

    public ProductModel(
            String modelId,
            Product product,
            Map<String, Object> productName,
            Map<String, Object> variant
    ) {
        this.modelId = modelId;
        this.product = product;
        this.productName = productName;
        this.variant = variant;
    }

    public String getModelId() {
        return modelId;
    }

    public Map<String, Object> getProductName() {
        return productName;
    }

    public Map<String, Object> getVariant() {
        return variant;
    }

    public void setProductName(Map<String, Object> productName) {
        this.productName = productName;
    }

    public void setVariant(Map<String, Object> variant) {
        this.variant = variant;
    }
}
