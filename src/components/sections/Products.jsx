import { useState, useEffect } from 'react'
import { Search, Filter, Package, ArrowRight, CheckCircle, X } from 'lucide-react'
import { productsAPI } from '../../api/products'

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsAPI.getAll()
        setProducts(data)
      } catch (error) {
        console.error('Erro ao carregar produtos:', error)
        // Fallback para dados estáticos em caso de erro
        setProducts(fallbackProducts)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const fallbackProducts = [
    {
      name: "Unidade Hidráulica",
      category: "Sistemas Hidráulicos",
      description: "Unidades hidráulicas completas para diversas aplicações industriais",
      features: ["Alta Pressão", "Controle Preciso", "Baixo Ruído"],
      price: "Sob Consulta"
    },
    {
      name: "Cilindro Hidráulico",
      category: "Atuadores",
      description: "Cilindros hidráulicos de alta performance e durabilidade",
      features: ["Vedação Dupla", "Resistente", "Longa Vida Útil"],
      price: "Sob Consulta"
    },
    {
      name: "Válvulas Proporcionais",
      category: "Controle",
      description: "Válvulas proporcionais para controle preciso de fluxo e pressão",
      features: ["Controle Eletrônico", "Alta Precisão", "Resposta Rápida"],
      price: "Sob Consulta"
    },
    {
      name: "Válvulas Direcionais",
      category: "Controle",
      description: "Válvulas direcionais para controle de direção do fluxo hidráulico",
      features: ["4 Vias", "Acionamento Manual", "Vedação Perfeita"],
      price: "Sob Consulta"
    },
    {
      name: "Bombas de Engrenagem",
      category: "Bombas",
      description: "Bombas de engrenagem robustas e eficientes",
      features: ["Alto Rendimento", "Baixa Manutenção", "Operação Silenciosa"],
      price: "Sob Consulta"
    },
    {
      name: "Bombas de Palhetas Variáveis",
      category: "Bombas",
      description: "Bombas de palhetas com vazão variável para economia de energia",
      features: ["Vazão Variável", "Economia de Energia", "Controle Automático"],
      price: "Sob Consulta"
    },
    {
      name: "Bombas de Pistões",
      category: "Bombas",
      description: "Bombas de pistões para aplicações de alta pressão",
      features: ["Alta Pressão", "Durabilidade", "Eficiência Máxima"],
      price: "Sob Consulta"
    },
    {
      name: "Motor Hidráulico",
      category: "Motores",
      description: "Motores hidráulicos de alta eficiência e torque",
      features: ["Alto Torque", "Velocidade Variável", "Baixa Manutenção"],
      price: "Sob Consulta"
    },
    {
      name: "Acumuladores Hidráulicos",
      category: "Armazenamento",
      description: "Acumuladores para armazenamento de energia hidráulica",
      features: ["Armazenamento Seguro", "Resposta Rápida", "Longa Durabilidade"],
      price: "Sob Consulta"
    },
    {
      name: "Comandos Hidráulicos",
      category: "Controle",
      description: "Sistemas de comando para operação hidráulica",
      features: ["Interface Intuitiva", "Controle Preciso", "Segurança Operacional"],
      price: "Sob Consulta"
    },
    {
      name: "Mini Unidade Hidráulica",
      category: "Sistemas Compactos",
      description: "Unidades hidráulicas compactas da Bucher Hydraulics",
      features: ["Design Compacto", "Fácil Instalação", "Alta Performance"],
      price: "Sob Consulta"
    }
  ]

  const categories = ['Todos', ...new Set(products.map(product => product.category))]

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category) => {
    const colors = {
      'Sistemas Hidráulicos': 'bg-blue-100 text-blue-800 border-blue-200',
      'Atuadores': 'bg-green-100 text-green-800 border-green-200',
      'Controle': 'bg-purple-100 text-purple-800 border-purple-200',
      'Bombas': 'bg-orange-100 text-orange-800 border-orange-200',
      'Motores': 'bg-red-100 text-red-800 border-red-200',
      'Armazenamento': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Sistemas Compactos': 'bg-indigo-100 text-indigo-800 border-indigo-200'
    }
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border border-blue-400 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-blue-300 rotate-12 animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-6 py-2 rounded-full mb-6">
            <Package className="mr-2" size={20} />
            <span className="font-semibold">Linha Completa de Produtos</span>
          </div>
          <h2 className="text-5xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Nossos Produtos
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Oferecemos uma <span className="font-bold text-blue-600">linha completa</span> de produtos hidráulicos e pneumáticos de alta qualidade 
            para atender às mais diversas necessidades industriais com <span className="font-semibold text-blue-600">tecnologia de ponta</span>.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-12 animate-fade-in-up">
          <div className="flex flex-col gap-4">
            {/* Search Input */}
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm md:text-base"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                isFilterOpen ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter size={20} />
              <span>Filtros</span>
            </button>
          </div>

          {/* Filter Categories */}
          {isFilterOpen && (
            <div className="mt-6 pt-6 border-t border-gray-200 animate-fade-in">
              <h4 className="text-sm font-semibold text-gray-700 mb-4">Filtrar por categoria:</h4>
              <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 md:gap-3">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 ${
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
          )}
        </div>

        {/* Results Counter */}
        <div className="mb-8 animate-fade-in">
          <p className="text-gray-600">
            Mostrando <span className="font-semibold text-blue-600">{filteredProducts.length}</span> de {products.length} produtos
            {selectedCategory !== 'Todos' && (
              <span> na categoria <span className="font-semibold text-blue-600">"{selectedCategory}"</span></span>
            )}
            {searchTerm && (
              <span> para <span className="font-semibold text-blue-600">"{searchTerm}"</span></span>
            )}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mb-16">
          {filteredProducts.map((product, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2 hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 h-40 md:h-48 flex items-center justify-center relative overflow-hidden">
                <div className="text-white text-4xl md:text-6xl group-hover:scale-110 transition-transform duration-300">⚙️</div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-4 md:p-6">
                <div className={`inline-block px-2 md:px-3 py-1 rounded-full text-xs font-semibold mb-3 border ${getCategoryColor(product.category)}`}>
                  {product.category}
                </div>
                
                <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {product.name}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {product.description}
                </p>
                
                {/* Features */}
                <div className="space-y-2 mb-4">
                  {product.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <CheckCircle className="text-green-500 flex-shrink-0" size={14} />
                      <span className="text-xs text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {/* Price and CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm font-semibold text-blue-600">{product.price}</span>
                  <button className="group/btn flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors duration-300">
                    <span>Consultar</span>
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Nenhum produto encontrado</h3>
            <p className="text-gray-600 mb-6">
              Tente ajustar os filtros ou termo de busca para encontrar o que procura.
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('Todos')
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-300"
            >
              Limpar Filtros
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="text-center animate-fade-in-up">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl p-12 max-w-4xl mx-auto border border-blue-100">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-6 w-24 h-24 mx-auto mb-8 flex items-center justify-center">
              <Package className="text-white" size={40} />
            </div>
            
            <h3 className="text-3xl font-bold text-gray-800 mb-6">
              Não encontrou o que procura?
            </h3>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Temos uma <span className="font-semibold text-blue-600">ampla gama de produtos</span> e soluções personalizadas. 
              Entre em contato conosco para encontrar a <span className="font-semibold text-blue-600">solução ideal</span> para sua necessidade.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                <span>Consultar Especialista</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button className="group border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
                <span>Catálogo Completo</span>
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
      `}</style>
    </section>
  )
}

export default Products

