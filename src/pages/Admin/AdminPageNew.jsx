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
import { Input } from '@/components/ui/input'
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, useSidebar } from '@/components/ui/sidebar'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/contexts/AuthContext'

// Import existing managers
import GalleryManager from './GalleryManager'
import ClientsManager from './ClientsManager'
import ProductsManager from './ProductsManager'

// Import new content managers
import HeroManager from './ContentManagers/HeroManager'
import ServicesManager from './ContentManagers/ServicesManager'

const AdminPageNew = () => {
  const [activeSection, setActiveSection] = useState("dashboard")
  const { logout } = useAuth()
  const { open, toggleSidebar } = useSidebar()

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

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Seção em Desenvolvimento
              </h3>
              <p className="text-sm text-gray-600">
                Esta seção ainda está em construção. Volte em breve!
              </p>
            </div>
          </div>
        )
    }
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <Helmet>
        <title>Administração - FHD Automação Industrial</title>
      </Helmet>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar className="w-64 bg-gray-800 text-white flex-shrink-0">
          <SidebarHeader className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-blue-400" />
              <h2 className="text-xl font-semibold">Admin FHD</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </SidebarHeader>
          <SidebarContent className="flex-1 overflow-y-auto">
            <SidebarMenu>
              {navigationItems.map((item) => (
                <React.Fragment key={item.id}>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveSection(item.id)}
                      isActive={activeSection === item.id}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {open && item.label}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {item.children && (
                    <ul className="ml-8 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <SidebarMenuButton
                            onClick={() => setActiveSection(child.id)}
                            isActive={activeSection === child.id}
                          >
                            <child.icon className="h-4 w-4 mr-2" />
                            {open && child.label}
                          </SidebarMenuButton>
                        </li>
                      ))}
                    </ul>
                  )}
                </React.Fragment>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center space-x-3 mb-3">
              <Avatar>
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Admin</p>
                <p className="text-xs text-gray-400">admin@fhdautomacao.com.br</p>
              </div>
            </div>
            <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm p-4 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">FHD Automação Industrial</h1>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5 text-gray-600" />
              </Button>
              <Avatar>
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}




