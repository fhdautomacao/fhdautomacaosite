import React, { useState, useEffect, useMemo } from 'react'
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
  Upload,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import AdminDialog from '@/components/admin/AdminDialog'
import AdminSelect from '@/components/admin/AdminSelect'
import { productsAPI } from '@/api/products'
import { useProductCategories } from '@/hooks/useCategories'

export default function ProductsManagerRefactored() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  
  // Estados de modais
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  // Estados de seleção
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [productToDelete, setProductToDelete] = useState(null)
  
  // Estados de formulário
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    features: [],
    price: "",
    image: null
  })

  const [newFeature, setNewFeature] = useState("")
  const [imagePreview, setImagePreview] = useState(null)

  const { categories, loading: categoriesLoading, error: categoriesError } = useProductCategories()

  // Carregar produtos do Supabase
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await productsAPI.getAll()
      setProducts(data)
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
      setError("Erro ao carregar produtos")
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

  const categoryOptions = useMemo(() => {
    return categories?.map(cat => ({ value: cat.id, label: cat.name })) || []
  }, [categories])

  const handleCreateProduct = async () => {
    if (!formData.name || !formData.category || !formData.description) {
      setError("Preencha todos os campos obrigatórios")
      return
    }

    try {
      setLoading(true)
      let imageUrl = "/products/placeholder.jpg"
      if (formData.image) {
        imageUrl = await productsAPI.uploadImage(formData.image)
      }

      const productData = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        features: formData.features,
        price: formData.price || "Sob Consulta",
        image_url: imageUrl,
        is_active: true,
        display_order: products.length
      }
      
      await productsAPI.create(productData)
      await loadProducts()
      resetForm()
      setShowCreateModal(false)
    } catch (error) {
      console.error("Erro ao adicionar produto:", error)
      setError("Erro ao adicionar produto")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProduct = async () => {
    if (!selectedProduct || !formData.name || !formData.category || !formData.description) {
      setError("Preencha todos os campos obrigatórios")
      return
    }

    try {
      setLoading(true)
      let imageUrl = selectedProduct.image_url
      if (formData.image) {
        imageUrl = await productsAPI.uploadImage(formData.image)
      }

      const productData = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        features: formData.features,
        price: formData.price || "Sob Consulta",
        image_url: imageUrl,
        is_active: true
      }
      
      await productsAPI.update(selectedProduct.id, productData)
      await loadProducts()
      resetForm()
      setShowEditModal(false)
    } catch (error) {
      console.error("Erro ao atualizar produto:", error)
      setError("Erro ao atualizar produto")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async () => {
    if (!productToDelete) return

    try {
      setLoading(true)
      await productsAPI.delete(productToDelete.id)
      await loadProducts()
      setShowDeleteModal(false)
      setProductToDelete(null)
    } catch (error) {
      console.error("Erro ao deletar produto:", error)
      setError("Erro ao deletar produto")
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    resetForm()
    setShowCreateModal(true)
  }

  const openEditModal = (product) => {
    setSelectedProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      features: product.features || [],
      price: product.price || "",
      image: null
    })
    setImagePreview(product.image_url)
    setShowEditModal(true)
  }

  const openDeleteModal = (product) => {
    setProductToDelete(product)
    setShowDeleteModal(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      description: "",
      features: [],
      price: "",
      image: null
    })
    setNewFeature("")
    setImagePreview(null)
    setSelectedProduct(null)
  }

  const addFeature = (isEdit = false) => {
    if (!newFeature.trim()) return
    
    const targetFormData = isEdit ? formData : formData
    const updatedFeatures = [...targetFormData.features, newFeature.trim()]
    
    if (isEdit) {
      setFormData({ ...formData, features: updatedFeatures })
    } else {
      setFormData({ ...formData, features: updatedFeatures })
    }
    setNewFeature("")
  }

  const removeFeature = (index, isEdit = false) => {
    const targetFormData = isEdit ? formData : formData
    const updatedFeatures = targetFormData.features.filter((_, i) => i !== index)
    
    if (isEdit) {
      setFormData({ ...formData, features: updatedFeatures })
    } else {
      setFormData({ ...formData, features: updatedFeatures })
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, image: file })
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const getCategoryIcon = (categoryId) => {
    const category = categories?.find(c => c.id === categoryId)
    return category?.icon || Package
  }

  const getCategoryName = (categoryId) => {
    const category = categories?.find(c => c.id === categoryId)
    return category?.name || "Sem categoria"
  }

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Produtos</h1>
          <p className="text-gray-600">Adicione, edite e gerencie os produtos da empresa</p>
        </div>
        <Button onClick={openCreateModal} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div>
              <AdminSelect
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={[{ value: "all", label: "Todas as categorias" }, ...categoryOptions]}
                placeholder="Filtrar por categoria"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Package className="h-4 w-4" />
              {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredProducts.map((product) => {
            const CategoryIcon = getCategoryIcon(product.category)
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <CategoryIcon className="h-5 w-5 text-blue-500" />
                        <Badge variant="secondary" className="text-xs">
                          {getCategoryName(product.category)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(product)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteModal(product)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="font-medium">{product.price}</span>
                      </div>
                      
                      {product.features && product.features.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium">Características:</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {product.features.slice(0, 3).map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {product.features.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{product.features.length - 3} mais
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Modal de Criação */}
      <AdminDialog 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal} 
        title="Novo Produto" 
        description="Adicione um novo produto ao catálogo."
        className="max-w-2xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Nome do Produto *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Nome do produto"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Categoria *</Label>
              <AdminSelect
                value={formData.category}
                onChange={(value) => setFormData({...formData, category: value})}
                options={categoryOptions}
                placeholder="Selecione uma categoria"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Descrição *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Descrição detalhada do produto"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Preço</Label>
              <Input
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="R$ 0,00 ou 'Sob Consulta'"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Imagem</Label>
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
                {imagePreview && (
                  <div className="mt-2 relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-20 h-20 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFormData({...formData, image: null})
                        setImagePreview(null)
                      }}
                      className="absolute -top-1 -right-1 h-6 w-6 p-0 bg-red-500 text-white hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Características</Label>
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Adicionar característica"
                onKeyPress={(e) => e.key === 'Enter' && addFeature()}
              />
              <Button type="button" onClick={() => addFeature()} variant="outline">
                Adicionar
              </Button>
            </div>
            {formData.features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {feature}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(index)}
                      className="h-4 w-4 p-0 hover:bg-red-100"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateProduct} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Salvar Produto
            </Button>
          </div>
        </div>
      </AdminDialog>

      {/* Modal de Edição */}
      <AdminDialog 
        open={showEditModal} 
        onOpenChange={setShowEditModal} 
        title="Editar Produto" 
        description="Modifique as informações do produto."
        className="max-w-2xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Nome do Produto *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Nome do produto"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Categoria *</Label>
              <AdminSelect
                value={formData.category}
                onChange={(value) => setFormData({...formData, category: value})}
                options={categoryOptions}
                placeholder="Selecione uma categoria"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Descrição *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Descrição detalhada do produto"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Preço</Label>
              <Input
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="R$ 0,00 ou 'Sob Consulta'"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Imagem</Label>
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
                {imagePreview && (
                  <div className="mt-2 relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-20 h-20 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFormData({...formData, image: null})
                        setImagePreview(null)
                      }}
                      className="absolute -top-1 -right-1 h-6 w-6 p-0 bg-red-500 text-white hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Características</Label>
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Adicionar característica"
                onKeyPress={(e) => e.key === 'Enter' && addFeature(true)}
              />
              <Button type="button" onClick={() => addFeature(true)} variant="outline">
                Adicionar
              </Button>
            </div>
            {formData.features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {feature}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(index, true)}
                      className="h-4 w-4 p-0 hover:bg-red-100"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateProduct} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Atualizar Produto
            </Button>
          </div>
        </div>
      </AdminDialog>

      {/* Modal de Confirmação de Exclusão */}
      <AdminDialog 
        open={showDeleteModal} 
        onOpenChange={setShowDeleteModal} 
        title="Confirmar Exclusão" 
        description="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
        className="max-w-md"
      >
        <div className="space-y-4">
          {productToDelete && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <Info className="h-4 w-4" />
                <span className="font-medium">Produto: {productToDelete.name}</span>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleDeleteProduct} disabled={loading} variant="destructive">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Excluir Produto
            </Button>
          </div>
        </div>
      </AdminDialog>
    </div>
  )
}
