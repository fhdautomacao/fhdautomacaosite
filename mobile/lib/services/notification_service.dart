import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:shared_preferences/shared_preferences.dart';

class NotificationService extends ChangeNotifier {
  final FlutterLocalNotificationsPlugin _notifications = FlutterLocalNotificationsPlugin();
  String _serverUrl = '';
  bool _isConnected = false;
  List<Map<String, dynamic>> _notificationsList = [];

  String get serverUrl => _serverUrl;
  bool get isConnected => _isConnected;
  List<Map<String, dynamic>> get notificationsList => _notificationsList;

  Future<void> initialize() async {
    // Carregar configurações salvas
    final prefs = await SharedPreferences.getInstance();
    _serverUrl = prefs.getString('server_url') ?? 'https://fhd-automacao-industrial-bq67.vercel.app';

    // Configurar notificações locais
    const androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');
    const iosSettings = DarwinInitializationSettings();
    
    const initSettings = InitializationSettings(
      android: androidSettings,
      iOS: iosSettings,
    );

    await _notifications.initialize(initSettings);

    // Solicitar permissões
    await _requestPermissions();
  }

  Future<void> _requestPermissions() async {
    final androidSettings = AndroidFlutterLocalNotificationsPlugin();
    await androidSettings.requestNotificationsPermission();
  }

  Future<void> setServerUrl(String url) async {
    _serverUrl = url;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('server_url', url);
    notifyListeners();
  }

  Future<bool> testConnection() async {
    try {
      final response = await http.get(Uri.parse('$_serverUrl/api/notify-mobile'));
      _isConnected = response.statusCode == 200;
      notifyListeners();
      return _isConnected;
    } catch (e) {
      _isConnected = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> sendTestNotification() async {
    try {
      final response = await http.post(
        Uri.parse('$_serverUrl/api/notify-mobile'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'type': 'overdue_bill',
          'data': {
            'company_name': 'Empresa Teste',
            'amount': '1.500,00',
            'due_date': '2024-01-15'
          }
        }),
      );

      if (response.statusCode == 200) {
        await _showLocalNotification(
          'Teste de Notificação',
          'Conexão com servidor funcionando!',
        );
        
        // Adicionar à lista
        _notificationsList.insert(0, {
          'title': 'Teste de Notificação',
          'message': 'Conexão com servidor funcionando!',
          'timestamp': DateTime.now().toIso8601String(),
          'type': 'test'
        });
        notifyListeners();
      }
    } catch (e) {
      await _showLocalNotification(
        'Erro de Conexão',
        'Não foi possível conectar com o servidor',
      );
    }
  }

  Future<void> _showLocalNotification(String title, String body) async {
    const androidDetails = AndroidNotificationDetails(
      'whatsapp_notifier_channel',
      'WhatsApp Notifier',
      channelDescription: 'Canal para notificações do WhatsApp Notifier',
      importance: Importance.high,
      priority: Priority.high,
    );

    const notificationDetails = NotificationDetails(
      android: androidDetails,
    );

    await _notifications.show(
      DateTime.now().millisecondsSinceEpoch.remainder(100000),
      title,
      body,
      notificationDetails,
    );
  }

  void clearNotifications() {
    _notificationsList.clear();
    notifyListeners();
  }
} 