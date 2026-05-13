import { useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { getKpis, getIngresos, getEgresos } from '../services/api'
import KpiCard from '../components/KpiCard'

// Sección Financiera: KPIs, ingresos y egresos del período
export default function FinancieroSection() {
  // Por defecto muestra el mes actual
  const hoy = new Date()
  const primerDia = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-01`
  const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).toISOString().split('T')[0]

  const [inicio, setInicio] = useState(primerDia)
  const [fin, setFin] = useState(ultimoDia)

  const { data: kpis, loading: lKpi, error: eKpi } = useFetch(
    () => getKpis(inicio, fin), [inicio, fin]
  )
  const { data: ingresos, loading: lIng, error: eIng } = useFetch(getIngresos)
  const { data: egresos, loading: lEgr, error: eEgr } = useFetch(getEgresos)

  return (
    <div>
      <h2 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: 600, color: '#1a3a6e', textTransform: 'uppercase', letterSpacing: '0.6px', paddingBottom: '10px', borderBottom: '2px solid #e8ecf0' }}>Financiero</h2>

      {/* Selector de período */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px', background: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <label style={{ fontWeight: 600 }}>Período:</label>
        <input type="date" value={inicio} onChange={e => setInicio(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ddd' }} />
        <span>hasta</span>
        <input type="date" value={fin} onChange={e => setFin(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ddd' }} />
      </div>

      {/* KPIs financieros */}
      {lKpi ? <div className="loading">Calculando KPIs...</div>
        : eKpi ? <div className="error" style={{ marginBottom: '20px' }}>{eKpi}</div>
        : kpis ? (
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <KpiCard titulo="Total Ingresos" valor={`$${Number(kpis.totalIngresos).toLocaleString('es-CL')}`} color="#1a7a3e" />
          <KpiCard titulo="Total Egresos" valor={`$${Number(kpis.totalEgresos).toLocaleString('es-CL')}`} color="#c0392b" />
          <KpiCard titulo="Utilidad Bruta" valor={`$${Number(kpis.utilidadBruta).toLocaleString('es-CL')}`} color="#1a56db" />
          <KpiCard titulo="Margen" valor={`${kpis.margenRentabilidad}%`} subtitulo="rentabilidad del período" color="#7c3aed" />
        </div>
      ) : null}

      {/* Tabla de ingresos */}
      <div className="card">
        <h3 style={{ marginBottom: '16px', color: '#1a7a3e' }}>Ingresos</h3>
        {lIng ? <div className="loading">Cargando...</div>
          : eIng ? <div className="error">{eIng}</div>
          : !ingresos?.length ? <div className="empty">No hay ingresos registrados</div>
          : (
          <table>
            <thead><tr><th>ID</th><th>Concepto</th><th>Categoría</th><th>Fecha</th><th>Monto</th></tr></thead>
            <tbody>
              {ingresos.map(i => (
                <tr key={i.id}>
                  <td>{i.id}</td>
                  <td>{i.concepto}</td>
                  <td><span className="badge badge-success">{i.categoria}</span></td>
                  <td>{new Date(i.fecha).toLocaleDateString('es-CL')}</td>
                  <td style={{ color: '#1a7a3e', fontWeight: 600 }}>${Number(i.monto).toLocaleString('es-CL')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Tabla de egresos */}
      <div className="card">
        <h3 style={{ marginBottom: '16px', color: '#c0392b' }}>Egresos</h3>
        {lEgr ? <div className="loading">Cargando...</div>
          : eEgr ? <div className="error">{eEgr}</div>
          : !egresos?.length ? <div className="empty">No hay egresos registrados</div>
          : (
          <table>
            <thead><tr><th>ID</th><th>Concepto</th><th>Categoría</th><th>Fecha</th><th>Monto</th></tr></thead>
            <tbody>
              {egresos.map(e => (
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td>{e.concepto}</td>
                  <td><span className="badge badge-warning">{e.categoria}</span></td>
                  <td>{new Date(e.fecha).toLocaleDateString('es-CL')}</td>
                  <td style={{ color: '#c0392b', fontWeight: 600 }}>${Number(e.monto).toLocaleString('es-CL')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
