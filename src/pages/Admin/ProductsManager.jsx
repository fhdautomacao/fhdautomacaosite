import { useState } from 'react'
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
  Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

const ProductsManager = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Unidade Hidráulica',
      category: 'Sistemas Hidráulicos',
      description: 'Unidades hidráulicas completas para diversas aplicações industriais',
      features: ['Alta Pressão', 'Controle Preciso', 'Baixo Ruído'],
      price: 'Sob Consulta',
      image: '/products/unidade-hidraulica.jpg',
      addedDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Cilindro Hidráulico',
      category: 'Atuadores',
      description: 'Cilindros hidráulicos de alta performance e durabilidade',
      features: ['Vedação Dupla', 'Resistente', 'Longa Vida Útil'],
      price: 'Sob Consulta',
      image: '/products/cilindro-hidraulico.jpg',
      addedDate: '2024-01-12'
    },
    {
      id: 3,
      name: 'Válvulas Proporcionais',
      category: 'Controle',
      description: 'Válvulas proporcionais para controle preciso de fluxo e pressão',
      features: ['Controle Eletrônico', 'Alta Precisão', 'Resposta Rápida'],
      price: 'Sob Consulta',
      image: '/products/valvulas-proporcionais.jpg',
      addedDate: '2024-01-10'
    }
  ])

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    'Sistemas Hidráulicos',
    'Atuadores',
    'Controle',
    'Bombas',
    'Motores',
    'Armazenamento',
    'Sistemas Compactos',
    'Filtros',
    'Acessórios'
  ]

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    description: '',
    features: [],
    price: '',
    image: null
  })

  const [newFeature, setNewFeature] = useState('')

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.category && newProduct.description) {
      const product = {
        id: Date.now(),
        ...newProduct,
        addedDate: new Date().toISOString().split('T')[0],
        image: newProduct.image || '/products/placeholder.jpg'
      }
      setProducts([...products, product])
      setNewProduct({ name: '', category: '', description: '', features: [], price: '', image: null })
      setIsAddModalOpen(false)
    }
  }

  const handleEditProduct = () => {
    if (selectedProduct) {
      setProducts(products.map(product => 
        product.id === selectedProduct.id ? selectedProduct : product
      ))
      setIsEditModalOpen(false)
      setSelectedProduct(null)
    }
  }

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id))
  }

  const openEditModal = (product) => {
    setSelectedProduct({ ...product })
    setIsEditModalOpen(true)
  }

  const addFeature = (isEdit = false) => {
    const feature = isEdit ? newFeature : newFeature
    if (feature.trim()) {
      if (isEdit && selectedProduct) {
        setSelectedProduct({
          ...selectedProduct,
          features: [...selectedProduct.features, feature.trim()]
        })
      } else {
        setNewProduct({
          ...newProduct,
          features: [...newProduct.features, feature.trim()]
        })
      }
      setNewFeature('')
    }
  }

  const removeFeature = (index, isEdit = false) => {
    if (isEdit && selectedProduct) {
      setSelectedProduct({
        ...selectedProduct,
        features: selectedProduct.features.filter((_, i) => i !== index)
      })
    } else {
      setNewProduct({
        ...newProduct,
        features: newProduct.features.filter((_, i) => i !== index)
      })
    }
  }

  const getCategoryIcon = (category) => {
    const icons = {
      'Sistemas Hidráulicos': '⚙️',
      'Atuadores': '🔧',
      'Controle': '🎛️',
      'Bombas': '⚙️',
      'Motores': '🔩',
      'Armazenamento': '📦',
      'Sistemas Compactos': '🏭',
      'Filtros': '🔍',
      'Acessórios': '🔧'
    }
    return icons[category] || '📦'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gerenciar Produtos</h2>
          <p className="text-gray-600">Adicione, edite ou remova produtos do catálogo</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Produto</DialogTitle>
              <DialogDescription>
                Preencha os dados do novo produto
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Produto</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Nome do produto"
                />
              </div>
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select value={newProduct.category} onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {getCategoryIcon(category)} {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Descrição do produto"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="price">Preço</Label>
                <Input
                  id="price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="Ex: R$ 1.500,00 ou Sob Consulta"
                />
              </div>
              <div>
                <Label>Características</Label>
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
                    {newProduct.features.map((feature, index) => (
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
                <Label htmlFor="image">Imagem do Produto</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddProduct}>
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
              <Label htmlFor="category-filter">Categoria</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {getCategoryIcon(category)} {category}
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
                <div className="aspect-video bg-gray-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                  <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {getCategoryIcon(product.category)} {product.category}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {product.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{product.features.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-medium">{product.price}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-400 mb-4">Adicionado em: {product.addedDate}</p>
                  
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
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Tente ajustar os filtros de busca'
                : 'Adicione o primeiro produto ao catálogo'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
            <DialogDescription>
              Atualize as informações do produto
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nome do Produto</Label>
                <Input
                  id="edit-name"
                  value={selectedProduct.name}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Categoria</Label>
                <Select 
                  value={selectedProduct.category} 
                  onValueChange={(value) => setSelectedProduct({ ...selectedProduct, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {getCategoryIcon(category)} {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-description">Descrição</Label>
                <Textarea
                  id="edit-description"
                  value={selectedProduct.description}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="edit-price">Preço</Label>
                <Input
                  id="edit-price"
                  value={selectedProduct.price}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })}
                />
              </div>
              <div>
                <Label>Características</Label>
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
                    {selectedProduct.features.map((feature, index) => (
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
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleEditProduct}>
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

export default ProductsManager

