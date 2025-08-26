import { useState } from 'react'
import { MapPin, ExternalLink, Check, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCopyToClipboard } from '../hooks/useCopyToClipboard'

const InteractiveMap = () => {
  const { copyToClipboard, copied } = useCopyToClipboard()
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState(false)

  // Coordenadas da FHD Automação em Sumaré, SP
  const companyAddress = {
    address: "R. João Ediberti Biondo, 336, Jd. Res. Ravagnani, Sumaré - SP, 13171-446",
    coordinates: {
      lat: -22.8219, // Latitude aproximada de Sumaré, SP
      lng: -47.2668  // Longitude aproximada de Sumaré, SP teste
    }
  }

  // Função para abrir o Google Maps em nova aba
  const openGoogleMaps = () => {
    const encodedAddress = encodeURIComponent(companyAddress.address)
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
    window.open(googleMapsUrl, '_blank')
  }

  // Função para abrir o Google Maps com direções
  const openDirections = () => {
    const encodedAddress = encodeURIComponent(companyAddress.address)
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`
    window.open(googleMapsUrl, '_blank')
  }

  // Função para copiar o endereço
  const copyAddress = () => {
    copyToClipboard(companyAddress.address)
  }

  return (
    <div className="space-y-4">
      {/* Mapa Interativo */}
      <div className="bg-gray-100 rounded-2xl h-64 relative overflow-hidden">
        {/* Mapa Embutido do Google Maps */}
        <div className="w-full h-full relative">
          {!mapError ? (
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${companyAddress.coordinates.lat},${companyAddress.coordinates.lng}&zoom=16&maptype=roadmap`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização FHD Automação"
              className="rounded-2xl"
              onLoad={() => setMapLoaded(true)}
              onError={() => setMapError(true)}
            />
          ) : (
            /* Fallback quando o mapa não carrega */
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 relative cursor-pointer group" onClick={openGoogleMaps}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={48} className="mx-auto mb-4 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                  <p className="font-semibold text-gray-800">Localização</p>
                  <p className="text-sm text-gray-600">Sumaré - SP</p>
                  <p className="text-xs text-gray-500 mt-2">Clique para abrir no Google Maps</p>
                </div>
              </div>
              
              {/* Overlay de interação */}
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-200" />
            </div>
          )}
          
          {/* Overlay com botão para abrir em nova aba */}
          <div className="absolute top-4 right-4">
            <Button
              onClick={openGoogleMaps}
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white text-gray-800 shadow-lg"
            >
              <ExternalLink size={16} className="mr-1" />
              Abrir
            </Button>
          </div>
        </div>
      </div>

      {/* Botões de Interação */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button 
          onClick={openGoogleMaps}
          variant="outline"
          className="flex items-center justify-center space-x-2 text-sm hover:bg-blue-50"
        >
          <MapPin size={16} />
          <span>Ver no Mapa</span>
        </Button>
        
        <Button 
          onClick={openDirections}
          variant="outline"
          className="flex items-center justify-center space-x-2 text-sm hover:bg-blue-50"
        >
          <Navigation size={16} />
          <span>Como Chegar</span>
        </Button>
        
        <Button 
          onClick={copyAddress}
          variant="outline"
          className="flex items-center justify-center space-x-2 text-sm hover:bg-blue-50"
        >
          {copied ? (
            <>
              <Check size={16} className="text-green-600" />
              <span className="text-green-600">Copiado!</span>
            </>
          ) : (
            <span>Copiar Endereço</span>
          )}
        </Button>
      </div>

      {/* Informações do Endereço */}
      <div className="bg-blue-50 rounded-xl p-4">
        <h4 className="font-semibold text-gray-800 mb-2">Endereço Completo</h4>
        <p className="text-sm text-gray-600 leading-relaxed">
          {companyAddress.address}
        </p>
      </div>
    </div>
  )
}

export default InteractiveMap
