import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Wrench, Settings, Zap, Shield, Clock, Award } from 'lucide-react'
import { useI18n } from '@/i18n/index.jsx'
import { useServiceCategories } from '../../hooks/useCategories'

const ServicesSection = ({ servicesData = null, serviceCategories = null }) => {
  // Considera dados iniciais apenas quando houver itens
  const hasInitialData = Array.isArray(servicesData) && servicesData.length > 0
  const [services, setServices] = useState(servicesData || [])
  const [loadingServices, setLoadingServices] = useState(!hasInitialData)
  const [errorServices, setErrorServices] = useState(null)
  const { categories: fetchedCategoriesHook, loading: loadingCategoriesHook, error: categoriesErrorHook } = useServiceCategories({ initialData: serviceCategories, enabled: !serviceCategories })
  const fetchedCategories = serviceCategories || fetchedCategoriesHook
  const loadingCategories = serviceCategories ? false : loadingCategoriesHook
  const categoriesError = serviceCategories ? null : categoriesErrorHook

  // Função para buscar serviços do banco de dados
  const fetchServices = async () => {
    setLoadingServices(true)
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
      setErrorServices(error.message)
    } finally {
      setLoadingServices(false)
    }
  }

  // Buscar quando não houver dados iniciais e sincronizar quando a prop mudar
  useEffect(() => {
    if (hasInitialData) {
      setServices(servicesData)
      setLoadingServices(false)
      return
    }
    fetchServices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasInitialData, servicesData])

  const { t, language } = useI18n()
  const slugify = (text) => {
    if (!text) return ''
    return text
      .normalize('NFD')
      .replace(/\p{Diacritic}+/gu, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }
  const formatPrice = (price) => {
    if (!price) return null
    const raw = String(price).trim()
    const lower = raw.toLowerCase()
    if (lower.startsWith('sob consulta')) {
      return t('services.price.consultation', 'On request')
    }
    if (lower.startsWith('a partir de')) {
      const value = raw.substring(raw.indexOf('de') + 2).trim()
      const prefix = t('services.price.fromPrefix', 'From')
      return `${prefix} ${value}`
    }
    if (lower.includes('por metro linear')) {
      return t('services.price.perMeter', 'per linear meter')
    }
    return raw
  }
  // Função para mapear ícones baseado no nome ou categoria
  const getServiceIcon = (iconName, categoryId) => {
    const categoryName = fetchedCategories.find(cat => cat.id === categoryId)?.name || categoryId
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

    return iconMap[categoryName] || iconMap['default']
  }

  // Usar apenas dados da API
  const displayServices = services

  if (loadingServices || loadingCategories) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('services.loading','Carregando serviços...')}</p>
        </div>
      </div>
    )
  }

  if (errorServices || categoriesError || services.length === 0) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t('services.title','Nossos Serviços')}</h2>
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              {errorServices ? `Erro ao carregar serviços: ${errorServices}` : categoriesError ? `Erro ao carregar categorias: ${categoriesError.message}` : t('services.empty','Nenhum serviço encontrado.')}
            </p>
            <Button onClick={fetchServices}>
              {t('services.retry','Tentar novamente')}
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t('services.title','Nossos Serviços')}</h2>
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
            return (
            <Card key={service.id || index} className="h-full hover:shadow-lg transition-shadow">
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
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
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
                
                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                  {t('services.learnMore','Saiba Mais')}
                </Button>
              </CardContent>
            </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ServicesSection


