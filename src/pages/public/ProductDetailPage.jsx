import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DynamicSEO from '@/components/common/DynamicSEO'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import { productsAPI } from '@/api/products'

const ProductDetailPage = () => {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const products = await productsAPI.getAll()
        const foundProduct = products.find(p => p.slug === slug)
        setProduct(foundProduct)
      } catch (error) {
        console.error('Erro ao carregar produto:', error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchProduct()
    }
  }, [slug])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Produto não encontrado</div>
  }

  // SEO dinâmico baseado no produto
  const seoData = {
    title: `${product.name} - FHD Automação Industrial`,
    description: product.description || `Conheça o ${product.name} da FHD Automação Industrial. ${product.name} com qualidade e garantia. Solicite orçamento.`,
    keywords: `${product.name}, ${product.category}, automação industrial, hidráulica, pneumática, FHD Automação, Sumaré SP`,
    canonical_url: `https://fhdautomacao.com.br/produto/${product.slug}`,
    og_title: `${product.name} - FHD Automação Industrial`,
    og_description: product.description || `Conheça o ${product.name} da FHD Automação Industrial. Qualidade e garantia.`,
    og_image: product.image_url || 'https://fhdautomacao.com.br/og-image.jpg',
    structured_data: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.description,
      "image": product.image_url,
      "brand": {
        "@type": "Brand",
        "name": "FHD Automação Industrial"
      },
      "offers": {
        "@type": "Offer",
        "priceCurrency": "BRL",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "FHD Automação Industrial"
        }
      }
    }
  }

  return (
    <>
      <DynamicSEO pageName="product-detail" fallbackData={seoData} />
      
      <main className="min-h-screen bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <Breadcrumbs 
              customItems={[
                { path: '/produtos', name: 'Produtos' },
                { path: `/produto/${product.slug}`, name: product.name }
              ]}
            />

            {/* Produto */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                {/* Imagem */}
                <div className="md:w-1/2">
                  <img 
                    src={product.image_url || '/placeholder-product.jpg'} 
                    alt={product.name}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>

                {/* Informações */}
                <div className="md:w-1/2 p-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {product.name}
                  </h1>
                  
                  {product.category && (
                    <div className="mb-4">
                      <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                        {product.category}
                      </span>
                    </div>
                  )}

                  {product.description && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Descrição</h2>
                      <p className="text-gray-700 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  )}

                  {product.specifications && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Especificações</h2>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                          {product.specifications}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="space-y-4">
                    <a 
                      href={`https://wa.me/5511917352023?text=Olá! Gostaria de saber mais sobre o produto: ${encodeURIComponent(product.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-green-600 text-white text-center py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      📱 Solicitar Orçamento via WhatsApp
                    </a>
                    
                    <a 
                      href="/orcamento"
                      className="block w-full bg-blue-600 text-white text-center py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      📧 Solicitar Orçamento por E-mail
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Produtos Relacionados */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Produtos Relacionados</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Aqui você pode adicionar produtos relacionados */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Produtos Similares
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Conheça outros produtos da nossa linha que podem atender suas necessidades.
                  </p>
                  <a 
                    href="/produtos"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Ver todos os produtos →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default ProductDetailPage
