package com.hv.uhpcviet.uhpcviet_backend.product.repository;

import com.hv.uhpcviet.uhpcviet_backend.product.entity.ProductTranslation;
import com.hv.uhpcviet.uhpcviet_backend.product.entity.ProductTranslationId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductTranslationRepository
        extends JpaRepository<ProductTranslation, ProductTranslationId> {

}