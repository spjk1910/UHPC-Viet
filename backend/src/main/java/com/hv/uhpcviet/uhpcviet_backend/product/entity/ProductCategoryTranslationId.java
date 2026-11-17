package com.hv.uhpcviet.uhpcviet_backend.product.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.Pattern;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ProductCategoryTranslationId implements Serializable {

    private static final long serialVersionUID = 1L;

    @Column(name = "category_id", nullable = false)
    private Long categoryId;

    @Column(name = "locale", nullable = false, length = 5)
    @Pattern(regexp = "en|vi")
    private String locale;

    public ProductCategoryTranslationId() {
    }

    public ProductCategoryTranslationId(Long categoryId, String locale) {
        this.categoryId = categoryId;
        this.locale = locale;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
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
        if (!(o instanceof ProductCategoryTranslationId that)) return false;
        return Objects.equals(categoryId, that.categoryId)
                && Objects.equals(locale, that.locale);
    }

    @Override
    public int hashCode() {
        return Objects.hash(categoryId, locale);
    }
}
