import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

const Breadcrumbs = ({ customItems = [] }) => {
  const location = useLocation()
  
  // Verificar se estamos em uma rota de administração
  const isAdminRoute = location.pathname.startsWith('/admin-fhd') || 
                      location.pathname.startsWith('/login-admin') ||
                      location.pathname.startsWith('/admin')
  
  // Se estamos em uma rota de administração, não exibir breadcrumbs
  if (isAdminRoute) {
    return null
  }
  
  // Mapear rotas para nomes amigáveis (apenas rotas públicas)
  const routeNames = {
    '/': 'Home',
    '/quem-somos': 'Quem Somos',
    '/servicos': 'Serviços',
    '/produtos': 'Produtos',
    '/clientes': 'Clientes',
    '/contato': 'Contato',
    '/orcamento': 'Orçamento',
    '/termos-de-uso': 'Termos de Uso',
    '/politica-de-privacidade': 'Política de Privacidade'
  }

  // Gerar breadcrumbs baseado na URL atual
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment)
    
    const breadcrumbs = [
      {
        name: 'Home',
        path: '/',
        icon: <Home size={16} />
      }
    ]

    let currentPath = ''
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      
      // Verificar se o segmento atual não é uma rota de administração
      if (segment === 'admin-fhd' || segment === 'login-admin' || segment === 'admin') {
        return // Pular este segmento para não expor rotas administrativas
      }
      
      // Se temos itens customizados, usar eles
      const customItem = customItems.find(item => item.path === currentPath)
      
      if (customItem) {
        breadcrumbs.push({
          name: customItem.name,
          path: currentPath,
          isCurrent: index === pathSegments.length - 1
        })
      } else {
        // Usar mapeamento padrão ou o segmento capitalizado
        const name = routeNames[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1)
        breadcrumbs.push({
          name,
          path: currentPath,
          isCurrent: index === pathSegments.length - 1
        })
      }
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  // Dados estruturados para SEO (apenas para rotas públicas)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://fhdautomacao.com.br${item.path}`
    }))
  }

  return (
    <>
      {/* Dados estruturados */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      
      {/* Breadcrumbs visuais */}
      <nav className="mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          {breadcrumbs.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight size={16} className="mx-2 text-gray-400" />
              )}
              
              {item.isCurrent ? (
                <span className="text-gray-900 font-medium" aria-current="page">
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.name}
                </span>
              ) : (
                <Link 
                  to={item.path}
                  className="hover:text-blue-600 transition-colors duration-200 flex items-center"
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}

export default Breadcrumbs
