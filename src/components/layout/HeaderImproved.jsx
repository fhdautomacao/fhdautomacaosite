import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Menu, X, Home, Users, Settings, UserCheck, MessageCircle, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const location = useLocation()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Detect scroll for header background change
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

  const navItems = [
    { path: '/', label: 'Início', icon: Home, color: 'green' },
    { path: '/quem-somos', label: 'Quem Somos', icon: Users, color: 'blue' },
    { path: '/servicos', label: 'Serviços', icon: Settings, color: 'orange' },
    { path: '/clientes', label: 'Clientes', icon: UserCheck, color: 'yellow' },
    { path: '/contato', label: 'Contato', icon: MessageCircle, color: 'purple' }
  ]

  const headerVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const logoVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.2
      }
    }
  }

  const navItemVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const mobileMenuVariants = {
    initial: { 
      opacity: 0, 
      height: 0,
      y: -20
    },
    animate: { 
      opacity: 1, 
      height: 'auto',
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const mobileItemVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const getNavItemClasses = (path, color) => {
    const isActive = location.pathname === path
    return `px-3 md:px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 relative overflow-hidden ${
      isActive 
        ? `bg-${color}-500 text-white shadow-md` 
        : `bg-gray-100 text-gray-700 hover:bg-${color}-100 hover:text-${color}-700`
    }`
  }

  const getMobileNavItemClasses = (path, color) => {
    const isActive = location.pathname === path
    return `flex items-center space-x-3 font-medium py-3 px-4 rounded-lg transition-all duration-300 relative overflow-hidden ${
      isActive 
        ? `bg-${color}-500 text-white shadow-md` 
        : `bg-gray-100 text-gray-700 hover:bg-${color}-100 hover:text-${color}-700`
    }`
  }

  return (
    <motion.header 
      variants={headerVariants}
      initial="initial"
      animate="animate"
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200/20' 
          : 'bg-white shadow-lg'
      }`}
    >
      <div className="container mx-auto px-4 py-2 lg:py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div variants={logoVariants}>
            <Link to="/" className="flex items-center group">
              <motion.div 
                className="relative mr-2 lg:mr-3"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                {!logoError ? (
                  <img 
                    src="/logo.png" 
                    alt="FHD Automação Industrial Logo" 
                    className="h-8 lg:h-10 w-auto transition-transform duration-300"
                    onLoad={() => {
                      console.log('Logo carregado com sucesso (HeaderImproved)');
                    }}
                    onError={(e) => {
                      console.error('Erro ao carregar logo (HeaderImproved):', e.target.src);
                      console.error('Erro details:', e);
                      setLogoError(true);
                    }}
                  />
                ) : (
                  <div className="h-8 lg:h-10 w-8 lg:w-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">FHD</span>
                  </div>
                )}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
              <div>
                <motion.h1 
                  className="text-base lg:text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  FHD Automação Industrial
                </motion.h1>
                <motion.p 
                  className="text-xs text-gray-600 group-hover:text-blue-500 transition-colors duration-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Excelência em Automação
                </motion.p>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                variants={navItemVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Link to={item.path}>
                  <motion.div
                    className={getNavItemClasses(item.path, item.color)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      animate={{ rotate: location.pathname === item.path ? 360 : 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <item.icon size={16} />
                    </motion.div>
                    <span className="text-sm xl:text-base">{item.label}</span>
                    
                    {/* Active indicator */}
                    {location.pathname === item.path && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                        layoutId="activeTab"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* CTA Button */}
          <motion.div 
            className="hidden lg:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Link to="/orcamento">
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-4 xl:px-6 py-2 rounded-lg shadow-lg transition-all duration-300 text-sm xl:text-base">
                  <motion.span
                    animate={{ x: [0, 2, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Solicitar Orçamento
                  </motion.span>
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden p-2 rounded-lg transition-all duration-300 border-2 text-gray-700 hover:bg-gray-100 border-gray-300 hover:border-blue-500"
            onClick={toggleMenu}
            aria-label="Menu de navegação"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{ rotate: isMenuOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={20} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              variants={mobileMenuVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="lg:hidden mt-3 pb-4 border-t pt-4 rounded-b-lg border-gray-200 bg-white/95 backdrop-blur-md shadow-lg overflow-hidden"
            >
              <div className="flex flex-col space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    variants={mobileItemVariants}
                  >
                    <Link to={item.path}>
                      <motion.div
                        className={getMobileNavItemClasses(item.path, item.color)}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <motion.div
                          animate={{ rotate: location.pathname === item.path ? 360 : 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <item.icon size={18} />
                        </motion.div>
                        <span>{item.label}</span>
                        
                        {/* Active indicator */}
                        {location.pathname === item.path && (
                          <motion.div
                            className="absolute right-2 w-2 h-2 bg-white rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
                
                <motion.div 
                  variants={mobileItemVariants}
                  className="pt-3 border-t border-gray-200/20"
                >
                  <Link to="/orcamento" onClick={() => setIsMenuOpen(false)}>
                    <motion.div
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold px-4 py-3 rounded-lg flex items-center justify-center space-x-2 shadow-lg"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <MessageCircle size={18} />
                      <span>Solicitar Orçamento</span>
                    </motion.div>
                  </Link>
                </motion.div>
                
                <motion.div 
                  variants={mobileItemVariants}
                  className="pt-2"
                >
                  <Link to="/contato" onClick={() => setIsMenuOpen(false)}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold w-full py-3 rounded-lg shadow-lg transition-all duration-300">
                        <motion.span
                          animate={{ x: [0, 2, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          Solicitar Orçamento
                        </motion.span>
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

export default Header

