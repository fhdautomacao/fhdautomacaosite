import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send, FileText, CheckCircle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { contactAPI } from '../../api/contact'
import InteractiveMap from '../InteractiveMap'
import { useServices } from '../../hooks/useServices'
import { useMobileDetection } from '../../hooks/useMobileDetection'

const Contact = () => {
  const { services, loading: servicesLoading } = useServices()
  const [showAllServices, setShowAllServices] = useState(false)
  const isMobile = useMobileDetection()
  
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service_of_interest: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      await contactAPI.sendMessage(formData)
      setSubmitStatus('success')
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        service_of_interest: '',
        message: ''
      })
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <section id="contato" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Entre em Contato</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Estamos prontos para atender suas necessidades em automação industrial. 
            Entre em contato conosco e descubra como podemos ajudar sua empresa.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Solicite um Orçamento</h3>
            
            <div className="space-y-8">
              {/* Header com ícone */}
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-6 w-20 h-20 mx-auto flex items-center justify-center mb-4">
                  <FileText className="text-blue-600" size={32} />
                </div>
                
                <h4 className="text-xl font-semibold text-gray-800 mb-3">
                  Orçamento Personalizado
                </h4>
                <p className="text-gray-600">
                  Conte-nos sobre seu projeto e receba um orçamento personalizado em até 24 horas.
                </p>
              </div>
              
              {/* Benefícios */}
              <div className="bg-white rounded-xl p-6 space-y-4">
                <h5 className="font-semibold text-gray-800 mb-4">Por que escolher a FHD?</h5>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CheckCircle className="text-green-500 flex-shrink-0" size={18} />
                    <span>Resposta em até 24 horas</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CheckCircle className="text-green-500 flex-shrink-0" size={18} />
                    <span>Orçamento gratuito e sem compromisso</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CheckCircle className="text-green-500 flex-shrink-0" size={18} />
                    <span>Análise técnica especializada</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CheckCircle className="text-green-500 flex-shrink-0" size={18} />
                    <span>Mais de 10 anos de experiência</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CheckCircle className="text-green-500 flex-shrink-0" size={18} />
                    <span>Atendimento personalizado</span>
                  </div>
                  {!servicesLoading && services.length > 0 && (
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <CheckCircle className="text-green-500 flex-shrink-0" size={18} />
                      <span>{services.length} serviços especializados</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Serviços Dinâmicos */}
              <div className="bg-white rounded-xl p-6">
                <h5 className="font-semibold text-gray-800 mb-4">Nossos Serviços</h5>
                {servicesLoading ? (
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[...Array(6)].map((_, index) => (
                      <div key={index} className="flex items-center space-x-2 text-gray-400 animate-pulse">
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </div>
                    ))}
                  </div>
                ) : services.length > 0 ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {services.slice(0, showAllServices ? services.length : 6).map((service, index) => (
                        <div key={service.id || index} className="flex items-center space-x-2 text-gray-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="truncate">{service.name}</span>
                        </div>
                      ))}
                    </div>
                    {services.length > 6 && !showAllServices && (
                      <div className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAllServices(true)}
                          className="text-blue-600 hover:text-blue-700 text-xs"
                        >
                          Ver todos os {services.length} serviços
                        </Button>
                      </div>
                    )}
                    {showAllServices && services.length > 6 && (
                      <div className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAllServices(false)}
                          className="text-gray-500 hover:text-gray-700 text-xs"
                        >
                          Ver menos
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 text-sm py-4">
                    Nenhum serviço disponível no momento
                  </div>
                )}
              </div>
              
              {/* CTA Button */}
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold"
                onClick={() => window.location.href = '/orcamento'}
              >
                <FileText className="mr-2" size={20} />
                Solicitar Orçamento
              </Button>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Informações de Contato</h3>
                {isMobile && (
                  <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    Toque para abrir
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Phone className="text-blue-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">Telefone</h4>
                    <a 
                      href="tel:+5519998652144" 
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer block flex items-center space-x-2"
                    >
                      <span>(19) 99865-2144</span>
                      {isMobile && <ExternalLink size={14} className="text-blue-500" />}
                    </a>
                    <p className="text-sm text-gray-500">Atendimento de segunda a sexta</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Mail className="text-blue-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">E-mail</h4>
                    <a 
                      href="mailto:comercial@fhdautomacao.com.br?subject=Contato via Site FHD Automação" 
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer block flex items-center space-x-2"
                    >
                      <span>comercial@fhdautomacao.com.br</span>
                      {isMobile && <ExternalLink size={14} className="text-blue-500" />}
                    </a>
                    <p className="text-sm text-gray-500">Resposta em até 24 horas</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <MapPin className="text-blue-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">Endereço</h4>
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=R.+João+Ediberti+Biondo,+336,+Jd.+Res.+Ravagnani,+Sumaré+-+SP,+13171-446" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer block flex items-center space-x-2"
                    >
                      <span>
                        R. João Ediberti Biondo, 336<br />
                        Jd. Res. Ravagnani<br />
                        Sumaré - SP, 13171-446
                      </span>
                      {isMobile && <ExternalLink size={14} className="text-blue-500" />}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Clock className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Horário de Funcionamento</h4>
                    <p className="text-gray-600">
                      Segunda a Sexta: 8h às 18h<br />
                      Sábado: 8h às 12h<br />
                      Domingo: Fechado
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Map */}
            <InteractiveMap />

            {/* Emergency Contact */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h4 className="font-bold text-red-800 mb-2">Atendimento de Emergência</h4>
              <p className="text-red-700 text-sm mb-3">
                Para situações urgentes fora do horário comercial
              </p>
              <p className="font-semibold text-red-800">(19) 99865-2144</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact

