import { useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { getPuntosDeVenta, getTransacciones, getReporteDiario, registrarVenta } from '../services/api'
import KpiCard from '../components/KpiCard'

// Sección de Ventas: muestra puntos de venta, transacciones y reporte diario
export default function VentasSection() {
  const hoy = new Date().toISOString().split('T')[0]
  const [fechaReporte, setFechaReporte] = useState(hoy)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ puntoDeVentaId: '', productoCodigo: '', cantidad: '', monto: '', tipo: 'VENTA' })
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState(null)
  const [refresh, setRefresh] = useState(0)

  const { data: puntos, loading: lPuntos, error: ePuntos } = useFetch(getPuntosDeVenta)
  const { data: transacciones, loading: lTrans, error: eTrans } = useFetch(getTransacciones, [refresh])
  const { data: reporte, loading: lRep, error: eRep } = useFetch(
    () => getReporteDiario(fechaReporte), [fechaReporte, refresh]
  )

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.puntoDeVentaId || !formData.productoCodigo || !formData.cantidad || !formData.monto) {
      setFormError('Todos los campos son requeridos')
      return
    }

    setSaving(true)
    setFormError(null)
    try {
      await registrarVenta({
        puntoDeVentaId: Number(formData.puntoDeVentaId),
        productoCodigo: formData.productoCodigo,
        cantidad: Number(formData.cantidad),
        monto: Number(formData.monto),
        tipo: formData.tipo
      })
      setFormData({ puntoDeVentaId: '', productoCodigo: '', cantidad: '', monto: '', tipo: 'VENTA' })
      setShowForm(false)
      setRefresh(r => r + 1)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

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

  return (
    <div>
      <h2 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: 600, color: '#1a3a6e', textTransform: 'uppercase', letterSpacing: '0.6px', paddingBottom: '10px', borderBottom: '2px solid #e8ecf0' }}>Ventas</h2>

      {/* Filtro de reporte diario */}
      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ fontWeight: 600 }}>Reporte del día:</label>
          <input
            type="date"
            value={fechaReporte}
            onChange={e => setFechaReporte(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ddd' }}
          />
        </div>
        <button style={btnPrimary} onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancelar' : '+ Registrar Venta'}
        </button>
      </div>

      {/* Formulario para registrar venta */}
      {showForm && (
        <div className="card" style={{ background: '#f9fafb', marginBottom: '24px', borderLeft: '4px solid #1a56db' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 600 }}>Registrar Nueva Venta</h3>
          {formError && <div className="error" style={{ marginBottom: '16px' }}>{formError}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Punto de Venta</label>
              <select
                name="puntoDeVentaId"
                value={formData.puntoDeVentaId}
                onChange={handleFormChange}
                style={inputStyle}
              >
                <option value="">-- Selecciona un punto --</option>
                {puntos?.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} (ID: {p.id})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Código de Producto</label>
              <input
                type="text"
                name="productoCodigo"
                value={formData.productoCodigo}
                onChange={handleFormChange}
                placeholder="Ej: PROD-001"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Cantidad</label>
              <input
                type="number"
                name="cantidad"
                value={formData.cantidad}
                onChange={handleFormChange}
                placeholder="Ej: 5"
                min="1"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Monto ($)</label>
              <input
                type="number"
                name="monto"
                value={formData.monto}
                onChange={handleFormChange}
                placeholder="Ej: 150.50"
                min="0"
                step="0.01"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Tipo de Transacción</label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleFormChange}
                style={inputStyle}
              >
                <option value="VENTA">Venta</option>
                <option value="DEVOLUCION">Devolución</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
              <button type="submit" style={btnPrimary} disabled={saving}>
                {saving ? 'Registrando...' : 'Registrar Venta'}
              </button>
              <button type="button" style={btnSecondary} onClick={() => setShowForm(false)} disabled={saving}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {lRep ? (
        <div className="loading">Cargando reporte...</div>
      ) : eRep ? (
        <div className="error">{eRep}</div>
      ) : reporte ? (
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <KpiCard titulo="Total Ventas" valor={`$${Number(reporte.totalVentas).toLocaleString('es-CL')}`} color="#1a7a3e" />
          <KpiCard titulo="Devoluciones" valor={`$${Number(reporte.totalDevoluciones).toLocaleString('es-CL')}`} color="#c0392b" />
          <KpiCard titulo="Monto Neto" valor={`$${Number(reporte.montoNeto).toLocaleString('es-CL')}`} color="#1a56db" />
          <KpiCard titulo="Transacciones" valor={reporte.numeroTransacciones} subtitulo="operaciones del día" color="#7c3aed" />
        </div>
      ) : null}

      {/* Puntos de venta activos */}
      <div className="card">
        <h3 style={{ marginBottom: '16px' }}>Puntos de Venta Activos</h3>
        {lPuntos ? <div className="loading">Cargando...</div>
          : ePuntos ? <div className="error">{ePuntos}</div>
          : !puntos?.length ? <div className="empty">No hay puntos de venta registrados</div>
          : (
          <table>
            <thead>
              <tr><th>ID</th><th>Nombre</th><th>Región</th><th>Dirección</th></tr>
            </thead>
            <tbody>
              {puntos.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nombre}</td>
                  <td>{p.region}</td>
                  <td>{p.direccion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Últimas transacciones */}
      <div className="card">
        <h3 style={{ marginBottom: '16px' }}>Últimas Transacciones</h3>
        {lTrans ? <div className="loading">Cargando...</div>
          : eTrans ? <div className="error">{eTrans}</div>
          : !transacciones?.length ? <div className="empty">No hay transacciones registradas</div>
          : (
          <table>
            <thead>
              <tr><th>ID</th><th>Fecha</th><th>Tipo</th><th>Producto</th><th>Cantidad</th><th>Monto</th></tr>
            </thead>
            <tbody>
              {transacciones.slice(-20).reverse().map(t => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{new Date(t.fecha).toLocaleDateString('es-CL')}</td>
                  <td>
                    <span className={`badge ${t.tipo === 'VENTA' ? 'badge-success' : 'badge-warning'}`}>
                      {t.tipo}
                    </span>
                  </td>
                  <td>{t.productoCodigo}</td>
                  <td>{t.cantidad}</td>
                  <td>${Number(t.monto).toLocaleString('es-CL')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
