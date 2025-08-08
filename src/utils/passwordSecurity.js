// Utilitários para segurança de senhas

/**
 * Gera hash SHA-1 usando Web Crypto API
 * @param {string} message - Mensagem para hash
 * @returns {Promise<string>} - Hash em formato hexadecimal
 */
const sha1Hash = async (message) => {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Verifica se uma senha foi comprometida usando o serviço HaveIBeenPwned
 * @param {string} password - A senha a ser verificada
 * @returns {Promise<boolean>} - true se a senha foi comprometida
 */
export const checkPasswordBreach = async (password) => {
  try {
    // Gerar hash SHA-1 da senha usando Web Crypto API
    const hash = (await sha1Hash(password)).toUpperCase()
    const prefix = hash.substring(0, 5)
    const suffix = hash.substring(5)

    // Consultar API do HaveIBeenPwned
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`)
    
    if (!response.ok) {
      console.warn('Não foi possível verificar se a senha foi comprometida')
      return false
    }

    const data = await response.text()
    const lines = data.split('\n')
    
    // Verificar se o hash da senha está na lista
    for (const line of lines) {
      const [hashSuffix] = line.split(':')
      if (hashSuffix === suffix) {
        return true // Senha comprometida
      }
    }
    
    return false // Senha não comprometida
  } catch (error) {
    console.error('Erro ao verificar senha comprometida:', error)
    return false // Em caso de erro, permitir o uso da senha
  }
}

/**
 * Valida a força da senha
 * @param {string} password - A senha a ser validada
 * @returns {object} - Resultado da validação
 */
export const validatePasswordStrength = (password) => {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  
  const errors = []
  
  if (password.length < minLength) {
    errors.push(`A senha deve ter pelo menos ${minLength} caracteres`)
  }
  
  if (!hasUpperCase) {
    errors.push('A senha deve conter pelo menos uma letra maiúscula')
  }
  
  if (!hasLowerCase) {
    errors.push('A senha deve conter pelo menos uma letra minúscula')
  }
  
  if (!hasNumbers) {
    errors.push('A senha deve conter pelo menos um número')
  }
  
  if (!hasSpecialChar) {
    errors.push('A senha deve conter pelo menos um caractere especial')
  }
  
  const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar, password.length >= minLength]
    .filter(Boolean).length
  
  let strengthLevel = 'Muito Fraca'
  if (strength >= 5) strengthLevel = 'Forte'
  else if (strength >= 4) strengthLevel = 'Média'
  else if (strength >= 3) strengthLevel = 'Fraca'
  
  return {
    isValid: errors.length === 0,
    errors,
    strength: strengthLevel,
    score: strength
  }
}

/**
 * Gera uma senha segura
 * @param {number} length - Comprimento da senha
 * @returns {string} - Senha gerada
 */
export const generateSecurePassword = (length = 12) => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  
  const allChars = uppercase + lowercase + numbers + symbols
  let password = ''
  
  // Garantir pelo menos um caractere de cada tipo
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]
  
  // Preencher o resto com caracteres aleatórios
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }
  
  // Embaralhar a senha
  return password.split('').sort(() => Math.random() - 0.5).join('')
}