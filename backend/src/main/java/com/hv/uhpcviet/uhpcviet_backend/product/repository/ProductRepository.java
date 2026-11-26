package com.hv.uhpcviet.uhpcviet_backend.product.repository;

import com.hv.uhpcviet.uhpcviet_backend.product.entity.Product;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, String> {

    @EntityGraph(attributePaths = "models")
    List<Product> findAllByOrderByProductIdAsc();

    @EntityGraph(attributePaths = "models")
    Optional<Product> findBySlug(String slug);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndProductIdNot(String slug, String productId);

    boolean existsByImageUrlAndProductIdNot(String imageUrl, String productId);
}
