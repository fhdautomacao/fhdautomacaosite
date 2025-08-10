import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
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
import AdminPageNew from '@/pages/Admin/AdminPageNew.jsx'
import LoginPage from '@/pages/Admin/LoginPage.jsx'
import ProtectedRoute from '@/components/ProtectedRoute'
import { JWTAuthProvider } from '@/contexts/JWTAuthContext'
import { ModalProvider } from '@/components/ModalProvider'
// import TesteFramework from '@/pages/TesteFramework'

function App() {
  return (
    <HelmetProvider>
      <JWTAuthProvider>
        <ModalProvider>
          <Router>
            {/* Move useLocation and isAdminRoute inside Router */}
            <AppContent />
          </Router>
        </ModalProvider>
      </JWTAuthProvider>
    </HelmetProvider>
  )
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin-fhd') || location.pathname.startsWith('/login-admin');

  return (
    <>
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quem-somos" element={<AboutPage />} />
        <Route path="/servicos" element={<ServicesPage />} />
        <Route path="/clientes" element={<ClientsPage />} />
        <Route path="/contato" element={<ContactPage />} />
        <Route path="/orcamento" element={<QuotationPage />} />
        <Route path="/termos-de-uso" element={<TermosDeUso />} />
        <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
        {/* <Route path="/teste" element={<TesteFramework />} /> */}
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
      </Routes>
      {!isAdminRoute && <Footer />}
      {/* Botão flutuante do WhatsApp, somente em rotas públicas */}
      {!isAdminRoute && <FloatingWhatsApp />}
    </>
  );
}

export default App


