import { useState, useEffect } from 'react'
import { Search, Filter, Package, ArrowRight, CheckCircle, X } from 'lucide-react'
import { productsAPI } from '../../api/products'
import { useProductCategories } from '../../hooks/useCategories'
import { useI18n } from '@/i18n/index.jsx'

const Products = ({ productsData = null, productCategories = null }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const { t } = useI18n()
  const ALL_KEY = '__ALL__'
  const [selectedCategory, setSelectedCategory] = useState(ALL_KEY)
  const [products, setProducts] = useState(productsData || [])
  const [loadingProducts, setLoadingProducts] = useState(!productsData)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const { categories: fetchedCategoriesHook, loading: loadingCategoriesHook, error: categoriesErrorHook } = useProductCategories({ initialData: productCategories, enabled: !productCategories })
  const fetchedCategories = productCategories || fetchedCategoriesHook
  const loadingCategories = productCategories ? false : loadingCategoriesHook
  const categoriesError = productCategories ? null : categoriesErrorHook

  useEffect(() => {
    // Se productsData foi passado como prop, usar ele
    if (productsData) {
      console.log('📦 Products: Usando productsData da prop:', productsData.length)
      setProducts(productsData)
      setLoadingProducts(false)
      return
    }
    
    // Se não, buscar do API
    const fetchProducts = async () => {
      try {
        console.log('📦 Products: Buscando produtos da API...')
        const data = await productsAPI.getAll()
        setProducts(data)
      } catch (error) {
        console.error('❌ Products: Erro ao buscar produtos:', error)
        setProducts([])
      } finally {
        setLoadingProducts(false)
      }
    }
    fetchProducts()
  }, [productsData])

  // Obter apenas as categorias que realmente existem nos produtos
  const usedCategoryIds = [...new Set(products.map(prod => prod.category))]
  const usedCategories = fetchedCategories.filter(cat => usedCategoryIds.includes(cat.id))
  const allCategories = [{ id: ALL_KEY, label: t('common.all','Todos') }, ...usedCategories.map(cat => ({ id: cat.id, label: cat.name }))]

  // Debug logs
  console.log('🔍 Debug Products:', {
    totalProducts: products.length,
    usedCategoryIds,
    usedCategories: usedCategories.map(c => ({ id: c.id, name: c.name })),
    allCategories: allCategories.map(c => ({ id: c.id, label: c.label })),
    selectedCategory,
    searchTerm
  })

  // Função para remover acentos e normalizar texto
  const normalizeText = (text) => {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .toLowerCase()
      .trim()
  }

  const filteredProducts = products.filter(product => {
    const normalizedSearchTerm = normalizeText(searchTerm)
    const normalizedName = normalizeText(product.name)
    const normalizedDescription = normalizeText(product.description)
    
    const matchesSearch = normalizedName.includes(normalizedSearchTerm) ||
                         normalizedDescription.includes(normalizedSearchTerm) ||
                         product.features.some(feature => 
                           normalizeText(feature).includes(normalizedSearchTerm)
                         )
    
    const matchesCategory = selectedCategory === ALL_KEY || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  console.log('🔍 Filtered Products:', {
    filteredCount: filteredProducts.length,
    products: filteredProducts.map(p => ({ id: p.id, name: p.name, category: p.category }))
  })

  const getCategoryColor = (categoryName) => {
    const colors = {
      'Sistemas Hidráulicos': 'bg-blue-100 text-blue-800 border-blue-200',
      'Atuadores': 'bg-green-100 text-green-800 border-green-200',
      'Controle': 'bg-purple-100 text-purple-800 border-purple-200',
      'Bombas': 'bg-orange-100 text-orange-800 border-orange-200',
      'Motores': 'bg-red-100 text-red-800 border-red-200',
      'Armazenamento': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Sistemas Compactos': 'bg-indigo-100 text-indigo-800 border-indigo-200'
    }
    return colors[categoryName] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const openImageModal = (product) => {
    setSelectedProduct(product)
  }

  const closeImageModal = () => {
    setSelectedProduct(null)
  }

  if (loadingProducts || loadingCategories) {
    return <div className="text-center py-20">{t('products.loading','Carregando produtos...')}</div>
  }

  if (categoriesError) {
    return <div className="text-center py-20 text-red-500">Erro ao carregar categorias: {categoriesError.message}</div>
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
            <span className="font-semibold">{t('products.badge','Linha Completa de Produtos')}</span>
          </div>
          <h2 className="text-5xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            {t('products.title','Nossos Produtos')}
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {t('products.subtitle','Oferecemos uma linha completa de produtos hidráulicos e pneumáticos de alta qualidade para atender às mais diversas necessidades industriais com tecnologia de ponta.')}
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
                placeholder={t('products.searchPlaceholder','Buscar produtos...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm md:text-base"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Filter Categories */}
            <div className="mt-6 pt-6 border-t border-gray-200 animate-fade-in">
              <h4 className="text-sm font-semibold text-gray-700 mb-4">{t('products.filterByCategory','Filtrar por categoria:')}</h4>
              <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 md:gap-3">
                {allCategories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 ${
                      selectedCategory === category.id
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-8 animate-fade-in">
          <p className="text-gray-600">
            {filteredProducts.length === products.length && !searchTerm ? (
              // Quando não há filtros aplicados
              `Mostrando todos os ${products.length} produtos`
            ) : (
              // Quando há filtros aplicados
              <>
                {`Mostrando ${filteredProducts.length} de ${products.length} produtos`}
                {selectedCategory !== ALL_KEY && (
                  <span> na categoria <span className="font-semibold text-blue-600">"{fetchedCategories.find(cat => cat.id === selectedCategory)?.name || selectedCategory}"</span></span>
                )}
                {searchTerm && (
                  <span> para <span className="font-semibold text-blue-600">"{searchTerm}"</span></span>
                )}
              </>
            )}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 mb-16">
          {filteredProducts.map((product, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2 hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
                             <div className="bg-white h-48 md:h-56 flex items-center justify-center relative overflow-hidden border border-gray-200">
                 {product.image_url ? (
                   <img 
                     src={product.image_url} 
                     alt={product.name}
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 bg-white"
                     onError={(e) => {
                       e.target.style.display = 'none';
                       e.target.nextSibling.style.display = 'flex';
                     }}
                   />
                 ) : null}
                <div className={`text-gray-400 text-4xl md:text-6xl group-hover:scale-105 transition-transform duration-300 ${product.image_url ? 'hidden' : 'flex'}`}>
                  ⚙️
                </div>
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
                             <div className="p-5 md:p-7">
                <div className={`inline-block px-2 md:px-3 py-1 rounded-full text-xs font-semibold mb-3 border ${getCategoryColor(fetchedCategories.find(cat => cat.id === product.category)?.name || product.category)}`}>
                  {fetchedCategories.find(cat => cat.id === product.category)?.name || product.category}
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
                    <div className="flex items-center justify-center flex-1">
                      {product.image_url && (
                        <button 
                          className="group/photo flex items-center space-x-1 text-gray-600 hover:text-blue-600 font-semibold text-sm transition-colors duration-300"
                          onClick={() => openImageModal(product)}
                        >
                          <span>Abrir foto</span>
                        </button>
                      )}
                    </div>
                    <button 
                      className="group/btn flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors duration-300"
                      onClick={() => window.location.href = '/orcamento'}
                    >
                      <span>{t('products.consult','Consultar')}</span>
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
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('products.emptyTitle','Nenhum produto encontrado')}</h3>
            <p className="text-gray-600 mb-6">
              {t('products.emptySubtitle','Tente ajustar os filtros ou termo de busca para encontrar o que procura.')}
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory(ALL_KEY)
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-300"
            >
              {t('products.clearFilters','Limpar Filtros')}
            </button>
          </div>
        )}

                 {/* Image Modal */}
         {selectedProduct && (
           <div className="fixed inset-0 bg-black/80 z-[9990] flex items-center justify-center p-4 animate-fade-in">
             <div className="relative max-w-4xl w-full">
               {/* Close Button */}
               <button 
                 onClick={closeImageModal}
                 className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-2 transition-colors duration-300"
               >
                 <X size={24} />
               </button>

               {/* Image */}
               <div className="rounded-2xl aspect-video flex items-center justify-center shadow-2xl overflow-hidden bg-white">
                 <img 
                   src={selectedProduct.image_url} 
                   alt={selectedProduct.name} 
                   className="w-full h-full object-contain" 
                 />
               </div>

               {/* Product Info */}
               <div className="text-white mt-6 text-center">
                 <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border mb-4 ${getCategoryColor(fetchedCategories.find(cat => cat.id === selectedProduct.category)?.name || selectedProduct.category)}`}>
                   {fetchedCategories.find(cat => cat.id === selectedProduct.category)?.name || selectedProduct.category}
                 </div>
                 <h3 className="text-3xl font-bold mb-3">{selectedProduct.name}</h3>
                 <p className="text-gray-300 text-lg mb-4">{selectedProduct.description}</p>
                 <p className="text-sm text-gray-400">{selectedProduct.price}</p>
               </div>
             </div>
           </div>
         )}

         {/* CTA */}
         <div className="text-center animate-fade-in-up">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl p-12 max-w-4xl mx-auto border border-blue-100">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-6 w-24 h-24 mx-auto mb-8 flex items-center justify-center">
              <Package className="text-white" size={40} />
            </div>
            
            <h3 className="text-3xl font-bold text-gray-800 mb-6">
              {t('products.ctaTitle','Não encontrou o que procura?')}
            </h3>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {t('products.ctaSubtitle','Temos uma ampla gama de produtos e soluções personalizadas. Entre em contato conosco para encontrar a solução ideal para sua necessidade.')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                onClick={() => window.location.href = '/orcamento'}
              >
                <span>{t('products.consultSpecialist','Consultar Especialista')}</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button className="group border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
                <span>{t('products.fullCatalog','Catálogo Completo')}</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Products


