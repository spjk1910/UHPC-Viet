package com.hv.uhpcviet.uhpcviet_backend.product.controller;

import com.hv.uhpcviet.uhpcviet_backend.product.dto.CategoryResponse;
import com.hv.uhpcviet.uhpcviet_backend.product.service.CategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<CategoryResponse> getAllCategories(
            @RequestParam(defaultValue = "en") String locale
    ) {
        return categoryService.getAllCategories(locale);
    }
}