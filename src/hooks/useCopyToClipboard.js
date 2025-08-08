import { useState } from 'react'

export const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      
      // Reset do estado após 2 segundos
      setTimeout(() => {
        setCopied(false)
      }, 2000)
      
      return true
    } catch (error) {
      console.error('Erro ao copiar para área de transferência:', error)
      return false
    }
  }

  return { copyToClipboard, copied }
}
