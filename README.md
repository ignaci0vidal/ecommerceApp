# EcommerceApp2

Tienda online en proceso de extracción a cinco aplicaciones independientes: frontend, API Gateway y los microservicios de Usuarios, Catálogo y Pedidos. Cada aplicación backend tiene su propio proceso, dependencias, pruebas y configuración de despliegue; no se comparten modelos ni acceso a bases de datos entre servicios.

> **Estado:** la rama `feature/refactor-microservicios` contiene la primera integración funcional de los cinco componentes. La importación de datos desde SQLite, la equivalencia completa del panel administrativo y las pruebas de extremo a extremo contra bases reales siguen pendientes. Para ver el alcance y las limitaciones vigentes, consultar [MIGRACION-MICROSERVICIOS.md](./MIGRACION-MICROSERVICIOS.md).

## Arquitectura

```text
Navegador
   │
   ▼
Frontend (Vercel)
   │ HTTP/JSON + JWT
   ▼
API Gateway (Render)
   ├── Usuarios (Render) ── MongoDB Atlas
   ├── Catálogo (Render) ── PostgreSQL (Render)
   └── Pedidos (Render) ─── MySQL (Railway)
```

- **Frontend:** tienda, carrito y panel de administración. Todas las llamadas de negocio pasan por el Gateway.
- **API Gateway:** valida JWT, enruta solicitudes y coordina pedidos y cancelaciones. No tiene base de datos.
- **Usuarios:** registro, inicio de sesión, roles y carrito persistido en MongoDB.
- **Catálogo:** productos, categorías, cupones y operaciones transaccionales de inventario en PostgreSQL. Es el único servicio que modifica stock.
- **Pedidos:** pedidos e intentos idempotentes, pagos simulados, comprobantes e historial en MySQL.

## Árbol del repositorio

```text
EcommerceApp2/
├── api-gateway/                 # Gateway independiente (Render)
│   ├── src/
│   │   ├── app.js               # Rutas, autenticación y orquestación
│   │   └── server.js            # Configuración y arranque HTTP
│   ├── test/
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── ms-usuarios/                 # Usuarios independiente (Render + MongoDB Atlas)
│   ├── scripts/                 # Alta inicial de administrador
│   ├── src/
│   │   ├── User.js
│   │   ├── app.js
│   │   └── server.js
│   ├── test/
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── ms-catalogo/                 # Catálogo independiente (Render + PostgreSQL)
│   ├── migrations/              # Esquema y tablas de catálogo/inventario
│   ├── src/
│   │   ├── app.js
│   │   ├── auth.js
│   │   ├── db.js
│   │   ├── migrate.js
│   │   └── server.js
│   ├── test/
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── ms-pedidos/                  # Pedidos independiente (Render + MySQL en Railway)
│   ├── migrations/              # Esquema, pagos y comprobantes
│   ├── src/
│   │   ├── app.js
│   │   ├── auth.js
│   │   ├── db.js
│   │   ├── migrate.js
│   │   └── server.js
│   ├── test/
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── frontend/                    # Aplicación estática independiente (Vercel)
│   ├── css/
│   ├── html/                    # Productos, carrito, login, admin y contacto
│   ├── img/
│   ├── js/
│   ├── config.js                # URL del API Gateway
│   ├── server.js                # Servidor estático para desarrollo/Compose
│   └── vercel.json
├── docs-microservicios/
│   └── openapi.yaml             # Contrato inicial de la API
├── docker-compose.yml           # Stack local: 5 aplicaciones y 3 bases
├── render.yaml                  # Blueprint de los 4 backends en Render
├── MIGRACION-MICROSERVICIOS.md  # Decisiones, matriz de migración y pendientes
├── README-MICROSERVICIOS.md     # Guía detallada de ejecución y despliegue
│
├── src/                         # Backend original SQLite (legado, no usado por Compose)
├── html/, css/, js/, img/       # Frontend original del monolito
├── server.js                    # Servidor original del monolito
├── ecommerce.sqlite.sql         # Exportación SQL original
├── seed_*.js                    # Seeds originales del monolito
└── package.json                 # Dependencias/comandos originales; no levanta microservicios
```

## Requisitos

- Node.js 22 o superior para ejecutar aplicaciones y pruebas.
- Docker Desktop con el motor Linux para levantar todo el stack local.
- Para despliegue: cuentas/instancias configuradas en Vercel, Render, MongoDB Atlas, Render Postgres y Railway MySQL.

## Ejecutar localmente

Desde la raíz del repositorio:

```powershell
docker compose up --build
```

Luego abrir <http://localhost:8080>. Compose arranca el frontend, Gateway, los tres microservicios y MongoDB, PostgreSQL y MySQL, y ejecuta las migraciones de Catálogo y Pedidos. Para detener el stack:

