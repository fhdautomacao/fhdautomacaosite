import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  Shield, 
  BarChart3,
  FileText,
  Wrench,
  Package,
  Image,
  Building,
  MessageSquare,
  Globe,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  Eye,
  Edit,
  Upload,
  Search,
  Filter,
  MoreVertical,
  Home,
  TrendingUp,
  Calendar,
  Bell,
  DollarSign,
  Calculator,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useAuth } from '@/contexts/AuthContext'
import { useOverdueChecker } from '@/hooks/useOverdueChecker'
import { menuPrefsAPI } from '@/api/menuPrefs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'

// Import existing managers (mantidos para compatibilidade)
import GalleryManager from './GalleryManager'
import ClientsManager from './ClientsManager'
import ProductsManager from './ProductsManager'
import QuotationsManager from './QuotationsManager'
import BillsManager from './BillsManager'
import CompaniesManager from './CompaniesManager'
import ProfitSharingManager from './ProfitSharingManager'
import AdvancedDashboard from './AdvancedDashboard'
import CostsManager from './CostsManager'

// Import new refactored managers (usando Headless UI + react-select)
import ProductsManagerRefactored from './ProductsManagerRefactored'
import GalleryManagerRefactored from './GalleryManagerRefactored'
import ProfitSharingManagerRefactored from './ProfitSharingManagerRefactored'

// Import new content managers
import ServicesManager from './ContentManagers/ServicesManager'
import QuotationNotification from '@/components/QuotationNotification'
import NotificationSettings from '@/components/NotificationSettings'
import MobileOptimizations from '@/components/MobileOptimizations'

