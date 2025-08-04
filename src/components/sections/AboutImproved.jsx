import { Target, Eye, Heart, Award, Users, Zap } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useScrollAnimation, useCountAnimation } from '@/hooks/useScrollAnimation'
import { useRef } from 'react'

const About = () => {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  // Scroll-based animations
  const [headerRef, headerVisible] = useScrollAnimation(0.2)
  const [contentRef, contentVisible] = useScrollAnimation(0.3)
  const [cardRef, cardVisible] = useScrollAnimation(0.2)
  const [valuesRef, valuesVisible] = useScrollAnimation(0.1)

  // Counter animations
  const [experienceRef, experienceCount] = useCountAnimation(10, 2000, 200)
  const [projectsRef, projectsCount] = useCountAnimation(500, 2500, 400)
  const [satisfactionRef, satisfactionCount] = useCountAnimation(100, 2000, 600)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
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

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const floatingAnimation = {
    y: [-5, 5, -5],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }

  return (
    <section 
      ref={sectionRef}
      id="quem-somos" 
      className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden"
    >
      {/* Background Elements */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 opacity-5">
        <motion.div 
          animate={floatingAnimation}
          className="absolute top-20 left-20 w-32 h-32 border border-blue-400 rotate-45"
        />
        <motion.div 
          animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 1 } }}
          className="absolute bottom-20 right-20 w-24 h-24 border border-blue-300 rotate-12"
        />
      </motion.div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          ref={headerRef}
          variants={containerVariants}
          initial="hidden"
          animate={headerVisible ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center bg-blue-100 text-blue-800 px-6 py-2 rounded-full mb-6"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Award className="mr-2" size={20} />
            </motion.div>
            <span className="font-semibold">Conheça Nossa História</span>
          </motion.div>
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
          >
            Quem Somos
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
          >
            Bem-vindo à <span className="font-bold text-blue-600">FHD Automação Industrial</span>, sua parceira confiável em soluções de automação hidráulica e pneumática.
          </motion.p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div 
            ref={contentRef}
            variants={slideInLeft}
            initial="hidden"
            animate={contentVisible ? "visible" : "hidden"}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={contentVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-base md:text-lg text-gray-700 leading-relaxed"
              >
                Desde a nossa fundação na cidade de <span className="font-semibold text-blue-600">Sumaré, estado de São Paulo</span>, temos nos dedicado apaixonadamente 
                ao fornecimento de serviços de alta qualidade e soluções inovadoras para as necessidades industriais 
                mais desafiadoras.
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={contentVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-base md:text-lg text-gray-700 leading-relaxed"
              >
                Com uma equipe de especialistas experientes e dedicados, a FHD Automação Industrial se destaca como 
                líder no setor, oferecendo uma ampla gama de serviços especializados para atender às demandas em 
                constante evolução do mercado.
              </motion.p>
            </div>
            
            {/* Stats with Counter Animation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <motion.div 
                ref={experienceRef}
                whileHover={{ scale: 1.05, rotateY: 10 }}
                transition={{ duration: 0.3 }}
                className="text-center p-4 md:p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={contentVisible ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
                  className="text-2xl md:text-3xl font-bold text-blue-600 mb-2"
                >
                  {experienceCount}+
                </motion.div>
                <div className="text-xs md:text-sm text-gray-600">Anos de Experiência</div>
              </motion.div>
              <motion.div 
                ref={projectsRef}
                whileHover={{ scale: 1.05, rotateY: 10 }}
                transition={{ duration: 0.3 }}
                className="text-center p-4 md:p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={contentVisible ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
                  className="text-2xl md:text-3xl font-bold text-green-600 mb-2"
                >
                  {projectsCount}+
                </motion.div>
                <div className="text-xs md:text-sm text-gray-600">Projetos Realizados</div>
              </motion.div>
              <motion.div 
                ref={satisfactionRef}
                whileHover={{ scale: 1.05, rotateY: 10 }}
                transition={{ duration: 0.3 }}
                className="text-center p-4 md:p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={contentVisible ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: 1, duration: 0.5, type: "spring" }}
                  className="text-2xl md:text-3xl font-bold text-yellow-600 mb-2"
                >
                  {satisfactionCount}%
                </motion.div>
                <div className="text-xs md:text-sm text-gray-600">Satisfação</div>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            ref={cardRef}
            variants={slideInRight}
            initial="hidden"
            animate={cardVisible ? "visible" : "hidden"}
          >
            <motion.div 
              whileHover={{ scale: 1.02, rotateY: 5 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl p-6 md:p-8 border border-blue-100 hover:shadow-3xl transition-all duration-500"
            >
              <div className="text-center">
                <motion.div 
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-6 md:p-8 w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 md:mb-8 flex items-center justify-center shadow-lg"
                >
                  <div className="text-4xl md:text-6xl">🏭</div>
                </motion.div>
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  animate={cardVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
                >
                  Automação Industrial
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={cardVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-gray-600 text-base md:text-lg leading-relaxed mb-6 md:mb-8"
                >
                  Especialistas em soluções hidráulicas e pneumáticas para otimizar seus processos industriais com 
                  <span className="font-semibold text-blue-600"> tecnologia de ponta</span> e 
                  <span className="font-semibold text-green-600"> resultados comprovados</span>.
                </motion.p>
                
                {/* Features */}
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  {[
                    { icon: Zap, text: "Tecnologia Avançada", color: "yellow" },
                    { icon: Users, text: "Equipe Especializada", color: "blue" },
                    { icon: Award, text: "Qualidade Certificada", color: "green" },
                    { icon: Heart, text: "Atendimento Personalizado", color: "red" }
                  ].map((feature, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={cardVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="flex items-center space-x-2 text-xs md:text-sm text-gray-600 cursor-pointer"
                    >
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <feature.icon className={`text-${feature.color}-500`} size={16} />
                      </motion.div>
                      <span>{feature.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Mission, Vision, Values */}
        <motion.div 
          ref={valuesRef}
          variants={containerVariants}
          initial="hidden"
          animate={valuesVisible ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-6 md:gap-8"
        >
          {[
            {
              icon: Target,
              title: "Missão",
              content: "Impulsionamos o progresso industrial com excelência em automação hidráulica e pneumática. Fornecemos soluções inovadoras e confiáveis, superando expectativas e construindo relacionamentos sólidos baseados em confiança, integridade e qualidade.",
              color: "blue",
              gradient: "from-blue-100 to-blue-200"
            },
            {
              icon: Eye,
              title: "Visão",
              content: "Buscamos liderança global em automação industrial, promovendo eficiência, sustentabilidade e inovação. Com parcerias estratégicas e investimentos em tecnologia, somos a primeira escolha para soluções de automação hidráulica e pneumática de excelência.",
              color: "yellow",
              gradient: "from-yellow-100 to-yellow-200"
            },
            {
              icon: Heart,
              title: "Valores",
              content: "Buscamos excelência em serviços e satisfação do cliente. Inovações impulsionam nosso progresso, agimos com integridade e transparência. Apaixonados pelo trabalho, superamos expectativas com resultados excepcionais.",
              color: "green",
              gradient: "from-green-100 to-green-200"
            }
          ].map((item, index) => (
            <motion.div 
              key={index}
              variants={scaleIn}
              whileHover={{ 
                scale: 1.05, 
                rotateY: 10,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              }}
              transition={{ duration: 0.3 }}
              className="group bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
              <motion.div 
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.5 }}
                className={`bg-gradient-to-br ${item.gradient} rounded-full p-4 md:p-6 w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 md:mb-8 flex items-center justify-center group-hover:shadow-lg transition-all duration-300`}
              >
                <item.icon className={`text-${item.color}-600`} size={28} />
              </motion.div>
              <motion.h3 
                className={`text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 group-hover:text-${item.color}-600 transition-colors duration-300`}
              >
                {item.title}
              </motion.h3>
              <motion.p 
                className="text-sm md:text-base text-gray-600 leading-relaxed"
              >
                {item.content.split('.').map((sentence, sentenceIndex) => (
                  <motion.span
                    key={sentenceIndex}
                    initial={{ opacity: 0 }}
                    animate={valuesVisible ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.5 + index * 0.2 + sentenceIndex * 0.1, duration: 0.8 }}
                  >
                    {sentence}{sentenceIndex < item.content.split('.').length - 1 ? '. ' : ''}
                  </motion.span>
                ))}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default About

