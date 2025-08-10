import React, { useState } from 'react'
import { useJWTAuth } from '@/contexts/JWTAuthContext'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  User, 
  LogOut, 
  Shield, 
  Clock, 
  Settings,
  AlertTriangle,
  Eye,
  Bell
} from 'lucide-react'
import { toast } from 'sonner'

const AdminHeader = ({ onManageMenu, activeSection = 'dashboard' }) => {
  const { user, logout, isTokenExpiringSoon, isTokenExpired } = useJWTAuth()
  const [showExpiryWarning, setShowExpiryWarning] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logout realizado com sucesso!')
  }

  const formatExpiryTime = () => {
    if (!user) return ''
    
    // Simular tempo restante (em produção, isso viria do token)
    const now = new Date()
    const expiry = new Date(now.getTime() + (23 * 60 * 60 * 1000)) // 23 horas restantes
    const diff = expiry - now
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${hours}h ${minutes}m`
  }

  if (!user) return null

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 w-full">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo e título centralizado */}
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">FHD Automação</h1>
              <p className="text-sm text-gray-500">Painel Administrativo</p>
            </div>
          </div>
        </div>

        {/* Breadcrumb centralizado */}
        <div className="flex items-center space-x-2 flex-1 justify-center">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <span className="text-sm text-gray-600 hidden sm:block">/</span>
            <span className="text-sm sm:text-base font-medium text-gray-900 capitalize truncate">
              {activeSection}
            </span>
          </div>
        </div>

        {/* Informações do usuário e ações */}
        <div className="flex items-center space-x-4 flex-1 justify-end">
          {/* Aviso de expiração */}
          {isTokenExpiringSoon() && (
            <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                Sessão expira em {formatExpiryTime()}
              </span>
            </div>
          )}

          {/* Botões de ação */}
          <Button variant="outline" size="sm" onClick={onManageMenu}>Gerenciar Menu</Button>
          
          <Button variant="outline" size="sm" className="hidden sm:inline-flex" onClick={() => window.open('/', '_blank') }>
            <Eye className="h-4 w-4 mr-2" />
            Ver Site
          </Button>
          
          <Button variant="outline" size="sm" className="p-2">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notificações</span>
          </Button>

          {/* Dropdown do usuário */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user.name}</span>
                <span className="text-xs text-gray-500 hidden sm:inline">({user.email})</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <p className="text-xs text-blue-600 font-medium">{user.role}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Sessão expira em {formatExpiryTime()}</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-600 focus:text-red-600"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
