import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DollarSign, TrendingUp, Users, Settings } from 'lucide-react'

const DashboardTest = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="bg-white rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Dashboard Teste - FHD Automação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700">Receita Total</p>
                      <p className="text-2xl font-bold text-green-900">R$ 1.250.000</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-xs text-green-600">+12.5% este mês</span>
                      </div>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700">Orçamentos</p>
                      <p className="text-2xl font-bold text-blue-900">45</p>
                      <div className="flex items-center mt-2">
                        <Users className="h-4 w-4 text-blue-600 mr-1" />
                        <span className="text-xs text-blue-600">8 pendentes</span>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700">Projetos Ativos</p>
                      <p className="text-2xl font-bold text-purple-900">12</p>
                      <div className="flex items-center mt-2">
                        <Settings className="h-4 w-4 text-purple-600 mr-1" />
                        <span className="text-xs text-purple-600">3 em andamento</span>
                      </div>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Settings className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-red-100 border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-700">Clientes</p>
                      <p className="text-2xl font-bold text-orange-900">28</p>
                      <div className="flex items-center mt-2">
                        <Users className="h-4 w-4 text-orange-600 mr-1" />
                        <span className="text-xs text-orange-600">5 novos</span>
                      </div>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Users className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">
              Informações da Empresa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Dados Gerais</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Nome</span>
                    <span className="text-sm">FHD Automação Industrial</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">CNPJ</span>
                    <span className="text-sm">12.345.678/0001-90</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Endereço</span>
                    <span className="text-sm">Rua das Indústrias, 123 - Centro</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Cidade</span>
                    <span className="text-sm">São Paulo - SP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Telefone</span>
                    <span className="text-sm">(11) 99999-9999</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Especialidades</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    Automação Industrial
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Sistemas Hidráulicos
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                    Controle de Processos
                  </span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                    Manutenção Preventiva
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mt-4">Principais Clientes</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                    Petrobras
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                    Vale
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                    Gerdau
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                    Usiminas
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardTest
