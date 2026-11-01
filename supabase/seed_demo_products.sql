-- Demo product catalog for GENTLEMAN — run once in the Supabase SQL Editor
-- on the "gentleman" project (grrhoshvmkaiacsalpwd). Safe to re-run: it only
-- inserts, nothing is deleted or updated. frontimg/backimg are left NULL so
-- every product shows the new neutral placeholder until real photos are
-- uploaded via /admin-upload.

insert into public.products (name, price, category, sub_category, sizes, colors, description, material) values

-- Shirts
('Oxford Dress Shirt', 4500, 'Shirts', 'Formal Shirts',
 '["S","M","L","XL","XXL"]',
 '[{"name":"White","hex":"#F5F5F0"},{"name":"Sky Blue","hex":"#A8C5D6"}]',
 'Crisp Oxford cotton, cut for a clean line under a blazer. Mother-of-pearl buttons, single-needle stitching throughout.',
 '100% Oxford Cotton'),

('Point-Collar Formal Shirt', 4800, 'Shirts', 'Formal Shirts',
 '["S","M","L","XL","XXL"]',
 '[{"name":"White","hex":"#F5F5F0"},{"name":"Light Blue","hex":"#A8C5D6"}]',
 'Two-ply cotton poplin, finished with a point collar built to hold its shape under a tie all day.',
 'Cotton Poplin'),

('Linen Resort Shirt', 3800, 'Shirts', 'Casual Shirts',
 '["S","M","L","XL"]',
 '[{"name":"Sand","hex":"#D9C7A3"},{"name":"Olive","hex":"#6B7352"}]',
 'Lightweight linen-cotton blend, breathes easy in the Nairobi heat without losing its shape.',
 'Linen-Cotton Blend'),

('Brushed Flannel Shirt', 4200, 'Shirts', 'Casual Shirts',
 '["S","M","L","XL"]',
 '[{"name":"Charcoal Check","hex":"#3A3A3A"},{"name":"Burgundy Check","hex":"#6B2737"}]',
 'Brushed cotton flannel, soft from the first wash. A reliable layer through the cooler months.',
 'Brushed Cotton Flannel'),

('Essential Crew Tee', 2200, 'Shirts', 'T-Shirts',
 '["S","M","L","XL","XXL"]',
 '[{"name":"Black","hex":"#1A1A1A"},{"name":"Charcoal","hex":"#3A3A3A"},{"name":"White","hex":"#F5F5F0"}]',
 'Heavyweight combed cotton, garment-dyed for a worn-in feel from the first wear.',
 'Combed Cotton'),

('Piqué Polo', 3200, 'Shirts', 'Polos',
 '["S","M","L","XL"]',
 '[{"name":"Navy","hex":"#1F2A44"},{"name":"Burgundy","hex":"#6B2737"}]',
 'Classic piqué knit with a two-button placket, tailored close through the body.',
 'Cotton Piqué'),

-- Trousers
('Tailored Chinos', 5200, 'Trousers', 'Chinos',
 '["28","30","32","34","36","38"]',
 '[{"name":"Khaki","hex":"#C2A878"},{"name":"Navy","hex":"#1F2A44"},{"name":"Charcoal","hex":"#3A3A3A"}]',
 'Straight through the hip, tapered to the ankle. Considered construction, built to last.',
 'Stretch Cotton Twill'),

('Five-Pocket Twill Trouser', 4800, 'Trousers', 'Chinos',
 '["28","30","32","34","36"]',
 '[{"name":"Stone","hex":"#C2A878"},{"name":"Black","hex":"#1A1A1A"}]',
 'A five-pocket cut in the same cotton twill as our chinos, built for days that move between desk and street.',
 'Cotton Twill'),

('Slim Selvedge Jeans', 6500, 'Trousers', 'Jeans',
 '["28","30","32","34","36"]',
 '[{"name":"Indigo","hex":"#2C3E50"}]',
 'Japanese-inspired selvedge denim, slim through the leg without restricting movement.',
 '14oz Selvedge Denim'),

