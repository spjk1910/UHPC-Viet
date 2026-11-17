package com.hv.uhpcviet.uhpcviet_backend.product.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.Pattern;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ProductTranslationId implements Serializable {

    private static final long serialVersionUID = 1L;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "locale", nullable = false, length = 5)
    @Pattern(regexp = "en|vi")
    private String locale;

    public ProductTranslationId() {
    }

    public ProductTranslationId(Long productId, String locale) {
        this.productId = productId;
        this.locale = locale;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getLocale() {
        return locale;
    }

    public void setLocale(String locale) {
        this.locale = locale;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProductTranslationId that)) return false;
        return Objects.equals(productId, that.productId)
                && Objects.equals(locale, that.locale);
    }

    @Override
    public int hashCode() {
        return Objects.hash(productId, locale);
    }
}
