-- Initial draft product catalog based on the requested catalogue groups.

INSERT INTO product_categories (slug, sort_order)
VALUES
    ('spacers', 10),
    ('panels', 20),
    ('furniture', 30),
    ('others', 40);

INSERT INTO product_category_translations (category_id, locale, name)
SELECT id, 'en', names.name
FROM product_categories
JOIN (
    VALUES
        ('spacers', 'Spacers'),
        ('panels', 'Panels'),
        ('furniture', 'Furniture'),
        ('others', 'Others')
) AS names(slug, name) USING (slug);

INSERT INTO product_category_translations (category_id, locale, name)
SELECT id, 'vi', names.name
FROM product_categories
JOIN (
    VALUES
        ('spacers', 'Con kê'),
        ('panels', 'Tấm panel'),
        ('furniture', 'Nội thất'),
        ('others', 'Sản phẩm khác')
) AS names(slug, name) USING (slug);

INSERT INTO products (category_id, slug, sort_order)
SELECT category_id, slug, sort_order
FROM (
    SELECT id AS category_id, 'uhpc-spacer' AS slug, 10 AS sort_order
    FROM product_categories
    WHERE product_categories.slug = 'spacers'

    UNION ALL

    SELECT id, 'uhpc-panel', 10
    FROM product_categories
    WHERE product_categories.slug = 'panels'

    UNION ALL

    SELECT id, 'uhpc-furniture', 10
    FROM product_categories
    WHERE product_categories.slug = 'furniture'

    UNION ALL

    SELECT id, 'uhpc-other-product', 10
    FROM product_categories
    WHERE product_categories.slug = 'others'
) AS products_to_seed;

INSERT INTO product_translations (product_id, locale, name, description)
SELECT id, 'en', names.name, names.description
FROM products
JOIN (
    VALUES
        (
            'uhpc-spacer',
            'UHPC Spacer',
            'A high-strength UHPC spacer designed to maintain consistent concrete cover and durable reinforcement placement.'
        ),
        (
            'uhpc-panel',
            'UHPC Panel',
            'A durable architectural panel for facades, feature walls, and refined exterior details.'
        ),
        (
            'uhpc-furniture',
            'UHPC Furniture',
            'Durable UHPC furniture with a clean, modern form for indoor and outdoor spaces.'
        ),
        (
            'uhpc-other-product',
            'UHPC Other Product',
            'A versatile UHPC product for projects that require high strength, durability, and a refined finish.'
        )
) AS names(slug, name, description) USING (slug);

INSERT INTO product_translations (product_id, locale, name, description)
SELECT id, 'vi', names.name, names.description
FROM products
JOIN (
    VALUES
        (
            'uhpc-spacer',
            'Con kê UHPC',
            'Con kê UHPC cường độ cao giúp duy trì lớp bê tông bảo vệ đồng đều và cố định cốt thép bền vững.'
        ),
        (
            'uhpc-panel',
            'Tấm panel UHPC',
            'Tấm panel kiến trúc bền chắc cho mặt dựng, tường điểm nhấn và các chi tiết ngoại thất.'
        ),
        (
            'uhpc-furniture',
            'Nội thất UHPC',
            'Sản phẩm nội thất UHPC bền chắc với kiểu dáng hiện đại cho không gian trong nhà và ngoài trời.'
        ),
        (
            'uhpc-other-product',
            'Sản phẩm UHPC khác',
            'Sản phẩm UHPC đa dụng cho các dự án yêu cầu cường độ cao, độ bền và bề mặt hoàn thiện tinh tế.'
        )
) AS names(slug, name, description) USING (slug);
