import DynamicSEO from '@/components/common/DynamicSEO'
import Clients from '@/components/sections/Clients'

const ClientsPage = () => {
  return (
    <>
      <DynamicSEO pageName="clients" />
      <Clients />
    </>
  )
}

export default ClientsPage


