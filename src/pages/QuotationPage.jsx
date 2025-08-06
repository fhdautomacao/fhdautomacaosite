import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  FileText, 
  User, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  DollarSign, 
  Clock, 
  MessageSquare,
  CheckCircle,
  ArrowRight,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { quotationsAPI } from '@/api/quotations'

const QuotationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    project_type: '',
    description: '',
    budget_range: '',
    urgency: 'normal',
    preferred_contact: 'email',
    additional_info: ''
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const projectTypes = [
    { value: 'sistema_hidraulico', label: 'Sistema Hidráulico' },
    { value: 'sistema_pneumatico', label: 'Sistema Pneumático' },
    { value: 'automatizacao_industrial', label: 'Automação Industrial' },
    { value: 'manutencao_equipamentos', label: 'Manutenção de Equipamentos' },
    { value: 'projeto_personalizado', label: 'Projeto Personalizado' },
    { value: 'consultoria_tecnica', label: 'Consultoria Técnica' },
    { value: 'outro', label: 'Outro' }
  ]

  const budgetRanges = [
    { value: 'ate_5k', label: 'Até R$ 5.000' },
    { value: '5k_10k', label: 'R$ 5.000 - R$ 10.000' },
    { value: '10k_25k', label: 'R$ 10.000 - R$ 25.000' },
    { value: '25k_50k', label: 'R$ 25.000 - R$ 50.000' },
    { value: '50k_100k', label: 'R$ 50.000 - R$ 100.000' },
    { value: 'acima_100k', label: 'Acima de R$ 100.000' },
    { value: 'nao_informado', label: 'Não informado' }
  ]

  const urgencyLevels = [
    { value: 'low', label: 'Baixa (1-2 meses)' },
    { value: 'normal', label: 'Normal (2-4 semanas)' },
    { value: 'high', label: 'Alta (1-2 semanas)' },
    { value: 'urgent', label: 'Urgente (menos de 1 semana)' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await quotationsAPI.create(formData)
      setSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        project_type: '',
        description: '',
        budget_range: '',
        urgency: 'normal',
        preferred_contact: 'email',
        additional_info: ''
      })
    } catch (err) {
      console.error('Erro ao enviar orçamento:', err)
      setError('Erro ao enviar solicitação. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (success) {
    return (
      <>
        <Helmet>
          <title>Solicitação Enviada - FHD Automação Industrial</title>
          <meta name="description" content="Sua solicitação de orçamento foi enviada com sucesso. Entraremos em contato em breve." />
        </Helmet>
        
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full"
          >
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Solicitação Enviada!
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Sua solicitação de orçamento foi recebida com sucesso. 
                  Nossa equipe entrará em contato em até 24 horas.
                </p>
                
                <div className="space-y-3 text-sm text-gray-500">
                  <p>📧 Você receberá uma confirmação por email</p>
                  <p>📞 Entraremos em contato pelo telefone informado</p>
                  <p>⏰ Prazo de resposta: até 24 horas</p>
                </div>
                
                <Button 
                  onClick={() => setSuccess(false)}
                  className="mt-6 w-full"
                >
                  Nova Solicitação
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Solicitar Orçamento - FHD Automação Industrial</title>
        <meta name="description" content="Solicite seu orçamento personalizado para projetos de automação industrial, sistemas hidráulicos e pneumáticos. Resposta em até 24 horas." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-6 py-2 rounded-full mb-6">
                <FileText className="mr-2" size={20} />
                <span className="font-semibold">Solicitação de Orçamento</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Solicite Seu Orçamento
              </h1>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Conte-nos sobre seu projeto e receba um orçamento personalizado 
                em até <span className="font-semibold text-blue-600">24 horas</span>.
              </p>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Formulário */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2" />
                      Dados do Projeto
                    </CardTitle>
                    <CardDescription>
                      Preencha os dados abaixo para receber seu orçamento personalizado
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {error && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      {/* Informações Pessoais */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          <User className="mr-2" size={20} />
                          Informações Pessoais
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Nome Completo *</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              required
                              placeholder="Seu nome completo"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              required
                              placeholder="seu@email.com"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="phone">Telefone</Label>
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              placeholder="(11) 99999-9999"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="company">Empresa</Label>
                            <Input
                              id="company"
                              value={formData.company}
                              onChange={(e) => handleInputChange('company', e.target.value)}
                              placeholder="Nome da empresa"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Detalhes do Projeto */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          <FileText className="mr-2" size={20} />
                          Detalhes do Projeto
                        </h3>
                        
                        <div>
                          <Label htmlFor="project_type">Tipo de Projeto *</Label>
                          <Select 
                            value={formData.project_type} 
                            onValueChange={(value) => handleInputChange('project_type', value)}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo de projeto" />
                            </SelectTrigger>
                            <SelectContent>
                              {projectTypes.map(type => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="description">Descrição do Projeto *</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            required
                            placeholder="Descreva detalhadamente seu projeto, necessidades e objetivos..."
                            rows={4}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="budget_range">Faixa de Orçamento</Label>
                            <Select 
                              value={formData.budget_range} 
                              onValueChange={(value) => handleInputChange('budget_range', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a faixa" />
                              </SelectTrigger>
                              <SelectContent>
                                {budgetRanges.map(range => (
                                  <SelectItem key={range.value} value={range.value}>
                                    {range.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="urgency">Urgência</Label>
                            <Select 
                              value={formData.urgency} 
                              onValueChange={(value) => handleInputChange('urgency', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a urgência" />
                              </SelectTrigger>
                              <SelectContent>
                                {urgencyLevels.map(level => (
                                  <SelectItem key={level.value} value={level.value}>
                                    {level.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="additional_info">Informações Adicionais</Label>
                          <Textarea
                            id="additional_info"
                            value={formData.additional_info}
                            onChange={(e) => handleInputChange('additional_info', e.target.value)}
                            placeholder="Informações complementares, especificações técnicas, documentos de referência..."
                            rows={3}
                          />
                        </div>
                      </div>

                      {/* Preferências de Contato */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          <MessageSquare className="mr-2" size={20} />
                          Preferências de Contato
                        </h3>
                        
                        <div>
                          <Label htmlFor="preferred_contact">Forma de Contato Preferida</Label>
                          <Select 
                            value={formData.preferred_contact} 
                            onValueChange={(value) => handleInputChange('preferred_contact', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="phone">Telefone</SelectItem>
                              <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Enviando...
                          </>
                        ) : (
                          <>
                            Enviar Solicitação
                            <ArrowRight className="ml-2" size={16} />
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Benefícios */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Por que escolher a FHD?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">+10 anos de experiência</h4>
                        <p className="text-xs text-gray-600">Especialistas em automação industrial</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">500+ projetos realizados</h4>
                        <p className="text-xs text-gray-600">Portfólio diversificado e comprovado</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">98% de satisfação</h4>
                        <p className="text-xs text-gray-600">Clientes satisfeitos com nossos serviços</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">Suporte técnico completo</h4>
                        <p className="text-xs text-gray-600">Acompanhamento durante todo o projeto</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Processo */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Como funciona?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">Envie sua solicitação</h4>
                        <p className="text-xs text-gray-600">Preencha o formulário com os detalhes do seu projeto</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">Análise técnica</h4>
                        <p className="text-xs text-gray-600">Nossa equipe analisa os requisitos e especificações</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">Orçamento personalizado</h4>
                        <p className="text-xs text-gray-600">Receba uma proposta detalhada em até 24h</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        4
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">Início do projeto</h4>
                        <p className="text-xs text-gray-600">Após aprovação, iniciamos a execução</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contato Rápido */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contato Rápido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">(19) 99865-2144</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">comercial@fhdautomacao.com.br</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Building className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Sumaré, SP</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default QuotationPage 