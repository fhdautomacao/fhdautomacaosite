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
  MoreVertical,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import AdminModal from '@/components/admin/AdminModal'
import { ModalActionButton, ModalSection, ModalGrid } from '@/components/admin/AdminModal'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useServiceCategories } from '@/hooks/useCategories'

const ServicesManager = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Estados para validação
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { categories, loading: categoriesLoading, error: categoriesError } = useServiceCategories()

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

  // Função para validar formulário
  const validateForm = () => {
    const newErrors = {}

    // Validação de nome
    if (!newService.name.trim()) {
      newErrors.name = 'Nome do serviço é obrigatório'
    }

    // Validação de descrição
    if (!newService.description.trim()) {
      newErrors.description = 'Descrição é obrigatória'
    }

    // Validação de categoria
    if (!newService.category) {
      newErrors.category = 'Categoria é obrigatória'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

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
    try {
      setIsSubmitting(true)
      setErrors({})

      // Validar formulário
      if (!validateForm()) {
        setIsSubmitting(false)
        return
      }

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
      setNewFeature('')
      setErrors({})
      setIsAddModalOpen(false)
      
    } catch (error) {
      console.error("Erro ao adicionar serviço:", error)
      setErrors({ submit: "Erro ao adicionar serviço. Verifique os dados e tente novamente." })
    } finally {
      setIsSubmitting(false)
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

  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.color : 'bg-gray-100 text-gray-800'
  }

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.icon : '⚙️'
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
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Serviço
          </Button>
          <AdminModal
            open={isAddModalOpen}
            onOpenChange={(open) => {
              setIsAddModalOpen(open)
              if (!open) {
                setErrors({})
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
                setNewFeature('')
              }
            }}
            title="Adicionar Novo Serviço"
            description="Preencha os dados do novo serviço"
            type="create"
            size="2xl"
          >
            <div className="space-y-6">
              {/* Mensagem de erro geral */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm">{errors.submit}</p>
                </div>
              )}
              <ModalSection title="Informações Básicas">
                <ModalGrid cols={2}>
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nome do Serviço *</Label>
                    <Input
                      id="name"
                      value={newService.name}
                      onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                      placeholder="Nome do serviço"
                      className={`mt-1 ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="icon" className="text-sm font-medium text-gray-700">Ícone (Emoji)</Label>
                    <Input
                      id="icon"
                      value={newService.icon}
                      onChange={(e) => setNewService({ ...newService, icon: e.target.value })}
                      placeholder="🔧"
                      className="mt-1"
                    />
                  </div>
                </ModalGrid>
                
                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">Descrição *</Label>
                  <Textarea
                    id="description"
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    placeholder="Descrição detalhada do serviço"
                    rows={4}
                    className={`mt-1 ${errors.description ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>
              </ModalSection>

              <ModalSection title="Categoria e Preço">
                <ModalGrid cols={2}>
                  <div>
                    <Label htmlFor="category" className="text-sm font-medium text-gray-700">Categoria *</Label>
                    <Select value={newService.category} onValueChange={(value) => setNewService({ ...newService, category: value })} disabled={categoriesLoading}>
                      <SelectTrigger className={`mt-1 ${errors.category ? 'border-red-500 focus:border-red-500' : ''}`}>
                        <SelectValue placeholder={categoriesLoading ? "Carregando categorias..." : "Selecione uma categoria"} />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesError && <SelectItem value="" disabled>Erro ao carregar categorias</SelectItem>}
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.icon} {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                  </div>
                  <div>
                    <Label htmlFor="price" className="text-sm font-medium text-gray-700">Preço</Label>
                    <Input
                      id="price"
                      value={newService.price}
                      onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                      placeholder="Ex: R$ 1.500,00 ou Sob Consulta"
                      className="mt-1"
                    />
                  </div>
                </ModalGrid>
              </ModalSection>

              <ModalSection title="Características do Serviço">
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Digite uma característica"
                      onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                      className="flex-1"
                    />
                    <Button type="button" onClick={() => addFeature()} size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newService.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1 bg-blue-100 text-blue-800">
                        <span>{feature}</span>
                        <button
                          onClick={() => removeFeature(index)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </ModalSection>

              <ModalSection title="Configurações">
                <div>
                  <Label htmlFor="image_url" className="text-sm font-medium text-gray-700">URL da Imagem</Label>
                  <Input
                    id="image_url"
                    value={newService.image_url || ''}
                    onChange={(e) => setNewService({ ...newService, image_url: e.target.value })}
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <Switch
                    id="isActive"
                    checked={newService.isActive}
                    onCheckedChange={(checked) => setNewService({ ...newService, isActive: checked })}
                  />
                  <Label htmlFor="isActive" className="text-sm font-medium text-gray-700">Serviço Ativo</Label>
                </div>
              </ModalSection>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <ModalActionButton
                  onClick={() => setIsAddModalOpen(false)}
                  variant="outline"
                >
                  Cancelar
                </ModalActionButton>
                <ModalActionButton
                  onClick={handleAddService}
                  disabled={categoriesLoading || isSubmitting}
                  variant="success"
                  icon={isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar Serviço'}
                </ModalActionButton>
              </div>
            </div>
          </AdminModal>
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
              <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={categoriesLoading}>
                <SelectTrigger>
                  <SelectValue placeholder={categoriesLoading ? "Carregando..." : "Todas as categorias"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categoriesError && <SelectItem value="" disabled>Erro ao carregar categorias</SelectItem>}
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
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
                            {getCategoryIcon(service.category)} {categories.find(cat => cat.id === service.category)?.name || service.category}
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
      <AdminModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Editar Serviço"
        description="Modifique os dados do serviço"
        type="edit"
        size="xl"
      >
        {selectedService && (
          <div className="space-y-6">
            <ModalSection title="Informações Básicas">
              <ModalGrid cols={2}>
                <div>
                  <Label htmlFor="edit-name" className="text-sm font-medium text-gray-700">Nome do Serviço *</Label>
                  <Input
                    id="edit-name"
                    value={selectedService.name}
                    onChange={(e) => setSelectedService({ ...selectedService, name: e.target.value })}
                    placeholder="Nome do serviço"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-icon" className="text-sm font-medium text-gray-700">Ícone (Emoji)</Label>
                  <Input
                    id="edit-icon"
                    value={selectedService.icon}
                    onChange={(e) => setSelectedService({ ...selectedService, icon: e.target.value })}
                    placeholder="🔧"
                    className="mt-1"
                  />
                </div>
              </ModalGrid>
              
              <div>
                <Label htmlFor="edit-description" className="text-sm font-medium text-gray-700">Descrição *</Label>
                <Textarea
                  id="edit-description"
                  value={selectedService.description}
                  onChange={(e) => setSelectedService({ ...selectedService, description: e.target.value })}
                  placeholder="Descrição detalhada do serviço"
                  rows={4}
                  className="mt-1"
                />
              </div>
            </ModalSection>

            <ModalSection title="Categoria e Preço">
              <ModalGrid cols={2}>
                <div>
                  <Label htmlFor="edit-category" className="text-sm font-medium text-gray-700">Categoria *</Label>
                  <Select value={selectedService.category} onValueChange={(value) => setSelectedService({ ...selectedService, category: value })}>
                    <SelectTrigger className="mt-1">
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
                  <Label htmlFor="edit-price" className="text-sm font-medium text-gray-700">Preço</Label>
                  <Input
                    id="edit-price"
                    value={selectedService.price}
                    onChange={(e) => setSelectedService({ ...selectedService, price: e.target.value })}
                    placeholder="Ex: R$ 1.500,00 ou Sob Consulta"
                    className="mt-1"
                  />
                </div>
              </ModalGrid>
            </ModalSection>

            <ModalSection title="Características do Serviço">
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Digite uma característica"
                    onKeyPress={(e) => e.key === 'Enter' && addFeature(true)}
                    className="flex-1"
                  />
                  <Button type="button" onClick={() => addFeature(true)} size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(selectedService.features || []).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center space-x-1 bg-blue-100 text-blue-800">
                      <span>{feature}</span>
                      <button
                        onClick={() => removeFeature(index, true)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </ModalSection>

            <ModalSection title="Configurações">
              <div>
                <Label htmlFor="edit-image_url" className="text-sm font-medium text-gray-700">URL da Imagem</Label>
                <Input
                  id="edit-image_url"
                  value={selectedService.image_url || ''}
                  onChange={(e) => setSelectedService({ ...selectedService, image_url: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="mt-1"
                />
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <Switch
                  id="edit-isActive"
                  checked={selectedService.is_active}
                  onCheckedChange={(checked) => setSelectedService({ ...selectedService, is_active: checked })}
                />
                <Label htmlFor="edit-isActive" className="text-sm font-medium text-gray-700">Serviço Ativo</Label>
              </div>
            </ModalSection>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <ModalActionButton
                onClick={() => setIsEditModalOpen(false)}
                variant="outline"
              >
                Cancelar
              </ModalActionButton>
              <ModalActionButton
                onClick={handleEditService}
                disabled={loading}
                variant="primary"
                icon={<Save className="h-4 w-4" />}
              >
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </ModalActionButton>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  )
}

export default ServicesManager

