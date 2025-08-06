import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Wrench, Settings, Zap, Shield, Clock, Award } from 'lucide-react'
import { useServiceCategories } from '../../hooks/useCategories'

const ServicesSection = () => {
  const [services, setServices] = useState([])
  const [loadingServices, setLoadingServices] = useState(true)
  const [errorServices, setErrorServices] = useState(null)
  const { categories: fetchedCategories, loading: loadingCategories, error: categoriesError } = useServiceCategories()

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

  useEffect(() => {
    fetchServices()
  }, [])

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
          <p className="mt-4 text-gray-600">Carregando serviços...</p>
        </div>
      </div>
    )
  }

  if (errorServices || categoriesError || services.length === 0) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Nossos Serviços</h2>
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              {errorServices ? `Erro ao carregar serviços: ${errorServices}` : categoriesError ? `Erro ao carregar categorias: ${categoriesError.message}` : 'Nenhum serviço encontrado.'}
            </p>
            <Button onClick={fetchServices}>
              Tentar novamente
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Nossos Serviços</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayServices.map((service, index) => (
            <Card key={service.id || index} className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mb-4">
                  {getServiceIcon(service.icon, service.category)}
                </div>
                <CardTitle className="text-xl">{service.name}</CardTitle>
                <CardDescription className="text-gray-600">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(service.features || []).map((feature, featureIndex) => (
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
                      {service.price}
                    </p>
                  </div>
                )}
                
                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                  Saiba Mais
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesSection


