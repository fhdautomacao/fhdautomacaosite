import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Plus, 
  Edit, 
  Save, 
  X, 
  Trash2, 
  Eye, 
  Copy, 
  Globe,
  Settings,
  FileText,
  Image,
  Hash,
  Link,
  MessageSquare,
  Code,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { toast } from 'sonner'

// Importar configuração CORS
import { seoApi, setupAdminAuth, isAdminAuthenticated } from '@/lib/api-config'

const SEOManager = () => {
  const [seoSettings, setSeoSettings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [showPreview, setShowPreview] = useState({})
  const [previewData, setPreviewData] = useState({})
  const [isCreating, setIsCreating] = useState(false)
  const [newSeoData, setNewSeoData] = useState({
    page_name: '',
    title: '',
    description: '',
    keywords: '',
    canonical_url: '',
    og_title: '',
    og_description: '',
    og_image: '',
    og_type: 'website',
    og_site_name: 'FHD Automação Industrial',
    og_locale: 'pt_BR',
    twitter_card: 'summary_large_image',
    twitter_title: '',
    twitter_description: '',
    twitter_image: '',
    structured_data: null,
    robots: 'index, follow',
    author: 'FHD Automação Industrial',
    viewport: 'width=device-width, initial-scale=1.0',
    charset: 'UTF-8',
    favicon_url: '',
    is_active: true
  })

  // Verificar autenticação admin ao carregar
  useEffect(() => {
    if (!isAdminAuthenticated()) {
      console.warn('⚠️ Usuário não autenticado como admin')
      toast.error('Acesso restrito - autenticação necessária')
      // Redirecionar para login se necessário
      // window.location.href = '/admin/login'
    }
  }, [])

  // Buscar configurações de SEO usando a nova configuração CORS
  const fetchSeoSettings = async () => {
    try {
      setLoading(true)
      console.log('🌐 [SEOManager] Buscando configurações com proteção CORS...')
      
      // Usar a função da configuração CORS
      const result = await seoApi.getSettings()
      
      if (result.success) {
        setSeoSettings(result.data || [])
        console.log('✅ [SEOManager] Configurações carregadas com sucesso')
        toast.success(`${result.data.length} configurações carregadas`)
      } else {
        console.error('❌ [SEOManager] Erro ao carregar configurações:', result.error)
        toast.error('Erro ao carregar configurações')
        setSeoSettings([])
      }
    } catch (error) {
      console.error('❌ [SEOManager] Erro na requisição:', error)
      
      // Tratar erros específicos de CORS
      if (error.message.includes('CORS')) {
        toast.error('Erro de CORS - verifique as configurações')
      } else if (error.message.includes('não autorizado')) {
        toast.error('Acesso não autorizado - verifique autenticação')
      } else {
        toast.error('Erro ao conectar com a API')
      }
      
      setSeoSettings([])
    } finally {
      setLoading(false)
    }
  }

  // Salvar configuração usando a nova configuração CORS
  const handleSave = async (data) => {
    try {
      console.log('💾 [SEOManager] Salvando configuração com proteção CORS...')
      
      let result
      if (data.id) {
        // Atualizar configuração existente
        result = await seoApi.updateSettings(data.id, data)
      } else {
        // Criar nova configuração
        result = await seoApi.saveSettings(data)
      }
      
      if (result.success) {
        console.log('✅ [SEOManager] Configuração salva com sucesso')
        toast.success('Configuração salva com sucesso!')
        
        // Atualizar lista
        await fetchSeoSettings()
        
        // Limpar formulário
        setEditingId(null)
        setIsCreating(false)
        setNewSeoData({
          page_name: '',
          title: '',
          description: '',
          keywords: '',
          canonical_url: '',
          og_title: '',
          og_description: '',
          og_image: '',
          og_type: 'website',
          og_site_name: 'FHD Automação Industrial',
          og_locale: 'pt_BR',
          twitter_card: 'summary_large_image',
          twitter_title: '',
          twitter_description: '',
          twitter_image: '',
          structured_data: null,
          robots: 'index, follow',
          author: 'FHD Automação Industrial',
          viewport: 'width=device-width, initial-scale=1.0',
          charset: 'UTF-8',
          favicon_url: '',
          is_active: true
        })
      } else {
        console.error('❌ [SEOManager] Erro ao salvar:', result.error)
        toast.error('Erro ao salvar configuração')
      }
    } catch (error) {
      console.error('❌ [SEOManager] Erro na requisição de salvamento:', error)
      
      // Tratar erros específicos
      if (error.message.includes('não autorizado')) {
        toast.error('Acesso não autorizado - verifique autenticação admin')
      } else {
        toast.error('Erro ao salvar configuração')
      }
    }
  }

  // Deletar configuração usando a nova configuração CORS
  const handleDelete = async (id) => {
    try {
      console.log('🗑️ [SEOManager] Deletando configuração com proteção CORS...')
      
      const result = await seoApi.deleteSettings(id)
      
      if (result.success) {
        console.log('✅ [SEOManager] Configuração deletada com sucesso')
        toast.success('Configuração deletada com sucesso!')
        
        // Atualizar lista
        await fetchSeoSettings()
      } else {
        console.error('❌ [SEOManager] Erro ao deletar:', result.error)
        toast.error('Erro ao deletar configuração')
      }
    } catch (error) {
      console.error('❌ [SEOManager] Erro na requisição de exclusão:', error)
      
      if (error.message.includes('não autorizado')) {
        toast.error('Acesso não autorizado - verifique autenticação admin')
      } else {
        toast.error('Erro ao deletar configuração')
      }
    }
  }

  // Health check da API
  const checkApiHealth = async () => {
    try {
      const result = await seoApi.healthCheck()
      console.log('🏥 [SEOManager] API Health:', result)
      toast.success('API funcionando corretamente')
    } catch (error) {
      console.error('❌ [SEOManager] API Health Check falhou:', error)
      toast.error('API não está respondendo')
    }
  }

  // Carregar dados ao montar componente
  useEffect(() => {
    fetchSeoSettings()
  }, [])

  // Resto do componente permanece o mesmo...
  // (renderização, formulários, etc.)

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gerenciador de SEO</h1>
          <p className="text-muted-foreground">
            Configure as meta tags e SEO para suas páginas
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={checkApiHealth}
            size="sm"
          >
            <Globe className="w-4 h-4 mr-2" />
            Verificar API
          </Button>
          
          <Button 
            onClick={() => setIsCreating(true)}
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Configuração
          </Button>
        </div>
      </div>

      {/* Resto da interface permanece o mesmo */}
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Interface completa do SEOManager aqui...
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Este é um exemplo de como integrar a proteção CORS
        </p>
      </div>
    </div>
  )
}

export default SEOManager
