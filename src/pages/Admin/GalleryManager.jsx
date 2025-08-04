import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  Image, 
  Edit, 
  Trash2, 
  Plus, 
  X, 
  Save,
  Eye,
  Filter,
  Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { storageAPI } from '@/api/storage'

const GalleryManager = () => {
  const [photos, setPhotos] = useState([
    {
      id: 1,
      title: 'Unidade Hidráulica em Operação',
      description: 'Sistema hidráulico completo instalado em cliente',
      category: 'Unidades Hidráulicas',
      image: '/gallery/unidade-hidraulica-1.jpg',
      uploadDate: '2024-01-15'
    },
    {
      id: 2,
      title: 'Manutenção de Cilindro',
      description: 'Serviço de manutenção preventiva em cilindro hidráulico',
      category: 'Cilindros',
      image: '/gallery/cilindro-manutencao.jpg',
      uploadDate: '2024-01-10'
    },
    {
      id: 3,
      title: 'Instalação de Tubulação',
      description: 'Instalação especializada de tubulação hidráulica',
      category: 'Tubulações',
      image: '/gallery/tubulacao-instalacao.jpg',
      uploadDate: '2024-01-08'
    }
  ])

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    'Unidades Hidráulicas',
    'Cilindros',
    'Tubulações',
    'Bombas',
    'Válvulas',
    'Projetos',
    'Testes',
    'Equipe'
  ]

  const [newPhoto, setNewPhoto] = useState({
    title: '',
    description: '',
    category: '',
    image: null
  })

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || photo.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddPhoto = async () => {
    if (newPhoto.title && newPhoto.description && newPhoto.category && newPhoto.image) {
      try {
        const file = newPhoto.image;
        const filePath = `gallery/${Date.now()}-${file.name}`;
        const { path } = await storageAPI.uploadFile(file, filePath);
        const publicUrl = storageAPI.getPublicUrl(path);

        const photo = {
          id: Date.now(),
          ...newPhoto,
          uploadDate: new Date().toISOString().split("T")[0],
          image: publicUrl
        };
        setPhotos([...photos, photo]);
        setNewPhoto({ title: "", description: "", category: "", image: null });
        setIsAddModalOpen(false);
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        alert("Erro ao fazer upload da imagem. Verifique o console para mais detalhes.");
      }
    } else {
      alert("Por favor, preencha todos os campos e selecione uma imagem.");
    }
  };
  const handleEditPhoto = () => {
    if (selectedPhoto) {
      setPhotos(photos.map(photo => 
        photo.id === selectedPhoto.id ? selectedPhoto : photo
      ))
      setIsEditModalOpen(false)
      setSelectedPhoto(null)
    }
  }

  const handleDeletePhoto = (id) => {
    setPhotos(photos.filter(photo => photo.id !== id))
  }

  const openEditModal = (photo) => {
    setSelectedPhoto({ ...photo })
    setIsEditModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gerenciar Galeria</h2>
          <p className="text-gray-600">Adicione, edite ou remova fotos da galeria</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Foto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Foto</DialogTitle>
              <DialogDescription>
                Preencha os dados da nova foto para a galeria
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={newPhoto.title}
                  onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                  placeholder="Título da foto"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newPhoto.description}
                  onChange={(e) => setNewPhoto({ ...newPhoto, description: e.target.value })}
                  placeholder="Descrição da foto"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select value={newPhoto.category} onValueChange={(value) => setNewPhoto({ ...newPhoto, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="image">Arquivo da Imagem</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewPhoto({ ...newPhoto, image: e.target.files[0] })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddPhoto}>
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
                  placeholder="Buscar por título ou descrição..."
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
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredPhotos.map((photo) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="overflow-hidden">
                <div className="aspect-video bg-gray-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image className="h-12 w-12 text-gray-400" />
                  </div>
                  <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {photo.category}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{photo.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{photo.description}</p>
                  <p className="text-xs text-gray-500 mb-4">Adicionado em: {photo.uploadDate}</p>
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(photo)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePhoto(photo.id)}
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

      {filteredPhotos.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma foto encontrada
            </h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Tente ajustar os filtros de busca'
                : 'Adicione a primeira foto à galeria'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Foto</DialogTitle>
            <DialogDescription>
              Atualize as informações da foto
            </DialogDescription>
          </DialogHeader>
          {selectedPhoto && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Título</Label>
                <Input
                  id="edit-title"
                  value={selectedPhoto.title}
                  onChange={(e) => setSelectedPhoto({ ...selectedPhoto, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Descrição</Label>
                <Textarea
                  id="edit-description"
                  value={selectedPhoto.description}
                  onChange={(e) => setSelectedPhoto({ ...selectedPhoto, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Categoria</Label>
                <Select 
                  value={selectedPhoto.category} 
                  onValueChange={(value) => setSelectedPhoto({ ...selectedPhoto, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleEditPhoto}>
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

export default GalleryManager

