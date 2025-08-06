import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/notification_service.dart';
import '../services/whatsapp_service.dart';

class SettingsDialog extends StatefulWidget {
  @override
  _SettingsDialogState createState() => _SettingsDialogState();
}

class _SettingsDialogState extends State<SettingsDialog> {
  final _serverUrlController = TextEditingController();
  final _whatsappNumberController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadSettings();
  }

  void _loadSettings() {
    final notificationService = Provider.of<NotificationService>(context, listen: false);
    final whatsappService = Provider.of<WhatsAppService>(context, listen: false);
    
    _serverUrlController.text = notificationService.serverUrl;
    _whatsappNumberController.text = whatsappService.whatsappNumber;
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      child: Container(
        width: double.maxFinite,
        padding: EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Configurações',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 24),
            
            // URL do Servidor
            TextField(
              controller: _serverUrlController,
              decoration: InputDecoration(
                labelText: 'URL do Servidor',
                hintText: 'https://fhd-automacao-industrial-bq67.vercel.app',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.cloud),
              ),
            ),
            SizedBox(height: 16),
            
            // Número do WhatsApp
            TextField(
              controller: _whatsappNumberController,
              decoration: InputDecoration(
                labelText: 'Número do WhatsApp',
                hintText: '5519998652144',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.chat),
              ),
            ),
            SizedBox(height: 24),
            
            // Botões
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => _saveSettings(),
                    child: Text('Salvar'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      foregroundColor: Colors.white,
                    ),
                  ),
                ),
                SizedBox(width: 16),
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => Navigator.of(context).pop(),
                    child: Text('Cancelar'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _saveSettings() async {
    final notificationService = Provider.of<NotificationService>(context, listen: false);
    final whatsappService = Provider.of<WhatsAppService>(context, listen: false);
    
    await notificationService.setServerUrl(_serverUrlController.text);
    await whatsappService.setWhatsAppNumber(_whatsappNumberController.text);
    
    // Testar conexões
    await notificationService.testConnection();
    
    Navigator.of(context).pop();
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Configurações salvas!'),
        backgroundColor: Colors.green,
      ),
    );
  }

  @override
  void dispose() {
    _serverUrlController.dispose();
    _whatsappNumberController.dispose();
    super.dispose();
  }
} 