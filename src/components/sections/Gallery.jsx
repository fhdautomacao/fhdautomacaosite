import { useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Placeholder images - in a real implementation, these would be actual images
  const images = [
    {
      id: 1,
      title: "Unidade Hidráulica em Operação",
      description: "Sistema hidráulico completo instalado em cliente",
      thumbnail: "🏭"
    },
    {
      id: 2,
      title: "Manutenção de Cilindro",
      description: "Serviço de manutenção preventiva em cilindro hidráulico",
      thumbnail: "🔧"
    },
    {
      id: 3,
      title: "Instalação de Tubulação",
      description: "Instalação especializada de tubulação hidráulica",
      thumbnail: "🔩"
    },
    {
      id: 4,
      title: "Bomba Hidráulica",
      description: "Bomba hidráulica de alta pressão recém reparada",
      thumbnail: "⚙️"
    },
    {
      id: 5,
      title: "Válvulas de Controle",
      description: "Sistema de válvulas proporcionais instalado",
      thumbnail: "🎛️"
    },
    {
      id: 6,
      title: "Projeto Personalizado",
      description: "Solução customizada para cliente industrial",
      thumbnail: "📐"
    },
    {
      id: 7,
      title: "Teste de Qualidade",
      description: "Teste de performance em unidade hidráulica",
      thumbnail: "📊"
    },
    {
      id: 8,
      title: "Equipe Técnica",
      description: "Nossa equipe especializada em ação",
      thumbnail: "👥"
    }
  ]

  const openModal = (image, index) => {
    setSelectedImage(image)
    setCurrentIndex(index)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % images.length
    setCurrentIndex(nextIndex)
    setSelectedImage(images[nextIndex])
  }

  const prevImage = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length
    setCurrentIndex(prevIndex)
    setSelectedImage(images[prevIndex])
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Galeria de Fotos</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conheça alguns dos nossos trabalhos e projetos realizados. 
            Cada imagem representa nossa dedicação à excelência em automação industrial.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div 
              key={image.id}
              className="relative group cursor-pointer overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 aspect-square"
              onClick={() => openModal(image, index)}
            >
              <div className="absolute inset-0 flex items-center justify-center text-white text-4xl">
                {image.thumbnail}
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-end">
                <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-semibold text-sm mb-1">{image.title}</h3>
                  <p className="text-xs opacity-90">{image.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full">
              {/* Close Button */}
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              >
                <X size={32} />
              </button>

              {/* Navigation Buttons */}
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
              >
                <ChevronLeft size={48} />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
              >
                <ChevronRight size={48} />
              </button>

              {/* Image */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg aspect-video flex items-center justify-center">
                <div className="text-white text-8xl">{selectedImage.thumbnail}</div>
              </div>

              {/* Image Info */}
              <div className="text-white mt-4 text-center">
                <h3 className="text-2xl font-bold mb-2">{selectedImage.title}</h3>
                <p className="text-gray-300">{selectedImage.description}</p>
                <p className="text-sm text-gray-400 mt-2">
                  {currentIndex + 1} de {images.length}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-gray-50 rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Quer ver seu projeto aqui?
            </h3>
            <p className="text-gray-600 mb-6">
              Entre em contato conosco e descubra como podemos transformar suas necessidades 
              em soluções eficientes de automação industrial.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
              Iniciar Projeto
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Gallery

