import { useState, useEffect } from 'react'

/**
 * Hook reutilizable para cargar datos desde la API.
 * Maneja los estados de carga, datos y error.
 *
 * @param {Function} fetchFn - Función que retorna una promesa (de services/api.js)
 * @param {Array} deps - Dependencias para volver a ejecutar la petición
 */
export function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchFn()
      .then(result => {
        if (!cancelled) {
          setData(result)
          setLoading(false)
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      })

    // Limpieza: evita actualizar estado en componentes desmontados
    return () => { cancelled = true }
  }, deps)

  return { data, loading, error }
}
