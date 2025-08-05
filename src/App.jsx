import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Header from '@/components/layout/HeaderImproved'
import Footer from '@/components/layout/Footer'
import HomePage from '@/pages/public/HomePage'
import AboutPage from '@/pages/public/AboutPage'
import ServicesPage from '@/pages/public/ServicesPage'
import ContactPage from '@/pages/public/ContactPage'
import ClientsPage from '@/pages/public/ClientsPage'
import TermosDeUso from '@/pages/public/TermosDeUso'
import PoliticaPrivacidade from '@/pages/public/PoliticaPrivacidade'
import AdminPageNew from '@/pages/Admin/AdminPageNew.jsx'
import LoginPage from '@/pages/Admin/LoginPage.jsx'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import { AuthProvider } from '@/contexts/AuthContext'
import './App.css'

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          {/* Move useLocation and isAdminRoute inside Router */}
          <AppContent />
        </Router>
      </AuthProvider>
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
        <Route path="/termos-de-uso" element={<TermosDeUso />} />
        <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
        <Route
          path="/admin-fhd"
          element={
            <ProtectedRoute>
              <AdminPageNew />
            </ProtectedRoute>
          }
        />
        <Route path="/login-admin" element={<LoginPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App


