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
import { useJWTAuth } from '@/contexts/JWTAuthContext'
import { useOverdueChecker } from '@/hooks/useOverdueChecker'
import { menuPrefsAPI } from '@/api/menuPrefs'
import AdminModal from '@/components/admin/AdminModal'
import { ModalActionButton, ModalSection, ModalGrid } from '@/components/admin/AdminModal'
import { Switch } from '@/components/ui/switch'
import AdminHeader from '@/components/AdminHeader'

// Import existing managers
import GalleryManager from './GalleryManager'
import ClientsManager from './ClientsManager'
import ProductsManager from './ProductsManager'
import QuotationsManager from './QuotationsManager'
import BillsManager from './BillsManager'
import CompaniesManager from './CompaniesManager'
import ProfitSharingManager from './ProfitSharingManager'
import AdvancedDashboard from './AdvancedDashboard'
import CostsManager from './CostsManager'

// Import new content managers
import ServicesManager from './ContentManagers/ServicesManager'
import QuotationNotification from '@/components/QuotationNotification'
import NotificationSettings from '@/components/NotificationSettings'
import MobileOptimizations from '@/components/MobileOptimizations'
import SEOManager from './SEOManager'

const AdminPageNew = () => {
  const [activeSection, setActiveSection] = useState('dashboard')
  // Sidebar sempre aberto no desktop, fechado no mobile por padrão
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [menuSearch, setMenuSearch] = useState('')
  const [visibilityMap, setVisibilityMap] = useState({})
  const [manageMenuOpen, setManageMenuOpen] = useState(false)
  const [manageSearch, setManageSearch] = useState('')
  const { logout, user, userPermissions } = useJWTAuth()
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
      // se veio de uma empresa específica, abrir o modal de detalhes dela automaticamente
      if (open === 'companies') {
        // opcionalmente poderíamos destacar a empresa pelo companyId
      }
    }
  }, [])

  // Carregar preferências de visibilidade do menu ao iniciar
  useEffect(() => {
    async function loadPrefs() {
      try {
        const map = await menuPrefsAPI.getMap()
        setVisibilityMap(map)
      } catch {
        // silencioso
      }
    }
    loadPrefs()
  }, [])

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
      id: 'costs',
      label: 'Custos',
      icon: DollarSign,
      section: 'costs',
      children: [
        { id: 'costs', label: 'Gestão de Custos', icon: DollarSign }
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

      case 'seo':
        return <SEOManager />

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

      <div className="min-h-screen bg-gray-50 flex flex-col touch-target">
        {/* Admin Header */}
        <AdminHeader 
          onManageMenu={() => setManageMenuOpen(true)} 
          activeSection={activeSection}
        />
        
        <div className="flex flex-1">
          {/* Sidebar */}
          <motion.aside
            initial={false}
            animate={{ 
              x: !isMobile() ? 0 : (sidebarOpen ? 0 : -300)
            }}
            transition={{ duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-50 w-64 sm:w-72 bg-white shadow-lg lg:static lg:inset-0 flex flex-col"
          >
          <div className="h-16 px-4 sm:px-6 border-b flex items-center">
            <div className="grid items-center w-full gap-2 [grid-template-columns:1fr_auto]">
              {/* Buscar seção no lugar da logo */}
              <div className="relative">
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input value={menuSearch} onChange={e=>setMenuSearch(e.target.value)} placeholder="Buscar seção..." className="pl-9 w-full h-11 text-base rounded-lg" />
              </div>
              {/* Botão fechar (apenas mobile) */}
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <nav className="mt-4 px-3 flex-1 pb-4">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                // Verificar permissões
                if (item.requiresPermission && !userPermissions[item.requiresPermission]) {
                  return null
                }
                
                const hidden = visibilityMap[item.id] === false
                const matches = !menuSearch || item.label.toLowerCase().includes(menuSearch.toLowerCase())
                if (hidden || !matches) return null
                return (
                  <div key={item.id}>
                    <Button
                      variant={activeSection === item.id ? "secondary" : "ghost"}
                      className="w-full justify-start h-11 text-sm font-medium"
                      onClick={() => {
                        setActiveSection(item.id)
                        // Fechar sidebar apenas no mobile
                        if (isMobile()) {
                          setSidebarOpen(false)
                        }
                      }}
                    >
                      <item.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Button>
                    {activeSection === item.id && (
                      <div className="ml-10 -mt-2 mb-2 flex gap-2">
                        <Button variant="ghost" size="sm" onClick={async()=>{
                          const newVal = !(visibilityMap[item.id] === false)
                          await menuPrefsAPI.setVisibility(item.id, !newVal)
                          setVisibilityMap(prev=>({ ...prev, [item.id]: !newVal }))
                        }}>
                          {visibilityMap[item.id] === false ? 'Mostrar' : 'Ocultar'}
                        </Button>
                      </div>
                    )}
                    {item.children && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.children.map((child) => {
                          // Verificar permissões para children também
                          if (item.requiresPermission && !userPermissions[item.requiresPermission]) {
                            return null
                          }
                          const childHidden = visibilityMap[child.id] === false
                          const childMatches = !menuSearch || child.label.toLowerCase().includes(menuSearch.toLowerCase())
                          if (childHidden || !childMatches) return null
                          
                          return (
                            <Button
                              key={child.id}
                              variant={activeSection === child.id ? "secondary" : "ghost"}
                              size="sm"
                              className="w-full justify-start h-9 text-sm"
                              onClick={() => {
                                setActiveSection(child.id)
                                // Fechar sidebar apenas no mobile
                                if (isMobile()) {
                                  setSidebarOpen(false)
                                }
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
        </motion.aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header simplificado com botão de menu mobile */}
          <header className="bg-white shadow-sm border-b h-14 sm:h-16 flex items-center px-3 sm:px-6 relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </header>

          {/* Content */}
          <main className="flex-1 p-3 sm:p-4 lg:p-6 scroll-container safe-area-inset-bottom">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="max-w-full"
            >
              {renderContent()}
            </motion.div>
          </main>
        </div>
        </div>

        {/* Overlay for mobile (sempre abaixo da sidebar) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>
      
      {/* Notifications */}
      <QuotationNotification />

      {/* Dialog de Gerenciamento do Menu */}
      <AdminModal
        open={manageMenuOpen}
        onOpenChange={setManageMenuOpen}
        title="Gerenciar visibilidade do menu"
        description="Oculte ou mostre seções. Suas preferências ficam salvas nesta conta."
        type="edit"
        size="2xl"
      >
        <div className="space-y-6">
          <ModalSection title="Configurações de Visibilidade">
            <div className="mb-3">
              <Input placeholder="Buscar seção..." value={manageSearch} onChange={e=>setManageSearch(e.target.value)} />
            </div>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {navigationItems.map(item => {
                const itemMatch = !manageSearch || item.label.toLowerCase().includes(manageSearch.toLowerCase())
                return (
                  <div key={item.id} className="border rounded-md p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{item.label}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{visibilityMap[item.id] === false ? 'Oculta' : 'Visível'}</span>
                        <Switch checked={!(visibilityMap[item.id] === false)} onCheckedChange={async(checked)=>{
                          await menuPrefsAPI.setVisibility(item.id, checked)
                          setVisibilityMap(prev=>({ ...prev, [item.id]: checked }))
                        }} />
                      </div>
                    </div>
                    {item.children && itemMatch && (
                      <div className="mt-2 space-y-1">
                        {item.children
                          .filter(child => !manageSearch || child.label.toLowerCase().includes(manageSearch.toLowerCase()))
                          .map(child => (
                            <div key={child.id} className="flex items-center justify-between pl-4">
                              <span className="text-sm">{child.label}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-600">{visibilityMap[child.id] === false ? 'Oculta' : 'Visível'}</span>
                                <Switch checked={!(visibilityMap[child.id] === false)} onCheckedChange={async(checked)=>{
                                  await menuPrefsAPI.setVisibility(child.id, checked)
                                  setVisibilityMap(prev=>({ ...prev, [child.id]: checked }))
                                }} />
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </ModalSection>
        </div>
      </AdminModal>
    </>
  )
}

export default AdminPageNew

