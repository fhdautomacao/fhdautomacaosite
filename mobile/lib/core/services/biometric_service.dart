import 'dart:io';
import 'package:flutter/services.dart';
import 'package:local_auth/local_auth.dart';
import 'package:local_auth_android/local_auth_android.dart';
import 'package:local_auth_ios/local_auth_ios.dart';

class BiometricService {
  static final LocalAuthentication _localAuth = LocalAuthentication();

  // Verificar se a autenticação biométrica está disponível
  static Future<bool> isBiometricAvailable() async {
    try {
      final isAvailable = await _localAuth.canCheckBiometrics;
      final isDeviceSupported = await _localAuth.isDeviceSupported();
      
      return isAvailable && isDeviceSupported;
    } on PlatformException catch (e) {
      print('Erro ao verificar disponibilidade biométrica: $e');
      return false;
    }
  }

  // Obter tipos de autenticação disponíveis
  static Future<List<BiometricType>> getAvailableBiometrics() async {
    try {
      return await _localAuth.getAvailableBiometrics();
    } on PlatformException catch (e) {
      print('Erro ao obter biometrias disponíveis: $e');
      return [];
    }
  }

  // Autenticar com biometria
  static Future<bool> authenticate({
    String reason = 'Autentique-se para acessar o Gestão FHD',
    String cancelButton = 'Cancelar',
    String confirmButton = 'Confirmar',
  }) async {
    try {
      return await _localAuth.authenticate(
        localizedReason: reason,
        options: const AuthenticationOptions(
          biometricOnly: true,
          stickyAuth: true,
        ),
      );
    } on PlatformException catch (e) {
      print('Erro na autenticação biométrica: $e');
      return false;
    }
  }

  // Verificar se o dispositivo tem biometria configurada
  static Future<bool> hasBiometricEnrolled() async {
    try {
      final biometrics = await getAvailableBiometrics();
      return biometrics.isNotEmpty;
    } on PlatformException catch (e) {
      print('Erro ao verificar biometria configurada: $e');
      return false;
    }
  }

  // Configurar autenticação biométrica
  static Future<void> configureBiometricAuth() async {
    if (Platform.isAndroid) {
      await _localAuth.authenticate(
        localizedReason: 'Configure a autenticação biométrica',
        options: const AuthenticationOptions(
          biometricOnly: true,
          stickyAuth: true,
        ),
      );
    }
  }

  // Obter string descritiva do tipo de biometria
  static String getBiometricTypeString(BiometricType type) {
    switch (type) {
      case BiometricType.face:
        return 'Reconhecimento Facial';
      case BiometricType.fingerprint:
        return 'Impressão Digital';
      case BiometricType.iris:
        return 'Reconhecimento de Íris';
      default:
        return 'Biometria';
    }
  }

  // Verificar se deve usar autenticação biométrica
  static Future<bool> shouldUseBiometric() async {
    final isAvailable = await isBiometricAvailable();
    final hasEnrolled = await hasBiometricEnrolled();
    
    return isAvailable && hasEnrolled;
  }
}
