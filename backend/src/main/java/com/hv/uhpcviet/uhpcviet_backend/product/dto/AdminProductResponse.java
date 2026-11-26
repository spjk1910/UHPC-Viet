package com.hv.uhpcviet.uhpcviet_backend.product.dto;

import java.util.List;
import java.util.Map;

public record AdminProductResponse(
        String productId,
        String slug,
        String productType,
        Map<String, Object> productName,
        Map<String, Object> shortDescription,
        Map<String, Object> shortAdvantage,
        Map<String, Object> description,
        Map<String, Object> guide,
        String imageUrl,
        boolean multipleVariant,
        Map<String, Object> selectionName,
        List<AdminProductModelResponse> models
) {
}
