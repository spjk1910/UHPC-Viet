package com.hv.uhpcviet.uhpcviet_backend.product.dto;

import java.util.List;
import java.util.Map;

public record ProductResponse(
        String productId,
        String slug,
        String productType,
        String name,
        String shortDescription,
        Object shortAdvantage,
        String description,
        String guide,
        String imageUrl,
        boolean multipleVariant,
        Map<String, Object> selectionName,
        List<ProductModelResponse> models
) {
}
