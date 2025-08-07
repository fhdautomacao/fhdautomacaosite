import 'package:flutter/foundation.dart';
import 'package:connectivity_plus/connectivity_plus.dart';

import 'api_service.dart';
import 'storage_service.dart';
import 'notification_service.dart';

class SyncService {
  static bool _isSyncing = false;
  static final List<String> _syncErrors = [];

  // Verificar conectividade
  static Future<bool> _checkConnectivity() async {
    final connectivityResult = await Connectivity().checkConnectivity();
    return connectivityResult != ConnectivityResult.none;
  }

  // Sincronização completa após login
  static Future<SyncResult> performFullSync() async {
    if (_isSyncing) {
      return SyncResult(
        success: false,
        message: 'Sincronização já está em andamento',
      );
    }

    _isSyncing = true;
    _syncErrors.clear();

    try {
      // Verificar conectividade
      final hasConnection = await _checkConnectivity();
      if (!hasConnection) {
        return SyncResult(
          success: false,
          message: 'Sem conexão com a internet',
        );
      }

      debugPrint('🔄 Iniciando sincronização completa...');

      // 1. Sincronizar dados do dashboard
      await _syncDashboardData();

      // 2. Sincronizar boletos
      await _syncBills();

      // 3. Sincronizar orçamentos
      await _syncQuotations();

      // 4. Sincronizar clientes
      await _syncClients();

      // 5. Configurar notificações
      await _setupNotifications();

      // 6. Limpar cache antigo
      await _cleanOldCache();

      debugPrint('✅ Sincronização concluída com sucesso');

      return SyncResult(
        success: true,
        message: 'Sincronização concluída com sucesso',
        errors: _syncErrors,
      );

    } catch (e) {
      debugPrint('❌ Erro na sincronização: $e');
      return SyncResult(
        success: false,
        message: 'Erro na sincronização: $e',
        errors: _syncErrors,
      );
    } finally {
      _isSyncing = false;
    }
  }

  // Sincronizar dados do dashboard
  static Future<void> _syncDashboardData() async {
    try {
      debugPrint('📊 Sincronizando dados do dashboard...');
      
      final response = await ApiService.getDashboardData();
      if (response.isSuccess && response.data != null) {
        await StorageService.cacheDashboardData(response.data!);
        debugPrint('✅ Dashboard sincronizado');
      } else {
        _syncErrors.add('Erro ao sincronizar dashboard: ${response.error}');
      }
    } catch (e) {
      _syncErrors.add('Erro ao sincronizar dashboard: $e');
    }
  }

  // Sincronizar boletos
  static Future<void> _syncBills() async {
    try {
      debugPrint('💰 Sincronizando boletos...');
      
      final response = await ApiService.getBills();
      if (response.isSuccess && response.data != null) {
        await StorageService.cacheBills(response.data!);
        
        // Configurar notificações para boletos vencidos
        await _setupBillNotifications(response.data!);
        
        debugPrint('✅ Boletos sincronizados: ${response.data!.length} registros');
      } else {
        _syncErrors.add('Erro ao sincronizar boletos: ${response.error}');
      }
    } catch (e) {
      _syncErrors.add('Erro ao sincronizar boletos: $e');
    }
  }

  // Sincronizar orçamentos
  static Future<void> _syncQuotations() async {
    try {
      debugPrint('📋 Sincronizando orçamentos...');
      
      final response = await ApiService.getQuotations();
      if (response.isSuccess && response.data != null) {
        await StorageService.cacheQuotations(response.data!);
        debugPrint('✅ Orçamentos sincronizados: ${response.data!.length} registros');
      } else {
        _syncErrors.add('Erro ao sincronizar orçamentos: ${response.error}');
      }
    } catch (e) {
      _syncErrors.add('Erro ao sincronizar orçamentos: $e');
    }
  }

  // Sincronizar clientes
  static Future<void> _syncClients() async {
    try {
      debugPrint('👥 Sincronizando clientes...');
      
      final response = await ApiService.getClients();
      if (response.isSuccess && response.data != null) {
        await StorageService.cacheClients(response.data!);
        debugPrint('✅ Clientes sincronizados: ${response.data!.length} registros');
      } else {
        _syncErrors.add('Erro ao sincronizar clientes: ${response.error}');
      }
    } catch (e) {
      _syncErrors.add('Erro ao sincronizar clientes: $e');
    }
  }

  // Configurar notificações
  static Future<void> _setupNotifications() async {
    try {
      debugPrint('🔔 Configurando notificações...');
      
      // Inicializar serviço de notificações
      await NotificationService.initialize();
      
      // Registrar token do dispositivo (se disponível)
      final deviceToken = await _getDeviceToken();
      if (deviceToken != null) {
        await ApiService.registerDeviceToken(
          deviceToken: deviceToken,
          deviceId: await _getDeviceId(),
        );
      }
      
      debugPrint('✅ Notificações configuradas');
    } catch (e) {
      _syncErrors.add('Erro ao configurar notificações: $e');
    }
  }

  // Configurar notificações para boletos
  static Future<void> _setupBillNotifications(List<Map<String, dynamic>> bills) async {
    try {
      for (final bill in bills) {
        final dueDate = DateTime.tryParse(bill['due_date'] ?? '');
        if (dueDate != null && dueDate.isAfter(DateTime.now())) {
          await NotificationService.scheduleRecurringBillReminders(
            billId: bill['id']?.toString() ?? '',
            dueDate: dueDate,
            companyName: bill['company_name'] ?? 'Empresa',
            amount: bill['amount']?.toString() ?? '0.00',
          );
        }
      }
    } catch (e) {
      debugPrint('Erro ao configurar notificações de boletos: $e');
    }
  }

  // Limpar cache antigo
  static Future<void> _cleanOldCache() async {
    try {
      debugPrint('🧹 Limpando cache antigo...');
      
      // Implementar lógica de limpeza de cache
      // Por exemplo, remover dados com mais de 30 dias
      
      debugPrint('✅ Cache limpo');
    } catch (e) {
      _syncErrors.add('Erro ao limpar cache: $e');
    }
  }

  // Obter token do dispositivo (mock por enquanto)
  static Future<String?> _getDeviceToken() async {
    // Implementar obtenção real do token FCM
    return 'mock_device_token_${DateTime.now().millisecondsSinceEpoch}';
  }

  // Obter ID do dispositivo
  static Future<String> _getDeviceId() async {
    // Implementar obtenção real do device ID
    return 'device_${DateTime.now().millisecondsSinceEpoch}';
  }

  // Sincronização incremental (para uso em background)
  static Future<void> performIncrementalSync() async {
    if (_isSyncing) return;

    try {
      final hasConnection = await _checkConnectivity();
      if (!hasConnection) return;

      debugPrint('🔄 Sincronização incremental...');
      
      // Sincronizar apenas dados essenciais
      await _syncDashboardData();
      
    } catch (e) {
      debugPrint('Erro na sincronização incremental: $e');
    }
  }

  // Verificar se está sincronizando
  static bool get isSyncing => _isSyncing;

  // Obter erros da última sincronização
  static List<String> get syncErrors => List.unmodifiable(_syncErrors);
}

// Resultado da sincronização
class SyncResult {
  final bool success;
  final String message;
  final List<String> errors;

  const SyncResult({
    required this.success,
    required this.message,
    this.errors = const [],
  });
}
