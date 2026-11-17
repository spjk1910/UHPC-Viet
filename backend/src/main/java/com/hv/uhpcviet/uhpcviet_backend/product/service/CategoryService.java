package com.hv.uhpcviet.uhpcviet_backend.product.service;

import com.hv.uhpcviet.uhpcviet_backend.product.dto.CategoryResponse;
import com.hv.uhpcviet.uhpcviet_backend.product.entity.ProductCategory;
import com.hv.uhpcviet.uhpcviet_backend.product.entity.ProductCategoryTranslation;
import com.hv.uhpcviet.uhpcviet_backend.product.repository.ProductCategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final ProductCategoryRepository categoryRepository;

    public CategoryService(ProductCategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryResponse> getAllCategories(String locale) {
        final String validatedLocale = LocaleValidator.validate(locale);

        return categoryRepository.findAllActiveWithTranslations()
                .stream()
                .map(category -> mapToResponse(category, validatedLocale))
                .toList();
    }

    private CategoryResponse mapToResponse(ProductCategory category, String locale) {
        ProductCategoryTranslation translation = category.getTranslations()
                .stream()
                .filter(item -> locale.equals(item.getLocale()))
                .findFirst()
                .orElse(null);

        return new CategoryResponse(
                category.getId(),
                category.getSlug(),
                translation != null ? translation.getName() : null);
    }
}