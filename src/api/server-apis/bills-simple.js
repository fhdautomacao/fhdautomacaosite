import { supabase } from '../../lib/supabase'

export const billsSimpleAPI = {
  // Upload de comprovante de pagamento
  async uploadReceipt(installmentId, file) {
    try {
      console.log('📤 Iniciando upload de comprovante...');
      console.log('📋 installmentId:', installmentId);
      console.log('📄 file:', file);
      console.log('📄 file type:', file.type);
      console.log('📄 file size:', file.size);

      const formData = new FormData()
      formData.append('file', file)
      formData.append('installmentId', installmentId)

      console.log('📤 Enviando requisição para:', '/api/bills/installments/upload');

      const response = await fetch('/api/bills/installments/upload', {
        method: 'POST',
        body: formData,
      })

      console.log('📊 Status da resposta:', response.status);
      console.log('📋 Headers da resposta:', response.headers);

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ Erro na resposta:', errorData);
        throw new Error(errorData.error || 'Erro no upload do comprovante')
      }

      const result = await response.json()
      console.log('✅ Upload bem-sucedido:', result);
      return result
    } catch (error) {
      console.error('❌ Erro no upload:', error)
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
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao deletar comprovante')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao deletar comprovante:', error)
      throw error
    }
  }
}
