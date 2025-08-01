const Clients = () => {
  // Placeholder client data - in a real implementation, these would be actual client logos/names
  const clients = [
    { name: "Empresa Industrial A", logo: "🏭" },
    { name: "Metalúrgica B", logo: "⚙️" },
    { name: "Automobilística C", logo: "🚗" },
    { name: "Petroquímica D", logo: "🛢️" },
    { name: "Alimentícia E", logo: "🍽️" },
    { name: "Farmacêutica F", logo: "💊" },
    { name: "Têxtil G", logo: "🧵" },
    { name: "Papel e Celulose H", logo: "📄" },
    { name: "Mineração I", logo: "⛏️" },
    { name: "Siderúrgica J", logo: "🔩" },
    { name: "Química K", logo: "🧪" },
    { name: "Energia L", logo: "⚡" }
  ]

  const testimonials = [
    {
      name: "João Silva",
      company: "Metalúrgica ABC",
      position: "Gerente de Manutenção",
      text: "A FHD Automação transformou nossos processos. A eficiência aumentou 40% após a implementação das soluções hidráulicas.",
      rating: 5
    },
    {
      name: "Maria Santos",
      company: "Indústria XYZ",
      position: "Diretora de Operações",
      text: "Profissionais extremamente competentes. O suporte técnico é excepcional e sempre disponível quando precisamos.",
      rating: 5
    },
    {
      name: "Carlos Oliveira",
      company: "Automobilística DEF",
      position: "Engenheiro Chefe",
      text: "Parceria de longa data. A qualidade dos serviços e a confiabilidade dos equipamentos são incomparáveis.",
      rating: 5
    }
  ]

  return (
    <section id="clientes" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Nossos Clientes</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Temos o orgulho de atender empresas de diversos segmentos industriais, 
            sempre com o compromisso de entregar soluções de excelência.
          </p>
        </div>

        {/* Client Logos Grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-20">
          {clients.map((client, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center justify-center group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {client.logo}
              </div>
              <div className="text-xs text-gray-600 text-center font-medium">
                {client.name}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-12">
            O que nossos clientes dizem
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-lg p-8 relative"
              >
                {/* Quote Icon */}
                <div className="absolute -top-4 left-8 bg-blue-600 text-white rounded-full p-3">
                  <div className="text-2xl">"</div>
                </div>
                
                {/* Rating */}
                <div className="flex mb-4 mt-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <div key={i} className="text-yellow-400 text-xl">★</div>
                  ))}
                </div>
                
                {/* Testimonial Text */}
                <p className="text-gray-600 mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                
                {/* Author Info */}
                <div className="border-t pt-4">
                  <div className="font-bold text-gray-800">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.position}</div>
                  <div className="text-sm text-blue-600 font-semibold">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-blue-600 rounded-2xl p-12 text-white">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-blue-100">Clientes Atendidos</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Projetos Realizados</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10+</div>
              <div className="text-blue-100">Anos de Experiência</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Satisfação dos Clientes</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Junte-se aos nossos clientes satisfeitos
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Descubra como podemos ajudar sua empresa a alcançar novos patamares de eficiência 
            com nossas soluções em automação hidráulica e pneumática.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
            Solicitar Proposta
          </button>
        </div>
      </div>
    </section>
  )
}

export default Clients

