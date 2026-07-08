import { useState, useEffect } from 'react'

/**
 * Hook reutilizable para cargar datos desde la API.
 * Maneja los estados de carga, datos y error.
 *
 * @param {Function} fetchFn - Función que retorna una promesa (de services/api.js)
 * @param {Array} deps - Dependencias para volver a ejecutar la petición
 */
export function useFetch(fetchFn, deps = [], fallback = undefined) {
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
          if (fallback !== undefined) {
            setData(fallback)
          } else {
            setError(err.message)
          }
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, deps)

  return { data, loading, error }
}
