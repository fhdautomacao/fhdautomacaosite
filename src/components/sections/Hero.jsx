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
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                Automação{' '}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Hidráulica
                </span>{' '}
                e{' '}
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Pneumática
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed max-w-2xl">
                Transformamos desafios industriais em soluções eficientes com mais de{' '}
                <span className="text-yellow-400 font-bold">10 anos</span> de experiência 
                e tecnologia de ponta.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 py-8">
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">500+</div>
                <div className="text-blue-300 text-sm">Projetos Realizados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">100+</div>
                <div className="text-blue-300 text-sm">Clientes Atendidos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">98%</div>
                <div className="text-blue-300 text-sm">Satisfação</div>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4 group">
                <div className="bg-green-500/20 p-2 rounded-lg group-hover:bg-green-500/30 transition-colors">
                  <CheckCircle className="text-green-400" size={20} />
                </div>
                <span className="text-blue-100">Projetos personalizados e sob medida</span>
              </div>
              <div className="flex items-center space-x-4 group">
                <div className="bg-green-500/20 p-2 rounded-lg group-hover:bg-green-500/30 transition-colors">
                  <CheckCircle className="text-green-400" size={20} />
                </div>
                <span className="text-blue-100">Suporte técnico especializado 24/7</span>
              </div>
              <div className="flex items-center space-x-4 group">
                <div className="bg-green-500/20 p-2 rounded-lg group-hover:bg-green-500/30 transition-colors">
                  <CheckCircle className="text-green-400" size={20} />
                </div>
                <span className="text-blue-100">Tecnologia de ponta e inovação constante</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-4 rounded-xl shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300"
              >
                Solicitar Orçamento Gratuito
                <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white/30 text-white hover:bg-white hover:text-slate-900 font-semibold px-8 py-4 rounded-xl backdrop-blur-sm transition-all duration-300"
              >
                <Play className="mr-2" size={20} />
                Ver Nossos Projetos
              </Button>
            </div>
          </div>

          {/* Visual/Image Section */}
          <div className="relative">
            {/* Main Card */}
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              {/* Industrial Equipment Visualization */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">Sistemas Integrados</h3>
                  <div className="bg-green-500 w-3 h-3 rounded-full animate-pulse"></div>
                </div>
                
                {/* Equipment Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-4 border border-blue-400/30">
                    <Wrench className="text-blue-400 mb-2" size={24} />
                    <div className="text-white font-semibold text-sm">Hidráulica</div>
                    <div className="text-blue-300 text-xs">Sistema Ativo</div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl p-4 border border-yellow-400/30">
                    <Users className="text-yellow-400 mb-2" size={24} />
                    <div className="text-white font-semibold text-sm">Pneumática</div>
                    <div className="text-yellow-300 text-xs">Operacional</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-4 border border-green-400/30">
                    <Award className="text-green-400 mb-2" size={24} />
                    <div className="text-white font-semibold text-sm">Controle</div>
                    <div className="text-green-300 text-xs">Monitorado</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-4 border border-purple-400/30">
                    <CheckCircle className="text-purple-400 mb-2" size={24} />
                    <div className="text-white font-semibold text-sm">Automação</div>
                    <div className="text-purple-300 text-xs">Integrado</div>
                  </div>
                </div>

                {/* Performance Indicator */}
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-4 border border-green-400/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">Eficiência do Sistema</span>
                    <span className="text-green-400 font-bold">98.5%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full w-[98.5%]"></div>
                  </div>
                </div>
              </div>

              {/* Floating Badges */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 rounded-full p-3 shadow-lg">
                <Award size={24} />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-400 to-cyan-400 text-white rounded-full p-3 shadow-lg">
                <Wrench size={24} />
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

