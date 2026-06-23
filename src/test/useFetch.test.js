import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useFetch } from '../hooks/useFetch'

describe('useFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('comienza en estado de carga', () => {
    const fetchFn = vi.fn(() => new Promise(() => {}))
    const { result } = renderHook(() => useFetch(fetchFn))

    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('establece data cuando la promesa resuelve', async () => {
    const mockData = [{ id: 1, nombre: 'Producto A' }]
    const fetchFn = vi.fn(() => Promise.resolve(mockData))

    const { result } = renderHook(() => useFetch(fetchFn))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data).toEqual(mockData)
    expect(result.current.error).toBeNull()
  })

  it('establece error cuando la promesa rechaza', async () => {
    const fetchFn = vi.fn(() => Promise.reject(new Error('Network error')))

    const { result } = renderHook(() => useFetch(fetchFn))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data).toBeNull()
    expect(result.current.error).toBe('Network error')
  })

  it('llama fetchFn al montar', async () => {
    const fetchFn = vi.fn(() => Promise.resolve([]))

    renderHook(() => useFetch(fetchFn))

    await waitFor(() => expect(fetchFn).toHaveBeenCalledOnce())
  })

  it('vuelve a llamar fetchFn cuando cambian las dependencias', async () => {
    const fetchFn = vi.fn(() => Promise.resolve([]))
    let dep = 0

    const { rerender } = renderHook(() => useFetch(fetchFn, [dep]))

    await waitFor(() => expect(fetchFn).toHaveBeenCalledTimes(1))

    dep = 1
    rerender()

    await waitFor(() => expect(fetchFn).toHaveBeenCalledTimes(2))
  })

  it('maneja respuesta null correctamente', async () => {
    const fetchFn = vi.fn(() => Promise.resolve(null))

    const { result } = renderHook(() => useFetch(fetchFn))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
  })
})
