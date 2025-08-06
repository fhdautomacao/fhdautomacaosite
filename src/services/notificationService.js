// Serviço unificado para notificações
class NotificationService {
  constructor() {
    this.apiUrl = process.env.VITE_API_URL || 'https://fhd-automacao-industrial-bq67.vercel.app'
  }

  // Enviar notificação para app mobile
  async sendMobileNotification(type, data) {
    try {
      const response = await fetch(`${this.apiUrl}/api/notify-mobile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, data })
      })

      if (!response.ok) {
        throw new Error('Erro ao enviar notificação mobile')
      }

      const result = await response.json()
      
      // Abrir WhatsApp automaticamente
      if (result.notification?.whatsappUrl) {
        window.open(result.notification.whatsappUrl, '_blank')
      }

      return result
    } catch (error) {
      console.error('Erro no serviço de notificação:', error)
      throw error
    }
  }

  // Notificar boleto vencendo
  async notifyOverdueBill(billData) {
    return await this.sendMobileNotification('overdue_bill', billData)
  }

  // Notificar novo orçamento
  async notifyNewQuotation(quotationData) {
    return await this.sendMobileNotification('new_quotation', quotationData)
  }

  // Notificar divisão de lucro
  async notifyProfitSharing(profitData) {
    return await this.sendMobileNotification('profit_sharing', profitData)
  }

  // Testar notificação
  async testNotification() {
    const testData = {
      company_name: 'Empresa Teste',
      amount: '1.500,00',
      due_date: '2024-01-15'
    }
    
    return await this.notifyOverdueBill(testData)
  }
}

const notificationService = new NotificationService()
export default notificationService 