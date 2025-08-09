import { useState, useEffect } from 'react'
import DynamicSEO from '@/components/common/DynamicSEO'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/index.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Wrench, Settings, Zap, Shield, Clock, Award } from 'lucide-react'

const ServicesPage = () => {
  const { t, language } = useI18n()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const [typedText, setTypedText] = useState('')
  const fullText = 'Nossos Serviços'

  // WhatsApp - mesmo comportamento do botão flutuante
  const whatsappPhone = '5519998652144'
  const whatsappMessage = 'Olá! Vim pelo site e gostaria de um orçamento.'
  const openWhatsApp = () => {
    const href = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMessage)}`
    window.open(href, '_blank', 'noopener,noreferrer')
  }

  // Função para buscar serviços do banco de dados
  const fetchServices = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true) // Apenas serviços ativos
        .order("display_order", { ascending: true })

      if (error) throw error

      setServices(data || [])
    } catch (error) {
      console.error("Erro ao carregar serviços:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  

  useEffect(() => {
    fetchServices()
    setIsVisible(true)
    let index = 0
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
      }
    }, 100)
    return () => clearInterval(timer)
  }, [])

  

  // Função para mapear ícones baseado no nome ou categoria
  const getServiceIcon = (iconName, category) => {
    // Se o ícone for um emoji, retorna ele
    if (iconName && iconName.length <= 2) {
      return <span className="text-4xl">{iconName}</span>
    }

    // Mapear por categoria ou nome do serviço
    const iconMap = {
      'Automação': <Wrench className="h-8 w-8 text-blue-600" />,
      'Projetos': <Settings className="h-8 w-8 text-blue-600" />,
      'Manutenção': <Clock className="h-8 w-8 text-blue-600" />,
      'Fabricação': <Shield className="h-8 w-8 text-blue-600" />,
      'Instalação': <Award className="h-8 w-8 text-blue-600" />,
      'default': <Zap className="h-8 w-8 text-blue-600" />
    }

    return iconMap[category] || iconMap['default']
  }

  // Fallback para serviços hardcoded caso não haja dados no banco
  const fallbackServices = [
    {
      icon: "🔧",
      name: "Automação Hidráulica e Pneumática",
      description: "Desenvolvemos sistemas avançados de automação hidráulica e pneumática para otimizar a eficiência operacional e reduzir custos.",
      features: ["Sistemas personalizados", "Controle de precisão", "Monitoramento remoto", "Integração com PLCs"],
      category: "Automação"
    },
    {
      icon: "⚙️",
      name: "Projetos Hidráulicos",
      description: "Criamos projetos personalizados de sistemas hidráulicos para atender às exigências específicas de cada cliente.",
      features: ["Dimensionamento técnico", "Simulação 3D", "Documentação completa", "Suporte na implementação"],
      category: "Projetos"
    },
    {
      icon: "⚡",
      name: "Start-up em Unidades Hidráulicas",
      description: "Garantimos uma inicialização suave e eficiente de unidades hidráulicas, assegurando o máximo desempenho desde o início.",
      features: ["Testes de performance", "Calibração de sistemas", "Treinamento de operadores", "Documentação técnica"],
      category: "Projetos"
    },
    {
      icon: "🛡️",
      name: "Fabricação em Unidades Hidráulicas",
      description: "Fabricamos unidades hidráulicas de alta qualidade, personalizadas para atender às necessidades exclusivas de cada aplicação.",
      features: ["Componentes premium", "Controle de qualidade", "Testes rigorosos", "Garantia estendida"],
      category: "Fabricação"
    },
    {
      icon: "🕐",
      name: "Manutenção de Cilindros",
      description: "Oferecemos serviços de manutenção preventiva e corretiva para garantir o funcionamento confiável de cilindros hidráulicos e pneumáticos.",
      features: ["Manutenção preventiva", "Reparo especializado", "Peças originais", "Atendimento 24/7"],
      category: "Manutenção"
    },
    {
      icon: "🏆",
      name: "Instalação e Dobras em Tubulações",
      description: "Oferecemos serviços especializados de instalação e dobras em tubulações hidráulicas, garantindo precisão e eficiência em cada projeto.",
      features: ["Soldas certificadas", "Testes de pressão", "Normas técnicas", "Instalação completa"],
      category: "Instalação"
    }
  ]

  // Usar dados do banco ou fallback
  const slugify = (text) => {
    if (!text) return ''
    return text
      .normalize('NFD')
      .replace(/\p{Diacritic}+/gu, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }
  const displayServices = services.length > 0 ? services : fallbackServices

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando serviços...</p>
        </div>
      </div>
    )
  }

  if (error && services.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar serviços: {error}</p>
          <Button onClick={fetchServices}>
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <DynamicSEO pageName="services" />

      <div className="min-h-screen bg-gray-50">
        {/* Floating Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400 rounded-full animate-float opacity-30"></div>
          <div className="absolute top-40 right-20 w-6 h-6 bg-yellow-400 rounded-full animate-float opacity-20" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-40 left-20 w-3 h-3 bg-blue-500 rounded-full animate-float opacity-25" style={{animationDelay: '4s'}}></div>
          <div className="absolute bottom-20 right-10 w-5 h-5 bg-yellow-300 rounded-full animate-float opacity-30" style={{animationDelay: '1s'}}></div>
        </div>

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20 overflow-hidden animate-gradient">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className={`text-4xl md:text-6xl font-bold mb-6 typing-cursor ${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>
                {typedText}
              </h1>
              <p className={`text-xl md:text-2xl text-blue-100 mb-8 ${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`} style={{animationDelay: '1.5s'}}>
                Soluções completas em automação hidráulica e pneumática para impulsionar sua indústria
              </p>
              <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '2s'}}>
                <Button 
                  size="lg" 
                  className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 button-glow animate-pulse-glow"
                  onClick={() => window.location.href = '/orcamento'}
                >
                  Solicitar Orçamento
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white !text-white bg-transparent hover:bg-white hover:!text-blue-900 button-glow"
                  onClick={openWhatsApp}
                  aria-label="Falar com especialista no WhatsApp"
                >
                  Falar com Especialista
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayServices.map((service, index) => {
                const slug = slugify(service.name)
                const trans = service.translations?.[language]
                const name = trans?.name || t(`services.items.${slug}.name`, service.name)
                const description = trans?.description || t(`services.items.${slug}.description`, service.description)
                const sourceFeatures = trans?.features || service.features || []
                const features = sourceFeatures.map((feature, featureIndex) => 
                  t(`services.items.${slug}.features.${featureIndex}`, feature)
                )
                const formatPrice = (price) => {
                  if (!price) return null
                  const raw = String(price).trim()
                  const lower = raw.toLowerCase()
                  if (lower.startsWith('sob consulta')) return t('services.price.consultation','On request')
                  if (lower.startsWith('a partir de')) {
                    const value = raw.substring(raw.indexOf('de') + 2).trim()
                    return `${t('services.price.fromPrefix','From')} ${value}`
                  }
                  if (lower.includes('por metro linear')) return t('services.price.perMeter','per linear meter')
                  return raw
                }
                return (
                <Card 
                  key={service.id || index} 
                  className={`h-full card-hover service-card ${isVisible ? 'visible' : ''}`}
                  style={{animationDelay: `${2.5 + (index * 0.2)}s`}}
                >
                  <CardHeader>
                    <div className="mb-4">
                      {getServiceIcon(service.icon, service.category)}
                    </div>
                      <CardTitle className="text-xl">{name}</CardTitle>
                    <CardDescription className="text-gray-600">
                        {description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                        {features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 animate-pulse"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    {/* Exibir preço se disponível */}
                    {service.price && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-900">
                          {formatPrice(service.price)}
                        </p>
                      </div>
                    )}
                    
                    <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 button-glow">
                      Saiba Mais
                    </Button>
                  </CardContent>
                </Card>
                )})}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-16 relative overflow-hidden animate-gradient mb-12 md:mb-16">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-scale-in">
              Pronto para Impulsionar Seu Negócio?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              Entre em contato conosco e descubra como nossas soluções podem transformar sua operação industrial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <Button 
                size="lg" 
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 button-glow animate-pulse-glow"
                onClick={() => window.location.href = '/orcamento'}
              >
                Solicitar Orçamento Gratuito
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white !text-white bg-transparent hover:bg-white hover:!text-blue-900 button-glow"
                onClick={openWhatsApp}
                aria-label="Ligar para (19) 99865-2144 no WhatsApp"
              >
                (19) 99865-2144
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default ServicesPage