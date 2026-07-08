import { useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { getTodosProductos, getAlertas, getStock, crearProducto, eliminarProducto, crearStock } from '../services/api'
import KpiCard from '../components/KpiCard'
import { SkeletonKpis, SkeletonTable } from '../components/Skeleton'
import { useToast } from '../components/Toast'
import { DEMO_PRODUCTOS, DEMO_ALERTAS, DEMO_STOCK } from '../services/demo'

const inputStyle = {
  width: '100%', padding: '8px 10px', border: '1px solid #d0d5de',
  borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box'
}
const labelStyle = { display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 600, color: '#555' }
const btnPrimary = {
  background: '#8a30b0', color: '#fff', padding: '8px 20px',
  border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 600
}
const btnSecondary = {
  background: '#e8ecf0', color: '#333', padding: '8px 16px',
  border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px'
}
const btnDanger = {
  background: '#c0392b', color: '#fff', padding: '4px 10px',
  border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600
}
const btnSuccess = {
  background: '#1a7a3e', color: '#fff', padding: '4px 10px',
  border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, marginRight: '4px'
}

const FORM_VACIO = { codigo: '', nombre: '', categoria: '', categoriaCustom: '', descripcion: '', precio: '', stockAlmacen: '', stockAlmacenCustom: '', stockCantidad: '', stockUmbral: '' }
const STOCK_VACIO = { almacen: '', almacenCustom: '', cantidad: '', umbralMinimo: '' }

export default function InventarioSection() {
  const [refresh, setRefresh] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(FORM_VACIO)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState(null)

  // Estado para el formulario de stock inline por producto
  const [stockProductoId, setStockProductoId] = useState(null)
  const [stockForm, setStockForm] = useState(STOCK_VACIO)
  const [stockSaving, setStockSaving] = useState(false)
  const [stockError, setStockError] = useState(null)

  const showToast = useToast()

  const { data: productos, loading: lProd, error: eProd } = useFetch(getTodosProductos, [refresh], DEMO_PRODUCTOS)
  const { data: alertas, loading: lAlert, error: eAlert } = useFetch(getAlertas, [refresh], DEMO_ALERTAS)
  const { data: stock, loading: lStock } = useFetch(getStock, [refresh], DEMO_STOCK)

  const activos = productos?.filter(p => p.activo) || []

  const categorias = [...new Set(productos?.map(p => p.categoria).filter(Boolean) || [])]
  const almacenes = [...new Set(stock?.map(s => s.almacen).filter(Boolean) || [])]

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const categoriaFinal = form.categoria === '__nueva__' ? form.categoriaCustom : form.categoria
  const stockAlmacenFinal = form.stockAlmacen === '__nuevo__' ? form.stockAlmacenCustom : form.stockAlmacen

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!categoriaFinal.trim()) { setFormError('Debes ingresar una categoría'); return }
    if (form.stockAlmacen && !stockAlmacenFinal.trim()) { setFormError('Debes ingresar el nombre del local'); return }
    setSaving(true)
    setFormError(null)
    try {
      const { codigo, nombre, descripcion, precio } = form
      const producto = await crearProducto({ codigo, nombre, descripcion, categoria: categoriaFinal, precio: Number(precio), activo: true })
      if (stockAlmacenFinal.trim() && form.stockCantidad !== '') {
        await crearStock({
          productoId: producto.id,
          almacen: stockAlmacenFinal,
          cantidad: Number(form.stockCantidad),
          umbralMinimo: Number(form.stockUmbral || 0)
        })
      }
      setForm(FORM_VACIO)
      setShowForm(false)
      setRefresh(r => r + 1)
      showToast('Producto creado correctamente')
    } catch (err) {
      setFormError(err.message)
      showToast(err.message || 'Error al crear el producto', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleEliminar = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar el producto "${nombre}"? Esta acción no se puede deshacer.`)) return
    try {
      await eliminarProducto(id)
      if (stockProductoId === id) setStockProductoId(null)
      setRefresh(r => r + 1)
      showToast(`Producto "${nombre}" eliminado`)
    } catch (err) {
      showToast(err.message || 'Error al eliminar', 'error')
    }
  }

  const abrirStock = (id) => {
    setStockProductoId(stockProductoId === id ? null : id)
    setStockForm(STOCK_VACIO)
    setStockError(null)
  }

  const almacenFinal = stockForm.almacen === '__nuevo__' ? stockForm.almacenCustom : stockForm.almacen

  const handleStockSubmit = async (e, productoId) => {
    e.preventDefault()
    if (!almacenFinal.trim()) { setStockError('Debes ingresar un almacén'); return }
    setStockSaving(true)
    setStockError(null)
    try {
      await crearStock({
        productoId,
        almacen: almacenFinal,
        cantidad: Number(stockForm.cantidad),
        umbralMinimo: Number(stockForm.umbralMinimo)
      })
      setStockProductoId(null)
      setStockForm(STOCK_VACIO)
      setRefresh(r => r + 1)
      showToast('Stock registrado correctamente')
    } catch (err) {
      setStockError(err.message)
      showToast(err.message || 'Error al registrar stock', 'error')
    } finally {
      setStockSaving(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '10px', borderBottom: '2px solid rgba(120, 60, 180, 0.18)' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#3c1060', textTransform: 'uppercase', letterSpacing: '0.6px', margin: 0 }}>Inventario</h2>
        <button style={btnPrimary} onClick={() => { setShowForm(!showForm); setFormError(null) }}>
          {showForm ? 'Cancelar' : '+ Nuevo Producto'}
        </button>
      </div>

      {/* Formulario de nuevo producto */}
      {showForm && (
        <div className="card" style={{ marginBottom: '24px', borderLeft: '4px solid #8a30b0' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '14px', color: '#8a30b0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Registrar Nuevo Producto</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Código *</label>
                <input style={inputStyle} name="codigo" value={form.codigo} onChange={handleChange} placeholder="Ej: PROD-001" required />
              </div>
              <div>
                <label style={labelStyle}>Nombre *</label>
                <input style={inputStyle} name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre del producto" required />
              </div>
              <div>
                <label style={labelStyle}>Categoría *</label>
                <select
                  style={inputStyle}
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                  required={form.categoria !== '__nueva__'}
                >
                  <option value="">-- Selecciona una categoría --</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="__nueva__">+ Nueva categoría...</option>
                </select>
              </div>
              {form.categoria === '__nueva__' && (
                <div>
                  <label style={labelStyle}>Nueva Categoría *</label>
                  <input style={inputStyle} name="categoriaCustom" value={form.categoriaCustom} onChange={handleChange} placeholder="Ej: Electrónica" required />
                </div>
              )}
              <div>
                <label style={labelStyle}>Precio *</label>
                <input style={inputStyle} name="precio" type="number" min="0" step="0.01" value={form.precio} onChange={handleChange} placeholder="0.00" required />
              </div>
              <div style={{ gridColumn: form.categoria === '__nueva__' ? '1 / -1' : 'auto' }}>
                <label style={labelStyle}>Descripción</label>
                <input style={inputStyle} name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción opcional" />
              </div>
            </div>

            {/* Stock inicial */}
            <div style={{ borderTop: '1px solid #e8ecf0', paddingTop: '14px', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Asignar Stock Inicial <span style={{ fontWeight: 400, color: '#999', textTransform: 'none' }}>(opcional)</span>
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div style={{ gridColumn: form.stockAlmacen === '__nuevo__' ? '1 / -1' : 'auto' }}>
                  <label style={labelStyle}>Local / Almacén</label>
                  <select style={inputStyle} name="stockAlmacen" value={form.stockAlmacen}
                    onChange={e => setForm(f => ({ ...f, stockAlmacen: e.target.value, stockAlmacenCustom: '' }))}>
                    <option value="">-- Sin stock inicial --</option>
                    {almacenes.map(a => <option key={a} value={a}>{a}</option>)}
                    <option value="__nuevo__">+ Nuevo local...</option>
                  </select>
                </div>
                {form.stockAlmacen === '__nuevo__' && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Nombre del local *</label>
                    <input style={inputStyle} name="stockAlmacenCustom" value={form.stockAlmacenCustom}
                      onChange={handleChange} placeholder="Ej: Sucursal Norte" required />
                  </div>
                )}
                {form.stockAlmacen && (
                  <>
                    <div>
                      <label style={labelStyle}>Cantidad *</label>
                      <input style={inputStyle} name="stockCantidad" type="number" min="0"
                        value={form.stockCantidad} onChange={handleChange} placeholder="0" required />
                    </div>
                    <div>
                      <label style={labelStyle}>Umbral mínimo</label>
                      <input style={inputStyle} name="stockUmbral" type="number" min="0"
                        value={form.stockUmbral} onChange={handleChange} placeholder="0" />
                    </div>
                  </>
                )}
              </div>
            </div>

            {formError && <div className="error" style={{ marginBottom: '12px' }}>{formError}</div>}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" style={btnPrimary} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar Producto'}
              </button>
              <button type="button" style={btnSecondary} onClick={() => { setShowForm(false); setForm(FORM_VACIO); setFormError(null) }}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* KPIs */}
      {!lProd && !lAlert && (
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <KpiCard titulo="Productos Activos" valor={activos.length} color="#1a7a3e" sparkline={[120,118,125,122,130,128,135]} />
          <KpiCard titulo="Alertas Bajo Stock" valor={alertas?.length || 0} color="#c0392b" subtitulo="requieren reposición" sparkline={[8,12,10,15,11,9,7]} />
          <KpiCard titulo="Registros de Stock" valor={stock?.length || 0} color="#8a30b0" sparkline={[210,218,215,225,230,228,240]} />
        </div>
      )}

      {/* Alertas */}
      {alertas?.length > 0 && (
        <div className="card" style={{ borderLeft: '4px solid #c0392b' }}>
          <h3 style={{ marginBottom: '16px', color: '#c0392b', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Alertas de Stock Bajo</h3>
          {lAlert ? <SkeletonTable rows={3} cols={4} />
            : eAlert ? <div className="error">{eAlert}</div>
            : (
            <table>
              <thead>
                <tr><th>Código</th><th>Producto</th><th>Almacén</th><th>Stock Actual</th><th>Mínimo</th><th>Faltan</th></tr>
              </thead>
              <tbody>
                {alertas.map((a, i) => (
                  <tr key={i}>
                    <td>{a.codigoProducto}</td>
                    <td>{a.nombreProducto}</td>
                    <td>{a.almacen}</td>
                    <td><span className="badge badge-danger">{a.cantidadActual}</span></td>
                    <td>{a.umbralMinimo}</td>
                    <td><strong>{a.unidadesFaltantes}</strong> unidades</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Catálogo */}
      <div className="card">
        <h3 style={{ marginBottom: '16px' }}>Catálogo de Productos</h3>
        {lProd ? <SkeletonTable rows={6} cols={5} />
          : eProd ? <div className="error">{eProd}</div>
          : !productos?.length ? <div className="empty">No hay productos registrados</div>
          : (
          <table>
            <thead>
              <tr><th>Código</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {productos.map(p => (
                <>
                  <tr key={p.id}>
                    <td><code>{p.codigo}</code></td>
                    <td>{p.nombre}</td>
                    <td><span className="badge badge-info">{p.categoria}</span></td>
                    <td>${Number(p.precio).toLocaleString('es-CL')}</td>
                    <td>
                      <span className={`badge ${p.activo ? 'badge-success' : 'badge-danger'}`}>
                        {p.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <button style={btnSuccess} onClick={() => abrirStock(p.id)}>
                        {stockProductoId === p.id ? 'Cancelar' : '+ Stock'}
                      </button>
                      <button style={btnDanger} onClick={() => handleEliminar(p.id, p.nombre)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>

                  {/* Formulario inline de stock */}
                  {stockProductoId === p.id && (
                    <tr key={`stock-${p.id}`}>
                      <td colSpan={6} style={{ background: '#f0f7f0', padding: '12px 16px' }}>
                        <form onSubmit={(e) => handleStockSubmit(e, p.id)}>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                            <div>
                              <label style={labelStyle}>Local / Almacén *</label>
                              <select style={{ ...inputStyle, width: '160px' }} value={stockForm.almacen}
                                onChange={e => setStockForm(f => ({ ...f, almacen: e.target.value, almacenCustom: '' }))}
                                required={stockForm.almacen !== '__nuevo__'}>
                                <option value="">-- Selecciona --</option>
                                {almacenes.map(a => (
                                  <option key={a} value={a}>{a}</option>
                                ))}
                                <option value="__nuevo__">+ Nuevo local...</option>
                              </select>
                            </div>
                            {stockForm.almacen === '__nuevo__' && (
                              <div>
                                <label style={labelStyle}>Nombre del local *</label>
                                <input style={{ ...inputStyle, width: '150px' }} value={stockForm.almacenCustom}
                                  onChange={e => setStockForm(f => ({ ...f, almacenCustom: e.target.value }))}
                                  placeholder="Ej: Sucursal Norte" required />
                              </div>
                            )}
                            <div>
                              <label style={labelStyle}>Cantidad *</label>
                              <input style={{ ...inputStyle, width: '100px' }} type="number" min="0" value={stockForm.cantidad}
                                onChange={e => setStockForm(f => ({ ...f, cantidad: e.target.value }))}
                                placeholder="0" required />
                            </div>
                            <div>
                              <label style={labelStyle}>Umbral mínimo *</label>
                              <input style={{ ...inputStyle, width: '120px' }} type="number" min="0" value={stockForm.umbralMinimo}
                                onChange={e => setStockForm(f => ({ ...f, umbralMinimo: e.target.value }))}
                                placeholder="0" required />
                            </div>
                            <button type="submit" style={{ ...btnSuccess, padding: '8px 16px' }} disabled={stockSaving}>
                              {stockSaving ? 'Guardando...' : 'Guardar Stock'}
                            </button>
                          </div>
                          {stockError && <div className="error" style={{ marginTop: '8px' }}>{stockError}</div>}
                        </form>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
