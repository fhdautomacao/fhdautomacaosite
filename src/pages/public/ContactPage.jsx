import DynamicSEO from '@/components/common/DynamicSEO'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Phone, Mail, MapPin, Clock, Send, FileText, CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

const ContactPage = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [typedText, setTypedText] = useState('')
  const fullText = 'Entre em Contato'
  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6 text-blue-600" />,
      title: "Telefone",
      content: "(19) 99865-2144",
      description: "Atendimento de segunda a sexta"
    },
    {
      icon: <Mail className="h-6 w-6 text-blue-600" />,
      title: "E-mail",
      content: "comercial@fhdautomacao.com.br",
      description: "Resposta em até 24 horas"
    },
    {
      icon: <MapPin className="h-6 w-6 text-blue-600" />,
      title: "Endereço",
      content: "R. João Ediberti Biondo, 336",
      description: "Jd. Res. Ravagnani, Sumaré - SP"
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-600" />,
      title: "Horário",
      content: "08:00 às 18:00",
      description: "Segunda a sexta-feira"
    }
  ]

  useEffect(() => {
    setIsVisible(true)
    let index = 0
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
      }
    }, 100)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <DynamicSEO pageName="contact" />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20 overflow-hidden animate-gradient">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          {/* Floating elements, apenas decorativos */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-16 left-10 w-4 h-4 bg-blue-400 rounded-full animate-float opacity-30"></div>
            <div className="absolute top-8 right-24 w-6 h-6 bg-yellow-400 rounded-full animate-float opacity-20" style={{animationDelay: '2s'}}></div>
            <div className="absolute bottom-16 left-24 w-3 h-3 bg-blue-500 rounded-full animate-float opacity-25" style={{animationDelay: '4s'}}></div>
            <div className="absolute bottom-8 right-12 w-5 h-5 bg-yellow-300 rounded-full animate-float opacity-30" style={{animationDelay: '1s'}}></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className={`text-4xl md:text-6xl font-bold mb-6 typing-cursor ${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>
                {typedText}
              </h1>
              <p className={`text-xl md:text-2xl text-blue-100 ${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`} style={{animationDelay: '1.5s'}}>
                Estamos prontos para atender suas necessidades em automação industrial
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {contactInfo.map((info, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                      {info.icon}
                    </div>
                    <CardTitle className="text-lg">{info.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold text-gray-900 mb-1">{info.content}</p>
                    <CardDescription>{info.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact Form and Map */}
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Solicite um Orçamento</CardTitle>
                  <CardDescription>
                    Conte-nos sobre seu projeto e receba um orçamento personalizado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-6">
                    <div className="bg-blue-100 rounded-full p-6 w-20 h-20 mx-auto flex items-center justify-center">
                      <FileText className="text-blue-600" size={32} />
                    </div>
                    
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800 mb-3">
                        Orçamento Personalizado
                      </h4>
                      <p className="text-gray-600 mb-6">
                        Conte-nos sobre seu projeto e receba um orçamento personalizado em até 24 horas.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="text-green-500" size={16} />
                        <span>Resposta em até 24 horas</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="text-green-500" size={16} />
                        <span>Orçamento gratuito</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="text-green-500" size={16} />
                        <span>Análise técnica especializada</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold"
                      onClick={() => window.location.href = '/orcamento'}
                    >
                      <FileText className="mr-2" size={20} />
                      Solicitar Orçamento
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Map and Additional Info */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Nossa Localização</CardTitle>
                    <CardDescription>
                      Visite nossa sede em Sumaré, São Paulo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center mb-6">
                      <p className="text-gray-600">Mapa interativo será carregado aqui</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                        <div>
                          <p className="font-semibold">Endereço Completo:</p>
                          <p className="text-gray-600">
                            R. João Ediberti Biondo, 336<br />
                            Jd. Res. Ravagnani<br />
                            Sumaré - SP, 13171-446
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Clock className="h-5 w-5 text-blue-600 mt-1" />
                        <div>
                          <p className="font-semibold">Horário de Funcionamento:</p>
                          <p className="text-gray-600">
                            Segunda a Sexta: 08:00 às 18:00<br />
                            Sábado e Domingo: Fechado
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-xl text-blue-900">Atendimento de Emergência</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-800 mb-4">
                      Para situações urgentes, oferecemos atendimento personalizado.
                    </p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Phone className="mr-2 h-5 w-5" />
                      Ligar Agora: (19) 99865-2144
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Perguntas Frequentes
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Respostas para as dúvidas mais comuns sobre nossos serviços
              </p>
            </div>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Qual o prazo para orçamento?</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Nossos orçamentos são elaborados em até 48 horas úteis após o recebimento de todas as informações necessárias do projeto.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Vocês atendem em outras cidades?</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Sim, atendemos toda a região metropolitana de Campinas e interior de São Paulo. Para outras regiões, consulte disponibilidade.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Oferecem garantia nos serviços?</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Todos os nossos serviços possuem garantia. O prazo varia conforme o tipo de serviço, sendo detalhado no contrato.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Fazem manutenção preventiva?</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Sim, oferecemos contratos de manutenção preventiva personalizados para garantir o funcionamento contínuo dos seus equipamentos.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default ContactPage

