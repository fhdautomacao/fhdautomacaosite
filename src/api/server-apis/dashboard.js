export const dashboardAPI = {
  // Buscar dados do dashboard
  async getDashboardData() {
    try {
      const response = await fetch('/api/dashboard', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar dados do dashboard')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error)
      throw error
    }
  },

  // Buscar estatísticas do dashboard
  async getDashboardStats() {
    try {
      const response = await fetch('/api/dashboard/stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar estatísticas do dashboard')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      throw error
    }
  }
}
