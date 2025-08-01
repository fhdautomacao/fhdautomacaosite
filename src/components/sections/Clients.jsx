import { useState, useEffect } from 'react'
import { Users, Star, TrendingUp, Award, ArrowRight, Quote } from 'lucide-react'

const Clients = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  // Placeholder client data - in a real implementation, these would be actual client logos/names
  const clients = [
    { name: "Empresa Industrial A", logo: "🏭", sector: "Industrial" },
    { name: "Metalúrgica B", logo: "⚙️", sector: "Metalurgia" },
    { name: "Automobilística C", logo: "🚗", sector: "Automotivo" },
    { name: "Petroquímica D", logo: "🛢️", sector: "Petroquímica" },
    { name: "Alimentícia E", logo: "🍽️", sector: "Alimentício" },
    { name: "Farmacêutica F", logo: "💊", sector: "Farmacêutico" },
    { name: "Têxtil G", logo: "🧵", sector: "Têxtil" },
    { name: "Papel e Celulose H", logo: "📄", sector: "Papel" },
    { name: "Mineração I", logo: "⛏️", sector: "Mineração" },
    { name: "Siderúrgica J", logo: "🔩", sector: "Siderurgia" },
    { name: "Química K", logo: "🧪", sector: "Química" },
    { name: "Energia L", logo: "⚡", sector: "Energia" }
  ]

  const testimonials = [
    {
      name: "João Silva",
      company: "Metalúrgica ABC",
      position: "Gerente de Manutenção",
      text: "A FHD Automação transformou nossos processos. A eficiência aumentou 40% após a implementação das soluções hidráulicas.",
      rating: 5,
      avatar: "👨‍💼"
    },
    {
      name: "Maria Santos",
      company: "Indústria XYZ",
      position: "Diretora de Operações",
      text: "Profissionais extremamente competentes. O suporte técnico é excepcional e sempre disponível quando precisamos.",
      rating: 5,
      avatar: "👩‍💼"
    },
    {
      name: "Carlos Oliveira",
      company: "Automobilística DEF",
      position: "Engenheiro Chefe",
      text: "Parceria de longa data. A qualidade dos serviços e a confiabilidade dos equipamentos são incomparáveis.",
      rating: 5,
      avatar: "👨‍🔧"
    },
    {
      name: "Ana Costa",
      company: "Petroquímica GHI",
      position: "Coordenadora de Projetos",
      text: "Sempre entregam no prazo e com qualidade excepcional. Recomendo para qualquer empresa que busca excelência.",
      rating: 5,
      avatar: "👩‍🔬"
    }
  ]

  const stats = [
    { 
      number: "100+", 
      label: "Clientes Atendidos", 
      icon: <Users size={32} />,
      color: "from-blue-500 to-blue-600"
    },
    { 
      number: "500+", 
      label: "Projetos Realizados", 
      icon: <TrendingUp size={32} />,
      color: "from-green-500 to-green-600"
    },
    { 
      number: "10+", 
      label: "Anos de Experiência", 
      icon: <Award size={32} />,
      color: "from-purple-500 to-purple-600"
    },
    { 
      number: "100%", 
      label: "Satisfação dos Clientes", 
      icon: <Star size={32} />,
      color: "from-yellow-500 to-yellow-600"
    }
  ]

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  return (
    <section id="clientes" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border border-blue-400 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-blue-300 rotate-12 animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-6 py-2 rounded-full mb-6">
            <Users className="mr-2" size={20} />
            <span className="font-semibold">Clientes Satisfeitos</span>
          </div>
          <h2 className="text-5xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Nossos Clientes
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Temos o orgulho de atender <span className="font-bold text-blue-600">empresas de diversos segmentos industriais</span>, 
            sempre com o compromisso de entregar <span className="font-semibold text-blue-600">soluções de excelência</span>.
          </p>
        </div>

        {/* Client Logos Grid */}
        <div className="mb-20 animate-fade-in-up">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-12">
            Empresas que confiam em nosso trabalho
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {clients.map((client, index) => (
              <div 
                key={index}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col items-center justify-center hover:-translate-y-2 hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300">
                  {client.logo}
                </div>
                <div className="text-xs text-gray-600 text-center font-medium mb-1">
                  {client.name}
                </div>
                <div className="text-xs text-blue-600 font-semibold">
                  {client.sector}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-20 animate-fade-in-up">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 text-center hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`bg-gradient-to-r ${stat.color} rounded-2xl p-4 w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-semibold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="mb-20 animate-fade-in-up">
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-12">
            O que nossos clientes dizem
          </h3>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-12 relative overflow-hidden">
              {/* Background Quote */}
              <div className="absolute top-8 left-8 text-blue-100 opacity-50">
                <Quote size={80} />
              </div>
              
              {/* Testimonial Content */}
              <div className="relative z-10 text-center">
                <div className="text-6xl mb-6">
                  {testimonials[currentTestimonial].avatar}
                </div>
                
                {/* Rating */}
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={24} />
                  ))}
                </div>
                
                {/* Testimonial Text */}
                <p className="text-xl text-gray-600 mb-8 leading-relaxed italic max-w-3xl mx-auto">
                  "{testimonials[currentTestimonial].text}"
                </p>
                
                {/* Author Info */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="text-xl font-bold text-gray-800 mb-1">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-gray-600 mb-1">
                    {testimonials[currentTestimonial].position}
                  </div>
                  <div className="text-blue-600 font-semibold">
                    {testimonials[currentTestimonial].company}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonial Indicators */}
            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-blue-600 w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center animate-fade-in-up">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl p-12 max-w-4xl mx-auto border border-blue-100">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-6 w-24 h-24 mx-auto mb-8 flex items-center justify-center">
              <Users className="text-white" size={40} />
            </div>
            
            <h3 className="text-3xl font-bold text-gray-800 mb-6">
              Junte-se aos nossos clientes satisfeitos
            </h3>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Descubra como podemos ajudar sua empresa a alcançar <span className="font-semibold text-blue-600">novos patamares de eficiência</span> 
              com nossas soluções em automação hidráulica e pneumática.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                <span>Solicitar Proposta</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button className="group border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
                <span>Conhecer Cases</span>
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

export default Clients

