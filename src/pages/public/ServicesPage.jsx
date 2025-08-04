import { Helmet } from 'react-helmet-async'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Wrench, Settings, Zap, Shield, Clock, Award } from 'lucide-react'

const ServicesPage = () => {
  const services = [
    {
      icon: <Wrench className="h-8 w-8 text-blue-600" />,
      title: "Automação Hidráulica e Pneumática",
      description: "Desenvolvemos sistemas avançados de automação hidráulica e pneumática para otimizar a eficiência operacional e reduzir custos.",
      features: ["Sistemas personalizados", "Controle de precisão", "Monitoramento remoto", "Integração com PLCs"]
    },
    {
      icon: <Settings className="h-8 w-8 text-blue-600" />,
      title: "Projetos Hidráulicos",
      description: "Criamos projetos personalizados de sistemas hidráulicos para atender às exigências específicas de cada cliente.",
      features: ["Dimensionamento técnico", "Simulação 3D", "Documentação completa", "Suporte na implementação"]
    },
    {
      icon: <Zap className="h-8 w-8 text-blue-600" />,
      title: "Start-up em Unidades Hidráulicas",
      description: "Garantimos uma inicialização suave e eficiente de unidades hidráulicas, assegurando o máximo desempenho desde o início.",
      features: ["Testes de performance", "Calibração de sistemas", "Treinamento de operadores", "Documentação técnica"]
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Fabricação em Unidades Hidráulicas",
      description: "Fabricamos unidades hidráulicas de alta qualidade, personalizadas para atender às necessidades exclusivas de cada aplicação.",
      features: ["Componentes premium", "Controle de qualidade", "Testes rigorosos", "Garantia estendida"]
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-600" />,
      title: "Manutenção de Cilindros",
      description: "Oferecemos serviços de manutenção preventiva e corretiva para garantir o funcionamento confiável de cilindros hidráulicos e pneumáticos.",
      features: ["Manutenção preventiva", "Reparo especializado", "Peças originais", "Atendimento 24/7"]
    },
    {
      icon: <Award className="h-8 w-8 text-blue-600" />,
      title: "Instalação e Dobras em Tubulações",
      description: "Oferecemos serviços especializados de instalação e dobras em tubulações hidráulicas, garantindo precisão e eficiência em cada projeto.",
      features: ["Soldas certificadas", "Testes de pressão", "Normas técnicas", "Instalação completa"]
    }
  ]

  return (
    <>
      <Helmet>
        <title>Nossos Serviços - FHD Automação Industrial</title>
        <meta 
          name="description" 
          content="Conheça todos os serviços da FHD Automação Industrial: automação hidráulica e pneumática, projetos personalizados, manutenção especializada e muito mais." 
        />
        <meta 
          name="keywords" 
          content="serviços automação industrial, manutenção hidráulica, projetos pneumáticos, instalação tubulações, fabricação unidades hidráulicas" 
        />
        <link rel="canonical" href="https://fhdautomacao.com.br/servicos" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Nossos Serviços
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8">
                Soluções completas em automação hidráulica e pneumática para impulsionar sua indústria
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-blue-900">
                  Solicitar Orçamento
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900">
                  Falar com Especialista
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mb-4">{service.icon}</div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                      Saiba Mais
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-900 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto para Impulsionar Seu Negócio?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Entre em contato conosco e descubra como nossas soluções podem transformar sua operação industrial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-blue-900">
                Solicitar Orçamento Gratuito
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900">
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

