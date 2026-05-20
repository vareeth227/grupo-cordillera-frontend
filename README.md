# Grupo Cordillera — Frontend (Dashboard Ejecutivo)

Dashboard ejecutivo en React que consume los 5 microservicios del sistema Grupo Cordillera a través del API Gateway.

---

## Qué hace

| Sección | Funcionalidades |
|---|---|
| **Ventas** | Reporte diario por fecha, puntos de venta activos, registrar nueva venta |
| **Ecommerce** | Listado de pedidos online, filtro por estado |
| **Inventario** | Catálogo de productos, stock por local, alertas de inventario bajo |
| **Financiero** | KPIs de rentabilidad, ingresos y egresos por período |
| **Clientes** | CRM: clientes activos/inactivos, tickets de atención por estado |

Autenticación JWT automática: al primer request el sistema obtiene un token de `ms-clientes` y lo adjunta a todas las llamadas siguientes.

---

## Requisitos

| Herramienta | Versión mínima | Verificar |
|---|---|---|
| Node.js | 18+ | `node --version` |
| npm | incluido con Node | `npm --version` |
| Docker | (solo para producción) | `docker --version` |

El backend (API Gateway en puerto 9090) debe estar corriendo antes de abrir el frontend.
Repositorio del backend: [grupo-cordillera-servicios](https://github.com/vareeth227/grupo-cordillera-servicios)

---

## Inicio en desarrollo (misma PC que el backend)

### Paso 1 — Clonar e instalar dependencias

```powershell
git clone https://github.com/vareeth227/grupo-cordillera-frontend.git
cd grupo-cordillera-frontend
npm install
```

### Paso 2 — Iniciar el servidor de desarrollo

```powershell
npm run dev
```

### Paso 3 — Abrir en el navegador

```
http://localhost:5173
```

El proxy de Vite redirige automáticamente `/api/*` al API Gateway en `localhost:9090`. No se necesita configuración adicional.

**Detener:** presiona `Ctrl + C` en la terminal.

---

## Inicio con dos PCs (frontend y backend en máquinas distintas)

Esta es la configuración para presentación: el backend corre en **PC-B** y el frontend en **PC-A**.

### En PC-B (backend)

```powershell
# 1. Levantar el backend
cd grupo-cordillera-servicios
docker-compose up -d

# 2. Obtener la IP de esta máquina
ipconfig
# Busca: "Dirección IPv4" → ejemplo: 192.168.1.135
```

### En PC-A (frontend) — opción Docker

```powershell
# Construir y levantar el frontend con la IP del backend
$env:BACKEND_HOST = "192.168.1.135"
docker-compose up -d --build
```

Abrir en el navegador: `http://localhost:5173`

Nginx actúa de proxy: reenvía `/api/*` al gateway en `192.168.1.135:9090`.

### En PC-A (frontend) — opción desarrollo (sin Docker)

Editar `vite.config.js` y cambiar el `target` del proxy:

```js
proxy: {
  '/api': {
    target: 'http://192.168.1.135:9090',  // ← IP de PC-B
    changeOrigin: true,
  }
}
```

```powershell
npm install
npm run dev
```

---

## Variables de entorno

### En desarrollo (`vite.config.js`)

El proxy de Vite ya está configurado a `http://localhost:9090`. Solo cambia la IP si el backend está en otra máquina (ver sección anterior).

### En Docker (`.env` opcional)

```env
# IP de la PC donde corre el API Gateway
BACKEND_HOST=192.168.1.135
```

> El archivo `.env` está en `.gitignore` y nunca se sube al repositorio.

---

## Construcción para producción

```powershell
# Construir los archivos estáticos
npm run build

# Previsualizar el build localmente
npm run preview
```

### Docker (producción)

```powershell
# Construir imagen
docker-compose up -d --build

# El contenedor queda disponible en http://localhost:5173
```

La imagen Docker usa **Nginx** para servir el build y actuar de proxy hacia el backend. El `BACKEND_HOST` se inyecta en runtime al arrancar el contenedor — no hace falta reconstruir la imagen para cambiar la IP del backend.

---

## Estructura del proyecto

```
grupo-cordillera-frontend/
├── src/
│   ├── components/
│   │   └── Navbar.jsx              # Navegación entre secciones
│   ├── sections/
│   │   ├── VentasSection.jsx       # Dashboard de ventas
│   │   ├── EcommerceSection.jsx    # Gestión de pedidos
│   │   ├── InventarioSection.jsx   # Control de stock
│   │   ├── FinancieroSection.jsx   # KPIs financieros
│   │   └── ClientesSection.jsx     # CRM y tickets
│   ├── services/
│   │   └── api.js                  # 20+ funciones de llamada al gateway
│   ├── App.jsx
│   └── main.jsx
├── nginx.conf.template             # Proxy Nginx con BACKEND_HOST dinámico
├── Dockerfile                      # Multi-stage: Node build + Nginx serve
├── docker-compose.yml              # Para ejecutar en Docker con BACKEND_HOST
└── vite.config.js                  # Proxy de desarrollo hacia localhost:9090
```

---

## Cómo fluye una petición

```
Browser
  └─► GET /api/ventas/reporte-diario?fecha=2026-05-19
        │
        ├─ En desarrollo: Vite proxy ──► http://localhost:9090/api/ventas/...
        └─ En Docker:     Nginx      ──► http://${BACKEND_HOST}:9090/api/ventas/...
                                               │
                                         API Gateway (rewrite)
                                               │
                                         /ventas/reporte-diario
                                               │
                                         ms-ventas:9091
                                               │
                                         PostgreSQL db_ventas
```

---

## Endpoints consumidos

### Ventas
```
GET  /api/ventas/puntos/activos
GET  /api/ventas/transacciones
GET  /api/ventas/reporte-diario?fecha=YYYY-MM-DD
POST /api/ventas/transacciones/venta
```

### Ecommerce
```
GET  /api/ecommerce/pedidos
GET  /api/ecommerce/pedidos/estado/{estado}
GET  /api/ecommerce/pedidos/{id}
```

### Inventario
```
GET    /api/inventario/productos/activos
GET    /api/inventario/productos
GET    /api/inventario/stock
GET    /api/inventario/alertas
POST   /api/inventario/productos
DELETE /api/inventario/productos/{id}
POST   /api/inventario/stock
```

### Financiero
```
GET  /api/financiero/kpis?inicio=YYYY-MM-DD&fin=YYYY-MM-DD
GET  /api/financiero/ingresos
GET  /api/financiero/egresos
```

### Clientes y autenticación
```
POST  /api/clientes/auth/login
GET   /api/clientes/activos
GET   /api/clientes
GET   /api/clientes/tickets
GET   /api/clientes/tickets/estado/{estado}
PATCH /api/clientes/{id}/desactivar
DELETE /api/clientes/{id}
```

---

## Troubleshooting

| Problema | Causa probable | Solución |
|---|---|---|
| Página carga pero sin datos | Backend no responde | Verificar `http://localhost:9090/actuator/health` |
| `ERR_CONNECTION_REFUSED` | API Gateway no levantó | Revisar logs del backend: `docker-compose logs api-gateway` |
| `CORS error` en consola | IP del backend incorrecta en el proxy | Verificar `vite.config.js` o `BACKEND_HOST` |
| `401 Unauthorized` | Token JWT expirado | Recargar la página (el token se renueva automáticamente) |
| `502 Bad Gateway` | Microservicio individual caído | El Circuit Breaker devolverá 503; revisar logs del MS específico |
| Puerto 5173 ocupado | Otro proceso en ese puerto | `netstat -ano \| findstr "5173"` → `taskkill /PID <N> /F` |
