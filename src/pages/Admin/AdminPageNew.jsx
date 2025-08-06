import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  Shield, 
  BarChart3,
  FileText,
  Target,
  Users as UsersIcon,
  Wrench,
  Phone,
  Package,
  Tag,
  Image,
  Folder,
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
  Save,
  Upload,
  Search,
  Filter,
  MoreVertical,
  Home,
  TrendingUp,
  Calendar,
  Bell
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/contexts/AuthContext'

// Import existing managers
import GalleryManager from './GalleryManager'
import ClientsManager from './ClientsManager'
import ProductsManager from './ProductsManager'
import QuotationsManager from './QuotationsManager'
import BillsManager from './BillsManager'

// Import new content managers
import HeroManager from './ContentManagers/HeroManager'
import ServicesManager from './ContentManagers/ServicesManager'
import QuotationNotification from '@/components/QuotationNotification'

const AdminPageNew = () => {
  console.log('AdminPageNew - Componente carregado')
  const [activeSection, setActiveSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { logout, userPermissions } = useAuth()

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
        { id: 'hero', label: 'Seção Hero', icon: Target },
        { id: 'about', label: 'Sobre Nós', icon: UsersIcon },
        { id: 'services', label: 'Serviços', icon: Wrench },
        { id: 'contact', label: 'Contato', icon: Phone }
      ]
    },
    {
      id: 'catalog',
      label: 'Catálogo',
      icon: Package,
      section: 'catalog',
      children: [
        { id: 'products', label: 'Produtos', icon: Package },
        { id: 'categories', label: 'Categorias', icon: Tag }
      ]
    },
    {
      id: 'media',
      label: 'Mídia',
      icon: Image,
      section: 'media',
      children: [
        { id: 'gallery', label: 'Galeria', icon: Image },
        { id: 'files', label: 'Arquivos', icon: Folder }
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
      id: 'settings',
      label: 'Configurações',
      icon: Settings,
      section: 'settings',
      children: [
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
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Visão geral do seu site e atividades recentes</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Últimos 30 dias
                </Button>
                <Button size="sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Ver Relatório
                </Button>
              </div>
            </div>

            {/* Notification Banner */}
            <QuotationNotification variant="banner" />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardStats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                          <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {stat.change}
                          </p>
                        </div>
                        <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                          <stat.icon className="h-6 w-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>Acesse rapidamente as funcionalidades mais utilizadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col space-y-2"
                    onClick={() => setActiveSection('products')}
                  >
                    <Plus className="h-6 w-6" />
                    <span>Novo Produto</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col space-y-2"
                    onClick={() => setActiveSection('gallery')}
                  >
                    <Upload className="h-6 w-6" />
                    <span>Upload Foto</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col space-y-2"
                    onClick={() => setActiveSection('clients')}
                  >
                    <Building className="h-6 w-6" />
                    <span>Novo Cliente</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col space-y-2"
                    onClick={() => setActiveSection('hero')}
                  >
                    <Edit className="h-6 w-6" />
                    <span>Editar Hero</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Atividades Recentes</span>
                </CardTitle>
                <CardDescription>
                  Últimas alterações realizadas no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {activity.item}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-xs text-gray-500">{activity.time}</p>
                        <p className="text-xs text-gray-400">por {activity.user}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'hero':
        return <HeroManager />

      case 'about':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Sobre Nós</h1>
                <p className="text-gray-600">Edite as informações da empresa</p>
              </div>
              <Button size="sm">
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Informações da Empresa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">Título da Seção</label>
                  <Input placeholder="Sobre a FHD Automação" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Texto Principal</label>
                  <textarea 
                    className="w-full mt-1 p-3 border border-gray-300 rounded-md resize-none"
                    rows={6}
                    placeholder="Conte a história da empresa..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Missão</label>
                    <textarea 
                      className="w-full mt-1 p-3 border border-gray-300 rounded-md resize-none"
                      rows={3}
                      placeholder="Nossa missão..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Visão</label>
                    <textarea 
                      className="w-full mt-1 p-3 border border-gray-300 rounded-md resize-none"
                      rows={3}
                      placeholder="Nossa visão..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Valores</label>
                    <textarea 
                      className="w-full mt-1 p-3 border border-gray-300 rounded-md resize-none"
                      rows={3}
                      placeholder="Nossos valores..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'services':
        return <ServicesManager />

      case 'contact':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Informações de Contato</h1>
                <p className="text-gray-600">Edite as informações de contato da empresa</p>
              </div>
              <Button size="sm">
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Telefone Principal</label>
                    <Input placeholder="(19) 99865-2144" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">E-mail Comercial</label>
                    <Input placeholder="comercial@fhdautomacao.com.br" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Endereço</label>
                    <textarea 
                      className="w-full mt-1 p-3 border border-gray-300 rounded-md resize-none"
                      rows={3}
                      placeholder="R. João Ediberti Biondo, 336..."
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Horário de Funcionamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Segunda a Sexta</label>
                    <Input placeholder="8h às 18h" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Sábado</label>
                    <Input placeholder="8h às 12h" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Domingo</label>
                    <Input placeholder="Fechado" className="mt-1" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

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
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: sidebarOpen ? 0 : -300 }}
          transition={{ duration: 0.3 }}
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Admin FHD</h1>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <nav className="mt-6 px-3">
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
                      className="w-full justify-start"
                      onClick={() => setActiveSection(item.id)}
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      {item.label}
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
                              className="w-full justify-start"
                              onClick={() => setActiveSection(child.id)}
                            >
                              <child.icon className="h-4 w-4 mr-3" />
                              {child.label}
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

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <div className="flex items-center space-x-3 mb-3">
              <Avatar>
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Admin</p>
                <p className="text-xs text-gray-500 truncate">admin@fhdautomacao.com.br</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <Home className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">/</span>
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {activeSection}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Ver Site
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
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

