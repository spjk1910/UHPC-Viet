package com.hv.uhpcviet.uhpcviet_backend.product.repository;

import com.hv.uhpcviet.uhpcviet_backend.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("""
            SELECT DISTINCT p
            FROM Product p
            JOIN FETCH p.category c
            LEFT JOIN FETCH p.translations pt
            WHERE p.active = true
            ORDER BY p.sortOrder ASC, p.id ASC
            """)
    List<Product> findAllActiveWithTranslations();

    @Query("""
            SELECT DISTINCT p
            FROM Product p
            JOIN FETCH p.category c
            LEFT JOIN FETCH p.translations pt
            WHERE p.slug = :slug
              AND p.active = true
            """)
    Optional<Product> findActiveBySlugWithTranslations(
            @Param("slug") String slug
    );
}
