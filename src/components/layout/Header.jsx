import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Menu, X, Home, Users, Settings, UserCheck, MessageCircle } from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const isHomePage = location.pathname === '/'

  return (
    <header className="fixed w-full z-50 bg-white shadow-lg">
      <div className="container mx-auto px-4 py-2 lg:py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="relative mr-2 lg:mr-3">
              <img 
                src="/logo.png" 
                alt="FHD Automação Industrial Logo" 
                className="h-8 lg:h-10 w-auto transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div>
              <h1 className="text-base lg:text-lg font-bold text-gray-800">
                FHD Automação Industrial
              </h1>
              <p className="text-xs text-gray-600">
                Excelência em Automação
              </p>
            </div>
          </Link>

          {/* Desktop Navigation - Estilo do site de referência */}
          <nav className="hidden lg:flex items-center space-x-2">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                location.pathname === '/' 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700'
              }`}
            >
              <Home size={16} />
              <span>Início</span>
            </Link>
            <Link 
              to="/quem-somos" 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                location.pathname === '/quem-somos' 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
              }`}
            >
              <Users size={16} />
              <span>Quem Somos</span>
            </Link>
            <Link 
              to="/servicos" 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                location.pathname === '/servicos' 
                  ? 'bg-orange-500 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700'
              }`}
            >
              <Settings size={16} />
              <span>Nossos Serviços</span>
            </Link>
            <a 
              href={isHomePage ? "#clientes" : "/#clientes"}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 bg-gray-100 text-gray-700 hover:bg-yellow-100 hover:text-yellow-700"
            >
              <UserCheck size={16} />
              <span>Nossos Clientes</span>
            </a>
            <Link 
              to="/contato" 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                location.pathname === '/contato' 
                  ? 'bg-purple-500 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700'
              }`}
            >
              <MessageCircle size={16} />
              <span>Contato</span>
            </Link>
          </nav>

          {/* CTA Button - Removido conforme solicitado */}
          <div className="hidden lg:block">
            <Link to="/contato">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Solicitar Orçamento
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg transition-all duration-300 border-2 text-gray-700 hover:bg-gray-100 border-gray-300 hover:border-blue-500 transform hover:scale-105 active:scale-95"
            onClick={toggleMenu}
            aria-label="Menu de navegação"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-3 pb-4 border-t pt-4 rounded-b-lg transition-all duration-300 border-gray-200 bg-white/95 backdrop-blur-md shadow-lg">
            <div className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className={`flex items-center space-x-3 font-medium py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  location.pathname === '/' 
                    ? 'bg-green-500 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Home size={18} />
                <span>Início</span>
              </Link>
              <Link 
                to="/quem-somos" 
                className={`flex items-center space-x-3 font-medium py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  location.pathname === '/quem-somos' 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Users size={18} />
                <span>Quem Somos</span>
              </Link>
              <Link 
                to="/servicos" 
                className={`flex items-center space-x-3 font-medium py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  location.pathname === '/servicos' 
                    ? 'bg-orange-500 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings size={18} />
                <span>Nossos Serviços</span>
              </Link>
              <a 
                href={isHomePage ? "#clientes" : "/#clientes"}
                className="flex items-center space-x-3 font-medium py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-105 bg-gray-100 text-gray-700 hover:bg-yellow-100 hover:text-yellow-700"
                onClick={() => setIsMenuOpen(false)}
              >
                <UserCheck size={18} />
                <span>Nossos Clientes</span>
              </a>
              <Link 
                to="/contato" 
                className={`flex items-center space-x-3 font-medium py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  location.pathname === '/contato' 
                    ? 'bg-purple-500 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <MessageCircle size={18} />
                <span>Contato</span>
              </Link>
              <div className="pt-3 border-t border-gray-200/20">
                <Link to="/contato" onClick={() => setIsMenuOpen(false)}>
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold w-full py-2 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
                    Solicitar Orçamento
                  </Button>
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header

