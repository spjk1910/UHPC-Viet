UPDATE product_translations
SET name = 'Viên kê bê tông C150',
    description = 'Chiều dày lớp bảo vệ (65mm); Đường kính tối đa của cốt thép (18mm); Lực nén vỡ tối thiểu (- kgf); Đóng gói (25 viên/bao)'
WHERE product_id = (
    SELECT id
    FROM products
    WHERE slug = 'uhpc-spacer'
)
AND locale = 'vi';

UPDATE product_translations
SET name = 'C150 Concrete Spacer',
    description = 'Concrete cover thickness (65 mm); Maximum reinforcement bar diameter (18 mm); Minimum crushing load (- kgf); Packaging (25 pieces/bag)'
WHERE product_id = (
    SELECT id
    FROM products
    WHERE slug = 'uhpc-spacer'
)
AND locale = 'en';
