# 🛠️ Manutenção

## 📋 Visão Geral

Este guia abrange todas as tarefas de manutenção necessárias para manter o site da FHD Automação funcionando perfeitamente.

## 🔄 Atualizações

### **Dependências do Frontend**
```bash
# Verificar dependências desatualizadas
npm outdated

# Atualizar dependências
npm update

# Atualizar para versões mais recentes
npm audit fix

# Verificar vulnerabilidades
npm audit
```

### **Dependências Críticas**
```json
{
  "react": "^18.2.0",
  "vite": "^5.0.0",
  "@supabase/supabase-js": "^2.39.0",
  "tailwindcss": "^3.4.0"
}
```

### **Atualização Segura**
1. **Backup**: Faça backup antes de atualizar
2. **Teste Local**: Teste em desenvolvimento
3. **Deploy Staging**: Teste em ambiente de staging
4. **Deploy Produção**: Apenas após testes

## 💾 Backup

### **Backup do Banco de Dados**
```bash
# Backup via Supabase CLI
supabase db dump --data-only > backup_$(date +%Y%m%d).sql

# Backup via Dashboard
# 1. Acesse Supabase Dashboard
# 2. Settings → Database
# 3. Download backup
```

### **Backup de Arquivos**
```bash
# Backup do código
git archive --format=zip --output=backup_code_$(date +%Y%m%d).zip HEAD

# Backup de uploads
# Os arquivos estão no Supabase Storage
# Acesse via Dashboard → Storage
```

### **Backup Automático**
- **Supabase**: Backup diário automático
- **Vercel**: Deploy history como backup
- **GitHub**: Versionamento como backup

## 🔍 Monitoramento

### **Verificações Diárias**
- [ ] Site carregando normalmente
- [ ] APIs respondendo
- [ ] Upload de arquivos funcionando
- [ ] Login/logout funcionando
- [ ] Dashboard carregando dados

### **Verificações Semanais**
- [ ] Performance do site
- [ ] Logs de erro
- [ ] Uso de recursos
- [ ] Backup recente
- [ ] Atualizações de segurança

### **Verificações Mensais**
- [ ] Análise de performance
- [ ] Limpeza de dados antigos
- [ ] Revisão de logs
- [ ] Atualização de dependências
- [ ] Backup completo

## 🐛 Troubleshooting

### **Problemas Comuns**

#### **Site Não Carrega**
```bash
# Verificar status do Vercel
curl -I https://your-domain.vercel.app

# Verificar logs
vercel logs

# Verificar build
npm run build
```

#### **APIs Não Respondem**
```bash
# Testar endpoint
curl https://your-domain.vercel.app/api/test

# Verificar variáveis de ambiente
vercel env ls

# Verificar Supabase
supabase status
```

#### **Upload Não Funciona**
```bash
# Verificar storage
supabase storage ls

# Verificar permissões
supabase storage policy list

# Testar upload
curl -X POST https://your-domain.vercel.app/api/bills/installments/upload
```

#### **Login Não Funciona**
```bash
# Verificar Supabase Auth
supabase auth list

# Verificar variáveis
echo $NEXT_PUBLIC_SUPABASE_URL

# Testar conexão
supabase db ping
```

### **Logs de Debug**
```javascript
// Habilitar logs detalhados
localStorage.setItem('debug', 'true');

// Verificar no console
console.log('Debug info:', {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  timestamp: new Date().toISOString(),
  userAgent: navigator.userAgent
});
```

## 🧹 Limpeza

### **Limpeza de Dados**
```sql
-- Remover boletos antigos (mais de 2 anos)
DELETE FROM bills 
WHERE created_at < CURRENT_DATE - INTERVAL '2 years'
AND status = 'cancelled';

-- Remover cotações antigas
DELETE FROM quotations 
WHERE created_at < CURRENT_DATE - INTERVAL '1 year'
AND status = 'rejected';

-- Limpar logs antigos
DELETE FROM activity_logs 
WHERE created_at < CURRENT_DATE - INTERVAL '6 months';
```

### **Limpeza de Arquivos**
```sql
-- Remover arquivos órfãos do storage
DELETE FROM storage.objects 
WHERE bucket_id = 'receipts' 
AND created_at < CURRENT_DATE - INTERVAL '1 year'
AND NOT EXISTS (
  SELECT 1 FROM bill_installments 
  WHERE payment_receipt_path = storage.objects.name
);
```

