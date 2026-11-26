package com.hv.uhpcviet.uhpcviet_backend.product.dto;

import java.util.Map;

public record AdminProductModelResponse(
        String modelId,
        Map<String, Object> productName,
        Map<String, Object> variant
) {
}
