package com.hv.uhpcviet.uhpcviet_backend.product.service;

import com.hv.uhpcviet.uhpcviet_backend.exception.BadRequestException;
import com.hv.uhpcviet.uhpcviet_backend.exception.ResourceNotFoundException;
import io.minio.BucketExistsArgs;
import io.minio.GetObjectArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.SetBucketPolicyArgs;
import io.minio.errors.ErrorResponseException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.OutputStream;
import java.net.URI;
import java.util.UUID;

@Service
public class ProductImageStorageService {

    private static final long MAX_IMAGE_SIZE_BYTES = 10L * 1024 * 1024;
    private static final String PRODUCT_IMAGE_PATH = "/api/products/images/";

    private final MinioClient adminClient;
    private final MinioClient uploadClient;
    private final String bucket;
    private final String publicUrl;
    private volatile boolean bucketInitialized;

    public ProductImageStorageService(
            @Value("${minio.endpoint}") String endpoint,
            @Value("${minio.admin-access-key}") String adminAccessKey,
            @Value("${minio.admin-secret-key}") String adminSecretKey,
            @Value("${minio.access-key}") String accessKey,
            @Value("${minio.secret-key}") String secretKey,
            @Value("${minio.bucket}") String bucket,
            @Value("${minio.public-url}") String publicUrl
    ) {
        this.adminClient = MinioClient.builder()
                .endpoint(endpoint)
                .credentials(adminAccessKey, adminSecretKey)
                .build();
        this.uploadClient = MinioClient.builder()
                .endpoint(endpoint)
                .credentials(accessKey, secretKey)
                .build();
        this.bucket = bucket;
        this.publicUrl = publicUrl.replaceAll("/+$", "");
    }

    public String store(MultipartFile image) {
        if (image == null || image.isEmpty()) {
            throw new BadRequestException("Image file is required");
        }
        if (image.getSize() > MAX_IMAGE_SIZE_BYTES) {
            throw new BadRequestException("Image must not exceed 10 MB");
        }

        try {
            byte[] imageBytes = image.getBytes();
            String extension = getImageExtension(image.getContentType(), imageBytes);
            String objectName = UUID.randomUUID() + extension;

            ensureBucket();
            uploadClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucket)
                            .object(objectName)
                            .stream(new ByteArrayInputStream(imageBytes), imageBytes.length, -1)
                            .contentType(image.getContentType())
                            .build());

