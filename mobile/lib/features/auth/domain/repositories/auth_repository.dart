import '../entities/user_entity.dart';

abstract class AuthRepository {
  Future<User?> getCurrentUser();
  Future<bool> isLoggedIn();
  Future<void> saveUser(User user);
  Future<void> clearUser();
}