const AdminPageNewRefactored = () => {
  const [activeSection, setActiveSection] = useState('dashboard')
  // Sidebar sempre aberto no desktop, fechado no mobile por padrão
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [menuSearch, setMenuSearch] = useState('')
  const [visibilityMap, setVisibilityMap] = useState({})
  const [manageMenuOpen, setManageMenuOpen] = useState(false)
  const [manageSearch, setManageSearch] = useState('')
  const { logout, userPermissions, user } = useAuth()
  const [accountOpen, setAccountOpen] = useState(false)
  
  // Ativar verificação automática de boletos vencidos
  useOverdueChecker(true, 30) // Verificar a cada 30 minutos

  // Função utilitária para detectar mobile
  const isMobile = () => window.innerWidth < 1024

  // Detectar mudanças de tamanho de tela e definir estado inicial
  useEffect(() => {
    // Definir estado inicial baseado no tamanho da tela
    setSidebarOpen(window.innerWidth >= 1024)

    const handleResize = () => {
      // No desktop (lg+), sempre manter sidebar aberto
      if (!isMobile()) {
        setSidebarOpen(true)
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Deep-linking: abrir seção e detalhe via query (?open=bills&billId=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const open = params.get('open')
    if (open && navigationItems.some(i => i.id === open)) {
      setActiveSection(open)
    }
  }, [])

  // Carregar preferências de menu
  useEffect(() => {
    async function loadPrefs() {
      try {
        const prefs = await menuPrefsAPI.getMenuPreferences()
        setVisibilityMap(prefs)
      } catch (error) {
        console.error('Erro ao carregar preferências:', error)
      }
    }
    loadPrefs()
  }, [])

  const handleLogout = () => {
    logout()
  }

  // Configuração de navegação
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      color: 'blue',
      description: 'Visão geral e estatísticas'
    },
    {
      id: 'services',
      label: 'Serviços',
      icon: Wrench,
      color: 'green',
      description: 'Gerenciar serviços oferecidos'
    },
    {
      id: 'gallery',
      label: 'Galeria',
      icon: Image,
      color: 'purple',
      description: 'Gerenciar fotos e imagens'
    },
    {
      id: 'clients',
      label: 'Clientes',
      icon: User,
      color: 'orange',
      description: 'Gerenciar clientes'
    },
    {
      id: 'products',
      label: 'Produtos',
      icon: Package,
      color: 'indigo',
      description: 'Gerenciar produtos'
    },
    {
      id: 'quotations',
      label: 'Orçamentos',
      icon: FileText,
      color: 'teal',
      description: 'Gerenciar orçamentos'
    },
    {
      id: 'bills',
      label: 'Boletos',
      icon: DollarSign,
      color: 'emerald',
      description: 'Gerenciar boletos'
    },
    {
      id: 'costs',
      label: 'Custos',
      icon: Calculator,
      color: 'red',
      description: 'Gerenciar custos'
    },
    {
      id: 'companies',
      label: 'Empresas',
      icon: Building,
      color: 'blue',
      description: 'Gerenciar empresas'
    },
    {
      id: 'profit-sharing',
      label: 'Divisão de Lucros',
      icon: TrendingUp,
      color: 'green',
      description: 'Gerenciar divisão de lucros'
    },
    {
      id: 'notifications',
      label: 'Notificações',
      icon: Bell,
      color: 'yellow',
      description: 'Configurar notificações'
    }
  ]

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-500 text-white',
      green: 'bg-green-500 text-white',
      purple: 'bg-purple-500 text-white',
      orange: 'bg-orange-500 text-white',
      indigo: 'bg-indigo-500 text-white',
      teal: 'bg-teal-500 text-white',
      emerald: 'bg-emerald-500 text-white',
      red: 'bg-red-500 text-white',
      yellow: 'bg-yellow-500 text-black'
    }
    return colorMap[color] || 'bg-gray-500 text-white'
  }

  const getActivityIcon = (type) => {
    const iconMap = {
      'user-login': User,
      'file-upload': Upload,
      'data-export': TrendingUp,
      'system-update': Settings
    }
    return iconMap[type] || Settings
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdvancedDashboard onNavigateToSection={setActiveSection} />

      case 'services':
        return <ServicesManager />

      case 'gallery':
        // Usar versão refatorada com Headless UI + react-select
        return <GalleryManagerRefactored />

      case 'clients':
        return <ClientsManager />

      case 'products':
        // Usar versão refatorada com Headless UI + react-select
        return <ProductsManagerRefactored />

      case 'quotations':
        return userPermissions.canAccessQuotations ? <QuotationsManager /> : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Acesso Negado</h3>
              <p className="text-gray-600">Você não tem permissão para acessar esta seção.</p>
            </div>
          </div>
        )

      case 'bills':
        return userPermissions.canAccessBills ? <BillsManager /> : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Acesso Negado</h3>
              <p className="text-gray-600">Você não tem permissão para acessar esta seção.</p>
            </div>
          </div>
        )

      case 'costs':
        return userPermissions.canAccessBills ? <CostsManager /> : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Acesso Negado</h3>
              <p className="text-gray-600">Você não tem permissão para acessar esta seção.</p>
            </div>
          </div>
        )

      case 'companies':
        return userPermissions.canAccessBills ? <CompaniesManager /> : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Acesso Negado</h3>
              <p className="text-gray-600">Você não tem permissão para acessar esta seção.</p>
            </div>
          </div>
        )

      case 'profit-sharing':
        // Usar versão refatorada com Headless UI + react-select
        return userPermissions.canAccessBills ? <ProfitSharingManagerRefactored /> : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Acesso Negado</h3>
              <p className="text-gray-600">Você não tem permissão para acessar esta seção.</p>
            </div>
          </div>
        )

      case 'notifications':
        return <NotificationSettings />

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Seção em Desenvolvimento
              </h3>
              <p className="text-gray-600">
                Esta funcionalidade será implementada em breve.
              </p>
            </div>
          </div>
        )
    }
  }

  return (
    <>
      <Helmet>
        <title>Administração - FHD Automação Industrial</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">Admin</h1>
                  <p className="text-xs text-gray-500">FHD Automação</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navigationItems
                .filter(item => visibilityMap[item.id] !== false)
                .map((item) => {
                  const Icon = item.icon
                  const isActive = activeSection === item.id
                  
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                      <div className="flex-1">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </motion.button>
                  )
                })}
            </nav>

            {/* User Account */}
            <div className="p-4 border-t border-gray-200">
              <DropdownMenu open={accountOpen} onOpenChange={setAccountOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg text-left hover:bg-gray-50 transition-colors">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {user?.email || 'Usuário'}
                      </div>
                      <div className="text-xs text-gray-500">Administrador</div>
                    </div>
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
          {/* Top Bar */}
          <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-semibold text-gray-900">
                  {navigationItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
                </h2>
              </div>
              
              <div className="flex items-center space-x-4">
                <QuotationNotification />
                <MobileOptimizations />
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminPageNewRefactored
