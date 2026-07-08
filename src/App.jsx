import { useState } from 'react'
import Navbar from './components/Navbar'
import { ToastProvider } from './components/Toast'
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
    <ToastProvider>
    <div style={{ minHeight: '100vh' }}>
      <Navbar activeSection={activeSection} onSectionChange={setActiveSection} />

      {/* Cabecera del dashboard */}
      <div style={{
        background: 'linear-gradient(135deg, #1c0836 0%, #4e1572 45%, #7a2468 100%)',
        padding: '22px 32px',
        marginBottom: '28px',
        boxShadow: '0 4px 20px rgba(28, 8, 54, 0.45)',
      }}>
        <h1 style={{ color: 'white', fontSize: '20px', fontWeight: 700, letterSpacing: '0.2px', textShadow: '0 1px 6px rgba(0,0,0,0.25)' }}>
          Dashboard Ejecutivo
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.52)', marginTop: '4px', fontSize: '13px' }}>
          {new Date().toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Contenido de la sección activa */}
      <main key={activeSection} style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 48px', animation: 'fadeIn 0.28s ease' }}>
        {sections[activeSection]}
      </main>
    </div>
    </ToastProvider>
  )
}
