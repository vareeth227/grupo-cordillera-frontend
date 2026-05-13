import { useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { getPuntosDeVenta, getTransacciones, getReporteDiario } from '../services/api'
import KpiCard from '../components/KpiCard'

// Sección de Ventas: muestra puntos de venta, transacciones y reporte diario
export default function VentasSection() {
  const hoy = new Date().toISOString().split('T')[0]
  const [fechaReporte, setFechaReporte] = useState(hoy)

  const { data: puntos, loading: lPuntos, error: ePuntos } = useFetch(getPuntosDeVenta)
  const { data: transacciones, loading: lTrans, error: eTrans } = useFetch(getTransacciones)
  const { data: reporte, loading: lRep, error: eRep } = useFetch(
    () => getReporteDiario(fechaReporte), [fechaReporte]
  )

  return (
    <div>
      <h2 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: 600, color: '#1a3a6e', textTransform: 'uppercase', letterSpacing: '0.6px', paddingBottom: '10px', borderBottom: '2px solid #e8ecf0' }}>Ventas</h2>

      {/* KPIs del reporte diario */}
      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <label style={{ fontWeight: 600 }}>Reporte del día:</label>
        <input
          type="date"
          value={fechaReporte}
          onChange={e => setFechaReporte(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ddd' }}
        />
      </div>

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
