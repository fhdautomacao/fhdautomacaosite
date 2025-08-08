import React, { useState, useEffect, useMemo } from 'react'
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
  Search,
  Loader2,
  Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import AdminDialog from '@/components/admin/AdminDialog'
import AdminSelect from '@/components/admin/AdminSelect'
import { storageAPI } from '@/api/storage'
import { galleryAPI } from '@/api/gallery'
import { useGalleryCategories } from '@/hooks/useCategories'

export default function GalleryManagerRefactored() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  
  // Estados de modais
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  
  // Estados de seleção
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [photoToDelete, setPhotoToDelete] = useState(null)
  const [photoToView, setPhotoToView] = useState(null)
  
  // Estados de formulário
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image: null
  })

  const [imagePreview, setImagePreview] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)

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

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || photo.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categoryOptions = useMemo(() => {
    return categories?.map(cat => ({ value: cat.id, label: cat.name })) || []
  }, [categories])

  const handleCreatePhoto = async () => {
    if (!formData.title || !formData.description || !formData.category || !formData.image) {
      setError("Preencha todos os campos obrigatórios e selecione uma imagem")
      return
    }

    try {
      setLoading(true)
      setUploadProgress(0)
      
      const file = formData.image;
      const filePath = `gallery/${Date.now()}-${file.name}`;
      
      console.log("Iniciando upload do arquivo:", file.name);
      
      // Simular progresso de upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 100)
      
      const { path } = await storageAPI.uploadFile(file, filePath);
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      console.log("Upload concluído, path:", path);
      
      const publicUrl = storageAPI.getPublicUrl(path);
      console.log("URL pública gerada:", publicUrl);

      const photoData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        image_url: publicUrl,
        upload_date: new Date().toISOString().split("T")[0]
      };

      console.log("Salvando dados da foto:", photoData);
      const createdPhoto = await galleryAPI.create(photoData);
      console.log("Foto criada com sucesso:", createdPhoto);
      
      setPhotos(prevPhotos => [...prevPhotos, createdPhoto]);
      resetForm()
      setShowCreateModal(false)
      setUploadProgress(0)
      
      // Mostrar mensagem de sucesso
      alert("Foto adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar foto:", error)
      setError("Erro ao adicionar foto")
    } finally {
      setLoading(false)
      setUploadProgress(0)
    }
  }

  const handleUpdatePhoto = async () => {
    if (!selectedPhoto || !formData.title || !formData.description || !formData.category) {
      setError("Preencha todos os campos obrigatórios")
      return
    }

    try {
      setLoading(true)
      setUploadProgress(0)
      
      let imageUrl = selectedPhoto.image_url
      if (formData.image) {
        const file = formData.image;
        const filePath = `gallery/${Date.now()}-${file.name}`;
        
        console.log("Iniciando upload do arquivo:", file.name);
        
        // Simular progresso de upload
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + 10, 90))
        }, 100)
        
        const { path } = await storageAPI.uploadFile(file, filePath);
        clearInterval(progressInterval)
        setUploadProgress(100)
        
        imageUrl = storageAPI.getPublicUrl(path);
      }

      const photoData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        image_url: imageUrl
      };

      await galleryAPI.update(selectedPhoto.id, photoData);
      await loadPhotos()
      resetForm()
      setShowEditModal(false)
      setUploadProgress(0)
    } catch (error) {
      console.error("Erro ao atualizar foto:", error)
      setError("Erro ao atualizar foto")
    } finally {
      setLoading(false)
      setUploadProgress(0)
    }
  }

  const handleDeletePhoto = async () => {
    if (!photoToDelete) return

    try {
      setLoading(true)
      await galleryAPI.delete(photoToDelete.id)
      await loadPhotos()
      setShowDeleteModal(false)
      setPhotoToDelete(null)
    } catch (error) {
      console.error("Erro ao deletar foto:", error)
      setError("Erro ao deletar foto")
    } finally {
      setLoading(false)
    }
  }

  const loadPhotos = async () => {
    try {
      setLoading(true)
      const data = await galleryAPI.getAll()
      setPhotos(data)
    } catch (error) {
      console.error("Erro ao carregar fotos:", error)
      setError("Erro ao carregar fotos")
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    resetForm()
    setShowCreateModal(true)
  }

  const openEditModal = (photo) => {
    setSelectedPhoto(photo)
    setFormData({
      title: photo.title,
      description: photo.description,
      category: photo.category,
      image: null
    })
    setImagePreview(photo.image_url)
    setShowEditModal(true)
  }

  const openDeleteModal = (photo) => {
    setPhotoToDelete(photo)
    setShowDeleteModal(true)
  }

  const openViewModal = (photo) => {
    setPhotoToView(photo)
    setShowViewModal(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      image: null
    })
    setImagePreview(null)
    setSelectedPhoto(null)
    setUploadProgress(0)
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
    return category?.icon || Image
  }

  const getCategoryName = (categoryId) => {
    const category = categories?.find(c => c.id === categoryId)
    return category?.name || "Sem categoria"
  }

  if (loading && photos.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Galeria</h1>
          <p className="text-gray-600">Adicione, edite e gerencie as fotos da galeria</p>
        </div>
        <Button onClick={openCreateModal} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Foto
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar fotos..."
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
              <Image className="h-4 w-4" />
              {filteredPhotos.length} foto{filteredPhotos.length !== 1 ? 's' : ''} encontrada{filteredPhotos.length !== 1 ? 's' : ''}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Fotos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredPhotos.map((photo) => {
            const CategoryIcon = getCategoryIcon(photo.category)
            return (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow group">
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    <img 
                      src={photo.image_url} 
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openViewModal(photo)}
                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(photo)}
                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteModal(photo)}
                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <CategoryIcon className="h-4 w-4 text-blue-500" />
                      <Badge variant="secondary" className="text-xs">
                        {getCategoryName(photo.category)}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm line-clamp-1">{photo.title}</CardTitle>
                    <CardDescription className="line-clamp-2 text-xs">
                      {photo.description}
                    </CardDescription>
                  </CardHeader>
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
        title="Nova Foto" 
        description="Adicione uma nova foto à galeria."
        className="max-w-2xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Título *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Título da foto"
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
              placeholder="Descrição da foto"
              rows={3}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Imagem *</Label>
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
                    className="w-32 h-32 object-cover rounded border"
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
              {uploadProgress > 0 && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Upload: {uploadProgress}%</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreatePhoto} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Salvar Foto
            </Button>
          </div>
        </div>
      </AdminDialog>

      {/* Modal de Edição */}
      <AdminDialog 
        open={showEditModal} 
        onOpenChange={setShowEditModal} 
        title="Editar Foto" 
        description="Modifique as informações da foto."
        className="max-w-2xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Título *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Título da foto"
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
              placeholder="Descrição da foto"
              rows={3}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Nova Imagem (opcional)</Label>
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
                    className="w-32 h-32 object-cover rounded border"
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
              {uploadProgress > 0 && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Upload: {uploadProgress}%</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdatePhoto} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Atualizar Foto
            </Button>
          </div>
        </div>
      </AdminDialog>

      {/* Modal de Visualização */}
      <AdminDialog 
        open={showViewModal} 
        onOpenChange={setShowViewModal} 
        title={photoToView?.title} 
        description={photoToView?.description}
        className="max-w-4xl"
      >
        <div className="space-y-4">
          {photoToView && (
            <div className="relative">
              <img 
                src={photoToView.image_url} 
                alt={photoToView.title}
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
              />
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Image className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Categoria: {getCategoryName(photoToView.category)}</span>
                </div>
                <p className="text-sm text-gray-600">
                  Data de upload: {photoToView.upload_date}
                </p>
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setShowViewModal(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </AdminDialog>

      {/* Modal de Confirmação de Exclusão */}
      <AdminDialog 
        open={showDeleteModal} 
        onOpenChange={setShowDeleteModal} 
        title="Confirmar Exclusão" 
        description="Tem certeza que deseja excluir esta foto? Esta ação não pode ser desfeita."
        className="max-w-md"
      >
        <div className="space-y-4">
          {photoToDelete && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <Info className="h-4 w-4" />
                <span className="font-medium">Foto: {photoToDelete.title}</span>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleDeletePhoto} disabled={loading} variant="destructive">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Excluir Foto
            </Button>
          </div>
        </div>
      </AdminDialog>
    </div>
  )
}
