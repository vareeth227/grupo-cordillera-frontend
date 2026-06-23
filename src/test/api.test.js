import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Reset module registry between tests so _tokenPromise singleton resets
describe('api service', () => {
  let api

  beforeEach(async () => {
    vi.resetModules()
    // Default: login succeeds and returns a token
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ token: 'test-token-123' })
      })
    api = await import('../services/api.js')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('getPuntosDeVenta llama al endpoint correcto', async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve([{ id: 1, nombre: 'Tienda Centro' }])
      })

    const result = await api.getPuntosDeVenta()

    const calls = global.fetch.mock.calls
    const apiCall = calls.find(c => c[0].includes('/api/ventas/puntos/activos'))
    expect(apiCall).toBeDefined()
    expect(result).toEqual([{ id: 1, nombre: 'Tienda Centro' }])
  })

  it('getProductos llama al endpoint de productos activos', async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve([{ id: 1, codigo: 'SKU-001', activo: true }])
      })

    const result = await api.getProductos()

    const calls = global.fetch.mock.calls
    const apiCall = calls.find(c => c[0].includes('/api/inventario/productos/activos'))
    expect(apiCall).toBeDefined()
    expect(result[0].codigo).toBe('SKU-001')
  })

  it('getClientes llama al endpoint correcto', async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve([{ id: 1, nombre: 'Juan' }])
      })

    const result = await api.getClientes()

    const calls = global.fetch.mock.calls
    const apiCall = calls.find(c => c[0].includes('/api/clientes/activos'))
    expect(apiCall).toBeDefined()
    expect(result[0].nombre).toBe('Juan')
  })

  it('getKpis incluye parámetros de fecha en la URL', async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ totalIngresos: 500000 })
      })

    await api.getKpis('2025-01-01', '2025-01-31')

    const calls = global.fetch.mock.calls
    const apiCall = calls.find(c => c[0].includes('/api/financiero/kpis'))
    expect(apiCall).toBeDefined()
    expect(apiCall[0]).toContain('inicio=2025-01-01')
    expect(apiCall[0]).toContain('fin=2025-01-31')
  })

  it('lanza error cuando el response no es ok', async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Internal Server Error')
      })

    await expect(api.getPedidos()).rejects.toThrow('Internal Server Error')
  })

  it('eliminarProducto usa método DELETE', async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: () => Promise.resolve(null)
      })

    await api.eliminarProducto(5)

    const calls = global.fetch.mock.calls
    const deleteCall = calls.find(c => c[0].includes('/api/inventario/productos/5'))
    expect(deleteCall).toBeDefined()
    expect(deleteCall[1].method).toBe('DELETE')
  })

  it('registrarVenta usa método POST con body', async () => {
    const ventaData = { monto: 50000, productoId: 1 }
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: 10, ...ventaData })
      })

    await api.registrarVenta(ventaData)

    const calls = global.fetch.mock.calls
    const postCall = calls.find(c => c[0].includes('/api/ventas/transacciones/venta'))
    expect(postCall).toBeDefined()
    expect(postCall[1].method).toBe('POST')
    expect(postCall[1].body).toBe(JSON.stringify(ventaData))
  })
})
