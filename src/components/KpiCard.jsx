function Sparkline({ data, color }) {
  if (!data || data.length < 2) return null
  const W = 120, H = 38
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => {
    const x = ((i / (data.length - 1)) * W).toFixed(1)
    const y = (H - ((v - min) / range) * (H - 8) - 4).toFixed(1)
    return `${x},${y}`
  })
  const polyline = pts.join(' ')
  const [lx, ly] = pts[pts.length - 1].split(',').map(Number)
  const area = `M ${pts.join(' L ')} L ${W},${H} L 0,${H} Z`
  const gid = `spk${color.replace(/[^a-z0-9]/gi, '')}`
  return (
    <svg
      width="100%" height={H}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ display: 'block', marginTop: '10px', overflow: 'visible' }}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.03" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r="3" fill={color} />
    </svg>
  )
}

export default function KpiCard({ titulo, valor, subtitulo, color = '#8a30b0', sparkline }) {
  const shadowBase = `6px 8px 24px ${color}25, -3px -3px 10px rgba(255,255,255,0.95), inset 0 1px 0 rgba(255,255,255,0.9)`
  const shadowHover = `10px 14px 32px ${color}35, -3px -3px 12px rgba(255,255,255,1), inset 0 1px 0 rgba(255,255,255,1)`

  return (
    <div
      style={{
        background: `linear-gradient(145deg, rgba(255,255,255,0.96) 0%, ${color}12 100%)`,
        borderRadius: '22px',
        padding: '22px 24px 16px',
        boxShadow: shadowBase,
        border: `1px solid ${color}22`,
        flex: 1,
        minWidth: '180px',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-5px)'
        e.currentTarget.style.boxShadow = shadowHover
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = shadowBase
      }}
    >
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '10px',
        background: `linear-gradient(135deg, ${color}35 0%, ${color}18 100%)`,
        marginBottom: '14px',
        boxShadow: `inset 2px 2px 5px ${color}22, inset -1px -1px 3px rgba(255,255,255,0.8)`,
      }} />
      <div style={{ fontSize: '11px', color: '#8890b0', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700 }}>
        {titulo}
      </div>
      <div style={{ fontSize: '26px', fontWeight: 800, color: '#2d3152', letterSpacing: '-0.5px' }}>
        {valor}
      </div>
      {subtitulo && (
        <div style={{ fontSize: '12px', color: '#a0a8c0', marginTop: '5px' }}>{subtitulo}</div>
      )}
      <Sparkline data={sparkline} color={color} />
    </div>
  )
}
