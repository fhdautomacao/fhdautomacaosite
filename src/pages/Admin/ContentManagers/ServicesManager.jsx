import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wrench,
  Plus,
  Edit,
  Trash2,
  Save,
  Search,
  Filter,
  Eye,
  Settings,
  Upload,
  MoreVertical
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { categoriesAPI } from '@/api/categories'

const ServicesManager = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const [categories, setCategories] = useState([])

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoriesAPI.getByType("service")
        setCategories(data)
      } catch (err) {
        console.error("Erro ao carregar categorias de serviços:", err)
      }
    }
    loadCategories()
  }, [])

  const [newService, setNewService] = useState({
    name: '',
    description: '',
    icon: '🔧',
    category: '',
    price: '',
    features: [],
    isActive: true,
    image_url: null
  })

  const [newFeature, setNewFeature] = useState('')

  // Função para buscar serviços do banco de dados
  const fetchServices = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("display_order", { ascending: true })

      if (error) throw error

      setServices(data || [])
    } catch (error) {
      console.error("Erro ao carregar serviços:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory
    return matchesSearch && matchesCategory
  }).sort((a, b) => (a.display_order || 0) - (b.display_order || 0))

  // Função para adicionar novo serviço
  const handleAddService = async () => {
    if (newService.name && newService.description && newService.category) {
      try {
        setLoading(true)
        
        // Calcular próximo display_order
        const maxOrder = services.length > 0 ? Math.max(...services.map(s => s.display_order || 0)) : 0
        
        const serviceData = {
          name: newService.name,
          description: newService.description,
          icon: newService.icon,
          category: newService.category,
          price: newService.price,
          features: newService.features,
          image_url: newService.image_url,
          is_active: newService.isActive,
          display_order: maxOrder + 1
        }

        const { data, error } = await supabase
          .from('services')
          .insert([serviceData])
          .select()

        if (error) throw error

        // Atualizar lista local
        await fetchServices()
        
        // Resetar formulário
        setNewService({ 
          name: '', 
          description: '', 
          icon: '🔧', 
          category: '', 
          price: '', 
          features: [], 
          isActive: true, 
          image_url: null 
        })
        setIsAddModalOpen(false)
        
      } catch (error) {
        console.error("Erro ao adicionar serviço:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
  }

  // Função para editar serviço
  const handleEditService = async () => {
    if (selectedService) {
      try {
        setLoading(true)
        
        const serviceData = {
          name: selectedService.name,
          description: selectedService.description,
          icon: selectedService.icon,
          category: selectedService.category,
          price: selectedService.price,
          features: selectedService.features,
          image_url: selectedService.image_url,
          is_active: selectedService.is_active,
          display_order: selectedService.display_order,
          updated_at: new Date().toISOString()
        }

        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', selectedService.id)

        if (error) throw error

        // Atualizar lista local
        await fetchServices()
        
        setIsEditModalOpen(false)
        setSelectedService(null)
        
      } catch (error) {
        console.error("Erro ao editar serviço:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
  }

  // Função para deletar serviço
  const handleDeleteService = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      try {
        setLoading(true)
        
        const { error } = await supabase
          .from('services')
          .delete()
          .eq('id', id)

        if (error) throw error

        // Atualizar lista local
        await fetchServices()
        
      } catch (error) {
        console.error("Erro ao deletar serviço:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
  }

  const openEditModal = (service) => {
    setSelectedService({ ...service })
    setIsEditModalOpen(true)
  }

  // Função para alternar status do serviço
  const toggleServiceStatus = async (id) => {
    try {
      const service = services.find(s => s.id === id)
      if (!service) return

      const { error } = await supabase
        .from('services')
        .update({ 
          is_active: !service.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error

      // Atualizar lista local
      await fetchServices()
      
    } catch (error) {
      console.error("Erro ao alterar status do serviço:", error)
      setError(error.message)
    }
  }

  const addFeature = (isEdit = false) => {
    if (newFeature.trim()) {
      if (isEdit && selectedService) {
        setSelectedService({
          ...selectedService,
          features: [...(selectedService.features || []), newFeature.trim()]
        })
      } else {
        setNewService({
          ...newService,
          features: [...newService.features, newFeature.trim()]
        })
      }
      setNewFeature('')
    }
  }

  const removeFeature = (index, isEdit = false) => {
    if (isEdit && selectedService) {
      setSelectedService({
        ...selectedService,
        features: (selectedService.features || []).filter((_, i) => i !== index)
      })
    } else {
      setNewService({
        ...newService,
        features: newService.features.filter((_, i) => i !== index)
      })
    }
  }

  const getCategoryColor = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName)
    return category ? category.color : 'bg-gray-100 text-gray-800'
  }

  if (loading && services.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando serviços...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">Erro ao carregar serviços: {error}</p>
          <Button onClick={fetchServices} className="mt-2">
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Serviços</h1>
          <p className="text-gray-600">Adicione, edite ou remova serviços oferecidos pela empresa</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Serviço
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Serviço</DialogTitle>
                <DialogDescription>
                  Preencha os dados do novo serviço
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome do Serviço</Label>
                    <Input
                      id="name"
                      value={newService.name}
                      onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                      placeholder="Nome do serviço"
                    />
                  </div>
                  <div>
                    <Label htmlFor="icon">Ícone (Emoji)</Label>
                    <Input
                      id="icon"
                      value={newService.icon}
                      onChange={(e) => setNewService({ ...newService, icon: e.target.value })}
                      placeholder="🔧"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    placeholder="Descrição detalhada do serviço"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select value={newService.category} onValueChange={(value) => setNewService({ ...newService, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.name} value={category.name}>
                            {category.icon} {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="price">Preço</Label>
                    <Input
                      id="price"
                      value={newService.price}
                      onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                      placeholder="Ex: R$ 1.500,00 ou Sob Consulta"
                    />
                  </div>
                </div>
                <div>
                  <Label>Características do Serviço</Label>
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="Digite uma característica"
                        onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                      />
                      <Button type="button" onClick={() => addFeature()} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {newService.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                          <span>{feature}</span>
                          <button
                            onClick={() => removeFeature(index)}
                            className="ml-1 text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="image_url">URL da Imagem</Label>
                  <Input
                    id="image_url"
                    value={newService.image_url || ''}
                    onChange={(e) => setNewService({ ...newService, image_url: e.target.value })}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={newService.isActive}
                    onCheckedChange={(checked) => setNewService({ ...newService, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Serviço Ativo</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddService} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Salvando...' : 'Salvar'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
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
              <Label htmlFor="category-filter">Categoria</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map(category => (
                  <SelectItem key={category.name} value={category.name}>
                    {category.icon} {category.name}
                  </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredServices.map((service) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card className={`overflow-hidden ${!service.is_active ? 'opacity-60' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{service.icon}</div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getCategoryColor(service.category)}>
                            {service.category}
                          </Badge>
                          {!service.is_active && (
                            <Badge variant="secondary">Inativo</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-3">{service.description}</p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-1">
                    {(service.features || []).slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {(service.features || []).length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{(service.features || []).length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{service.price}</span>
                    <div className="flex items-center space-x-1">
                      <Switch
                        checked={service.is_active}
                        onCheckedChange={() => toggleServiceStatus(service.id)}
                        size="sm"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(service)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteService(service.id)}
                      className="text-red-600 hover:text-red-700"
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

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Serviço</DialogTitle>
            <DialogDescription>
              Modifique os dados do serviço
            </DialogDescription>
          </DialogHeader>
          {selectedService && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Nome do Serviço</Label>
                  <Input
                    id="edit-name"
                    value={selectedService.name}
                    onChange={(e) => setSelectedService({ ...selectedService, name: e.target.value })}
                    placeholder="Nome do serviço"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-icon">Ícone (Emoji)</Label>
                  <Input
                    id="edit-icon"
                    value={selectedService.icon}
                    onChange={(e) => setSelectedService({ ...selectedService, icon: e.target.value })}
                    placeholder="🔧"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description">Descrição</Label>
                <Textarea
                  id="edit-description"
                  value={selectedService.description}
                  onChange={(e) => setSelectedService({ ...selectedService, description: e.target.value })}
                  placeholder="Descrição detalhada do serviço"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-category">Categoria</Label>
                  <Select value={selectedService.category} onValueChange={(value) => setSelectedService({ ...selectedService, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.name} value={category.name}>
                            {category.icon} {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-price">Preço</Label>
                  <Input
                    id="edit-price"
                    value={selectedService.price}
                    onChange={(e) => setSelectedService({ ...selectedService, price: e.target.value })}
                    placeholder="Ex: R$ 1.500,00 ou Sob Consulta"
                  />
                </div>
              </div>
              <div>
                <Label>Características do Serviço</Label>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Digite uma característica"
                      onKeyPress={(e) => e.key === 'Enter' && addFeature(true)}
                    />
                    <Button type="button" onClick={() => addFeature(true)} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(selectedService.features || []).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <span>{feature}</span>
                        <button
                          onClick={() => removeFeature(index, true)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-image_url">URL da Imagem</Label>
                <Input
                  id="edit-image_url"
                  value={selectedService.image_url || ''}
                  onChange={(e) => setSelectedService({ ...selectedService, image_url: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isActive"
                  checked={selectedService.is_active}
                  onCheckedChange={(checked) => setSelectedService({ ...selectedService, is_active: checked })}
                />
                <Label htmlFor="edit-isActive">Serviço Ativo</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleEditService} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ServicesManager

