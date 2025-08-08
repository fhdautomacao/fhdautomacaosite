import { useState, useEffect } from 'react'
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
import AdminModal from '@/components/admin/AdminModal'
import { ModalActionButton, ModalSection, ModalGrid } from '@/components/admin/AdminModal'
import { storageAPI } from '@/api/storage'
import { galleryAPI } from '@/api/gallery'
import { useGalleryCategories } from '@/hooks/useCategories'

const GalleryManager = () => {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { categories, loading: categoriesLoading, error: categoriesError } = useGalleryCategories()

  useEffect(() => {
    const fetchPhotos = async () => {
      console.log("Fetching photos...")
      try {
        setLoading(true)
        const data = await galleryAPI.getAll()
        console.log("Photos fetched:", data)
        setPhotos(data)
      } catch (err) {
        console.error("Erro ao buscar fotos:", err)
        setError("Não foi possível carregar as fotos.")
      } finally {
        setLoading(false)
      }
    }
    fetchPhotos()
  }, [])

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

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
        
        console.log("Iniciando upload do arquivo:", file.name);
        const { path } = await storageAPI.uploadFile(file, filePath);
        console.log("Upload concluído, path:", path);
        
        const publicUrl = storageAPI.getPublicUrl(path);
        console.log("URL pública gerada:", publicUrl);

        const photoData = {
          title: newPhoto.title,
          description: newPhoto.description,
          category: newPhoto.category,
          image_url: publicUrl,
          upload_date: new Date().toISOString().split("T")[0]
        };

        console.log("Salvando dados da foto:", photoData);
        const createdPhoto = await galleryAPI.create(photoData);
        console.log("Foto criada com sucesso:", createdPhoto);
        
        setPhotos(prevPhotos => [...prevPhotos, createdPhoto]);
        setNewPhoto({ title: "", description: "", category: "", image: null });
        setIsAddModalOpen(false);
        
        // Mostrar mensagem de sucesso
        alert("Foto adicionada com sucesso!");
      } catch (error) {
        console.error("Erro ao fazer upload da imagem ou salvar no banco de dados:", error);
        
        let errorMessage = "Erro ao fazer upload da imagem ou salvar no banco de dados.";
        
        if (error.message?.includes('Bucket not found')) {
          errorMessage = "Erro de configuração do storage. O bucket de imagens não foi encontrado. Entre em contato com o administrador.";
        } else if (error.message?.includes('permissions')) {
          errorMessage = "Erro de permissões. Verifique se você tem permissão para fazer upload de arquivos.";
        } else if (error.message?.includes('file size')) {
          errorMessage = "Arquivo muito grande. O tamanho máximo permitido é 50MB.";
        } else if (error.message?.includes('file type')) {
          errorMessage = "Tipo de arquivo não suportado. Use apenas imagens (JPG, PNG, GIF, etc.).";
        }
        
        alert(errorMessage + "\n\nDetalhes técnicos: " + error.message);
      }
    } else {
      alert("Por favor, preencha todos os campos e selecione uma imagem.");
    }
  };
  const handleEditPhoto = async () => {
    if (selectedPhoto) {
      try {
        const updatedPhoto = await galleryAPI.update(selectedPhoto.id, {
          title: selectedPhoto.title,
          description: selectedPhoto.description,
          category: selectedPhoto.category
        });
        setPhotos(photos.map(photo => 
          photo.id === selectedPhoto.id ? updatedPhoto : photo
        ));
        setIsEditModalOpen(false);
        setSelectedPhoto(null);
      } catch (error) {
        console.error("Erro ao atualizar foto:", error);
        alert("Erro ao atualizar foto. Verifique o console para mais detalhes.");
      }
    }
  };

  const handleDeletePhoto = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta foto?")) {
      try {
        await galleryAPI.delete(id);
        setPhotos(photos.filter(photo => photo.id !== id));
      } catch (error) {
        console.error("Erro ao deletar foto:", error);
        alert("Erro ao deletar foto. Verifique o console para mais detalhes.");
      }
    }
  };

  const openEditModal = (photo) => {
    setSelectedPhoto({ ...photo })
    setIsEditModalOpen(true)
  }

  const getCategoryIcon = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName)
    return category ? category.icon : "🖼️"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gerenciar Galeria</h2>
          <p className="text-gray-600">Adicione, edite ou remova fotos da galeria</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Foto
        </Button>
        <AdminModal
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          title="Adicionar Nova Foto"
          description="Preencha os dados da nova foto para a galeria"
          type="create"
          size="2xl"
        >
          <div className="space-y-6">
            <ModalSection title="Informações da Foto">
              <ModalGrid cols={2}>
                <div>
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700">Título *</Label>
                  <Input
                    id="title"
                    value={newPhoto.title}
                    onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                    placeholder="Título da foto"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="text-sm font-medium text-gray-700">Categoria *</Label>
                  <Select value={newPhoto.category} onValueChange={(value) => setNewPhoto({ ...newPhoto, category: value })} disabled={categoriesLoading}>
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
                </div>
              </ModalGrid>
              
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">Descrição</Label>
                <Textarea
                  id="description"
                  value={newPhoto.description}
                  onChange={(e) => setNewPhoto({ ...newPhoto, description: e.target.value })}
                  placeholder="Descrição detalhada da foto"
                  rows={4}
                  className="mt-1"
                />
              </div>
            </ModalSection>

            <ModalSection title="Upload da Imagem">
              <div>
                <Label htmlFor="image" className="text-sm font-medium text-gray-700">Arquivo da Imagem *</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewPhoto({ ...newPhoto, image: e.target.files[0] })}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB</p>
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
                onClick={handleAddPhoto}
                disabled={categoriesLoading}
                variant="success"
                icon={<Save className="h-4 w-4" />}
              >
                Salvar Foto
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
                  placeholder="Buscar por título ou descrição..."
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

      {loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-600">Carregando fotos...</p>
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

      {!loading && !error && filteredPhotos.length === 0 && (
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

      {!loading && !error && (
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
                    <img src={photo.image_url} alt={photo.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                      {getCategoryIcon(photo.category)} {categories.find(cat => cat.id === photo.category)?.name || 'N/A'}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{photo.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{photo.description}</p>
                    <p className="text-xs text-gray-500 mb-4">Adicionado em: {new Date(photo.upload_date).toLocaleDateString()}</p>
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
      )}

      {/* Edit Modal */}
      <AdminModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Editar Foto"
        description="Atualize as informações da foto"
        type="edit"
        size="2xl"
      >
        {selectedPhoto && (
          <div className="space-y-6">
            <ModalSection title="Informações da Foto">
              <ModalGrid cols={2}>
                <div>
                  <Label htmlFor="edit-title" className="text-sm font-medium text-gray-700">Título *</Label>
                  <Input
                    id="edit-title"
                    value={selectedPhoto.title}
                    onChange={(e) => setSelectedPhoto({ ...selectedPhoto, title: e.target.value })}
                    placeholder="Título da foto"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-category" className="text-sm font-medium text-gray-700">Categoria *</Label>
                  <Select 
                    value={selectedPhoto.category} 
                    onValueChange={(value) => setSelectedPhoto({ ...selectedPhoto, category: value })}
                    disabled={categoriesLoading}
                  >
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
                </div>
              </ModalGrid>
              
              <div>
                <Label htmlFor="edit-description" className="text-sm font-medium text-gray-700">Descrição</Label>
                <Textarea
                  id="edit-description"
                  value={selectedPhoto.description}
                  onChange={(e) => setSelectedPhoto({ ...selectedPhoto, description: e.target.value })}
                  placeholder="Descrição detalhada da foto"
                  rows={4}
                  className="mt-1"
                />
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
                onClick={handleEditPhoto}
                variant="primary"
                icon={<Save className="h-4 w-4" />}
              >
                Salvar Alterações
              </ModalActionButton>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  )
}

export default GalleryManager


