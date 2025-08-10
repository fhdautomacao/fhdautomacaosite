import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useJWTAuth } from '../contexts/JWTAuthContext'
import QRCode from 'qrcode'

const MFASetup = () => {
  const { user } = useJWTAuth()
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [factorId, setFactorId] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [secret, setSecret] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [mfaFactors, setMfaFactors] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (user) {
      loadMFAFactors()
    }
  }, [user])

  const loadMFAFactors = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors()
      if (error) throw error
      setMfaFactors(data?.totp || [])
    } catch (error) {
      console.error('Erro ao carregar fatores MFA:', error)
      setError('Erro ao carregar fatores MFA')
    }
  }

  const startMFAEnrollment = async () => {
    try {
      setIsEnrolling(true)
      setError('')
      
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: user?.email || 'Dispositivo Principal'
      })

      if (error) throw error

      const { id, totp } = data
      setFactorId(id)
      setSecret(totp.secret)

      // Gerar QR Code
      const totpUri = totp.uri
      const qrUrl = await QRCode.toDataURL(totpUri)
      setQrCodeUrl(qrUrl)
      
      setIsVerifying(true)
    } catch (error) {
      console.error('Erro ao iniciar configuração MFA:', error)
      setError('Erro ao iniciar configuração MFA: ' + error.message)
      setIsEnrolling(false)
    }
  }

  const verifyMFA = async () => {
    try {
      if (!verificationCode || verificationCode.length !== 6) {
        setError('Código deve ter 6 dígitos')
        return
      }

      const { data, error } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code: verificationCode
      })

      if (error) throw error

      setSuccess('MFA configurado com sucesso!')
      setIsEnrolling(false)
      setIsVerifying(false)
      setVerificationCode('')
      setQrCodeUrl('')
      loadMFAFactors()
    } catch (error) {
      console.error('Erro ao verificar código MFA:', error)
      setError('Código inválido. Tente novamente.')
    }
  }

  const removeMFAFactor = async (factorId) => {
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId })
      if (error) throw error
      
      setSuccess('Fator MFA removido com sucesso!')
      loadMFAFactors()
    } catch (error) {
      console.error('Erro ao remover fator MFA:', error)
      setError('Erro ao remover fator MFA: ' + error.message)
    }
  }

  if (!user) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <p className="text-gray-600">Você precisa estar logado para configurar MFA</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Autenticação Multifator (MFA)</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Fatores MFA Configurados</h3>
        {mfaFactors.length > 0 ? (
          <div className="space-y-2">
            {mfaFactors.map((factor) => (
              <div key={factor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{factor.friendly_name}</p>
                  <p className="text-sm text-gray-500">Tipo: {factor.factor_type}</p>
                  <p className="text-sm text-gray-500">Status: {factor.status}</p>
                </div>
                <button
                  onClick={() => removeMFAFactor(factor.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Nenhum fator MFA configurado</p>
        )}
      </div>

      {!isEnrolling && !isVerifying && (
        <button
          onClick={startMFAEnrollment}
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={isEnrolling}
        >
          Configurar Novo Fator MFA
        </button>
      )}

      {isEnrolling && isVerifying && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Escaneie o QR Code</h3>
            <p className="text-gray-600 mb-4">
              Use um aplicativo autenticador como Google Authenticator, Authy ou similar para escanear este QR Code:
            </p>
            {qrCodeUrl && (
              <div className="flex justify-center mb-4">
                <img src={qrCodeUrl} alt="QR Code MFA" className="border rounded" />
              </div>
            )}
            <div className="bg-gray-100 p-3 rounded">
              <p className="text-sm font-medium">Código manual (se não conseguir escanear):</p>
              <code className="text-sm break-all">{secret}</code>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Digite o Código de Verificação</h3>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                maxLength={6}
              />
              <button
                onClick={verifyMFA}
                disabled={verificationCode.length !== 6}
                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                Verificar
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Digite o código de 6 dígitos do seu aplicativo autenticador
            </p>
          </div>

          <button
            onClick={() => {
              setIsEnrolling(false)
              setIsVerifying(false)
              setQrCodeUrl('')
              setVerificationCode('')
              setError('')
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 rounded">
        <h4 className="font-semibold text-blue-800 mb-2">Por que usar MFA?</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Adiciona uma camada extra de segurança à sua conta</li>
          <li>• Protege contra acesso não autorizado mesmo se sua senha for comprometida</li>
          <li>• Codes temporários são gerados a cada 30 segundos</li>
          <li>• Funciona mesmo sem conexão com a internet</li>
        </ul>
      </div>
    </div>
  )
}

export default MFASetup