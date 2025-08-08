import { useState, useEffect } from 'react'
import { servicesAPI } from '../api/services'

export const useServices = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
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
    fetchServices()
  }, [])

  const refreshServices = () => {
    fetchServices()
  }

  return {
    services,
    loading,
    error,
    refreshServices
  }
}