```powershell
docker compose down
```

Los datos se guardan en volúmenes de Docker. `docker compose down -v` también los elimina; usarlo solo si se desea reiniciar las bases locales.

### Cargar datos de prueba

Con el stack iniciado, abrir otra terminal en la raíz y ejecutar:

```powershell
docker compose exec ms-catalogo npm run seed
docker compose exec ms-usuarios npm run seed
```

El seed de Catálogo agrega productos de muestra con descripción, imagen local, precio, stock y categorías específicas (por ejemplo, Gaming, Periféricos PC, Componentes PC, Almacenamiento y Redes y Conectividad), además de cupones. Al volver a ejecutarlo, corrige las categorías y completa descripciones o imágenes faltantes sin duplicar productos ni restablecer el stock. El seed de Usuarios crea cuentas locales de ejemplo para probar el login y el panel; incluye perfiles demo con nombres de figuras públicas y correos ficticios `@example.com`:

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | `admin@example.com` | `demo1234` |
| Cliente | `cliente@example.com` | `demo1234` |

Los perfiles demo adicionales también usan la contraseña `demo1234`.

Estas credenciales son exclusivamente para desarrollo local; el seed de Usuarios se niega a ejecutarse cuando `NODE_ENV=production`.

### Ejecutar aplicaciones sin Docker

Cada backend requiere su propia base de datos accesible y un archivo `.env` creado a partir de su `.env.example`. Instalar y ejecutar las aplicaciones en terminales separadas:

```powershell
cd ms-usuarios
npm ci
npm start
```

```powershell
cd ms-catalogo
npm ci
npm run migrate
npm start
```

```powershell
cd ms-pedidos
npm ci
npm run migrate
npm start
```

```powershell
cd api-gateway
npm ci
npm start
```

```powershell
cd frontend
npm start
```

Puertos predeterminados: frontend `8080`, Gateway `3000`, Usuarios `3101`, Catálogo `3102` y Pedidos `3103`. El frontend lee la URL del Gateway desde `frontend/config.js`. La configuración inicial apunta a `http://127.0.0.1:3000`.

## Pruebas

Las suites de cada backend se ejecutan por separado:

```powershell
cd api-gateway; npm ci; npm test
cd ..\ms-usuarios; npm ci; npm test
cd ..\ms-catalogo; npm ci; npm test
cd ..\ms-pedidos; npm ci; npm test
```

Estas pruebas usan dependencias simuladas para comprobar contratos y lógica de aplicación; no sustituyen la validación de transacciones contra motores reales.

## Configuración y seguridad

Crear variables de entorno usando los ejemplos de cada aplicación; no guardar `.env` ni secretos en Git.

| Aplicación | Variables principales |
|---|---|
| Gateway | `JWT_SECRET`, `SERVICE_TOKEN`, `FRONTEND_ORIGIN`, `USERS_SERVICE_URL`, `CATALOG_SERVICE_URL`, `ORDERS_SERVICE_URL`, `UPSTREAM_TIMEOUT_MS` |
| Usuarios | `MONGODB_URI`, `JWT_SECRET`, `PORT` |
| Catálogo | `DATABASE_URL`, `DATABASE_SSL`, `JWT_SECRET`, `SERVICE_TOKEN`, `PORT` |
| Pedidos | `DATABASE_URL`, `DATABASE_SSL`, `SERVICE_TOKEN`, `PORT` |

En producción, usar secretos aleatorios distintos para JWT y comunicación entre servicios, con al menos 32 caracteres. Habilitar TLS para las conexiones de bases remotas. Railway aloja únicamente la base MySQL: el servicio de Pedidos se ejecuta en Render.

El alta inicial de administrador requiere que el usuario ya esté registrado en Usuarios:

```powershell
cd ms-usuarios
npm run set-admin -- correo@ejemplo.com
```

## Despliegue

- **Frontend:** desplegar `frontend/` en Vercel y configurar `frontend/config.js` con la URL HTTPS del Gateway.
- **Backend:** `render.yaml` describe cuatro servicios Docker independientes en Render: Gateway, Usuarios, Catálogo y Pedidos. Configurar las variables y bases externas descritas arriba; aplicar las migraciones SQL de Catálogo y Pedidos antes de habilitar tráfico.
- **CORS:** configurar `FRONTEND_ORIGIN` en Gateway con el dominio publicado del frontend. Admite una lista de orígenes separada por comas si también se necesita un dominio adicional.

La configuración de infraestructura no crea automáticamente las bases externas ni importa los datos SQLite existentes. La guía completa y el estado de cada pendiente están en [README-MICROSERVICIOS.md](./README-MICROSERVICIOS.md).
