import { Helmet } from 'react-helmet-async'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react'

const ContactPage = () => {
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

  return (
    <>
      <Helmet>
        <title>Contato - FHD Automação Industrial</title>
        <meta 
          name="description" 
          content="Entre em contato com a FHD Automação Industrial. Telefone: (19) 99865-2144. E-mail: comercial@fhdautomacao.com.br. Endereço em Sumaré, SP." 
        />
        <meta 
          name="keywords" 
          content="contato FHD Automação, telefone automação industrial, endereço Sumaré SP, orçamento hidráulica pneumática" 
        />
        <link rel="canonical" href="https://fhdautomacao.com.br/contato" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Entre em Contato
              </h1>
              <p className="text-xl md:text-2xl text-blue-100">
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
                    Preencha o formulário abaixo e entraremos em contato em breve
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nome *</Label>
                        <Input id="name" placeholder="Seu nome completo" required />
                      </div>
                      <div>
                        <Label htmlFor="company">Empresa</Label>
                        <Input id="company" placeholder="Nome da empresa" />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">E-mail *</Label>
                        <Input id="email" type="email" placeholder="seu@email.com" required />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefone *</Label>
                        <Input id="phone" placeholder="(00) 00000-0000" required />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="service">Serviço de Interesse</Label>
                      <select 
                        id="service" 
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Selecione um serviço</option>
                        <option value="automacao">Automação Hidráulica e Pneumática</option>
                        <option value="projetos">Projetos Hidráulicos</option>
                        <option value="startup">Start-up em Unidades Hidráulicas</option>
                        <option value="fabricacao">Fabricação em Unidades Hidráulicas</option>
                        <option value="manutencao">Manutenção de Cilindros</option>
                        <option value="instalacao">Instalação e Dobras em Tubulações</option>
                        <option value="consertos">Consertos em Bombas Hidráulicas</option>
                        <option value="outros">Outros</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="message">Mensagem *</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Descreva sua necessidade ou projeto..."
                        rows={5}
                        required 
                      />
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                      <Send className="mr-2 h-5 w-5" />
                      Enviar Mensagem
                    </Button>
                  </form>
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
                      Para situações urgentes, oferecemos atendimento 24/7 para nossos clientes.
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

