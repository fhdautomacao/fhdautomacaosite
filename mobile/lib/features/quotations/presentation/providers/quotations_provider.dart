import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/foundation.dart';

import '../../../../core/services/api_service.dart';

class QuotationsState {
  final bool isLoading;
  final List<Map<String, dynamic>> quotations;
  final String? error;
  final String currentStatus;
  final DateTime? lastUpdated;

  const QuotationsState({
    this.isLoading = false,
    this.quotations = const [],
    this.error,
    this.currentStatus = 'all',
    this.lastUpdated,
  });

  QuotationsState copyWith({
    bool? isLoading,
    List<Map<String, dynamic>>? quotations,
    String? error,
    String? currentStatus,
    DateTime? lastUpdated,
  }) {
    return QuotationsState(
      isLoading: isLoading ?? this.isLoading,
      quotations: quotations ?? this.quotations,
      error: error ?? this.error,
      currentStatus: currentStatus ?? this.currentStatus,
      lastUpdated: lastUpdated ?? this.lastUpdated,
    );
  }
}

class QuotationsProvider extends StateNotifier<QuotationsState> {
  QuotationsProvider() : super(const QuotationsState());

  Future<void> loadQuotations({String? status}) async {
    final targetStatus = status ?? state.currentStatus;
    
    state = state.copyWith(isLoading: true, error: null, currentStatus: targetStatus);

    try {
      debugPrint('📋 Carregando orçamentos com status: $targetStatus');
      
      final response = await ApiService.getQuotations(status: targetStatus);
      
      if (response.isSuccess && response.data != null) {
        state = state.copyWith(
          quotations: response.data!,
          isLoading: false,
          lastUpdated: DateTime.now(),
        );
        debugPrint('✅ Orçamentos carregados: ${response.data!.length} registros');
      } else {
        state = state.copyWith(
          isLoading: false,
          error: response.error ?? 'Erro ao carregar orçamentos',
        );
        debugPrint('❌ Erro ao carregar orçamentos: ${response.error}');
      }
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: 'Erro de conexão: $e',
      );
      debugPrint('❌ Exceção ao carregar orçamentos: $e');
    }
  }

  Future<void> refreshQuotations() async {
    await loadQuotations();
  }

  Future<void> createQuotation(Map<String, dynamic> quotationData) async {
    try {
      debugPrint('📋 Criando novo orçamento...');
      
      final response = await ApiService.createQuotation(quotationData: quotationData);
      
      if (response.isSuccess) {
        debugPrint('✅ Orçamento criado com sucesso');
        // Recarregar lista de orçamentos
        await loadQuotations();
      } else {
        debugPrint('❌ Erro ao criar orçamento: ${response.error}');
        state = state.copyWith(error: response.error);
      }
    } catch (e) {
      debugPrint('❌ Exceção ao criar orçamento: $e');
      state = state.copyWith(error: 'Erro ao criar orçamento: $e');
    }
  }

  Future<void> updateQuotation(String quotationId, Map<String, dynamic> quotationData) async {
    try {
      debugPrint('📋 Atualizando orçamento: $quotationId');
      
      final response = await ApiService.updateQuotation(quotationId: quotationId, quotationData: quotationData);
      
      if (response.isSuccess) {
        debugPrint('✅ Orçamento atualizado com sucesso');
        // Recarregar lista de orçamentos
        await loadQuotations();
      } else {
        debugPrint('❌ Erro ao atualizar orçamento: ${response.error}');
        state = state.copyWith(error: response.error);
      }
    } catch (e) {
      debugPrint('❌ Exceção ao atualizar orçamento: $e');
      state = state.copyWith(error: 'Erro ao atualizar orçamento: $e');
    }
  }

  Future<void> deleteQuotation(String quotationId) async {
    try {
      debugPrint('📋 Excluindo orçamento: $quotationId');
      
      final response = await ApiService.deleteQuotation(quotationId);
      
      if (response.isSuccess) {
        debugPrint('✅ Orçamento excluído com sucesso');
        // Recarregar lista de orçamentos
        await loadQuotations();
      } else {
        debugPrint('❌ Erro ao excluir orçamento: ${response.error}');
        state = state.copyWith(error: response.error);
      }
    } catch (e) {
      debugPrint('❌ Exceção ao excluir orçamento: $e');
      state = state.copyWith(error: 'Erro ao excluir orçamento: $e');
    }
  }

  void clearError() {
    state = state.copyWith(error: null);
  }

  // Getters para facilitar o acesso aos dados
  List<Map<String, dynamic>> get allQuotations => state.quotations;
  List<Map<String, dynamic>> get pendingQuotations => state.quotations.where((quotation) => quotation['status'] == 'pending').toList();
  List<Map<String, dynamic>> get approvedQuotations => state.quotations.where((quotation) => quotation['status'] == 'approved').toList();
  List<Map<String, dynamic>> get rejectedQuotations => state.quotations.where((quotation) => quotation['status'] == 'rejected').toList();

  // Contadores
  int get totalQuotations => state.quotations.length;
  int get pendingCount => pendingQuotations.length;
  int get approvedCount => approvedQuotations.length;
  int get rejectedCount => rejectedQuotations.length;
}

final quotationsProvider = StateNotifierProvider<QuotationsProvider, QuotationsState>((ref) {
  return QuotationsProvider();
});
