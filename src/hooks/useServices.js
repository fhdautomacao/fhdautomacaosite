import { useState, useEffect } from 'react'
import { servicesAPI } from '../api/services'

export const useServices = (options = {}) => {
  const { initialData = null, enabled = true } = options
  const [services, setServices] = useState(initialData || [])
  const [loading, setLoading] = useState(enabled && !initialData)
  const [error, setError] = useState(null)

  const fetchServices = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await servicesAPI.getActive()
      setServices(data || [])
    } catch (err) {
      console.error('Erro ao carregar serviços:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!enabled || initialData) return
    fetchServices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, initialData])

  const refreshServices = () => {
    if (!enabled) return
    fetchServices()
  }

  return {
    services,
    loading,
    error,
    refreshServices
  }
}
