import React from 'react'
import SEOHead from '@/components/common/SEOHead'

const MobileAppPage = () => {
  return (
    <>
      <SEOHead 
        title="WhatsApp Notifier App - FHD Automação"
        description="App mobile para receber notificações e enviar automaticamente para WhatsApp"
        canonical="https://fhd-automacao-industrial-bq67.vercel.app/app"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-green-500 text-white p-6 text-center">
              <h1 className="text-2xl font-bold mb-2">📱 WhatsApp Notifier</h1>
              <p className="text-green-100">Receba notificações e envie para WhatsApp</p>
            </div>

            {/* Status Cards */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4 text-center border-2 border-gray-200" id="server-status">
                  <div className="text-3xl mb-2">☁️</div>
                  <div className="text-xs font-bold uppercase">Servidor</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center border-2 border-gray-200" id="whatsapp-status">
                  <div className="text-3xl mb-2">📱</div>
                  <div className="text-xs font-bold uppercase">WhatsApp</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  className="w-full bg-blue-500 text-white py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  id="test-notification"
                >
                  🧪 Testar Notificação
                </button>
                <button 
                  className="w-full bg-green-500 text-white py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  id="test-whatsapp"
                >
                  📱 Testar WhatsApp
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className="p-6 border-t border-gray-100">
              <div id="notifications">
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-4">🔔</div>
                  <h3 className="text-lg font-semibold mb-2">Nenhuma notificação</h3>
                  <p className="text-sm">As notificações aparecerão aqui</p>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Button */}
          <button 
            className="fixed bottom-6 right-6 w-16 h-16 bg-green-500 text-white rounded-full text-2xl shadow-lg hover:bg-green-600 transition-colors"
            onClick={() => document.getElementById('settings-modal').style.display = 'block'}
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 hidden z-[9990]"
        id="settings-modal"
        onClick={(e) => e.target.id === 'settings-modal' && (e.target.style.display = 'none')}
      >
        <div className="bg-white rounded-3xl p-8 m-4 max-w-md mx-auto mt-20">
          <h2 className="text-xl font-bold mb-6">⚙️ Configurações</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">URL do Servidor:</label>
              <input 
                type="text" 
                id="server-url"
                className="w-full p-3 border-2 border-gray-200 rounded-lg"
                placeholder="https://fhd-automacao-industrial-bq67.vercel.app"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2">Número do WhatsApp:</label>
              <input 
                type="text" 
                id="whatsapp-number"
                className="w-full p-3 border-2 border-gray-200 rounded-lg"
                placeholder="5519998652144"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button 
              className="bg-green-500 text-white py-3 px-6 rounded-lg font-bold"
              onClick={saveSettings}
            >
              💾 Salvar
            </button>
            <button 
              className="bg-gray-500 text-white py-3 px-6 rounded-lg font-bold"
              onClick={() => document.getElementById('settings-modal').style.display = 'none'}
            >
              ❌ Cancelar
            </button>
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          // Configurações
          let config = {
            serverUrl: localStorage.getItem('serverUrl') || 'https://fhd-automacao-industrial-bq67.vercel.app',
            whatsappNumber: localStorage.getItem('whatsappNumber') || '5519998652144'
          };

          // Status
          let status = {
            serverConnected: false,
            whatsappConfigured: false
          };

          // Notificações
          let notifications = JSON.parse(localStorage.getItem('notifications') || '[]');

          // Inicializar
          function init() {
            updateStatus();
            loadNotifications();
            testServerConnection();
          }

          // Atualizar status
          function updateStatus() {
            const serverCard = document.getElementById('server-status');
            const whatsappCard = document.getElementById('whatsapp-status');

            serverCard.className = \`bg-gray-50 rounded-xl p-4 text-center border-2 \${status.serverConnected ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}\`;
            whatsappCard.className = \`bg-gray-50 rounded-xl p-4 text-center border-2 \${status.whatsappConfigured ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}\`;

            // Atualizar botões
            document.getElementById('test-notification').disabled = !status.serverConnected;
            document.getElementById('test-whatsapp').disabled = !status.whatsappConfigured;
          }

          // Testar conexão com servidor
          async function testServerConnection() {
            try {
              const response = await fetch(\`\${config.serverUrl}/api/notify-mobile\`, {
                method: 'GET'
              });
              status.serverConnected = response.ok;
            } catch (error) {
              status.serverConnected = false;
            }
            updateStatus();
          }

          // Testar notificação
          async function testNotification() {
            try {
              const response = await fetch(\`\${config.serverUrl}/api/notify-mobile\`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  type: 'overdue_bill',
                  data: {
                    company_name: 'Empresa Teste',
                    amount: '1.500,00',
                    due_date: '2024-01-15'
                  }
                })
              });

              if (response.ok) {
                addNotification('Teste de Notificação', 'Conexão com servidor funcionando!', 'test');
                showNotification('✅ Notificação enviada!');
              } else {
                showNotification('❌ Erro ao enviar notificação');
              }
            } catch (error) {
              showNotification('❌ Erro de conexão');
            }
          }

          // Testar WhatsApp
          function testWhatsApp() {
            const message = \`🧪 TESTE DE CONEXÃO

Este é um teste do app WhatsApp Notifier.

Se você recebeu esta mensagem, a configuração está funcionando!

FHD Automação Industrial\`;

            const url = \`https://wa.me/\${config.whatsappNumber}?text=\${encodeURIComponent(message)}\`;
            window.open(url, '_blank');
          }

          // Adicionar notificação
          function addNotification(title, message, type = 'info') {
            const notification = {
              id: Date.now(),
              title,
              message,
              type,
              timestamp: new Date().toISOString()
            };

            notifications.unshift(notification);
            localStorage.setItem('notifications', JSON.stringify(notifications));
            loadNotifications();
          }

          // Carregar notificações
          function loadNotifications() {
            const container = document.getElementById('notifications');
            
            if (notifications.length === 0) {
              container.innerHTML = \`
                <div class="text-center py-8 text-gray-500">
                  <div class="text-4xl mb-4">🔔</div>
                  <h3 class="text-lg font-semibold mb-2">Nenhuma notificação</h3>
                  <p class="text-sm">As notificações aparecerão aqui</p>
                </div>
              \`;
              return;
            }

            container.innerHTML = \`
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold">Notificações Recentes</h3>
                <button onclick="clearNotifications()" class="text-blue-500 hover:text-blue-700">
                  🗑️ Limpar
                </button>
              </div>
              \${notifications.map(notification => \`
                <div class="bg-gray-50 rounded-lg p-4 mb-3 border-l-4 border-blue-500">
                  <div class="font-bold mb-1">\${notification.title}</div>
                  <div>\${notification.message}</div>
                  <div class="text-xs text-gray-500 mt-2">\${formatTime(notification.timestamp)}</div>
                </div>
              \`).join('')}
            \`;
          }

          // Limpar notificações
          function clearNotifications() {
            notifications = [];
            localStorage.setItem('notifications', JSON.stringify(notifications));
            loadNotifications();
          }

          // Formatar tempo
          function formatTime(timestamp) {
            const date = new Date(timestamp);
            const now = new Date();
            const diff = now - date;

            if (diff < 60000) return 'Agora mesmo';
            if (diff < 3600000) return \`\${Math.floor(diff / 60000)} min atrás\`;
            if (diff < 86400000) return \`\${Math.floor(diff / 3600000)} h atrás\`;
            return \`\${Math.floor(diff / 86400000)} dias atrás\`;
          }

          // Mostrar notificação
          function showNotification(message) {
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('WhatsApp Notifier', { body: message });
            }
          }

          // Salvar configurações
          function saveSettings() {
            config.serverUrl = document.getElementById('server-url').value;
            config.whatsappNumber = document.getElementById('whatsapp-number').value;
            
            localStorage.setItem('serverUrl', config.serverUrl);
            localStorage.setItem('whatsappNumber', config.whatsappNumber);
            
            status.whatsappConfigured = config.whatsappNumber.length > 0;
            updateStatus();
            
            testServerConnection();
            document.getElementById('settings-modal').style.display = 'none';
            
            showNotification('✅ Configurações salvas!');
          }

          // Event listeners
          document.getElementById('test-notification').addEventListener('click', testNotification);
          document.getElementById('test-whatsapp').addEventListener('click', testWhatsApp);

          // Solicitar permissão de notificação
          if ('Notification' in window) {
            Notification.requestPermission();
          }

          // Inicializar
          init();
        `
      }} />
    </>
  )
}

export default MobileAppPage 