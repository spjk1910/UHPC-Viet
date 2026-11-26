package com.hv.uhpcviet.uhpcviet_backend.product.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.Map;

public record ProductCreateRequest(
        @NotBlank String productId,
        @NotBlank String slug,
        @NotBlank String productType,
        @NotNull Map<String, Object> productName,
        @NotNull Map<String, Object> shortDescription,
        @NotNull Map<String, Object> shortAdvantage,
        @NotNull Map<String, Object> description,
        @NotNull Map<String, Object> guide,
        String imageUrl,
        boolean multipleVariant,
        Map<String, Object> selectionName,
        List<@Valid ProductModelCreateRequest> models
) {
}
