// Script para debugar permissões do usuário admin
console.log('🔍 Debug de Permissões do Usuário Admin');

// Simular verificação de permissões
const checkAdminPermissions = (email) => {
  const isAdmin = email === 'adminfhd@fhd.com'
  const isUser = email === 'fhduser@fhd.com'
  
  const permissions = {
    // Permissões gerais
    canAccessDashboard: isAdmin,
    canAccessBills: isAdmin,
    canAccessProfitSharing: isAdmin,
    canAccessCompanies: isAdmin,
    canAccessSEO: isAdmin,
    
    // Permissões específicas
    canAccessQuotations: true, // Ambos podem acessar
    canAccessClients: true, // Ambos podem acessar
    canAccessProducts: true, // Ambos podem acessar
    canAccessGallery: true, // Ambos podem acessar
    canAccessServices: true, // Ambos podem acessar
    canAccessCosts: isAdmin,
    
    // Permissões de administração
    isAdmin: isAdmin,
    isUser: isUser
  }
  
  return permissions
}

// Testar com adminfhd@fhd.com
const adminPermissions = checkAdminPermissions('adminfhd@fhd.com')
console.log('✅ Permissões do adminfhd@fhd.com:', adminPermissions)

// Verificar seções que devem estar visíveis
const sections = [
  { id: 'dashboard', requiresPermission: null },
  { id: 'content', requiresPermission: null },
  { id: 'catalog', requiresPermission: null },
  { id: 'media', requiresPermission: null },
  { id: 'relationships', requiresPermission: null },
  { id: 'quotations', requiresPermission: 'canAccessQuotations' },
  { id: 'bills', requiresPermission: 'canAccessBills' },
  { id: 'costs', requiresPermission: 'canAccessBills' },
  { id: 'companies', requiresPermission: 'canAccessBills' },
  { id: 'profit-sharing', requiresPermission: 'canAccessBills' },
  { id: 'settings', requiresPermission: null }
]

console.log('📋 Verificação de seções:')
sections.forEach(section => {
  const hasPermission = !section.requiresPermission || adminPermissions[section.requiresPermission]
  console.log(`${hasPermission ? '✅' : '❌'} ${section.id}: ${hasPermission ? 'VISÍVEL' : 'OCULTO'} (${section.requiresPermission || 'sem permissão'})`)
})

// Verificar seções que devem estar visíveis para admin
const expectedVisibleSections = [
  'dashboard', 'content', 'catalog', 'media', 'relationships', 
  'quotations', 'bills', 'costs', 'companies', 'profit-sharing', 'settings'
]

console.log('\n🎯 Seções esperadas para admin:')
expectedVisibleSections.forEach(sectionId => {
  const section = sections.find(s => s.id === sectionId)
  const hasPermission = !section.requiresPermission || adminPermissions[section.requiresPermission]
  console.log(`${hasPermission ? '✅' : '❌'} ${sectionId}`)
})

console.log('\n🔧 Possíveis problemas:')
console.log('1. Verificar se o email está correto: adminfhd@fhd.com')
console.log('2. Verificar se as permissões estão sendo aplicadas corretamente')
console.log('3. Verificar se há configurações de visibilidade no menu')
console.log('4. Verificar se o localStorage tem as permissões salvas')
