import { Helmet } from 'react-helmet-async'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Target, Eye, Heart, Award, Users, Clock, ArrowRight, Factory, Cog, Shield, Zap, TrendingUp } from 'lucide-react'
import { useEffect, useRef, useState } from 'react';

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [typedText, setTypedText] = useState('')
  const fullText = 'Quem Somos'
  const values = [
    {
      icon: <Award className="h-8 w-8 text-blue-500" />,
      title: "Excelência",
      description: "Buscamos a excelência em todos os nossos serviços, superando as expectativas dos clientes com qualidade superior.",
      color: "blue"
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: "Integridade",
      description: "Agimos com transparência, honestidade e ética em todas as nossas relações comerciais e profissionais.",
      color: "green"
    },
    {
      icon: <Clock className="h-8 w-8 text-yellow-500" />,
      title: "Inovação",
      description: "Investimos constantemente em tecnologia e inovação para oferecer as melhores soluções do mercado.",
      color: "yellow"
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Paixão",
      description: "Somos apaixonados pelo que fazemos e isso se reflete na qualidade e dedicação em cada projeto.",
      color: "red"
    }
  ]

  const timeline = [
    {
      year: "2013",
      title: "Fundação da Empresa",
      description: "Início das atividades em Sumaré, SP, com foco em soluções hidráulicas e pneumáticas.",
      icon: <Factory className="h-6 w-6" />,
      color: "from-blue-400 to-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100"
    },
    {
      year: "2015",
      title: "Expansão dos Serviços",
      description: "Ampliação do portfólio com manutenção especializada e projetos personalizados.",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "from-green-400 to-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-100"
    },
    {
      year: "2018",
      title: "Certificações Técnicas",
      description: "Obtenção de certificações importantes e parcerias com fornecedores internacionais.",
      icon: <Shield className="h-6 w-6" />,
      color: "from-purple-400 to-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-100"
    },
    {
      year: "2020",
      title: "Modernização Tecnológica",
      description: "Investimento em tecnologia de ponta e sistemas de automação avançados.",
      icon: <Cog className="h-6 w-6" />,
      color: "from-orange-400 to-orange-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-100"
    },
    {
      year: "2023",
      title: "Liderança Regional",
      description: "Consolidação como referência em automação industrial na região de Campinas.",
      icon: <Zap className="h-6 w-6" />,
      color: "from-yellow-400 to-yellow-500",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-100"
    }
  ]

  const sectionRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRefs.current.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      sectionRefs.current.forEach((section) => {
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, []);

  // Efeito de digitação no título (mesmo padrão de "Nossos Serviços")
  useEffect(() => {
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
        <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="bg-yellow-300 text-blue-900 mb-6 animate-pulse">
                Mais de 10 anos de experiência
              </Badge>
              <h1 className={`text-4xl md:text-6xl font-bold mb-6 typing-cursor ${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>
                {typedText}
              </h1>
              <p className={`text-xl md:text-2xl text-blue-100 ${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`} style={{animationDelay: '1.5s'}}>
                Especialistas em automação industrial, comprometidos com a excelência e inovação
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent"></div>
        </section>

        {/* About Section */}
        <section ref={el => sectionRefs.current[0] = el} className="py-20 animate-on-scroll">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Nossa História
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Bem-vindo à FHD Automação Industrial, sua parceira confiável em soluções de automação hidráulica e pneumática.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Desde a nossa fundação na cidade de Sumaré, estado de São Paulo, temos nos dedicado apaixonadamente ao fornecimento de serviços de alta qualidade e soluções inovadoras para as necessidades industriais mais desafiadoras.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Com uma equipe de especialistas experientes e dedicados, a FHD Automação Industrial se destaca como líder no setor, oferecendo uma ampla gama de serviços especializados para atender às demandas em constante evolução do mercado.
                </p>
                <Button className="bg-blue-500 hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Conheça Nossos Serviços
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div className="group">
                    <div className="text-3xl font-bold text-blue-500 mb-2 group-hover:scale-110 transition-transform duration-300">500+</div>
                    <div className="text-gray-600">Projetos Realizados</div>
                  </div>
                  <div className="group">
                    <div className="text-3xl font-bold text-blue-500 mb-2 group-hover:scale-110 transition-transform duration-300">100+</div>
                    <div className="text-gray-600">Clientes Atendidos</div>
                  </div>
                  <div className="group">
                    <div className="text-3xl font-bold text-blue-500 mb-2 group-hover:scale-110 transition-transform duration-300">10+</div>
                    <div className="text-gray-600">Anos de Experiência</div>
                  </div>
                  <div className="group">
                    <div className="text-3xl font-bold text-blue-500 mb-2 group-hover:scale-110 transition-transform duration-300">98%</div>
                    <div className="text-gray-600">Satisfação</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section ref={el => sectionRefs.current[1] = el} className="py-20 bg-white animate-on-scroll">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
                <CardHeader>
                  <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-12 w-12 text-blue-500" />
                  </div>
                  <CardTitle className="text-2xl">Missão</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    Impulsionamos o progresso industrial com excelência em automação hidráulica e pneumática. Fornecemos soluções inovadoras e confiáveis, superando expectativas e construindo relacionamentos sólidos baseados em confiança, integridade e qualidade.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
                <CardHeader>
                  <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="h-12 w-12 text-green-500" />
                  </div>
                  <CardTitle className="text-2xl">Visão</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    Buscamos liderança global em automação industrial, promovendo eficiência, sustentabilidade e inovação. Com parcerias estratégicas e investimentos em tecnologia, somos a primeira escolha para soluções de automação hidráulica e pneumática de excelência.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
                <CardHeader>
                  <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-12 w-12 text-red-500" />
                  </div>
                  <CardTitle className="text-2xl">Valores</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    Buscamos excelência em serviços e satisfação do cliente. Inovações impulsionam nosso progresso, agimos com integridade e transparência. Apaixonados pelo trabalho, superamos expectativas com resultados excepcionais.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Values Grid */}
        <section ref={el => sectionRefs.current[2] = el} className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 animate-on-scroll">
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
                <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group border-0 shadow-lg bg-white">
                  <CardHeader>
                    <div className={`mx-auto mb-4 w-16 h-16 rounded-full bg-${value.color}-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      {value.icon}
                    </div>
                    <CardTitle className="text-xl group-hover:text-blue-500 transition-colors duration-300">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline - REDESIGN COMPLETO */}
        <section ref={el => sectionRefs.current[3] = el} className="py-20 bg-white relative overflow-hidden animate-on-scroll">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nossa Trajetória
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Uma década de crescimento, inovação e conquistas no setor de automação industrial
              </p>
            </div>
            
            {/* Timeline Desktop */}
            <div className="hidden lg:block max-w-6xl mx-auto">
              <div className="relative">
                {/* Linha central */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-200 via-blue-300 to-blue-400"></div>
                
                {timeline.map((item, index) => (
                  <div key={index} className={`relative flex items-center mb-16 last:mb-0 animate-timeline-item ${index % 2 === 0 ? 'justify-start animate-slide-in-left' : 'justify-end animate-slide-in-right'}`} style={{ animationDelay: `${index * 0.2}s` }}>
                    {/* Card */}
                    <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                      <Card className={`${item.bgColor} ${item.borderColor} border-2 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${item.color} text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                              {item.icon}
                            </div>
                            <div>
                              <Badge className={`bg-gradient-to-r ${item.color} text-white mb-2`}>
                                {item.year}
                              </Badge>
                              <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-500 transition-colors duration-300">
                                {item.title}
                              </CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-gray-700 leading-relaxed">
                            {item.description}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Ponto central */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-white border-4 border-blue-400 shadow-lg z-10 group-hover:scale-125 transition-transform duration-300"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Mobile */}
            <div className="lg:hidden max-w-2xl mx-auto">
              <div className="relative">
                {/* Linha lateral */}
                <div className="absolute left-8 top-0 w-1 h-full bg-gradient-to-b from-blue-200 via-blue-300 to-blue-400"></div>
                
                {timeline.map((item, index) => (
                  <div key={index} className="relative flex items-start mb-12 last:mb-0 animate-timeline-item animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                    {/* Ponto lateral */}
                    <div className="absolute left-6 w-6 h-6 rounded-full bg-white border-4 border-blue-400 shadow-lg z-10"></div>
                    
                    {/* Card */}
                    <div className="ml-20 w-full">
                      <Card className={`${item.bgColor} ${item.borderColor} border-2 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${item.color} text-white flex items-center justify-center`}>
                              {item.icon}
                            </div>
                            <Badge className={`bg-gradient-to-r ${item.color} text-white`}>
                              {item.year}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg font-bold text-gray-900">
                            {item.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-gray-700 leading-relaxed">
                            {item.description}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section ref={el => sectionRefs.current[4] = el} className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white py-16 relative overflow-hidden animate-on-scroll mb-12 md:mb-16">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Faça Parte da Nossa História
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Junte-se aos nossos clientes satisfeitos e descubra como podemos impulsionar seu negócio.
            </p>
            <Button size="lg" className="bg-yellow-300 hover:bg-yellow-400 text-blue-900 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Entre em Contato
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }

        .animate-on-scroll {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        .animate-on-scroll.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .animate-timeline-item {
          opacity: 0;
        }

        .animate-timeline-item.animate-in {
          opacity: 1;
        }

        /* Estilos customizados para a página Quem Somos */

/* Animações personalizadas */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(59, 130, 246, 0.6);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Classes de animação */
.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}

.animate-slide-in-left {
  animation: slide-in-left 0.8s ease-out forwards;
}

.animate-slide-in-right {
  animation: slide-in-right 0.8s ease-out forwards;
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Delays para animações escalonadas */
.animation-delay-100 {
  animation-delay: 0.1s;
  opacity: 0;
}

.animation-delay-200 {
  animation-delay: 0.2s;
  opacity: 0;
}

.animation-delay-300 {
  animation-delay: 0.3s;
  opacity: 0;
}

.animation-delay-400 {
  animation-delay: 0.4s;
  opacity: 0;
}

.animation-delay-500 {
  animation-delay: 0.5s;
  opacity: 0;
}

/* Estilos para a timeline */
.timeline-line {
  background: linear-gradient(to bottom, 
    rgba(96, 165, 250, 0.3) 0%,
    rgba(96, 165, 250, 0.6) 50%,
    rgba(96, 165, 250, 0.9) 100%
  );
}

.timeline-point {
  transition: all 0.3s ease;
}

.timeline-point:hover {
  transform: scale(1.2);
  box-shadow: 0 0 20px rgba(96, 165, 250, 0.5);
}

.timeline-card {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.timeline-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.timeline-card:hover::before {
  left: 100%;
}

.timeline-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

/* Gradientes personalizados */
.gradient-blue {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
}

.gradient-green {
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
}

.gradient-purple {
  background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
}

.gradient-orange {
  background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
}

.gradient-yellow {
  background: linear-gradient(135deg, #facc15 0%, #eab308 100%);
}

/* Efeitos de hover para cards */
.card-hover {
  transition: all 0.3s ease;
  cursor: pointer;
}

.card-hover:hover {
  transform: translateY(-8px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

/* Efeitos para estatísticas */
.stat-number {
  transition: all 0.3s ease;
}

.stat-number:hover {
  transform: scale(1.1);
  color: #60a5fa;
}

/* Responsividade aprimorada */
@media (max-width: 768px) {
  .timeline-card {
    margin-bottom: 1rem;
  }
  
  .animate-fade-in-up,
  .animate-slide-in-left,
  .animate-slide-in-right {
    animation-duration: 0.6s;
  }
}

/* Efeitos de foco para acessibilidade */
.focus-ring:focus {
  outline: 2px solid #60a5fa;
  outline-offset: 2px;
}

/* Melhorias para botões */
.btn-enhanced {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.btn-enhanced::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.btn-enhanced:hover::before {
  left: 100%;
}

.btn-enhanced:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

/* Padrões de fundo sutis */
.pattern-dots {
  background-image: radial-gradient(circle, rgba(96, 165, 250, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}

.pattern-grid {
  background-image: 
    linear-gradient(rgba(96, 165, 250, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(96, 165, 250, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}

/* Animações para a timeline */
@keyframes timeline-fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-timeline-item {
  animation: timeline-fade-in 0.8s ease-out forwards;
  opacity: 0; /* Garante que o item esteja invisível antes da animação */
}

/* Animação para elementos que aparecem ao rolar */
@keyframes fade-in-bottom {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-bottom-on-scroll {
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.fade-in-bottom-on-scroll.animate-in {
  opacity: 1;
  transform: translateY(0);
}



      `}</style>
    </>
  )

  
}

export default AboutPage

