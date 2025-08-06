import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  AlertCircle,
  Check,
  X,
  Save,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { quotationsAPI } from '@/api/quotations'

const QuotationsManager = () => {
  const [quotations, setQuotations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedQuotation, setSelectedQuotation] = useState(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [stats, setStats] = useState({
    pending: 0,
    in_review: 0,
    approved: 0,
    rejected: 0,
    completed: 0
  })

  useEffect(() => {
    loadQuotations()
    loadStats()
  }, [])

  const loadQuotations = async () => {
    try {
      setLoading(true)
      const data = await quotationsAPI.getAll()
      setQuotations(data)
    } catch (err) {
      console.error("Erro ao carregar orçamentos:", err)
      setError("Não foi possível carregar os orçamentos.")
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const data = await quotationsAPI.getCountByStatus()
      setStats(data)
    } catch (err) {
      console.error("Erro ao carregar estatísticas:", err)
    }
  }

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await quotationsAPI.update(id, { status: newStatus })
      await loadQuotations()
      await loadStats()
    } catch (err) {
      console.error("Erro ao atualizar status:", err)
      alert("Erro ao atualizar status. Tente novamente.")
    }
  }

  const handleDeleteQuotation = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este orçamento?")) {
      try {
        await quotationsAPI.delete(id)
        await loadQuotations()
        await loadStats()
      } catch (err) {
        console.error("Erro ao deletar orçamento:", err)
        alert("Erro ao deletar orçamento. Tente novamente.")
      }
    }
  }

  const handleUpdateQuotation = async () => {
    if (selectedQuotation) {
      try {
        await quotationsAPI.update(selectedQuotation.id, {
          status: selectedQuotation.status,
          admin_notes: selectedQuotation.admin_notes
        })
        await loadQuotations()
        await loadStats()
        setIsEditModalOpen(false)
        setSelectedQuotation(null)
      } catch (err) {
        console.error("Erro ao atualizar orçamento:", err)
        alert("Erro ao atualizar orçamento. Tente novamente.")
      }
    }
  }

  const openViewModal = (quotation) => {
    setSelectedQuotation(quotation)
    setIsViewModalOpen(true)
  }

  const openEditModal = (quotation) => {
    setSelectedQuotation({ ...quotation })
    setIsEditModalOpen(true)
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      in_review: 'bg-blue-100 text-blue-800 border-blue-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      completed: 'bg-purple-100 text-purple-800 border-purple-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pendente',
      in_review: 'Em Análise',
      approved: 'Aprovado',
      rejected: 'Rejeitado',
      completed: 'Concluído'
    }
    return labels[status] || status
  }

  const getProjectTypeLabel = (type) => {
    const types = {
      sistema_hidraulico: 'Sistema Hidráulico',
      sistema_pneumatico: 'Sistema Pneumático',
      automatizacao_industrial: 'Automação Industrial',
      manutencao_equipamentos: 'Manutenção de Equipamentos',
      projeto_personalizado: 'Projeto Personalizado',
      consultoria_tecnica: 'Consultoria Técnica',
      outro: 'Outro'
    }
    return types[type] || type
  }

  const getBudgetRangeLabel = (range) => {
    const ranges = {
      ate_5k: 'Até R$ 5.000',
      '5k_10k': 'R$ 5.000 - R$ 10.000',
      '10k_25k': 'R$ 10.000 - R$ 25.000',
      '25k_50k': 'R$ 25.000 - R$ 50.000',
      '50k_100k': 'R$ 50.000 - R$ 100.000',
      acima_100k: 'Acima de R$ 100.000',
      nao_informado: 'Não informado'
    }
    return ranges[range] || range
  }

  const getUrgencyLabel = (urgency) => {
    const levels = {
      low: 'Baixa',
      normal: 'Normal',
      high: 'Alta',
      urgent: 'Urgente'
    }
    return levels[urgency] || urgency
  }

  const filteredQuotations = quotations.filter(quotation => {
    const matchesSearch = 
      quotation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || quotation.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Função para calcular tamanho dinâmico do modal baseado no conteúdo
  const getModalSize = (quotation) => {
    if (!quotation) return "max-w-2xl"
    
    const descriptionLength = quotation.description?.length || 0
    const additionalInfoLength = quotation.additional_info?.length || 0
    const totalTextLength = descriptionLength + additionalInfoLength
    
    // Definir tamanho baseado na quantidade de texto
    if (totalTextLength > 1000) return "max-w-6xl" // Muito texto
    if (totalTextLength > 500) return "max-w-4xl"  // Texto médio
    if (totalTextLength > 200) return "max-w-3xl"  // Texto pequeno
    return "max-w-2xl" // Padrão
  }

    return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gerenciar Orçamentos</h2>
          <p className="text-gray-600">Visualize e gerencie solicitações de orçamento</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <ClockIcon className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Em Análise</p>
                <p className="text-2xl font-bold text-blue-600">{stats.in_review}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aprovados</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejeitados</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Concluídos</p>
                <p className="text-2xl font-bold text-purple-600">{stats.completed}</p>
              </div>
              <Check className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Buscar por nome, email, empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="in_review">Em Análise</SelectItem>
                  <SelectItem value="approved">Aprovado</SelectItem>
                  <SelectItem value="rejected">Rejeitado</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-600">Carregando orçamentos...</p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && filteredQuotations.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum orçamento encontrado
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca'
                : 'Ainda não há solicitações de orçamento'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredQuotations.map((quotation) => (
              <motion.div
                key={quotation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                      {/* Header com nome, contato e status */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                            {quotation.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2 truncate">
                            {quotation.email} • {quotation.phone || 'Sem telefone'}
                          </p>
                          {quotation.company && (
                            <p className="text-sm text-gray-600 mb-2 truncate">
                              <Building className="inline mr-1" size={14} />
                              {quotation.company}
                            </p>
                          )}
                        </div>
                        <div className="flex items-start gap-2 ml-4 flex-shrink-0">
                          <Badge className={`${getStatusColor(quotation.status)}`}>
                            {getStatusLabel(quotation.status)}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Informações do projeto */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs font-medium text-gray-500">Tipo de Projeto</p>
                          <p className="text-sm text-gray-900">{getProjectTypeLabel(quotation.project_type)}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Orçamento</p>
                          <p className="text-sm text-gray-900">{getBudgetRangeLabel(quotation.budget_range)}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Urgência</p>
                          <p className="text-sm text-gray-900">{getUrgencyLabel(quotation.urgency)}</p>
                        </div>
                      </div>
                      
                      {/* Descrição */}
                      <div>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {quotation.description}
                        </p>
                      </div>
                      
                      {/* Footer com data e botões */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="mr-1" size={12} />
                            {formatDate(quotation.created_at)}
                          </span>
                          <span className="flex items-center">
                            <MessageSquare className="mr-1" size={12} />
                            {quotation.preferred_contact}
                          </span>
                        </div>
                        
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openViewModal(quotation)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(quotation)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteQuotation(quotation.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className={`${getModalSize(selectedQuotation)} max-h-[90vh] overflow-y-auto`}>
          <DialogHeader>
            <DialogTitle>Detalhes do Orçamento</DialogTitle>
            <DialogDescription>
              Informações completas da solicitação
            </DialogDescription>
          </DialogHeader>
          {selectedQuotation && (
            <div className="space-y-6">
              {/* Informações Pessoais */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <User className="mr-2" size={20} />
                  Informações Pessoais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nome</p>
                    <p className="text-gray-900">{selectedQuotation.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-900">{selectedQuotation.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Telefone</p>
                    <p className="text-gray-900">{selectedQuotation.phone || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Empresa</p>
                    <p className="text-gray-900">{selectedQuotation.company || 'Não informado'}</p>
                  </div>
                </div>
              </div>

              {/* Detalhes do Projeto */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <FileText className="mr-2" size={20} />
                  Detalhes do Projeto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tipo de Projeto</p>
                    <p className="text-gray-900">{getProjectTypeLabel(selectedQuotation.project_type)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Faixa de Orçamento</p>
                    <p className="text-gray-900">{getBudgetRangeLabel(selectedQuotation.budget_range)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Urgência</p>
                    <p className="text-gray-900">{getUrgencyLabel(selectedQuotation.urgency)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Forma de Contato</p>
                    <p className="text-gray-900">{selectedQuotation.preferred_contact}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Descrição do Projeto</p>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <p className="text-gray-900 whitespace-pre-wrap break-words leading-relaxed">
                        {selectedQuotation.description}
                      </p>
                    </div>
                  </div>
                  
                  {selectedQuotation.additional_info && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Informações Adicionais</p>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-gray-900 whitespace-pre-wrap break-words leading-relaxed">
                          {selectedQuotation.additional_info}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Status e Notas */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <AlertCircle className="mr-2" size={20} />
                  Status e Notas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status Atual</p>
                    <Badge className={`${getStatusColor(selectedQuotation.status)}`}>
                      {getStatusLabel(selectedQuotation.status)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Data de Criação</p>
                    <p className="text-gray-900">{formatDate(selectedQuotation.created_at)}</p>
                  </div>
                </div>
                
                {selectedQuotation.admin_notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Notas Administrativas</p>
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedQuotation.admin_notes}</p>
                  </div>
                )}
              </div>

              {/* Ações Rápidas */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={() => handleStatusUpdate(selectedQuotation.id, 'in_review')}
                  disabled={selectedQuotation.status === 'in_review'}
                  variant="outline"
                  size="sm"
                >
                  Em Análise
                </Button>
                <Button
                  onClick={() => handleStatusUpdate(selectedQuotation.id, 'approved')}
                  disabled={selectedQuotation.status === 'approved'}
                  variant="outline"
                  size="sm"
                  className="text-green-600"
                >
                  Aprovar
                </Button>
                <Button
                  onClick={() => handleStatusUpdate(selectedQuotation.id, 'rejected')}
                  disabled={selectedQuotation.status === 'rejected'}
                  variant="outline"
                  size="sm"
                  className="text-red-600"
                >
                  Rejeitar
                </Button>
                <Button
                  onClick={() => handleStatusUpdate(selectedQuotation.id, 'completed')}
                  disabled={selectedQuotation.status === 'completed'}
                  variant="outline"
                  size="sm"
                  className="text-purple-600"
                >
                  Concluir
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Orçamento</DialogTitle>
            <DialogDescription>
              Atualize o status e adicione notas administrativas
            </DialogDescription>
          </DialogHeader>
          {selectedQuotation && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={selectedQuotation.status} 
                  onValueChange={(value) => setSelectedQuotation({ ...selectedQuotation, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="in_review">Em Análise</SelectItem>
                    <SelectItem value="approved">Aprovado</SelectItem>
                    <SelectItem value="rejected">Rejeitado</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="admin_notes">Notas Administrativas</Label>
                <Textarea
                  id="admin_notes"
                  value={selectedQuotation.admin_notes || ''}
                  onChange={(e) => setSelectedQuotation({ ...selectedQuotation, admin_notes: e.target.value })}
                  placeholder="Adicione notas sobre o orçamento..."
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleUpdateQuotation}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default QuotationsManager 