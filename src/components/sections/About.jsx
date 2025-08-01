import { Target, Eye, Heart, Award, Users, Zap } from 'lucide-react'

const About = () => {
  return (
    <section id="quem-somos" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border border-blue-400 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-blue-300 rotate-12 animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-6 py-2 rounded-full mb-6">
            <Award className="mr-2" size={20} />
            <span className="font-semibold">Conheça Nossa História</span>
          </div>
          <h2 className="text-5xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Quem Somos
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Bem-vindo à <span className="font-bold text-blue-600">FHD Automação Industrial</span>, sua parceira confiável em soluções de automação hidráulica e pneumática.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-8 animate-slide-in-left">
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                Desde a nossa fundação na cidade de <span className="font-semibold text-blue-600">Sumaré, estado de São Paulo</span>, temos nos dedicado apaixonadamente 
                ao fornecimento de serviços de alta qualidade e soluções inovadoras para as necessidades industriais 
                mais desafiadoras.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Com uma equipe de especialistas experientes e dedicados, a FHD Automação Industrial se destaca como 
                líder no setor, oferecendo uma ampla gama de serviços especializados para atender às demandas em 
                constante evolução do mercado.
              </p>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="text-3xl font-bold text-blue-600 mb-2">10+</div>
                <div className="text-sm text-gray-600">Anos de Experiência</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
                <div className="text-sm text-gray-600">Projetos Realizados</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="text-3xl font-bold text-yellow-600 mb-2">100%</div>
                <div className="text-sm text-gray-600">Satisfação</div>
              </div>
            </div>
          </div>
          
          <div className="animate-slide-in-right">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl p-8 border border-blue-100 hover:shadow-3xl transition-all duration-500 hover:scale-105">
              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-8 w-32 h-32 mx-auto mb-8 flex items-center justify-center shadow-lg">
                  <div className="text-6xl animate-bounce">🏭</div>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Automação Industrial
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Especialistas em soluções hidráulicas e pneumáticas para otimizar seus processos industriais com 
                  <span className="font-semibold text-blue-600"> tecnologia de ponta</span> e 
                  <span className="font-semibold text-green-600"> resultados comprovados</span>.
                </p>
                
                {/* Features */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Zap className="text-yellow-500" size={16} />
                    <span>Tecnologia Avançada</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="text-blue-500" size={16} />
                    <span>Equipe Especializada</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Award className="text-green-500" size={16} />
                    <span>Qualidade Certificada</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Heart className="text-red-500" size={16} />
                    <span>Atendimento Personalizado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Mission */}
          <div className="group bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in-up delay-100">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-full p-6 w-20 h-20 mx-auto mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Target className="text-blue-600 group-hover:rotate-12 transition-transform duration-300" size={36} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6 group-hover:text-blue-600 transition-colors duration-300">Missão</h3>
            <p className="text-gray-600 leading-relaxed">
              Impulsionamos o progresso industrial com <span className="font-semibold text-blue-600">excelência em automação</span> hidráulica e pneumática. 
              Fornecemos soluções inovadoras e confiáveis, superando expectativas e construindo relacionamentos 
              sólidos baseados em confiança, integridade e qualidade.
            </p>
          </div>

          {/* Vision */}
          <div className="group bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in-up delay-200">
            <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full p-6 w-20 h-20 mx-auto mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Eye className="text-yellow-600 group-hover:rotate-12 transition-transform duration-300" size={36} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6 group-hover:text-yellow-600 transition-colors duration-300">Visão</h3>
            <p className="text-gray-600 leading-relaxed">
              Buscamos <span className="font-semibold text-yellow-600">liderança global</span> em automação industrial, promovendo eficiência, sustentabilidade e inovação. 
              Com parcerias estratégicas e investimentos em tecnologia, somos a primeira escolha para soluções 
              de automação hidráulica e pneumática de excelência.
            </p>
          </div>

          {/* Values */}
          <div className="group bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in-up delay-300">
            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-full p-6 w-20 h-20 mx-auto mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Heart className="text-green-600 group-hover:rotate-12 transition-transform duration-300" size={36} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6 group-hover:text-green-600 transition-colors duration-300">Valores</h3>
            <p className="text-gray-600 leading-relaxed">
              Buscamos <span className="font-semibold text-green-600">excelência em serviços</span> e satisfação do cliente. Inovações impulsionam nosso progresso, 
              agimos com integridade e transparência. Apaixonados pelo trabalho, superamos expectativas com 
              resultados excepcionais.
            </p>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .delay-100 {
          animation-delay: 0.1s;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </section>
  )
}

export default About

