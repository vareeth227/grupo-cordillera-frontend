import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import KpiCard from '../components/KpiCard'

describe('KpiCard', () => {
  it('renderiza el título correctamente', () => {
    render(<KpiCard titulo="Ventas" valor="$1.000" />)
    expect(screen.getByText('Ventas')).toBeInTheDocument()
  })

  it('renderiza el valor correctamente', () => {
    render(<KpiCard titulo="Ventas" valor="$1.000" />)
    expect(screen.getByText('$1.000')).toBeInTheDocument()
  })

  it('renderiza el subtítulo cuando se proporciona', () => {
    render(<KpiCard titulo="Ventas" valor="$1.000" subtitulo="Este mes" />)
    expect(screen.getByText('Este mes')).toBeInTheDocument()
  })

  it('no renderiza subtítulo cuando no se proporciona', () => {
    render(<KpiCard titulo="Ventas" valor="$1.000" />)
    expect(screen.queryByText('Este mes')).not.toBeInTheDocument()
  })
})
