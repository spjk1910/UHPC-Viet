package com.hv.uhpcviet.uhpcviet_backend.product.service;

import com.hv.uhpcviet.uhpcviet_backend.exception.BadRequestException;

import java.util.Set;

public final class LocaleValidator {

    private static final Set<String> SUPPORTED_LOCALES = Set.of("en", "vi");

    private LocaleValidator() {
    }

    public static String validate(String locale) {
        if (locale == null || !SUPPORTED_LOCALES.contains(locale)) {
            throw new BadRequestException(
                    "Unsupported locale. Supported locales are: en, vi"
            );
        }

        return locale;
    }
}