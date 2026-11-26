-- V1: Create the initial UHPCViet product module schema

CREATE TYPE product_type AS ENUM (
    'SPACER',
    'PANEL',
    'FURNITURE',
    'OTHER'
);

-- Validate localised JSONB objects
CREATE FUNCTION is_localised_jsonb(data JSONB)
RETURNS BOOLEAN
LANGUAGE SQL
IMMUTABLE
AS $$
    SELECT
        data IS NOT NULL
        AND jsonb_typeof(data) = 'object'
        AND data ? 'en'
        AND data ? 'vi';
$$;

CREATE TABLE products (
    product_id VARCHAR(100) PRIMARY KEY,
    product_type product_type NOT NULL,

    product_name JSONB NOT NULL,
    short_description JSONB NOT NULL,
    short_advantage JSONB NOT NULL,
    description JSONB NOT NULL,
    guide JSONB NOT NULL,

    image_url TEXT,
    slug VARCHAR(255) NOT NULL UNIQUE,

    multiple_variant BOOLEAN NOT NULL DEFAULT FALSE,
    selection_name JSONB,

    CONSTRAINT chk_products_product_name
        CHECK (is_localised_jsonb(product_name)),

    CONSTRAINT chk_products_short_description
        CHECK (is_localised_jsonb(short_description)),

    CONSTRAINT chk_products_short_advantage
        CHECK (is_localised_jsonb(short_advantage)),

    CONSTRAINT chk_products_description
        CHECK (is_localised_jsonb(description)),

    CONSTRAINT chk_products_guide
        CHECK (is_localised_jsonb(guide)),

    CONSTRAINT chk_product_selection_name
        CHECK (
            (multiple_variant = TRUE AND is_localised_jsonb(selection_name))
            OR
            (multiple_variant = FALSE AND selection_name IS NULL)
        )
);

CREATE TABLE product_models (
    model_id VARCHAR(100) PRIMARY KEY,
    product_id VARCHAR(100) NOT NULL,

    product_name JSONB NOT NULL,
    variant JSONB NOT NULL,

    CONSTRAINT fk_product_models_product
        FOREIGN KEY (product_id)
        REFERENCES products (product_id)
        ON DELETE CASCADE,

    CONSTRAINT chk_product_models_product_name
        CHECK (is_localised_jsonb(product_name)),

    CONSTRAINT chk_product_models_variant
        CHECK (is_localised_jsonb(variant))
);

CREATE INDEX idx_products_product_type
    ON products (product_type);

CREATE INDEX idx_product_models_product_id
    ON product_models (product_id);