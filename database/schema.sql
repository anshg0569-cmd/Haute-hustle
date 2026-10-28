CREATE DATABASE IF NOT EXISTS haute_hustle
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE haute_hustle;

CREATE TABLE IF NOT EXISTS products (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  public_id VARCHAR(80) NOT NULL,
  name VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(32) NOT NULL,
  condition_name VARCHAR(24) NOT NULL,
  price INT UNSIGNED NOT NULL,
  stock INT UNSIGNED NOT NULL DEFAULT 0,
  image_path VARCHAR(2048) NOT NULL,
  sizes_json JSON NOT NULL,
  rating DECIMAL(2,1) NOT NULL DEFAULT 4.7,
  rating_count INT UNSIGNED NOT NULL DEFAULT 0,
  image_fit VARCHAR(12) NOT NULL DEFAULT 'cover',
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_products_public_id (public_id),
  UNIQUE KEY uq_products_name (name),
  KEY idx_products_catalogue (is_active, sort_order, id),
  KEY idx_products_category (category, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admins (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admins_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_login_attempts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  ip_address VARCHAR(45) NOT NULL,
  attempted_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY idx_login_attempt_ip_time (ip_address, attempted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_number VARCHAR(32) NOT NULL,
  customer_name VARCHAR(80) NOT NULL,
  email VARCHAR(120) NOT NULL,
  phone CHAR(10) NOT NULL,
  address VARCHAR(250) NOT NULL,
  city VARCHAR(80) NOT NULL,
  postal_code CHAR(6) NOT NULL,
  subtotal INT UNSIGNED NOT NULL,
  discount INT UNSIGNED NOT NULL DEFAULT 0,
  shipping INT UNSIGNED NOT NULL DEFAULT 0,
  total INT UNSIGNED NOT NULL,
  coupon VARCHAR(32) NULL,
  payment_method VARCHAR(24) NOT NULL,
  payment_provider VARCHAR(80) NOT NULL,
  payment_status VARCHAR(40) NOT NULL DEFAULT 'Not charged (demo)',
  order_status ENUM('Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled') NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_orders_number (order_number),
  KEY idx_orders_created (created_at),
  KEY idx_orders_status (order_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NULL,
  product_name VARCHAR(120) NOT NULL,
  size VARCHAR(30) NOT NULL,
  quantity SMALLINT UNSIGNED NOT NULL,
  unit_price INT UNSIGNED NOT NULL,
  line_total INT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  KEY idx_order_items_order (order_id),
  KEY idx_order_items_product (product_id),
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO products (public_id, name, description, category, condition_name, price, stock, image_path, sizes_json, rating, rating_count, image_fit, sort_order)
VALUES
  ('sample-1', 'Black Leather Biker Jacket', 'A statement black leather-look biker jacket with classic zip details. A distinctive sample piece for cool-weather layering.', 'jackets', 'Excellent', 1799, 1, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=85', '["S","M","L"]', 4.8, 8, 'cover', 1),
  ('sample-2', 'Red Floral Printed Dress', 'A romantic red floral dress with a softly shaped silhouette, made for weekend plans and special occasions.', 'dresses', 'Like new', 1299, 1, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=700&q=85', '["S","M"]', 4.9, 15, 'cover', 2),
  ('sample-3', 'Neutral and Blue Shirt Rack', 'A relaxed neutral-toned shirt with easy, versatile styling. This sample is one of a kind.', 'tops', 'Good', 699, 2, 'https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=700&q=85', '["M","L"]', 4.6, 22, 'cover', 3),
  ('sample-4', 'Dark-Wash Straight-Leg Jeans', 'Straight-leg denim in a deep blue wash with a timeless everyday fit.', 'jeans', 'Excellent', 1199, 1, 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=85', '["28","30","32"]', 4.8, 29, 'cover', 4),
  ('sample-5', 'Light-Wash Denim Jacket', 'A relaxed light-wash denim layer, easy to throw over tees and dresses.', 'jackets', 'Good', 1599, 1, 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=700&q=85', '["S","M","L"]', 4.7, 8, 'cover', 5),
  ('sample-6', 'Black Graphic T-Shirt', 'A black graphic tee with a casual fit, ready to become a wardrobe staple.', 'tops', 'Good', 599, 2, 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=700&q=85', '["S","M","L"]', 4.6, 15, 'cover', 6),
  ('sample-7', 'White Puff-Sleeve Sundress', 'A light white sundress with feminine puff sleeves and an airy, easy-to-style shape.', 'dresses', 'Like new', 1099, 1, 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=700&q=85', '["S","M"]', 4.9, 22, 'cover', 7),
  ('sample-8', 'Coral Structured Handbag', 'A structured coral-toned handbag with a polished shape to lift a neutral outfit.', 'accessories', 'Excellent', 999, 1, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=85', '["One size"]', 4.8, 29, 'cover', 8),
  ('sample-9', 'Black Straight-Leg Trousers', 'Easy black straight-leg trousers that move from workwear to weekend styling.', 'trousers', 'Good', 899, 2, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=700&q=85', '["28","30","32"]', 4.7, 8, 'cover', 9),
  ('sample-10', 'White Graphic T-Shirt', 'A crisp white graphic tee with a laid-back silhouette and plenty of styling options.', 'tops', 'Good', 549, 2, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=700&q=85', '["S","M","L"]', 4.5, 15, 'cover', 10),
  ('sample-11', 'Plum Off-Shoulder Top', 'A rich plum off-shoulder top with an occasion-ready look and a distinctive neckline.', 'tops', 'Excellent', 749, 1, 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=700&q=85', '["S","M"]', 4.8, 22, 'cover', 11),
  ('sample-12', 'Red and Black Tailored Suit', 'A striking red-and-black tailored vintage co-ord. The singular sample listing includes the matching jacket and skirt.', 'vintage', 'Vintage', 2199, 1, 'https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/1.webp', '["M"]', 4.9, 29, 'contain', 12),
  ('sample-13', 'Gold Round-Frame Sunglasses', 'Lightweight gold-tone round frames with a retro-inspired silhouette.', 'accessories', 'Excellent', 499, 2, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=85', '["One size"]', 4.7, 8, 'cover', 13),
  ('sample-14', 'Red and Black Plaid Shirt', 'A red-and-black plaid button-up with a classic check pattern and relaxed feel.', 'tops', 'Good', 749, 2, 'https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/1.webp', '["M","L"]', 4.8, 15, 'contain', 14),
  ('sample-15', 'Black A-Line Mini Skirt', 'A versatile black A-line mini skirt with a clean shape that pairs easily with knits or tees.', 'skirts', 'Excellent', 699, 1, 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=700&q=85', '["S","M"]', 4.7, 22, 'cover', 15),
  ('sample-16', 'Tan Canvas Tote Bag', 'A roomy tan canvas tote for carrying daily essentials, books and market finds.', 'accessories', 'Good', 449, 2, 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=85', '["One size"]', 4.6, 29, 'cover', 16),
  ('sample-17', 'White Crewneck Sweatshirt', 'A soft white crewneck sweatshirt for easy layering and relaxed days.', 'sweaters', 'Excellent', 899, 1, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=700&q=85', '["M","L"]', 4.8, 8, 'cover', 17),
  ('sample-18', 'Ivory Floral Beach Maxi Dress', 'An ivory floral maxi with a flowing silhouette, perfect for warm days and holidays.', 'dresses', 'Like new', 1399, 1, 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=85', '["S","M"]', 4.9, 15, 'cover', 18),
  ('sample-19', 'Blue and Black Check Shirt', 'A blue-and-black checked shirt with a classic button-front design.', 'tops', 'Excellent', 749, 1, 'https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/1.webp', '["M","L"]', 4.8, 22, 'contain', 19),
  ('sample-20', 'White Aorus Graphic T-Shirt', 'A white graphic tee with a bold dark print and casual crew neckline.', 'tops', 'Good', 699, 2, 'https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/1.webp', '["M","L"]', 4.6, 29, 'contain', 20),
  ('sample-21', 'Short-Sleeve Casual Shirt', 'A short-sleeve casual button-up with an easy, warm-weather fit.', 'tops', 'Good', 649, 2, 'https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/1.webp', '["M","L"]', 4.5, 8, 'contain', 21),
  ('sample-22', 'Black Evening Gown', 'A dramatic black evening gown with an elegant floor-length silhouette.', 'dresses', 'Excellent', 1899, 1, 'https://cdn.dummyjson.com/product-images/womens-dresses/black-women''s-gown/1.webp', '["S","M"]', 4.9, 15, 'contain', 22),
  ('sample-23', 'Leather Corset and Skirt Set', 'A coordinated black faux-leather corset and skirt set with a bold vintage mood.', 'dresses', 'Good', 1699, 1, 'https://cdn.dummyjson.com/product-images/womens-dresses/corset-leather-with-skirt/1.webp', '["S","M"]', 4.7, 22, 'contain', 23),
  ('sample-24', 'Black Floral Maxi Dress', 'A black floral maxi dress with a distinctive all-over print and flowing shape.', 'dresses', 'Excellent', 1499, 1, 'https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/1.webp', '["S","M"]', 4.8, 29, 'contain', 24),
  ('sample-25', 'Red and Black High-Top Sneakers', 'A red, black and white high-top sneaker sample with bold color blocking.', 'shoes', 'Excellent', 2499, 1, 'https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/1.webp', '["UK 6","UK 7","UK 8"]', 4.9, 8, 'contain', 25),
  ('sample-26', 'Nike Baseball Cleats', 'A sporty baseball cleat sample in a dark athletic colorway.', 'shoes', 'Good', 1699, 1, 'https://cdn.dummyjson.com/product-images/mens-shoes/nike-baseball-cleats/1.webp', '["UK 7","UK 8"]', 4.6, 15, 'contain', 26),
  ('sample-27', 'Puma Future Rider Trainers', 'Retro-inspired Puma trainers with a lightweight, sporty profile.', 'shoes', 'Excellent', 1999, 1, 'https://cdn.dummyjson.com/product-images/mens-shoes/puma-future-rider-trainers/1.webp', '["UK 6","UK 7","UK 8"]', 4.8, 22, 'contain', 27),
  ('sample-28', 'Off-White and Red Sports Sneakers', 'Off-white sports sneakers accented with red details for everyday wear.', 'shoes', 'Good', 1399, 1, 'https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-&-red/1.webp', '["UK 6","UK 7"]', 4.6, 29, 'contain', 28),
  ('sample-29', 'Golden Women''s Dress Shoes', 'A pair of gold-tone women''s dress shoes with a polished finish.', 'shoes', 'Excellent', 1299, 1, 'https://cdn.dummyjson.com/product-images/womens-shoes/golden-shoes-woman/1.webp', '["UK 5","UK 6"]', 4.7, 8, 'contain', 29),
  ('sample-30', 'Red Women''s Shoes', 'A vivid red pair of women''s shoes for a statement occasion look.', 'shoes', 'Good', 1199, 1, 'https://cdn.dummyjson.com/product-images/womens-shoes/red-shoes/1.webp', '["UK 5","UK 6"]', 4.6, 15, 'contain', 30),
  ('sample-31', 'Blue Women''s Handbag', 'A blue structured handbag with a compact shape and clean finish.', 'accessories', 'Excellent', 1299, 1, 'https://cdn.dummyjson.com/product-images/womens-bags/blue-women''s-handbag/1.webp', '["One size"]', 4.7, 22, 'contain', 31),
  ('sample-32', 'Heshe Leather Shoulder Bag', 'A leather shoulder bag with a practical daily shape and understated detailing.', 'accessories', 'Excellent', 1599, 1, 'https://cdn.dummyjson.com/product-images/womens-bags/heshe-women''s-leather-bag/1.webp', '["One size"]', 4.8, 29, 'contain', 32),
  ('sample-33', 'Prada Women''s Bag', 'A sample vintage designer-style handbag. Listing and brand details are fictional demo data, not a product authenticity claim.', 'accessories', 'Vintage', 2199, 1, 'https://cdn.dummyjson.com/product-images/womens-bags/prada-women-bag/1.webp', '["One size"]', 4.7, 8, 'contain', 33),
  ('sample-34', 'White Faux-Leather Backpack', 'A white faux-leather backpack with a compact, hands-free everyday shape.', 'accessories', 'Good', 1199, 1, 'https://cdn.dummyjson.com/product-images/womens-bags/white-faux-leather-backpack/1.webp', '["One size"]', 4.6, 15, 'contain', 34),
  ('sample-35', 'Black Women''s Handbag', 'A classic black handbag with a structured silhouette and versatile styling.', 'accessories', 'Excellent', 1399, 1, 'https://cdn.dummyjson.com/product-images/womens-bags/women-handbag-black/1.webp', '["One size"]', 4.8, 22, 'contain', 35),
  ('sample-36', 'Brown Leather Strap Watch', 'A sample wristwatch with a brown leather-style strap and classic dial.', 'accessories', 'Good', 1499, 1, 'https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/1.webp', '["One size"]', 4.6, 29, 'contain', 36),
  ('sample-37', 'Longines Master Collection Watch', 'A watch-style sample listing for the demo catalogue. Brand and transaction information are illustrative only.', 'accessories', 'Vintage', 2499, 1, 'https://cdn.dummyjson.com/product-images/mens-watches/longines-master-collection/1.webp', '["One size"]', 4.7, 8, 'contain', 37),
  ('sample-38', 'Gold Women''s Watch', 'A gold-tone women''s watch sample with an elegant, delicate profile.', 'accessories', 'Excellent', 1699, 1, 'https://cdn.dummyjson.com/product-images/womens-watches/watch-gold-for-women/1.webp', '["One size"]', 4.8, 15, 'contain', 38),
  ('sample-39', 'Black Frame Sunglasses', 'Black-frame sunglasses with a bold everyday shape.', 'accessories', 'Good', 499, 2, 'https://cdn.dummyjson.com/product-images/sunglasses/black-sun-glasses/1.webp', '["One size"]', 4.5, 22, 'contain', 39),
  ('sample-40', 'Green and Black Sunglasses', 'Green-and-black sunglasses with a distinctive color-blocked frame.', 'accessories', 'Excellent', 549, 1, 'https://cdn.dummyjson.com/product-images/sunglasses/green-and-black-glasses/1.webp', '["One size"]', 4.7, 29, 'contain', 40),
  ('sample-41', 'Ruby Red Evening Maxi Dress', 'A floor-length ruby-red evening dress with a flowing skirt and a standout occasion silhouette.', 'dresses', 'Like new', 1599, 1, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=85', '["S","M"]', 4.9, 8, 'cover', 41),
  ('sample-42', 'Blue Denim Shirt Dress', 'A mid-blue denim shirt dress with a button front, short sleeves and a casual daywear fit.', 'dresses', 'Excellent', 1199, 1, 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=700&q=85', '["S","M","L"]', 4.8, 15, 'cover', 42),
  ('sample-43', 'Ivory Belted Sleeveless Dress', 'A light ivory sleeveless dress with a collared neckline, front buttons and a waist tie.', 'dresses', 'Excellent', 999, 1, 'https://cdn.dummyjson.com/product-images/tops/gray-dress/1.webp', '["S","M"]', 4.7, 22, 'contain', 43),
  ('sample-44', 'Tartan Check Mini Dress', 'A tartan-check dress with a vintage-inspired pattern and easy day-to-evening styling.', 'dresses', 'Vintage', 1099, 1, 'https://cdn.dummyjson.com/product-images/tops/tartan-dress/1.webp', '["S","M"]', 4.8, 29, 'contain', 44),
  ('sample-45', 'Light-Blue Relaxed-Fit Jeans', 'Light-blue jeans shown in a relaxed straight-leg fit, easy to style with a tee or button-up.', 'jeans', 'Excellent', 1299, 1, 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=700&q=85', '["28","30","32"]', 4.8, 8, 'cover', 45),
  ('sample-46', 'Mixed-Wash Vintage Denim', 'A distinctive mixed-wash denim sample shown in a neatly folded stack; a small-run thrift find.', 'jeans', 'Vintage', 849, 1, 'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=700&q=85', '["28","30"]', 4.7, 15, 'cover', 46),
  ('sample-47', 'Dusty-Rose Jogger Trousers', 'Dusty-rose trousers with a tapered jogger leg and gathered ankle cuffs.', 'trousers', 'Good', 899, 1, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=700&q=85', '["S","M","L"]', 4.6, 22, 'cover', 47),
  ('sample-48', 'Rust Bomber Jacket', 'A rust-colored lightweight bomber jacket with a zip front and ribbed-look trim.', 'jackets', 'Excellent', 1499, 1, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=700&q=85', '["M","L"]', 4.7, 29, 'cover', 48),
  ('sample-49', 'White Button-Down Shirt', 'A crisp white collared shirt with short sleeves, shown styled with a dark tie.', 'tops', 'Like new', 799, 1, 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=85', '["S","M","L"]', 4.8, 8, 'cover', 49),
  ('sample-50', 'Black Zero-Print Graphic Tee', 'A black short-sleeve crewneck tee with a small white chest print.', 'tops', 'Good', 599, 2, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=700&q=85', '["S","M","L"]', 4.6, 15, 'cover', 50)
ON DUPLICATE KEY UPDATE public_id = VALUES(public_id);
