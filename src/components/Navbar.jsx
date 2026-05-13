const NAV_ITEMS = [
  { id: 'ventas',     label: 'Ventas' },
  { id: 'ecommerce',  label: 'Ecommerce' },
  { id: 'inventario', label: 'Inventario' },
  { id: 'financiero', label: 'Financiero' },
  { id: 'clientes',   label: 'Clientes' },
]

export default function Navbar({ activeSection, onSectionChange }) {
  return (
    <nav style={{
      background: '#0f2044',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: '52px'
    }}>
      <div style={{
        color: 'white',
        fontWeight: 700,
        fontSize: '15px',
        letterSpacing: '0.4px',
        paddingRight: '24px',
        marginRight: '12px',
        borderRight: '1px solid rgba(255,255,255,0.15)',
        whiteSpace: 'nowrap'
      }}>
        Grupo Cordillera
      </div>

      {NAV_ITEMS.map(item => (
        <button
          key={item.id}
          onClick={() => onSectionChange(item.id)}
          style={{
            background: 'transparent',
            color: activeSection === item.id ? 'white' : 'rgba(255,255,255,0.6)',
            padding: '0 14px',
            height: '52px',
            borderRadius: 0,
            fontSize: '13px',
            fontWeight: activeSection === item.id ? 600 : 400,
            border: 'none',
            borderBottom: activeSection === item.id ? '2px solid #4f9cf9' : '2px solid transparent',
            transition: 'color 0.15s, border-color 0.15s',
            letterSpacing: '0.2px'
          }}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}
