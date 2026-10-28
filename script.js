"use strict";

const curatedProducts = [
  { name: "Black Leather Biker Jacket", category: "jackets", price: 1799, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=85", sizes: ["S", "M", "L"], condition: "Excellent", rating: 4.8, stock: 1, description: "A statement black leather-look biker jacket with classic zip details. A distinctive sample piece for cool-weather layering." },
  { name: "Red Floral Printed Dress", category: "dresses", price: 1299, image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=700&q=85", sizes: ["S", "M"], condition: "Like new", rating: 4.9, stock: 1, description: "A romantic red floral dress with a softly shaped silhouette, made for weekend plans and special occasions." },
  { name: "Neutral and Blue Shirt Rack", category: "tops", price: 699, image: "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=700&q=85", sizes: ["M", "L"], condition: "Good", rating: 4.6, stock: 2, description: "A relaxed neutral-toned shirt with easy, versatile styling. This sample is one of a kind." },
  { name: "Dark-Wash Straight-Leg Jeans", category: "jeans", price: 1199, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=85", sizes: ["28", "30", "32"], condition: "Excellent", rating: 4.8, stock: 1, description: "Straight-leg denim in a deep blue wash with a timeless everyday fit." },
  { name: "Light-Wash Denim Jacket", category: "jackets", price: 1599, image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=700&q=85", sizes: ["S", "M", "L"], condition: "Good", rating: 4.7, stock: 1, description: "A relaxed light-wash denim layer, easy to throw over tees and dresses." },
  { name: "Black Graphic T-Shirt", category: "tops", price: 599, image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=700&q=85", sizes: ["S", "M", "L"], condition: "Good", rating: 4.6, stock: 2, description: "A black graphic tee with a casual fit, ready to become a wardrobe staple." },
  { name: "White Puff-Sleeve Sundress", category: "dresses", price: 1099, image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=700&q=85", sizes: ["S", "M"], condition: "Like new", rating: 4.9, stock: 1, description: "A light white sundress with feminine puff sleeves and an airy, easy-to-style shape." },
  { name: "Coral Structured Handbag", category: "accessories", price: 999, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=85", sizes: ["One size"], condition: "Excellent", rating: 4.8, stock: 1, description: "A structured coral-toned handbag with a polished shape to lift a neutral outfit." },
  { name: "Black Straight-Leg Trousers", category: "trousers", price: 899, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=700&q=85", sizes: ["28", "30", "32"], condition: "Good", rating: 4.7, stock: 2, description: "Easy black straight-leg trousers that move from workwear to weekend styling." },
  { name: "White Graphic T-Shirt", category: "tops", price: 549, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=700&q=85", sizes: ["S", "M", "L"], condition: "Good", rating: 4.5, stock: 2, description: "A crisp white graphic tee with a laid-back silhouette and plenty of styling options." },
  { name: "Plum Off-Shoulder Top", category: "tops", price: 749, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=700&q=85", sizes: ["S", "M"], condition: "Excellent", rating: 4.8, stock: 1, description: "A rich plum off-shoulder top with an occasion-ready look and a distinctive neckline." },
  { name: "Red and Black Tailored Suit", category: "vintage", price: 2199, image: "https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/1.webp", imageFit: "contain", sizes: ["M"], condition: "Vintage", rating: 4.9, stock: 1, description: "A striking red-and-black tailored vintage co-ord. The singular sample listing includes the matching jacket and skirt." },
  { name: "Gold Round-Frame Sunglasses", category: "accessories", price: 499, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=85", sizes: ["One size"], condition: "Excellent", rating: 4.7, stock: 2, description: "Lightweight gold-tone round frames with a retro-inspired silhouette." },
  { name: "Red and Black Plaid Shirt", category: "tops", price: 749, image: "https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/1.webp", imageFit: "contain", sizes: ["M", "L"], condition: "Good", rating: 4.8, stock: 2, description: "A red-and-black plaid button-up with a classic check pattern and relaxed feel." },
  { name: "Black A-Line Mini Skirt", category: "skirts", price: 699, image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=700&q=85", sizes: ["S", "M"], condition: "Excellent", rating: 4.7, stock: 1, description: "A versatile black A-line mini skirt with a clean shape that pairs easily with knits or tees." },
  { name: "Tan Canvas Tote Bag", category: "accessories", price: 449, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=85", sizes: ["One size"], condition: "Good", rating: 4.6, stock: 2, description: "A roomy tan canvas tote for carrying daily essentials, books and market finds." },
  { name: "White Crewneck Sweatshirt", category: "sweaters", price: 899, image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=700&q=85", sizes: ["M", "L"], condition: "Excellent", rating: 4.8, stock: 1, description: "A soft white crewneck sweatshirt for easy layering and relaxed days." },
  { name: "Ivory Floral Beach Maxi Dress", category: "dresses", price: 1399, image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=85", sizes: ["S", "M"], condition: "Like new", rating: 4.9, stock: 1, description: "An ivory floral maxi with a flowing silhouette, perfect for warm days and holidays." },
  { name: "Blue and Black Check Shirt", category: "tops", price: 749, image: "https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/1.webp", imageFit: "contain", sizes: ["M", "L"], condition: "Excellent", rating: 4.8, stock: 1, description: "A blue-and-black checked shirt with a classic button-front design." },
  { name: "White Aorus Graphic T-Shirt", category: "tops", price: 699, image: "https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/1.webp", imageFit: "contain", sizes: ["M", "L"], condition: "Good", rating: 4.6, stock: 2, description: "A white graphic tee with a bold dark print and casual crew neckline." },
  { name: "Short-Sleeve Casual Shirt", category: "tops", price: 649, image: "https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/1.webp", imageFit: "contain", sizes: ["M", "L"], condition: "Good", rating: 4.5, stock: 2, description: "A short-sleeve casual button-up with an easy, warm-weather fit." },
  { name: "Black Evening Gown", category: "dresses", price: 1899, image: "https://cdn.dummyjson.com/product-images/womens-dresses/black-women's-gown/1.webp", imageFit: "contain", sizes: ["S", "M"], condition: "Excellent", rating: 4.9, stock: 1, description: "A dramatic black evening gown with an elegant floor-length silhouette." },
  { name: "Leather Corset and Skirt Set", category: "dresses", price: 1699, image: "https://cdn.dummyjson.com/product-images/womens-dresses/corset-leather-with-skirt/1.webp", imageFit: "contain", sizes: ["S", "M"], condition: "Good", rating: 4.7, stock: 1, description: "A coordinated black faux-leather corset and skirt set with a bold vintage mood." },
  { name: "Black Floral Maxi Dress", category: "dresses", price: 1499, image: "https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/1.webp", imageFit: "contain", sizes: ["S", "M"], condition: "Excellent", rating: 4.8, stock: 1, description: "A black floral maxi dress with a distinctive all-over print and flowing shape." },
  { name: "Red and Black High-Top Sneakers", category: "shoes", price: 2499, image: "https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/1.webp", imageFit: "contain", sizes: ["UK 6", "UK 7", "UK 8"], condition: "Excellent", rating: 4.9, stock: 1, description: "A red, black and white high-top sneaker sample with bold color blocking." },
  { name: "Nike Baseball Cleats", category: "shoes", price: 1699, image: "https://cdn.dummyjson.com/product-images/mens-shoes/nike-baseball-cleats/1.webp", imageFit: "contain", sizes: ["UK 7", "UK 8"], condition: "Good", rating: 4.6, stock: 1, description: "A sporty baseball cleat sample in a dark athletic colorway." },
  { name: "Puma Future Rider Trainers", category: "shoes", price: 1999, image: "https://cdn.dummyjson.com/product-images/mens-shoes/puma-future-rider-trainers/1.webp", imageFit: "contain", sizes: ["UK 6", "UK 7", "UK 8"], condition: "Excellent", rating: 4.8, stock: 1, description: "Retro-inspired Puma trainers with a lightweight, sporty profile." },
  { name: "Off-White and Red Sports Sneakers", category: "shoes", price: 1399, image: "https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-&-red/1.webp", imageFit: "contain", sizes: ["UK 6", "UK 7"], condition: "Good", rating: 4.6, stock: 1, description: "Off-white sports sneakers accented with red details for everyday wear." },
  { name: "Golden Women's Dress Shoes", category: "shoes", price: 1299, image: "https://cdn.dummyjson.com/product-images/womens-shoes/golden-shoes-woman/1.webp", imageFit: "contain", sizes: ["UK 5", "UK 6"], condition: "Excellent", rating: 4.7, stock: 1, description: "A pair of gold-tone women's dress shoes with a polished finish." },
  { name: "Red Women's Shoes", category: "shoes", price: 1199, image: "https://cdn.dummyjson.com/product-images/womens-shoes/red-shoes/1.webp", imageFit: "contain", sizes: ["UK 5", "UK 6"], condition: "Good", rating: 4.6, stock: 1, description: "A vivid red pair of women's shoes for a statement occasion look." },
  { name: "Blue Women's Handbag", category: "accessories", price: 1299, image: "https://cdn.dummyjson.com/product-images/womens-bags/blue-women's-handbag/1.webp", imageFit: "contain", sizes: ["One size"], condition: "Excellent", rating: 4.7, stock: 1, description: "A blue structured handbag with a compact shape and clean finish." },
  { name: "Heshe Leather Shoulder Bag", category: "accessories", price: 1599, image: "https://cdn.dummyjson.com/product-images/womens-bags/heshe-women's-leather-bag/1.webp", imageFit: "contain", sizes: ["One size"], condition: "Excellent", rating: 4.8, stock: 1, description: "A leather shoulder bag with a practical daily shape and understated detailing." },
  { name: "Prada Women's Bag", category: "accessories", price: 2199, image: "https://cdn.dummyjson.com/product-images/womens-bags/prada-women-bag/1.webp", imageFit: "contain", sizes: ["One size"], condition: "Vintage", rating: 4.7, stock: 1, description: "A sample vintage designer-style handbag. Listing and brand details are fictional demo data, not a product authenticity claim." },
  { name: "White Faux-Leather Backpack", category: "accessories", price: 1199, image: "https://cdn.dummyjson.com/product-images/womens-bags/white-faux-leather-backpack/1.webp", imageFit: "contain", sizes: ["One size"], condition: "Good", rating: 4.6, stock: 1, description: "A white faux-leather backpack with a compact, hands-free everyday shape." },
  { name: "Black Women's Handbag", category: "accessories", price: 1399, image: "https://cdn.dummyjson.com/product-images/womens-bags/women-handbag-black/1.webp", imageFit: "contain", sizes: ["One size"], condition: "Excellent", rating: 4.8, stock: 1, description: "A classic black handbag with a structured silhouette and versatile styling." },
  { name: "Brown Leather Strap Watch", category: "accessories", price: 1499, image: "https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/1.webp", imageFit: "contain", sizes: ["One size"], condition: "Good", rating: 4.6, stock: 1, description: "A sample wristwatch with a brown leather-style strap and classic dial." },
  { name: "Longines Master Collection Watch", category: "accessories", price: 2499, image: "https://cdn.dummyjson.com/product-images/mens-watches/longines-master-collection/1.webp", imageFit: "contain", sizes: ["One size"], condition: "Vintage", rating: 4.7, stock: 1, description: "A watch-style sample listing for the demo catalogue. Brand and transaction information are illustrative only." },
  { name: "Gold Women's Watch", category: "accessories", price: 1699, image: "https://cdn.dummyjson.com/product-images/womens-watches/watch-gold-for-women/1.webp", imageFit: "contain", sizes: ["One size"], condition: "Excellent", rating: 4.8, stock: 1, description: "A gold-tone women's watch sample with an elegant, delicate profile." },
  { name: "Black Frame Sunglasses", category: "accessories", price: 499, image: "https://cdn.dummyjson.com/product-images/sunglasses/black-sun-glasses/1.webp", imageFit: "contain", sizes: ["One size"], condition: "Good", rating: 4.5, stock: 2, description: "Black-frame sunglasses with a bold everyday shape." },
  { name: "Green and Black Sunglasses", category: "accessories", price: 549, image: "https://cdn.dummyjson.com/product-images/sunglasses/green-and-black-glasses/1.webp", imageFit: "contain", sizes: ["One size"], condition: "Excellent", rating: 4.7, stock: 1, description: "Green-and-black sunglasses with a distinctive color-blocked frame." },
  { name: "Ruby Red Evening Maxi Dress", category: "dresses", price: 1599, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=85", sizes: ["S", "M"], condition: "Like new", rating: 4.9, stock: 1, description: "A floor-length ruby-red evening dress with a flowing skirt and a standout occasion silhouette." },
  { name: "Blue Denim Shirt Dress", category: "dresses", price: 1199, image: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=700&q=85", sizes: ["S", "M", "L"], condition: "Excellent", rating: 4.8, stock: 1, description: "A mid-blue denim shirt dress with a button front, short sleeves and a casual daywear fit." },
  { name: "Ivory Belted Sleeveless Dress", category: "dresses", price: 999, image: "https://cdn.dummyjson.com/product-images/tops/gray-dress/1.webp", imageFit: "contain", sizes: ["S", "M"], condition: "Excellent", rating: 4.7, stock: 1, description: "A light ivory sleeveless dress with a collared neckline, front buttons and a waist tie." },
  { name: "Tartan Check Mini Dress", category: "dresses", price: 1099, image: "https://cdn.dummyjson.com/product-images/tops/tartan-dress/1.webp", imageFit: "contain", sizes: ["S", "M"], condition: "Vintage", rating: 4.8, stock: 1, description: "A tartan-check dress with a vintage-inspired pattern and easy day-to-evening styling." },
  { name: "Light-Blue Relaxed-Fit Jeans", category: "jeans", price: 1299, image: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=700&q=85", sizes: ["28", "30", "32"], condition: "Excellent", rating: 4.8, stock: 1, description: "Light-blue jeans shown in a relaxed straight-leg fit, easy to style with a tee or button-up." },
  { name: "Mixed-Wash Vintage Denim", category: "jeans", price: 849, image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=700&q=85", sizes: ["28", "30"], condition: "Vintage", rating: 4.7, stock: 1, description: "A distinctive mixed-wash denim sample shown in a neatly folded stack; a small-run thrift find." },
  { name: "Dusty-Rose Jogger Trousers", category: "trousers", price: 899, image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=700&q=85", sizes: ["S", "M", "L"], condition: "Good", rating: 4.6, stock: 1, description: "Dusty-rose trousers with a tapered jogger leg and gathered ankle cuffs." },
  { name: "Rust Bomber Jacket", category: "jackets", price: 1499, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=700&q=85", sizes: ["M", "L"], condition: "Excellent", rating: 4.7, stock: 1, description: "A rust-colored lightweight bomber jacket with a zip front and ribbed-look trim." },
  { name: "White Button-Down Shirt", category: "tops", price: 799, image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=85", sizes: ["S", "M", "L"], condition: "Like new", rating: 4.8, stock: 1, description: "A crisp white collared shirt with short sleeves, shown styled with a dark tie." },
  { name: "Black Zero-Print Graphic Tee", category: "tops", price: 599, image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=700&q=85", sizes: ["S", "M", "L"], condition: "Good", rating: 4.6, stock: 2, description: "A black short-sleeve crewneck tee with a small white chest print." }
].map((product, index) => ({
  ...product,
  id: `sample-${index + 1}`,
  ratingCount: 8 + ((index * 7) % 28),
  condition: product.condition || ["Excellent", "Good", "Like new", "Vintage"][index % 4],
  sizes: product.sizes || ["S", "M", "L"],
  stock: product.stock || 1,
  imageFit: product.imageFit || "cover"
}));
window.hauteCuratedProducts = curatedProducts;

const STORAGE_KEYS = {
  cart: "hauteHustleCartV3",
  wishlist: "hauteHustleWishlistV3",
  orders: "hauteHustleOrdersV3",
  coupon: "hauteHustleCouponV3",
  catalogue: "hauteHustleAdminDemoProductsV1"
};
const FREE_SHIPPING_THRESHOLD = 2000;
const STANDARD_SHIPPING = 99;
const COUPONS = { HAUTE10: 0.1, THRIFT15: 0.15 };
const trackingStages = [
  { status: "Pending", title: "Order placed", afterMs: 0, complete: "Your demo order was received." },
  { status: "Confirmed", title: "Confirmed", afterMs: 10000, complete: "The store confirmed this order." },
  { status: "Shipped", title: "Shipped", afterMs: 20000, complete: "The store marked this order as shipped." },
  { status: "Delivered", title: "Delivered", afterMs: 30000, complete: "The store marked this order as delivered." }
];
const categoryLabels = {
  tops: "Tops & shirts",
  dresses: "Dresses",
  jackets: "Jackets",
  bottoms: "Jeans & trousers",
  skirts: "Skirts",
  sweaters: "Sweaters",
  shoes: "Shoes",
  accessories: "Accessories",
  vintage: "Vintage clothing",
  jeans: "Jeans",
  trousers: "Trousers"
};
const paymentProviders = {
  upi: ["Google Pay (demo)", "PhonePe (demo)", "Paytm (demo)"],
  card: ["Visa (demo)", "Mastercard (demo)", "RuPay (demo)"],
  cod: ["Cash on delivery (demo)"],
  netbanking: ["State Bank of India (demo)", "HDFC Bank (demo)", "ICICI Bank (demo)"],
  wallet: ["Haute Hustle demo wallet"]
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const money = (value) => `₹${Math.max(0, Math.round(value)).toLocaleString("en-IN")}`;
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[char]);

function loadStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (error) {
    console.error(`Could not read Haute Hustle browser data (${key}).`, error);
    showToast("Some saved demo data could not be read. The page is using safe defaults.");
    return fallback;
  }
}

function saveStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Could not save Haute Hustle browser data (${key}).`, error);
    showToast("Browser storage is unavailable. Your latest change may not persist after reload.");
    return false;
  }
}

function isValidProduct(product) {
  return product && typeof product.id === "string" && typeof product.name === "string" &&
    typeof product.image === "string" && typeof product.category === "string" &&
    Number.isFinite(Number(product.price)) && Array.isArray(product.sizes);
}

function getInitialProducts() {
  return curatedProducts.slice();
}

const savedCatalogue = loadStored(STORAGE_KEYS.catalogue, null);
let products = Array.isArray(savedCatalogue) ? savedCatalogue.filter(isValidProduct) : getInitialProducts();
let cart = loadStored(STORAGE_KEYS.cart, []);
let wishlist = loadStored(STORAGE_KEYS.wishlist, []);
let orders = loadStored(STORAGE_KEYS.orders, []);
let activeCoupon = loadStored(STORAGE_KEYS.coupon, "");
let selectedProductId = null;
let authMode = "login";
let toastTimer = 0;
let trackingTimer = 0;
let databaseAvailable = false;
const demoPassphrases = new Map();

if (!Array.isArray(cart)) cart = [];
if (!Array.isArray(wishlist)) wishlist = [];
if (!Array.isArray(orders)) orders = [];
if (typeof activeCoupon !== "string" || !COUPONS[activeCoupon]) activeCoupon = "";
cart = cart.filter((line) => line && typeof line.productId === "string" &&
  Number.isInteger(line.quantity) && line.quantity > 0 && typeof line.size === "string");
wishlist = wishlist.filter((id) => typeof id === "string");

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3000);
}

function setStatus(element, message, isError = false) {
  if (!element) return;
  element.textContent = message;
  element.classList.toggle("is-error", isError);
}

function getProduct(id) {
  return products.find((product) => product.id === id);
}

function getCartLineKey(line) {
  return `${line.productId}::${line.size}`;
}

function getCartTotals() {
  const subtotal = cart.reduce((sum, line) => {
    const product = getProduct(line.productId);
    return sum + (product ? Number(product.price) * line.quantity : 0);
  }, 0);
  const discount = activeCoupon && COUPONS[activeCoupon] ? Math.round(subtotal * COUPONS[activeCoupon]) : 0;
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  return { subtotal, discount, shipping, total: Math.max(0, subtotal - discount + shipping) };
}

function persistCart() {
  saveStored(STORAGE_KEYS.cart, cart);
  saveStored(STORAGE_KEYS.coupon, activeCoupon);
}

async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "The request could not be completed.");
  return result;
}

async function refreshPublicProducts() {
  try {
    const result = await apiRequest("api/products.php");
    if (!Array.isArray(result.products)) throw new Error("The product service returned invalid data.");
    products = result.products.filter(isValidProduct);
    databaseAvailable = true;
    cart = cart.filter((line) => products.some((product) => product.id === line.productId));
    wishlist = wishlist.filter((id) => products.some((product) => product.id === id));
    persistCart();
    saveStored(STORAGE_KEYS.wishlist, wishlist);
    renderProducts();
    renderCart();
    renderWishlist();
  } catch (error) {
    console.error("Could not load the Haute Hustle database catalogue.", error);
    setStatus($("#checkoutStatus"), "Local demo mode: orders are saved only in this browser and are not synced with the store.");
    showToast("Using sample products in local demo mode.");
  }
}

function imageFallback(image, product) {
  const hue = (product.name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) * 17) % 360;
  const initial = escapeHTML(product.name.trim().charAt(0).toUpperCase() || "H");
  const label = escapeHTML(product.name);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="760" viewBox="0 0 600 760"><rect width="600" height="760" fill="hsl(${hue},24%,91%)"/><circle cx="300" cy="300" r="112" fill="hsl(${hue},24%,84%)"/><text x="300" y="345" text-anchor="middle" font-family="Georgia,serif" font-size="120" fill="hsl(${hue},28%,35%)">${initial}</text><text x="300" y="520" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" fill="#51434a">${label}</text><text x="300" y="558" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" fill="#746a68">HAUTE HUSTLE · DEMO IMAGE</text></svg>`;
  image.onerror = null;
  image.src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  image.alt = `${product.name} (sample image unavailable)`;
}

function productCard(product) {
  const saved = wishlist.includes(product.id);
  const fitClass = product.imageFit === "contain" ? " contain" : "";
  return `<article class="product-card">
    <div class="product-image-wrap">
      <img class="product-photo${fitClass}" src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy" onerror="imageFallback(this,products.find(p=>p.id==='${escapeHTML(product.id)}'))">
      <span class="product-condition">${escapeHTML(product.condition)}</span>
      <button class="wishlist-toggle${saved ? " is-saved" : ""}" type="button" data-wishlist="${escapeHTML(product.id)}" aria-label="${saved ? "Remove from" : "Add to"} wishlist" aria-pressed="${saved}">${saved ? "♥" : "♡"}</button>
    </div>
    <div class="product-card-copy">
      <p class="product-category">${escapeHTML(categoryLabels[product.category] || product.category)}</p>
      <h3 class="product-title">${escapeHTML(product.name)}</h3>
      <p class="product-rating" aria-label="${Number(product.rating).toFixed(1)} out of 5 demo rating">★★★★★ <span>${Number(product.rating).toFixed(1)} · demo</span></p>
      <div class="product-price-row"><strong class="product-price">${money(product.price)}</strong><span class="product-size-hint">${escapeHTML(product.sizes.join(" · "))}</span></div>
      <button class="view-product" type="button" data-product="${escapeHTML(product.id)}">View details</button>
    </div>
  </article>`;
}

function renderCategoryTiles() {
  const target = $("#categoryTiles");
  if (!target) return;
  const categoryOrder = ["dresses", "jeans", "trousers", "tops", "jackets", "skirts", "sweaters", "shoes", "accessories", "vintage"];
  target.innerHTML = categoryOrder.map((category) => {
    const product = products.find((item) => item.category === category);
    if (!product) return "";
    const count = products.filter((item) => item.category === category).length;
    return `<button class="category-tile" type="button" data-category-tile="${category}" aria-label="Browse ${escapeHTML(categoryLabels[category])}, ${count} ${count === 1 ? "piece" : "pieces"}">
      <img src="${escapeHTML(product.image)}" alt="" loading="lazy" onerror="imageFallback(this,products.find(p=>p.id==='${escapeHTML(product.id)}'))">
      <span class="category-tile-copy"><strong>${escapeHTML(categoryLabels[category])}</strong><small>${count} ${count === 1 ? "piece" : "pieces"} <span aria-hidden="true">↗</span></small></span>
    </button>`;
  }).join("");
}

function renderProducts() {
  const search = $("#searchInput").value.trim().toLocaleLowerCase();
  const category = $("#categoryFilter").value;
  const price = $("#priceFilter").value;
  const condition = $("#conditionFilter").value;
  const sort = $("#sortSelect").value;
  let filtered = products.filter((product) => {
    const matchesSearch = !search || `${product.name} ${product.description} ${product.category} ${product.condition}`.toLocaleLowerCase().includes(search);
    const matchesCategory = category === "all" || product.category === category;
    const matchesCondition = condition === "all" || product.condition === condition;
    const cost = Number(product.price);
    const matchesPrice = price === "all" || (price === "under-800" && cost < 800) ||
      (price === "800-1500" && cost >= 800 && cost <= 1500) || (price === "over-1500" && cost > 1500);
    return matchesSearch && matchesCategory && matchesCondition && matchesPrice;
  });

  if (sort === "price-low") filtered.sort((a, b) => a.price - b.price);
  if (sort === "price-high") filtered.sort((a, b) => b.price - a.price);
  if (sort === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "rating") filtered.sort((a, b) => b.rating - a.rating);

  $("#productGrid").innerHTML = filtered.map(productCard).join("");
  $("#resultCount").textContent = `Showing ${filtered.length} of ${products.length} sample pieces`;
  $("#emptyState").hidden = filtered.length !== 0;
  $$(".category-tile").forEach((tile) => {
    tile.classList.toggle("is-active", tile.dataset.categoryTile === category);
  });
}

function openOverlay(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.hidden = false;
  document.body.classList.add("modal-open");
  const close = $(".close-button", overlay);
  if (close) close.focus();
}

function closeOverlay(overlay) {
  if (typeof overlay === "string") overlay = document.getElementById(overlay);
  if (!overlay) return;
  overlay.hidden = true;
  if (!$$(".overlay:not([hidden])").length) document.body.classList.remove("modal-open");
}

function openProductDetail(id) {
  const product = getProduct(id);
  if (!product) return;
  selectedProductId = id;
  const image = $("#detailImage");
  image.onerror = () => imageFallback(image, product);
  image.src = product.image;
  image.alt = product.name;
  image.classList.toggle("contain", product.imageFit === "contain");
  $("#detailCategory").textContent = categoryLabels[product.category] || product.category;
  $("#detailCondition").textContent = product.condition;
  $("#detailName").textContent = product.name;
  $("#detailPrice").textContent = money(product.price);
  $("#detailDescription").textContent = product.description;
  $("#detailRating").textContent = `★★★★★ ${Number(product.rating).toFixed(1)} · sample customer rating`;
  $("#detailSize").innerHTML = product.sizes.map((size) => `<option value="${escapeHTML(size)}">${escapeHTML(size)}</option>`).join("");
  $("#detailAddButton").disabled = product.stock <= 0;
  $("#detailAddButton").textContent = product.stock > 0 ? "Add to bag" : "Sold out";
  openOverlay("productOverlay");
}

function toggleWishlist(productId) {
  if (!getProduct(productId)) return;
  if (wishlist.includes(productId)) {
    wishlist = wishlist.filter((id) => id !== productId);
    showToast("Removed from your wishlist.");
  } else {
    wishlist.push(productId);
    showToast("Saved to your wishlist.");
  }
  saveStored(STORAGE_KEYS.wishlist, wishlist);
  $("#wishlistCount").textContent = wishlist.length;
  renderProducts();
  if (!$("#wishlistOverlay").hidden) renderWishlist();
}

function addToCart(productId, size) {
  const product = getProduct(productId);
  if (!product) {
    showToast("This sample product is no longer available.");
    return;
  }
  if (product.stock < 1) {
    showToast("This one-off sample piece is sold out.");
    return;
  }
  const chosenSize = product.sizes.includes(size) ? size : product.sizes[0];
  const existing = cart.find((line) => line.productId === productId && line.size === chosenSize);
  const alreadyInCart = existing ? existing.quantity : 0;
  if (alreadyInCart >= product.stock) {
    showToast("The sample stock limit has been reached.");
    return;
  }
  if (existing) existing.quantity += 1;
  else cart.push({ productId, size: chosenSize, quantity: 1 });
  persistCart();
  renderCart();
  showToast(`${product.name} added to your bag.`);
}

function updateQuantity(productId, size, delta) {
  const line = cart.find((entry) => entry.productId === productId && entry.size === size);
  const product = getProduct(productId);
  if (!line || !product) return;
  const next = line.quantity + delta;
  if (next <= 0) cart = cart.filter((entry) => entry !== line);
  else if (next <= product.stock) line.quantity = next;
  else showToast("The sample stock limit has been reached.");
  persistCart();
  renderCart();
}

function removeCartLine(productId, size) {
  cart = cart.filter((line) => !(line.productId === productId && line.size === size));
  persistCart();
  renderCart();
}

function renderCartLines(target, lines) {
  if (!lines.length) {
    target.innerHTML = '<p class="drawer-empty">Your edit starts with a find.<br>Explore the one-off sample pieces.</p>';
    return;
  }
  target.innerHTML = lines.map((line) => {
    const product = getProduct(line.productId);
    if (!product) return "";
    return `<article class="cart-line">
      <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy" onerror="imageFallback(this,products.find(p=>p.id==='${escapeHTML(product.id)}'))">
      <div><h3>${escapeHTML(product.name)}</h3><small>Size: ${escapeHTML(line.size)}</small>
        <div class="quantity-control"><button type="button" data-quantity="-1" data-id="${escapeHTML(product.id)}" data-size="${escapeHTML(line.size)}" aria-label="Decrease quantity">−</button><span>${line.quantity}</span><button type="button" data-quantity="1" data-id="${escapeHTML(product.id)}" data-size="${escapeHTML(line.size)}" aria-label="Increase quantity">+</button></div>
        <button type="button" class="remove-line" data-remove-cart="${escapeHTML(product.id)}" data-size="${escapeHTML(line.size)}">Remove</button>
      </div><strong class="cart-line-price">${money(product.price * line.quantity)}</strong>
    </article>`;
  }).join("");
}

function renderCart() {
  const count = cart.reduce((sum, line) => sum + line.quantity, 0);
  $("#cartCount").textContent = count;
  $("#cartTitleCount").textContent = count ? `(${count})` : "";
  renderCartLines($("#cartItems"), cart);
  const unavailableLines = cart.filter((line) => !getProduct(line.productId));
  if (unavailableLines.length) {
    $("#cartItems").insertAdjacentHTML("beforeend",
      '<p class="payment-disclaimer">Some saved bag items are not in the current catalogue. Reconnect to the store database to check availability.</p>');
  }
  const totals = getCartTotals();
  $("#cartSubtotal").textContent = money(totals.subtotal);
  $("#cartDiscount").textContent = `−${money(totals.discount)}`;
  $("#cartShipping").textContent = totals.shipping ? money(totals.shipping) : (totals.subtotal ? "Free" : money(0));
  $("#cartTotal").textContent = money(totals.total);
  $("#shippingHint").textContent = totals.subtotal === 0
    ? `Demo shipping is ${money(STANDARD_SHIPPING)} under ${money(FREE_SHIPPING_THRESHOLD)}.`
    : totals.subtotal >= FREE_SHIPPING_THRESHOLD
      ? "Your sample order qualifies for free demo shipping."
      : `Add ${money(FREE_SHIPPING_THRESHOLD - totals.subtotal)} more for free demo shipping.`;
  $("#checkoutButton").disabled = !cart.length || unavailableLines.length > 0;
  $("#couponInput").value = activeCoupon;
  renderCheckoutSummary();
}

function renderWishlist() {
  const savedProducts = wishlist.map(getProduct).filter(Boolean);
  renderCartLines($("#wishlistItems"), savedProducts.map((product) => ({
    productId: product.id,
    size: product.sizes[0],
    quantity: 1
  })));
  $$("#wishlistItems .quantity-control").forEach((node) => node.remove());
  $$("#wishlistItems .remove-line").forEach((button) => {
    button.textContent = "Remove from wishlist";
    button.dataset.removeWishlist = button.dataset.removeCart;
    delete button.dataset.removeCart;
  });
}

function renderCheckoutSummary() {
  if (!$("#checkoutItems")) return;
  const totals = getCartTotals();
  $("#checkoutItems").innerHTML = cart.map((line) => {
    const product = getProduct(line.productId);
    if (!product) return "";
    return `<div class="checkout-item"><span>${line.quantity} × ${escapeHTML(product.name)} · ${escapeHTML(line.size)}</span><span>${money(product.price * line.quantity)}</span></div>`;
  }).join("");
  $("#checkoutSubtotal").textContent = money(totals.subtotal);
  $("#checkoutDiscount").textContent = `−${money(totals.discount)}`;
  $("#checkoutShipping").textContent = totals.shipping ? money(totals.shipping) : (totals.subtotal ? "Free" : money(0));
  $("#checkoutTotal").textContent = money(totals.total);
}

function applyCoupon() {
  const code = $("#couponInput").value.trim().toUpperCase();
  if (!code) {
    activeCoupon = "";
    persistCart();
    setStatus($("#couponStatus"), "Coupon removed.");
    renderCart();
    return;
  }
  if (!Object.prototype.hasOwnProperty.call(COUPONS, code)) {
    activeCoupon = "";
    persistCart();
    setStatus($("#couponStatus"), "That demo code is not recognised. Try HAUTE10 or THRIFT15.", true);
    renderCart();
    return;
  }
  activeCoupon = code;
  persistCart();
  renderCart();
  setStatus($("#couponStatus"), `${code} applied — ${COUPONS[code] * 100}% off sample items.`);
}

function openCheckout() {
  if (!cart.length) {
    showToast("Add a sample piece to your bag before checkout.");
    return;
  }
  $("#checkoutFormView").hidden = false;
  $("#orderSuccess").hidden = true;
  $("#checkoutForm").reset();
  $("#paymentProviderWrap").hidden = false;
  updatePaymentProviders();
  setStatus($("#checkoutStatus"), "");
  renderCheckoutSummary();
  closeOverlay("cartOverlay");
  openOverlay("checkoutOverlay");
}

function updatePaymentProviders() {
  const method = $('input[name="paymentMethod"]:checked', $("#checkoutForm")).value;
  $("#paymentProvider").innerHTML = paymentProviders[method].map((provider) =>
    `<option value="${escapeHTML(provider)}">${escapeHTML(provider)}</option>`).join("");
  $("#paymentProviderWrap").hidden = method === "cod";
}

async function handleCheckoutSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const fullName = String(data.get("fullName") || "").trim();
  const email = String(data.get("email") || "").trim();
  const phone = String(data.get("phone") || "").replace(/\D/g, "");
  const address = String(data.get("address") || "").trim();
  const city = String(data.get("city") || "").trim();
  const pin = String(data.get("pin") || "").replace(/\D/g, "");
  const status = $("#checkoutStatus");

  if (!fullName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.length !== 10 ||
      !address || !city || pin.length !== 6) {
    setStatus(status, "Enter a name, valid email, 10-digit mobile, address, city and 6-digit PIN code.", true);
    return;
  }
  if (!cart.length) {
    setStatus(status, "Your bag is empty. Add a sample piece before placing an order.", true);
    return;
  }
  for (const line of cart) {
    const product = getProduct(line.productId);
    if (!product || line.quantity > product.stock) {
      setStatus(status, "A sample item is no longer available in the requested quantity. Review your bag.", true);
      return;
    }
  }

  const method = String(data.get("paymentMethod"));
  const provider = method === "cod" ? "Cash on delivery (demo)" : String(data.get("paymentProvider"));
  const localOnly = !databaseAvailable;
  let order;
  if (localOnly) {
    const totals = getCartTotals();
    order = {
      id: `HH-DEMO-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      customer: fullName,
      email,
      phone,
      address,
      city,
      postalCode: pin,
      items: cart.map((line) => {
        const product = getProduct(line.productId);
        return { name: product.name, size: line.size, quantity: line.quantity, price: Number(product.price) };
      }),
      ...totals,
      coupon: activeCoupon,
      paymentMethod: method,
      paymentProvider: provider,
      trackingMode: "local-demo",
      status: "Pending"
    };
  } else {
    try {
      const result = await apiRequest("api/orders.php", {
        method: "POST",
        body: JSON.stringify({
          customer: fullName,
          email,
          phone,
          address,
          city,
          postalCode: pin,
          paymentMethod: method,
          paymentProvider: provider,
          coupon: activeCoupon,
          items: cart.map((line) => ({
            productId: line.productId,
            size: line.size,
            quantity: line.quantity
          }))
        })
      });
      order = result.order;
    } catch (error) {
      console.error("Could not save the Haute Hustle order.", error);
      setStatus(status, error.message || "The order could not be saved. Please try again.", true);
      return;
    }
  }
  orders.unshift(order);
  const savedLocally = saveStored(STORAGE_KEYS.orders, orders);
  cart = [];
  activeCoupon = "";
  persistCart();
  if (!localOnly) await refreshPublicProducts();
  $("#checkoutFormView").hidden = true;
  $("#orderSuccess").hidden = false;
  const localNotice = localOnly
    ? savedLocally ? " Saved only in this browser; it will not sync with the store." : " Browser storage failed, so this order may not remain after closing the page."
    : "";
  $("#successOrderText").textContent = `Demo order ${order.id} is confirmed for ${fullName}. Selected method: ${provider}. Total: ${money(order.total)}.${localNotice}`;
  setStatus(status, "");
}

function renderOrders() {
  window.clearTimeout(trackingTimer);
  trackingTimer = 0;
  const target = $("#orderHistory");
  target.hidden = false;
  $("#orderTrackingView").hidden = true;
  if (!orders.length) {
    target.innerHTML = '<p class="drawer-empty">No demo orders yet. Your completed sample checkouts will appear here.</p>';
    return;
  }
  let changed = false;
  orders.forEach((order) => {
    const status = getTrackedOrderStatus(order);
    if (order.status !== status) {
      order.status = status;
      changed = true;
    }
  });
  if (changed) saveStored(STORAGE_KEYS.orders, orders);
  target.innerHTML = orders.map((order) => {
    const date = new Date(order.createdAt);
    const formatted = Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
    const itemSummary = Array.isArray(order.items) ? order.items.map((item) =>
      `${item.quantity} × ${escapeHTML(item.name)} (${escapeHTML(item.size)})`).join(", ") : "Sample order";
    const status = order.status || "Pending";
    return `<article class="order-history-entry">
      <div class="order-history-main"><p class="eyebrow">PLACED ${escapeHTML(formatted)}</p><strong>${escapeHTML(order.id)}</strong><small>${itemSummary}</small><small>${escapeHTML(order.paymentProvider || "Demo payment")}</small></div>
      <div class="order-history-meta"><span class="tracking-status" data-status="${escapeHTML(status.toLowerCase())}">${escapeHTML(status)}</span><strong>${money(order.total)}</strong><button class="button button-outline" type="button" data-track-order="${escapeHTML(order.id)}">Track order</button></div>
    </article>`;
  }).join("");
}

function getTrackedOrderStatus(order) {
  if (order.status === "Cancelled") return "Cancelled";
  const createdAt = Date.parse(order.createdAt);
  if (!Number.isFinite(createdAt)) return order.status || "Pending";
  const elapsed = Math.max(0, Date.now() - createdAt);
  return trackingStages.reduce((status, stage) => elapsed >= stage.afterMs ? stage.status : status, "Pending");
}

function renderOrderTracking(orderId) {
  window.clearTimeout(trackingTimer);
  const order = orders.find((entry) => entry.id === orderId);
  if (!order) return;
  const trackedStatus = getTrackedOrderStatus(order);
  const status = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"].includes(trackedStatus)
    ? trackedStatus
    : "Pending";
  if (order.status !== status) {
    order.status = status;
    saveStored(STORAGE_KEYS.orders, orders);
  }
  const cancelled = status === "Cancelled";
  const currentStage = cancelled ? -1 : Math.max(0, trackingStages.findIndex((stage) => stage.status === status));
  $("#trackingTitle").textContent = `Order ${order.id}`;
  $("#trackingReference").textContent = order.id;
  $("#trackingStatus").textContent = status;
  $("#trackingStatus").dataset.status = status.toLowerCase();
  $("#trackingTimeline").innerHTML = trackingStages.map((stage, index) => {
    const state = cancelled
      ? index === 0 ? "is-complete" : "is-upcoming"
      : index < currentStage ? "is-complete" : index === currentStage ? "is-current" : "is-upcoming";
    const detail = cancelled
      ? index === 0 ? "Your demo order was received before cancellation." : "This milestone was not reached because the order was cancelled."
      : index <= currentStage ? stage.complete : "Waiting for the previous order milestone.";
    return `<li class="tracking-step ${state}"><span class="tracking-marker" aria-hidden="true"></span><div><strong>${stage.title}</strong><p>${detail}</p></div></li>`;
  }).join("");
  if (cancelled) {
    $("#trackingNote").textContent = "This demo order was cancelled. No payment was taken.";
  } else {
    const createdAt = Date.parse(order.createdAt);
    if (!Number.isFinite(createdAt)) {
      $("#trackingNote").textContent = "Demo tracking time is unavailable for this order.";
    } else {
      const elapsed = Math.max(0, Date.now() - createdAt);
      const nextStage = trackingStages.find((stage) => stage.afterMs > elapsed);
      $("#trackingNote").textContent = nextStage
        ? `Demo status advances to ${nextStage.status} in ${Math.ceil((nextStage.afterMs - elapsed) / 1000)} seconds. No live carrier updates.`
        : "Demo delivery is complete. No live carrier updates are available.";
      if (nextStage) trackingTimer = window.setTimeout(() => renderOrderTracking(orderId), 1000);
    }
  }
  $("#orderHistory").hidden = true;
  $("#orderTrackingView").hidden = false;
}

function setAuthMode(mode) {
  authMode = mode;
  const registering = mode === "register";
  const email = $("#authForm [name='email']").value;
  $("#authTitle").innerHTML = registering ? "Join the <em>edit.</em>" : "Welcome <em>back.</em>";
  $("#authNameWrap").hidden = !registering;
  $("#authNameWrap input").required = registering;
  $("#authSubmit").textContent = registering ? "Create demo account" : "Sign in to demo";
  $$(".auth-tabs button").forEach((button) => {
    const active = button.dataset.authMode === mode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  $("#authForm").reset();
  $("#authForm [name='email']").value = email;
  setStatus($("#authStatus"), "");
}

function handleAuthSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim().toLowerCase();
  const password = String(data.get("demoPassphrase") || "");
  const users = loadStored("hauteHustleDemoUsersV1", []);
  const userList = Array.isArray(users) ? users : [];
  if (authMode === "register") {
    const existingUser = userList.find((user) => user.email === email);
    if (existingUser && demoPassphrases.has(email)) {
      setStatus($("#authStatus"), "A demo profile with this email already exists in this session. Try signing in.", true);
      return;
    }
    if (existingUser) existingUser.name = name;
    else userList.push({ name, email });
    saveStored("hauteHustleDemoUsersV1", userList);
    demoPassphrases.set(email, password);
    setStatus($("#authStatus"), `Demo profile ready for ${name}. The passphrase is kept only for this session.`, false);
    showToast("Demo account created locally.");
    return;
  }
  const user = userList.find((entry) => entry.email === email);
  if (!user) {
    setStatus($("#authStatus"), "No customer demo profile exists for this email in this browser. Choose Create account to make one.", true);
    return;
  }
  if (!demoPassphrases.has(email)) {
    setStatus($("#authStatus"), "This browser remembers the demo profile, but not its passphrase. Choose Create account to set a new demo-only passphrase for this session.", true);
    return;
  }
  if (demoPassphrases.get(email) !== password) {
    setStatus($("#authStatus"), "That passphrase does not match this session's demo account.", true);
    return;
  }
  setStatus($("#authStatus"), `Welcome back, ${user.name}. This demo does not authenticate with a server.`, false);
  showToast(`Welcome back, ${user.name}.`);
}

function handleContactSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const message = {
    name: String(data.get("name")).trim(),
    email: String(data.get("email")).trim(),
    subject: String(data.get("subject")).trim(),
    message: String(data.get("message")).trim(),
    createdAt: new Date().toISOString()
  };
  const saved = loadStored("hauteHustleDemoMessagesV1", []);
  const messages = Array.isArray(saved) ? saved : [];
  messages.unshift(message);
  saveStored("hauteHustleDemoMessagesV1", messages.slice(0, 50));
  form.reset();
  setStatus($("#contactStatus"), "Your demo message was saved in this browser only; nothing was sent to a server.");
}

function attachEvents() {
  ["input", "change"].forEach((eventName) => {
    $("#searchInput").addEventListener(eventName, renderProducts);
    ["#categoryFilter", "#priceFilter", "#conditionFilter", "#sortSelect"].forEach((selector) =>
      $(selector).addEventListener(eventName, renderProducts));
  });
  $("#clearFilters").addEventListener("click", () => {
    $("#searchInput").value = "";
    $("#categoryFilter").value = "all";
    $("#priceFilter").value = "all";
    $("#conditionFilter").value = "all";
    $("#sortSelect").value = "featured";
    renderProducts();
  });
  $("#menuToggle").addEventListener("click", () => {
    const expanded = $("#menuToggle").getAttribute("aria-expanded") === "true";
    $("#menuToggle").setAttribute("aria-expanded", String(!expanded));
    $("#menuToggle").setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
    $("#navLinks").classList.toggle("is-open", !expanded);
  });
  $("#navLinks").addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      $("#navLinks").classList.remove("is-open");
      $("#menuToggle").setAttribute("aria-expanded", "false");
      $("#menuToggle").setAttribute("aria-label", "Open navigation");
    }
  });
  $("#productGrid").addEventListener("click", (event) => {
    const wishlistButton = event.target.closest("[data-wishlist]");
    const productButton = event.target.closest("[data-product]");
    if (wishlistButton) toggleWishlist(wishlistButton.dataset.wishlist);
    else if (productButton) openProductDetail(productButton.dataset.product);
  });
  $("#categoryTiles").addEventListener("click", (event) => {
    const tile = event.target.closest("[data-category-tile]");
    if (!tile) return;
    $("#categoryFilter").value = tile.dataset.categoryTile;
    $("#priceFilter").value = "all";
    $("#conditionFilter").value = "all";
    $("#sortSelect").value = "featured";
    $("#searchInput").value = "";
    renderProducts();
    $("#productGrid").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  $("#detailAddButton").addEventListener("click", () => {
    if (!selectedProductId) return;
    addToCart(selectedProductId, $("#detailSize").value);
    closeOverlay("productOverlay");
    openOverlay("cartOverlay");
  });
  $("#cartButton").addEventListener("click", () => { renderCart(); openOverlay("cartOverlay"); });
  $("#wishlistButton").addEventListener("click", () => { renderWishlist(); openOverlay("wishlistOverlay"); });
  $("#ordersButton").addEventListener("click", () => { renderOrders(); openOverlay("ordersOverlay"); });
  $("#orderHistory").addEventListener("click", (event) => {
    const trackButton = event.target.closest("[data-track-order]");
    if (trackButton) renderOrderTracking(trackButton.dataset.trackOrder);
  });
  $("#trackingBackButton").addEventListener("click", () => {
    window.clearTimeout(trackingTimer);
    trackingTimer = 0;
    $("#orderTrackingView").hidden = true;
    $("#orderHistory").hidden = false;
  });
  document.addEventListener("click", (event) => {
    const closeButton = event.target.closest("[data-close-overlay]");
    if (closeButton) {
      if (closeButton.closest(".overlay")?.id === "ordersOverlay") {
        window.clearTimeout(trackingTimer);
        trackingTimer = 0;
      }
      closeOverlay(closeButton.closest(".overlay"));
      return;
    }
    if (event.target.classList && event.target.classList.contains("overlay")) {
      if (event.target.id === "ordersOverlay") {
        window.clearTimeout(trackingTimer);
        trackingTimer = 0;
      }
      closeOverlay(event.target);
    }
    const openAuth = event.target.closest("[data-open-auth]");
    if (openAuth) {
      setAuthMode("login");
      openOverlay("authOverlay");
    }
  });
  $("#cartItems").addEventListener("click", (event) => {
    const quantity = event.target.closest("[data-quantity]");
    const remove = event.target.closest("[data-remove-cart]");
    if (quantity) updateQuantity(quantity.dataset.id, quantity.dataset.size, Number(quantity.dataset.quantity));
    else if (remove) removeCartLine(remove.dataset.removeCart, remove.dataset.size);
  });
  $("#wishlistItems").addEventListener("click", (event) => {
    const remove = event.target.closest("[data-remove-wishlist]");
    if (remove) toggleWishlist(remove.dataset.removeWishlist);
    const productButton = event.target.closest("[data-product]");
    if (productButton) openProductDetail(productButton.dataset.product);
  });
  $("#applyCoupon").addEventListener("click", applyCoupon);
  $("#couponInput").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      applyCoupon();
    }
  });
  $("#checkoutButton").addEventListener("click", openCheckout);
  $("#checkoutForm").addEventListener("change", (event) => {
    if (event.target.name === "paymentMethod") updatePaymentProviders();
  });
  $("#checkoutForm").addEventListener("submit", handleCheckoutSubmit);
  $("#finishOrderButton").addEventListener("click", () => {
    closeOverlay("checkoutOverlay");
    document.querySelector("#shop").scrollIntoView({ behavior: "smooth" });
  });
  $$(".auth-tabs button").forEach((button) => button.addEventListener("click", () => setAuthMode(button.dataset.authMode)));
  $("#authForm").addEventListener("submit", handleAuthSubmit);
  $("#contactForm").addEventListener("submit", handleContactSubmit);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      $$(".overlay:not([hidden])").forEach(closeOverlay);
      $("#navLinks").classList.remove("is-open");
      $("#menuToggle").setAttribute("aria-expanded", "false");
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      $("#searchInput").focus();
      document.querySelector("#shop").scrollIntoView({ behavior: "smooth" });
    }
  });
}

function initialize() {
  if (!$("#productGrid")) return;
  if (new Set(products.map((product) => product.name.toLocaleLowerCase())).size !== products.length) {
    console.error("The sample catalogue contains repeated product names.");
    showToast("Inventory contains repeated product names. Please check the catalogue.");
  }
  if (new Set(products.map((product) => product.image)).size !== products.length) {
    console.error("The sample catalogue contains repeated image URLs.");
    showToast("Inventory contains repeated image URLs. Please check the catalogue.");
  }
  renderCategoryTiles();
  renderProducts();
  renderCart();
  renderWishlist();
  attachEvents();
  refreshPublicProducts();
}

initialize();