('Wool-Blend Formal Trouser', 7800, 'Trousers', 'Formal Trousers',
 '["30","32","34","36","38","40"]',
 '[{"name":"Charcoal","hex":"#3A3A3A"},{"name":"Navy","hex":"#1F2A44"}]',
 'Half-lined wool blend with a clean flat front — the trouser half of the house suit.',
 'Wool-Polyester Blend'),

('Pleated Formal Trouser', 7200, 'Trousers', 'Formal Trousers',
 '["32","34","36","38","40"]',
 '[{"name":"Charcoal","hex":"#3A3A3A"}]',
 'A double-pleat front for room through the thigh, tapering to a clean break at the ankle.',
 'Wool-Polyester Blend'),

('Tailored Walk Shorts', 3600, 'Trousers', 'Shorts',
 '["30","32","34","36","38"]',
 '[{"name":"Khaki","hex":"#C2A878"},{"name":"Navy","hex":"#1F2A44"}]',
 'Chino-weight shorts, finished just above the knee for warm-weather tailoring.',
 'Cotton Twill'),

-- Outerwear
('The House Suit', 32000, 'Outerwear', 'Suits',
 '["38","40","42"]',
 '[{"name":"Charcoal","hex":"#3A3A3A"},{"name":"Navy","hex":"#1F2A44"}]',
 'Our signature two-piece, hand-finished at our Nairobi atelier. Half-canvassed for structure that moves with you.',
 'Super 120s Wool'),

('Waxed Field Jacket', 14500, 'Outerwear', 'Jackets',
 '["S","M","L","XL"]',
 '[{"name":"Olive","hex":"#6B7352"},{"name":"Black","hex":"#1A1A1A"}]',
 'Waxed cotton shell, cut generous enough to layer over a sweater through Nairobi''s cooler months.',
 'Waxed Cotton'),

('Unstructured Blazer', 16800, 'Outerwear', 'Blazers',
 '["38","40","42","44"]',
 '[{"name":"Navy","hex":"#1F2A44"},{"name":"Tan","hex":"#B89B6E"}]',
 'Soft-shouldered and half-lined, dresses up a pair of chinos without feeling formal.',
 'Wool-Linen Blend'),

('Wool Overcoat', 22000, 'Outerwear', 'Coats',
 '["M","L","XL"]',
 '[{"name":"Camel","hex":"#B5894D"},{"name":"Charcoal","hex":"#3A3A3A"}]',
 'Full-length wool overcoat, cut & sewn in Nairobi. A single piece built to outlast a few seasons of trends.',
 'Wool Melton'),

('Heavyweight Hoodie', 4800, 'Outerwear', 'Hoodies',
 '["S","M","L","XL","XXL"]',
 '[{"name":"Charcoal","hex":"#3A3A3A"},{"name":"Forest Green","hex":"#245437"}]',
 'Brushed-back fleece, kept simple — no branding, just a clean silhouette.',
 'Cotton Fleece'),

-- Footwear
('Court Sneaker', 8500, 'Footwear', 'Sneakers',
 '["39","40","41","42"]',
 '[{"name":"White","hex":"#F5F5F0"},{"name":"Black","hex":"#1A1A1A"}]',
 'Full-grain leather upper, cupsole construction for an everyday pair that still reads sharp.',
 'Full-Grain Leather'),

('Oxford Dress Shoe', 12500, 'Footwear', 'Formal Shoes',
 '["40","41","42"]',
 '[{"name":"Black","hex":"#1A1A1A"},{"name":"Oxblood","hex":"#5C1A1A"}]',
 'Goodyear-welted calfskin oxfords, built to be resoled rather than replaced.',
 'Calfskin Leather'),

