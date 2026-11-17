package com.hv.uhpcviet.uhpcviet_backend.product.repository;

import com.hv.uhpcviet.uhpcviet_backend.product.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProductCategoryRepository
        extends JpaRepository<ProductCategory, Long> {

    @Query("""
            SELECT DISTINCT c
            FROM ProductCategory c
            LEFT JOIN FETCH c.translations
            WHERE c.active = true
            ORDER BY c.sortOrder ASC, c.id ASC
            """)
    List<ProductCategory> findAllActiveWithTranslations();

    @Query("""
            SELECT DISTINCT c
            FROM ProductCategory c
            LEFT JOIN FETCH c.translations
            LEFT JOIN FETCH c.products p
            WHERE c.slug = :slug
              AND c.active = true
            """)
    Optional<ProductCategory> findActiveBySlugWithProducts(
            String slug
    );
}