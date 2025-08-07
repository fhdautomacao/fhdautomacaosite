import { supabase } from '../../lib/supabase'

export const billsSimpleAPI = {
  // Upload de comprovante de pagamento
  async uploadReceipt(installmentId, file) {
    try {
      const formData = new FormData()
      formData.append('receipt', file)
      formData.append('installmentId', installmentId)

      const response = await fetch('/api/bills/installments/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Erro no upload do comprovante')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro no upload:', error)
      throw error
    }
  },

  // Deletar comprovante de pagamento
  async deleteReceipt(installmentId) {
    try {
      const response = await fetch(`/api/bills/installments/${installmentId}/receipt`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar comprovante')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao deletar comprovante:', error)
      throw error
    }
  }
}
