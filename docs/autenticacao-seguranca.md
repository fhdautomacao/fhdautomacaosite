# 🔐 Autenticação e Segurança

## 📋 Visão Geral

O sistema utiliza **Supabase Auth** para autenticação e implementa várias camadas de segurança para proteger dados e usuários.

## 🔑 Sistema de Autenticação

### **Supabase Auth**
```javascript
import { supabase } from '@/lib/supabase'

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

// Logout
const { error } = await supabase.auth.signOut()

// Verificar sessão
const { data: { session } } = await supabase.auth.getSession()
```

### **Hook de Autenticação**
```javascript
import { useAuth } from '@/hooks/useAuth'

const { user, login, logout, loading } = useAuth()

// Login
const handleLogin = async (email, password) => {
  try {
    await login(email, password)
    // Redirecionar para dashboard
  } catch (error) {
    console.error('Erro no login:', error)
  }
}

// Logout
const handleLogout = async () => {
  await logout()
  // Redirecionar para login
}
```

## 🛡️ Camadas de Segurança

### **1. Row Level Security (RLS)**
```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Política para boletos
CREATE POLICY "Users can view own bills" ON bills
  FOR ALL USING (auth.uid() = user_id);

-- Política para cotações
CREATE POLICY "Users can view own quotations" ON quotations
  FOR ALL USING (auth.uid() = user_id);
```

### **2. Validação de Entrada**
```javascript
// Validação de email
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Validação de senha
const validatePassword = (password) => {
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /[0-9]/.test(password)
}

// Sanitização de dados
const sanitizeInput = (input) => {
  return input.replace(/[<>]/g, '')
}
```

### **3. Headers de Segurança**
```javascript
// Configuração de headers
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'"
}
```

## 🔒 Controle de Acesso

### **Níveis de Usuário**
```javascript
// Tipos de usuário
const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  OPERATOR: 'operator',
  VIEWER: 'viewer'
}

// Verificar permissões
const hasPermission = (user, permission) => {
  const permissions = {
    admin: ['read', 'write', 'delete', 'admin'],
    manager: ['read', 'write'],
    operator: ['read', 'write'],
    viewer: ['read']
  }
  
  return permissions[user.role]?.includes(permission) || false
}
```

### **Middleware de Autenticação**
```javascript
// Middleware para rotas protegidas
const requireAuth = (Component) => {
  return (props) => {
    const { user, loading } = useAuth()
    
    if (loading) {
      return <Spinner />
    }
    
    if (!user) {
      return <Navigate to="/login" />
    }
    
    return <Component {...props} />
  }
}

// Usar middleware
const ProtectedDashboard = requireAuth(Dashboard)
```

## 🔐 Gerenciamento de Senhas

### **Política de Senhas**
```javascript
// Validação de senha forte
const validateStrongPassword = (password) => {
  const requirements = {
    minLength: 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*]/.test(password)
  }
  
  return Object.values(requirements).every(Boolean)
}

// Força da senha
const getPasswordStrength = (password) => {
  let score = 0
  
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[!@#$%^&*]/.test(password)) score++
  
  return {
    score,
    level: score < 2 ? 'weak' : score < 4 ? 'medium' : 'strong'
  }
}
```

### **Recuperação de Senha**
```javascript
// Enviar email de recuperação
const resetPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  })
  
  if (error) {
    throw new Error('Erro ao enviar email de recuperação')
  }
}

// Alterar senha
const updatePassword = async (newPassword) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })
  
  if (error) {
    throw new Error('Erro ao alterar senha')
  }
}
```

## 🚫 Proteção contra Ataques

### **1. Rate Limiting**
```javascript
// Rate limiting para login
const loginAttempts = new Map()

const checkRateLimit = (email) => {
  const attempts = loginAttempts.get(email) || 0
  
  if (attempts >= 5) {
    const lastAttempt = loginAttempts.get(`${email}_time`)
    const timeDiff = Date.now() - lastAttempt
    
    if (timeDiff < 15 * 60 * 1000) { // 15 minutos
      throw new Error('Muitas tentativas. Tente novamente em 15 minutos.')
    }
    
    loginAttempts.delete(email)
    loginAttempts.delete(`${email}_time`)
  }
  
  return true
}
```

### **2. CSRF Protection**
```javascript
// Token CSRF
const generateCSRFToken = () => {
  return crypto.randomUUID()
}

// Verificar token
const verifyCSRFToken = (token, storedToken) => {
  return token === storedToken
}
```

### **3. XSS Protection**
```javascript
// Sanitização de HTML
import DOMPurify from 'dompurify'

const sanitizeHTML = (html) => {
  return DOMPurify.sanitize(html)
}

// Escapar dados
const escapeHTML = (str) => {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}
```

