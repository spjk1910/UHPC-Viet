package com.hv.uhpcviet.uhpcviet_backend.product.repository;

import com.hv.uhpcviet.uhpcviet_backend.product.entity.ProductCategoryTranslation;
import com.hv.uhpcviet.uhpcviet_backend.product.entity.ProductCategoryTranslationId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductCategoryTranslationRepository
        extends JpaRepository<ProductCategoryTranslation, ProductCategoryTranslationId> {

}