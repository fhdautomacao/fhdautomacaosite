import { Target, Eye, Heart } from 'lucide-react'

const About = () => {
  return (
    <section id="quem-somos" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Quem Somos</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Bem-vindo à FHD Automação Industrial, sua parceira confiável em soluções de automação hidráulica e pneumática.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              Desde a nossa fundação na cidade de Sumaré, estado de São Paulo, temos nos dedicado apaixonadamente 
              ao fornecimento de serviços de alta qualidade e soluções inovadoras para as necessidades industriais 
              mais desafiadoras.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Com uma equipe de especialistas experientes e dedicados, a FHD Automação Industrial se destaca como 
              líder no setor, oferecendo uma ampla gama de serviços especializados para atender às demandas em 
              constante evolução do mercado.
            </p>
            <div className="bg-blue-600 text-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Nossa Experiência</h3>
              <p>
                Mais de uma década de experiência em automação industrial, atendendo empresas de diversos 
                segmentos com soluções personalizadas e eficientes.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <div className="text-4xl">🏭</div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Automação Industrial</h3>
              <p className="text-gray-600">
                Especialistas em soluções hidráulicas e pneumáticas para otimizar seus processos industriais
              </p>
            </div>
          </div>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Mission */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <Target className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Missão</h3>
            <p className="text-gray-600 leading-relaxed">
              Impulsionamos o progresso industrial com excelência em automação hidráulica e pneumática. 
              Fornecemos soluções inovadoras e confiáveis, superando expectativas e construindo relacionamentos 
              sólidos baseados em confiança, integridade e qualidade.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <Eye className="text-yellow-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Visão</h3>
            <p className="text-gray-600 leading-relaxed">
              Buscamos liderança global em automação industrial, promovendo eficiência, sustentabilidade e inovação. 
              Com parcerias estratégicas e investimentos em tecnologia, somos a primeira escolha para soluções 
              de automação hidráulica e pneumática de excelência.
            </p>
          </div>

          {/* Values */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <Heart className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Valores</h3>
            <p className="text-gray-600 leading-relaxed">
              Buscamos excelência em serviços e satisfação do cliente. Inovações impulsionam nosso progresso, 
              agimos com integridade e transparência. Apaixonados pelo trabalho, superamos expectativas com 
              resultados excepcionais.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About

