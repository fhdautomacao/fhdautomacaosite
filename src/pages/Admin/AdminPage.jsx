import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Image, 
  Users, 
  Package, 
  Settings, 
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye,
  Upload,
  LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import GalleryManager from './GalleryManager'
import ClientsManager from './ClientsManager'
import ProductsManager from './ProductsManager'
import { useJWTAuth } from '@/contexts/JWTAuthContext'

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const { logout } = useJWTAuth()

  const handleLogout = () => {
    logout()
  }

  const stats = [
    {
      title: 'Total de Fotos',
      value: '12',
      icon: Image,
      color: 'blue',
      change: '+2 esta semana'
    },
    {
      title: 'Clientes Ativos',
      value: '12',
      icon: Users,
      color: 'green',
      change: '+1 este mês'
    },
    {
      title: 'Produtos Cadastrados',
      value: '11',
      icon: Package,
      color: 'purple',
      change: 'Sem alterações'
    },
    {
      title: 'Visualizações',
      value: '1.2k',
      icon: Eye,
      color: 'orange',
      change: '+15% este mês'
    }
  ]

  const recentActivities = [
    { action: 'Nova foto adicionada', item: 'Unidade Hidráulica em Operação', time: '2 horas atrás' },
    { action: 'Cliente atualizado', item: 'Empresa Industrial A', time: '1 dia atrás' },
    { action: 'Produto editado', item: 'Cilindro Hidráulico', time: '3 dias atrás' },
    { action: 'Foto removida', item: 'Sistema antigo', time: '1 semana atrás' }
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

  return (
    <>
      <Helmet>
        <title>Administração - FHD Automação Industrial</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white shadow-sm border-b"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="p-2 bg-blue-600 rounded-lg"
                >
                  <Shield className="h-6 w-6 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
                  <p className="text-sm text-gray-600">FHD Automação Industrial</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="gallery">Galeria</TabsTrigger>
              <TabsTrigger value="clients">Clientes</TabsTrigger>
              <TabsTrigger value="products">Produtos</TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h2>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                              <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
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

                {/* Recent Activities */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5" />
                        <span>Atividades Recentes</span>
                      </CardTitle>
                      <CardDescription>
                        Últimas alterações no sistema
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentActivities.map((activity, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-gray-900">{activity.action}</p>
                              <p className="text-sm text-gray-600">{activity.item}</p>
                            </div>
                            <span className="text-xs text-gray-500">{activity.time}</span>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value="gallery" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <GalleryManager />
              </motion.div>
            </TabsContent>

            {/* Clients Tab */}
            <TabsContent value="clients" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <ClientsManager />
              </motion.div>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <ProductsManager />
              </motion.div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  )
}

export default AdminPage

