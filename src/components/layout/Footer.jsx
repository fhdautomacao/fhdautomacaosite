import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, ArrowRight, Heart } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border border-white rotate-45 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-white rotate-12 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 border border-white -rotate-12 animate-pulse delay-500"></div>
      </div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-8">
              <div className="mr-4">
                <img 
                  src="/logo.png" 
                  alt="FHD Automação Industrial Logo" 
                  className="h-12 w-auto filter brightness-0 invert"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold">FHD Automação Industrial</h3>
                <p className="text-blue-200 text-sm">Excelência em Automação</p>
              </div>
            </div>
            <p className="text-blue-100 mb-8 leading-relaxed text-lg">
              Especialistas em <span className="font-semibold text-white">automação hidráulica e pneumática</span>, oferecendo soluções inovadoras 
              e confiáveis para a indústria. Mais de uma década de experiência atendendo empresas 
              de diversos segmentos com <span className="font-semibold text-white">qualidade e eficiência</span>.
            </p>
            
            {/* Social Media */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Siga-nos nas redes sociais</h4>
              <div className="flex space-x-4">
                <a href="#" className="group bg-blue-700 p-4 rounded-xl hover:bg-white hover:text-blue-800 transition-all duration-300 hover:scale-110 shadow-lg">
                  <Facebook size={24} className="group-hover:scale-110 transition-transform duration-300" />
                </a>
                <a href="#" className="group bg-blue-700 p-4 rounded-xl hover:bg-white hover:text-blue-800 transition-all duration-300 hover:scale-110 shadow-lg">
                  <Instagram size={24} className="group-hover:scale-110 transition-transform duration-300" />
                </a>
                <a href="#" className="group bg-blue-700 p-4 rounded-xl hover:bg-white hover:text-blue-800 transition-all duration-300 hover:scale-110 shadow-lg">
                  <Linkedin size={24} className="group-hover:scale-110 transition-transform duration-300" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-8 text-white">Links Rápidos</h4>
            <ul className="space-y-4">
              {[
                { name: "Home", href: "#home" },
                { name: "Quem Somos", href: "#quem-somos" },
                { name: "Nossos Serviços", href: "#servicos" },
                { name: "Nossos Produtos", href: "#produtos" },
                { name: "Galeria", href: "#galeria" },
                { name: "Nossos Clientes", href: "#clientes" },
                { name: "Contato", href: "#contato" }
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="group flex items-center text-blue-200 hover:text-white transition-all duration-300 hover:translate-x-2"
                  >
                    <ArrowRight size={16} className="mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl font-bold mb-8 text-white">Nossos Serviços</h4>
            <ul className="space-y-4">
              {[
                "Automação Hidráulica",
                "Automação Pneumática", 
                "Projetos Hidráulicos",
                "Manutenção de Cilindros",
                "Fabricação de Unidades",
                "Consertos de Bombas",
                "Instalação de Tubulações"
              ].map((service, index) => (
                <li key={index} className="flex items-center text-blue-200">
                  <div className="w-2 h-2 bg-white rounded-full mr-3 animate-pulse" style={{ animationDelay: `${index * 0.2}s` }}></div>
                  {service}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="border-t border-blue-700 mt-16 pt-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-blue-800/50 rounded-2xl p-6 hover:bg-blue-700/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-4">
                <div className="bg-white text-blue-800 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-sm text-blue-200 mb-1">Telefone</p>
                  <p className="font-bold text-lg text-white">(19) 99865-2144</p>
                </div>
              </div>
            </div>
            
            <div className="group bg-blue-800/50 rounded-2xl p-6 hover:bg-blue-700/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-4">
                <div className="bg-white text-blue-800 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-sm text-blue-200 mb-1">E-mail</p>
                  <p className="font-bold text-lg text-white">comercial@fhdautomacao.com.br</p>
                </div>
              </div>
            </div>
            
            <div className="group bg-blue-800/50 rounded-2xl p-6 hover:bg-blue-700/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-4">
                <div className="bg-white text-blue-800 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-sm text-blue-200 mb-1">Endereço</p>
                  <p className="font-bold text-lg text-white">R. João Eribert Biondo, 336</p>
                  <p className="text-sm text-blue-200">Jd. Res. Ravagnani, Sumaré - SP</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-3xl p-8 backdrop-blur-sm border border-white/20">
            <h4 className="text-2xl font-bold text-white mb-4">
              Pronto para transformar sua indústria?
            </h4>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Entre em contato conosco e descubra como nossas soluções podem otimizar seus processos industriais.
            </p>
            <button 
              className="group bg-white text-blue-800 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 mx-auto"
              onClick={() => window.location.href = '/orcamento'}
            >
              <span>Solicitar Orçamento</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-200 text-sm mb-4 md:mb-0 flex items-center">
            © 2024 FHD Automação Industrial. Feito com 
            <Heart className="mx-2 text-red-400" size={16} fill="currentColor" />
            para a indústria brasileira.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="/politica-de-privacidade" className="text-blue-200 hover:text-white transition-colors duration-300 hover:underline">
              Política de Privacidade
            </a>
            <a href="/termos-de-uso" className="text-blue-200 hover:text-white transition-colors duration-300 hover:underline">
              Termos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

