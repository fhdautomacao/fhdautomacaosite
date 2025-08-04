import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X, Camera, Filter, ArrowRight } from 'lucide-react'
import { galleryAPI } from '../../api/gallery'

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const data = await galleryAPI.getAll()
        setImages(data)
      } catch (error) {
        console.error('Erro ao carregar galeria:', error)
        // Fallback para dados estáticos em caso de erro
        setImages(fallbackImages)
      } finally {
        setLoading(false)
      }
    }

    fetchGalleryItems()
  }, [])

  // Placeholder images with categories - in a real implementation, these would be actual images
  const fallbackImages = [
    {
      id: 1,
      title: "Unidade Hidráulica em Operação",
      description: "Sistema hidráulico completo instalado em cliente",
      thumbnail: "🏭",
      category: "Unidades Hidráulicas"
    },
    {
      id: 2,
      title: "Manutenção de Cilindro",
      description: "Serviço de manutenção preventiva em cilindro hidráulico",
      thumbnail: "🔧",
      category: "Cilindros"
    },
    {
      id: 3,
      title: "Instalação de Tubulação",
      description: "Instalação especializada de tubulação hidráulica",
      thumbnail: "🔩",
      category: "Tubulações"
    },
    {
      id: 4,
      title: "Bomba Hidráulica",
      description: "Bomba hidráulica de alta pressão recém reparada",
      thumbnail: "⚙️",
      category: "Bombas"
    },
    {
      id: 5,
      title: "Válvulas de Controle",
      description: "Sistema de válvulas proporcionais instalado",
      thumbnail: "🎛️",
      category: "Válvulas"
    },
    {
      id: 6,
      title: "Projeto Personalizado",
      description: "Solução customizada para cliente industrial",
      thumbnail: "📐",
      category: "Projetos"
    },
    {
      id: 7,
      title: "Teste de Qualidade",
      description: "Teste de performance em unidade hidráulica",
      thumbnail: "📊",
      category: "Testes"
    },
    {
      id: 8,
      title: "Equipe Técnica",
      description: "Nossa equipe especializada em ação",
      thumbnail: "👥",
      category: "Equipe"
    },
    {
      id: 9,
      title: "Cilindro Hidráulico Novo",
      description: "Cilindro hidráulico fabricado sob medida",
      thumbnail: "🔩",
      category: "Cilindros"
    },
    {
      id: 10,
      title: "Bomba de Pistões",
      description: "Bomba de pistões para alta pressão",
      thumbnail: "⚙️",
      category: "Bombas"
    },
    {
      id: 11,
      title: "Sistema de Válvulas",
      description: "Conjunto de válvulas direcionais instaladas",
      thumbnail: "🎛️",
      category: "Válvulas"
    },
    {
      id: 12,
      title: "Unidade Compacta",
      description: "Mini unidade hidráulica para aplicação específica",
      thumbnail: "🏭",
      category: "Unidades Hidráulicas"
    }
  ]

  const categories = ['Todos', ...new Set(images.map(img => img.category))]

  const filteredImages = selectedCategory === 'Todos' 
    ? images 
    : images.filter(img => img.category === selectedCategory)

  const openModal = (image, index) => {
    setSelectedImage(image)
    setCurrentIndex(index)
  }

  const closeModal = () => {
    setSelectedImage(null)
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

  const getCategoryColor = (category) => {
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
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  return (
    <section className="py-20 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
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
            <span className="font-semibold">Nossos Trabalhos</span>
          </div>
          <h2 className="text-5xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Galeria de Fotos
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Conheça alguns dos nossos <span className="font-bold text-blue-600">trabalhos e projetos realizados</span>. 
            Cada imagem representa nossa dedicação à <span className="font-semibold text-blue-600">excelência em automação industrial</span>.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12 animate-fade-in-up">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Filter className="mr-2 text-blue-600" size={20} />
                Filtrar por categoria
              </h3>
              <span className="text-sm text-gray-600">
                {filteredImages.length} {filteredImages.length === 1 ? 'foto' : 'fotos'}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
          {filteredImages.map((image, index) => (
            <div 
              key={image.id}
              className="group cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 aspect-square shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => openModal(image, index)}
            >
              <div className="relative h-full">
                <div className="absolute inset-0 flex items-center justify-center text-white text-4xl group-hover:scale-110 transition-transform duration-300">
                  {image.thumbnail}
                </div>
                
                {/* Category Badge */}
                <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(image.category)} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                  {image.category}
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
          ))}
        </div>

        {/* No Results */}
        {filteredImages.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-6xl mb-6">📷</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Nenhuma foto encontrada</h3>
            <p className="text-gray-600 mb-6">
              Não há fotos na categoria selecionada. Tente selecionar outra categoria.
            </p>
            <button
              onClick={() => setSelectedCategory('Todos')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-300"
            >
              Ver Todas as Fotos
            </button>
          </div>
        )}

        {/* Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fade-in">
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
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl aspect-video flex items-center justify-center shadow-2xl">
                <div className="text-white text-8xl">{selectedImage.thumbnail}</div>
              </div>

              {/* Image Info */}
              <div className="text-white mt-6 text-center">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border mb-4 ${getCategoryColor(selectedImage.category)}`}>
                  {selectedImage.category}
                </div>
                <h3 className="text-3xl font-bold mb-3">{selectedImage.title}</h3>
                <p className="text-gray-300 text-lg mb-4">{selectedImage.description}</p>
                <p className="text-sm text-gray-400">
                  {currentIndex + 1} de {filteredImages.length} fotos
                  {selectedCategory !== 'Todos' && ` em ${selectedCategory}`}
                </p>
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
              Quer ver seu projeto aqui?
            </h3>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Entre em contato conosco e descubra como podemos transformar suas necessidades 
              em <span className="font-semibold text-blue-600">soluções eficientes</span> de automação industrial.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                <span>Iniciar Projeto</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button className="group border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
                <span>Ver Mais Projetos</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  )
}

export default Gallery

