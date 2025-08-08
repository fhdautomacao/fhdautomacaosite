import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Building, 
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  User,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import AdminModal from '@/components/admin/AdminModal'
import { ModalActionButton, ModalSection, ModalGrid } from '@/components/admin/AdminModal'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { companiesAPI } from '@/api/companies'
import { billsAPI } from '@/api/bills'
import { useAuth } from '@/contexts/AuthContext'

const CompaniesManager = () => {
  const { userPermissions } = useAuth()
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [companyBills, setCompanyBills] = useState([])
  const [expandedBillId, setExpandedBillId] = useState(null)
  // Abrir automaticamente detalhes da empresa via query (?companyId=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const companyId = params.get('companyId')
    if (companyId && companies.length) {
      const company = companies.find(c => String(c.id) === String(companyId))
      if (company) {
        setSelectedCompany(company)
        loadCompanyBills(company.id)
        setShowDetailsModal(true)
        // Limpa completamente a URL (sem query params)
        const base = window.location.pathname
        window.history.replaceState({}, '', base)
      }
    }
  }, [companies])

  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    emails: [''],
    phones: [''],
    whatsapp: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    contact_person: '',
    notes: '',
    status: 'active'
  })

  // Estados para validação
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadCompanies()
  }, [])

  const loadCompanies = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await companiesAPI.getAll()
      setCompanies(data)
    } catch (err) {
      console.error("Erro ao carregar empresas:", err)
      
      // Tratamento específico de erros
      let errorMessage = "Não foi possível carregar as empresas."
      
      if (err.code) {
        switch (err.code) {
          case '42501':
            errorMessage = "Sem permissão para visualizar empresas. Verifique suas credenciais."
            break
          case '42P01':
            errorMessage = "Erro de configuração do banco de dados. Contate o administrador."
            break
          case '08006':
            errorMessage = "Erro de conexão com o banco de dados. Verifique sua internet."
            break
          default:
            if (err.message) {
              errorMessage = `Erro: ${err.message}`
            }
        }
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Função para validar formulário
  const validateForm = () => {
    const newErrors = {}

    // Validar nome
    if (!formData.name.trim()) {
      newErrors.name = 'Nome da empresa é obrigatório'
    }

    // Validar CNPJ (se preenchido)
    if (formData.cnpj && formData.cnpj.replace(/\D/g, '').length !== 14) {
      newErrors.cnpj = 'CNPJ deve ter 14 dígitos'
    }

    // Validar emails
    formData.emails.forEach((email, index) => {
      if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        newErrors[`email_${index}`] = 'Email inválido'
      }
    })

    // Validar telefones
    formData.phones.forEach((phone, index) => {
      if (phone.trim() && phone.replace(/\D/g, '').length < 10) {
        newErrors[`phone_${index}`] = 'Telefone deve ter pelo menos 10 dígitos'
      }
    })

    // Validar WhatsApp (se preenchido)
    if (formData.whatsapp && formData.whatsapp.replace(/\D/g, '').length < 10) {
      newErrors.whatsapp = 'WhatsApp deve ter pelo menos 10 dígitos'
    }

    // Validar CEP (se preenchido)
    if (formData.zip_code) {
      const zipDigits = formData.zip_code.replace(/\D/g, '')
      if (zipDigits.length < 8) {
        newErrors.zip_code = 'CEP deve ter pelo menos 8 dígitos'
      } else if (zipDigits.length > 9) {
        newErrors.zip_code = 'CEP muito longo'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Funções para gerenciar múltiplos emails e telefones
  const addEmail = () => {
    const validEmails = formData.emails.filter(email => email.trim())
    const combinedEmails = validEmails.join(';')
    if (validEmails.length > 0 && (combinedEmails.length + 20) > 255) {
      setErrors(prev => ({
        ...prev,
        email_0: 'Limite de emails atingido (máximo 255 caracteres no total)'
      }))
      return
    }
    setFormData(prev => ({
      ...prev,
      emails: [...prev.emails, '']
    }))
  }

  const removeEmail = (index) => {
    setFormData(prev => ({
      ...prev,
      emails: prev.emails.filter((_, i) => i !== index)
    }))
    // Limpar erros relacionados ao email removido
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[`email_${index}`]
      if (index === 0) delete newErrors.email_0
      return newErrors
    })
  }

  const updateEmail = (index, value) => {
    setFormData(prev => ({
      ...prev,
      emails: prev.emails.map((email, i) => i === index ? value : email)
    }))
    // Limpar erros relacionados ao email atualizado
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[`email_${index}`]
      if (index === 0) delete newErrors.email_0
      return newErrors
    })
  }

  const addPhone = () => {
    setFormData(prev => ({
      ...prev,
      phones: [...prev.phones, '']
    }))
  }

  const removePhone = (index) => {
    setFormData(prev => ({
      ...prev,
      phones: prev.phones.filter((_, i) => i !== index)
    }))
    // Limpar erros relacionados ao telefone removido
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[`phone_${index}`]
      if (index === 0) delete newErrors.phone_0
      return newErrors
    })
  }

  // Função para formatar CNPJ
  const formatCNPJ = (value) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')
    
    // Aplica a máscara: XX.XXX.XXX/XXXX-XX
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`
    if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`
    if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`
  }

  // Função para formatar telefone
  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 2) return `(${numbers}`
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6, 10)}`
  }

  const updatePhone = (index, value) => {
    const formattedValue = formatPhone(value)
    setFormData(prev => ({
      ...prev,
      phones: prev.phones.map((phone, i) => i === index ? formattedValue : phone)
    }))
    // Limpar erros relacionados ao telefone atualizado
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[`phone_${index}`]
      if (index === 0) delete newErrors.phone_0
      return newErrors
    })
  }

  const handleCreateCompany = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    setErrors({})

    try {
      // Preparar dados para envio
      const { emails, phones, ...restFormData } = formData
      
      const submitData = {
        ...restFormData,
        email: emails.filter(email => email.trim()).join(';'),
        phone: phones.filter(phone => phone.trim()).join(';'),
        whatsapp: formData.whatsapp || null
      }

      const newCompany = await companiesAPI.create(submitData)
      
      setCompanies(prev => [newCompany, ...prev])
      setShowCreateModal(false)
      
      // Reset form
      setFormData({
        name: '',
        cnpj: '',
        emails: [''],
        phones: [''],
        whatsapp: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        contact_person: '',
        notes: '',
        status: 'active'
      })
      
    } catch (error) {
      console.error("Erro ao criar empresa:", error)
      
      // Mapear erros do backend para campos específicos
      const fieldErrors = {}
      
      if (error.message) {
        if (error.message.includes('name')) {
          fieldErrors.name = 'Nome é obrigatório'
        } else if (error.message.includes('cnpj')) {
          fieldErrors.cnpj = 'CNPJ inválido'
        } else if (error.message.includes('email')) {
          fieldErrors.email_0 = 'Email inválido'
        } else if (error.message.includes('phone')) {
          fieldErrors.phone_0 = 'Telefone inválido'
        } else if (error.message.includes('whatsapp')) {
          fieldErrors.whatsapp = 'WhatsApp inválido'
        } else if (error.message.includes('zip_code')) {
          fieldErrors.zip_code = 'CEP inválido'
        } else {
          fieldErrors.submit = error.message
        }
      } else {
        fieldErrors.submit = "Erro ao criar empresa. Tente novamente."
      }
      
      setErrors(fieldErrors)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateCompany = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    setErrors({})

    try {
      // Preparar dados para envio
      const { emails, phones, ...restFormData } = formData
      
      const submitData = {
        ...restFormData,
        email: emails.filter(email => email.trim()).join(';'),
        phone: phones.filter(phone => phone.trim()).join(';'),
        whatsapp: formData.whatsapp || null
      }

      const updatedCompany = await companiesAPI.update(selectedCompany.id, submitData)
      
      setCompanies(prev => prev.map(company => 
        company.id === selectedCompany.id ? updatedCompany : company
      ))
      setShowEditModal(false)
      
    } catch (error) {
      console.error("Erro ao atualizar empresa:", error)
      
      // Mapear erros do backend para campos específicos
      const fieldErrors = {}
      
      if (error.message) {
        if (error.message.includes('name')) {
          fieldErrors.name = 'Nome é obrigatório'
        } else if (error.message.includes('cnpj')) {
          fieldErrors.cnpj = 'CNPJ inválido'
        } else if (error.message.includes('email')) {
          fieldErrors.email_0 = 'Email inválido'
        } else if (error.message.includes('phone')) {
          fieldErrors.phone_0 = 'Telefone inválido'
        } else if (error.message.includes('whatsapp')) {
          fieldErrors.whatsapp = 'WhatsApp inválido'
        } else if (error.message.includes('zip_code')) {
          fieldErrors.zip_code = 'CEP inválido'
        } else {
          fieldErrors.submit = error.message
        }
      } else {
        fieldErrors.submit = "Erro ao atualizar empresa. Tente novamente."
      }
      
      setErrors(fieldErrors)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCompany = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta empresa?")) {
      try {
        await companiesAPI.delete(id)
        loadCompanies()
      } catch (err) {
        console.error("Erro ao deletar empresa:", err)
        
        // Tratamento específico de erros
        let errorMessage = "Erro ao deletar empresa. Tente novamente."
        
        if (err.code) {
          switch (err.code) {
            case '23503':
              errorMessage = "Não é possível deletar esta empresa pois ela possui boletos associados. Remova os boletos primeiro."
              break
            case '42501':
              errorMessage = "Sem permissão para deletar empresa. Verifique suas credenciais."
              break
            case '42P01':
              errorMessage = "Erro de configuração do banco de dados. Contate o administrador."
              break
            case 'PGRST116':
              errorMessage = "Empresa não encontrada ou já foi removida."
              break
            default:
              if (err.message) {
                errorMessage = `Erro: ${err.message}`
              }
          }
        } else if (err.message) {
          errorMessage = err.message
        }
        
        alert(errorMessage)
      }
    }
  }

  const loadCompanyBills = async (companyId) => {
    try {
      const bills = await billsAPI.getByCompany(companyId)
      setCompanyBills(bills)
    } catch (err) {
      console.error("Erro ao carregar boletos da empresa:", err)
      setCompanyBills([])
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Cores para status de pagamentos/boletos
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatPhoneForDisplay = (phone) => {
    // Remove todos os caracteres não numéricos
    const numbers = phone.replace(/\D/g, '');
    
    // Se tem 11 dígitos (com DDD), formata como celular
    if (numbers.length === 11) {
      return `+55 (${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    }
    // Se tem 10 dígitos (com DDD), formata como telefone fixo
    else if (numbers.length === 10) {
      return `+55 (${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    }
    // Se tem 13 dígitos (com código do país), formata como celular
    else if (numbers.length === 13 && numbers.startsWith('55')) {
      return `+55 (${numbers.slice(2, 4)}) ${numbers.slice(4, 9)}-${numbers.slice(9)}`;
    }
    // Se tem 12 dígitos (com código do país), formata como telefone fixo
    else if (numbers.length === 12 && numbers.startsWith('55')) {
      return `+55 (${numbers.slice(2, 4)}) ${numbers.slice(4, 8)}-${numbers.slice(8)}`;
    }
    // Caso contrário, retorna o número original
    return phone;
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (company.cnpj && company.cnpj.includes(searchTerm)) ||
                         (company.email && company.email.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = filterStatus === 'all' || company.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  if (!userPermissions.canAccessBills) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Acesso Negado</h3>
          <p className="text-gray-600">Você não tem permissão para acessar esta seção.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Empresas</h1>
          <p className="text-gray-600 mt-1">Gerencie todas as empresas cadastradas no sistema</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nova Empresa
        </Button>
      </div>

      {/* Filters Card */}
      <Card className="bg-gradient-to-r from-gray-50 to-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Search className="h-4 w-4" />
                Buscar
              </Label>
              <Input
                placeholder="Nome, CNPJ ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Status
              </Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="active">Ativas</SelectItem>
                  <SelectItem value="inactive">Inativas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={loadCompanies}
                className="w-full border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {/* Companies List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
          <p className="text-gray-600 text-lg">Carregando empresas...</p>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <Building className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma empresa encontrada</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {companies.length === 0 ? 'Ainda não há empresas cadastradas. Clique em "Nova Empresa" para começar.' : 'Nenhuma empresa corresponde aos filtros aplicados'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredCompanies.map((company) => (
            <Card key={company.id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-r from-white to-gray-50 hover:from-blue-50 hover:to-white">
              <CardContent className="p-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{company.name}</h3>
                      <Badge className={`mt-1 ${getStatusColor(company.status)}`}>
                        {company.status === 'active' ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                    {/* Coluna Esquerda */}
                    <div className="space-y-3">
                      {company.cnpj && (
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <span className="font-semibold text-gray-700 flex items-center gap-2 mb-1 text-xs">
                            <FileText className="h-3 w-3 text-gray-500" />
                            CNPJ
                          </span>
                          <p className="font-bold text-gray-900 text-sm">{company.cnpj}</p>
                        </div>
                      )}
                      
                      {company.email && (
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <span className="font-semibold text-gray-700 flex items-center gap-2 mb-1 text-xs">
                            <Mail className="h-3 w-3 text-gray-500" />
                            Emails
                          </span>
                          <div className="space-y-1">
                            {company.email.split(';').filter(email => email.trim()).map((email, index) => (
                              <div key={index} className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                {email.trim()}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {company.address && (
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <span className="font-semibold text-gray-700 flex items-center gap-2 mb-1 text-xs">
                            <MapPin className="h-3 w-3 text-gray-500" />
                            Endereço
                          </span>
                          <p className="text-gray-900 text-sm">
                            {company.address}
                            {company.city && `, ${company.city}`}
                            {company.state && ` - ${company.state}`}
                            {company.zip_code && `, ${company.zip_code}`}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Coluna Direita */}
                    <div className="space-y-3">
                      {company.contact_person && (
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <span className="font-semibold text-gray-700 flex items-center gap-2 mb-1 text-xs">
                            <User className="h-3 w-3 text-gray-500" />
                            Contato
                          </span>
                          <p className="font-bold text-gray-900 text-sm">{company.contact_person}</p>
                        </div>
                      )}
                      
                      {company.phone && (
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <span className="font-semibold text-gray-700 flex items-center gap-2 mb-1 text-xs">
                            <Phone className="h-3 w-3 text-gray-500" />
                            Telefones
                          </span>
                          <div className="space-y-1">
                            {company.phone.split(';').filter(phone => phone.trim()).map((phone, index) => (
                              <div key={index} className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                {formatPhoneForDisplay(phone.trim())}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {company.whatsapp && (
                        <div className="bg-white p-3 rounded-lg border border-green-200 bg-green-50">
                          <span className="font-semibold text-green-700 flex items-center gap-2 mb-1 text-xs">
                            <MessageCircle className="h-3 w-3 text-green-500" />
                            WhatsApp
                          </span>
                          <div className="font-semibold text-green-900 text-sm flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            {formatPhoneForDisplay(company.whatsapp)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {company.notes && (
                    <div className="bg-white p-3 rounded-lg border border-gray-200 mb-3">
                      <span className="font-semibold text-gray-700 flex items-center gap-2 mb-1 text-xs">
                        <FileText className="h-3 w-3 text-gray-500" />
                        Observações
                      </span>
                      <p className="text-gray-900 text-sm">{company.notes}</p>
                    </div>
                  )}
                  
                  {/* Botões de Ação */}
                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCompany(company)
                        loadCompanyBills(company.id)
                        setShowDetailsModal(true)
                      }}
                      className="bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800 hover:border-blue-300 transition-all duration-200 text-xs px-3 py-1"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCompany(company)
                        setFormData({
                          name: company.name,
                          cnpj: company.cnpj ? formatCNPJ(company.cnpj) : '',
                          emails: company.email ? company.email.split(';').filter(email => email.trim()) : [''],
                          phones: company.phone ? company.phone.split(';').filter(phone => phone.trim()).map(phone => formatPhone(phone)) : [''],
                          whatsapp: company.whatsapp ? formatPhone(company.whatsapp) : '',
                          address: company.address || '',
                          city: company.city || '',
                          state: company.state || '',
                          zip_code: company.zip_code || '',
                          contact_person: company.contact_person || '',
                          notes: company.notes || '',
                          status: company.status
                        })
                        setShowEditModal(true)
                      }}
                      className="bg-white hover:bg-green-50 border-green-200 text-green-700 hover:text-green-800 hover:border-green-300 transition-all duration-200 text-xs px-3 py-1"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCompany(company.id)}
                      className="bg-white hover:bg-red-50 border-red-200 text-red-700 hover:text-red-800 hover:border-red-300 transition-all duration-200 text-xs px-3 py-1"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <AdminModal
        open={showCreateModal}
        onOpenChange={(open) => {
          setShowCreateModal(open)
          if (!open) {
            setErrors({})
            setFormData({
              name: '',
              cnpj: '',
              emails: [''],
              phones: [''],
              whatsapp: '',
              address: '',
              city: '',
              state: '',
              zip_code: '',
              contact_person: '',
              notes: '',
              status: 'active'
            })
          }
        }}
        title="Criar Nova Empresa"
        description="Preencha os dados da empresa"
        type="create"
        size="xl"
      >
        <div className="space-y-8">
          {/* Mensagem de erro geral */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-700 font-medium">{errors.submit}</p>
              </div>
            </div>
          )}

          <ModalSection title="Informações Básicas">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">Nome da Empresa *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nome da empresa"
                  className={`transition-all duration-200 ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                />
                {errors.name && (
                  <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.name}
                  </p>
                )}
              </div>
              
              <ModalGrid cols={2}>
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">CNPJ</Label>
                  <Input
                    value={formData.cnpj}
                    onChange={(e) => setFormData({...formData, cnpj: formatCNPJ(e.target.value)})}
                    placeholder="00.000.000/0000-00"
                    maxLength={18}
                    className={`transition-all duration-200 ${errors.cnpj ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                  />
                  {errors.cnpj && (
                    <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.cnpj}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger className={`transition-all duration-200 ${errors.status ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativa</SelectItem>
                      <SelectItem value="inactive">Inativa</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.status}
                    </p>
                  )}
                </div>
              </ModalGrid>
            </div>
          </ModalSection>

          <ModalSection title="Contato">
            <div className="space-y-6">
              {/* Emails */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-gray-700">Emails</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addEmail}
                    className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300 bg-blue-50 hover:bg-blue-100 transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar Email
                  </Button>
                </div>
                
                {formData.emails.map((email, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1">
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => updateEmail(index, e.target.value)}
                        placeholder="contato@empresa.com"
                        className={`transition-all duration-200 ${errors[`email_${index}`] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                      />
                      {errors[`email_${index}`] && (
                        <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors[`email_${index}`]}
                        </p>
                      )}
                    </div>
                    {formData.emails.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeEmail(index)}
                        className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 bg-red-50 hover:bg-red-100 transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Telefones */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-gray-700">Telefones</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPhone}
                    className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-300 bg-green-50 hover:bg-green-100 transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar Telefone
                  </Button>
                </div>
                
                {formData.phones.map((phone, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1">
                      <Input
                        value={phone}
                        onChange={(e) => updatePhone(index, e.target.value)}
                        placeholder="(11) 99999-9999"
                        maxLength={20}
                        className={`transition-all duration-200 ${errors[`phone_${index}`] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                      />
                      {errors[`phone_${index}`] && (
                        <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors[`phone_${index}`]}
                        </p>
                      )}
                    </div>
                    {formData.phones.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removePhone(index)}
                        className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 bg-red-50 hover:bg-red-100 transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* WhatsApp */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">WhatsApp</Label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Input
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({...formData, whatsapp: formatPhone(e.target.value)})}
                      placeholder="(11) 99999-9999"
                      maxLength={20}
                      className={`transition-all duration-200 ${errors.whatsapp ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                    />
                    {errors.whatsapp && (
                      <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.whatsapp}
                      </p>
                    )}
                  </div>
                  {formData.whatsapp && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-700 text-xs font-medium">WhatsApp</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">Pessoa de Contato</Label>
                <Input
                  value={formData.contact_person}
                  onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
                  placeholder="Nome do contato"
                  className={`transition-all duration-200 ${errors.contact_person ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                />
                {errors.contact_person && (
                  <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.contact_person}
                  </p>
                )}
              </div>
            </div>
          </ModalSection>

          <ModalSection title="Endereço">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">Endereço</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Rua, número, complemento"
                  className={`transition-all duration-200 ${errors.address ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                />
                {errors.address && (
                  <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.address}
                  </p>
                )}
              </div>
              
              <ModalGrid cols={3}>
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Cidade</Label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="Cidade"
                    className={`transition-all duration-200 ${errors.city ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                  />
                  {errors.city && (
                    <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.city}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Estado</Label>
                  <Input
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    placeholder="SP"
                    maxLength={2}
                    className={`transition-all duration-200 ${errors.state ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                  />
                  {errors.state && (
                    <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.state}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">CEP</Label>
                  <Input
                    value={formData.zip_code}
                    onChange={(e) => setFormData({...formData, zip_code: e.target.value})}
                    placeholder="00000-000"
                    maxLength={15}
                    className={`transition-all duration-200 ${errors.zip_code ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                  />
                  {errors.zip_code && (
                    <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.zip_code}
                    </p>
                  )}
                </div>
              </ModalGrid>
            </div>
          </ModalSection>

          <ModalSection title="Observações">
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">Observações</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Observações adicionais..."
                rows={4}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
              />
            </div>
          </ModalSection>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 bg-gray-50 -mx-6 -mb-6 px-6 py-4">
            <ModalActionButton
              onClick={() => setShowCreateModal(false)}
              variant="outline"
              className="border-gray-300 hover:bg-gray-50 hover:border-gray-400"
            >
              Cancelar
            </ModalActionButton>
            <ModalActionButton
              onClick={handleCreateCompany}
              variant="success"
              disabled={isSubmitting}
              icon={isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isSubmitting ? 'Criando...' : 'Criar Empresa'}
            </ModalActionButton>
          </div>
        </div>
      </AdminModal>

      {/* Edit Modal */}
      <AdminModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        title="Editar Empresa"
        description="Edite as informações da empresa"
        type="edit"
        size="xl"
      >
        <div className="space-y-8">
          {/* Mensagem de erro geral */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-700 font-medium">{errors.submit}</p>
              </div>
            </div>
          )}

          <ModalSection title="Informações Básicas">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">Nome da Empresa *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nome da empresa"
                  className={`transition-all duration-200 ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                />
                {errors.name && (
                  <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.name}
                  </p>
                )}
              </div>
              
              <ModalGrid cols={2}>
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">CNPJ</Label>
                  <Input
                    value={formData.cnpj}
                    onChange={(e) => setFormData({...formData, cnpj: formatCNPJ(e.target.value)})}
                    placeholder="00.000.000/0000-00"
                    maxLength={18}
                    className={`transition-all duration-200 ${errors.cnpj ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                  />
                  {errors.cnpj && (
                    <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.cnpj}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger className={`transition-all duration-200 ${errors.status ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativa</SelectItem>
                      <SelectItem value="inactive">Inativa</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.status}
                    </p>
                  )}
                </div>
              </ModalGrid>
            </div>
          </ModalSection>

          <ModalSection title="Contato">
            <div className="space-y-6">
              {/* Emails */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-gray-700">Emails</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addEmail}
                    className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300 bg-blue-50 hover:bg-blue-100 transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar Email
                  </Button>
                </div>
                
                {formData.emails.map((email, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1">
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => updateEmail(index, e.target.value)}
                        placeholder="contato@empresa.com"
                        className={`transition-all duration-200 ${errors[`email_${index}`] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                      />
                      {errors[`email_${index}`] && (
                        <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors[`email_${index}`]}
                        </p>
                      )}
                    </div>
                    {formData.emails.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeEmail(index)}
                        className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 bg-red-50 hover:bg-red-100 transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Telefones */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-gray-700">Telefones</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPhone}
                    className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-300 bg-green-50 hover:bg-green-100 transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar Telefone
                  </Button>
                </div>
                
                {formData.phones.map((phone, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1">
                      <Input
                        value={phone}
                        onChange={(e) => updatePhone(index, e.target.value)}
                        placeholder="(11) 99999-9999"
                        maxLength={20}
                        className={`transition-all duration-200 ${errors[`phone_${index}`] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                      />
                      {errors[`phone_${index}`] && (
                        <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors[`phone_${index}`]}
                        </p>
                      )}
                    </div>
                    {formData.phones.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removePhone(index)}
                        className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 bg-red-50 hover:bg-red-100 transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* WhatsApp */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">WhatsApp</Label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Input
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({...formData, whatsapp: formatPhone(e.target.value)})}
                      placeholder="(11) 99999-9999"
                      maxLength={20}
                      className={`transition-all duration-200 ${errors.whatsapp ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                    />
                    {errors.whatsapp && (
                      <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.whatsapp}
                      </p>
                    )}
                  </div>
                  {formData.whatsapp && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-700 text-xs font-medium">WhatsApp</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">Pessoa de Contato</Label>
                <Input
                  value={formData.contact_person}
                  onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
                  placeholder="Nome do contato"
                  className={`transition-all duration-200 ${errors.contact_person ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                />
                {errors.contact_person && (
                  <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.contact_person}
                  </p>
                )}
              </div>
            </div>
          </ModalSection>

          <ModalSection title="Endereço">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">Endereço</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Rua, número, complemento"
                  className={`transition-all duration-200 ${errors.address ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                />
                {errors.address && (
                  <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.address}
                  </p>
                )}
              </div>
              
              <ModalGrid cols={3}>
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Cidade</Label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="Cidade"
                    className={`transition-all duration-200 ${errors.city ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                  />
                  {errors.city && (
                    <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.city}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Estado</Label>
                  <Input
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    placeholder="SP"
                    maxLength={2}
                    className={`transition-all duration-200 ${errors.state ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                  />
                  {errors.state && (
                    <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.state}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">CEP</Label>
                  <Input
                    value={formData.zip_code}
                    onChange={(e) => setFormData({...formData, zip_code: e.target.value})}
                    placeholder="00000-000"
                    maxLength={15}
                    className={`transition-all duration-200 ${errors.zip_code ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                  />
                  {errors.zip_code && (
                    <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.zip_code}
                    </p>
                  )}
                </div>
              </ModalGrid>
            </div>
          </ModalSection>

          <ModalSection title="Observações">
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">Observações</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Observações adicionais..."
                rows={4}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
              />
            </div>
          </ModalSection>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 bg-gray-50 -mx-6 -mb-6 px-6 py-4">
            <ModalActionButton
              onClick={() => setShowEditModal(false)}
              variant="outline"
              className="border-gray-300 hover:bg-gray-50 hover:border-gray-400"
            >
              Cancelar
            </ModalActionButton>
            <ModalActionButton
              onClick={handleUpdateCompany}
              variant="primary"
              disabled={isSubmitting}
              icon={isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Edit className="h-4 w-4" />}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </ModalActionButton>
          </div>
        </div>
      </AdminModal>

      {/* Details Modal */}
      <AdminModal
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        title="Detalhes da Empresa"
        description="Visualize todas as informações e boletos da empresa"
        type="view"
        size="xl"
      >
        {selectedCompany && (
          <div className="space-y-8">
            {/* Informações da Empresa */}
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                  <Building className="h-5 w-5 text-blue-600" />
                  Informações da Empresa
                </h3>
                <Badge className={`${getStatusColor(selectedCompany.status)}`}>
                  {selectedCompany.status === 'active' ? 'Ativa' : 'Inativa'}
                </Badge>
              </div>
              
              {/* Nome da empresa ocupa as duas colunas quando há WhatsApp */}
              {selectedCompany.whatsapp && (
                <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
                  <Label className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                    <Building className="h-4 w-4 text-blue-500" />
                    Nome da Empresa
                  </Label>
                  <p className="text-gray-900 font-bold text-lg">{selectedCompany.name}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Coluna Esquerda */}
                <div className="space-y-4">
                  {!selectedCompany.whatsapp && (
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <Label className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                        <Building className="h-4 w-4 text-blue-500" />
                        Nome da Empresa
                      </Label>
                      <p className="text-gray-900 font-bold text-lg">{selectedCompany.name}</p>
                    </div>
                  )}
                  
                  {selectedCompany.cnpj && (
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <Label className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        CNPJ
                      </Label>
                      <p className="text-gray-900 font-bold">{selectedCompany.cnpj}</p>
                    </div>
                  )}
                  
                  {selectedCompany.email && selectedCompany.whatsapp && (
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <Label className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
                        <Mail className="h-4 w-4 text-blue-500" />
                        Emails
                      </Label>
                      <div className="space-y-2">
                        {selectedCompany.email.split(';').filter(email => email.trim()).map((email, index) => (
                          <div key={index} className="font-semibold text-gray-900 flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            {email.trim()}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedCompany.address && (
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <Label className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        Endereço
                      </Label>
                      <p className="text-gray-900">
                        {selectedCompany.address}
                        {selectedCompany.city && `, ${selectedCompany.city}`}
                        {selectedCompany.state && ` - ${selectedCompany.state}`}
                        {selectedCompany.zip_code && `, ${selectedCompany.zip_code}`}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Coluna Direita */}
                <div className="space-y-4">
                  {selectedCompany.contact_person && (
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <Label className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-gray-500" />
                        Pessoa de Contato
                      </Label>
                      <p className="text-gray-900 font-bold">{selectedCompany.contact_person}</p>
                    </div>
                  )}
                  
                  {selectedCompany.email && !selectedCompany.whatsapp && (
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <Label className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
                        <Mail className="h-4 w-4 text-blue-500" />
                        Emails
                      </Label>
                      <div className="space-y-2">
                        {selectedCompany.email.split(';').filter(email => email.trim()).map((email, index) => (
                          <div key={index} className="font-semibold text-gray-900 flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            {email.trim()}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedCompany.phone && (
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <Label className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
                        <Phone className="h-4 w-4 text-green-500" />
                        Telefones
                      </Label>
                      {(() => {
                        const phones = selectedCompany.phone.split(';').filter(phone => phone.trim());
                        if (phones.length === 1) {
                          return (
                            <div className="font-semibold text-gray-900 flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              {formatPhoneForDisplay(phones[0])}
                            </div>
                          );
                        } else {
                          return (
                            <div className="relative">
                              <select className="w-full p-2 pr-8 border border-gray-300 rounded-md bg-white text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none">
                                {phones.map((phone, index) => (
                                  <option key={index} value={phone.trim()}>
                                    {formatPhoneForDisplay(phone.trim())}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  )}
                  
                  {selectedCompany.whatsapp && (
                    <div className="bg-white p-4 rounded-lg border border-green-200 bg-green-50">
                      <Label className="font-semibold text-green-700 flex items-center gap-2 mb-2">
                        <MessageCircle className="h-4 w-4 text-green-500" />
                        WhatsApp
                      </Label>
                      <div className="font-semibold text-green-900 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {formatPhoneForDisplay(selectedCompany.whatsapp)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {selectedCompany.notes && (
                <div className="bg-white p-4 rounded-lg border border-gray-200 mt-4">
                  <Label className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    Observações
                  </Label>
                  <p className="text-gray-900">{selectedCompany.notes}</p>
                </div>
              )}
            </div>
            
            {/* Boletos da Empresa */}
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-600" />
                Boletos da Empresa
              </h4>
              
              {companyBills.length === 0 ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum boleto encontrado</h3>
                  <p className="text-gray-600">Esta empresa ainda não possui boletos cadastrados.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {companyBills.map((bill) => (
                    <div key={bill.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <span className="font-semibold text-gray-900 text-lg">{bill.description}</span>
                            <p className="text-sm text-gray-600 mt-1">
                              {new Date(bill.created_at).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-lg text-gray-900">{formatCurrency(bill.total_amount)}</span>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={bill.type === 'receivable' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-orange-100 text-orange-800 border-orange-200'}>
                              {bill.type === 'receivable' ? 'A Receber' : 'A Pagar'}
                            </Badge>
                            <Badge className={getPaymentStatusColor(bill.status)}>
                              {bill.status === 'pending' ? 'Pendente' : 
                               bill.status === 'paid' ? 'Pago' : 
                               bill.status === 'overdue' ? 'Vencido' : 'Cancelado'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setExpandedBillId(expandedBillId === bill.id ? null : bill.id)}
                            className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 hover:text-blue-800 hover:border-blue-300 transition-all duration-200"
                          >
                            <Eye className="h-4 w-4 mr-1" /> Ver
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                            title="Abrir no Gerenciador de Boletos"
                            onClick={() => {
                              const url = `/admin-fhd?open=bills&billId=${bill.id}&origin=company&companyId=${selectedCompany?.id || ''}`
                              window.location.href = url
                            }}
                          >
                            Ir <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>

                      {expandedBillId === bill.id && (
                        <div className="px-4 pb-4 bg-gray-50 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4 pt-4">
                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                              <span className="text-gray-500 font-medium">Primeiro vencimento:</span>
                              <p className="font-semibold text-gray-900">{bill.first_due_date ? new Date(bill.first_due_date).toLocaleDateString('pt-BR') : '-'}</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                              <span className="text-gray-500 font-medium">Parcelas:</span>
                              <p className="font-semibold text-gray-900">{bill.bill_installments?.length || bill.installments || 0}</p>
                            </div>
                          </div>
                          <div className="bg-white border border-gray-200 rounded-lg divide-y max-h-64 overflow-y-auto">
                            {(bill.bill_installments || []).map((inst) => (
                              <div key={inst.id} className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                  <span className="text-sm text-gray-600 font-medium">Parcela {inst.installment_number}</span>
                                  <span className="text-sm text-gray-700">{new Date(inst.due_date).toLocaleDateString('pt-BR')}</span>
                                  <span className="font-bold text-gray-900">{formatCurrency(inst.amount)}</span>
                                  <Badge className={getPaymentStatusColor(inst.status)}>
                                    {inst.status === 'pending' ? 'Pendente' : inst.status === 'paid' ? 'Pago' : inst.status === 'overdue' ? 'Vencido' : 'Cancelado'}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </AdminModal>
      </div>
    )
  }
  
  export default CompaniesManager 