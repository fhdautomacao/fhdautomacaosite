import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/foundation.dart';

import '../../../../core/services/api_service.dart';

class ClientsState {
  final bool isLoading;
  final List<Map<String, dynamic>> clients;
  final String? error;
  final DateTime? lastUpdated;

  const ClientsState({
    this.isLoading = false,
    this.clients = const [],
    this.error,
    this.lastUpdated,
  });

  ClientsState copyWith({
    bool? isLoading,
    List<Map<String, dynamic>>? clients,
    String? error,
    DateTime? lastUpdated,
  }) {
    return ClientsState(
      isLoading: isLoading ?? this.isLoading,
      clients: clients ?? this.clients,
      error: error ?? this.error,
      lastUpdated: lastUpdated ?? this.lastUpdated,
    );
  }
}

class ClientsProvider extends StateNotifier<ClientsState> {
  ClientsProvider() : super(const ClientsState());

  Future<void> loadClients() async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      debugPrint('👥 Carregando clientes...');
      
      final response = await ApiService.getClients();
      
      if (response.isSuccess && response.data != null) {
        state = state.copyWith(
          clients: response.data!,
          isLoading: false,
          lastUpdated: DateTime.now(),
        );
        debugPrint('✅ Clientes carregados: ${response.data!.length} registros');
      } else {
        state = state.copyWith(
          isLoading: false,
          error: response.error ?? 'Erro ao carregar clientes',
        );
        debugPrint('❌ Erro ao carregar clientes: ${response.error}');
      }
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: 'Erro de conexão: $e',
      );
      debugPrint('❌ Exceção ao carregar clientes: $e');
    }
  }

  Future<void> refreshClients() async {
    await loadClients();
  }

  Future<void> createClient(Map<String, dynamic> clientData) async {
    try {
      debugPrint('👥 Criando novo cliente...');
      
      final response = await ApiService.createClient(clientData: clientData);
      
      if (response.isSuccess) {
        debugPrint('✅ Cliente criado com sucesso');
        // Recarregar lista de clientes
        await loadClients();
      } else {
        debugPrint('❌ Erro ao criar cliente: ${response.error}');
        state = state.copyWith(error: response.error);
      }
    } catch (e) {
      debugPrint('❌ Exceção ao criar cliente: $e');
      state = state.copyWith(error: 'Erro ao criar cliente: $e');
    }
  }

  Future<void> updateClient(String clientId, Map<String, dynamic> clientData) async {
    try {
      debugPrint('👥 Atualizando cliente: $clientId');
      
      final response = await ApiService.updateClient(clientId: clientId, clientData: clientData);
      
      if (response.isSuccess) {
        debugPrint('✅ Cliente atualizado com sucesso');
        // Recarregar lista de clientes
        await loadClients();
      } else {
        debugPrint('❌ Erro ao atualizar cliente: ${response.error}');
        state = state.copyWith(error: response.error);
      }
    } catch (e) {
      debugPrint('❌ Exceção ao atualizar cliente: $e');
      state = state.copyWith(error: 'Erro ao atualizar cliente: $e');
    }
  }

  Future<Map<String, dynamic>?> getClientById(String clientId) async {
    try {
      debugPrint('👥 Buscando cliente: $clientId');
      
      final response = await ApiService.getClientById(clientId);
      
      if (response.isSuccess && response.data != null) {
        debugPrint('✅ Cliente encontrado');
        return response.data;
      } else {
        debugPrint('❌ Erro ao buscar cliente: ${response.error}');
        return null;
      }
    } catch (e) {
      debugPrint('❌ Exceção ao buscar cliente: $e');
      return null;
    }
  }

  void clearError() {
    state = state.copyWith(error: null);
  }

  // Getters para facilitar o acesso aos dados
  List<Map<String, dynamic>> get allClients => state.clients;
  int get totalClients => state.clients.length;
}

final clientsProvider = StateNotifierProvider<ClientsProvider, ClientsState>((ref) {
  return ClientsProvider();
});
