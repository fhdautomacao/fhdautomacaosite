import uploadService from '@/services/uploadService'

export const billsSimpleAPI = {
  // Upload de comprovante de pagamento diretamente para o Supabase Storage
  async uploadReceipt(installmentId, file) {
    // Para obter billId e installmentNumber, precisaremos recebê-los do chamador
    throw new Error('uploadReceipt(installmentId, file) foi substituído. Use uploadReceiptDirect(billId, installmentNumber, file).')
  },

  async uploadReceiptDirect(billId, installmentNumber, file) {
    const result = await uploadService.uploadPaymentReceipt(file, billId, installmentNumber)
    if (!result.success) throw new Error(result.error || 'Erro no upload do comprovante')
    return { success: true, receipt: { url: result.url, filename: result.filename, path: result.path } }
  },

  // Deletar comprovante de pagamento
  async deleteReceipt(installmentId) {
    // Este método antigo dependia de API local; mantenho placeholder
    throw new Error('deleteReceipt(installmentId) não implementado para storage direto. Use uploadService.deletePaymentReceipt(filePath).')
  }
}
