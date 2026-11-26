package com.hv.uhpcviet.uhpcviet_backend.product.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Map;

public record ProductModelCreateRequest(
        @NotBlank String modelId,
        @NotNull Map<String, Object> productName,
        @NotNull Map<String, Object> variant
) {
}
