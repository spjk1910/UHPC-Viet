package com.hv.uhpcviet.uhpcviet_backend.product.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class ProductImageStorageServiceTest {

    private static final String PUBLIC_URL = "http://localhost:9000";
    private static final String BUCKET = "uhpcviet-products";

    @Test
    void extractsAppGeneratedImageObjectFromManagedBucketUrl() {
        String objectName = "9c02fb93-c9f0-49d5-b7a5-04c1248c2c75.webp";
        String imageUrl = PUBLIC_URL + "/" + BUCKET + "/" + objectName;

        assertEquals(
                objectName,
                ProductImageStorageService.managedObjectName(imageUrl, PUBLIC_URL, BUCKET));
    }

    @Test
    void refusesToDeleteImagesOutsideConfiguredBucket() {
        assertNull(ProductImageStorageService.managedObjectName(
                "https://images.example.com/product.png", PUBLIC_URL, BUCKET));
        assertNull(ProductImageStorageService.managedObjectName(
                PUBLIC_URL + "/another-bucket/9c02fb93-c9f0-49d5-b7a5-04c1248c2c75.webp",
                PUBLIC_URL,
                BUCKET));
    }

    @Test
    void refusesMalformedObjectNames() {
        assertNull(ProductImageStorageService.managedObjectName(
                PUBLIC_URL + "/" + BUCKET + "/../product.webp", PUBLIC_URL, BUCKET));
    }
}
