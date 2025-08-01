import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Contact = () => {
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
            
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome *
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Seu nome completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Empresa
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nome da empresa"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    E-mail *
                  </label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <input 
                    type="tel" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Serviço de Interesse
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mensagem *
                </label>
                <textarea 
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descreva sua necessidade ou projeto..."
                ></textarea>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">
                <Send className="mr-2" size={20} />
                Enviar Mensagem
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Informações de Contato</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Phone className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Telefone</h4>
                    <p className="text-gray-600">(19) 99865-2144</p>
                    <p className="text-sm text-gray-500">Atendimento de segunda a sexta</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Mail className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">E-mail</h4>
                    <p className="text-gray-600">comercial@fhdautomacao.com.br</p>
                    <p className="text-sm text-gray-500">Resposta em até 24 horas</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <MapPin className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Endereço</h4>
                    <p className="text-gray-600">
                      R. João Ediberti Biondo, 336<br />
                      Jd. Res. Ravagnani<br />
                      Sumaré - SP, 13171-446
                    </p>
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

            {/* Map Placeholder */}
            <div className="bg-gray-200 rounded-2xl h-64 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin size={48} className="mx-auto mb-4" />
                <p className="font-semibold">Localização</p>
                <p className="text-sm">Sumaré - SP</p>
              </div>
            </div>

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

