const block = (extra = {}) => ({
  background: 'linear-gradient(90deg, #e4e7f2 25%, #d4d8ea 50%, #e4e7f2 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s ease-in-out infinite',
  borderRadius: '8px',
  ...extra,
})

export function SkeletonKpis({ count = 4 }) {
  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          background: 'rgba(255,255,255,0.72)',
          borderRadius: '22px',
          padding: '22px 24px 16px',
          boxShadow: '6px 8px 24px rgba(130,140,190,0.1), -3px -3px 10px rgba(255,255,255,0.92)',
          flex: 1,
          minWidth: '180px',
        }}>
          <div style={block({ width: '32px', height: '32px', borderRadius: '10px', marginBottom: '14px', animationDelay: `${i * 0.1}s` })} />
          <div style={block({ width: '55%', height: '10px', marginBottom: '10px', animationDelay: `${i * 0.1 + 0.1}s` })} />
          <div style={block({ width: '75%', height: '24px', animationDelay: `${i * 0.1 + 0.2}s` })} />
          <div style={block({ width: '100%', height: '36px', marginTop: '10px', animationDelay: `${i * 0.1 + 0.3}s` })} />
        </div>
      ))}
    </div>
  )
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  const widths = ['8%', '22%', '18%', '14%', '12%', '10%']
  return (
    <div className="card">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: '14px', padding: '14px 0', borderBottom: '1px solid rgba(200,205,225,0.3)', alignItems: 'center' }}>
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} style={block({ width: widths[j] || '16%', height: '13px', animationDelay: `${(i * cols + j) * 0.03}s` })} />
          ))}
        </div>
      ))}
    </div>
  )
}