            return PRODUCT_IMAGE_PATH + objectName;
        } catch (BadRequestException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to store product image in MinIO", exception);
        }
    }

    public String toPublicImagePath(String imageUrl) {
        String objectName = managedObjectName(imageUrl, publicUrl, bucket);
        return objectName == null ? imageUrl : PRODUCT_IMAGE_PATH + objectName;
    }

    public String getImageContentType(String objectName) {
        if (!isValidObjectName(objectName)) {
            throw new ResourceNotFoundException("Product image not found");
        }

        if (objectName.endsWith(".jpg")) {
            return "image/jpeg";
        }
        if (objectName.endsWith(".png")) {
            return "image/png";
        }
        return "image/webp";
    }

    public void copyImageTo(String objectName, OutputStream outputStream) {
        if (!isValidObjectName(objectName)) {
            throw new ResourceNotFoundException("Product image not found");
        }

        try (var image = adminClient.getObject(
                GetObjectArgs.builder()
                        .bucket(bucket)
                        .object(objectName)
                        .build())) {
            image.transferTo(outputStream);
        } catch (ErrorResponseException exception) {
            if ("NoSuchKey".equals(exception.errorResponse().code())) {
                throw new ResourceNotFoundException("Product image not found");
            }
            throw new IllegalStateException("Unable to read product image from MinIO", exception);
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to read product image from MinIO", exception);
        }
    }

    public void deleteIfManaged(String imageUrl) {
        String objectName = managedObjectName(imageUrl, publicUrl, bucket);
        if (objectName == null) {
            return;
        }

        try {
            adminClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucket)
                            .object(objectName)
                            .build());
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to delete product image from MinIO", exception);
        }
    }

    static String managedObjectName(String imageUrl, String publicUrl, String bucket) {
        if (imageUrl == null || imageUrl.isBlank()) {
            return null;
        }

        String objectName;
        if (imageUrl.startsWith(PRODUCT_IMAGE_PATH)) {
            objectName = imageUrl.substring(PRODUCT_IMAGE_PATH.length());
        } else {
            String prefix = publicUrl.replaceAll("/+$", "") + "/" + bucket + "/";
            if (imageUrl.startsWith(prefix)) {
                objectName = imageUrl.substring(prefix.length());
            } else {
                objectName = objectNameFromBucketUrl(imageUrl, bucket);
            }
        }

        return isValidObjectName(objectName) ? objectName : null;
    }

    private static String objectNameFromBucketUrl(String imageUrl, String bucket) {
        try {
            URI uri = URI.create(imageUrl);
            String scheme = uri.getScheme();
            if (uri.getHost() == null
                    || (!"http".equalsIgnoreCase(scheme) && !"https".equalsIgnoreCase(scheme))) {
                return null;
            }

            String bucketPath = "/" + bucket + "/";
            String path = uri.getPath();
            int bucketIndex = path == null ? -1 : path.lastIndexOf(bucketPath);
            return bucketIndex < 0
                    ? null
                    : path.substring(bucketIndex + bucketPath.length());
        } catch (IllegalArgumentException exception) {
            return null;
        }
    }

    private static boolean isValidObjectName(String objectName) {
        if (objectName == null || objectName.isBlank()) {
            return false;
        }

        int extensionIndex = objectName.lastIndexOf('.');
        if (extensionIndex < 0 || objectName.indexOf('/', extensionIndex) >= 0
                || objectName.indexOf('\\', extensionIndex) >= 0) {
            return false;
        }

        String extension = objectName.substring(extensionIndex);
        if (!extension.equals(".jpg") && !extension.equals(".png") && !extension.equals(".webp")) {
            return false;
        }

        String uuid = objectName.substring(0, extensionIndex);
        try {
            return UUID.fromString(uuid).toString().equals(uuid);
        } catch (IllegalArgumentException exception) {
            return false;
        }
    }

    private String getImageExtension(String contentType, byte[] bytes) {
        if ("image/jpeg".equalsIgnoreCase(contentType)
                && hasPrefix(bytes, 0xFF, 0xD8, 0xFF)) {
            return ".jpg";
        }
        if ("image/png".equalsIgnoreCase(contentType)
                && hasPrefix(bytes, 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A)) {
            return ".png";
        }
        if ("image/webp".equalsIgnoreCase(contentType)
                && hasAsciiAt(bytes, 0, "RIFF")
                && hasAsciiAt(bytes, 8, "WEBP")) {
            return ".webp";
        }
        throw new BadRequestException("Only JPEG, PNG, and WebP images are supported");
    }

    private void ensureBucket() throws Exception {
        if (bucketInitialized) {
            return;
        }

        synchronized (this) {
            if (bucketInitialized) {
                return;
            }

            boolean exists = adminClient.bucketExists(
                    BucketExistsArgs.builder().bucket(bucket).build());
            if (!exists) {
                adminClient.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
            }
            adminClient.setBucketPolicy(
                    SetBucketPolicyArgs.builder()
                            .bucket(bucket)
                            .config(publicReadPolicy())
                            .build());
            bucketInitialized = true;
        }
    }

    private String publicReadPolicy() {
        return """
                {
                  "Version": "2012-10-17",
                  "Statement": [{
                    "Effect": "Allow",
                    "Principal": {"AWS": ["*"]},
                    "Action": ["s3:GetObject"],
                    "Resource": ["arn:aws:s3:::%s/*"]
                  }]
                }
                """.formatted(bucket);
    }

    private boolean hasPrefix(byte[] bytes, int... signature) {
        if (bytes.length < signature.length) {
            return false;
        }
        for (int index = 0; index < signature.length; index++) {
            if ((bytes[index] & 0xFF) != signature[index]) {
                return false;
            }
        }
        return true;
    }

    private boolean hasAsciiAt(byte[] bytes, int offset, String value) {
        if (bytes.length < offset + value.length()) {
            return false;
        }
        for (int index = 0; index < value.length(); index++) {
            if (bytes[offset + index] != value.charAt(index)) {
                return false;
            }
        }
        return true;
    }
}
