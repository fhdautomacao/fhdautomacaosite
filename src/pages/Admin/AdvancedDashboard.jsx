import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  FileText, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Target,
  Zap,
  Activity,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Filter,
  RefreshCcw,
  Eye,
  Timer,
  CreditCard,
  Banknote,
  Building,
  Calculator,
  PiggyBank,
  AlertCircle,
  Search,
  Settings,
  Download,
  Upload,
  Star,
  Award,
  Globe,
  Shield,
  Rocket,
  Lightbulb,
  Cpu,
  Database,
  Network,
  Server,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Printer,
  Camera,
  Video,
  Mic,
  Headphones,
  Wifi,
  Bluetooth,
  Usb,
  Power,
  Battery,
  Thermometer,
  Crosshair,
  Compass,
  Map,
  Navigation,
  Satellite,
  Radio,
  Signal
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart,
  Pie,
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend
} from 'recharts'
import { format, subDays, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { quotationsAPI } from '@/api/quotations'
import { billsAPI } from '@/api/bills'
import { profitSharingAPI } from '@/api/profitSharing'
import { companiesAPI } from '@/api/companies'
import { useAuth } from '@/contexts/AuthContext'

const AdvancedDashboard = ({ onNavigateToSection }) => {
  const { userPermissions } = useAuth()
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30')
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({
    status: 'all',
    category: 'all',
    priority: 'all'
  })
  const [showFilters, setShowFilters] = useState(false)
  
  // Estados para dados
  const [dashboardData, setDashboardData] = useState({
    // Métricas principais
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0,
    
    // Contadores
    totalQuotations: 0,
    totalBills: 0,
    totalCompanies: 0,
    totalProfitSharings: 0,
    
    // Status específicos
    pendingQuotations: 0,
    overdueBills: 0,
    paidBills: 0,
    pendingProfitSharing: 0,
    
    // Tendências (dados históricos)
    revenueHistory: [],
    quotationsTrend: [],
    billsStatus: [],
    profitDistribution: [],
    
    // Alertas
    criticalAlerts: [],
    upcomingDeadlines: [],
    
    // Informações da empresa
    companyInfo: {
      name: 'FHD Automação Industrial',
      cnpj: '12.345.678/0001-90',
      address: 'Rua das Indústrias, 123 - Centro',
      city: 'São Paulo - SP',
      phone: '(11) 99999-9999',
      email: 'contato@fhdautomacao.com.br',
      website: 'www.fhdautomacao.com.br',
      founded: '2015',
      employees: 25,
      certifications: ['ISO 9001', 'ISO 14001', 'OHSAS 18001'],
      specialties: ['Automação Industrial', 'Sistemas Hidráulicos', 'Controle de Processos'],
      clients: ['Petrobras', 'Vale', 'Gerdau', 'Usiminas'],
      projects: 150,
      satisfaction: 4.8
    },
    
    // Métricas de performance
    performance: {
      efficiency: 87,
      quality: 94,
      delivery: 96,
      innovation: 89,
      customerSatisfaction: 92,
      employeeSatisfaction: 88
    },
    
    // Dados de mercado
    marketData: {
      marketShare: 12.5,
      growthRate: 15.3,
      competitors: 8,
      opportunities: 23,
      threats: 3
    },
    
    // Atividades recentes
    recentActivities: [
      {
        id: 1,
        type: 'project',
        title: 'Projeto Petrobras Aprovado',
        description: 'Sistema de automação para refinaria',
        value: 250000,
        status: 'completed',
        date: '2024-01-15',
        priority: 'high'
      },
      {
        id: 2,
        type: 'maintenance',
        title: 'Manutenção Preventiva Vale',
        description: 'Equipamentos de mineração',
        value: 45000,
        status: 'in_progress',
        date: '2024-01-20',
        priority: 'medium'
      },
      {
        id: 3,
        type: 'installation',
        title: 'Instalação Sistema Gerdau',
        description: 'Controle de temperatura',
        value: 180000,
        status: 'pending',
        date: '2024-01-25',
        priority: 'high'
      }
    ],
    
    // Equipe
    team: [
      {
        id: 1,
        name: 'João Silva',
        role: 'Diretor Técnico',
        avatar: '/api/placeholder/40/40',
        status: 'online',
        projects: 8,
        performance: 95
      },
      {
        id: 2,
        name: 'Maria Santos',
        role: 'Engenheira de Automação',
        avatar: '/api/placeholder/40/40',
        status: 'busy',
        projects: 6,
        performance: 92
      },
      {
        id: 3,
        name: 'Carlos Oliveira',
        role: 'Técnico Hidráulico',
        avatar: '/api/placeholder/40/40',
        status: 'offline',
        projects: 4,
        performance: 88
      }
    ]
  })

  useEffect(() => {
    loadDashboardData()
  }, [timeRange])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setRefreshing(true)
      
      // Carregar dados em paralelo com fallbacks
      const dateRange = getDateRange()
      
      // Primeiro, atualizar status de boletos vencidos
      try {
        await billsAPI.updateOverdueStatus()
      } catch (updateError) {
        console.warn("Aviso: Não foi possível atualizar status de vencidos no dashboard:", updateError)
      }
      
      const [
        quotations = [],
        bills = [],
        profitSharings = [],
        companies = [],
        billsStats = { totalAmount: 0, paidAmount: 0, pendingAmount: 0, overdueAmount: 0 },
        profitStats = { totalToPay: 0, totalPaid: 0, totalPending: 0, totalOverdue: 0, averageProfit: 0 }
      ] = await Promise.allSettled([
        quotationsAPI.getAll().catch(() => []),
        billsAPI.getAll().catch(() => []),
        profitSharingAPI.getAll().catch(() => []),
        companiesAPI.getAll().catch(() => []),
        billsAPI.getTotalsByDateRange(dateRange.start, dateRange.end).catch(() => ({ totalAmount: 0, paidAmount: 0, pendingAmount: 0, overdueAmount: 0 })),
        profitSharingAPI.getFinancialStatistics().catch(() => ({ totalToPay: 0, totalPaid: 0, totalPending: 0, totalOverdue: 0, averageProfit: 0 }))
      ]).then(results => 
        results.map(result => result.status === 'fulfilled' ? result.value : result.reason || [])
      )

      // Processar dados para o dashboard
      const processed = processDashboardData({
        quotations: Array.isArray(quotations) ? quotations : [],
        bills: Array.isArray(bills) ? bills : [],
        profitSharings: Array.isArray(profitSharings) ? profitSharings : [],
        companies: Array.isArray(companies) ? companies : [],
        billsStats: billsStats || { totalAmount: 0, paidAmount: 0, pendingAmount: 0, overdueAmount: 0 },
        profitStats: profitStats || { totalToPay: 0, totalPaid: 0, totalPending: 0, totalOverdue: 0, averageProfit: 0 }
      })
      
      setDashboardData(processed)
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
      
      // Definir dados padrão em caso de erro
      setDashboardData({
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0,
        profitMargin: 0,
        totalQuotations: 0,
        totalBills: 0,
        totalCompanies: 0,
        totalProfitSharings: 0,
        pendingQuotations: 0,
        overdueBills: 0,
        paidBills: 0,
        pendingProfitSharing: 0,
        revenueHistory: [],
        quotationsTrend: [],
        billsStatus: [],
        profitDistribution: [],
        criticalAlerts: [{
          type: 'danger',
          title: 'Erro ao Carregar Dados',
          message: 'Não foi possível carregar alguns dados do dashboard',
          icon: AlertTriangle
        }],
        upcomingDeadlines: []
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const getDateRange = () => {
    const end = new Date()
    const start = subDays(end, parseInt(timeRange))
    return { 
      start: start.toISOString().split('T')[0], 
      end: end.toISOString().split('T')[0] 
    }
  }

  const processDashboardData = ({ quotations = [], bills = [], profitSharings = [], companies = [], billsStats = {}, profitStats = {} }) => {
    const today = new Date()
    const currentMonth = startOfMonth(today)
    const endMonth = endOfMonth(today)
    
    // Garantir que temos arrays válidos
    const safeQuotations = Array.isArray(quotations) ? quotations : []
    const safeBills = Array.isArray(bills) ? bills : []
    const safeProfitSharings = Array.isArray(profitSharings) ? profitSharings : []
    const safeCompanies = Array.isArray(companies) ? companies : []
    
    // Calcular receitas e lucros
    const receivableBills = safeBills.filter(b => b && b.type === 'receivable' && b.status === 'paid')
    const totalRevenue = receivableBills.reduce((sum, bill) => sum + parseFloat(bill.total_amount || 0), 0)
    
    const payableBills = safeBills.filter(b => b && b.type === 'payable' && b.status === 'paid')
    const totalExpenses = payableBills.reduce((sum, bill) => sum + parseFloat(bill.total_amount || 0), 0)
    
    const netProfit = totalRevenue - totalExpenses
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0

    // Status de orçamentos
    const pendingQuotations = safeQuotations.filter(q => q && q.status === 'pending').length
    const approvedQuotations = safeQuotations.filter(q => q && q.status === 'approved').length
    
    // Status de boletos - usando status 'overdue' em vez de calcular
    const overdueBills = safeBills.filter(b => b && b.status === 'overdue').length
    
    const paidBills = safeBills.filter(b => b && b.status === 'paid').length

    // Calcular pagamentos de sócio vencidos
    const overduePartnerPayments = safeProfitSharings.reduce((count, ps) => {
      if (!ps || !ps.profit_sharing_installments) return count
      const overdueInstallments = ps.profit_sharing_installments.filter(
        inst => inst && inst.status === 'overdue'
      )
      return count + overdueInstallments.length
    }, 0)
    
    // Dados históricos para gráficos
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(today, 6 - i)
      const dayBills = safeBills.filter(b => {
        if (!b || !b.created_at) return false
        try {
          const billDate = new Date(b.created_at)
          return billDate.toDateString() === date.toDateString()
        } catch {
          return false
        }
      })
      
      return {
        date: format(date, 'dd/MM', { locale: ptBR }),
        receitas: dayBills.filter(b => b && b.type === 'receivable' && b.status === 'paid').reduce((sum, b) => sum + parseFloat(b.total_amount || 0), 0),
        despesas: dayBills.filter(b => b && b.type === 'payable' && b.status === 'paid').reduce((sum, b) => sum + parseFloat(b.total_amount || 0), 0),
        orçamentos: safeQuotations.filter(q => {
          if (!q || !q.created_at) return false
          try {
            return new Date(q.created_at).toDateString() === date.toDateString()
          } catch {
            return false
          }
        }).length
      }
    })

    // Distribuição de status de orçamentos
    const quotationsTrend = [
      { name: 'Pendentes', value: safeQuotations.filter(q => q && q.status === 'pending').length, color: '#f59e0b' },
      { name: 'Em Análise', value: safeQuotations.filter(q => q && q.status === 'in_analysis').length, color: '#3b82f6' },
      { name: 'Aprovados', value: safeQuotations.filter(q => q && q.status === 'approved').length, color: '#10b981' },
      { name: 'Rejeitados', value: safeQuotations.filter(q => q && q.status === 'rejected').length, color: '#ef4444' },
      { name: 'Concluídos', value: safeQuotations.filter(q => q && q.status === 'completed').length, color: '#8b5cf6' }
    ]

    // Status de boletos
    const billsStatus = [
      { name: 'Pendentes', value: safeBills.filter(b => b && b.status === 'pending').length, color: '#f59e0b' },
      { name: 'Pagos', value: safeBills.filter(b => b && b.status === 'paid').length, color: '#10b981' },
      { name: 'Vencidos', value: overdueBills, color: '#ef4444' }
    ]

    // Alertas críticos
    const criticalAlerts = []
    
    if (overdueBills > 0) {
      criticalAlerts.push({
        type: 'danger',
        title: 'Boletos Vencidos',
        message: `${overdueBills} boleto(s) em atraso`,
        icon: AlertTriangle,
        action: 'bills'
      })
    }

    if (overduePartnerPayments > 0) {
      criticalAlerts.push({
        type: 'danger',
        title: 'Pagamentos de Sócio Vencidos',
        message: `${overduePartnerPayments} pagamento(s) de sócio em atraso`,
        icon: Calculator,
        action: 'profit-sharing'
      })
    }
    
    if (pendingQuotations > 5) {
      criticalAlerts.push({
        type: 'warning',
        title: 'Muitos Orçamentos Pendentes',
        message: `${pendingQuotations} orçamentos aguardando análise`,
        icon: Clock,
        action: 'quotations'
      })
    }

    if (profitMargin < 10) {
      criticalAlerts.push({
        type: 'info',
        title: 'Margem de Lucro Baixa',
        message: `Margem atual: ${profitMargin.toFixed(1)}%`,
        icon: TrendingDown,
        action: 'profit-sharing'
      })
    }

    // Próximos vencimentos
    const upcomingDeadlines = safeBills
      .filter(b => b && b.status === 'pending' && b.first_due_date)
      .map(bill => {
        try {
          const dueDate = new Date(bill.first_due_date)
          const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))
          return {
            ...bill,
            dueDate,
            daysUntilDue
          }
        } catch {
          return null
        }
      })
      .filter(bill => bill && bill.daysUntilDue >= 0 && bill.daysUntilDue <= 7)
      .sort((a, b) => a.daysUntilDue - b.daysUntilDue)
      .slice(0, 5)

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
      totalQuotations: safeQuotations.length,
      totalBills: safeBills.length,
      totalCompanies: safeCompanies.length,
      totalProfitSharings: safeProfitSharings.length,
      pendingQuotations,
      overdueBills,
      paidBills,
      overduePartnerPayments,
      pendingProfitSharing: safeProfitSharings.filter(p => p && p.status === 'pending').length,
      revenueHistory: last7Days,
      quotationsTrend,
      billsStatus,
      profitDistribution: [
        { name: 'Receitas', value: totalRevenue, color: '#10b981' },
        { name: 'Despesas', value: totalExpenses, color: '#ef4444' },
        { name: 'Lucro Líquido', value: Math.max(0, netProfit), color: '#3b82f6' }
      ],
      criticalAlerts,
      upcomingDeadlines
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatCompactCurrency = (value) => {
    if (value >= 1000000) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(value)
    }
    return formatCurrency(value)
  }

  const getMetricColor = (current, previous) => {
    if (current > previous) return 'text-green-600'
    if (current < previous) return 'text-red-600'
    return 'text-gray-600'
  }

  const getMetricIcon = (current, previous) => {
    if (current > previous) return <ArrowUpRight className="h-4 w-4" />
    if (current < previous) return <ArrowDownRight className="h-4 w-4" />
    return <Activity className="h-4 w-4" />
  }

  const MetricCard = ({ title, value, icon: Icon, change, trend, color = "blue", onClick, className = "" }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`hover:shadow-lg transition-shadow duration-300 ${onClick ? 'cursor-pointer' : ''} ${className}`} onClick={onClick}>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
              <p className={`text-lg sm:text-2xl font-bold text-${color}-600 truncate`}>{value}</p>
              {change && (
                <div className={`flex items-center space-x-1 text-xs sm:text-sm ${getMetricColor(change.current, change.previous)}`}>
                  {getMetricIcon(change.current, change.previous)}
                  <span>{Math.abs(((change.current - change.previous) / change.previous) * 100).toFixed(1)}%</span>
                </div>
              )}
            </div>
            <div className={`p-2 sm:p-3 bg-${color}-100 rounded-full flex-shrink-0 ml-2`}>
              <Icon className={`h-5 w-5 sm:h-6 sm:w-6 text-${color}-600`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const AlertCard = ({ alert, index }) => {
    const colorMap = {
      danger: 'border-red-500 bg-red-50',
      warning: 'border-yellow-500 bg-yellow-50',
      info: 'border-blue-500 bg-blue-50'
    }
    
    const iconColorMap = {
      danger: 'text-red-600',
      warning: 'text-yellow-600',
      info: 'text-blue-600'
    }

    const handleAlertClick = () => {
      if (alert.action && onNavigateToSection) {
        onNavigateToSection(alert.action)
      }
    }

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <Card 
          className={`border-l-4 ${colorMap[alert.type]} ${alert.action ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
          onClick={handleAlertClick}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <alert.icon className={`h-5 w-5 ${iconColorMap[alert.type]}`} />
                <div>
                  <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                  <p className="text-sm text-gray-600">{alert.message}</p>
                </div>
              </div>
              {alert.action && (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <RefreshCcw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-700">Carregando dashboard...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Header Principal */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Dashboard Executivo</h1>
                  <p className="text-gray-600">Visão estratégica completa da FHD Automação Industrial</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                
                <Button
                  variant={showFilters ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
                
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Últimos 7 dias</SelectItem>
                    <SelectItem value="30">Últimos 30 dias</SelectItem>
                    <SelectItem value="90">Últimos 90 dias</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={loadDashboardData}
                  disabled={refreshing}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCcw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Atualizar
                </Button>
              </div>
            </div>
            
            {/* Filtros Avançados */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-gray-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select 
                      value={selectedFilters.status} 
                      onValueChange={(value) => setSelectedFilters({...selectedFilters, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os Status</SelectItem>
                        <SelectItem value="active">Ativos</SelectItem>
                        <SelectItem value="pending">Pendentes</SelectItem>
                        <SelectItem value="completed">Concluídos</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      value={selectedFilters.category} 
                      onValueChange={(value) => setSelectedFilters({...selectedFilters, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as Categorias</SelectItem>
                        <SelectItem value="automation">Automação</SelectItem>
                        <SelectItem value="hydraulic">Hidráulica</SelectItem>
                        <SelectItem value="maintenance">Manutenção</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      value={selectedFilters.priority} 
                      onValueChange={(value) => setSelectedFilters({...selectedFilters, priority: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as Prioridades</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="low">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Abas Principais */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-white rounded-xl p-1 shadow-lg">
                <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Visão Geral
                </TabsTrigger>
                <TabsTrigger value="financial" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Financeiro
                </TabsTrigger>

              </TabsList>
              
              {/* Conteúdo das Abas */}
              <div className="mt-6">
                {/* Aba: Visão Geral */}
                <TabsContent value="overview" className="space-y-6">
                  {/* Alertas Críticos */}
                  {dashboardData.criticalAlerts.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2 text-orange-800">
                            <Bell className="h-5 w-5" />
                            <span>Alertas Importantes</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            {dashboardData.criticalAlerts.map((alert, index) => (
                              <AlertCard key={index} alert={alert} index={index} />
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Métricas Principais */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-green-700">Receita Total</p>
                              <p className="text-2xl font-bold text-green-900">{formatCompactCurrency(dashboardData.totalRevenue)}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                              <DollarSign className="h-6 w-6 text-green-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Card className="bg-gradient-to-br from-red-50 to-pink-100 border-red-200 hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-red-700">Despesas Totais</p>
                              <p className="text-2xl font-bold text-red-900">{formatCompactCurrency(dashboardData.totalExpenses)}</p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-full">
                              <CreditCard className="h-6 w-6 text-red-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Card className={`bg-gradient-to-br ${dashboardData.netProfit >= 0 ? 'from-blue-50 to-cyan-100 border-blue-200' : 'from-red-50 to-pink-100 border-red-200'} hover:shadow-lg transition-all duration-300`}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-blue-700">Lucro Líquido</p>
                              <p className={`text-2xl font-bold ${dashboardData.netProfit >= 0 ? 'text-blue-900' : 'text-red-900'}`}>{formatCompactCurrency(dashboardData.netProfit)}</p>
                            </div>
                            <div className={`p-3 rounded-full ${dashboardData.netProfit >= 0 ? 'bg-blue-100' : 'bg-red-100'}`}>
                              <Target className={`h-6 w-6 ${dashboardData.netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Card className={`bg-gradient-to-br ${dashboardData.profitMargin >= 20 ? 'from-emerald-50 to-green-100 border-emerald-200' : dashboardData.profitMargin >= 10 ? 'from-yellow-50 to-orange-100 border-yellow-200' : 'from-red-50 to-pink-100 border-red-200'} hover:shadow-lg transition-all duration-300`}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Margem de Lucro</p>
                              <p className="text-2xl font-bold text-gray-900">{dashboardData.profitMargin.toFixed(1)}%</p>
                            </div>
                            <div className="p-3 bg-gray-100 rounded-full">
                              <Target className="h-6 w-6 text-gray-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>

                  {/* Métricas Operacionais */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <Card className="bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-200 hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-blue-700">Total de Orçamentos</p>
                              <p className="text-2xl font-bold text-blue-900">{dashboardData.totalQuotations}</p>
                              <div className="flex items-center mt-2">
                                <FileText className="h-4 w-4 text-blue-600 mr-1" />
                                <span className="text-xs text-blue-600">{dashboardData.pendingQuotations} pendentes</span>
                              </div>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                              <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200 hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-purple-700">Empresas Cadastradas</p>
                              <p className="text-2xl font-bold text-purple-900">{dashboardData.totalCompanies}</p>
                              <div className="flex items-center mt-2">
                                <Building className="h-4 w-4 text-purple-600 mr-1" />
                                <span className="text-xs text-purple-600">Clientes ativos</span>
                              </div>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-full">
                              <Building className="h-6 w-6 text-purple-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                    >
                      <Card className="bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-200 hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-yellow-700">Boletos Pendentes</p>
                              <p className="text-2xl font-bold text-yellow-900">{dashboardData.totalBills - dashboardData.paidBills}</p>
                              <div className="flex items-center mt-2">
                                <Clock className="h-4 w-4 text-yellow-600 mr-1" />
                                <span className="text-xs text-yellow-600">{dashboardData.overdueBills} vencidos</span>
                              </div>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-full">
                              <Clock className="h-6 w-6 text-yellow-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0 }}
                    >
                      <Card className="bg-gradient-to-br from-indigo-50 to-blue-100 border-indigo-200 hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-indigo-700">Divisões de Lucro</p>
                              <p className="text-2xl font-bold text-indigo-900">{dashboardData.totalProfitSharings}</p>
                              <div className="flex items-center mt-2">
                                <PiggyBank className="h-4 w-4 text-indigo-600 mr-1" />
                                <span className="text-xs text-indigo-600">{dashboardData.pendingProfitSharing} pendentes</span>
                              </div>
                            </div>
                            <div className="p-3 bg-indigo-100 rounded-full">
                              <PiggyBank className="h-6 w-6 text-indigo-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>

                                     {/* Gráficos */}
                   <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    

                                         {/* Status de Orçamentos */}
                     <motion.div
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: 1.1 }}
                     >
                       <Card className="shadow-lg">
                         <CardHeader>
                           <CardTitle className="flex items-center space-x-2">
                             <BarChart3 className="h-5 w-5" />
                             <span>Status dos Orçamentos</span>
                           </CardTitle>
                         </CardHeader>
                         <CardContent>
                           <ResponsiveContainer width="100%" height={400}>
                             <RechartsPieChart>
                               <Pie
                                 data={dashboardData.quotationsTrend}
                                 cx="50%"
                                 cy="50%"
                                 outerRadius={100}
                                 innerRadius={50}
                                 fill="#8884d8"
                                 dataKey="value"
                                 label={false}
                               >
                                 {dashboardData.quotationsTrend.map((entry, index) => (
                                   <Cell key={`cell-${index}`} fill={entry.color} />
                                 ))}
                               </Pie>
                               <Tooltip formatter={(value, name) => [value, name]} />
                               <Legend 
                                 verticalAlign="bottom" 
                                 height={36}
                                 iconType="circle"
                                 wrapperStyle={{ paddingTop: '20px' }}
                               />
                             </RechartsPieChart>
                           </ResponsiveContainer>
                         </CardContent>
                       </Card>
                     </motion.div>
                  </div>
                </TabsContent>

                {/* Aba: Financeiro */}
                <TabsContent value="financial" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <DollarSign className="h-5 w-5" />
                          <span>Resumo Financeiro</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                          <span className="font-medium text-green-700">Receitas</span>
                          <span className="font-bold text-green-900">{formatCurrency(dashboardData.totalRevenue)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                          <span className="font-medium text-red-700">Despesas</span>
                          <span className="font-bold text-red-900">{formatCurrency(dashboardData.totalExpenses)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                          <span className="font-medium text-blue-700">Lucro Líquido</span>
                          <span className={`font-bold ${dashboardData.netProfit >= 0 ? 'text-blue-900' : 'text-red-900'}`}>
                            {formatCurrency(dashboardData.netProfit)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                          <span className="font-medium text-purple-700">Margem de Lucro</span>
                          <span className="font-bold text-purple-900">{dashboardData.profitMargin.toFixed(1)}%</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Target className="h-5 w-5" />
                          <span>Metas Financeiras</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Receita Mensal</span>
                            <span className="text-sm text-gray-600">75%</span>
                          </div>
                          <Progress value={75} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Margem de Lucro</span>
                            <span className="text-sm text-gray-600">60%</span>
                          </div>
                          <Progress value={60} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Redução de Custos</span>
                            <span className="text-sm text-gray-600">85%</span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>






              </div>
            </Tabs>
          </motion.div>
        </div>
      </div>
      </TooltipProvider>
  )
}

export default AdvancedDashboard