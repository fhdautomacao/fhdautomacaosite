import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/foundation.dart';

import '../../../../core/services/api_service.dart';

class BillsState {
  final bool isLoading;
  final List<Map<String, dynamic>> bills;
  final String? error;
  final String currentStatus;
  final DateTime? lastUpdated;

  const BillsState({
    this.isLoading = false,
    this.bills = const [],
    this.error,
    this.currentStatus = 'all',
    this.lastUpdated,
  });

  BillsState copyWith({
    bool? isLoading,
    List<Map<String, dynamic>>? bills,
    String? error,
    String? currentStatus,
    DateTime? lastUpdated,
  }) {
    return BillsState(
      isLoading: isLoading ?? this.isLoading,
      bills: bills ?? this.bills,
      error: error ?? this.error,
      currentStatus: currentStatus ?? this.currentStatus,
      lastUpdated: lastUpdated ?? this.lastUpdated,
    );
  }
}

class BillsProvider extends StateNotifier<BillsState> {
  BillsProvider() : super(const BillsState());

  Future<void> loadBills({String? status}) async {
    final targetStatus = status ?? state.currentStatus;
    
    state = state.copyWith(isLoading: true, error: null, currentStatus: targetStatus);

    try {
      debugPrint('💰 Carregando boletos com status: $targetStatus');
      
      final response = await ApiService.getBills(status: targetStatus);
      
      if (response.isSuccess && response.data != null) {
        state = state.copyWith(
          bills: response.data!,
          isLoading: false,
          lastUpdated: DateTime.now(),
        );
        debugPrint('✅ Boletos carregados: ${response.data!.length} registros');
      } else {
        state = state.copyWith(
          isLoading: false,
          error: response.error ?? 'Erro ao carregar boletos',
        );
        debugPrint('❌ Erro ao carregar boletos: ${response.error}');
      }
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: 'Erro de conexão: $e',
      );
      debugPrint('❌ Exceção ao carregar boletos: $e');
    }
  }

  Future<void> refreshBills() async {
    await loadBills();
  }

  Future<void> createBill(Map<String, dynamic> billData) async {
    try {
      debugPrint('💰 Criando novo boleto...');
      
      final response = await ApiService.createBill(billData: billData);
      
      if (response.isSuccess) {
        debugPrint('✅ Boleto criado com sucesso');
        // Recarregar lista de boletos
        await loadBills();
      } else {
        debugPrint('❌ Erro ao criar boleto: ${response.error}');
        state = state.copyWith(error: response.error);
      }
    } catch (e) {
      debugPrint('❌ Exceção ao criar boleto: $e');
      state = state.copyWith(error: 'Erro ao criar boleto: $e');
    }
  }

  Future<void> updateBill(String billId, Map<String, dynamic> billData) async {
    try {
      debugPrint('💰 Atualizando boleto: $billId');
      
      final response = await ApiService.updateBill(billId: billId, billData: billData);
      
      if (response.isSuccess) {
        debugPrint('✅ Boleto atualizado com sucesso');
        // Recarregar lista de boletos
        await loadBills();
      } else {
        debugPrint('❌ Erro ao atualizar boleto: ${response.error}');
        state = state.copyWith(error: response.error);
      }
    } catch (e) {
      debugPrint('❌ Exceção ao atualizar boleto: $e');
      state = state.copyWith(error: 'Erro ao atualizar boleto: $e');
    }
  }

  Future<void> deleteBill(String billId) async {
    try {
      debugPrint('💰 Excluindo boleto: $billId');
      
      final response = await ApiService.deleteBill(billId);
      
      if (response.isSuccess) {
        debugPrint('✅ Boleto excluído com sucesso');
        // Recarregar lista de boletos
        await loadBills();
      } else {
        debugPrint('❌ Erro ao excluir boleto: ${response.error}');
        state = state.copyWith(error: response.error);
      }
    } catch (e) {
      debugPrint('❌ Exceção ao excluir boleto: $e');
      state = state.copyWith(error: 'Erro ao excluir boleto: $e');
    }
  }

  void clearError() {
    state = state.copyWith(error: null);
  }

  // Getters para facilitar o acesso aos dados
  List<Map<String, dynamic>> get allBills => state.bills;
  List<Map<String, dynamic>> get pendingBills => state.bills.where((bill) => bill['status'] == 'pending').toList();
  List<Map<String, dynamic>> get paidBills => state.bills.where((bill) => bill['status'] == 'paid').toList();
  List<Map<String, dynamic>> get overdueBills => state.bills.where((bill) => bill['status'] == 'overdue').toList();

  // Contadores
  int get totalBills => state.bills.length;
  int get pendingCount => pendingBills.length;
  int get paidCount => paidBills.length;
  int get overdueCount => overdueBills.length;
}

final billsProvider = StateNotifierProvider<BillsProvider, BillsState>((ref) {
  return BillsProvider();
});
