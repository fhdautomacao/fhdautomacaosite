import { Settings, Wrench, Zap, Cog, Hammer, Workflow, Gauge } from 'lucide-react'

const Services = () => {
  const services = [
    {
      icon: <Settings size={40} />,
      title: "Automação Hidráulica e Pneumática",
      description: "Desenvolvemos sistemas avançados de automação hidráulica e pneumática para otimizar a eficiência operacional e reduzir custos."
    },
    {
      icon: <Cog size={40} />,
      title: "Projetos Hidráulicos",
      description: "Criamos projetos personalizados de sistemas hidráulicos para atender às exigências específicas de cada cliente."
    },
    {
      icon: <Zap size={40} />,
      title: "Start-up em Unidades Hidráulicas",
      description: "Garantimos uma inicialização suave e eficiente de unidades hidráulicas, assegurando o máximo desempenho desde o início."
    },
    {
      icon: <Hammer size={40} />,
      title: "Fabricação em Unidades Hidráulicas",
      description: "Fabricamos unidades hidráulicas de alta qualidade, personalizadas para atender às necessidades exclusivas de cada aplicação."
    },
    {
      icon: <Wrench size={40} />,
      title: "Manutenção de Cilindros",
      description: "Oferecemos serviços de manutenção preventiva e corretiva para garantir o funcionamento confiável de cilindros hidráulicos e pneumáticos."
    },
    {
      icon: <Workflow size={40} />,
      title: "Instalação e Dobras em Tubulações",
      description: "Oferecemos serviços especializados de instalação e dobras em tubulações hidráulicas, garantindo precisão e eficiência em cada projeto."
    },
    {
      icon: <Gauge size={40} />,
      title: "Consertos em Bombas Hidráulicas",
      description: "Efetuamos reparos em bombas hidráulicas de pistões e palhetas, restaurando sua eficiência e prolongando sua vida útil."
    }
  ]

  return (
    <section id="servicos" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Nossos Serviços</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Na FHD Automação Industrial, oferecemos uma ampla gama de serviços especializados 
            para atender às necessidades variadas da indústria.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 group"
            >
              <div className="text-blue-600 mb-6 group-hover:text-blue-700 transition-colors">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            Pronto para Impulsionar Seu Negócio?
          </h3>
          <p className="text-xl mb-8 text-blue-100">
            Na FHD Automação Industrial, estamos comprometidos em impulsionar o seu negócio para o futuro 
            com soluções de automação inovadoras e confiáveis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold px-8 py-3 rounded-lg transition-colors">
              Solicitar Orçamento
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-700 font-semibold px-8 py-3 rounded-lg transition-colors">
              Falar com Especialista
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services

