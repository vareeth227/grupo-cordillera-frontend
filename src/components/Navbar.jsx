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
      background: 'linear-gradient(135deg, #1c0836 0%, #4e1572 45%, #7a2468 100%)',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      boxShadow: '0 4px 22px rgba(28, 8, 54, 0.55), 0 1px 0 rgba(255,255,255,0.07)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: '56px',
      overflow: 'hidden',
    }}>

      {/* Silueta cordillera */}
      <svg
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        viewBox="0 0 1200 56"
        preserveAspectRatio="none"
      >
        {/* Capa 1: cumbres lejanas, más altas y sutiles */}
        <path d="M0,56 L0,35 L50,22 L80,32 L120,10 L155,20 L195,4 L235,16 L270,7 L310,20 L350,2 L390,14 L430,4 L468,16 L505,5 L542,18 L578,6 L615,20 L652,3 L690,16 L727,7 L766,22 L802,9 L840,22 L876,5 L915,18 L952,7 L990,20 L1028,9 L1066,22 L1104,11 L1142,24 L1178,13 L1200,19 L1200,56 Z"
          fill="white" opacity="0.055" />
        {/* Capa 2: cordones intermedios */}
        <path d="M0,56 L0,42 L65,30 L110,42 L155,21 L192,34 L230,15 L268,28 L305,17 L344,32 L382,11 L420,26 L458,14 L496,30 L533,19 L571,34 L607,13 L645,27 L682,16 L721,34 L757,19 L796,36 L833,21 L871,36 L908,15 L946,30 L983,17 L1021,34 L1058,21 L1096,36 L1133,23 L1171,36 L1200,29 L1200,56 Z"
          fill="white" opacity="0.07" />
        {/* Capa 3: faldeos cercanos */}
        <path d="M0,56 L0,48 L90,40 L180,48 L270,36 L356,46 L440,34 L526,44 L612,38 L696,48 L780,36 L866,48 L952,37 L1036,48 L1122,37 L1200,46 L1200,56 Z"
          fill="white" opacity="0.09" />
      </svg>

      <div style={{
        color: 'white',
        fontWeight: 800,
        fontSize: '15px',
        letterSpacing: '0.3px',
        paddingRight: '24px',
        marginRight: '12px',
        borderRight: '1px solid rgba(255,255,255,0.12)',
        whiteSpace: 'nowrap',
        textShadow: '0 1px 12px rgba(220, 160, 255, 0.55)',
        position: 'relative',
      }}>
        Grupo Cordillera
      </div>

      {NAV_ITEMS.map(item => (
        <button
          key={item.id}
          onClick={() => onSectionChange(item.id)}
          style={{
            background: activeSection === item.id
              ? 'linear-gradient(135deg, rgba(255,255,255,0.20) 0%, rgba(255,200,255,0.10) 100%)'
              : 'transparent',
            color: activeSection === item.id ? 'white' : 'rgba(255,255,255,0.52)',
            padding: '0 16px',
            height: '34px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: activeSection === item.id ? 700 : 400,
            border: activeSection === item.id ? '1px solid rgba(255,200,255,0.2)' : '1px solid transparent',
            boxShadow: activeSection === item.id
              ? '2px 3px 10px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,200,255,0.15)'
              : 'none',
            transition: 'all 0.2s ease',
            letterSpacing: '0.2px',
            position: 'relative',
          }}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}
