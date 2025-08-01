import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Menu, X, Phone, Mail, MapPin, ChevronDown } from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const isHomePage = location.pathname === '/'

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled || !isHomePage
        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
        : 'bg-transparent'
    }`}>
      {/* Top Bar */}
      <div className={`transition-all duration-300 ${
        (isScrolled || !isHomePage) ? 'h-0 overflow-hidden' : 'h-auto'
      } bg-slate-900 text-white`}>
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-col lg:flex-row justify-between items-center text-sm">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 mb-2 lg:mb-0">
              <div className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
                <Phone size={14} />
                <span>(19) 99865-2144</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
                <Mail size={14} />
                <span>comercial@fhdautomacao.com.br</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
              <MapPin size={14} />
              <span>R. João Ediberti Biondo, 336 - Jd. Res. Ravagnani, Sumaré - SP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-3 rounded-xl mr-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <div className="text-2xl font-bold">FHD</div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
            </div>
            <div>
              <h1 className={`text-xl font-bold transition-colors duration-300 ${
                (isScrolled || !isHomePage) ? 'text-gray-800' : 'text-white'
              }`}>
                FHD Automação Industrial
              </h1>
              <p className={`text-sm transition-colors duration-300 ${
                (isScrolled || !isHomePage) ? 'text-gray-600' : 'text-blue-100'
              }`}>
                Excelência em Automação
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`relative font-medium transition-all duration-300 hover:scale-105 ${
                (isScrolled || !isHomePage)
                  ? 'text-gray-700 hover:text-blue-600' 
                  : 'text-white hover:text-blue-300'
              } group ${location.pathname === '/' ? 'text-blue-600' : ''}`}
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/quem-somos" 
              className={`relative font-medium transition-all duration-300 hover:scale-105 ${
                (isScrolled || !isHomePage)
                  ? 'text-gray-700 hover:text-blue-600' 
                  : 'text-white hover:text-blue-300'
              } group ${location.pathname === '/quem-somos' ? 'text-blue-600' : ''}`}
            >
              Quem Somos
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <div className="relative group">
              <Link 
                to="/servicos" 
                className={`flex items-center font-medium transition-all duration-300 hover:scale-105 ${
                  (isScrolled || !isHomePage)
                    ? 'text-gray-700 hover:text-blue-600' 
                    : 'text-white hover:text-blue-300'
                } ${location.pathname === '/servicos' ? 'text-blue-600' : ''}`}
              >
                Nossos Serviços
                <ChevronDown size={16} className="ml-1 transition-transform duration-300 group-hover:rotate-180" />
              </Link>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </div>
            <a 
              href={isHomePage ? "#clientes" : "/#clientes"}
              className={`relative font-medium transition-all duration-300 hover:scale-105 ${
                (isScrolled || !isHomePage)
                  ? 'text-gray-700 hover:text-blue-600' 
                  : 'text-white hover:text-blue-300'
              } group`}
            >
              Nossos Clientes
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <Link 
              to="/contato" 
              className={`relative font-medium transition-all duration-300 hover:scale-105 ${
                (isScrolled || !isHomePage)
                  ? 'text-gray-700 hover:text-blue-600' 
                  : 'text-white hover:text-blue-300'
              } group ${location.pathname === '/contato' ? 'text-blue-600' : ''}`}
            >
              Contato
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link to="/contato">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Solicitar Orçamento
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2 rounded-lg transition-all duration-300 ${
              (isScrolled || !isHomePage)
                ? 'text-gray-700 hover:bg-gray-100' 
                : 'text-white hover:bg-white/10'
            }`}
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-gray-200/20 pt-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`font-medium transition-colors duration-300 ${
                  (isScrolled || !isHomePage)
                    ? 'text-gray-700 hover:text-blue-600' 
                    : 'text-white hover:text-blue-300'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/quem-somos" 
                className={`font-medium transition-colors duration-300 ${
                  (isScrolled || !isHomePage)
                    ? 'text-gray-700 hover:text-blue-600' 
                    : 'text-white hover:text-blue-300'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Quem Somos
              </Link>
              <Link 
                to="/servicos" 
                className={`font-medium transition-colors duration-300 ${
                  (isScrolled || !isHomePage)
                    ? 'text-gray-700 hover:text-blue-600' 
                    : 'text-white hover:text-blue-300'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Nossos Serviços
              </Link>
              <a 
                href={isHomePage ? "#clientes" : "/#clientes"}
                className={`font-medium transition-colors duration-300 ${
                  (isScrolled || !isHomePage)
                    ? 'text-gray-700 hover:text-blue-600' 
                    : 'text-white hover:text-blue-300'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Nossos Clientes
              </a>
              <Link 
                to="/contato" 
                className={`font-medium transition-colors duration-300 ${
                  (isScrolled || !isHomePage)
                    ? 'text-gray-700 hover:text-blue-600' 
                    : 'text-white hover:text-blue-300'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </Link>
              <Link to="/contato" onClick={() => setIsMenuOpen(false)}>
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold w-full rounded-lg shadow-lg">
                  Solicitar Orçamento
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header

