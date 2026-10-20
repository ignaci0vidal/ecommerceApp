require('dotenv').config();
const { createPool } = require('../src/db');

const products = [
  { name: 'Cafetera Express 15 Bares', price: 159990, stock: 15, category: 'Electrodomésticos', image: '/img/CafeteraExpress.png', rating: 4.8, reviews: 95 },
  { name: 'Licuadora de Mano 800W', price: 42990, stock: 25, category: 'Electrodomésticos', image: '/img/LicuadoraMano.png', rating: 4.2, reviews: 115 },
  { name: 'Tostadora Eléctrica Oster', price: 29990, stock: 35, category: 'Electrodomésticos', image: '/img/TostadoraElectrica.png', rating: 4.0, reviews: 78 },
  { name: 'Microondas Digital 20L BGH', price: 184990, stock: 12, category: 'Electrodomésticos', image: '/img/MicroondasBGH.png', rating: 4.6, reviews: 204 },
  { name: 'Aspiradora Robot Inteligente Wi-Fi', price: 299990, stock: 8, category: 'Electrodomésticos', image: '/img/AspiradoraRobot.png', rating: 4.4, reviews: 62 },
  { name: 'Balanza de Cocina Digital 5kg', price: 12990, stock: 60, category: 'Electrodomésticos', image: '/img/BalanzaCocina.png', rating: 4.7, reviews: 412 },
  { name: 'Exprimidor de Cítricos Eléctrico 1L', price: 24990, stock: 40, category: 'Electrodomésticos', image: '/img/ExprimidorCitricos.png', rating: 4.1, reviews: 88 },
  { name: 'Auriculares Bluetooth Inalámbricos', price: 34990, stock: 30, category: 'Electrónica', image: '/img/AuricularesBluetooth.png', rating: 4.5, reviews: 180 },
];

const coupons = [
  { code: 'BIENVENIDA10', discount: 10 },
  { code: 'SUPER30', discount: 30 },
];

async function seed() {
  const pool = createPool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const product of products) {
      await client.query(
        `INSERT INTO products
          (name, price_cents, stock, category_name, image, rating, reviews)
         SELECT $1, $2, $3, $4, $5, $6, $7
         WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = $1)`,
        [
          product.name,
          Math.round(product.price * 100),
          product.stock,
          product.category,
          product.image,
          product.rating,
          product.reviews,
        ],
      );
    }

    for (const coupon of coupons) {
      await client.query(
        `INSERT INTO coupons (code, discount_percent, expires_on, usage_limit, active)
         VALUES ($1, $2, '2030-12-31', 100, TRUE)
         ON CONFLICT (code) DO NOTHING`,
        [coupon.code, coupon.discount],
      );
    }
    await client.query('COMMIT');
    console.log(`Catalog seed complete: ${products.length} products and ${coupons.length} coupons checked`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((error) => {
  console.error('Catalog seed failed:', error);
  process.exitCode = 1;
});
