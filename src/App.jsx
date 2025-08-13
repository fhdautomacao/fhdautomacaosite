import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Header from '@/components/layout/HeaderImproved'
import Footer from '@/components/layout/Footer'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import HomePage from '@/pages/public/HomePage'
import AboutPage from '@/pages/public/AboutPage'
import ServicesPage from '@/pages/public/ServicesPage'
import ContactPage from '@/pages/public/ContactPage'
import ClientsPage from '@/pages/public/ClientsPage'
import QuotationPage from '@/pages/QuotationPage'
import TermosDeUso from '@/pages/public/TermosDeUso'
import PoliticaPrivacidade from '@/pages/public/PoliticaPrivacidade'
import ProductDetailPage from '@/pages/public/ProductDetailPage'
import ServiceDetailPage from '@/pages/public/ServiceDetailPage'
import AdminPageNew from '@/pages/Admin/AdminPageNew.jsx'
import LoginPage from '@/pages/Admin/LoginPage.jsx'
import ProtectedRoute from '@/components/ProtectedRoute'
import { JWTAuthProvider } from '@/contexts/JWTAuthContext'
import { ModalProvider } from '@/components/ModalProvider'

function App() {
  return (
    <HelmetProvider>
      <ModalProvider>
        <Router>
          <JWTAuthProvider>
            {/* Move useLocation and isAdminRoute inside Router */}
            <AppContent />
          </JWTAuthProvider>
        </Router>
      </ModalProvider>
    </HelmetProvider>
  )
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin-fhd') || location.pathname.startsWith('/login-admin');

  // Otimização para mobile - lazy loading de componentes não críticos
  const isMobile = window.innerWidth <= 768;

  return (
    <>
      {!isAdminRoute && <Header />}
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/quem-somos" element={<AboutPage />} />
        <Route path="/servicos" element={<ServicesPage />} />
        <Route path="/servico/:slug" element={<ServiceDetailPage />} />
        <Route path="/produto/:slug" element={<ProductDetailPage />} />
        <Route path="/clientes" element={<ClientsPage />} />
        <Route path="/contato" element={<ContactPage />} />
        <Route path="/orcamento" element={<QuotationPage />} />
        <Route path="/termos-de-uso" element={<TermosDeUso />} />
        <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
        
        {/* Rotas de administração - protegidas */}
        <Route
          path="/admin-fhd"
          element={
            <ProtectedRoute>
              <AdminPageNew />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/login-admin" element={<LoginPage />} />
        
        {/* Rota catch-all para redirecionar tentativas de acesso a rotas inexistentes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isAdminRoute && <Footer />}
      {/* Botão flutuante do WhatsApp, somente em rotas públicas */}
      {!isAdminRoute && <FloatingWhatsApp />}
    </>
  );
}

export default App


