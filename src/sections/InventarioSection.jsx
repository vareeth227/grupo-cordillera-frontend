import { useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { getTodosProductos, getAlertas, getStock, crearProducto, eliminarProducto } from '../services/api'
import KpiCard from '../components/KpiCard'

const inputStyle = {
  width: '100%', padding: '8px 10px', border: '1px solid #d0d5de',
  borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box'
}
const labelStyle = { display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 600, color: '#555' }
const btnPrimary = {
  background: '#1a56db', color: '#fff', padding: '8px 20px',
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

const FORM_VACIO = { codigo: '', nombre: '', categoria: '', descripcion: '', precio: '' }

export default function InventarioSection() {
  const [refresh, setRefresh] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(FORM_VACIO)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState(null)

  const { data: productos, loading: lProd, error: eProd } = useFetch(getTodosProductos, [refresh])
  const { data: alertas, loading: lAlert, error: eAlert } = useFetch(getAlertas, [refresh])
  const { data: stock, loading: lStock } = useFetch(getStock, [refresh])

  const activos = productos?.filter(p => p.activo) || []

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormError(null)
    try {
      await crearProducto({ ...form, precio: Number(form.precio), activo: true })
      setForm(FORM_VACIO)
      setShowForm(false)
      setRefresh(r => r + 1)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEliminar = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar el producto "${nombre}"? Esta acción no se puede deshacer.`)) return
    try {
      await eliminarProducto(id)
      setRefresh(r => r + 1)
    } catch (err) {
      alert('Error al eliminar: ' + err.message)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '10px', borderBottom: '2px solid #e8ecf0' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1a3a6e', textTransform: 'uppercase', letterSpacing: '0.6px', margin: 0 }}>Inventario</h2>
        <button style={btnPrimary} onClick={() => { setShowForm(!showForm); setFormError(null) }}>
          {showForm ? 'Cancelar' : '+ Nuevo Producto'}
        </button>
      </div>

      {/* Formulario de nuevo producto */}
      {showForm && (
        <div className="card" style={{ marginBottom: '24px', borderLeft: '4px solid #1a56db' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '14px', color: '#1a56db', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Registrar Nuevo Producto</h3>
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
                <input style={inputStyle} name="categoria" value={form.categoria} onChange={handleChange} placeholder="Ej: Electrónica" required />
              </div>
              <div>
                <label style={labelStyle}>Precio *</label>
                <input style={inputStyle} name="precio" type="number" min="0" step="0.01" value={form.precio} onChange={handleChange} placeholder="0.00" required />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Descripción</label>
                <input style={inputStyle} name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción opcional" />
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
          <KpiCard titulo="Productos Activos" valor={activos.length} color="#1a7a3e" />
          <KpiCard titulo="Alertas Bajo Stock" valor={alertas?.length || 0} color="#c0392b" subtitulo="requieren reposición" />
          <KpiCard titulo="Registros de Stock" valor={stock?.length || 0} color="#1a56db" />
        </div>
      )}

      {/* Alertas de stock bajo */}
      {alertas?.length > 0 && (
        <div className="card" style={{ borderLeft: '4px solid #c0392b' }}>
          <h3 style={{ marginBottom: '16px', color: '#c0392b', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Alertas de Stock Bajo</h3>
          {lAlert ? <div className="loading">Cargando...</div>
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

      {/* Catálogo de productos */}
      <div className="card">
        <h3 style={{ marginBottom: '16px' }}>Catálogo de Productos</h3>
        {lProd ? <div className="loading">Cargando...</div>
          : eProd ? <div className="error">{eProd}</div>
          : !productos?.length ? <div className="empty">No hay productos registrados</div>
          : (
          <table>
            <thead>
              <tr><th>Código</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {productos.map(p => (
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
                    <button style={btnDanger} onClick={() => handleEliminar(p.id, p.nombre)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
