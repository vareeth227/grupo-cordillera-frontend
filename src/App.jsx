import { useState } from 'react'
import Navbar from './components/Navbar'
import VentasSection from './sections/VentasSection'
import EcommerceSection from './sections/EcommerceSection'
import InventarioSection from './sections/InventarioSection'
import FinancieroSection from './sections/FinancieroSection'
import ClientesSection from './sections/ClientesSection'

/**
 * Componente raíz del Dashboard Ejecutivo Grupo Cordillera.
 * Gestiona qué sección está activa y renderiza el contenido correspondiente.
 */
export default function App() {
  const [activeSection, setActiveSection] = useState('ventas')

  const sections = {
    ventas:     <VentasSection />,
    ecommerce:  <EcommerceSection />,
    inventario: <InventarioSection />,
    financiero: <FinancieroSection />,
    clientes:   <ClientesSection />,
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Navbar activeSection={activeSection} onSectionChange={setActiveSection} />

      {/* Cabecera del dashboard */}
      <div style={{ background: '#162d54', padding: '20px 32px', marginBottom: '24px', borderBottom: '1px solid #1e3a6e' }}>
        <h1 style={{ color: 'white', fontSize: '20px', fontWeight: 600, letterSpacing: '0.2px' }}>
          Dashboard Ejecutivo
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', marginTop: '3px', fontSize: '13px' }}>
          {new Date().toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Contenido de la sección activa */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 40px' }}>
        {sections[activeSection]}
      </main>
    </div>
  )
}
