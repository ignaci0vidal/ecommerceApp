require('dotenv').config();
const { createPool } = require('../src/db');

const products = [
  {
    name: 'Cafetera Express 15 Bares', price: 159990, stock: 15, category: 'Electrodomésticos',
    description: 'Cafetera espresso de 15 bares con vaporizador para espumar leche, depósito de agua removible y bandeja antigoteo. Ideal para preparar espresso y bebidas con leche en casa.',
    image: '/img/CafeteraExpress.png', rating: 4.8, reviews: 95,
  },
  {
    name: 'Licuadora de Mano 800W', price: 42990, stock: 25, category: 'Electrodomésticos',
    description: 'Licuadora de mano de 800 W con pie desmontable de acero inoxidable y control de velocidad. Incluye vaso medidor para preparar sopas, salsas y licuados.',
    image: '/img/LicuadoraMano.png', rating: 4.2, reviews: 115,
  },
  {
    name: 'Tostadora Eléctrica Oster', price: 29990, stock: 35, category: 'Electrodomésticos',
    description: 'Tostadora eléctrica con ranuras anchas, selector de dorado y funciones para recalentar y descongelar. Bandeja extraíble para facilitar la limpieza.',
    image: '/img/TostadoraElectrica.png', rating: 4.0, reviews: 78,
  },
  {
    name: 'Microondas Digital 20L BGH', price: 184990, stock: 12, category: 'Electrodomésticos',
    description: 'Microondas digital de 20 litros con niveles de potencia, temporizador y programas automáticos. Plato giratorio de vidrio y controles fáciles de usar.',
    image: '/img/MicroondasBGH.png', rating: 4.6, reviews: 204,
  },
  {
    name: 'Aspiradora Robot Inteligente Wi-Fi', price: 299990, stock: 8, category: 'Electrodomésticos',
    description: 'Robot aspirador con conectividad Wi-Fi, programación desde el celular y sensores anticaída. Limpia pisos duros y alfombras de pelo corto; vuelve a su base al terminar.',
    image: '/img/AspiradoraRobot.png', rating: 4.4, reviews: 62,
  },
  {
    name: 'Balanza de Cocina Digital 5kg', price: 12990, stock: 60, category: 'Electrodomésticos',
    description: 'Balanza digital de cocina con capacidad de hasta 5 kg, función tara y pantalla de fácil lectura. Permite medir ingredientes en gramos y onzas.',
    image: '/img/BalanzaCocina.png', rating: 4.7, reviews: 412,
  },
  {
    name: 'Exprimidor de Cítricos Eléctrico 1L', price: 24990, stock: 40, category: 'Electrodomésticos',
    description: 'Exprimidor eléctrico con jarra de 1 litro, giro reversible y filtro para pulpa. Piezas desmontables para servir y limpiar con comodidad.',
    image: '/img/ExprimidorCitricos.png', rating: 4.1, reviews: 88,
  },
  {
    name: 'Auriculares Bluetooth Inalámbricos', price: 34990, stock: 30, category: 'Electrónica',
    description: 'Auriculares inalámbricos Bluetooth con micrófono integrado, controles en el dispositivo y estuche de carga compacto. Compatibles con celulares, tablets y computadoras.',
    image: '/img/AuricularesBluetooth.png', rating: 4.5, reviews: 180,
  },
  {
    name: 'Smart TV LED 43 pulgadas', price: 459990, stock: 7, category: 'Electrónica',
    description: 'Televisor LED Smart de 43 pulgadas con resolución Full HD, Wi-Fi integrado, aplicaciones de streaming y puertos HDMI y USB para conectar otros dispositivos.',
    image: '/img/SmartTV43.png', rating: 4.6, reviews: 134,
  },
  {
    name: 'Router TP-Link Archer Wi-Fi', price: 89990, stock: 18, category: 'Electrónica',
    description: 'Router inalámbrico de doble banda con cuatro antenas externas, puertos Ethernet y configuración guiada. Diseñado para conectar varios dispositivos en el hogar.',
    image: '/img/RouterTP-LinkArcher.png', rating: 4.5, reviews: 216,
  },
  {
    name: 'Repetidor Wi-Fi TP-Link', price: 49990, stock: 22, category: 'Electrónica',
    description: 'Extensor de señal Wi-Fi con indicador de intensidad y configuración sencilla. Ayuda a ampliar la cobertura de la red en ambientes alejados del router.',
    image: '/img/RepetidorTP-Link.png', rating: 4.2, reviews: 91,
  },
  {
    name: 'Cámara de Seguridad Exterior', price: 119990, stock: 11, category: 'Electrónica',
    description: 'Cámara de seguridad para exterior con visión nocturna, detección de movimiento y acceso remoto desde una aplicación. Carcasa resistente para instalación en exteriores.',
    image: '/img/CamaraSeguridadExterior.png', rating: 4.3, reviews: 73,
  },
  {
    name: 'Disco Externo 1TB', price: 99990, stock: 14, category: 'Electrónica',
    description: 'Disco externo portátil de 1 TB con conexión USB para guardar y transportar documentos, fotos y videos. Compatible con computadoras de escritorio y notebooks.',
    image: '/img/DiscoExterno1TB.png', rating: 4.6, reviews: 158,
  },
  {
    name: 'Gabinete Kit Mid Tower', price: 134990, stock: 9, category: 'Electrónica',
    description: 'Gabinete mid tower con espacio para armado de PC, ventilación frontal y panel lateral transparente. Compatible con formatos de placa madre ATX y micro-ATX.',
    image: '/img/GabineteKitMidTower.png', rating: 4.4, reviews: 56,
  },
  {
    name: 'Hub USB-C de 4 Puertos', price: 32990, stock: 26, category: 'Electrónica',
    description: 'Hub compacto con conector USB-C y cuatro puertos USB para ampliar las conexiones de notebooks y tablets compatibles. Diseño portátil para escritorio o viaje.',
    image: '/img/HubUSB-C4Puertos.png', rating: 4.1, reviews: 82,
  },
  {
    name: 'Mouse Logitech M280', price: 27990, stock: 32, category: 'Electrónica',
    description: 'Mouse inalámbrico ergonómico con receptor USB, sensor óptico y diseño cómodo para uso diario. Compatible con Windows, macOS y otros sistemas con conexión USB.',
    image: '/img/MouseLogitechM280.png', rating: 4.7, reviews: 310,
  },
  {
    name: 'Pad Mouse Gamer', price: 14990, stock: 45, category: 'Electrónica',
    description: 'Mouse pad de superficie textil para movimientos precisos y base antideslizante. Compatible con sensores ópticos y láser; fácil de enrollar y transportar.',
    image: '/img/PadMouseGamer.png', rating: 4.3, reviews: 109,
  },
  {
    name: 'Parlante Bluetooth Portátil', price: 54990, stock: 20, category: 'Electrónica',
    description: 'Parlante portátil con conexión Bluetooth, controles integrados y batería recargable. Reproduce música desde celulares, tablets y otros dispositivos compatibles.',
    image: '/img/ParlanteBluetooth.png', rating: 4.4, reviews: 147,
  },
  {
    name: 'Pava Eléctrica', price: 38990, stock: 24, category: 'Electrodomésticos',
    description: 'Pava eléctrica con apagado automático, indicador de nivel de agua y base giratoria. Práctica para calentar agua para mate, té y otras infusiones.',
    image: '/img/PavaEléctrica.png', rating: 4.5, reviews: 128,
  },
  {
    name: 'Pendrive Kingston 64GB', price: 11990, stock: 50, category: 'Electrónica',
    description: 'Memoria USB Kingston de 64 GB para transportar archivos, fotos y documentos. Conexión USB compatible con computadoras y dispositivos con puerto estándar.',
    image: '/img/PendriveKingston64GB.png', rating: 4.6, reviews: 244,
  },
  {
    name: 'Powerbank 20000mAh', price: 69990, stock: 17, category: 'Electrónica',
    description: 'Batería portátil de 20.000 mAh para recargar dispositivos compatibles fuera de casa. Incluye indicadores de carga y múltiples salidas para conectar equipos.',
    image: '/img/Powerbank20000mAh.png', rating: 4.2, reviews: 97,
  },
  {
    name: 'Memoria RAM DDR4 8GB Fury', price: 44990, stock: 16, category: 'Electrónica',
    description: 'Módulo de memoria RAM DDR4 de 8 GB para equipos de escritorio compatibles. Disipador de perfil bajo y formato DIMM; verificar compatibilidad con la placa madre.',
    image: '/img/RAMDDR48GbFury.png', rating: 4.6, reviews: 186,
  },
  {
    name: 'Smartwatch Deportivo', price: 79990, stock: 13, category: 'Electrónica',
    description: 'Reloj inteligente deportivo con seguimiento de actividad, notificaciones y pantalla táctil. Se sincroniza con teléfonos compatibles mediante Bluetooth.',
    image: '/img/SmartwatchDeportivo.png', rating: 4.0, reviews: 75,
  },
  {
    name: 'Soporte de Celular con Carga', price: 25990, stock: 28, category: 'Electrónica',
    description: 'Soporte de escritorio para celular con ángulo ajustable y espacio para conectar el cable de carga. Base estable para videollamadas y visualización de contenido.',
    image: '/img/SoporteCelularCarga.png', rating: 4.1, reviews: 64,
  },
  {
    name: 'SSD Kingston 480GB', price: 84990, stock: 12, category: 'Electrónica',
    description: 'Unidad de estado sólido Kingston de 480 GB para mejorar el almacenamiento y los tiempos de carga de equipos compatibles. Formato SATA de 2,5 pulgadas.',
    image: '/img/SSDKingston480Gb.png', rating: 4.7, reviews: 202,
  },
  {
    name: 'Tablet Lenovo Tab M10', price: 279990, stock: 6, category: 'Electrónica',
    description: 'Tablet Lenovo de 10 pulgadas para navegación, lectura, videollamadas y entretenimiento. Incluye conectividad inalámbrica y sistema operativo Android.',
    image: '/img/TabletLenovoTabM10.png', rating: 4.3, reviews: 119,
  },
  {
    name: 'Webcam Full HD', price: 57990, stock: 19, category: 'Electrónica',
    description: 'Cámara web Full HD con micrófono integrado y conexión USB para reuniones, clases virtuales y transmisiones. Compatible con las principales aplicaciones de videollamadas.',
    image: '/img/WebcamFullHD.png', rating: 4.2, reviews: 84,
  },
  {
    name: 'Aro de Luz LED', price: 21990, stock: 33, category: 'Electrónica',
    description: 'Aro de luz LED con varios niveles de intensidad para mejorar la iluminación de videollamadas, fotografías y transmisiones. Compatible con soportes estándar.',
    image: '/img/ArodeLuzLED.png', rating: 4.1, reviews: 67,
  },
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
          (name, price_cents, stock, category_name, description, image, rating, reviews)
          SELECT $1, $2, $3, $4, $5, $6, $7, $8
         WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = $1)`,
        [
          product.name,
          Math.round(product.price * 100),
          product.stock,
          product.category,
          product.description,
          product.image,
          product.rating,
          product.reviews,
        ],
      );
      await client.query(
        `UPDATE products SET description = $2
         WHERE name = $1 AND description = ''`,
        [product.name, product.description],
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
    console.log(`Catalog seed complete: ${products.length} products with descriptions and ${coupons.length} coupons checked`);
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
