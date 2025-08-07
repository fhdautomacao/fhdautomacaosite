export const authServerAPI = {
  // Login no servidor
  async loginServer(email, password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Erro no login')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro no login do servidor:', error)
      throw error
    }
  },

  // Logout no servidor
  async logoutServer() {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Erro no logout')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro no logout do servidor:', error)
      throw error
    }
  },

  // Testar conexão com o servidor
  async testServerConnection() {
    try {
      const response = await fetch('/api/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Erro na conexão com o servidor')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro no teste de conexão:', error)
      throw error
    }
  }
}
