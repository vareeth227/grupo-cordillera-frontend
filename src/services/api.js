const API_BASE = import.meta.env.VITE_API_GATEWAY_URL || ''

// Singleton: el token se obtiene una sola vez al primer request
let _tokenPromise = null

function acquireToken() {
  if (_tokenPromise) return _tokenPromise
  _tokenPromise = fetch(`${API_BASE}/api/clientes/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@cordillera.cl', password: 'admin123' })
  })
    .then(r => r.ok ? r.json() : null)
    .then(data => data?.token ?? null)
    .catch(() => null)
  return _tokenPromise
}

async function fetchAPI(path, options = {}) {
  const token = await acquireToken()
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const response = await fetch(`${API_BASE}${path}`, { headers, ...options })
  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || `Error ${response.status}`)
  }
  if (response.status === 204) return null
  return response.json()
}

// ──────────── VENTAS ────────────

export const getPuntosDeVenta = () => fetchAPI('/api/ventas/puntos/activos')
export const getTransacciones = () => fetchAPI('/api/ventas/transacciones')
export const getReporteDiario = (fecha) => fetchAPI(`/api/ventas/reporte-diario?fecha=${fecha}`)
export const registrarVenta = (data) => fetchAPI('/api/ventas/transacciones/venta', {
  method: 'POST', body: JSON.stringify(data)
})

// ──────────── ECOMMERCE ────────────

export const getPedidos = () => fetchAPI('/api/ecommerce/pedidos')
export const getPedidosPorEstado = (estado) => fetchAPI(`/api/ecommerce/pedidos/estado/${estado}`)
export const getPedido = (id) => fetchAPI(`/api/ecommerce/pedidos/${id}`)

// ──────────── INVENTARIO ────────────

export const getProductos = () => fetchAPI('/api/inventario/productos/activos')
export const getTodosProductos = () => fetchAPI('/api/inventario/productos')
export const getStock = () => fetchAPI('/api/inventario/stock')
export const getAlertas = () => fetchAPI('/api/inventario/alertas')
export const crearProducto = (data) => fetchAPI('/api/inventario/productos', {
  method: 'POST', body: JSON.stringify(data)
})
export const eliminarProducto = (id) => fetchAPI(`/api/inventario/productos/${id}`, { method: 'DELETE' })
export const crearStock = (data) => fetchAPI('/api/inventario/stock', {
  method: 'POST', body: JSON.stringify(data)
})

// ──────────── FINANCIERO ────────────

export const getKpis = (inicio, fin) =>
  fetchAPI(`/api/financiero/kpis?inicio=${inicio}&fin=${fin}`)
export const getIngresos = () => fetchAPI('/api/financiero/ingresos')
export const getEgresos = () => fetchAPI('/api/financiero/egresos')

// ──────────── CLIENTES ────────────

export const getClientes = () => fetchAPI('/api/clientes/activos')
export const getTodosClientes = () => fetchAPI('/api/clientes')
export const getTickets = () => fetchAPI('/api/clientes/tickets')
export const getTicketsPorEstado = (estado) =>
  fetchAPI(`/api/clientes/tickets/estado/${estado}`)
export const desactivarCliente = (id) => fetchAPI(`/api/clientes/${id}/desactivar`, { method: 'PATCH' })
export const eliminarCliente = (id) => fetchAPI(`/api/clientes/${id}`, { method: 'DELETE' })
