import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/foundation.dart';

import '../../../../core/services/api_service.dart';

class DashboardState {
  final bool isLoading;
  final Map<String, dynamic>? data;
  final String? error;
  final DateTime? lastUpdated;

  const DashboardState({
    this.isLoading = false,
    this.data,
    this.error,
    this.lastUpdated,
  });

  DashboardState copyWith({
    bool? isLoading,
    Map<String, dynamic>? data,
    String? error,
    DateTime? lastUpdated,
  }) {
    return DashboardState(
      isLoading: isLoading ?? this.isLoading,
      data: data ?? this.data,
      error: error ?? this.error,
      lastUpdated: lastUpdated ?? this.lastUpdated,
    );
  }
}

class DashboardProvider extends StateNotifier<DashboardState> {
  DashboardProvider() : super(const DashboardState());

  Future<void> loadDashboardData() async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      debugPrint('📊 Carregando dados do dashboard...');
      
      final response = await ApiService.getDashboardData();
      
      if (response.isSuccess && response.data != null) {
        state = state.copyWith(
          data: response.data,
          isLoading: false,
          lastUpdated: DateTime.now(),
        );
        debugPrint('✅ Dashboard carregado com sucesso');
      } else {
        state = state.copyWith(
          isLoading: false,
          error: response.error ?? 'Erro ao carregar dados do dashboard',
        );
        debugPrint('❌ Erro ao carregar dashboard: ${response.error}');
      }
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: 'Erro de conexão: $e',
      );
      debugPrint('❌ Exceção ao carregar dashboard: $e');
    }
  }

  Future<void> refreshDashboard() async {
    await loadDashboardData();
  }

  void clearError() {
    state = state.copyWith(error: null);
  }

  // Getters para facilitar o acesso aos dados
  Map<String, dynamic>? get summary => state.data?['summary'];
  List<Map<String, dynamic>>? get recentBills => state.data?['recent']?['bills'];
  List<Map<String, dynamic>>? get recentQuotations => state.data?['recent']?['quotations'];
  List<Map<String, dynamic>>? get recentClients => state.data?['recent']?['clients'];
  Map<String, dynamic>? get charts => state.data?['charts'];

  // Métricas específicas
  int get totalBills => summary?['totalBills'] ?? 0;
  int get totalQuotations => summary?['totalQuotations'] ?? 0;
  int get totalClients => summary?['totalClients'] ?? 0;
  int get totalOverdue => summary?['totalOverdue'] ?? 0;
  String get totalAmount => summary?['totalAmount'] ?? '0.00';
  String get pendingAmount => summary?['pendingAmount'] ?? '0.00';

  // Getters para boletos filtrados
  List<Map<String, dynamic>>? get overdueBills => recentBills?.where((bill) => bill['status'] == 'overdue').toList();
  List<Map<String, dynamic>>? get pendingBills => recentBills?.where((bill) => bill['status'] == 'pending').toList();
  int get pendingCount => pendingBills?.length ?? 0;
}

final dashboardProvider = StateNotifierProvider<DashboardProvider, DashboardState>((ref) {
  return DashboardProvider();
});
