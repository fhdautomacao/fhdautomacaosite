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
  PieChart,
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
  AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
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
  Tooltip, 
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

const AdvancedDashboard = () => {
  const { userPermissions } = useAuth()
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30')
  const [refreshing, setRefreshing] = useState(false)
  
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
    upcomingDeadlines: []
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
    
    // Status de boletos
    const overdueBills = safeBills.filter(b => {
      if (!b || !b.first_due_date || !b.status) return false
      try {
        const dueDate = new Date(b.first_due_date)
        return b.status === 'pending' && dueDate < today
      } catch {
        return false
      }
    }).length
    
    const paidBills = safeBills.filter(b => b && b.status === 'paid').length
    
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
        icon: AlertTriangle
      })
    }
    
    if (pendingQuotations > 5) {
      criticalAlerts.push({
        type: 'warning',
        title: 'Muitos Orçamentos Pendentes',
        message: `${pendingQuotations} orçamentos aguardando análise`,
        icon: Clock
      })
    }

    if (profitMargin < 10) {
      criticalAlerts.push({
        type: 'info',
        title: 'Margem de Lucro Baixa',
        message: `Margem atual: ${profitMargin.toFixed(1)}%`,
        icon: TrendingDown
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

  const MetricCard = ({ title, value, icon: Icon, change, trend, color = "blue" }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
              {change && (
                <div className={`flex items-center space-x-1 text-sm ${getMetricColor(change.current, change.previous)}`}>
                  {getMetricIcon(change.current, change.previous)}
                  <span>{Math.abs(((change.current - change.previous) / change.previous) * 100).toFixed(1)}%</span>
                </div>
              )}
            </div>
            <div className={`p-3 bg-${color}-100 rounded-full`}>
              <Icon className={`h-6 w-6 text-${color}-600`} />
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

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <Card className={`border-l-4 ${colorMap[alert.type]}`}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <alert.icon className={`h-5 w-5 ${iconColorMap[alert.type]}`} />
              <div>
                <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                <p className="text-sm text-gray-600">{alert.message}</p>
              </div>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Avançado</h1>
            <p className="text-gray-600">Visão completa do seu negócio em tempo real</p>
          </div>
          
          <div className="flex items-center space-x-4">
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
        </motion.div>

        {/* Alertas Críticos */}
        {dashboardData.criticalAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-orange-800">
                  <Bell className="h-5 w-5" />
                  <span>Alertas Importantes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dashboardData.criticalAlerts.map((alert, index) => (
                    <AlertCard key={index} alert={alert} index={index} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Receita Total"
            value={formatCompactCurrency(dashboardData.totalRevenue)}
            icon={DollarSign}
            color="green"
          />
          <MetricCard
            title="Despesas Totais"
            value={formatCompactCurrency(dashboardData.totalExpenses)}
            icon={CreditCard}
            color="red"
          />
          <MetricCard
            title="Lucro Líquido"
            value={formatCompactCurrency(dashboardData.netProfit)}
            icon={TrendingUp}
            color={dashboardData.netProfit >= 0 ? "green" : "red"}
          />
          <MetricCard
            title="Margem de Lucro"
            value={`${dashboardData.profitMargin.toFixed(1)}%`}
            icon={Target}
            color={dashboardData.profitMargin >= 20 ? "green" : dashboardData.profitMargin >= 10 ? "yellow" : "red"}
          />
        </div>

        {/* Métricas Operacionais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total de Orçamentos"
            value={dashboardData.totalQuotations}
            icon={FileText}
            color="blue"
          />
          <MetricCard
            title="Empresas Cadastradas"
            value={dashboardData.totalCompanies}
            icon={Building}
            color="purple"
          />
          <MetricCard
            title="Boletos Pendentes"
            value={dashboardData.totalBills - dashboardData.paidBills}
            icon={Clock}
            color="yellow"
          />
          <MetricCard
            title="Divisões de Lucro"
            value={dashboardData.totalProfitSharings}
            icon={PiggyBank}
            color="indigo"
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tendência de Receitas e Despesas */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Tendência Financeira (7 dias)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={dashboardData.revenueHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(value) => formatCompactCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Area 
                      type="monotone" 
                      dataKey="receitas" 
                      stackId="1"
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.6} 
                      name="Receitas"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="despesas" 
                      stackId="2"
                      stroke="#ef4444" 
                      fill="#ef4444" 
                      fillOpacity={0.6} 
                      name="Despesas"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Status de Orçamentos */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5" />
                  <span>Status dos Orçamentos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={dashboardData.quotationsTrend}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {dashboardData.quotationsTrend.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Próximos Vencimentos */}
        {dashboardData.upcomingDeadlines.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Timer className="h-5 w-5" />
                  <span>Próximos Vencimentos (7 dias)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.upcomingDeadlines.map((bill, index) => (
                    <motion.div
                      key={bill.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h4 className="font-semibold text-gray-900">{bill.company_name}</h4>
                        <p className="text-sm text-gray-600">{bill.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(bill.total_amount)}</p>
                        <Badge 
                          variant={bill.daysUntilDue <= 2 ? "destructive" : "secondary"}
                        >
                          {bill.daysUntilDue === 0 ? 'Hoje' : 
                           bill.daysUntilDue === 1 ? 'Amanhã' : 
                           `${bill.daysUntilDue} dias`}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AdvancedDashboard