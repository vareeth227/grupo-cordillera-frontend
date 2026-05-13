# Grupo Cordillera — Frontend

Dashboard ejecutivo del sistema de monitoreo organizacional Grupo Cordillera.  
Desarrollado con **React 18 + Vite**. En producción se sirve con **Nginx** vía Docker.

> El **API Gateway debe estar corriendo** en el puerto 9090 antes de iniciar el frontend.  
> Ver: [grupo-cordillera-servicios](https://github.com/vareeth227/grupo-cordillera-servicios)

---

## Requisitos

| Herramienta  | Versión mínima | Verificar       |
|---|---|---|
| Node.js      | 18+            | `node -v`       |
| Docker Desktop | cualquiera   | `docker --version` |

---

## Opción A — Docker Compose (recomendado para evaluación)

Abre **PowerShell** en esta carpeta.

**Paso 1 — Construir la imagen**
```powershell
docker build -t grupo-cordillera-frontend .
```

**Paso 2 — Ejecutar el contenedor**
```powershell
docker run -d -p 5173:80 --name frontend-cordillera grupo-cordillera-frontend
```

**Paso 3 — Abrir en el navegador**
```
http://localhost:5173
```

**Detener**
```powershell
docker stop frontend-cordillera
docker rm frontend-cordillera
```

---

## Opción B — Node.js directo (desarrollo)

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
| Inventario  | Catálogo de productos, stock y alertas de reposición    |
| Financiero  | KPIs de rentabilidad, ingresos y egresos por período    |
| Clientes    | CRM: gestión de clientes y tickets de atención          |

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
