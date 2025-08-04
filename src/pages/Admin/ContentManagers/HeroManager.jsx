import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { 
  Save,
  Eye,
  Upload,
  Image,
  Type,
  BarChart3,
  Target,
  Palette,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'

const HeroManager = () => {
  const [heroData, setHeroData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHeroData = async () => {
      setLoading(true)
      try {
        const { data: heroContentArray, error: heroError } = await supabase
          .from("hero_content")
          .select("*, hero_stats(*), hero_features(*)")

        if (heroError) throw heroError

        const heroContent = heroContentArray[0] // Pega o primeiro item do array

        if (!heroContent) {
          setError("Nenhum conteúdo Hero encontrado. Por favor, adicione um.")
          setLoading(false)
          return
        }

        const formattedHeroData = {
          ...heroContent,
          stats: heroContent.hero_stats.reduce((acc, stat) => {
            acc[stat.stat_key] = { value: stat.value, label: stat.label }
            return acc
          }, {}),
          features: heroContent.hero_features.map(feature => ({
            icon: feature.icon,
            title: feature.title,
            description: feature.description
          })),
          ctaText: heroContent.cta_text,
          ctaLink: heroContent.cta_link,
          secondaryCtaText: heroContent.secondary_cta_text,
          secondaryCtaLink: heroContent.secondary_cta_link,
          backgroundImage: heroContent.background_image_url,
          isVisible: heroContent.is_visible,
          showStats: heroContent.show_stats,
          showFeatures: heroContent.show_features,
        }
        setHeroData(formattedHeroData)
      } catch (error) {
        console.error("Erro ao carregar dados do Hero:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchHeroData()
  }, [])

  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const handleInputChange = (field, value) => {
    setHeroData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleStatChange = (statKey, field, value) => {
    setHeroData(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [statKey]: {
          ...prev.stats[statKey],
          [field]: value
        }
      }
    }))
  }

  const handleFeatureChange = (index, field, value) => {
    setHeroData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => 
        i === index ? { ...feature, [field]: value } : feature
      )
    }))
  }

  const addFeature = () => {
    setHeroData(prev => ({
      ...prev,
      features: [...prev.features, { icon: '⭐', title: 'Nova Característica', description: 'Descrição' }]
    }))
  }

  const removeFeature = (index) => {
    setHeroData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const { title, subtitle, description, ctaText, ctaLink, secondaryCtaText, secondaryCtaLink, backgroundImage, isVisible, showStats, showFeatures, stats, features } = heroData

      let imageUrl = backgroundImage;
      if (backgroundImage instanceof File) {
        const file = backgroundImage;
        const filePath = `hero_backgrounds/${Date.now()}_${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("arquivos")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("arquivos")
          .getPublicUrl(filePath);
        imageUrl = publicUrlData.publicUrl;
      }

      // Update hero_content
      const { error: heroContentError } = await supabase
        .from("hero_content")
        .update({
          title,
          subtitle,
          description,
          cta_text: ctaText,
          cta_link: ctaLink,
          secondary_cta_text: secondaryCtaText,
          secondary_cta_link: secondaryCtaLink,
          background_image_url: imageUrl,
          is_visible: isVisible,
          show_stats: showStats,
          show_features: showFeatures,
        })
        .eq("id", heroData.id)

      if (heroContentError) throw heroContentError

      // Update hero_stats
      for (const statKey in stats) {
        const stat = stats[statKey]
        const { error: statError } = await supabase
          .from("hero_stats")
          .update({ value: stat.value, label: stat.label })
          .eq("hero_id", heroData.id)
          .eq("stat_key", statKey)
        if (statError) throw statError
      }

      // Update hero_features (assuming features are managed by their own IDs or re-inserted)
      // For simplicity, let's delete existing and re-insert. In a real app, you'd manage updates/deletes/inserts.
      const { error: deleteFeaturesError } = await supabase
        .from("hero_features")
        .delete()
        .eq("hero_id", heroData.id)
      if (deleteFeaturesError) throw deleteFeaturesError

      for (const feature of features) {
        const { error: featureError } = await supabase
          .from("hero_features")
          .insert({
            hero_id: heroData.id,
            icon: feature.icon,
            title: feature.title,
            description: feature.description,
          })
        if (featureError) throw featureError
      }

      alert("Dados salvos com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar dados do Hero:", error)
      alert("Erro ao salvar dados: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {loading && <p>Carregando dados...</p>}
      {error && <p className="text-red-500">Erro: {error}</p>}
      {!loading && !error && heroData && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Seção Hero</h1>
              <p className="text-gray-600">Edite o conteúdo principal da página inicial</p>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {isPreviewMode ? 'Editar' : 'Preview'}
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </div>

          {isPreviewMode ? (
            /* Preview Mode */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white rounded-lg overflow-hidden"
            >
              <div className="relative min-h-[600px] flex items-center">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                          {heroData.title}
                          <br />
                          <span className="text-blue-300">{heroData.subtitle}</span>
                        </h1>
                        <p className="text-xl text-blue-100 leading-relaxed">
                          {heroData.description}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                          {heroData.ctaText}
                        </Button>
                        <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-900">
                          {heroData.secondaryCtaText}
                        </Button>
                      </div>

                      {heroData.showStats && (
                        <div className="grid grid-cols-3 gap-6 pt-8">
                          {Object.entries(heroData.stats).map(([key, stat]) => (
                            <div key={key} className="text-center">
                              <div className="text-3xl font-bold text-yellow-400">{stat.value}</div>
                              <div className="text-sm text-blue-200">{stat.label}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {heroData.showFeatures && (
                      <div className="grid grid-cols-2 gap-6">
                        {heroData.features.map((feature, index) => (
                          <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                            <div className="text-3xl mb-3">{feature.icon}</div>
                            <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                            <p className="text-blue-200 text-sm">{feature.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <Tabs defaultValue="content" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="content">
                  <Type className="h-4 w-4 mr-2" />
                  Conteúdo
                </TabsTrigger>
                <TabsTrigger value="stats">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Estatísticas
                </TabsTrigger>
                <TabsTrigger value="features">
                  <Target className="h-4 w-4 mr-2" />
                  Características
                </TabsTrigger>
                <TabsTrigger value="design">
                  <Palette className="h-4 w-4 mr-2" />
                  Design
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Textos Principais</CardTitle>
                    <CardDescription>Configure os textos que aparecerão na seção hero</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Título Principal</Label>
                          <Input
                            id="title"
                            value={heroData.title}
                            onChange={(e) => handleInputChange("title", e.target.value)}
                            placeholder="Automação"
                          />
                        </div>
                        <div>
                          <Label htmlFor="subtitle">Subtítulo</Label>
                          <Input
                            id="subtitle"
                            value={heroData.subtitle}
                            onChange={(e) => handleInputChange("subtitle", e.target.value)}
                            placeholder="Hidráulica e Pneumática"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Descrição</Label>
                          <Textarea
                            id="description"
                            value={heroData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Transformamos desafios industriais..."
                            rows={4}
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="ctaText">Texto do Botão Principal</Label>
                          <Input
                            id="ctaText"
                            value={heroData.ctaText}
                            onChange={(e) => handleInputChange("ctaText", e.target.value)}
                            placeholder="Solicitar Orçamento"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ctaLink">Link do Botão Principal</Label>
                          <Input
                            id="ctaLink"
                            value={heroData.ctaLink}
                            onChange={(e) => handleInputChange("ctaLink", e.target.value)}
                            placeholder="/contato"
                          />
                        </div>
                        <div>
                          <Label htmlFor="secondaryCtaText">Texto do Botão Secundário</Label>
                          <Input
                            id="secondaryCtaText"
                            value={heroData.secondaryCtaText}
                            onChange={(e) => handleInputChange("secondaryCtaText", e.target.value)}
                            placeholder="Nossos Serviços"
                          />
                        </div>
                        <div>
                          <Label htmlFor="secondaryCtaLink">Link do Botão Secundário</Label>
                          <Input
                            id="secondaryCtaLink"
                            value={heroData.secondaryCtaLink}
                            onChange={(e) => handleInputChange("secondaryCtaLink", e.target.value)}
                            placeholder="/servicos"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stats" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Estatísticas</CardTitle>
                        <CardDescription>Configure os números que destacam sua empresa</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="showStats">Exibir Estatísticas</Label>
                        <Switch
                          id="showStats"
                          checked={heroData.showStats}
                          onCheckedChange={(checked) => handleInputChange("showStats", checked)}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {Object.entries(heroData.stats).map(([key, stat]) => (
                        <div key={key} className="space-y-3">
                          <h3 className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
                          <div className="space-y-2">
                            <div>
                              <Label htmlFor={`${key}-value`}>Valor</Label>
                              <Input
                                id={`${key}-value`}
                                value={stat.value}
                                onChange={(e) => handleStatChange(key, 'value', e.target.value)}
                                placeholder="10+"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`${key}-label`}>Rótulo</Label>
                              <Input
                                id={`${key}-label`}
                                value={stat.label}
                                onChange={(e) => handleStatChange(key, 'label', e.target.value)}
                                placeholder="Anos de Experiência"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Características</CardTitle>
                        <CardDescription>Destaque os diferenciais da sua empresa</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="showFeatures">Exibir Características</Label>
                        <Switch
                          id="showFeatures"
                          checked={heroData.showFeatures}
                          onCheckedChange={(checked) => handleInputChange("showFeatures", checked)}
                        />
                        <Button size="sm" onClick={addFeature}>
                          <Target className="h-4 w-4 mr-2" />
                          Adicionar
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {heroData.features.map((feature, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">Característica {index + 1}</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFeature(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Remover
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <Label htmlFor={`feature-${index}-icon`}>Ícone (Emoji)</Label>
                              <Input
                                id={`feature-${index}-icon`}
                                value={feature.icon}
                                onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                                placeholder="🔧"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`feature-${index}-title`}>Título</Label>
                              <Input
                                id={`feature-${index}-title`}
                                value={feature.title}
                                onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                                placeholder="Experiência"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`feature-${index}-description`}>Descrição</Label>
                              <Input
                                id={`feature-${index}-description`}
                                value={feature.description}
                                onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                                placeholder="Mais de 10 anos"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="design" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Design e Aparência</CardTitle>
                    <CardDescription>Ajuste o visual da seção hero</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="backgroundImage">URL da Imagem de Fundo</Label>
                      <Input
                        id="backgroundImage"
                        value={heroData.backgroundImage}
                        onChange={(e) => handleInputChange("backgroundImage", e.target.value)}
                        placeholder="/hero-bg.jpg"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isVisible"
                        checked={heroData.isVisible}
                        onCheckedChange={(checked) => handleInputChange("isVisible", checked)}
                      />
                      <Label htmlFor="isVisible">Seção Visível</Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </>
      )}
    </div>
  )
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seção Hero</h1>
          <p className="text-gray-600">Edite o conteúdo principal da página inicial</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {isPreviewMode ? 'Editar' : 'Preview'}
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      {isPreviewMode ? (
        /* Preview Mode */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white rounded-lg overflow-hidden"
        >
          <div className="relative min-h-[600px] flex items-center">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                      {heroData.title}
                      <br />
                      <span className="text-blue-300">{heroData.subtitle}</span>
                    </h1>
                    <p className="text-xl text-blue-100 leading-relaxed">
                      {heroData.description}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                      {heroData.ctaText}
                    </Button>
                    <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-900">
                      {heroData.secondaryCtaText}
                    </Button>
                  </div>

                  {heroData.showStats && (
                    <div className="grid grid-cols-3 gap-6 pt-8">
                      {Object.entries(heroData.stats).map(([key, stat]) => (
                        <div key={key} className="text-center">
                          <div className="text-3xl font-bold text-yellow-400">{stat.value}</div>
                          <div className="text-sm text-blue-200">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {heroData.showFeatures && (
                  <div className="grid grid-cols-2 gap-6">
                    {heroData.features.map((feature, index) => (
                      <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                        <div className="text-3xl mb-3">{feature.icon}</div>
                        <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                        <p className="text-blue-200 text-sm">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        /* Edit Mode */
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">
              <Type className="h-4 w-4 mr-2" />
              Conteúdo
            </TabsTrigger>
            <TabsTrigger value="stats">
              <BarChart3 className="h-4 w-4 mr-2" />
              Estatísticas
            </TabsTrigger>
            <TabsTrigger value="features">
              <Target className="h-4 w-4 mr-2" />
              Características
            </TabsTrigger>
            <TabsTrigger value="design">
              <Palette className="h-4 w-4 mr-2" />
              Design
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Textos Principais</CardTitle>
                <CardDescription>Configure os textos que aparecerão na seção hero</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Título Principal</Label>
                      <Input
                        id="title"
                        value={heroData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Automação"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subtitle">Subtítulo</Label>
                      <Input
                        id="subtitle"
                        value={heroData.subtitle}
                        onChange={(e) => handleInputChange('subtitle', e.target.value)}
                        placeholder="Hidráulica e Pneumática"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={heroData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Transformamos desafios industriais..."
                        rows={4}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="ctaText">Texto do Botão Principal</Label>
                      <Input
                        id="ctaText"
                        value={heroData.ctaText}
                        onChange={(e) => handleInputChange('ctaText', e.target.value)}
                        placeholder="Solicitar Orçamento"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ctaLink">Link do Botão Principal</Label>
                      <Input
                        id="ctaLink"
                        value={heroData.ctaLink}
                        onChange={(e) => handleInputChange('ctaLink', e.target.value)}
                        placeholder="/contato"
                      />
                    </div>
                    <div>
                      <Label htmlFor="secondaryCtaText">Texto do Botão Secundário</Label>
                      <Input
                        id="secondaryCtaText"
                        value={heroData.secondaryCtaText}
                        onChange={(e) => handleInputChange('secondaryCtaText', e.target.value)}
                        placeholder="Nossos Serviços"
                      />
                    </div>
                    <div>
                      <Label htmlFor="secondaryCtaLink">Link do Botão Secundário</Label>
                      <Input
                        id="secondaryCtaLink"
                        value={heroData.secondaryCtaLink}
                        onChange={(e) => handleInputChange('secondaryCtaLink', e.target.value)}
                        placeholder="/servicos"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Estatísticas</CardTitle>
                    <CardDescription>Configure os números que destacam sua empresa</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="showStats">Exibir Estatísticas</Label>
                    <Switch
                      id="showStats"
                      checked={heroData.showStats}
                      onCheckedChange={(checked) => handleInputChange('showStats', checked)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(heroData.stats).map(([key, stat]) => (
                    <div key={key} className="space-y-3">
                      <h3 className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
                      <div className="space-y-2">
                        <div>
                          <Label htmlFor={`${key}-value`}>Valor</Label>
                          <Input
                            id={`${key}-value`}
                            value={stat.value}
                            onChange={(e) => handleStatChange(key, 'value', e.target.value)}
                            placeholder="10+"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`${key}-label`}>Rótulo</Label>
                          <Input
                            id={`${key}-label`}
                            value={stat.label}
                            onChange={(e) => handleStatChange(key, 'label', e.target.value)}
                            placeholder="Anos de Experiência"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Características</CardTitle>
                    <CardDescription>Destaque os diferenciais da sua empresa</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="showFeatures">Exibir Características</Label>
                    <Switch
                      id="showFeatures"
                      checked={heroData.showFeatures}
                      onCheckedChange={(checked) => handleInputChange('showFeatures', checked)}
                    />
                    <Button size="sm" onClick={addFeature}>
                      <Target className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {heroData.features.map((feature, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Característica {index + 1}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFeature(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remover
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <Label htmlFor={`feature-${index}-icon`}>Ícone (Emoji)</Label>
                          <Input
                            id={`feature-${index}-icon`}
                            value={feature.icon}
                            onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                            placeholder="🔧"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`feature-${index}-title`}>Título</Label>
                          <Input
                            id={`feature-${index}-title`}
                            value={feature.title}
                            onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                            placeholder="Experiência"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`feature-${index}-description`}>Descrição</Label>
                          <Input
                            id={`feature-${index}-description`}
                            value={feature.description}
                            onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                            placeholder="Mais de 10 anos"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="design" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Design</CardTitle>
                <CardDescription>Personalize a aparência da seção hero</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="backgroundImage">Imagem de Fundo</Label>
                      <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Clique para fazer upload ou arraste uma imagem</p>
                        <p className="text-xs text-gray-500 mt-1">Recomendado: 1920x1080px</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="isVisible">Seção Visível</Label>
                      <Switch
                        id="isVisible"
                        checked={heroData.isVisible}
                        onCheckedChange={(checked) => handleInputChange('isVisible', checked)}
                      />
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Configurações Avançadas</h3>
                      <p className="text-sm text-gray-600">
                        Configurações adicionais como cores, animações e responsividade serão implementadas em versões futuras.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
}

export default HeroManager