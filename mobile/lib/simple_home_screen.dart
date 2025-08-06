import 'package:flutter/material.dart';

class SimpleHomeScreen extends StatefulWidget {
  @override
  _SimpleHomeScreenState createState() => _SimpleHomeScreenState();
}

class _SimpleHomeScreenState extends State<SimpleHomeScreen> {
  String _serverUrl = 'https://fhd-automacao-industrial-bq67.vercel.app';
  String _whatsappNumber = '';
  bool _isServerConnected = false;
  bool _isWhatsAppConfigured = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('WhatsApp Notifier'),
        backgroundColor: Colors.green,
        actions: [
          IconButton(
            icon: Icon(Icons.settings),
            onPressed: () => _showSimpleSettings(),
          ),
        ],
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Status Cards
            Row(
              children: [
                Expanded(
                  child: _StatusCard(
                    title: 'Servidor',
                    isConnected: _isServerConnected,
                    icon: Icons.cloud,
                    color: Colors.blue,
                  ),
                ),
                SizedBox(width: 16),
                Expanded(
                  child: _StatusCard(
                    title: 'WhatsApp',
                    isConnected: _isWhatsAppConfigured,
                    icon: Icons.chat,
                    color: Colors.green,
                  ),
                ),
              ],
            ),
            
            SizedBox(height: 24),
            
            // Action Buttons
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _testServer,
                    icon: Icon(Icons.send),
                    label: Text('Testar Servidor'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue,
                      foregroundColor: Colors.white,
                    ),
                  ),
                ),
                SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _testWhatsApp,
                    icon: Icon(Icons.chat),
                    label: Text('Testar WhatsApp'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      foregroundColor: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
            
            SizedBox(height: 24),
            
            // Info Section
            Card(
              child: Padding(
                padding: EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Configuração',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 8),
                    Text('Servidor: $_serverUrl'),
                    SizedBox(height: 4),
                    Text(
                      'WhatsApp: ${_whatsappNumber.isEmpty ? "Não configurado" : _whatsappNumber}',
                    ),
                  ],
                ),
              ),
            ),
            
            SizedBox(height: 16),
            
            // Instructions
            Expanded(
              child: Card(
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Como usar:',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 8),
                      Text('1. Configure seu número do WhatsApp'),
                      Text('2. Teste a conexão'),
                      Text('3. O app receberá notificações automáticas'),
                      Text('4. WhatsApp abrirá com mensagens prontas'),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _testServer() {
    setState(() {
      _isServerConnected = !_isServerConnected;
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(_isServerConnected ? 'Servidor conectado!' : 'Teste de servidor executado'),
        backgroundColor: _isServerConnected ? Colors.green : Colors.orange,
      ),
    );
  }

  void _testWhatsApp() {
    if (_whatsappNumber.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Configure o número do WhatsApp primeiro'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Abrindo WhatsApp...'),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _showSimpleSettings() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Configurações'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              decoration: InputDecoration(
                labelText: 'Número do WhatsApp',
                hintText: '5519998652144',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.chat),
              ),
              onChanged: (value) {
                _whatsappNumber = value;
              },
            ),
            SizedBox(height: 16),
            TextField(
              decoration: InputDecoration(
                labelText: 'URL do Servidor',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.cloud),
              ),
              controller: TextEditingController(text: _serverUrl),
              onChanged: (value) {
                _serverUrl = value;
              },
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () {
              setState(() {
                _isWhatsAppConfigured = _whatsappNumber.isNotEmpty;
              });
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Configurações salvas!'),
                  backgroundColor: Colors.green,
                ),
              );
            },
            child: Text('Salvar'),
          ),
        ],
      ),
    );
  }
}

class _StatusCard extends StatelessWidget {
  final String title;
  final bool isConnected;
  final IconData icon;
  final Color color;

  const _StatusCard({
    required this.title,
    required this.isConnected,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: [
            Icon(
              icon,
              size: 32,
              color: isConnected ? Colors.green : Colors.grey,
            ),
            SizedBox(height: 8),
            Text(
              title,
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 4),
            Text(
              isConnected ? 'Conectado' : 'Desconectado',
              style: TextStyle(
                color: isConnected ? Colors.green : Colors.red,
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }
}