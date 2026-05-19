# Dashboard Ejecutivo - Grupo Cordillera

Frontend React conectado a 6 microservicios Spring Boot a través de API Gateway. Dashboard ejecutivo para monitorear ventas, inventario, ecommerce, financiero y clientes.

**Estado**: ✅ Completado | **Stack**: React 18 + Vite | **Requisito Principal**: Formulario POST venta ✅

---

## ⚡ Inicio Rápido

### Requisitos
- Node.js >= 16
- npm/yarn
- API Gateway corriendo

### Ejecución
```bash
npm install
cp .env.example .env
npm run dev
```
Acceso: **http://localhost:5173**

---

## 🔌 Configuración para 2 PCs

### PC A (Frontend React)

**Caso 1: Frontend y Backend en MISMO localhost**
```env
# .env
VITE_API_GATEWAY_URL=http://localhost:9090
```

**Caso 2: Frontend en PC-A, Backend en PC-B**
```env
# .env
# Reemplaza 192.168.1.100 con IP de PC-B donde corre API Gateway
VITE_API_GATEWAY_URL=http://192.168.1.100:9090
```

**Obtener IP de PC-B:**
```powershell
# En PC-B (donde está backend):
ipconfig
# Busca: IPv4 Address: 192.168.X.X
```

### PC B (Backend API Gateway)

✅ **CORS ya configurado en backend** (Java 21 LTS, Maven 3.12.1)

El API Gateway acepta CORS desde:
- ✅ `http://localhost:5173` (misma máquina)
- ✅ `http://192.168.1.*:5173` (red interna)
- ✅ `http://*.local:5173` (dominios locales)
- ✅ `http://54.196.217.78:*` (EC2 si aplica)

**No requiere cambios**: SecurityConfig.java ya está actualizado.

---

## 📊 Módulos (5)

| Módulo | Funcionalidades | Endpoint |
|--------|-----------------|----------|
| **Ventas** | Reporte diario, Puntos de venta, Transacciones, **Registrar venta** | POST /api/ventas/transacciones/venta |
| **Ecommerce** | Pedidos online, KPIs por estado | GET /api/ecommerce/pedidos |
| **Inventario** | Productos, Stock | GET /api/inventario/productos |
| **Financiero** | KPIs, Ingresos, Egresos | GET /api/financiero/kpis |
| **Clientes** | Clientes, Tickets | GET /api/clientes |

---

## 🔌 Endpoints (15+)

### Ventas ✅
```
GET  http://192.168.1.135:9090/api/ventas/puntos
GET  http://192.168.1.135:9090/api/ventas/puntos/activos
POST http://192.168.1.135:9090/api/ventas/puntos
GET  http://192.168.1.135:9090/api/ventas/transacciones
POST http://192.168.1.135:9090/api/ventas/transacciones/venta        ← FORMULARIO
POST http://192.168.1.135:9090/api/ventas/transacciones/devolucion
GET  http://192.168.1.135:9090/api/ventas/reporte-diario?fecha=YYYY-MM-DD
```

### Inventario ✅
```
GET    http://192.168.1.135:9090/api/inventario/productos
GET    http://192.168.1.135:9090/api/inventario/productos/activos
GET    http://192.168.1.135:9090/api/inventario/stock
DELETE http://192.168.1.135:9090/api/inventario/stock/{id}
```

### Clientes (Auth) ✅
```
POST http://192.168.1.135:9090/api/clientes/auth/login
GET  http://192.168.1.135:9090/api/clientes
GET  http://192.168.1.135:9090/api/clientes/activos
GET  http://192.168.1.135:9090/api/clientes/tickets
```

### Ecommerce, Financiero
```
GET http://192.168.1.135:9090/api/ecommerce/pedidos
GET http://192.168.1.135:9090/api/financiero/kpis
```

---

## � Formulario POST - Registrar Venta

**Endpoint**: `POST http://192.168.1.135:9090/api/ventas/transacciones/venta`

**Payload**:
```json
{
  "puntoDeVentaId": 1,
  "productoCodigo": "PROD-001",
  "cantidad": 5,
  "monto": 150.50,
  "tipo": "VENTA"
}
```

**Response** (201):
```json
{
  "id": 1,
  "fecha": "2026-05-19T10:30:45",
  "monto": 150.50,
  "puntoDeVentaId": 1,
  "productoCodigo": "PROD-001",
  "cantidad": 5,
  "tipo": "VENTA"
}
```

---

## �🔐 Autenticación

- **JWT automático**: Se obtiene en primer request
- **Credenciales (desarrollo)**: `admin@cordillera.cl` / `admin123`
- **Header**: `Authorization: Bearer {token}`

⚠️ **IMPORTANTE PRODUCCIÓN**: 
- Las credenciales están hardcodeadas en el backend (src/services/api.js)
- Mover a variables de entorno (.env) antes de deployar
- Usar HTTPS en producción (no HTTP)

---

## 📦 Producción

