import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle, Play, Award, Users, Wrench } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useCountAnimation } from '@/hooks/useScrollAnimation'
import { useRef } from 'react'

const Hero = () => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // Counter animations
  const [costRef, costCount] = useCountAnimation(25, 2000, 500)
  const [productsRef, productsCount] = useCountAnimation(30, 2000, 700)
  const [sectorsRef, sectorsCount] = useCountAnimation(10, 2000, 900)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }

  const pulseAnimation = {
    scale: [1, 1.1, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }

  return (
    <section 
      ref={containerRef}
      id="home" 
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background with Industrial Pattern */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 md:from-slate-900 md:via-slate-800 md:to-blue-900 from-blue-50 via-blue-100 to-blue-200"
      >
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <motion.div 
            animate={floatingAnimation}
            className="absolute top-20 left-20 w-32 h-32 border border-blue-400 rotate-45"
          />
          <motion.div 
            animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 0.5 } }}
            className="absolute top-40 right-32 w-24 h-24 border border-blue-300 rotate-12"
          />
          <motion.div 
            animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 1 } }}
            className="absolute bottom-32 left-40 w-28 h-28 border border-blue-500 -rotate-12"
          />
          <motion.div 
            animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 1.5 } }}
            className="absolute bottom-20 right-20 w-36 h-36 border border-blue-400 rotate-45"
          />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-transparent md:from-blue-900/50 md:to-transparent from-blue-200/30 to-transparent"></div>
      </motion.div>

      {/* Floating Elements */}
      <motion.div 
        animate={pulseAnimation}
        className="absolute top-1/4 right-1/4 w-2 h-2 bg-blue-400 rounded-full"
      />
      <motion.div 
        animate={{ ...pulseAnimation, transition: { ...pulseAnimation.transition, delay: 1 } }}
        className="absolute top-1/3 right-1/3 w-1 h-1 bg-yellow-400 rounded-full"
      />
      <motion.div 
        animate={{ ...pulseAnimation, transition: { ...pulseAnimation.transition, delay: 0.5 } }}
        className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-blue-300 rounded-full"
      />

      <div className="container mx-auto px-4 py-32 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Content */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center bg-gradient-to-r from-blue-600/20 to-blue-800/20 backdrop-blur-sm border border-blue-400/30 rounded-full px-6 py-3"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Award className="text-yellow-400 mr-2" size={20} />
              </motion.div>
              <span className="text-blue-100 md:text-blue-100 text-blue-800 font-semibold">Líderes em Automação Industrial</span>
            </motion.div>

            {/* Main Heading */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white md:text-white text-gray-800 leading-tight">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  Automação{' '}
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent"
                >
                  Hidráulica
                </motion.span>{' '}
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                >
                  e{' '}
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.8 }}
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"
                >
                  Pneumática
                </motion.span>
              </h1>
              <motion.p 
                variants={itemVariants}
                className="text-lg md:text-xl lg:text-2xl text-blue-100 md:text-blue-100 text-gray-700 leading-relaxed max-w-2xl"
              >
                Transformamos desafios industriais em soluções eficientes com mais de{' '}
                <span className="text-yellow-400 font-bold">10 anos</span> de experiência 
                e tecnologia de ponta.
              </motion.p>
            </motion.div>

            {/* Stats with Counter Animation */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-3 gap-4 md:gap-8 py-8"
            >
              <motion.div 
                ref={costRef}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white md:text-white text-gray-800 mb-2">
                  {costCount}%
                </div>
                <div className="text-blue-300 md:text-blue-300 text-gray-600 text-xs md:text-sm">Redução de Custos</div>
              </motion.div>
              <motion.div 
                ref={productsRef}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white md:text-white text-gray-800 mb-2">
                  {productsCount}+
                </div>
                <div className="text-blue-300 md:text-blue-300 text-gray-600 text-xs md:text-sm">Produtos no Catálogo</div>
              </motion.div>
              <motion.div 
                ref={sectorsRef}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white md:text-white text-gray-800 mb-2">
                  {sectorsCount}+
                </div>
                <div className="text-blue-300 md:text-blue-300 text-gray-600 text-xs md:text-sm">Setores Atendidos</div>
              </motion.div>
            </motion.div>

            {/* Benefits */}
            <motion.div variants={itemVariants} className="space-y-3 md:space-y-4">
              {[
                "Projetos personalizados e sob medida",
                "Suporte técnico especializado 24/7",
                "Tecnologia de ponta e inovação constante"
              ].map((benefit, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5 + index * 0.2, duration: 0.6 }}
                  whileHover={{ x: 10 }}
                  className="flex items-center space-x-3 md:space-x-4 group cursor-pointer"
                >
                  <motion.div 
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                    className="bg-green-500/20 p-2 rounded-lg group-hover:bg-green-500/30 transition-colors flex-shrink-0"
                  >
                    <CheckCircle className="text-green-400" size={18} />
                  </motion.div>
                  <span className="text-blue-100 md:text-blue-100 text-gray-700 text-sm md:text-base">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 md:px-8 py-3 md:py-4 rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 text-sm md:text-base w-full sm:w-auto"
                  onClick={() => window.location.href = '/orcamento'}
                >
                  Solicitar Orçamento Gratuito
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="ml-2" size={18} />
                  </motion.div>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white/30 text-white hover:bg-white hover:text-slate-900 font-semibold px-6 md:px-8 py-3 md:py-4 rounded-xl backdrop-blur-sm transition-all duration-300 text-sm md:text-base w-full sm:w-auto"
                >
                  <Play className="mr-2" size={18} />
                  Ver Nossos Projetos
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Visual/Image Section */}
          <motion.div 
            variants={slideInRight}
            className="relative mt-8 lg:mt-0"
          >
            {/* Main Card */}
            <motion.div 
              whileHover={{ scale: 1.02, rotateY: 5 }}
              transition={{ duration: 0.3 }}
              className="relative bg-gradient-to-br from-white/10 to-white/5 md:from-white/10 md:to-white/5 from-white/90 to-white/95 backdrop-blur-lg rounded-3xl p-4 md:p-6 lg:p-8 border border-white/20 md:border-white/20 border-gray-200 shadow-2xl"
            >
              {/* Industrial Equipment Visualization */}
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white md:text-white text-gray-800">Nossos Diferenciais</h3>
                  <motion.div 
                    animate={pulseAnimation}
                    className="bg-green-500 w-3 h-3 rounded-full"
                  />
                </div>
                
                {/* Equipment Grid */}
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  {[
                    { icon: Wrench, title: "Experiência", subtitle: "Mais de 10 anos", color: "blue" },
                    { icon: Users, title: "Preço Justo", subtitle: "Soluções que cabem no seu bolso", color: "yellow" },
                    { icon: Award, title: "Qualidade", subtitle: "Certificada", color: "green" },
                    { icon: CheckCircle, title: "Atendimento", subtitle: "Vamos até sua empresa", color: "purple" }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 2 + index * 0.1, duration: 0.5 }}
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      className={`bg-gradient-to-br from-${item.color}-500/20 to-${item.color}-600/20 rounded-xl p-3 md:p-4 border border-${item.color}-400/30 cursor-pointer`}
                    >
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <item.icon className={`text-${item.color}-400 mb-2`} size={20} />
                      </motion.div>
                      <div className="text-white md:text-white text-gray-800 font-semibold text-xs md:text-sm">{item.title}</div>
                      <div className={`text-${item.color}-300 text-xs`}>{item.subtitle}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Performance Indicator */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.5, duration: 0.8 }}
                  className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-3 md:p-4 border border-green-400/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white md:text-white text-gray-800 font-semibold text-xs md:text-sm">Satisfação do Cliente</span>
                    <span className="text-green-400 font-bold text-sm md:text-base">100%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "98.5%" }}
                      transition={{ delay: 3, duration: 2, ease: "easeOut" }}
                      className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full"
                    />
                  </div>
                </motion.div>
              </div>

              {/* Floating Badges */}
              <motion.div 
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-3 -right-3 md:-top-4 md:-right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 rounded-full p-2 md:p-3 shadow-lg"
              >
                <Award size={20} />
              </motion.div>
              <motion.div 
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-3 -left-3 md:-bottom-4 md:-left-4 bg-gradient-to-r from-blue-400 to-cyan-400 text-white rounded-full p-2 md:p-3 shadow-lg"
              >
                <Wrench size={20} />
              </motion.div>
            </motion.div>

            {/* Background Glow */}
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-400/20 rounded-3xl blur-3xl -z-10"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex flex-col items-center space-y-2 text-white/60 md:text-white/60 text-gray-600">
          <span className="text-sm">Role para baixo</span>
                      <div className="w-6 h-10 border-2 border-white/30 md:border-white/30 border-gray-400 rounded-full flex justify-center">
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-3 bg-white/60 md:bg-white/60 bg-gray-600 rounded-full mt-2"
            />
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default Hero

