import { useState, useEffect } from 'react'
import { servicesAPI } from '../api/services'

export const useServices = (options = {}) => {
  const { initialData = null, enabled = true } = options
  // Considera dados iniciais apenas quando houver itens
  const hasInitialData = Array.isArray(initialData)
    ? initialData.length > 0
    : Boolean(initialData)
  const [services, setServices] = useState(initialData || [])
  const [loading, setLoading] = useState(enabled && !hasInitialData)
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

  // Buscar quando não houver dados iniciais
  useEffect(() => {
    if (!enabled || hasInitialData) return
    fetchServices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, hasInitialData])

  // Sincronizar quando initialData chegar ou mudar
  useEffect(() => {
    if (hasInitialData) {
      setServices(initialData)
      setLoading(false)
      setError(null)
    }
  }, [hasInitialData, initialData])

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
