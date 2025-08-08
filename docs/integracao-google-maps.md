# Integração Google Maps - FHD Automação

## Visão Geral

A integração do Google Maps foi implementada na seção de contato do site, permitindo que os usuários visualizem a localização da empresa e interajam com o mapa de diferentes formas.

## Funcionalidades Implementadas

### 1. Mapa Interativo
- **Localização**: Exibe a localização da FHD Automação em Sumaré, SP
- **Design**: Interface limpa e moderna com gradiente azul
- **Interatividade**: Clique no mapa abre o Google Maps em nova aba

### 2. Botões de Ação
- **"Ver no Mapa"**: Abre o Google Maps com a localização da empresa
- **"Como Chegar"**: Abre o Google Maps com direções para a empresa
- **"Copiar Endereço"**: Copia o endereço completo para a área de transferência

### 3. Feedback Visual
- **Notificação de Cópia**: Mostra confirmação quando o endereço é copiado
- **Efeitos Hover**: Animações suaves nos botões e mapa
- **Ícones Intuitivos**: Uso de ícones do Lucide React para melhor UX

## Componentes Criados

### InteractiveMap.jsx
```jsx
// Localização: src/components/InteractiveMap.jsx
// Funcionalidades:
// - Mapa estático com overlay interativo
// - Botões para diferentes ações
// - Integração com Google Maps via URLs
// - Hook personalizado para cópia de texto
```

### useCopyToClipboard.js
```jsx
// Localização: src/hooks/useCopyToClipboard.js
// Funcionalidades:
// - Copia texto para área de transferência
// - Feedback visual de sucesso
// - Reset automático do estado
```

## Configuração

### Endereço da Empresa
```javascript
const companyAddress = {
  address: "R. João Ediberti Biondo, 336, Jd. Res. Ravagnani, Sumaré - SP, 13171-446",
  coordinates: {
    lat: -22.8219,
    lng: -47.2668
  }
}
```

### URLs do Google Maps
- **Visualização**: `https://www.google.com/maps/search/?api=1&query={endereço}`
- **Direções**: `https://www.google.com/maps/dir/?api=1&destination={endereço}`

## Implementação Futura

### Para Mapa Embutido (Opcional)
Se desejar um mapa real embutido, você precisará:

1. **Obter API Key do Google Maps**:
   - Acesse [Google Cloud Console](https://console.cloud.google.com/)
   - Ative a Maps JavaScript API
   - Crie uma chave de API

2. **Configurar Variável de Ambiente**:
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua_chave_aqui
```

3. **Implementar Iframe**:
```jsx
<iframe
  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(address)}`}
  width="100%"
  height="100%"
  style={{ border: 0 }}
  allowFullScreen=""
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
/>
```

## Vantagens da Implementação Atual

1. **Sem Dependência de API**: Funciona sem chave de API do Google
2. **Performance**: Carregamento rápido sem requisições externas
3. **UX Otimizada**: Interface intuitiva e responsiva
4. **Acessibilidade**: Funciona em todos os dispositivos
5. **Manutenção Simples**: Fácil de atualizar e modificar

## Personalização

### Cores e Estilos
- As cores seguem o tema do site (azul)
- Gradientes e sombras para profundidade
- Animações suaves para interações

### Responsividade
- Layout adaptável para mobile e desktop
- Botões empilhados em telas pequenas
- Grid responsivo para diferentes tamanhos

## Testes

### Funcionalidades a Testar
1. Clique no mapa abre Google Maps
2. Botão "Ver no Mapa" funciona
3. Botão "Como Chegar" funciona
4. Botão "Copiar Endereço" copia corretamente
5. Feedback visual aparece ao copiar
6. Responsividade em diferentes dispositivos

## Manutenção

### Atualização de Endereço
Para alterar o endereço, edite o objeto `companyAddress` no arquivo `InteractiveMap.jsx`.

### Adição de Novas Funcionalidades
O componente é modular e pode ser facilmente estendido com novas funcionalidades como:
- Integração com WhatsApp
- Compartilhamento em redes sociais
- Múltiplas localizações
- Horários de funcionamento dinâmicos
