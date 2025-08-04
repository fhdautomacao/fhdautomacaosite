import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Header from '@/components/layout/HeaderImproved'
import Footer from '@/components/layout/Footer'
import HomePage from '@/pages/HomePage'
import AboutPage from '@/pages/AboutPage'
import ServicesPage from '@/pages/ServicesPage'
import ContactPage from '@/pages/ContactPage'
import ClientsPage from '@/pages/ClientsPage'
import TermosDeUso from '@/pages/TermosDeUso'
import PoliticaPrivacidade from '@/pages/PoliticaPrivacidade'
import AdminPageNew from '@/pages/Admin/AdminPageNew'
import LoginPage from '@/pages/Admin/LoginPage'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import { AuthProvider } from '@/contexts/AuthContext'
import './App.css'

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <Header />
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
        </Router>
      </AuthProvider>
    </HelmetProvider>
  )
}

export default App


