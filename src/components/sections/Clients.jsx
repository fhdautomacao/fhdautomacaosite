import { useState, useEffect } from 'react'
import { Users, TrendingUp, Award, ArrowRight } from 'lucide-react'
import { clientsAPI } from '../../api/clients'
import { useI18n } from '@/i18n/index.jsx'

const Clients = ({ clientsData = null, enableTyping = true }) => {
  const { t } = useI18n()
  const [clients, setClients] = useState(clientsData || [])
  const [loading, setLoading] = useState(!clientsData)
  const [isVisible, setIsVisible] = useState(false)
  const [typedText, setTypedText] = useState('')

  useEffect(() => {
    if (clientsData) return
    const fetchClients = async () => {
      try {
        const data = await clientsAPI.getAll()
        setClients(data)
      } catch (error) {
        console.error('Erro ao carregar clientes:', error)
        setClients(fallbackClients)
      } finally {
        setLoading(false)
      }
    }
    fetchClients()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientsData])

  // Efeito de digitação para o título "Nossos Clientes"
  const titleText = t('clients.title','Nossos Clientes')
  useEffect(() => {
    if (!enableTyping) return
    setIsVisible(true)
    let index = 0
    setTypedText('')
    const timer = setInterval(() => {
      if (index < titleText.length) {
        setTypedText(titleText.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
      }
    }, 100)
    return () => clearInterval(timer)
  }, [titleText, enableTyping])

  // Placeholder client data - in a real implementation, these would be actual client logos/names
  const fallbackClients = [
    { name: "Empresa Industrial A", logo: "🏭", sector: "Industrial" },
    { name: "Metalúrgica B", logo: "⚙️", sector: "Metalurgia" },
    { name: "Automobilística C", logo: "🚗", sector: "Automotivo" },
    { name: "Petroquímica D", logo: "🛢️", sector: "Petroquímica" },
    { name: "Alimentícia E", logo: "🍽️", sector: "Alimentício" },
    { name: "Farmacêutica F", logo: "💊", sector: "Farmacêutico" },
    { name: "Têxtil G", logo: "🧵", sector: "Têxtil" },
    { name: "Papel e Celulose H", logo: "📄", sector: "Papel" },
    { name: "Mineração I", logo: "⛏️", sector: "Mineração" },
    { name: "Siderúrgica J", logo: "🔩", sector: "Siderurgia" },
    { name: "Química K", logo: "🧪", sector: "Química" },
    { name: "Energia L", logo: "⚡", sector: "Energia" }
  ]



  const stats = [
    { 
      number: "100+", 
      label: t('clients.stats.clients','Clientes Atendidos'), 
      icon: <Users size={32} />,
      color: "from-blue-500 to-blue-600"
    },
    { 
      number: "500+", 
      label: t('clients.stats.projects','Projetos Realizados'), 
      icon: <TrendingUp size={32} />,
      color: "from-green-500 to-green-600"
    },
    { 
      number: "10+", 
      label: t('clients.stats.years','Anos de Experiência'), 
      icon: <Award size={32} />,
      color: "from-purple-500 to-purple-600"
    },
    { 
      number: "100%", 
      label: t('clients.stats.satisfaction','Satisfação dos Clientes'), 
      icon: <Users size={32} />,
      color: "from-yellow-500 to-yellow-600"
    }
  ]



  return (
    <section id="clientes" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border border-blue-400 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-blue-300 rotate-12 animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-6 py-2 rounded-full mb-6">
            <Users className="mr-2" size={20} />
            <span className="font-semibold">{t('clients.badge','Clientes Satisfeitos')}</span>
          </div>
          <h2 className={`text-5xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent ${enableTyping ? 'typing-cursor' : ''} ${enableTyping ? (isVisible ? 'animate-slide-in-left' : 'opacity-0') : ''}`}>
            {enableTyping ? typedText : titleText}
          </h2>
          <p className={`text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed ${enableTyping ? (isVisible ? 'animate-slide-in-right' : 'opacity-0') : ''}`} style={enableTyping ? {animationDelay: '1.5s'} : undefined}>
            {t('clients.subtitle','Temos o orgulho de atender empresas de diversos segmentos industriais, sempre com o compromisso de entregar soluções de excelência.')}
          </p>
        </div>

        {/* Client Logos Grid */}
        <div className="mb-20 animate-fade-in-up">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-12">
            {t('clients.gridTitle','Empresas que confiam em nosso trabalho')}
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {clients.map((client, index) => (
              <div 
                key={index}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col items-center justify-center hover:-translate-y-2 hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300">
                  {client.logo}
                </div>
                <div className="text-xs text-gray-600 text-center font-medium mb-1">
                  {client.name}
                </div>
                <div className="text-xs text-blue-600 font-semibold">
                  {client.sector}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-20 animate-fade-in-up">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 text-center hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`bg-gradient-to-r ${stat.color} rounded-2xl p-4 w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-semibold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>



        {/* CTA */}
        <div className="text-center animate-fade-in-up">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl p-12 max-w-4xl mx-auto border border-blue-100">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-6 w-24 h-24 mx-auto mb-8 flex items-center justify-center">
              <Users className="text-white" size={40} />
            </div>
            
            <h3 className="text-3xl font-bold text-gray-800 mb-6">
              {t('clients.ctaTitle','Junte-se aos nossos clientes satisfeitos')}
            </h3>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              {t('clients.ctaSubtitle','Descubra como podemos ajudar sua empresa a alcançar novos patamares de eficiência com nossas soluções em automação hidráulica e pneumática.')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                onClick={() => window.location.href = '/orcamento'}
              >
                <span>{t('clients.requestProposal','Solicitar Proposta')}</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button className="group border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
                <span>{t('clients.seeCases','Conhecer Cases')}</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Clients

