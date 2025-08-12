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
  const IMAGES_LIMIT = 8
  const { categories: fetchedCategoriesHook, loading: loadingCategoriesHook, error: categoriesErrorHook } = useGalleryCategories({ initialData: galleryCategories, enabled: !galleryCategories })
  const fetchedCategories = galleryCategories || fetchedCategoriesHook
  const loadingCategories = galleryCategories ? false : loadingCategoriesHook
  const categoriesError = galleryCategories ? null : categoriesErrorHook

  useEffect(() => {
    console.log('🔄 Gallery useEffect executado')
    console.log('📊 Estado atual:', {
      galleryItemsData: galleryItemsData?.length || 0,
      images: images.length,
      loadingImages,
      selectedCategory
    })
    
    if (galleryItemsData) {
      console.log('📷 Gallery: Usando galleryItemsData da prop:', galleryItemsData.length)
      console.log('📷 Gallery: Dados recebidos:', galleryItemsData)
      setImages(galleryItemsData)
      setLoadingImages(false)
      return
    }
    
    const fetchGalleryItems = async () => {
      try {
        console.log('📷 Gallery: Buscando imagens da API...')
        const data = await galleryAPI.getAll()
        console.log('📷 Gallery: Imagens carregadas da API:', data.length)
        console.log('📷 Gallery: Dados completos:', data)
        
        // Verificar URLs das imagens
        if (data.length > 0) {
          console.log('🔍 Verificando URLs das imagens:')
          data.forEach((item, index) => {
            console.log(`  ${index + 1}. ${item.title}: ${item.image_url}`)
            console.log(`     - ID: ${item.id}`)
            console.log(`     - Category: ${item.category}`)
            console.log(`     - Is Active: ${item.is_active}`)
            
            // Testar se a URL é válida
            if (item.image_url) {
              const img = new Image()
              img.onload = () => console.log(`✅ Imagem ${item.title} carregada com sucesso`)
              img.onerror = () => console.error(`❌ Erro ao carregar imagem ${item.title}: ${item.image_url}`)
              img.src = item.image_url
            } else {
              console.warn(`⚠️ Imagem ${item.title} não tem URL`)
            }
          })
        } else {
          console.warn('⚠️ Nenhuma imagem retornada da API')
        }
        
        setImages(data)
        console.log('✅ Estado images atualizado com:', data.length, 'imagens')
      } catch (error) {
        console.error('❌ Gallery: Erro ao buscar imagens:', error)
        console.error('❌ Detalhes do erro:', {
          message: error.message,
          stack: error.stack
        })
        setImages([])
      } finally {
        setLoadingImages(false)
        console.log('✅ Loading finalizado')
      }
    }
    fetchGalleryItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [galleryItemsData])

  // Obter apenas as categorias que realmente existem nas imagens
  console.log('🔍 Processando categorias...')
  console.log('📊 Imagens disponíveis:', images.map(img => ({ id: img.id, title: img.title, category: img.category })))
  
  const usedCategoryIds = [...new Set(images.map(img => img.category))]
  console.log('📊 IDs de categorias usadas:', usedCategoryIds)
  
  const usedCategories = fetchedCategories.filter(cat => usedCategoryIds.includes(cat.id))
  console.log('📊 Categorias filtradas:', usedCategories.map(c => ({ id: c.id, name: c.name })))
  
  const allCategories = [{ id: ALL_KEY, label: t('common.all','Todos') }, ...usedCategories.map(cat => ({ id: cat.name, label: cat.name }))]
  console.log('📊 Todas as categorias:', allCategories.map(c => ({ id: c.id, label: c.label })))

  const filteredImages = selectedCategory === ALL_KEY 
    ? images 
    : images.filter(img => {
        const categoryObject = fetchedCategories.find(cat => cat.id === img.category)
        const matches = categoryObject && categoryObject.name === selectedCategory
        console.log(`🔍 Verificando imagem ${img.title}:`, {
          imgCategory: img.category,
          categoryObject: categoryObject?.name,
          selectedCategory,
          matches
        })
        return matches
      })

  // Debug logs para verificar o estado
  console.log('🔍 Gallery Debug Final:', {
    totalImages: images.length,
    selectedCategory,
    ALL_KEY,
    usedCategoryIds,
    usedCategories: usedCategories.map(c => ({ id: c.id, name: c.name })),
    allCategories: allCategories.map(c => ({ id: c.id, label: c.label })),
    filteredImagesCount: filteredImages.length,
    filteredImages: filteredImages.map(img => ({ id: img.id, title: img.title, category: img.category }))
  })

  const openModal = (image, index) => {
    setSelectedImage(image)
    setCurrentIndex(index)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  const openCarousel = () => {
    setShowAllImages(true)
  }

  const closeCarousel = () => {
    setShowAllImages(false)
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

  console.log('🎨 Gallery: Renderizando componente')
  console.log('📊 Estado de renderização:', {
    loadingImages,
    loadingCategories,
    categoriesError: categoriesError?.message,
    imagesCount: images.length,
    selectedCategory
  })

  if (loadingImages || loadingCategories) {
    console.log('⏳ Gallery: Mostrando loading...')
    return <div className="text-center py-20">{t('gallery.loading','Carregando galeria...')}</div>
  }

  if (categoriesError) {
    console.log('❌ Gallery: Erro nas categorias:', categoriesError.message)
    return <div className="text-center py-20 text-red-500">Erro ao carregar categorias: {categoriesError.message}</div>
  }

  return (
    <section id="galeria" className="py-20 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border border-blue-400 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-blue-300 rotate-12 animate-pulse delay-1000"></div>
      </div>
      
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
                   onClick={() => {
                     console.log('🔘 Categoria clicada:', {
                       categoryId: category.id,
                       categoryLabel: category.label,
                       previousSelected: selectedCategory
                     })
                     setSelectedCategory(category.id)
                   }}
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
            console.log('🎨 Renderizando grid da galeria')
            console.log('📊 Estado do grid:', {
              filteredImagesLength: filteredImages.length,
              imagesLength: images.length,
              selectedCategory,
              loadingImages,
              loadingCategories
            })
            
            if (filteredImages.length === 0) {
              console.log('⚠️ Nenhuma imagem para renderizar')
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
              // Mostrar apenas as primeiras 6 imagens
              const imagesToShow = filteredImages.slice(0, IMAGES_LIMIT)
              console.log(`✅ Renderizando ${imagesToShow.length} imagens (limitado a ${IMAGES_LIMIT})`)
              
              return imagesToShow.map((image, index) => {
                console.log(`🖼️ Renderizando imagem ${index + 1}/${imagesToShow.length}:`, {
                  id: image.id,
                  title: image.title,
                  image_url: image.image_url,
                  category: image.category
                })
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
                        onLoad={() => {
                          console.log('✅ Imagem carregada com sucesso:', {
                            title: image.title,
                            url: image.image_url,
                            naturalWidth: event.target.naturalWidth,
                            naturalHeight: event.target.naturalHeight
                          })
                        }}
                        onError={(e) => {
                          console.error('❌ Erro ao carregar imagem:', {
                            title: image.title,
                            url: image.image_url,
                            error: e.target.error,
                            naturalWidth: e.target.naturalWidth,
                            naturalHeight: e.target.naturalHeight,
                            currentSrc: e.target.currentSrc
                          })
                          console.error('🔍 Stack trace do erro:', new Error().stack)
                          e.target.style.display = 'none'
                          // Mostrar placeholder de erro
                          const placeholder = document.createElement('div')
                          placeholder.className = 'absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500 text-4xl'
                          placeholder.innerHTML = '📷'
                          e.target.parentNode.appendChild(placeholder)
                        }}
                      />
                      
                      {/* Category Badge */}
                      <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(fetchedCategories.find(cat => cat.id === image.category)?.name || image.category)} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                        {fetchedCategories.find(cat => cat.id === image.category)?.name || image.category}
                      </div>
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end">
                        <div className="p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="font-bold text-sm mb-1">{image.title}</h3>
                          <p className="text-xs opacity-90 line-clamp-2">{image.description}</p>
                        </div>
                      </div>
                      
                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                )
              })
            }
          })()}
        </div>

        {/* Ver Tudo Button */}
        {filteredImages.length > IMAGES_LIMIT && (
          <div className="text-center mb-16 animate-fade-in-up">
            <button
              onClick={openCarousel}
              className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 mx-auto"
            >
              <span>Ver todas as {filteredImages.length} fotos</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        )}

        {/* No Results */}
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

        {/* Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-white z-[9990] flex items-center justify-center p-4 animate-fade-in">
            <div className="relative max-w-6xl w-full">
              {/* Close Button */}
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-2 transition-colors duration-300"
              >
                <X size={24} />
              </button>

              {/* Navigation Buttons */}
              {filteredImages.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-3 transition-colors duration-300"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-3 transition-colors duration-300"
                  >
                    <ChevronRight size={32} />
                  </button>
                </>
              )}

              {/* Image */}
              <div className="rounded-2xl aspect-video flex items-center justify-center shadow-2xl overflow-hidden">
                <img src={selectedImage.image_url} alt={selectedImage.title} className="w-full h-full object-contain" />
              </div>

              {/* Image Info */}
              <div className="text-black mt-6 text-center">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border mb-4 ${getCategoryColor(fetchedCategories.find(cat => cat.id === selectedImage.category)?.name || selectedImage.category)}`}>
                  {fetchedCategories.find(cat => cat.id === selectedImage.category)?.name || selectedImage.category}
                </div>
                <h3 className="text-3xl font-bold mb-3">{selectedImage.title}</h3>
                <p className="text-gray-300 text-lg mb-4">{selectedImage.description}</p>
                                 <p className="text-sm text-gray-400">
                   {currentIndex + 1} de {filteredImages.length} fotos
                   {selectedCategory !== ALL_KEY && (
                     <span> em {fetchedCategories.find(cat => cat.id === selectedCategory)?.name || selectedCategory}</span>
                   )}
                 </p>
              </div>
            </div>
          </div>
        )}

        {/* Carrossel Completo */}
        {showAllImages && (
          <div className="fixed inset-0 bg-black/95 z-[9991] flex items-center justify-center p-4 animate-fade-in">
            <div className="relative max-w-7xl w-full h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 text-white">
                <h2 className="text-2xl font-bold">
                  Galeria Completa - {filteredImages.length} fotos
                  {selectedCategory !== ALL_KEY && (
                    <span className="text-blue-400 ml-2">
                      ({fetchedCategories.find(cat => cat.id === selectedCategory)?.name || selectedCategory})
                    </span>
                  )}
                </h2>
                <button 
                  onClick={closeCarousel}
                  className="text-white hover:text-gray-300 bg-black/50 rounded-full p-3 transition-colors duration-300"
                >
                  <X size={24} />
                </button>
              </div>

                             {/* Grid de Imagens */}
               <div className="flex-1 overflow-y-auto">
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                   {filteredImages.map((image, index) => (
                     <div 
                       key={image.id}
                       className="group cursor-pointer overflow-hidden rounded-xl aspect-square shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105"
                       onClick={() => {
                         setSelectedImage(image)
                         setCurrentIndex(index)
                         setShowAllImages(false)
                       }}
                     >
                       <div className="relative h-full bg-gray-800">
                         <img 
                           src={image.image_url} 
                           alt={image.title} 
                           className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                         />
                         
                         {/* Category Badge */}
                         <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(fetchedCategories.find(cat => cat.id === image.category)?.name || image.category)} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                           {fetchedCategories.find(cat => cat.id === image.category)?.name || image.category}
                         </div>
                         
                         {/* Overlay */}
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end">
                           <div className="p-3 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                             <h3 className="font-bold text-sm mb-1">{image.title}</h3>
                             <p className="text-xs opacity-90 line-clamp-2">{image.description}</p>
                           </div>
                         </div>
                         
                         {/* Hover Effect */}
                         <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>

                              {/* Footer com Botão Fechar */}
               <div className="mt-6 text-center text-white">
                 <p className="text-sm text-gray-400 mb-4">
                   Clique em qualquer imagem para visualizá-la em tamanho maior
                 </p>
                 <button
                   onClick={closeCarousel}
                   className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-300"
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
              <button className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                <span>{t('gallery.startProject','Iniciar Projeto')}</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button className="group border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
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

