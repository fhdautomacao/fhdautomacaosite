import { useState } from 'react'
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
  MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const ClientsManager = () => {
  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'Empresa Industrial A',
      sector: 'Industrial',
      description: 'Empresa líder no setor industrial com foco em automação',
      contact: 'contato@empresaa.com.br',
      phone: '(19) 99999-9999',
      location: 'São Paulo - SP',
      logo: '/clients/empresa-a.png',
      addedDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Metalúrgica B',
      sector: 'Metalurgia',
      description: 'Especializada em processos metalúrgicos avançados',
      contact: 'comercial@metalurgicab.com.br',
      phone: '(11) 88888-8888',
      location: 'Campinas - SP',
      logo: '/clients/metalurgica-b.png',
      addedDate: '2024-01-10'
    },
    {
      id: 3,
      name: 'Automobilística C',
      sector: 'Automotivo',
      description: 'Montadora de veículos com tecnologia de ponta',
      contact: 'suporte@autoc.com.br',
      phone: '(19) 77777-7777',
      location: 'Sumaré - SP',
      logo: '/clients/auto-c.png',
      addedDate: '2024-01-08'
    }
  ])

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
    sector: '',
    description: '',
    contact: '',
    phone: '',
    location: '',
    logo: null
  })

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSector = selectedSector === 'all' || client.sector === selectedSector
    return matchesSearch && matchesSector
  })

  const handleAddClient = () => {
    if (newClient.name && newClient.sector && newClient.description) {
      const client = {
        id: Date.now(),
        ...newClient,
        addedDate: new Date().toISOString().split('T')[0],
        logo: newClient.logo || '/clients/placeholder.png'
      }
      setClients([...clients, client])
      setNewClient({ name: '', sector: '', description: '', contact: '', phone: '', location: '', logo: null })
      setIsAddModalOpen(false)
    }
  }

  const handleEditClient = () => {
    if (selectedClient) {
      setClients(clients.map(client => 
        client.id === selectedClient.id ? selectedClient : client
      ))
      setIsEditModalOpen(false)
      setSelectedClient(null)
    }
  }

  const handleDeleteClient = (id) => {
    setClients(clients.filter(client => client.id !== id))
  }

  const openEditModal = (client) => {
    setSelectedClient({ ...client })
    setIsEditModalOpen(true)
  }

  const getSectorIcon = (sector) => {
    const icons = {
      'Industrial': '🏭',
      'Metalurgia': '⚙️',
      'Automotivo': '🚗',
      'Petroquímica': '🛢️',
      'Alimentício': '🍽️',
      'Farmacêutico': '💊',
      'Têxtil': '🧵',
      'Papel': '📄',
      'Mineração': '⛏️',
      'Siderurgia': '🔩',
      'Química': '🧪',
      'Energia': '⚡'
    }
    return icons[sector] || '🏢'
  }

  return (
    <div className="space-y-6">
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
                <Label htmlFor="sector">Setor</Label>
                <Select value={newClient.sector} onValueChange={(value) => setNewClient({ ...newClient, sector: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um setor" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map(sector => (
                      <SelectItem key={sector} value={sector}>
                        {getSectorIcon(sector)} {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newClient.description}
                  onChange={(e) => setNewClient({ ...newClient, description: e.target.value })}
                  placeholder="Descrição da empresa"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="contact">E-mail de Contato</Label>
                <Input
                  id="contact"
                  type="email"
                  value={newClient.contact}
                  onChange={(e) => setNewClient({ ...newClient, contact: e.target.value })}
                  placeholder="contato@empresa.com.br"
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  placeholder="(19) 99999-9999"
                />
              </div>
              <div>
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={newClient.location}
                  onChange={(e) => setNewClient({ ...newClient, location: e.target.value })}
                  placeholder="Cidade - Estado"
                />
              </div>
              <div>
                <Label htmlFor="logo">Logo da Empresa</Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewClient({ ...newClient, logo: e.target.files[0] })}
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
                  placeholder="Buscar por nome ou descrição..."
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
                      {getSectorIcon(sector)} {sector}
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
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">
                      {getSectorIcon(client.sector)}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{client.name}</CardTitle>
                      <CardDescription>{client.sector}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600 line-clamp-2">{client.description}</p>
                  
                  <div className="space-y-2 text-sm text-gray-500">
                    {client.contact && (
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{client.contact}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                    {client.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{client.location}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-400">Adicionado em: {client.addedDate}</p>
                  
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
                <Label htmlFor="edit-sector">Setor</Label>
                <Select 
                  value={selectedClient.sector} 
                  onValueChange={(value) => setSelectedClient({ ...selectedClient, sector: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map(sector => (
                      <SelectItem key={sector} value={sector}>
                        {getSectorIcon(sector)} {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-description">Descrição</Label>
                <Textarea
                  id="edit-description"
                  value={selectedClient.description}
                  onChange={(e) => setSelectedClient({ ...selectedClient, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="edit-contact">E-mail de Contato</Label>
                <Input
                  id="edit-contact"
                  type="email"
                  value={selectedClient.contact}
                  onChange={(e) => setSelectedClient({ ...selectedClient, contact: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Telefone</Label>
                <Input
                  id="edit-phone"
                  value={selectedClient.phone}
                  onChange={(e) => setSelectedClient({ ...selectedClient, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-location">Localização</Label>
                <Input
                  id="edit-location"
                  value={selectedClient.location}
                  onChange={(e) => setSelectedClient({ ...selectedClient, location: e.target.value })}
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
    </div>
  )
}

export default ClientsManager