### **4. SQL Injection Protection**
```javascript
// Usar parâmetros preparados (Supabase já faz isso)
const getBills = async (userId) => {
  const { data, error } = await supabase
    .from('bills')
    .select('*')
    .eq('user_id', userId) // Parâmetro seguro
  
  if (error) throw error
  return data
}
```

## 🔍 Logs de Segurança

### **Audit Trail**
```javascript
// Log de atividades
const logActivity = async (userId, action, details) => {
  const { error } = await supabase
    .from('activity_logs')
    .insert({
      user_id: userId,
      action,
      details,
      ip_address: await getClientIP(),
      user_agent: navigator.userAgent
    })
  
  if (error) {
    console.error('Erro ao logar atividade:', error)
  }
}

// Exemplos de uso
await logActivity(user.id, 'login', { success: true })
await logActivity(user.id, 'create_bill', { bill_id: billId })
await logActivity(user.id, 'delete_bill', { bill_id: billId })
```

### **Monitoramento de Segurança**
```javascript
// Detectar atividades suspeitas
const detectSuspiciousActivity = (userId, action) => {
  const suspiciousPatterns = {
    multiple_failed_logins: 5,
    rapid_actions: 10, // ações por minuto
    unusual_hours: ['23:00', '06:00']
  }
  
  // Implementar lógica de detecção
  return false
}
```

## 🔄 Sessões e Tokens

### **Gerenciamento de Sessão**
```javascript
// Verificar sessão
const checkSession = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    // Redirecionar para login
    window.location.href = '/login'
    return null
  }
  
  return session
}

// Renovar token
const refreshToken = async () => {
  const { data, error } = await supabase.auth.refreshSession()
  
  if (error) {
    // Logout se não conseguir renovar
    await logout()
  }
  
  return data.session
}
```

### **Configuração de Tokens**
```javascript
// Configuração do Supabase
const supabaseConfig = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
}
```

## 🛡️ Segurança de Arquivos

### **Upload Seguro**
```javascript
// Validação de arquivos
const validateFile = (file) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
  const maxSize = 5 * 1024 * 1024 // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Tipo de arquivo não permitido')
  }
  
  if (file.size > maxSize) {
    throw new Error('Arquivo muito grande')
  }
  
  return true
}

// Upload seguro
const uploadFile = async (file, path) => {
  validateFile(file)
  
  const { data, error } = await supabase.storage
    .from('receipts')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    })
  
  if (error) throw error
  return data
}
```

### **Controle de Acesso a Arquivos**
```sql
-- Política para storage
CREATE POLICY "Users can upload own files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'receipts' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'receipts' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

## 🔐 Variáveis de Ambiente

### **Configuração Segura**
```env
# Supabase (Nunca commitar no Git)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# JWT Secret (para APIs customizadas)
JWT_SECRET=your_jwt_secret_here

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000

# Session
SESSION_SECRET=your_session_secret
SESSION_MAX_AGE=86400
```

### **Validação de Ambiente**
```javascript
// Verificar variáveis obrigatórias
const validateEnvironment = () => {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ]
  
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Variáveis de ambiente faltando: ${missing.join(', ')}`)
  }
}
```

## 🚨 Incidentes de Segurança

### **Procedimentos de Emergência**
```javascript
// Bloquear usuário
const blockUser = async (userId, reason) => {
  const { error } = await supabase
    .from('users')
    .update({ 
      is_active: false,
      blocked_at: new Date().toISOString(),
      block_reason: reason
    })
    .eq('id', userId)
  
  if (error) throw error
}

// Log de incidente
const logSecurityIncident = async (incident) => {
  await logActivity(null, 'security_incident', incident)
  
  // Notificar administradores
  await notifyAdmins(incident)
}
```

### **Checklist de Resposta**
1. **Isolar**: Bloquear acesso imediato
2. **Investigar**: Analisar logs e evidências
3. **Corrigir**: Remover vulnerabilidade
4. **Notificar**: Informar stakeholders
5. **Documentar**: Registrar incidente
6. **Prevenir**: Implementar medidas preventivas

## 📊 Monitoramento

### **Métricas de Segurança**
- **Tentativas de Login**: Sucesso vs falha
- **Atividades Suspeitas**: Padrões anômalos
- **Acessos por IP**: Geolocalização
- **Uso de Recursos**: Picos de atividade

### **Alertas**
```javascript
// Configurar alertas
const securityAlerts = {
  multiple_failed_logins: {
    threshold: 5,
    action: 'block_user'
  },
  unusual_activity: {
    threshold: 10,
    action: 'notify_admin'
  },
  data_breach: {
    threshold: 1,
    action: 'emergency_response'
  }
}
```

---

**Próximo**: [Funcionalidades](./funcionalidades.md)
