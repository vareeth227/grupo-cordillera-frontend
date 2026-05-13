// Tarjeta de KPI para el dashboard ejecutivo

export default function KpiCard({ titulo, valor, subtitulo, color = '#1a56db' }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '10px',
      padding: '20px 24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      borderLeft: `4px solid ${color}`,
      flex: 1,
      minWidth: '200px'
    }}>
      <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {titulo}
      </div>
      <div style={{ fontSize: '28px', fontWeight: 700, color: '#1a1a2e', marginBottom: '4px' }}>
        {valor}
      </div>
      {subtitulo && (
        <div style={{ fontSize: '12px', color: '#aaa' }}>{subtitulo}</div>
      )}
    </div>
  )
}
