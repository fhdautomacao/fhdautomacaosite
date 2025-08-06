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
  MapPin,
  User,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  Download,
  Upload
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
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

  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    contact_person: '',
    notes: '',
    status: 'active'
  })

  useEffect(() => {
    loadCompanies()
  }, [])

  const loadCompanies = async () => {
    try {
      setLoading(true)
      const data = await companiesAPI.getAll()
      setCompanies(data)
    } catch (err) {
      console.error("Erro ao carregar empresas:", err)
      setError("Não foi possível carregar as empresas.")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCompany = async () => {
    try {
      await companiesAPI.create(formData)
      
      setShowCreateModal(false)
      setFormData({
        name: '',
        cnpj: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        contact_person: '',
        notes: '',
        status: 'active'
      })
      loadCompanies()
    } catch (err) {
      console.error("Erro ao criar empresa:", err)
      alert("Erro ao criar empresa. Tente novamente.")
    }
  }

  const handleUpdateCompany = async () => {
    try {
      await companiesAPI.update(selectedCompany.id, formData)
      
      setShowEditModal(false)
      setSelectedCompany(null)
      loadCompanies()
    } catch (err) {
      console.error("Erro ao atualizar empresa:", err)
      alert("Erro ao atualizar empresa. Tente novamente.")
    }
  }

  const handleDeleteCompany = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta empresa?")) {
      try {
        await companiesAPI.delete(id)
        loadCompanies()
      } catch (err) {
        console.error("Erro ao deletar empresa:", err)
        alert("Erro ao deletar empresa. Tente novamente.")
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gerenciar Empresas</h2>
          <p className="text-gray-600">Cadastre e gerencie as empresas parceiras</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Empresa
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Empresas</p>
                <p className="text-2xl font-bold text-blue-600">{companies.length}</p>
              </div>
              <Building className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Empresas Ativas</p>
                <p className="text-2xl font-bold text-green-600">
                  {companies.filter(c => c.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Empresas Inativas</p>
                <p className="text-2xl font-bold text-gray-600">
                  {companies.filter(c => c.status === 'inactive').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Buscar</Label>
              <Input
                placeholder="Nome, CNPJ ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
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
              <Button variant="outline" onClick={loadCompanies}>
                <Filter className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Companies List */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Carregando empresas...</p>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="text-center py-8">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma empresa encontrada</h3>
          <p className="text-gray-600">
            {companies.length === 0 ? 'Ainda não há empresas cadastradas' : 'Nenhuma empresa corresponde aos filtros aplicados'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredCompanies.map((company) => (
            <Card key={company.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                      <Badge className={getStatusColor(company.status)}>
                        {company.status === 'active' ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                      {company.cnpj && (
                        <div>
                          <span className="font-medium text-gray-500">CNPJ:</span>
                          <p className="font-semibold text-gray-900">{company.cnpj}</p>
                        </div>
                      )}
                      {company.email && (
                        <div>
                          <span className="font-medium text-gray-500">Email:</span>
                          <p className="font-semibold text-gray-900">{company.email}</p>
                        </div>
                      )}
                      {company.phone && (
                        <div>
                          <span className="font-medium text-gray-500">Telefone:</span>
                          <p className="font-semibold text-gray-900">{company.phone}</p>
                        </div>
                      )}
                      {company.contact_person && (
                        <div>
                          <span className="font-medium text-gray-500">Contato:</span>
                          <p className="font-semibold text-gray-900">{company.contact_person}</p>
                        </div>
                      )}
                    </div>
                    
                    {company.address && (
                      <div className="text-sm mb-3">
                        <span className="font-medium text-gray-500">Endereço:</span>
                        <p className="text-gray-900">
                          {company.address}
                          {company.city && `, ${company.city}`}
                          {company.state && ` - ${company.state}`}
                          {company.zip_code && `, ${company.zip_code}`}
                        </p>
                      </div>
                    )}
                    
                    {company.notes && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-500">Observações:</span>
                        <p className="text-gray-900">{company.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCompany(company)
                        loadCompanyBills(company.id)
                        setShowDetailsModal(true)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCompany(company)
                        setFormData({
                          name: company.name,
                          cnpj: company.cnpj || '',
                          email: company.email || '',
                          phone: company.phone || '',
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
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCompany(company.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Criar Nova Empresa</DialogTitle>
            <DialogDescription>
              Preencha os dados da empresa.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Nome da Empresa *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Nome da empresa"
              />
            </div>
            
            <div>
              <Label>CNPJ</Label>
              <Input
                value={formData.cnpj}
                onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                placeholder="00.000.000/0000-00"
              />
            </div>
            
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="contato@empresa.com"
              />
            </div>
            
            <div>
              <Label>Telefone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="(11) 99999-9999"
              />
            </div>
            
            <div>
              <Label>Pessoa de Contato</Label>
              <Input
                value={formData.contact_person}
                onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
                placeholder="Nome do contato"
              />
            </div>
            
            <div>
              <Label>Endereço</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Rua, número, complemento"
              />
            </div>
            
            <div>
              <Label>Cidade</Label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                placeholder="Cidade"
              />
            </div>
            
            <div>
              <Label>Estado</Label>
              <Input
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
                placeholder="SP"
                maxLength={2}
              />
            </div>
            
            <div>
              <Label>CEP</Label>
              <Input
                value={formData.zip_code}
                onChange={(e) => setFormData({...formData, zip_code: e.target.value})}
                placeholder="00000-000"
              />
            </div>
            
            <div className="col-span-2">
              <Label>Observações</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Observações adicionais..."
                rows={3}
              />
            </div>
            
            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativa</SelectItem>
                  <SelectItem value="inactive">Inativa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateCompany}>
              Criar Empresa
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Empresa</DialogTitle>
            <DialogDescription>
              Edite as informações da empresa.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Nome da Empresa *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div>
              <Label>CNPJ</Label>
              <Input
                value={formData.cnpj}
                onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
              />
            </div>
            
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            <div>
              <Label>Telefone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            
            <div>
              <Label>Pessoa de Contato</Label>
              <Input
                value={formData.contact_person}
                onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
              />
            </div>
            
            <div>
              <Label>Endereço</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
            
            <div>
              <Label>Cidade</Label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
            </div>
            
            <div>
              <Label>Estado</Label>
              <Input
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
                maxLength={2}
              />
            </div>
            
            <div>
              <Label>CEP</Label>
              <Input
                value={formData.zip_code}
                onChange={(e) => setFormData({...formData, zip_code: e.target.value})}
              />
            </div>
            
            <div className="col-span-2">
              <Label>Observações</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={3}
              />
            </div>
            
            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativa</SelectItem>
                  <SelectItem value="inactive">Inativa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateCompany}>
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Empresa</DialogTitle>
            <DialogDescription>
              Visualize todas as informações e boletos da empresa.
            </DialogDescription>
          </DialogHeader>
          
          {selectedCompany && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Nome da Empresa</Label>
                  <p className="text-gray-900">{selectedCompany.name}</p>
                </div>
                <div>
                  <Label className="font-semibold">Status</Label>
                  <Badge className={getStatusColor(selectedCompany.status)}>
                    {selectedCompany.status === 'active' ? 'Ativa' : 'Inativa'}
                  </Badge>
                </div>
                {selectedCompany.cnpj && (
                  <div>
                    <Label className="font-semibold">CNPJ</Label>
                    <p className="text-gray-900">{selectedCompany.cnpj}</p>
                  </div>
                )}
                {selectedCompany.email && (
                  <div>
                    <Label className="font-semibold">Email</Label>
                    <p className="text-gray-900">{selectedCompany.email}</p>
                  </div>
                )}
                {selectedCompany.phone && (
                  <div>
                    <Label className="font-semibold">Telefone</Label>
                    <p className="text-gray-900">{selectedCompany.phone}</p>
                  </div>
                )}
                {selectedCompany.contact_person && (
                  <div>
                    <Label className="font-semibold">Pessoa de Contato</Label>
                    <p className="text-gray-900">{selectedCompany.contact_person}</p>
                  </div>
                )}
                {selectedCompany.address && (
                  <div className="col-span-2">
                    <Label className="font-semibold">Endereço</Label>
                    <p className="text-gray-900">
                      {selectedCompany.address}
                      {selectedCompany.city && `, ${selectedCompany.city}`}
                      {selectedCompany.state && ` - ${selectedCompany.state}`}
                      {selectedCompany.zip_code && `, ${selectedCompany.zip_code}`}
                    </p>
                  </div>
                )}
                {selectedCompany.notes && (
                  <div className="col-span-2">
                    <Label className="font-semibold">Observações</Label>
                    <p className="text-gray-900">{selectedCompany.notes}</p>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="font-semibold text-lg mb-4">Boletos da Empresa</h4>
                {companyBills.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum boleto encontrado</h3>
                    <p className="text-gray-600">Esta empresa ainda não possui boletos cadastrados.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {companyBills.map((bill) => (
                      <div key={bill.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div>
                            <span className="font-medium">{bill.description}</span>
                            <p className="text-sm text-gray-600">
                              {new Date(bill.created_at).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div>
                            <span className="font-semibold">{formatCurrency(bill.total_amount)}</span>
                          </div>
                          <Badge className={bill.type === 'receivable' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}>
                            {bill.type === 'receivable' ? 'A Receber' : 'A Pagar'}
                          </Badge>
                          <Badge className={getStatusColor(bill.status)}>
                            {bill.status === 'pending' ? 'Pendente' : 
                             bill.status === 'paid' ? 'Pago' : 
                             bill.status === 'overdue' ? 'Vencido' : 'Cancelado'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CompaniesManager 