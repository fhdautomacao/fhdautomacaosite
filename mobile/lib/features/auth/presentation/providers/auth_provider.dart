import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../domain/entities/user_entity.dart';
import '../../domain/repositories/auth_repository.dart';
import '../../../../core/services/storage_service.dart';
import '../../../../core/services/api_service.dart';

// Auth state
class AuthState {
  final User? user;
  final bool isLoading;
  final String? error;
  final bool isLoggedIn;

  const AuthState({
    this.user,
    this.isLoading = false,
    this.error,
    this.isLoggedIn = false,
  });

  AuthState copyWith({
    User? user,
    bool? isLoading,
    String? error,
    bool? isLoggedIn,
  }) {
    return AuthState(
      user: user ?? this.user,
      isLoading: isLoading ?? this.isLoading,
      error: error,
      isLoggedIn: isLoggedIn ?? this.isLoggedIn,
    );
  }
}

// Auth repository provider
final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepositoryImpl();
});

// Auth provider
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final authRepository = ref.read(authRepositoryProvider);
  return AuthNotifier(authRepository);
});

class AuthNotifier extends StateNotifier<AuthState> {
  final AuthRepository _authRepository;

  AuthNotifier(this._authRepository) : super(const AuthState()) {
    _checkAuthStatus();
  }

  void _checkAuthStatus() {
    final isLoggedIn = StorageService.isLoggedIn();
    final userEmail = StorageService.getUserEmail();
    final authToken = StorageService.getAuthToken();

    if (isLoggedIn && userEmail != null && authToken != null) {
      final user = User(
        id: 'current_user',
        email: userEmail,
        name: _getNameFromEmail(userEmail),
        role: _getRoleFromEmail(userEmail),
      );

      state = state.copyWith(
        user: user,
        isLoggedIn: true,
      );
    }
  }

  Future<bool> login(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      final response = await ApiService.login(email: email, password: password);

      if (response.isSuccess && response.data != null) {
        final userData = response.data!;
        
        // Salvar dados de autenticação
        await StorageService.saveAuthToken(userData['token'] ?? 'mock_token');
        await StorageService.saveUserEmail(email);
        await StorageService.setLoggedIn(true);

        // Criar usuário
        final user = User(
          id: userData['id'] ?? 'current_user',
          email: email,
          name: userData['name'] ?? _getNameFromEmail(email),
          role: userData['role'] ?? _getRoleFromEmail(email),
        );

        state = state.copyWith(
          user: user,
          isLoading: false,
          isLoggedIn: true,
        );

        return true;
      } else {
        state = state.copyWith(
          isLoading: false,
          error: response.error ?? 'Erro ao fazer login',
        );
        return false;
      }
    } catch (e) {
      // Fallback para credenciais conhecidas (desenvolvimento)
      if (_isValidCredentials(email, password)) {
        await StorageService.saveAuthToken('mock_token_${DateTime.now().millisecondsSinceEpoch}');
        await StorageService.saveUserEmail(email);
        await StorageService.setLoggedIn(true);

        final user = User(
          id: 'mock_user',
          email: email,
          name: _getNameFromEmail(email),
          role: _getRoleFromEmail(email),
        );

        state = state.copyWith(
          user: user,
          isLoading: false,
          isLoggedIn: true,
        );

        return true;
      }

      state = state.copyWith(
        isLoading: false,
        error: 'Credenciais inválidas',
      );
      return false;
    }
  }

  Future<void> logout() async {
    state = state.copyWith(isLoading: true);

    try {
      await ApiService.logout();
    } catch (e) {
      // Ignorar erros de logout da API
    }

    // Limpar dados locais
    await StorageService.clearAuth();
    await StorageService.clearCache();

    state = const AuthState();
  }

  void clearError() {
    state = state.copyWith(error: null);
  }

  // Métodos auxiliares
  bool _isValidCredentials(String email, String password) {
    const validCredentials = {
      'adminfhd@fhd.com': 'admin123',
      'fhduser@fhd.com': 'user123',
      'admin@fhd.com': 'admin',
      'user@fhd.com': 'user',
    };

    return validCredentials[email] == password;
  }

  String _getNameFromEmail(String email) {
    if (email.contains('admin')) {
      return 'Administrador FHD';
    } else if (email.contains('user')) {
      return 'Usuário FHD';
    }
    return 'Usuário';
  }

  UserRole _getRoleFromEmail(String email) {
    if (email.contains('admin')) {
      return UserRole.admin;
    }
    return UserRole.user;
  }
}

// Auth repository implementation
class AuthRepositoryImpl implements AuthRepository {
  @override
  Future<User?> getCurrentUser() async {
    final isLoggedIn = StorageService.isLoggedIn();
    final userEmail = StorageService.getUserEmail();

    if (isLoggedIn && userEmail != null) {
      return User(
        id: 'current_user',
        email: userEmail,
        name: _getNameFromEmail(userEmail),
        role: _getRoleFromEmail(userEmail),
      );
    }

    return null;
  }

  @override
  Future<bool> isLoggedIn() async {
    return StorageService.isLoggedIn();
  }

  @override
  Future<void> saveUser(User user) async {
    await StorageService.saveUserEmail(user.email);
    await StorageService.setLoggedIn(true);
  }

  @override
  Future<void> clearUser() async {
    await StorageService.clearAuth();
  }

  String _getNameFromEmail(String email) {
    if (email.contains('admin')) {
      return 'Administrador FHD';
    } else if (email.contains('user')) {
      return 'Usuário FHD';
    }
    return 'Usuário';
  }

  UserRole _getRoleFromEmail(String email) {
    if (email.contains('admin')) {
      return UserRole.admin;
    }
    return UserRole.user;
  }
}