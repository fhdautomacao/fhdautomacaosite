// API para enviar notificações para o app mobile
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { type, data } = req.body

    // Validar dados
    if (!type || !data) {
      return res.status(400).json({ error: 'Missing type or data' })
    }

    // Processar notificação baseada no tipo
    let message = ''
    let title = ''

    switch (type) {
      case 'overdue_bill':
        title = '🚨 Boleto Vencendo!'
        message = `Empresa: ${data.company_name}\nValor: R$ ${data.amount}\nVencimento: ${data.due_date}`
        break
      
      case 'new_quotation':
        title = '📋 Novo Orçamento!'
        message = `Cliente: ${data.client_name}\nEmpresa: ${data.company_name}\nServiço: ${data.service_type}`
        break
      
      case 'profit_sharing':
        title = '💰 Divisão de Lucro!'
        message = `Empresa: ${data.company_name}\nValor: R$ ${data.partner_share}\nData: ${data.date}`
        break
      
      default:
        return res.status(400).json({ error: 'Invalid notification type' })
    }

    // Enviar para WhatsApp (usando link direto)
    const whatsappNumber = '5519998652144'
    const whatsappMessage = encodeURIComponent(`${title}\n\n${message}\n\nFHD Automação Industrial`)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

    // Retornar dados para o app mobile
    return res.status(200).json({
      success: true,
      notification: {
        title,
        message,
        whatsappUrl,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Erro na API de notificação:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
} 