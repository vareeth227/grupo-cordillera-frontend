import { useFetch } from '../hooks/useFetch'
import { getPedidos } from '../services/api'
import KpiCard from '../components/KpiCard'

// Sección de Ecommerce: muestra pedidos online y sus estados
export default function EcommerceSection() {
  const { data: pedidos, loading, error } = useFetch(getPedidos)

  const contarPorEstado = (estado) => pedidos?.filter(p => p.estado === estado).length || 0

  return (
    <div>
      <h2 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: 600, color: '#1a3a6e', textTransform: 'uppercase', letterSpacing: '0.6px', paddingBottom: '10px', borderBottom: '2px solid #e8ecf0' }}>Ecommerce</h2>

      {/* KPIs de pedidos por estado */}
      {!loading && !error && pedidos && (
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <KpiCard titulo="Total Pedidos" valor={pedidos.length} color="#1a56db" />
          <KpiCard titulo="Pendientes" valor={contarPorEstado('PENDIENTE')} color="#a0680a" />
          <KpiCard titulo="Confirmados" valor={contarPorEstado('CONFIRMADO')} color="#1a7a3e" />
          <KpiCard titulo="En Envío" valor={contarPorEstado('EN_ENVIO')} color="#7c3aed" />
        </div>
      )}

      <div className="card">
        <h3 style={{ marginBottom: '16px' }}>Pedidos Online</h3>
        {loading ? <div className="loading">Cargando pedidos...</div>
          : error ? <div className="error">{error}</div>
          : !pedidos?.length ? <div className="empty">No hay pedidos registrados</div>
          : (
          <table>
            <thead>
              <tr><th>ID</th><th>Cliente</th><th>Fecha</th><th>Estado</th><th>Total</th><th>Ítems</th></tr>
            </thead>
            <tbody>
              {pedidos.map(p => {
                const badgeClass = {
                  PENDIENTE: 'badge-warning',
                  CONFIRMADO: 'badge-info',
                  EN_ENVIO: 'badge-info',
                  ENTREGADO: 'badge-success',
                  CANCELADO: 'badge-danger'
                }[p.estado] || 'badge-info'
                return (
                  <tr key={p.id}>
                    <td>#{p.id}</td>
                    <td>Cliente #{p.clienteId}</td>
                    <td>{new Date(p.fechaPedido).toLocaleDateString('es-CL')}</td>
                    <td><span className={`badge ${badgeClass}`}>{p.estado}</span></td>
                    <td>${Number(p.total).toLocaleString('es-CL')}</td>
                    <td>{p.items?.length || 0} productos</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
