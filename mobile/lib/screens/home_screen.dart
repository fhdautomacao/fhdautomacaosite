import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/notification_service.dart';
import '../services/whatsapp_service.dart';
import '../widgets/status_card.dart';
import '../widgets/notification_list.dart';
import '../widgets/settings_dialog.dart';

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    _initializeServices();
  }

  Future<void> _initializeServices() async {
    final notificationService = Provider.of<NotificationService>(context, listen: false);
    final whatsappService = Provider.of<WhatsAppService>(context, listen: false);
    
    await notificationService.initialize();
    await whatsappService.initialize();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('WhatsApp Notifier'),
        backgroundColor: Colors.green,
        actions: [
          IconButton(
            icon: Icon(Icons.settings),
            onPressed: () => _showSettingsDialog(),
          ),
        ],
      ),
      body: Consumer2<NotificationService, WhatsAppService>(
        builder: (context, notificationService, whatsappService, child) {
          return Padding(
            padding: EdgeInsets.all(16.0),
            child: Column(
              children: [
                // Status Cards
                Row(
                  children: [
                    Expanded(
                      child: StatusCard(
                        title: 'Servidor',
                        isConnected: notificationService.isConnected,
                        icon: Icons.cloud,
                        color: Colors.blue,
                      ),
                    ),
                    SizedBox(width: 16),
                    Expanded(
                      child: StatusCard(
                        title: 'WhatsApp',
                        isConnected: whatsappService.isConfigured,
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
                        onPressed: notificationService.isConnected 
                          ? () => notificationService.sendTestNotification()
                          : null,
                        icon: Icon(Icons.send),
                        label: Text('Testar Notificação'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue,
                          foregroundColor: Colors.white,
                        ),
                      ),
                    ),
                    SizedBox(width: 16),
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: whatsappService.isConfigured 
                          ? () => whatsappService.testWhatsApp()
                          : null,
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
                
                // Notifications List
                Expanded(
                  child: NotificationList(),
                ),
              ],
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showSettingsDialog(),
        child: Icon(Icons.settings),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _showSettingsDialog() {
    showDialog(
      context: context,
      builder: (context) => SettingsDialog(),
    );
  }
} 