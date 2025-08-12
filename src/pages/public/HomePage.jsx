import DynamicSEO from '@/components/common/DynamicSEO'
import Hero from '@/components/sections/HeroImproved'
import About from '@/components/sections/AboutImproved'
import ServicesSection from '@/components/sections/ServicesSection'
import Products from '@/components/sections/Products'
import Gallery from '@/components/sections/Gallery'
import Clients from '@/components/sections/Clients'
import Contact from '@/components/sections/Contact'
import { useEffect, useState } from 'react'
import { servicesAPI } from '@/api/services'
import { categoriesAPI } from '@/api/categories'
import { productsAPI } from '@/api/products'
import { galleryAPI } from '@/api/gallery'
import { clientsAPI } from '@/api/clients'

const HomePage = () => {
  const [services, setServices] = useState([])
  const [serviceCategories, setServiceCategories] = useState([])
  const [products, setProducts] = useState([])
  const [productCategories, setProductCategories] = useState([])
  const [galleryItems, setGalleryItems] = useState([])
  const [galleryCategories, setGalleryCategories] = useState([])
  const [clients, setClients] = useState([])

  useEffect(() => {
    let isCancelled = false
    const load = async () => {
      try {
        const [srv, allCats, prods, gal, cls] = await Promise.all([
          servicesAPI.getActive(),
          categoriesAPI.getByTypes(['service','product','gallery']),
          productsAPI.getAll(),
          galleryAPI.getAll(),
          clientsAPI.getAll(),
        ])
        
        if (!isCancelled) {
          setServices(srv || [])
          const catSrv = (allCats || []).filter(c => c.type === 'service')
          const catProd = (allCats || []).filter(c => c.type === 'product')
          const catGal = (allCats || []).filter(c => c.type === 'gallery')
          setServiceCategories(catSrv)
          setProducts(prods || [])
          setProductCategories(catProd)
          setGalleryItems(gal || [])
          setGalleryCategories(catGal)
          setClients(cls || [])
        }
      } catch (err) {
        console.error('❌ HomePage: Erro ao carregar dados:', err)
        // Apenas logar; as seções têm fallback/estados de erro
        console.warn('Falha ao carregar dados iniciais da Home:', err)
      }
    }
    load()
    return () => { isCancelled = true }
  }, [])

  return (
    <>
      <DynamicSEO pageName="home" />
      
      <main>
        <Hero />
        <About />
        <ServicesSection servicesData={services} serviceCategories={serviceCategories} />
        <Products productsData={products} productCategories={productCategories} />
        <Gallery galleryItemsData={galleryItems} galleryCategories={galleryCategories} />
        <Clients clientsData={clients} enableTyping={false} />
        <Contact servicesData={services} />
      </main>
    </>
  )
}

export default HomePage
