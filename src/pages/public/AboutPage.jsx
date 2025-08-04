import { Helmet } from 'react-helmet-async'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Target, Eye, Heart, Award, Users, Clock, ArrowRight } from 'lucide-react'

const AboutPage = () => {
  const values = [
    {
      icon: <Award className="h-8 w-8 text-blue-600" />,
      title: "Excelência",
      description: "Buscamos a excelência em todos os nossos serviços, superando as expectativas dos clientes com qualidade superior."
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Integridade",
      description: "Agimos com transparência, honestidade e ética em todas as nossas relações comerciais e profissionais."
    },
    {
      icon: <Clock className="h-8 w-8 text-yellow-600" />,
      title: "Inovação",
      description: "Investimos constantemente em tecnologia e inovação para oferecer as melhores soluções do mercado."
    },
    {
      icon: <Heart className="h-8 w-8 text-red-600" />,
      title: "Paixão",
      description: "Somos apaixonados pelo que fazemos e isso se reflete na qualidade e dedicação em cada projeto."
    }
  ]

  const timeline = [
    {
      year: "2013",
      title: "Fundação da Empresa",
      description: "Início das atividades em Sumaré, SP, com foco em soluções hidráulicas e pneumáticas."
    },
    {
      year: "2015",
      title: "Expansão dos Serviços",
      description: "Ampliação do portfólio com manutenção especializada e projetos personalizados."
    },
    {
      year: "2018",
      title: "Certificações Técnicas",
      description: "Obtenção de certificações importantes e parcerias com fornecedores internacionais."
    },
    {
      year: "2020",
      title: "Modernização Tecnológica",
      description: "Investimento em tecnologia de ponta e sistemas de automação avançados."
    },
    {
      year: "2023",
      title: "Liderança Regional",
      description: "Consolidação como referência em automação industrial na região de Campinas."
    }
  ]

  return (
    <>
      <Helmet>
        <title>Quem Somos - FHD Automação Industrial</title>
        <meta 
          name="description" 
          content="Conheça a história da FHD Automação Industrial. Mais de 10 anos de experiência em soluções hidráulicas e pneumáticas, com sede em Sumaré, SP." 
        />
        <meta 
          name="keywords" 
          content="sobre FHD Automação, história empresa, automação industrial Sumaré, missão visão valores, equipe especializada" 
        />
        <link rel="canonical" href="https://fhdautomacao.com.br/quem-somos" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="bg-yellow-400 text-blue-900 mb-6">
                Mais de 10 anos de experiência
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Quem Somos
              </h1>
              <p className="text-xl md:text-2xl text-blue-100">
                Especialistas em automação industrial, comprometidos com a excelência e inovação
              </p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Nossa História
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  Bem-vindo à FHD Automação Industrial, sua parceira confiável em soluções de automação hidráulica e pneumática.
                </p>
                <p className="text-gray-600 mb-6">
                  Desde a nossa fundação na cidade de Sumaré, estado de São Paulo, temos nos dedicado apaixonadamente ao fornecimento de serviços de alta qualidade e soluções inovadoras para as necessidades industriais mais desafiadoras.
                </p>
                <p className="text-gray-600 mb-8">
                  Com uma equipe de especialistas experientes e dedicados, a FHD Automação Industrial se destaca como líder no setor, oferecendo uma ampla gama de serviços especializados para atender às demandas em constante evolução do mercado.
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Conheça Nossos Serviços
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                    <div className="text-gray-600">Projetos Realizados</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">100+</div>
                    <div className="text-gray-600">Clientes Atendidos</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">10+</div>
                    <div className="text-gray-600">Anos de Experiência</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
                    <div className="text-gray-600">Satisfação</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-2xl">Missão</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    Impulsionamos o progresso industrial com excelência em automação hidráulica e pneumática. Fornecemos soluções inovadoras e confiáveis, superando expectativas e construindo relacionamentos sólidos baseados em confiança, integridade e qualidade.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Eye className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <CardTitle className="text-2xl">Visão</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    Buscamos liderança global em automação industrial, promovendo eficiência, sustentabilidade e inovação. Com parcerias estratégicas e investimentos em tecnologia, somos a primeira escolha para soluções de automação hidráulica e pneumática de excelência.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
                  <CardTitle className="text-2xl">Valores</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    Buscamos excelência em serviços e satisfação do cliente. Inovações impulsionam nosso progresso, agimos com integridade e transparência. Apaixonados pelo trabalho, superamos expectativas com resultados excepcionais.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Values Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nossos Valores
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Os princípios que guiam nossa empresa e definem nossa cultura organizacional
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto mb-4">{value.icon}</div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nossa Trajetória
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Uma década de crescimento, inovação e conquistas no setor de automação industrial
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              {timeline.map((item, index) => (
                <div key={index} className="flex items-start mb-8 last:mb-0">
                  <div className="flex-shrink-0 w-20 text-center">
                    <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold">
                      {item.year}
                    </div>
                  </div>
                  <div className="ml-6 flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-900 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Faça Parte da Nossa História
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Junte-se aos nossos clientes satisfeitos e descubra como podemos impulsionar seu negócio.
            </p>
            <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-blue-900">
              Entre em Contato
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </div>
    </>
  )
}

export default AboutPage

