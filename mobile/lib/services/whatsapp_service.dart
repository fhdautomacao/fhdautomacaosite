import 'package:flutter/foundation.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:shared_preferences/shared_preferences.dart';

class WhatsAppService extends ChangeNotifier {
  String _whatsappNumber = '';
  bool _isConfigured = false;

  String get whatsappNumber => _whatsappNumber;
  bool get isConfigured => _isConfigured;

  Future<void> initialize() async {
    final prefs = await SharedPreferences.getInstance();
    _whatsappNumber = prefs.getString('whatsapp_number') ?? '';
    _isConfigured = _whatsappNumber.isNotEmpty;
    notifyListeners();
  }

  Future<void> setWhatsAppNumber(String number) async {
    _whatsappNumber = number;
    _isConfigured = number.isNotEmpty;
    
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('whatsapp_number', number);
    notifyListeners();
  }

  Future<bool> sendMessage(String message) async {
    if (!_isConfigured) return false;

    try {
      final url = 'https://wa.me/$_whatsappNumber?text=${Uri.encodeComponent(message)}';
      final uri = Uri.parse(url);
      
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  Future<bool> sendNotification(Map<String, dynamic> notification) async {
    if (!_isConfigured) return false;

    try {
      String message = '';
      
      switch (notification['type']) {
        case 'overdue_bill':
          message = '🚨 BOLETO VENCENDO!\n\n'
              'Empresa: ${notification['data']['company_name']}\n'
              'Valor: R\$ ${notification['data']['amount']}\n'
              'Vencimento: ${notification['data']['due_date']}\n\n'
              'FHD Automação Industrial';
          break;
          
        case 'new_quotation':
          message = '📋 NOVO ORÇAMENTO!\n\n'
              'Cliente: ${notification['data']['client_name']}\n'
              'Empresa: ${notification['data']['company_name']}\n'
              'Serviço: ${notification['data']['service_type']}\n\n'
              'FHD Automação Industrial';
          break;
          
        case 'profit_sharing':
          message = '💰 DIVISÃO DE LUCRO!\n\n'
              'Empresa: ${notification['data']['company_name']}\n'
              'Valor: R\$ ${notification['data']['partner_share']}\n'
              'Data: ${notification['data']['date']}\n\n'
              'FHD Automação Industrial';
          break;
          
        default:
          message = '📱 NOTIFICAÇÃO\n\n'
              '${notification['title']}\n\n'
              '${notification['message']}\n\n'
              'FHD Automação Industrial';
      }

      return await sendMessage(message);
    } catch (e) {
      return false;
    }
  }

  Future<void> testWhatsApp() async {
    if (!_isConfigured) return;

    const testMessage = '🧪 TESTE DE CONEXÃO\n\n'
        'Este é um teste do app WhatsApp Notifier.\n\n'
        'Se você recebeu esta mensagem, a configuração está funcionando!\n\n'
        'FHD Automação Industrial';

    await sendMessage(testMessage);
  }
} 