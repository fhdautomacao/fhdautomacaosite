import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle, Play, Award, Users, Wrench } from 'lucide-react'

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background with Industrial Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-blue-400 rotate-45"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border border-blue-300 rotate-12"></div>
          <div className="absolute bottom-32 left-40 w-28 h-28 border border-blue-500 -rotate-12"></div>
          <div className="absolute bottom-20 right-20 w-36 h-36 border border-blue-400 rotate-45"></div>
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-transparent"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
      <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse delay-500"></div>

      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center bg-gradient-to-r from-blue-600/20 to-blue-800/20 backdrop-blur-sm border border-blue-400/30 rounded-full px-6 py-3">
              <Award className="text-yellow-400 mr-2" size={20} />
              <span className="text-blue-100 font-semibold">Líderes em Automação Industrial</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight">
                Automação{' '}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Hidráulica
                </span>{' '}
                e{' '}
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Pneumática
                </span>
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-blue-100 leading-relaxed max-w-2xl">
                Transformamos desafios industriais em soluções eficientes com mais de{' '}
                <span className="text-yellow-400 font-bold">10 anos</span> de experiência 
                e tecnologia de ponta.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 py-8">
              <div className="text-center">
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">25%</div>
                <div className="text-blue-300 text-xs md:text-sm">Redução de Custos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">30+</div>
                <div className="text-blue-300 text-xs md:text-sm">Produtos no Catálogo</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">10+</div>
                <div className="text-blue-300 text-xs md:text-sm">Setores Atendidos</div>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center space-x-3 md:space-x-4 group">
                <div className="bg-green-500/20 p-2 rounded-lg group-hover:bg-green-500/30 transition-colors flex-shrink-0">
                  <CheckCircle className="text-green-400" size={18} />
                </div>
                <span className="text-blue-100 text-sm md:text-base">Projetos personalizados e sob medida</span>
              </div>
              <div className="flex items-center space-x-3 md:space-x-4 group">
                <div className="bg-green-500/20 p-2 rounded-lg group-hover:bg-green-500/30 transition-colors flex-shrink-0">
                  <CheckCircle className="text-green-400" size={18} />
                </div>
                <span className="text-blue-100 text-sm md:text-base">Suporte técnico especializado</span>
              </div>
              <div className="flex items-center space-x-3 md:space-x-4 group">
                <div className="bg-green-500/20 p-2 rounded-lg group-hover:bg-green-500/30 transition-colors flex-shrink-0">
                  <CheckCircle className="text-green-400" size={18} />
                </div>
                <span className="text-blue-100 text-sm md:text-base">Tecnologia de ponta e inovação constante</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 md:px-8 py-3 md:py-4 rounded-xl shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 text-sm md:text-base"
              >
                Solicitar Orçamento Gratuito
                <ArrowRight className="ml-2" size={18} />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white/30 text-white hover:bg-white hover:text-slate-900 font-semibold px-6 md:px-8 py-3 md:py-4 rounded-xl backdrop-blur-sm transition-all duration-300 text-sm md:text-base"
              >
                <Play className="mr-2" size={18} />
                Ver Nossos Projetos
              </Button>
            </div>
          </div>

          {/* Visual/Image Section */}
          <div className="relative mt-8 lg:mt-0">
            {/* Main Card */}
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-4 md:p-6 lg:p-8 border border-white/20 shadow-2xl">
              {/* Industrial Equipment Visualization */}
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white">Nossos Diferenciais</h3>
                  <div className="bg-green-500 w-3 h-3 rounded-full animate-pulse"></div>
                </div>
                
                {/* Equipment Grid */}
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-3 md:p-4 border border-blue-400/30">
                    <Wrench className="text-blue-400 mb-2" size={20} />
                    <div className="text-white font-semibold text-xs md:text-sm">Experiência</div>
                    <div className="text-blue-300 text-xs">Mais de 10 anos</div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl p-3 md:p-4 border border-yellow-400/30">
                    <Users className="text-yellow-400 mb-2" size={20} />
                    <div className="text-white font-semibold text-xs md:text-sm">Preço Justo</div>
                    <div className="text-yellow-300 text-xs">Soluções que cabem no seu bolso</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-3 md:p-4 border border-green-400/30">
                    <Award className="text-green-400 mb-2" size={20} />
                    <div className="text-white font-semibold text-xs md:text-sm">Qualidade</div>
                    <div className="text-green-300 text-xs">Certificada</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-3 md:p-4 border border-purple-400/30">
                    <CheckCircle className="text-purple-400 mb-2" size={20} />
                    <div className="text-white font-semibold text-xs md:text-sm">Atendimento</div>
                    <div className="text-purple-300 text-xs">Vamos até sua empresa</div>
                  </div>
                </div>

                {/* Performance Indicator */}
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-3 md:p-4 border border-green-400/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold text-xs md:text-sm">Satisfação do Cliente</span>
                    <span className="text-green-400 font-bold text-sm md:text-base">100%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full w-[98.5%]"></div>
                  </div>
                </div>
              </div>

              {/* Floating Badges */}
              <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 rounded-full p-2 md:p-3 shadow-lg">
                <Award size={20} />
              </div>
              <div className="absolute -bottom-3 -left-3 md:-bottom-4 md:-left-4 bg-gradient-to-r from-blue-400 to-cyan-400 text-white rounded-full p-2 md:p-3 shadow-lg">
                <Wrench size={20} />
              </div>
            </div>

            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-400/20 rounded-3xl blur-3xl -z-10"></div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center space-y-2 text-white/60">
          <span className="text-sm">Role para baixo</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero