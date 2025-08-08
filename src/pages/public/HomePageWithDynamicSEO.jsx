import DynamicSEO from '@/components/common/DynamicSEO'
import Hero from '@/components/sections/HeroImproved'
import About from '@/components/sections/AboutImproved'
import ServicesSection from '@/components/sections/ServicesSection'
import Products from '@/components/sections/Products'
import Gallery from '@/components/sections/Gallery'
import Clients from '@/components/sections/Clients'
import Contact from '@/components/sections/Contact'

const HomePageWithDynamicSEO = () => {
  return (
    <>
      {/* Componente DynamicSEO que busca dados do banco */}
      <DynamicSEO pageName="home" />
      
      <main>
        <Hero />
        <About />
        <ServicesSection />
        <Products />
        <Gallery />
        <Clients />
        <Contact />
      </main>
    </>
  )
}

export default HomePageWithDynamicSEO
