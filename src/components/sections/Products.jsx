const Products = () => {
  const products = [
    {
      name: "Unidade Hidráulica",
      category: "Sistemas Hidráulicos",
      description: "Unidades hidráulicas completas para diversas aplicações industriais"
    },
    {
      name: "Cilindro Hidráulico",
      category: "Atuadores",
      description: "Cilindros hidráulicos de alta performance e durabilidade"
    },
    {
      name: "Válvulas Proporcionais",
      category: "Controle",
      description: "Válvulas proporcionais para controle preciso de fluxo e pressão"
    },
    {
      name: "Válvulas Direcionais",
      category: "Controle",
      description: "Válvulas direcionais para controle de direção do fluxo hidráulico"
    },
    {
      name: "Bombas de Engrenagem",
      category: "Bombas",
      description: "Bombas de engrenagem robustas e eficientes"
    },
    {
      name: "Bombas de Palhetas Variáveis",
      category: "Bombas",
      description: "Bombas de palhetas com vazão variável para economia de energia"
    },
    {
      name: "Bombas de Pistões",
      category: "Bombas",
      description: "Bombas de pistões para aplicações de alta pressão"
    },
    {
      name: "Motor Hidráulico",
      category: "Motores",
      description: "Motores hidráulicos de alta eficiência e torque"
    },
    {
      name: "Acumuladores Hidráulicos",
      category: "Armazenamento",
      description: "Acumuladores para armazenamento de energia hidráulica"
    },
    {
      name: "Comandos Hidráulicos",
      category: "Controle",
      description: "Sistemas de comando para operação hidráulica"
    },
    {
      name: "Mini Unidade Hidráulica",
      category: "Sistemas Compactos",
      description: "Unidades hidráulicas compactas da Bucher Hydraulics"
    }
  ]

  const categories = [...new Set(products.map(product => product.category))]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Nossos Produtos</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Oferecemos uma linha completa de produtos hidráulicos e pneumáticos de alta qualidade 
            para atender às mais diversas necessidades industriais.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category, index) => (
            <div 
              key={index}
              className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold"
            >
              {category}
            </div>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
            >
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 h-48 flex items-center justify-center">
                <div className="text-white text-6xl">⚙️</div>
              </div>
              <div className="p-6">
                <div className="text-sm text-blue-600 font-semibold mb-2">{product.category}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Não encontrou o que procura?
            </h3>
            <p className="text-gray-600 mb-6">
              Temos uma ampla gama de produtos e soluções personalizadas. 
              Entre em contato conosco para encontrar a solução ideal para sua necessidade.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
              Consultar Especialista
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Products

