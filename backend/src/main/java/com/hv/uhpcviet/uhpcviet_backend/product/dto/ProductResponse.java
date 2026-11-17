package com.hv.uhpcviet.uhpcviet_backend.product.dto;

public record ProductResponse(
        Long id,
        String slug,
        String name,
        String description,
        String imageUrl,
        String categorySlug,
        String categoryName
) {
}