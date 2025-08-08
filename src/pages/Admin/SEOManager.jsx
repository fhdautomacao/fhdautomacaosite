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

  // Buscar configurações de SEO
  const fetchSeoSettings = async () => {
    try {
      setLoading(true)
      console.log('🌐 [SEOManager] Tentando buscar configurações da API...')
      
      const response = await fetch('/api/seo-settings')
      
      // Verificar se a resposta é JSON válido
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('⚠️ [SEOManager] API retornou dados não-JSON')
        toast.warning('API não disponível - modo offline')
        setSeoSettings([])
        return
      }
      
      const result = await response.json()
      
      if (result.success) {
        console.log('✅ [SEOManager] Configurações carregadas com sucesso!')
        console.log('📊 [SEOManager] Total de configurações:', result.data?.length || 0)
        setSeoSettings(result.data || [])
      } else {
        console.warn('⚠️ [SEOManager] API não retornou dados válidos')
        toast.error('Erro ao carregar configurações de SEO')
        setSeoSettings([])
      }
    } catch (error) {
      console.error('❌ [SEOManager] Erro ao buscar SEO settings:', error)
      console.log('🔄 [SEOManager] Usando modo offline devido ao erro')
      toast.warning('API não disponível - modo offline')
      setSeoSettings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSeoSettings()
  }, [])

  // Filtrar configurações baseado na busca
  const filteredSettings = seoSettings.filter(setting =>
    setting.page_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    setting.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    setting.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Salvar configuração
  const handleSave = async (data) => {
    try {
      const url = editingId ? `/api/seo-settings?id=${editingId}` : '/api/seo-settings'
      const method = editingId ? 'PUT' : 'POST'
      
      console.log('💾 [SEOManager] Tentando salvar configuração...')
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      // Verificar se a resposta é JSON válido
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('⚠️ [SEOManager] API retornou dados não-JSON ao salvar')
        toast.error('API não disponível - não foi possível salvar')
        return
      }

      const result = await response.json()

      if (result.success) {
        console.log('✅ [SEOManager] Configuração salva com sucesso!')
        toast.success(editingId ? 'Configuração atualizada com sucesso!' : 'Configuração criada com sucesso!')
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
        fetchSeoSettings()
      } else {
        console.warn('⚠️ [SEOManager] API não retornou sucesso ao salvar')
        toast.error(result.error || 'Erro ao salvar configuração')
      }
    } catch (error) {
      console.error('❌ [SEOManager] Erro ao salvar SEO settings:', error)
      toast.error('Erro ao salvar configuração - API não disponível')
    }
  }

  // Deletar configuração
  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja deletar esta configuração?')) return

    try {
      console.log('🗑️ [SEOManager] Tentando deletar configuração...')
      
      const response = await fetch(`/api/seo-settings?id=${id}`, {
        method: 'DELETE'
      })

      // Verificar se a resposta é JSON válido
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('⚠️ [SEOManager] API retornou dados não-JSON ao deletar')
        toast.error('API não disponível - não foi possível deletar')
        return
      }

      const result = await response.json()

      if (result.success) {
        console.log('✅ [SEOManager] Configuração deletada com sucesso!')
        toast.success('Configuração deletada com sucesso!')
        fetchSeoSettings()
      } else {
        console.warn('⚠️ [SEOManager] API não retornou sucesso ao deletar')
        toast.error(result.error || 'Erro ao deletar configuração')
      }
    } catch (error) {
      console.error('❌ [SEOManager] Erro ao deletar SEO settings:', error)
      toast.error('Erro ao deletar configuração - API não disponível')
    }
  }

  // Copiar para clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copiado para clipboard!')
  }

  // Preview das meta tags
  const generatePreview = (data) => {
    return {
      title: data.title || 'Título da página',
      description: data.description || 'Descrição da página',
      keywords: data.keywords || 'palavras-chave',
      ogTitle: data.og_title || data.title || 'Título Open Graph',
      ogDescription: data.og_description || data.description || 'Descrição Open Graph',
      ogImage: data.og_image || 'https://exemplo.com/imagem.jpg',
      twitterTitle: data.twitter_title || data.title || 'Título Twitter',
      twitterDescription: data.twitter_description || data.description || 'Descrição Twitter',
      canonical: data.canonical_url || 'https://exemplo.com/pagina',
      robots: data.robots || 'index, follow',
      author: data.author || 'Autor',
      structuredData: data.structured_data ? JSON.stringify(data.structured_data, null, 2) : '{}'
    }
  }

  // Renderizar formulário de edição
  const renderEditForm = (data, isNew = false) => {
    const formData = isNew ? newSeoData : data
    const setFormData = isNew ? setNewSeoData : (newData) => {
      const updatedSettings = seoSettings.map(s => 
        s.id === data.id ? { ...s, ...newData } : s
      )
      setSeoSettings(updatedSettings)
    }

    return (
      <div className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="social">Redes Sociais</TabsTrigger>
            <TabsTrigger value="advanced">Avançado</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="page_name">Nome da Página *</Label>
                <Input
                  id="page_name"
                  value={formData.page_name}
                  onChange={(e) => setFormData({ ...formData, page_name: e.target.value })}
                  placeholder="ex: home, about, services"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Título da Página</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Título da página"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição (Meta Description)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição da página (máximo 160 caracteres)"
                rows={3}
              />
              <div className="text-xs text-gray-500">
                {formData.description?.length || 0}/160 caracteres
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Palavras-chave</Label>
              <Input
                id="keywords"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="palavra-chave1, palavra-chave2, palavra-chave3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="canonical_url">URL Canônica</Label>
              <Input
                id="canonical_url"
                value={formData.canonical_url}
                onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
                placeholder="https://exemplo.com/pagina"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Autor</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Autor da página"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="robots">Instruções para Robôs</Label>
              <Select
                value={formData.robots}
                onValueChange={(value) => setFormData({ ...formData, robots: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="index, follow">Indexar e seguir links</SelectItem>
                  <SelectItem value="noindex, follow">Não indexar, seguir links</SelectItem>
                  <SelectItem value="index, nofollow">Indexar, não seguir links</SelectItem>
                  <SelectItem value="noindex, nofollow">Não indexar, não seguir links</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Open Graph (Facebook)</h3>
              
              <div className="space-y-2">
                <Label htmlFor="og_title">Título Open Graph</Label>
                <Input
                  id="og_title"
                  value={formData.og_title}
                  onChange={(e) => setFormData({ ...formData, og_title: e.target.value })}
                  placeholder="Título para compartilhamento no Facebook"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="og_description">Descrição Open Graph</Label>
                <Textarea
                  id="og_description"
                  value={formData.og_description}
                  onChange={(e) => setFormData({ ...formData, og_description: e.target.value })}
                  placeholder="Descrição para compartilhamento no Facebook"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="og_image">Imagem Open Graph</Label>
                <Input
                  id="og_image"
                  value={formData.og_image}
                  onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
                  placeholder="https://exemplo.com/imagem-og.jpg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="og_type">Tipo de Conteúdo</Label>
                  <Select
                    value={formData.og_type}
                    onValueChange={(value) => setFormData({ ...formData, og_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="article">Artigo</SelectItem>
                      <SelectItem value="product">Produto</SelectItem>
                      <SelectItem value="profile">Perfil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="og_locale">Localização</Label>
                  <Select
                    value={formData.og_locale}
                    onValueChange={(value) => setFormData({ ...formData, og_locale: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt_BR">Português (Brasil)</SelectItem>
                      <SelectItem value="pt_PT">Português (Portugal)</SelectItem>
                      <SelectItem value="en_US">English (US)</SelectItem>
                      <SelectItem value="es_ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold">Twitter</h3>
              
              <div className="space-y-2">
                <Label htmlFor="twitter_title">Título Twitter</Label>
                <Input
                  id="twitter_title"
                  value={formData.twitter_title}
                  onChange={(e) => setFormData({ ...formData, twitter_title: e.target.value })}
                  placeholder="Título para compartilhamento no Twitter"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter_description">Descrição Twitter</Label>
                <Textarea
                  id="twitter_description"
                  value={formData.twitter_description}
                  onChange={(e) => setFormData({ ...formData, twitter_description: e.target.value })}
                  placeholder="Descrição para compartilhamento no Twitter"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="twitter_image">Imagem Twitter</Label>
                  <Input
                    id="twitter_image"
                    value={formData.twitter_image}
                    onChange={(e) => setFormData({ ...formData, twitter_image: e.target.value })}
                    placeholder="https://exemplo.com/imagem-twitter.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter_card">Tipo de Card</Label>
                  <Select
                    value={formData.twitter_card}
                    onValueChange={(value) => setFormData({ ...formData, twitter_card: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summary">Resumo</SelectItem>
                      <SelectItem value="summary_large_image">Resumo com imagem grande</SelectItem>
                      <SelectItem value="app">Aplicativo</SelectItem>
                      <SelectItem value="player">Player</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="viewport">Viewport</Label>
              <Input
                id="viewport"
                value={formData.viewport}
                onChange={(e) => setFormData({ ...formData, viewport: e.target.value })}
                placeholder="width=device-width, initial-scale=1.0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="charset">Charset</Label>
              <Input
                id="charset"
                value={formData.charset}
                onChange={(e) => setFormData({ ...formData, charset: e.target.value })}
                placeholder="UTF-8"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="favicon_url">URL do Favicon</Label>
              <Input
                id="favicon_url"
                value={formData.favicon_url}
                onChange={(e) => setFormData({ ...formData, favicon_url: e.target.value })}
                placeholder="https://exemplo.com/favicon.ico"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="structured_data">Dados Estruturados (JSON-LD)</Label>
              <Textarea
                id="structured_data"
                value={formData.structured_data ? JSON.stringify(formData.structured_data, null, 2) : ''}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value)
                    setFormData({ ...formData, structured_data: parsed })
                  } catch (error) {
                    // Ignorar erro de parsing
                  }
                }}
                placeholder='{"@context": "https://schema.org", "@type": "Organization", "name": "Exemplo"}'
                rows={8}
              />
              <div className="text-xs text-gray-500">
                Dados estruturados em formato JSON-LD para melhor indexação
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Configuração Ativa</Label>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Preview das Meta Tags</h3>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-semibold mb-2">Google Search Result</h4>
                  <div className="space-y-1 text-sm">
                    <div className="text-blue-600 font-medium">{formData.title || 'Título da página'}</div>
                    <div className="text-green-600">{formData.canonical_url || 'https://exemplo.com'}</div>
                    <div className="text-gray-600">{formData.description || 'Descrição da página'}</div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-blue-50">
                  <h4 className="font-semibold mb-2">Facebook/Open Graph</h4>
                  <div className="space-y-1 text-sm">
                    <div className="font-medium">{formData.og_title || formData.title || 'Título'}</div>
                    <div className="text-gray-600">{formData.og_description || formData.description || 'Descrição'}</div>
                    {formData.og_image && (
                      <div className="text-xs text-gray-500">Imagem: {formData.og_image}</div>
                    )}
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-sky-50">
                  <h4 className="font-semibold mb-2">Twitter</h4>
                  <div className="space-y-1 text-sm">
                    <div className="font-medium">{formData.twitter_title || formData.title || 'Título'}</div>
                    <div className="text-gray-600">{formData.twitter_description || formData.description || 'Descrição'}</div>
                    <div className="text-xs text-gray-500">Card: {formData.twitter_card}</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              if (isNew) {
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
                setEditingId(null)
              }
            }}
          >
            Cancelar
          </Button>
          <Button onClick={() => handleSave(formData)}>
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciador de SEO</h1>
          <p className="text-gray-600">Configure as meta tags e otimizações SEO para cada página</p>
        </div>
        
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Configuração
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Buscar configurações..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Create New Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Nova Configuração de SEO
            </CardTitle>
            <CardDescription>
              Crie uma nova configuração de SEO para uma página
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderEditForm(null, true)}
          </CardContent>
        </Card>
      )}

      {/* SEO Settings List */}
      <div className="grid gap-4">
        {filteredSettings.map((setting) => (
          <Card key={setting.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <div>
                    <CardTitle className="text-lg">{setting.page_name}</CardTitle>
                    <CardDescription>
                      {setting.title || 'Sem título definido'}
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant={setting.is_active ? "default" : "secondary"}>
                    {setting.is_active ? "Ativo" : "Inativo"}
                  </Badge>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Preview - {setting.page_name}</DialogTitle>
                        <DialogDescription>
                          Visualização das meta tags para esta página
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <h4 className="font-semibold mb-2">Google Search Result</h4>
                          <div className="space-y-1 text-sm">
                            <div className="text-blue-600 font-medium">{setting.title || 'Título da página'}</div>
                            <div className="text-green-600">{setting.canonical_url || 'https://exemplo.com'}</div>
                            <div className="text-gray-600">{setting.description || 'Descrição da página'}</div>
                          </div>
                        </div>

                        <div className="border rounded-lg p-4 bg-blue-50">
                          <h4 className="font-semibold mb-2">Facebook/Open Graph</h4>
                          <div className="space-y-1 text-sm">
                            <div className="font-medium">{setting.og_title || setting.title || 'Título'}</div>
                            <div className="text-gray-600">{setting.og_description || setting.description || 'Descrição'}</div>
                            {setting.og_image && (
                              <div className="text-xs text-gray-500">Imagem: {setting.og_image}</div>
                            )}
                          </div>
                        </div>

                        <div className="border rounded-lg p-4 bg-sky-50">
                          <h4 className="font-semibold mb-2">Twitter</h4>
                          <div className="space-y-1 text-sm">
                            <div className="font-medium">{setting.twitter_title || setting.title || 'Título'}</div>
                            <div className="text-gray-600">{setting.twitter_description || setting.description || 'Descrição'}</div>
                            <div className="text-xs text-gray-500">Card: {setting.twitter_card}</div>
                          </div>
                        </div>

                        {setting.structured_data && (
                          <div className="border rounded-lg p-4 bg-yellow-50">
                            <h4 className="font-semibold mb-2">Dados Estruturados</h4>
                            <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                              {JSON.stringify(setting.structured_data, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(JSON.stringify(setting, null, 2))}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>

                  {editingId === setting.id ? (
                    <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingId(setting.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(setting.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {editingId === setting.id && (
              <CardContent className="border-t pt-6">
                {renderEditForm(setting)}
              </CardContent>
            )}

            {editingId !== setting.id && (
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Título:</span>
                    <div className="text-gray-600 truncate">{setting.title || 'Não definido'}</div>
                  </div>
                  <div>
                    <span className="font-medium">Descrição:</span>
                    <div className="text-gray-600 truncate">{setting.description || 'Não definida'}</div>
                  </div>
                  <div>
                    <span className="font-medium">Palavras-chave:</span>
                    <div className="text-gray-600 truncate">{setting.keywords || 'Não definidas'}</div>
                  </div>
                  <div>
                    <span className="font-medium">URL Canônica:</span>
                    <div className="text-gray-600 truncate">{setting.canonical_url || 'Não definida'}</div>
                  </div>
                  <div>
                    <span className="font-medium">Robôs:</span>
                    <div className="text-gray-600">{setting.robots}</div>
                  </div>
                  <div>
                    <span className="font-medium">Autor:</span>
                    <div className="text-gray-600">{setting.author}</div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {filteredSettings.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Settings className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? 'Nenhuma configuração encontrada' : 'Nenhuma configuração de SEO'}
            </h3>
            <p className="text-gray-600 text-center mb-4">
              {searchTerm 
                ? 'Tente ajustar os termos de busca'
                : 'Comece criando sua primeira configuração de SEO'
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Configuração
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default SEOManager
