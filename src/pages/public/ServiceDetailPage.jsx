import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DynamicSEO from '@/components/common/DynamicSEO'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import { servicesAPI } from '@/api/services'

const ServiceDetailPage = () => {
  const { slug } = useParams()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true)
        const services = await servicesAPI.getActive()
        const foundService = services.find(s => s.slug === slug)
        setService(foundService)
      } catch (error) {
        console.error('Erro ao carregar serviço:', error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchService()
    }
  }, [slug])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  }

  if (!service) {
    return <div className="min-h-screen flex items-center justify-center">Serviço não encontrado</div>
  }

  // SEO dinâmico baseado no serviço
  const seoData = {
    title: `${service.name} - FHD Automação Industrial`,
    description: service.description || `Conheça o serviço de ${service.name} da FHD Automação Industrial. ${service.name} com qualidade e garantia. Solicite orçamento.`,
    keywords: `${service.name}, ${service.category}, automação industrial, hidráulica, pneumática, manutenção, FHD Automação, Sumaré SP`,
    canonical_url: `https://www.fhdautomacaoindustrial.com.br/servico/${service.slug}`,
    og_title: `${service.name} - FHD Automação Industrial`,
    og_description: service.description || `Conheça o serviço de ${service.name} da FHD Automação Industrial. Qualidade e garantia.`,
    og_image: service.image_url || 'https://www.fhdautomacaoindustrial.com.br/og-image.jpg',
    structured_data: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": service.name,
      "description": service.description,
      "provider": {
        "@type": "Organization",
        "name": "FHD Automação Industrial",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Sumaré",
          "addressRegion": "SP",
          "addressCountry": "BR"
        }
      },
      "areaServed": {
        "@type": "State",
        "name": "São Paulo"
      },
      "serviceType": service.category
    }
  }

  return (
    <>
      <DynamicSEO pageName="service-detail" fallbackData={seoData} />
      
      <main className="min-h-screen bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <Breadcrumbs 
              customItems={[
                { path: '/servicos', name: 'Serviços' },
                { path: `/servico/${service.slug}`, name: service.name }
              ]}
            />

            {/* Serviço */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                {/* Imagem */}
                <div className="md:w-1/2">
                  <img 
                    src={service.image_url || '/placeholder-service.jpg'} 
                    alt={service.name}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>

                {/* Informações */}
                <div className="md:w-1/2 p-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {service.name}
                  </h1>
                  
                  {service.category && (
                    <div className="mb-4">
                      <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                        {service.category}
                      </span>
                    </div>
                  )}

                  {service.description && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Descrição</h2>
                      <p className="text-gray-700 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  )}

                  {service.features && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Características</h2>
                      <ul className="space-y-2">
                        {service.features.split('\n').map((feature, index) => (
                          <li key={index} className="flex items-center text-gray-700">
                            <span className="text-green-500 mr-2">✓</span>
                            {feature.trim()}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {service.benefits && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Benefícios</h2>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-gray-700">
                          {service.benefits}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="space-y-4">
                    <a 
                      href={`https://wa.me/5511917352023?text=Olá! Gostaria de saber mais sobre o serviço: ${encodeURIComponent(service.name)}`}
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

            {/* Serviços Relacionados */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Serviços Relacionados</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Aqui você pode adicionar serviços relacionados */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Serviços Similares
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Conheça outros serviços da nossa linha que podem atender suas necessidades.
                  </p>
                  <a 
                    href="/servicos"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Ver todos os serviços →
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

export default ServiceDetailPage
