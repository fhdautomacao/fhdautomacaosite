import { useState } from 'react'
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
import { useAuth } from '@/contexts/AuthContext'
import { useOverdueChecker } from '@/hooks/useOverdueChecker'

// Import existing managers
import GalleryManager from './GalleryManager'
import ClientsManager from './ClientsManager'
import ProductsManager from './ProductsManager'
import QuotationsManager from './QuotationsManager'
import BillsManager from './BillsManager'
import CompaniesManager from './CompaniesManager'
import ProfitSharingManager from './ProfitSharingManager'
import AdvancedDashboard from './AdvancedDashboard'

// Import new content managers
import ServicesManager from './ContentManagers/ServicesManager'
import QuotationNotification from '@/components/QuotationNotification'
import NotificationSettings from '@/components/NotificationSettings'
import MobileOptimizations from '@/components/MobileOptimizations'

const AdminPageNew = () => {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { logout, userPermissions } = useAuth()
  
  // Ativar verificação automática de boletos vencidos
  useOverdueChecker(true, 30) // Verificar a cada 30 minutos

  const handleLogout = () => {
    logout()
  }

  // Navigation items
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      section: 'main'
    },
    {
      id: 'content',
      label: 'Conteúdo do Site',
      icon: FileText,
      section: 'content',
      children: [
        { id: 'services', label: 'Serviços', icon: Wrench }
      ]
    },
    {
      id: 'catalog',
      label: 'Catálogo',
      icon: Package,
      section: 'catalog',
      children: [
        { id: 'products', label: 'Produtos', icon: Package }
      ]
    },
    {
      id: 'media',
      label: 'Mídia',
      icon: Image,
      section: 'media',
      children: [
        { id: 'gallery', label: 'Galeria', icon: Image }
      ]
    },
    {
      id: 'relationships',
      label: 'Relacionamentos',
      icon: Building,
      section: 'relationships',
      children: [
        { id: 'clients', label: 'Clientes', icon: Building },
        { id: 'testimonials', label: 'Depoimentos', icon: MessageSquare }
      ]
    },
    {
      id: 'quotations',
      label: 'Orçamentos',
      icon: FileText,
      section: 'quotations',
      children: [
        { id: 'quotations', label: 'Solicitações', icon: FileText }
      ],
      requiresPermission: 'canAccessQuotations'
    },
    {
      id: 'bills',
      label: 'Boletos',
      icon: DollarSign,
      section: 'bills',
      children: [
        { id: 'bills', label: 'Controle de Boletos', icon: DollarSign }
      ],
      requiresPermission: 'canAccessBills'
    },
    {
      id: 'companies',
      label: 'Empresas',
      icon: Building,
      section: 'companies',
      children: [
        { id: 'companies', label: 'Gerenciar Empresas', icon: Building }
      ],
      requiresPermission: 'canAccessBills'
    },
    {
      id: 'profit-sharing',
      label: 'Divisão de Lucros',
      icon: Calculator,
      section: 'profit-sharing',
      children: [
        { id: 'profit-sharing', label: 'Controle de Divisão', icon: Calculator }
      ],
      requiresPermission: 'canAccessBills'
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: Settings,
      section: 'settings',
      children: [
        { id: 'notifications', label: 'Notificações', icon: Bell },
        { id: 'seo', label: 'SEO', icon: Globe },
        { id: 'profile', label: 'Perfil', icon: User }
      ]
    }
  ]

  // Dashboard stats
  const dashboardStats = [
    {
      title: 'Total de Produtos',
      value: '11',
      icon: Package,
      color: 'blue',
      change: '+2 este mês',
      trend: 'up'
    },
    {
      title: 'Fotos na Galeria',
      value: '12',
      icon: Image,
      color: 'green',
      change: '+3 esta semana',
      trend: 'up'
    },
    {
      title: 'Clientes Ativos',
      value: '12',
      icon: Building,
      color: 'purple',
      change: '+1 este mês',
      trend: 'up'
    },
    {
      title: 'Visualizações',
      value: '1.2k',
      icon: Eye,
      color: 'orange',
      change: '+15% este mês',
      trend: 'up'
    }
  ]

  const recentActivities = [
    { 
      action: 'Produto adicionado', 
      item: 'Válvula Proporcional XYZ', 
      time: '2 horas atrás',
      type: 'create',
      user: 'Admin'
    },
    { 
      action: 'Foto atualizada', 
      item: 'Unidade Hidráulica em Operação', 
      time: '5 horas atrás',
      type: 'update',
      user: 'Admin'
    },
    { 
      action: 'Cliente editado', 
      item: 'Empresa Industrial A', 
      time: '1 dia atrás',
      type: 'update',
      user: 'Admin'
    },
    { 
      action: 'Serviço removido', 
      item: 'Manutenção Antiga', 
      time: '2 dias atrás',
      type: 'delete',
      user: 'Admin'
    }
  ]

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500 text-white',
      green: 'bg-green-500 text-white',
      purple: 'bg-purple-500 text-white',
      orange: 'bg-orange-500 text-white'
    }
    return colors[color] || colors.blue
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'create': return <Plus className="h-4 w-4 text-green-600" />
      case 'update': return <Edit className="h-4 w-4 text-blue-600" />
      case 'delete': return <X className="h-4 w-4 text-red-600" />
      default: return <Eye className="h-4 w-4 text-gray-600" />
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdvancedDashboard onNavigateToSection={setActiveSection} />

      case 'services':
        return <ServicesManager />

      case 'gallery':
        return <GalleryManager />

      case 'clients':
        return <ClientsManager />

      case 'products':
        return <ProductsManager />

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
        return userPermissions.canAccessBills ? <ProfitSharingManager /> : (
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
      
      <MobileOptimizations />

      <div className="min-h-screen bg-gray-50 flex touch-target">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: sidebarOpen ? 0 : -300 }}
          transition={{ duration: 0.3 }}
          className={`fixed inset-y-0 left-0 z-50 w-64 sm:w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 border-b">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-gray-900">Admin FHD</h1>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="mt-4 px-3 flex-1 overflow-y-auto">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                // Verificar permissões
                if (item.requiresPermission && !userPermissions[item.requiresPermission]) {
                  return null
                }
                
                return (
                  <div key={item.id}>
                    <Button
                      variant={activeSection === item.id ? "secondary" : "ghost"}
                      className="w-full justify-start h-11 text-sm font-medium"
                      onClick={() => {
                        setActiveSection(item.id)
                        if (window.innerWidth < 1024) setSidebarOpen(false) // Fechar sidebar no mobile
                      }}
                    >
                      <item.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Button>
                    {item.children && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.children.map((child) => {
                          // Verificar permissões para children também
                          if (item.requiresPermission && !userPermissions[item.requiresPermission]) {
                            return null
                          }
                          
                          return (
                            <Button
                              key={child.id}
                              variant={activeSection === child.id ? "secondary" : "ghost"}
                              size="sm"
                              className="w-full justify-start h-9 text-sm"
                              onClick={() => {
                                setActiveSection(child.id)
                                setSidebarOpen(false) // Fechar sidebar no mobile após seleção
                              }}
                            >
                              <child.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                              <span className="truncate">{child.label}</span>
                            </Button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 border-t bg-white">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3">
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                <AvatarFallback className="text-xs sm:text-sm">A</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-900">Admin</p>
                <p className="text-xs text-gray-500 truncate">admin@fhdautomacao.com.br</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full h-9"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="text-sm">Sair</span>
            </Button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white shadow-sm border-b h-14 sm:h-16 flex items-center justify-between px-3 sm:px-6">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Home className="h-4 w-4 text-gray-400 hidden sm:block" />
                <span className="text-sm text-gray-600 hidden sm:block">/</span>
                <span className="text-sm sm:text-base font-medium text-gray-900 capitalize truncate">
                  {activeSection}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-4">
              <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                <Eye className="h-4 w-4 mr-2" />
                Ver Site
              </Button>
              <Button variant="outline" size="sm" className="p-2">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Notificações</span>
              </Button>
              <Button variant="outline" size="sm" className="sm:hidden p-2">
                <Eye className="h-4 w-4" />
                <span className="sr-only">Ver Site</span>
              </Button>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 scroll-container safe-area-inset-bottom">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-full"
            >
              {renderContent()}
            </motion.div>
          </main>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
      
      {/* Notifications */}
      <QuotationNotification />
    </>
  )
}

export default AdminPageNew

