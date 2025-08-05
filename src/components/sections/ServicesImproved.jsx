import { Settings, Wrench, Zap, Cog, Hammer, Workflow, Gauge, ArrowRight, CheckCircle } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useEffect, useState, useRef } from 'react'
import { servicesAPI } from '@/api/services'

const IconComponent = ({ iconName, size }) => {
  const icons = {
    Settings: Settings,
    Wrench: Wrench,
    Zap: Zap,
    Cog: Cog,
    Hammer: Hammer,
    Workflow: Workflow,
    Gauge: Gauge,
    ArrowRight: ArrowRight,
    CheckCircle: CheckCircle,
  }
  const Icon = icons[iconName]
  return Icon ? <Icon size={size} /> : null
}

const Services = () => {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  // Scroll-based animations
  const [headerRef, headerVisible] = useScrollAnimation(0.2)
  const [servicesRef, servicesVisible] = useScrollAnimation(0.1)
  const [ctaRef, ctaVisible] = useScrollAnimation(0.3)

  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await servicesAPI.getActive()
        setServices(data)
      } catch (err) {
        console.warn("Erro ao carregar serviços da API:", err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  if (loading) return <div className="text-center py-20">Carregando serviços...</div>
  if (error) return <div className="text-center py-20 text-red-500">Erro ao carregar serviços: {error.message}</div>

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: "from-blue-500/10 to-blue-600/10",
        border: "border-blue-200",
        icon: "text-blue-600",
        iconBg: "bg-blue-100",
        accent: "text-blue-600",
        hover: "hover:border-blue-400"
      },
      green: {
        bg: "from-green-500/10 to-green-600/10",
        border: "border-green-200",
        icon: "text-green-600",
        iconBg: "bg-green-100",
        accent: "text-green-600",
        hover: "hover:border-green-400"
      },
      yellow: {
        bg: "from-yellow-500/10 to-yellow-600/10",
        border: "border-yellow-200",
        icon: "text-yellow-600",
        iconBg: "bg-yellow-100",
        accent: "text-yellow-600",
        hover: "hover:border-yellow-400"
      },
      purple: {
        bg: "from-purple-500/10 to-purple-600/10",
        border: "border-purple-200",
        icon: "text-purple-600",
        iconBg: "bg-purple-100",
        accent: "text-purple-600",
        hover: "hover:border-purple-400"
      },
      red: {
        bg: "from-red-500/10 to-red-600/10",
        border: "border-red-200",
        icon: "text-red-600",
        iconBg: "bg-red-100",
        accent: "text-red-600",
        hover: "hover:border-red-400"
      },
      indigo: {
        bg: "from-indigo-500/10 to-indigo-600/10",
        border: "border-indigo-200",
        icon: "text-indigo-600",
        iconBg: "bg-indigo-100",
        accent: "text-indigo-600",
        hover: "hover:border-indigo-400"
      },
      orange: {
        bg: "from-orange-500/10 to-orange-600/10",
        border: "border-orange-200",
        icon: "text-orange-600",
        iconBg: "bg-orange-100",
        accent: "text-orange-600",
        hover: "hover:border-orange-400"
      }
    }
    return colors[color] || colors.blue
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const headerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const floatingAnimation = {
    y: [-3, 3, -3],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }

  return (
    <section 
      ref={sectionRef}
      id="servicos" 
      className="py-20 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden"
    >
      {/* Background Elements */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 opacity-5">
        <motion.div 
          animate={floatingAnimation}
          className="absolute top-40 left-10 w-20 h-20 border border-blue-400 rotate-45"
        />
        <motion.div 
          animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 1 } }}
          className="absolute bottom-40 right-10 w-16 h-16 border border-blue-300 rotate-12"
        />
        <motion.div 
          animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 0.5 } }}
          className="absolute top-1/2 left-1/2 w-24 h-24 border border-blue-500 -rotate-12"
        />
      </motion.div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          ref={headerRef}
          variants={headerVariants}
          initial="hidden"
          animate={headerVisible ? "visible" : "hidden"}
          className="text-center mb-20"
        >
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={headerVisible ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center bg-blue-100 text-blue-800 px-6 py-2 rounded-full mb-6"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Settings className="mr-2" size={20} />
            </motion.div>
            <span className="font-semibold">Soluções Especializadas</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={headerVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
          >
            Nossos Serviços
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={headerVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
          >
            Na <span className="font-bold text-blue-600">FHD Automação Industrial</span>, oferecemos uma ampla gama de serviços especializados 
            para atender às necessidades variadas da indústria com <span className="font-semibold text-blue-600">excelência e inovação</span>.
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <motion.div 
          ref={servicesRef}
          variants={containerVariants}
          initial="hidden"
          animate={servicesVisible ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-20"
        >
          {services.map((service, index) => {
            const colorClasses = getColorClasses(service.color)
            return (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.03, 
                  y: -10,
                  rotateY: 5,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                transition={{ duration: 0.3 }}
                className={`group bg-gradient-to-br ${colorClasses.bg} backdrop-blur-sm border ${colorClasses.border} ${colorClasses.hover} rounded-2xl p-6 md:p-8 hover:shadow-2xl transition-all duration-500 cursor-pointer`}
              >
                <motion.div 
                  className={`${colorClasses.iconBg} rounded-2xl p-4 w-20 h-20 flex items-center justify-center mb-6 group-hover:shadow-lg transition-all duration-300`}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className={`${colorClasses.icon}`}
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {service.icon_name && <IconComponent iconName={service.icon_name} size={40} />}
                  </motion.div>
                </motion.div>
                
                <motion.h3 
                  className="text-lg md:text-xl font-bold text-gray-800 mb-4 group-hover:text-gray-900 transition-colors duration-300"
                  initial={{ opacity: 0 }}
                  animate={servicesVisible ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  {service.title}
                </motion.h3>
                
                <motion.p 
                  className="text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700 transition-colors duration-300 text-sm md:text-base"
                  initial={{ opacity: 0 }}
                  animate={servicesVisible ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {service.description}
                </motion.p>
                
                {/* Features */}
                <div className="space-y-2 mb-6">
                  {service.features && service.features.map((feature, featureIndex) => (
                    <motion.div 
                      key={featureIndex} 
                      className="flex items-center space-x-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={servicesVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ delay: 0.7 + index * 0.1 + featureIndex * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CheckCircle className={`${colorClasses.accent} flex-shrink-0`} size={16} />
                      </motion.div>
                      <span className="text-xs md:text-sm text-gray-600">{feature}</span>
                    </motion.div>
                  ))}
                </div>
                
                {/* Learn More Button */}
                <motion.button 
                  className={`group/btn flex items-center space-x-2 ${colorClasses.accent} font-semibold text-sm hover:underline transition-all duration-300`}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <span>Saiba mais</span>
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight size={16} />
                  </motion.div>
                </motion.button>
              </motion.div>
            )
          })}
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          ref={ctaRef}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={ctaVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="bg-white/10 rounded-full p-4 w-20 h-20 mx-auto mb-8 flex items-center justify-center"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="text-yellow-400" size={40} />
            </motion.div>
            
            <motion.h3 
              className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={ctaVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Pronto para Impulsionar Seu Negócio?
            </motion.h3>
            
            <motion.p 
              className="text-lg md:text-xl mb-10 text-blue-100 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={ctaVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Na FHD Automação Industrial, estamos comprometidos em impulsionar o seu negócio para o futuro 
              com soluções de automação <span className="font-semibold text-yellow-400">inovadoras e confiáveis</span>.
            </motion.p>
            
            {/* Benefits */}
            <motion.div 
              className="grid md:grid-cols-3 gap-4 md:gap-6 mb-10"
              initial={{ opacity: 0 }}
              animate={ctaVisible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {[
                "Orçamento Gratuito",
                "Atendimento 24/7",
                "Garantia Estendida"
              ].map((benefit, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center justify-center space-x-2 text-blue-100"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={ctaVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                  >
                    <CheckCircle className="text-green-400 flex-shrink-0" size={16} />
                  </motion.div>
                  <span>{benefit}</span>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={ctaVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <motion.button 
                className="group bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-blue-900 font-bold px-6 md:px-8 py-3 md:py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Solicitar Orçamento</span>
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight size={16} />
                </motion.div>
              </motion.button>
              <motion.button 
                className="group border-2 border-white text-white hover:bg-white hover:text-blue-700 font-bold px-6 md:px-8 py-3 md:py-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Falar com Especialista</span>
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight size={16} />
                </motion.div>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Services

