import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="bg-blue-600 text-white p-3 rounded-lg mr-3">
                <div className="text-xl font-bold">FHD</div>
              </div>
              <div>
                <h3 className="text-xl font-bold">FHD Automação Industrial</h3>
                <p className="text-gray-400 text-sm">Excelência em Automação</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Especialistas em automação hidráulica e pneumática, oferecendo soluções inovadoras 
              e confiáveis para a indústria. Mais de uma década de experiência atendendo empresas 
              de diversos segmentos com qualidade e eficiência.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-blue-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-blue-600 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-blue-600 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Links Rápidos</h4>
            <ul className="space-y-3">
              <li>
                <a href="#home" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#quem-somos" className="text-gray-300 hover:text-white transition-colors">
                  Quem Somos
                </a>
              </li>
              <li>
                <a href="#servicos" className="text-gray-300 hover:text-white transition-colors">
                  Nossos Serviços
                </a>
              </li>
              <li>
                <a href="#clientes" className="text-gray-300 hover:text-white transition-colors">
                  Nossos Clientes
                </a>
              </li>
              <li>
                <a href="#contato" className="text-gray-300 hover:text-white transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Nossos Serviços</h4>
            <ul className="space-y-3 text-sm">
              <li className="text-gray-300">Automação Hidráulica</li>
              <li className="text-gray-300">Automação Pneumática</li>
              <li className="text-gray-300">Projetos Hidráulicos</li>
              <li className="text-gray-300">Manutenção de Cilindros</li>
              <li className="text-gray-300">Fabricação de Unidades</li>
              <li className="text-gray-300">Consertos de Bombas</li>
            </ul>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Phone className="text-blue-400" size={20} />
              <div>
                <p className="text-sm text-gray-400">Telefone</p>
                <p className="font-semibold">(19) 99865-2144</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="text-blue-400" size={20} />
              <div>
                <p className="text-sm text-gray-400">E-mail</p>
                <p className="font-semibold">comercial@fhdautomacao.com.br</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="text-blue-400" size={20} />
              <div>
                <p className="text-sm text-gray-400">Endereço</p>
                <p className="font-semibold">Sumaré - SP</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 FHD Automação Industrial. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Política de Privacidade
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Termos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

