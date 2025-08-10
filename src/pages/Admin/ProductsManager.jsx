import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package,
  Edit,
  Trash2,
  Plus,
  Save,
  Search,
  DollarSign,
  Tag,
  Info,
  Loader2,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import AdminModal from '@/components/admin/AdminModal'
import { ModalActionButton, ModalSection, ModalGrid } from '@/components/admin/AdminModal'
import { Badge } from '@/components/ui/badge'
import { useProductCategories } from '@/hooks/useCategories'
import { useJWTAuth } from '@/contexts/JWTAuthContext'
import { supabase } from '@/lib/supabase'

const ProductsManager = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Estados para validação
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { categories, loading: categoriesLoading, error: categoriesError } = useProductCategories()
  const { isAuthenticated } = useJWTAuth()

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    description: "",
    features: [],
    price: "",
    image: null
  })

  const [newFeature, setNewFeature] = useState("")

  // Função para validar formulário
  const validateForm = () => {
    const newErrors = {}

    // Validação de nome
    if (!newProduct.name.trim()) {
      newErrors.name = 'Nome do produto é obrigatório'
    }

    // Validação de categoria
    if (!newProduct.category) {
      newErrors.category = 'Categoria é obrigatória'
    }

    // Validação de descrição
    if (!newProduct.description.trim()) {
      newErrors.description = 'Descrição é obrigatória'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Carregar produtos do Supabase
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      
      console.log('🔍 Verificando autenticação JWT:', isAuthenticated)
      
      // Verificar se está autenticado
      if (!isAuthenticated) {
        throw new Error('Usuário não autenticado no sistema')
      }
      
      // Verificar autenticação Supabase
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      console.log('🔍 Status Supabase Auth:', { user: !!user, error: authError })
      
      if (authError) {
        console.error('❌ Erro na verificação Supabase Auth:', authError)
      }
      
      if (!user) {
        console.log('⚠️ Usuário não autenticado no Supabase, tentando renovar sessão...')
        
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
        
        if (refreshError || !refreshData.session) {
          throw new Error('Sessão Supabase expirada. Faça login novamente.')
        }
        
        console.log('✅ Sessão Supabase renovada')
      }
      
      // Tentar carregar produtos diretamente
      console.log('📊 Carregando produtos...')
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('display_order', { ascending: true })
      
      if (error) {
        console.error('❌ Erro na consulta:', error)
        
        // Se for erro de autenticação, tentar renovar sessão
        if (error.message?.includes('row-level security') || error.message?.includes('authentication')) {
          console.log('🔄 Tentando renovar sessão Supabase...')
          
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
          
          if (refreshError || !refreshData.session) {
            throw new Error('Sessão expirada. Faça login novamente.')
          }
          
          // Tentar novamente após renovar sessão
          const { data: retryData, error: retryError } = await supabase
            .from('products')
            .select('*')
            .order('display_order', { ascending: true })
          
          if (retryError) throw retryError
          setProducts(retryData)
          return
        }
        
        throw error
      }
      
      console.log('✅ Produtos carregados com sucesso:', data?.length || 0)
      setProducts(data)
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
      setError(error.message || "Erro ao carregar produtos")
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddProduct = async () => {
    try {
      setIsSubmitting(true)
      setErrors({})

      // Validar formulário
      if (!validateForm()) {
        setIsSubmitting(false)
        return
      }

      // Verificar se está autenticado
      if (!isAuthenticated) {
        throw new Error('Usuário não autenticado no sistema')
      }

      let imageUrl = "/products/placeholder.jpg"
      if (newProduct.image) {
        const fileExt = newProduct.image.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `products/${fileName}`

        const { data, error } = await supabase.storage
          .from('images')
          .upload(filePath, newProduct.image)

        if (error) throw error

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath)

        imageUrl = publicUrl
      }

      const productData = {
        name: newProduct.name,
        category: newProduct.category,
        description: newProduct.description,
        features: newProduct.features,
        price: newProduct.price || "Sob Consulta",
        image_url: imageUrl,
        is_active: true,
        display_order: products.length
      }
      
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single()
      
      if (error) {
        console.error('❌ Erro ao inserir produto:', error)
        
        // Se for erro de autenticação, tentar renovar sessão
        if (error.message?.includes('row-level security') || error.message?.includes('authentication')) {
          console.log('🔄 Tentando renovar sessão Supabase...')
          
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
          
          if (refreshError || !refreshData.session) {
            throw new Error('Sessão expirada. Faça login novamente.')
          }
          
          // Tentar novamente após renovar sessão
          const { data: retryData, error: retryError } = await supabase
            .from('products')
            .insert([productData])
            .select()
            .single()
          
          if (retryError) throw retryError
        } else {
          throw error
        }
      }
      
      await loadProducts() // Recarregar lista
      setNewProduct({ name: "", category: "", description: "", features: [], price: "", image: null })
      setNewFeature("")
      setErrors({})
      setIsAddModalOpen(false)
    } catch (error) {
      console.error("Erro ao adicionar produto:", error)
      setErrors({ submit: error.message || "Erro ao adicionar produto. Verifique os dados e tente novamente." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditProduct = async () => {
    if (selectedProduct) {
      try {
              // Verificar se está autenticado
      if (!isAuthenticated) {
        throw new Error('Usuário não autenticado no sistema')
      }

      let imageUrl = selectedProduct.image_url
      if (selectedProduct.image && typeof selectedProduct.image !== 'string') { // Verifica se é um novo arquivo
        const fileExt = selectedProduct.image.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `products/${fileName}`

        const { data, error } = await supabase.storage
          .from('images')
          .upload(filePath, selectedProduct.image)

        if (error) throw error

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath)

        imageUrl = publicUrl
      }

      const updates = {
        name: selectedProduct.name,
        category: selectedProduct.category,
        description: selectedProduct.description,
        features: selectedProduct.features,
        price: selectedProduct.price,
        image_url: imageUrl
      }
      
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', selectedProduct.id)
        .select()
        .single()
      
      if (error) {
        console.error('❌ Erro ao atualizar produto:', error)
        
        // Se for erro de autenticação, tentar renovar sessão
        if (error.message?.includes('row-level security') || error.message?.includes('authentication')) {
          console.log('🔄 Tentando renovar sessão Supabase...')
          
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
          
          if (refreshError || !refreshData.session) {
            throw new Error('Sessão expirada. Faça login novamente.')
          }
          
          // Tentar novamente após renovar sessão
          const { data: retryData, error: retryError } = await supabase
            .from('products')
            .update(updates)
            .eq('id', selectedProduct.id)
            .select()
            .single()
          
          if (retryError) throw retryError
        } else {
          throw error
        }
      }
        
        await loadProducts() // Recarregar lista
        setIsEditModalOpen(false)
        setSelectedProduct(null)
      } catch (error) {
        console.error("Erro ao editar produto:", error)
        setError(error.message || "Erro ao editar produto")
      }
    }
  }

  const handleDeleteProduct = async (id) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      try {
              // Verificar se está autenticado
      if (!isAuthenticated) {
        throw new Error('Usuário não autenticado no sistema')
      }

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('❌ Erro ao deletar produto:', error)
        
        // Se for erro de autenticação, tentar renovar sessão
        if (error.message?.includes('row-level security') || error.message?.includes('authentication')) {
          console.log('🔄 Tentando renovar sessão Supabase...')
          
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
          
          if (refreshError || !refreshData.session) {
            throw new Error('Sessão expirada. Faça login novamente.')
          }
          
          // Tentar novamente após renovar sessão
          const { error: retryError } = await supabase
            .from('products')
            .delete()
            .eq('id', id)
          
          if (retryError) throw retryError
        } else {
          throw error
        }
      }
        
        await loadProducts() // Recarregar lista
      } catch (error) {
        console.error("Erro ao excluir produto:", error)
        setError(error.message || "Erro ao excluir produto")
      }
    }
  }

  const openEditModal = (product) => {
    setSelectedProduct({ 
      ...product,
      features: product.features || [] // Garantir que features seja sempre um array
    })
    setIsEditModalOpen(true)
  }

  const addFeature = (isEdit = false) => {
    const feature = newFeature
    if (feature.trim()) {
      if (isEdit && selectedProduct) {
        setSelectedProduct({
          ...selectedProduct,
          features: [...(selectedProduct.features || []), feature.trim()]
        })
      } else {
        setNewProduct({
          ...newProduct,
          features: [...(newProduct.features || []), feature.trim()]
        })
      }
      setNewFeature("")
    }
  }

  const removeFeature = (index, isEdit = false) => {
    if (isEdit && selectedProduct) {
      setSelectedProduct({
        ...selectedProduct,
        features: (selectedProduct.features || []).filter((_, i) => i !== index)
      })
    } else {
      setNewProduct({
        ...newProduct,
        features: (newProduct.features || []).filter((_, i) => i !== index)
      })
    }
  }

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.icon : "📦"
  }

  return (
    <div className="space-y-6">
      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando produtos...</span>
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
              onClick={loadProducts}
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
          <h2 className="text-3xl font-bold text-gray-900">Gerenciar Produtos</h2>
          <p className="text-gray-600">Adicione, edite ou remova produtos do catálogo</p>
        </div>
        <Button 
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Produto
        </Button>
        <AdminModal
          open={isAddModalOpen}
          onOpenChange={(open) => {
            setIsAddModalOpen(open)
            if (!open) {
              setErrors({})
              setNewProduct({ name: "", category: "", description: "", features: [], price: "", image: null })
              setNewFeature("")
            }
          }}
          title="Adicionar Novo Produto"
          description="Preencha os dados do novo produto"
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
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nome do Produto *</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Nome do produto"
                    className={`mt-1 ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <Label htmlFor="category" className="text-sm font-medium text-gray-700">Categoria *</Label>
                  <Select value={newProduct.category} onValueChange={(value) => setNewProduct({ ...newProduct, category: value })} disabled={categoriesLoading}>
                    <SelectTrigger className="mt-1">
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
              </ModalGrid>
              
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">Descrição *</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Descrição detalhada do produto"
                  rows={4}
                  className="mt-1"
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>
              
              <div>
                <Label htmlFor="price" className="text-sm font-medium text-gray-700">Preço</Label>
                <Input
                  id="price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="Ex: R$ 1.500,00 ou Sob Consulta"
                  className="mt-1"
                />
              </div>
            </ModalSection>

            <ModalSection title="Características">
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
                  {(newProduct.features || []).map((feature, index) => (
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

            <ModalSection title="Imagem">
              <div>
                <Label htmlFor="image" className="text-sm font-medium text-gray-700">Imagem do Produto</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
                  className="mt-1"
                />
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
                onClick={handleAddProduct}
                disabled={categoriesLoading || isSubmitting}
                variant="success"
                icon={<Save className="h-4 w-4" />}
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Salvar Produto
              </ModalActionButton>
            </div>
          </div>
        </AdminModal>
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

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="overflow-hidden">
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {getCategoryIcon(product.category)} {categories.find(cat => cat.id === product.category)?.name || 'N/A'}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(product.features || []).slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {(product.features || []).length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{(product.features || []).length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-medium">{product.price}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-400 mb-4">
                    Adicionado em: {new Date(product.created_at).toLocaleDateString('pt-BR')}
                  </p>
                  
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(product)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
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

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            <Info className="h-12 w-12 mx-auto mb-4" />
            <p>Nenhum produto encontrado.</p>
          </CardContent>
        </Card>
      )}

      {/* Edit Product Modal */}
      <AdminModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Editar Produto"
        description="Edite os dados do produto selecionado"
        type="edit"
        size="lg"
      >
        {selectedProduct && (
          <div className="space-y-6">
            <ModalSection title="Informações Básicas">
              <ModalGrid cols={2}>
                <div>
                  <Label htmlFor="edit-name" className="text-sm font-medium text-gray-700">Nome do Produto *</Label>
                  <Input
                    id="edit-name"
                    value={selectedProduct.name}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                    placeholder="Nome do produto"
                    className="mt-1"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <Label htmlFor="edit-category" className="text-sm font-medium text-gray-700">Categoria *</Label>
                  <Select value={selectedProduct.category} onValueChange={(value) => setSelectedProduct({ ...selectedProduct, category: value })}>
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
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                </div>
              </ModalGrid>
              
              <div>
                <Label htmlFor="edit-description" className="text-sm font-medium text-gray-700">Descrição *</Label>
                <Textarea
                  id="edit-description"
                  value={selectedProduct.description}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                  placeholder="Descrição detalhada do produto"
                  rows={4}
                  className="mt-1"
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>
              
              <div>
                <Label htmlFor="edit-price" className="text-sm font-medium text-gray-700">Preço</Label>
                <Input
                  id="edit-price"
                  value={selectedProduct.price}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })}
                  placeholder="Ex: R$ 1.500,00 ou Sob Consulta"
                  className="mt-1"
                />
              </div>
            </ModalSection>

            <ModalSection title="Características">
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
                  {(selectedProduct.features || []).map((feature, index) => (
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

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <ModalActionButton
                onClick={() => setIsEditModalOpen(false)}
                variant="outline"
              >
                Cancelar
              </ModalActionButton>
              <ModalActionButton
                onClick={handleEditProduct}
                disabled={categoriesLoading}
                variant="primary"
                icon={<Save className="h-4 w-4" />}
              >
                Salvar Alterações
              </ModalActionButton>
            </div>
          </div>
        )}
      </AdminModal>
    </>
  )}
</div>
  )
}

export default ProductsManager


