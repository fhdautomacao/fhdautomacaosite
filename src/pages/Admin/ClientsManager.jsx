import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  Edit, 
  Trash2, 
  Plus, 
  Save,
  Search,
  Building,
  Mail,
  Phone,
  MapPin,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { clientsAPI } from '@/api/clients'

const ClientsManager = () => {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      setLoading(true)
      const data = await clientsAPI.getAll()
      setClients(data)
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
      setError('Erro ao carregar clientes')
    } finally {
      setLoading(false)
    }
  }
  }

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSector, setSelectedSector] = useState('all')

  const sectors = [
    'Industrial',
    'Metalurgia',
    'Automotivo',
    'Petroquímica',
    'Alimentício',
    'Farmacêutico',
    'Têxtil',
    'Papel',
    'Mineração',
    'Siderurgia',
    'Química',
    'Energia'
  ]

  const [newClient, setNewClient] = useState({
    name: '',
    industry: '',
    logo_url: ''
  })

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSector = selectedSector === 'all' || client.industry === selectedSector
    return matchesSearch && matchesSector
  })

  const handleAddClient = async () => {
    if (newClient.name && newClient.industry) {
      try {
        const clientData = {
          name: newClient.name,
          industry: newClient.industry,
          logo_url: newClient.logo_url || null,
          is_active: true,
          display_order: clients.length
        }
        
        await clientsAPI.create(clientData)
        await loadClients() // Recarregar lista
        setNewClient({ name: '', industry: '', logo_url: '' })
        setIsAddModalOpen(false)
      } catch (error) {
        console.error('Erro ao adicionar cliente:', error)
        setError('Erro ao adicionar cliente')
      }
    }
  }

  const handleEditClient = async () => {
    if (selectedClient) {
      try {
        const updates = {
          name: selectedClient.name,
          industry: selectedClient.industry,
          logo_url: selectedClient.logo_url
        }
        
        await clientsAPI.update(selectedClient.id, updates)
        await loadClients() // Recarregar lista
        setIsEditModalOpen(false)
        setSelectedClient(null)
      } catch (error) {
        console.error('Erro ao editar cliente:', error)
        setError('Erro ao editar cliente')
      }
    }
  }

  const handleDeleteClient = async (id) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await clientsAPI.delete(id)
        await loadClients() // Recarregar lista
      } catch (error) {
        console.error('Erro ao excluir cliente:', error)
        setError('Erro ao excluir cliente')
      }
    }
  }

  const openEditModal = (client) => {
    setSelectedClient({ ...client })
    setIsEditModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando clientes...</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadClients}
              className="mt-2"
            >
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      )}

      {!loading && !error && (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Gerenciar Clientes</h2>
              <p className="text-gray-600">Adicione, edite ou remova clientes da seção de clientes</p>
            </div>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Cliente</DialogTitle>
                  <DialogDescription>
                    Preencha os dados do novo cliente
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome da Empresa</Label>
                    <Input
                      id="name"
                      value={newClient.name}
                      onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                      placeholder="Nome da empresa"
                    />
                  </div>
                  <div>
                    <Label htmlFor="industry">Setor</Label>
                    <Select value={newClient.industry} onValueChange={(value) => setNewClient({ ...newClient, industry: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um setor" />
                      </SelectTrigger>
                      <SelectContent>
                        {sectors.map(sector => (
                          <SelectItem key={sector} value={sector}>
                            {sector}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="logo_url">URL do Logo</Label>
                    <Input
                      id="logo_url"
                      value={newClient.logo_url}
                      onChange={(e) => setNewClient({ ...newClient, logo_url: e.target.value })}
                      placeholder="https://exemplo.com/logo.png"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddClient}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
                      placeholder="Buscar por nome..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <Label htmlFor="sector-filter">Setor</Label>
                  <Select value={selectedSector} onValueChange={setSelectedSector}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os setores</SelectItem>
                      {sectors.map(sector => (
                        <SelectItem key={sector} value={sector}>
                          {sector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredClients.map((client) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          {client.logo_url ? (
                            <img src={client.logo_url} alt={client.name} className="w-full h-full object-contain rounded-lg" />
                          ) : (
                            <Building className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{client.name}</CardTitle>
                          <CardDescription>{client.industry}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-xs text-gray-400">
                        Adicionado em: {new Date(client.created_at).toLocaleDateString('pt-BR')}
                      </p>
                      
                      <div className="flex justify-between pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(client)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClient(client.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Excluir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredClients.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum cliente encontrado
                </h3>
                <p className="text-gray-600">
                  {searchTerm || selectedSector !== 'all' 
                    ? 'Tente ajustar os filtros de busca'
                    : 'Adicione o primeiro cliente'
                  }
                </p>
              </CardContent>
            </Card>
          )}

          {/* Edit Modal */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Editar Cliente</DialogTitle>
                <DialogDescription>
                  Atualize as informações do cliente
                </DialogDescription>
              </DialogHeader>
              {selectedClient && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-name">Nome da Empresa</Label>
                    <Input
                      id="edit-name"
                      value={selectedClient.name}
                      onChange={(e) => setSelectedClient({ ...selectedClient, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-industry">Setor</Label>
                    <Select 
                      value={selectedClient.industry} 
                      onValueChange={(value) => setSelectedClient({ ...selectedClient, industry: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sectors.map(sector => (
                          <SelectItem key={sector} value={sector}>
                            {sector}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-logo_url">URL do Logo</Label>
                    <Input
                      id="edit-logo_url"
                      value={selectedClient.logo_url || ''}
                      onChange={(e) => setSelectedClient({ ...selectedClient, logo_url: e.target.value })}
                      placeholder="https://exemplo.com/logo.png"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleEditClient}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Alterações
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )

export default ClientsManager