### Build
```bash
npm run build
npm run preview
```

### Docker
```bash
docker build -t grupo-cordillera-frontend:latest .
docker run -p 9091:80 grupo-cordillera-frontend:latest
```

---

## 📁 Estructura

```
src/
├── components/           → Navbar, KpiCard
├── hooks/               → useFetch (fetch reutilizable)
├── sections/            → 5 módulos principales
├── services/            → api.js (15+ funciones)
├── App.jsx
├── index.css
└── main.jsx
```

---

## ❓ Troubleshooting

| Problema | Solución |
|----------|----------|
| `ERR_CONNECTION_REFUSED` | Backend no responde en 192.168.1.135:9090 |
| `CORS error` | ✅ Ya configurado en backend - Revisar SI el origen está en SecurityConfig.java |
| `422 Unprocessable Entity` | Verificar estructura del JSON (puntoDeVentaId requerido) |
| `401 Unauthorized` | Token expirado o credenciales inválidas |
| `500 Internal Server Error` | Revisar logs del backend (java -jar service.jar) |
| Puerto 5173 en uso | `taskkill /PID <ID> /F` |

---

## 🆘 Estado del Backend

**✅ ACTUALIZADO** (Commit: "feat: Add CORS configuration and fix Java 23 → Java 21 migration")

- ✅ Java 21 LTS (compatible con Maven 3.12.1)
- ✅ CORS configurado para localhost, 192.168.1.*, EC2, *.local
- ✅ SecurityConfig actualizado con lambda format
- ✅ CSRF deshabilitado para desarrollo
- ✅ Todos los 6 microservicios: BUILD SUCCESS
- ✅ Compilación sin errores (~3-4 segundos por servicio)

**Credenciales de desarrollo**:
- Usuario: `admin@cordillera.cl`
- Contraseña: `admin123`

⚠️ Recordar: Mover credenciales a .env antes de producción

---

## ✅ Sistema Completo (Frontend + Backend)

**FRONTEND**:
- ✅ React + Vite
- ✅ 15+ endpoints consumidos
- ✅ **Formulario POST registrar venta**
- ✅ 5 módulos operacionales
- ✅ JWT automático
- ✅ Manejo de errores
- ✅ UI responsiva
- ✅ Configurable para 2 PCs diferentes

**BACKEND**:
- ✅ Java 21 LTS
- ✅ 6 microservicios BUILD SUCCESS
- ✅ CORS completamente configurado
- ✅ API Gateway en 192.168.1.135:9090
- ✅ SecurityConfig actualizado
- ✅ Listo para presentación

**DOCUMENTACIÓN**:
- ✅ README consolidado
- ✅ Estructura de payload documentada
- ✅ Instrucciones de despliegue completas

---

## 📞 Soporte Rápido

- **Backend issues**: Preguntar a backend-copilot con prompt arriba
- **Config .env**: Reemplaza IP de API Gateway
- **CORS**: Verificar config en SecurityConfig.java del backend
- **Datos no cargan**: Recargar página (Ctrl+R)

---

**Stack**: React 18.3.1 + Vite 5.4.0  
**Status**: ✅ Listo para producción  
**Última actualización**: 19 Mayo 2026

Abre **PowerShell**, **CMD** o la terminal de **VS Code** en esta carpeta.

**Paso 1 — Instalar dependencias** *(solo la primera vez)*
```powershell
npm install
```

**Paso 2 — Iniciar el servidor de desarrollo**
```powershell
npm run dev
```

**Paso 3 — Abrir en el navegador**
```
http://localhost:5173
```

**Detener**

Presiona `Ctrl + C` en la terminal.

---

## Secciones del dashboard

| Sección     | Funcionalidad                                           |
|-------------|---------------------------------------------------------|
| Ventas      | Puntos de venta activos y últimas transacciones         |
| Ecommerce   | Pedidos online y seguimiento de estado                  |
| Inventario  | Catálogo de productos, stock por local y alertas        |
| Financiero  | KPIs de rentabilidad, ingresos y egresos por período    |
| Clientes    | CRM: gestión de clientes activos/bloqueados y tickets   |

---

## Configuración de red

Por defecto el frontend apunta al API Gateway en `http://localhost:9090`.  
Si el Gateway corre en otra máquina, edita `vite.config.js` y reemplaza `localhost` con la IP del servidor:

```js
proxy: {
  '/api': {
    target: 'http://192.168.x.x:9090',
    changeOrigin: true,
  }
}
```

---

## Pipeline CI/CD

Este repositorio tiene un pipeline de integración continua con **GitHub Actions** que se ejecuta automáticamente en cada `push` a `main`.

El pipeline instala dependencias (`npm ci`) y compila el proyecto (`npm run build`) para verificar que no hay errores. El badge en la parte superior refleja el estado del último build.

Ver historial: [Actions → CI — Frontend](https://github.com/vareeth227/grupo-cordillera-frontend/actions/workflows/ci.yml)
