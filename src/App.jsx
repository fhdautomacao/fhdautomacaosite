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
import './App.css'

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/quem-somos" element={<AboutPage />} />
              <Route path="/servicos" element={<ServicesPage />} />
              <Route path="/clientes" element={<ClientsPage />} />
              <Route path="/contato" element={<ContactPage />} />
              <Route path="/termos-de-uso" element={<TermosDeUso />} />
              <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  )
}

export default App