('Chelsea Boot', 13800, 'Footwear', 'Boots',
 '["40","41","42"]',
 '[{"name":"Tan","hex":"#B89B6E"},{"name":"Black","hex":"#1A1A1A"}]',
 'Elastic-gusset Chelsea boot in burnished leather — equally at home with a suit or raw denim.',
 'Burnished Leather'),

('Leather Slide Sandal', 4200, 'Footwear', 'Sandals',
 '["40","41","42"]',
 '[{"name":"Tan","hex":"#B89B6E"},{"name":"Black","hex":"#1A1A1A"}]',
 'Minimal leather slide, moulded footbed for actual all-day wear, not just a pool shoe.',
 'Leather'),

-- Essentials
('Everyday Boxer Brief 3-Pack', 1800, 'Essentials', 'Underwear',
 '["S","M","L","XL"]',
 '[{"name":"Black","hex":"#1A1A1A"},{"name":"Navy","hex":"#1F2A44"}]',
 'Breathable modal-cotton blend, flat-seamed to disappear under tailoring.',
 'Modal-Cotton Blend'),

('Ribbed Dress Sock 3-Pack', 900, 'Essentials', 'Socks',
 '["M","L"]',
 '[{"name":"Charcoal","hex":"#3A3A3A"},{"name":"Navy","hex":"#1F2A44"}]',
 'Fine-gauge ribbed cotton, the kind that stays up through a full day on your feet.',
 'Combed Cotton'),

('Merino Wool Vest', 2400, 'Essentials', 'Vests',
 '["S","M","L","XL"]',
 '[{"name":"Charcoal","hex":"#3A3A3A"},{"name":"Navy","hex":"#1F2A44"}]',
 'Lightweight merino layering piece, worn under a jacket or alone on a mild evening.',
 'Merino Wool'),

-- Accessories
('Full-Grain Leather Belt', 3200, 'Accessories', 'Belts',
 '["32","34","36","38"]',
 '[{"name":"Black","hex":"#1A1A1A"},{"name":"Tan","hex":"#B89B6E"}]',
 'Single piece of vegetable-tanned leather, solid brass buckle built to be re-used across belts for years.',
 'Vegetable-Tanned Leather'),

('Silk Repp Tie', 2400, 'Accessories', 'Ties',
 '["One Size"]',
 '[{"name":"Burgundy","hex":"#6B2737"},{"name":"Navy","hex":"#1F2A44"},{"name":"Forest Green","hex":"#245437"}]',
 'Woven silk, finished at 8cm — narrow enough for a modern lapel, wide enough to still read as formal.',
 '100% Silk'),

('Silk Bowtie', 2000, 'Accessories', 'Bowties',
 '["One Size"]',
 '[{"name":"Black","hex":"#1A1A1A"},{"name":"Burgundy","hex":"#6B2737"}]',
 'Pre-tied silk bowtie with an adjustable band — proper construction, none of the fuss.',
 '100% Silk'),

('Wool Flat Cap', 2200, 'Accessories', 'Caps',
 '["S/M","L/XL"]',
 '[{"name":"Grey Herringbone","hex":"#8A8A8A"},{"name":"Olive","hex":"#6B7352"}]',
 'Harris Tweed wool, a quiet alternative to a baseball cap for the colder months.',
 'Harris Tweed Wool'),

('Leather Weekender Bag', 12800, 'Accessories', 'Bags',
 '["One Size"]',
 '[{"name":"Tan","hex":"#B89B6E"},{"name":"Black","hex":"#1A1A1A"}]',
 'Full-grain leather holdall, sized for a long weekend. Brass hardware, canvas-lined interior.',
 'Full-Grain Leather'),

('Bifold Leather Wallet', 3400, 'Accessories', 'Wallets',
 '["One Size"]',
 '[{"name":"Black","hex":"#1A1A1A"},{"name":"Oxblood","hex":"#5C1A1A"}]',
 'Hand-stitched bifold in vegetable-tanned leather, breaks in to the shape of your pocket over time.',
 'Vegetable-Tanned Leather');
