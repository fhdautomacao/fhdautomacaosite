import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X, Camera, Filter, ArrowRight } from 'lucide-react'
import { galleryAPI } from '../../api/gallery'
import { useGalleryCategories } from '../../hooks/useCategories'
import { useI18n } from '@/i18n/index.jsx'

const Gallery = ({ galleryItemsData = null, galleryCategories = null }) => {
  const { t } = useI18n()
  const ALL_KEY = '__ALL__'
  const [selectedImage, setSelectedImage] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState(ALL_KEY)
  const [images, setImages] = useState(galleryItemsData || [])
  const [loadingImages, setLoadingImages] = useState(!galleryItemsData)
  const [showAllImages, setShowAllImages] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showAllImagesMobile, setShowAllImagesMobile] = useState(false)
  const IMAGES_LIMIT = 8
  const { categories: fetchedCategoriesHook, loading: loadingCategoriesHook, error: categoriesErrorHook } = useGalleryCategories({ initialData: galleryCategories, enabled: !galleryCategories })
  const fetchedCategories = galleryCategories || fetchedCategoriesHook
  const loadingCategories = galleryCategories ? false : loadingCategoriesHook
  const categoriesError = galleryCategories ? null : categoriesErrorHook

  // Detectar se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // CORREÇÃO: useEffect para restaurar o scroll quando o componente for desmontado.
  // Isso previne que a página fique "travada" se o usuário navegar para outra página
  // enquanto um modal estiver aberto.
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  // Cleanup: restaurar scroll quando componente for desmontado
  useEffect(() => {
    return () => {
      if (!isMobile) {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isMobile])

  // Bloquear scroll quando modal mobile estiver aberto
  useEffect(() => {
    if (isMobile && selectedImage) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.top = `-${window.scrollY}px`
    } else if (isMobile) {
      document.body.style.overflow = 'unset'
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
    }
  }, [isMobile, selectedImage])

  useEffect(() => {
    if (galleryItemsData) {
      setImages(galleryItemsData)
      setLoadingImages(false)
      return
    }
    
    const fetchGalleryItems = async () => {
      try {
        const data = await galleryAPI.getAll()
        setImages(data)
      } catch (error) {
        console.error('❌ Gallery: Erro ao buscar imagens:', error)
        setImages([])
      } finally {
        setLoadingImages(false)
      }
    }
    fetchGalleryItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [galleryItemsData])

  const usedCategoryIds = [...new Set(images.map(img => img.category))]
  const usedCategories = fetchedCategories.filter(cat => usedCategoryIds.includes(cat.id))
  const allCategories = [{ id: ALL_KEY, label: t('common.all','Todos') }, ...usedCategories.map(cat => ({ id: cat.name, label: cat.name }))]

  const filteredImages = selectedCategory === ALL_KEY 
    ? images 
    : images.filter(img => {
        const categoryObject = fetchedCategories.find(cat => cat.id === img.category)
        const matches = categoryObject && categoryObject.name === selectedCategory
        return matches
      })

  // CORREÇÃO: Simplificação da função openModal
  // Agora ela sempre impede o scroll do body quando uma imagem é aberta.
  const openModal = (image, index) => {
    setSelectedImage(image)
    setCurrentIndex(index)
    document.body.style.overflow = 'hidden'
  }

  // CORREÇÃO: Simplificação da função closeModal
  // Agora ela sempre restaura o scroll do body quando a imagem é fechada.
  const closeModal = () => {
    setSelectedImage(null)
    document.body.style.overflow = 'unset'
  }

  // CORREÇÃO: Ajuste na função para fechar a galeria mobile
  const closeMobileGallery = () => {
    setShowAllImagesMobile(false)
    document.body.style.overflow = 'unset' // Restaura o scroll
    const gallerySection = document.getElementById('galeria')
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // CORREÇÃO: Ajuste na função para abrir o carrossel/galeria completa
  const openCarousel = () => {
    document.body.style.overflow = 'hidden' // Impede o scroll do body
    if (isMobile) {
      window.scrollTo(0, 0)
      setShowAllImagesMobile(true)
    } else {
      setShowAllImages(true)
    }
  }

  // CORREÇÃO: Ajuste na função para fechar o carrossel desktop
  const closeCarousel = () => {
    setShowAllImages(false)
    document.body.style.overflow = 'unset' // Restaura o scroll
  }

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % filteredImages.length
    setCurrentIndex(nextIndex)
    setSelectedImage(filteredImages[nextIndex])
  }

  const prevImage = () => {
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length
    setCurrentIndex(prevIndex)
    setSelectedImage(filteredImages[prevIndex])
  }

  const getCategoryColor = (categoryName) => {
    const colors = {
      'Unidades Hidráulicas': 'bg-blue-100 text-blue-800 border-blue-200',
      'Cilindros': 'bg-green-100 text-green-800 border-green-200',
      'Bombas': 'bg-orange-100 text-orange-800 border-orange-200',
      'Válvulas': 'bg-purple-100 text-purple-800 border-purple-200',
      'Tubulações': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Projetos': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Testes': 'bg-red-100 text-red-800 border-red-200',
      'Equipe': 'bg-pink-100 text-pink-800 border-pink-200'
    }
    return colors[categoryName] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  if (loadingImages || loadingCategories) {
    return <div className="text-center py-20">{t('gallery.loading','Carregando galeria...')}</div>
  }

  if (categoriesError) {
    return <div className="text-center py-20 text-red-500">Erro ao carregar categorias: {categoriesError.message}</div>
  }

  return (
    <section id="galeria" className="py-20 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
      {/* ... O resto do seu JSX permanece o mesmo ... */}
      {/* O código JSX abaixo não precisa de alterações, pois a lógica de controle de estado já foi corrigida acima. */}
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-6 py-2 rounded-full mb-6">
            <Camera className="mr-2" size={20} />
            <span className="font-semibold">{t('gallery.badge','Nossos Trabalhos')}</span>
          </div>
          <h2 className="text-5xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            {t('gallery.title','Galeria de Fotos')}
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {t('gallery.subtitle','Conheça alguns dos nossos trabalhos e projetos realizados. Cada imagem representa nossa dedicação à excelência em automação industrial.')}
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12 animate-fade-in-up">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Filter className="mr-2 text-blue-600" size={20} />
                {t('gallery.filterByCategory','Filtrar por categoria')}
              </h3>
              <span className="text-sm text-gray-600">
                {filteredImages.length} {filteredImages.length === 1 ? t('gallery.photo','foto') : t('gallery.photos','fotos')}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {allCategories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {(() => {
            if (filteredImages.length === 0) {
              return (
                <div className="col-span-full text-center py-8">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-gray-600">Nenhuma imagem encontrada</p>
                  <p className="text-sm text-gray-500">Total de imagens: {images.length}</p>
                  <p className="text-sm text-gray-500">Categoria selecionada: {selectedCategory}</p>
                  <p className="text-sm text-gray-500">Loading Images: {loadingImages ? 'Sim' : 'Não'}</p>
                  <p className="text-sm text-gray-500">Loading Categories: {loadingCategories ? 'Sim' : 'Não'}</p>
                </div>
              )
            } else {
              const imagesToShow = isMobile && showAllImagesMobile 
                ? filteredImages 
                : filteredImages.slice(0, IMAGES_LIMIT)
              
              return imagesToShow.map((image, index) => {
                return (
                  <div 
                    key={image.id}
                    className="group cursor-pointer overflow-hidden rounded-2xl aspect-square shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => openModal(image, index)}
                  >
                    <div className="relative h-full bg-gray-100">
                      <img 
                        src={image.image_url} 
                        alt={image.title} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        style={{ minHeight: '200px' }}
                        onError={(e) => {
                          console.error('❌ Erro ao carregar imagem:', {
                            title: image.title,
                            url: image.image_url,
                            error: e.target.error,
                            naturalWidth: e.target.naturalWidth,
                            naturalHeight: e.target.naturalHeight,
                            currentSrc: e.target.currentSrc
                          })
                          if (e.target.error && e.target.error.message && e.target.error.message.includes('__cf_bm')) {
                            console.log('ℹ️ Erro de cookie Cloudflare ignorado - normal para imagens do Supabase')
                            return
                          }
                          e.target.style.display = 'none'
                          const placeholder = document.createElement('div')
                          placeholder.className = 'absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500 text-4xl'
                          placeholder.innerHTML = '📷'
                          e.target.parentNode.appendChild(placeholder)
                        }}
                      />
                      <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(fetchedCategories.find(cat => cat.id === image.category)?.name || image.category)} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                        {fetchedCategories.find(cat => cat.id === image.category)?.name || image.category}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end">
                        <div className="p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="font-bold text-sm mb-1">{image.title}</h3>
                          <p className="text-xs opacity-90 line-clamp-2">{image.description}</p>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                )
              })
            }
          })()}
        </div>

        {filteredImages.length > IMAGES_LIMIT && !showAllImagesMobile && (
          <div className="text-center mb-16 animate-fade-in-up">
            <button
              onClick={openCarousel}
              className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 mx-auto"
            >
              <span>
                {`Ver todas as ${filteredImages.length} fotos`}
              </span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        )}

        {filteredImages.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-6xl mb-6">📷</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('gallery.emptyTitle','Nenhuma foto encontrada')}</h3>
            <p className="text-gray-600 mb-6">
              {t('gallery.emptySubtitle','Não há fotos na categoria selecionada. Tente selecionar outra categoria.')}
            </p>
            <button
              onClick={() => setSelectedCategory(ALL_KEY)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-300"
            >
              {t('gallery.viewAll','Ver Todas as Fotos')}
            </button>
          </div>
        )}

        {/* Modal Individual para Desktop e Mobile */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/95 z-[99999] flex items-center justify-center overflow-hidden"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 99999,
              backgroundColor: 'rgba(0, 0, 0, 0.95)'
            }}
          >
            <div className="relative w-full h-full flex flex-col justify-center items-center">
              {/* Close Button */}
              <button 
                onClick={closeModal}
                className="absolute top-16 right-4 text-white hover:text-gray-300 z-10 bg-black/70 hover:bg-black/90 rounded-full p-3 transition-all duration-300 shadow-lg"
                style={{ zIndex: 100000 }}
              >
                <X size={24} />
              </button>

              {/* Close Button - Parte inferior (adicional para mobile) */}
              <button 
                onClick={closeModal}
                className="absolute bottom-24 left-1/2 transform -translate-x-1/2 text-white hover:text-gray-300 z-10 bg-black/70 hover:bg-black/90 rounded-full px-4 py-2 transition-all duration-300 shadow-lg text-sm font-semibold"
                style={{ zIndex: 100000 }}
              >
                Fechar
              </button>

              {/* Navigation Buttons */}
              {filteredImages.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-3 transition-colors duration-300"
                    style={{ zIndex: 100000 }}
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-3 transition-colors duration-300"
                    style={{ zIndex: 100000 }}
                  >
                    <ChevronRight size={28} />
                  </button>
                </>
              )}

              {/* Image Container - Ocupa toda a tela */}
              <div 
                className="w-full h-full flex items-center justify-center"
                style={{
                  width: '100vw',
                  height: '100vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem'
                }}
              >
                <img 
                  src={selectedImage.image_url} 
                  alt={selectedImage.title} 
                  className="max-w-full max-h-full object-contain"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    borderRadius: '0.5rem'
                  }}
                  onError={(e) => {
                    if (e.target.error && e.target.error.message && e.target.error.message.includes('__cf_bm')) {
                      return
                    }
                    console.error('❌ Erro ao carregar imagem no modal:', {
                      title: selectedImage.title,
                      url: selectedImage.image_url
                    })
                  }}
                />
              </div>

              {/* Image Info - Fixo na parte inferior */}
              <div 
                className="absolute bottom-4 left-4 right-4 text-white text-center bg-black/50 rounded-lg p-4 backdrop-blur-sm"
                style={{ zIndex: 100000 }}
              >
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border mb-2 ${getCategoryColor(fetchedCategories.find(cat => cat.id === selectedImage.category)?.name || selectedImage.category)}`}>
                  {fetchedCategories.find(cat => cat.id === selectedImage.category)?.name || selectedImage.category}
                </div>
                <h3 className="text-lg font-bold mb-1">{selectedImage.title}</h3>
                <p className="text-gray-300 text-sm mb-2">{selectedImage.description}</p>
                <p className="text-xs text-gray-400">
                  {currentIndex + 1} de {filteredImages.length} fotos
                  {selectedCategory !== ALL_KEY && (
                    <span> em {fetchedCategories.find(cat => cat.id === selectedCategory)?.name || selectedCategory}</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}



        {/* Carrossel Completo - Apenas para Desktop */}
        {showAllImages && !isMobile && (
          <div 
            className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-2 sm:p-4 animate-fade-in overflow-hidden"
          >
            <div className="relative w-full h-full max-w-7xl flex flex-col">
              <div className="flex items-center justify-between mb-4 sm:mb-6 text-white">
                <h2 className="text-lg sm:text-2xl font-bold">
                  Galeria Completa - {filteredImages.length} fotos
                  {selectedCategory !== ALL_KEY && (
                    <span className="text-blue-400 ml-1 sm:ml-2 text-sm sm:text-base">
                      ({fetchedCategories.find(cat => cat.id === selectedCategory)?.name || selectedCategory})
                    </span>
                  )}
                </h2>
                <button 
                  onClick={closeCarousel}
                  className="text-white hover:text-gray-300 bg-black/50 rounded-full p-2 sm:p-3 transition-colors duration-300"
                >
                  <X size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto -webkit-overflow-scrolling-touch">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4 pb-4">
                  {filteredImages.map((image, index) => (
                    <div 
                      key={image.id}
                      className="group cursor-pointer overflow-hidden rounded-lg sm:rounded-xl aspect-square shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105"
                      onClick={() => openModal(image, index)}
                    >
                      <div className="relative h-full bg-gray-800">
                        <img 
                          src={image.image_url} 
                          alt={image.title} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            if (e.target.error && e.target.error.message && e.target.error.message.includes('__cf_bm')) {
                              console.log('ℹ️ Erro de cookie Cloudflare ignorado - normal para imagens do Supabase')
                              return
                            }
                            console.error('❌ Erro ao carregar imagem no carrossel:', {
                              title: image.title,
                              url: image.image_url
                            })
                          }}
                        />
                        <div className={`absolute top-1 sm:top-2 left-1 sm:left-2 px-1 sm:px-2 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(fetchedCategories.find(cat => cat.id === image.category)?.name || image.category)} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                          {fetchedCategories.find(cat => cat.id === image.category)?.name || image.category}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end">
                          <div className="p-2 sm:p-3 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <h3 className="font-bold text-xs sm:text-sm mb-1">{image.title}</h3>
                            <p className="text-xs opacity-90 line-clamp-2">{image.description}</p>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 sm:mt-6 text-center text-white">
                <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 px-2">
                  Clique em qualquer imagem para visualizá-la em tamanho maior
                </p>
                <button
                  onClick={closeCarousel}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-4 sm:px-6 py-2 rounded-lg transition-colors duration-300 text-sm sm:text-base"
                >
                  Fechar Galeria
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Mobile - Visualização Completa */}
        {isMobile && showAllImagesMobile && (
          <div className="fixed inset-0 bg-white z-[9999] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Galeria Completa - {filteredImages.length} fotos
                  </h3>
                  {selectedCategory !== ALL_KEY && (
                    <p className="text-sm text-gray-600">
                      Categoria: {fetchedCategories.find(cat => cat.id === selectedCategory)?.name || selectedCategory}
                    </p>
                  )}
                </div>
                <button 
                  onClick={closeMobileGallery}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full p-2 transition-colors duration-300"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredImages.map((image, index) => (
                  <div 
                    key={image.id}
                    className="group cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                    onClick={() => openModal(image, index)}
                  >
                    <div className="relative aspect-square bg-gray-100">
                      <img 
                        src={image.image_url} 
                        alt={image.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          if (e.target.error && e.target.error.message && e.target.error.message.includes('__cf_bm')) {
                            return
                          }
                          e.target.style.display = 'none'
                          const placeholder = document.createElement('div')
                          placeholder.className = 'absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500 text-2xl'
                          placeholder.innerHTML = '📷'
                          e.target.parentNode.appendChild(placeholder)
                        }}
                      />
                      <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(fetchedCategories.find(cat => cat.id === image.category)?.name || image.category)}`}>
                        {fetchedCategories.find(cat => cat.id === image.category)?.name || image.category}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end">
                        <div className="p-3 text-white w-full">
                          <h3 className="font-bold text-sm mb-1 line-clamp-1">{image.title}</h3>
                          <p className="text-xs opacity-90 line-clamp-2">{image.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 border-t border-gray-200 px-4 py-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Clique em qualquer foto para visualizá-la em tamanho maior
                </p>
                <button
                  onClick={closeMobileGallery}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-300"
                >
                  Fechar Galeria
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center animate-fade-in-up">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl p-12 max-w-4xl mx-auto border border-blue-100">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-6 w-24 h-24 mx-auto mb-8 flex items-center justify-center">
              <Camera className="text-white" size={40} />
            </div>
            
            <h3 className="text-3xl font-bold text-gray-800 mb-6">
              {t('gallery.ctaTitle','Quer ver seu projeto aqui?')}
            </h3>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {t('gallery.ctaSubtitle','Entre em contato conosco e descubra como podemos transformar suas necessidades em soluções eficientes de automação industrial.')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                onClick={() => window.location.href = '/orcamento'}
              >
                <span>{t('gallery.startProject','Iniciar Projeto')}</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button 
                className="group border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                onClick={() => window.open('https://www.instagram.com/fhd_automacao?igsh=MXM5NzB4ZWYzZXl2cw==', '_blank' )}
              >
                <span>{t('gallery.seeMore','Ver Mais Projetos')}</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Gallery
