import { useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { getTodosClientes, getTickets, desactivarCliente, eliminarCliente } from '../services/api'
import KpiCard from '../components/KpiCard'

const btnWarning = {
  background: '#a0680a', color: '#fff', padding: '4px 10px',
  border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, marginRight: '4px'
}
const btnDanger = {
  background: '#c0392b', color: '#fff', padding: '4px 10px',
  border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600
}

export default function ClientesSection() {
  const [refresh, setRefresh] = useState(0)
  const { data: clientes, loading: lCli, error: eCli } = useFetch(getTodosClientes, [refresh])
  const { data: tickets, loading: lTick, error: eTick } = useFetch(getTickets, [refresh])

  const contarTickets = (estado) => tickets?.filter(t => t.estado === estado).length || 0
  const clientesActivos = clientes?.filter(c => c.activo) || []

  const clienteNombre = (id) => {
    const c = clientes?.find(c => c.id === id)
    return c ? `${c.nombre} ${c.apellido}` : `#${id}`
  }

  const handleBloquear = async (id, nombre) => {
    if (!window.confirm(`¿Bloquear al cliente "${nombre}"?\nNo podrá ser seleccionado en nuevos pedidos pero sus datos se conservan.`)) return
    try {
      await desactivarCliente(id)
      setRefresh(r => r + 1)
    } catch (err) {
      alert('Error al bloquear: ' + err.message)
    }
  }

  const handleEliminar = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar permanentemente al cliente "${nombre}"?\nSe eliminarán también todos sus tickets. Esta acción no se puede deshacer.`)) return
    try {
      await eliminarCliente(id)
      setRefresh(r => r + 1)
    } catch (err) {
      alert('Error al eliminar: ' + err.message)
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: 600, color: '#1a3a6e', textTransform: 'uppercase', letterSpacing: '0.6px', paddingBottom: '10px', borderBottom: '2px solid #e8ecf0' }}>Clientes</h2>

      {/* KPIs */}
      {!lCli && !lTick && (
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <KpiCard titulo="Clientes Activos" valor={clientesActivos.length} color="#1a56db" />
          <KpiCard titulo="Tickets Abiertos" valor={contarTickets('ABIERTO')} color="#c0392b" />
          <KpiCard titulo="En Proceso" valor={contarTickets('EN_PROCESO')} color="#a0680a" />
          <KpiCard titulo="Resueltos" valor={contarTickets('RESUELTO')} color="#1a7a3e" />
        </div>
      )}

      {/* Tabla de clientes */}
      <div className="card">
        <h3 style={{ marginBottom: '16px' }}>Clientes Registrados</h3>
        {lCli ? <div className="loading">Cargando clientes...</div>
          : eCli ? <div className="error">{eCli}</div>
          : !clientes?.length ? <div className="empty">No hay clientes registrados</div>
          : (
          <table>
            <thead>
              <tr><th>ID</th><th>Nombre</th><th>Email</th><th>Teléfono</th><th>Registro</th><th>Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {clientes.map(c => (
                <tr key={c.id} style={!c.activo ? { opacity: 0.6, background: '#fafafa' } : {}}>
                  <td>#{c.id}</td>
                  <td>{c.nombre} {c.apellido}</td>
                  <td>{c.email}</td>
                  <td>{c.telefono || '-'}</td>
                  <td>{new Date(c.fechaRegistro).toLocaleDateString('es-CL')}</td>
                  <td>
                    <span className={`badge ${c.activo ? 'badge-success' : 'badge-danger'}`}>
                      {c.activo ? 'Activo' : 'Bloqueado'}
                    </span>
                  </td>
                  <td>
                    {c.activo && (
                      <button style={btnWarning} onClick={() => handleBloquear(c.id, `${c.nombre} ${c.apellido}`)}>
                        Bloquear
                      </button>
                    )}
                    <button style={btnDanger} onClick={() => handleEliminar(c.id, `${c.nombre} ${c.apellido}`)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Tabla de tickets */}
      <div className="card">
        <h3 style={{ marginBottom: '16px' }}>Tickets de Atención</h3>
        {lTick ? <div className="loading">Cargando tickets...</div>
          : eTick ? <div className="error">{eTick}</div>
          : !tickets?.length ? <div className="empty">No hay tickets registrados</div>
          : (
          <table>
            <thead>
              <tr><th>ID</th><th>Cliente</th><th>Asunto</th><th>Categoría</th><th>Estado</th><th>Fecha</th></tr>
            </thead>
            <tbody>
              {tickets.map(t => {
                const badgeClass = {
                  ABIERTO: 'badge-danger',
                  EN_PROCESO: 'badge-warning',
                  RESUELTO: 'badge-success',
                  CERRADO: 'badge-info'
                }[t.estado] || 'badge-info'
                return (
                  <tr key={t.id}>
                    <td>#{t.id}</td>
                    <td>{clienteNombre(t.clienteId)}</td>
                    <td>{t.asunto}</td>
                    <td>{t.categoria}</td>
                    <td><span className={`badge ${badgeClass}`}>{t.estado}</span></td>
                    <td>{new Date(t.fechaCreacion).toLocaleDateString('es-CL')}</td>
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