### **Limpeza de Cache**
```bash
# Limpar cache do npm
npm cache clean --force

# Limpar cache do Vercel
vercel --clear-cache

# Limpar build
rm -rf dist/
rm -rf .vercel/
```

## 🔒 Segurança

### **Auditoria de Segurança**
```bash
# Verificar vulnerabilidades
npm audit

# Verificar dependências
npm ls

# Verificar configurações
supabase status
```

### **Atualizações de Segurança**
```bash
# Atualizar dependências críticas
npm audit fix

# Verificar configurações de segurança
supabase db policy list

# Revisar permissões
supabase auth list
```

### **Monitoramento de Segurança**
- **Logs de Acesso**: Monitorar tentativas de login
- **Rate Limiting**: Configurar limites de requisição
- **IP Blocking**: Bloquear IPs suspeitos
- **SSL/TLS**: Verificar certificados

## 📊 Performance

### **Otimizações**
```bash
# Analisar bundle
npm run build
npx vite-bundle-analyzer dist

# Otimizar imagens
npm run optimize-images

# Verificar performance
npm run lighthouse
```

### **Monitoramento de Performance**
- **Core Web Vitals**: Monitorar LCP, FID, CLS
- **Bundle Size**: Controlar tamanho do bundle
- **Image Optimization**: Otimizar imagens
- **Caching**: Configurar cache adequado

## 🔄 Manutenção Preventiva

### **Rotina Diária**
1. **Verificar Status**: Site e APIs funcionando
2. **Monitorar Logs**: Erros e warnings
3. **Backup**: Verificar backup automático
4. **Performance**: Métricas básicas

### **Rotina Semanal**
1. **Análise de Logs**: Revisar logs de erro
2. **Performance**: Análise de performance
3. **Segurança**: Verificar vulnerabilidades
4. **Limpeza**: Limpeza de dados temporários

### **Rotina Mensal**
1. **Backup Completo**: Backup manual
2. **Atualizações**: Dependências e sistema
3. **Análise de Dados**: Relatórios de uso
4. **Otimizações**: Melhorias de performance

## 🚨 Emergências

### **Site Fora do Ar**
1. **Verificar Vercel**: Status do deploy
2. **Verificar Supabase**: Status do banco
3. **Rollback**: Reverter para versão anterior
4. **Comunicar**: Informar stakeholders

### **Perda de Dados**
1. **Parar Sistema**: Evitar mais perdas
2. **Avaliar Dano**: Identificar dados perdidos
3. **Restaurar Backup**: Usar backup mais recente
4. **Verificar Integridade**: Validar dados restaurados

### **Ataque de Segurança**
1. **Isolar Sistema**: Desconectar da rede
2. **Analisar Logs**: Identificar origem
3. **Corrigir Vulnerabilidade**: Patch de segurança
4. **Notificar**: Informar autoridades se necessário

## 📞 Suporte

### **Contatos de Emergência**
- **Desenvolvedor**: dev@fhdautomacao.com
- **Suporte Técnico**: suporte@fhdautomacao.com
- **WhatsApp**: (11) 99999-9999

### **Recursos Úteis**
- **Vercel Status**: [vercel-status.com](https://vercel-status.com)
- **Supabase Status**: [status.supabase.com](https://status.supabase.com)
- **GitHub Issues**: Para bugs e melhorias
- **Documentação**: Esta pasta `docs/`

### **Escalação**
1. **Nível 1**: Problemas básicos (suporte)
2. **Nível 2**: Problemas técnicos (desenvolvedor)
3. **Nível 3**: Emergências críticas (equipe completa)

## 📋 Checklist de Manutenção

### **Diário**
- [ ] Site carregando
- [ ] APIs funcionando
- [ ] Sem erros críticos
- [ ] Backup automático OK

### **Semanal**
- [ ] Revisar logs de erro
- [ ] Verificar performance
- [ ] Atualizar dependências
- [ ] Limpeza de dados

### **Mensal**
- [ ] Backup completo
- [ ] Auditoria de segurança
- [ ] Análise de performance
- [ ] Atualizações do sistema

### **Trimestral**
- [ ] Revisão completa do sistema
- [ ] Atualização de documentação
- [ ] Treinamento da equipe
- [ ] Planejamento de melhorias

---

**Precisa de ajuda?** Consulte a documentação ou entre em contato com o suporte.
