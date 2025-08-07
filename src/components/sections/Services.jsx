import { Settings, Wrench, Zap, Cog, Hammer, Workflow, ArrowRight, CheckCircle } from 'lucide-react'

const Services = () => {
  const services = [
    {
      icon: <Settings size={40} />,
      title: "Automação Hidráulica e Pneumática",
      description: "Desenvolvemos sistemas avançados de automação hidráulica e pneumática para otimizar a eficiência operacional e reduzir custos.",
      color: "blue",
      features: ["Sistemas Integrados", "Controle Avançado", "Eficiência Energética"]
    },
    {
      icon: <Cog size={40} />,
      title: "Projetos Hidráulicos",
      description: "Criamos projetos personalizados de sistemas hidráulicos para atender às exigências específicas de cada cliente.",
      color: "green",
      features: ["Projetos Customizados", "Análise Técnica", "Documentação Completa"]
    },
    {
      icon: <Zap size={40} />,
      title: "Start-up em Unidades Hidráulicas",
      description: "Garantimos uma inicialização suave e eficiente de unidades hidráulicas, assegurando o máximo desempenho desde o início.",
      color: "yellow",
      features: ["Comissionamento", "Testes de Performance", "Treinamento"]
    },
    {
      icon: <Hammer size={40} />,
      title: "Fabricação em Unidades Hidráulicas",
      description: "Fabricamos unidades hidráulicas de alta qualidade, personalizadas para atender às necessidades exclusivas de cada aplicação.",
      color: "purple",
      features: ["Fabricação Própria", "Qualidade Garantida", "Prazos Cumpridos"]
    },
    {
      icon: <Wrench size={40} />,
      title: "Manutenção de Cilindros",
      description: "Oferecemos serviços de manutenção preventiva e corretiva para garantir o funcionamento confiável de cilindros hidráulicos e pneumáticos.",
      color: "red",
      features: ["Manutenção Preventiva", "Reparo Especializado", "Peças Originais"]
    },
    {
      icon: <Workflow size={40} />,
      title: "Instalação e Dobras em Tubulações",
      description: "Oferecemos serviços especializados de instalação e dobras em tubulações hidráulicas, garantindo precisão e eficiência em cada projeto.",
      color: "indigo",
      features: ["Instalação Profissional", "Dobras Precisas", "Normas Técnicas"]
    },
    {
      icon: <Settings size={40} />,
      title: "Consertos em Bombas Hidráulicas",
      description: "Efetuamos reparos em bombas hidráulicas de pistões e palhetas, restaurando sua eficiência e prolongando sua vida útil.",
      color: "orange",
      features: ["Diagnóstico Completo", "Reparo Especializado", "Garantia Estendida"]
    }
  ]

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: "from-blue-500/10 to-blue-600/10",
        border: "border-blue-200",
        icon: "text-blue-600",
        iconBg: "bg-blue-100",
        accent: "text-blue-600"
      },
      green: {
        bg: "from-green-500/10 to-green-600/10",
        border: "border-green-200",
        icon: "text-green-600",
        iconBg: "bg-green-100",
        accent: "text-green-600"
      },
      yellow: {
        bg: "from-yellow-500/10 to-yellow-600/10",
        border: "border-yellow-200",
        icon: "text-yellow-600",
        iconBg: "bg-yellow-100",
        accent: "text-yellow-600"
      },
      purple: {
        bg: "from-purple-500/10 to-purple-600/10",
        border: "border-purple-200",
        icon: "text-purple-600",
        iconBg: "bg-purple-100",
        accent: "text-purple-600"
      },
      red: {
        bg: "from-red-500/10 to-red-600/10",
        border: "border-red-200",
        icon: "text-red-600",
        iconBg: "bg-red-100",
        accent: "text-red-600"
      },
      indigo: {
        bg: "from-indigo-500/10 to-indigo-600/10",
        border: "border-indigo-200",
        icon: "text-indigo-600",
        iconBg: "bg-indigo-100",
        accent: "text-indigo-600"
      },
      orange: {
        bg: "from-orange-500/10 to-orange-600/10",
        border: "border-orange-200",
        icon: "text-orange-600",
        iconBg: "bg-orange-100",
        accent: "text-orange-600"
      }
    }
    return colors[color] || colors.blue
  }

  return (
    <section id="servicos" className="py-20 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-40 left-10 w-20 h-20 border border-blue-400 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-16 h-16 border border-blue-300 rotate-12 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 border border-blue-500 -rotate-12 animate-pulse delay-500"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-6 py-2 rounded-full mb-6">
            <Settings className="mr-2" size={20} />
            <span className="font-semibold">Soluções Especializadas</span>
          </div>
          <h2 className="text-5xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Nossos Serviços
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Na <span className="font-bold text-blue-600">FHD Automação Industrial</span>, oferecemos uma ampla gama de serviços especializados 
            para atender às necessidades variadas da indústria com <span className="font-semibold text-blue-600">excelência e inovação</span>.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => {
            const colorClasses = getColorClasses(service.color)
            return (
              <div 
                key={index}
                className={`group bg-gradient-to-br ${colorClasses.bg} backdrop-blur-sm border ${colorClasses.border} rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-105 animate-fade-in-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`${colorClasses.iconBg} rounded-2xl p-4 w-20 h-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`${colorClasses.icon} group-hover:rotate-12 transition-transform duration-300`}>
                    {service.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-gray-900 transition-colors duration-300">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700 transition-colors duration-300">
                  {service.description}
                </p>
                
                {/* Features */}
                <div className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <CheckCircle className={`${colorClasses.accent} flex-shrink-0`} size={16} />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {/* Learn More Button */}
                <button className={`group/btn flex items-center space-x-2 ${colorClasses.accent} font-semibold text-sm hover:underline transition-all duration-300`}>
                  <span>Saiba mais</span>
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-3xl p-12 text-center text-white shadow-2xl hover:shadow-3xl transition-all duration-500 animate-fade-in-up">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 rounded-full p-4 w-20 h-20 mx-auto mb-8 flex items-center justify-center">
              <Zap className="text-yellow-400" size={40} />
            </div>
            
            <h3 className="text-4xl font-bold mb-6">
              Pronto para Impulsionar Seu Negócio?
            </h3>
            
            <p className="text-xl mb-10 text-blue-100 leading-relaxed">
              Na FHD Automação Industrial, estamos comprometidos em impulsionar o seu negócio para o futuro 
              com soluções de automação <span className="font-semibold text-yellow-400">inovadoras e confiáveis</span>.
            </p>
            
            {/* Benefits */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="flex items-center justify-center space-x-2 text-blue-100">
                <CheckCircle className="text-green-400" size={20} />
                <span>Orçamento Gratuito</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-blue-100">
                <CheckCircle className="text-green-400" size={20} />
                <span>Atendimento 24/7</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-blue-100">
                <CheckCircle className="text-green-400" size={20} />
                <span>Garantia Estendida</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-blue-900 font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                <span>Solicitar Orçamento</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button className="group border-2 border-white text-white hover:bg-white hover:text-blue-700 font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
                <span>Falar com Especialista</span>
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

export default Services

