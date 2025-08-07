import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:path/path.dart' as path;

import 'upload_service.dart';
import 'storage_service.dart';

class DeepLinkService {
  static const MethodChannel _channel = MethodChannel('deep_link_channel');
  static const EventChannel _eventChannel = EventChannel('deep_link_events');

  // Callback para quando um PDF é recebido
  static Function(File)? onPdfReceived;
  static Function(String)? onDeepLinkReceived;

  // Inicializar serviço de Deep Links
  static Future<void> initialize() async {
    try {
      // Configurar listener para Deep Links
      _eventChannel.receiveBroadcastStream().listen((dynamic event) {
        _handleDeepLink(event);
      });

      // Configurar listener para arquivos recebidos
      _channel.setMethodCallHandler((call) async {
        switch (call.method) {
          case 'onPdfReceived':
            final String? filePath = call.arguments['filePath'];
            if (filePath != null) {
              final file = File(filePath);
              if (await file.exists()) {
                _handlePdfReceived(file);
              }
            }
            break;
          case 'onDeepLinkReceived':
            final String? link = call.arguments['link'];
            if (link != null) {
              _handleDeepLink(link);
            }
            break;
        }
      });

      debugPrint('🔗 Deep Link Service inicializado');
    } catch (e) {
      debugPrint('❌ Erro ao inicializar Deep Link Service: $e');
    }
  }

  // Processar Deep Link recebido
  static void _handleDeepLink(dynamic link) {
    try {
      final String linkString = link.toString();
      debugPrint('🔗 Deep Link recebido: $linkString');

      if (linkString.startsWith('gestaofhd://upload-receipt')) {
        onDeepLinkReceived?.call(linkString);
        _processUploadReceiptLink(linkString);
      }
    } catch (e) {
      debugPrint('❌ Erro ao processar Deep Link: $e');
    }
  }

  // Processar link de upload de comprovante
  static void _processUploadReceiptLink(String link) {
    try {
      final uri = Uri.parse(link);
      final queryParams = uri.queryParameters;

      // Verificar se há parâmetros específicos
      if (queryParams.containsKey('billId') && queryParams.containsKey('installmentNumber')) {
        final billId = queryParams['billId']!;
        final installmentNumber = int.parse(queryParams['installmentNumber']!);
        
        debugPrint('📋 Parâmetros recebidos: billId=$billId, installmentNumber=$installmentNumber');
        
        // Navegar para a tela de upload específica
        _navigateToUploadScreen(billId, installmentNumber);
      } else {
        // Navegar para lista de boletos pendentes
        _navigateToBillsList();
      }
    } catch (e) {
      debugPrint('❌ Erro ao processar link de upload: $e');
      _navigateToBillsList();
    }
  }

  // Processar PDF recebido
  static void _handlePdfReceived(File pdfFile) {
    try {
      debugPrint('📄 PDF recebido: ${pdfFile.path}');
      
      // Validar se é um PDF
      final extension = path.extension(pdfFile.path).toLowerCase();
      if (extension != '.pdf') {
        debugPrint('❌ Arquivo não é um PDF: $extension');
        return;
      }

      // Validar tamanho
      final size = pdfFile.lengthSync();
      if (size > UploadService._maxFileSize) {
        debugPrint('❌ Arquivo muito grande: ${size} bytes');
        return;
      }

      // Chamar callback
      onPdfReceived?.call(pdfFile);
      
      // Navegar para tela de seleção de boleto
      _navigateToBillsList();
      
    } catch (e) {
      debugPrint('❌ Erro ao processar PDF recebido: $e');
    }
  }

  // Navegar para lista de boletos
  static void _navigateToBillsList() {
    // Implementar navegação para lista de boletos
    // Isso será feito através de um callback ou provider
    debugPrint('📋 Navegando para lista de boletos');
  }

  // Navegar para tela de upload específica
  static void _navigateToUploadScreen(String billId, int installmentNumber) {
    // Implementar navegação para tela de upload específica
    debugPrint('📤 Navegando para upload: billId=$billId, installmentNumber=$installmentNumber');
  }

  // Verificar se o app pode receber PDFs
  static Future<bool> canReceivePdfs() async {
    try {
      final result = await _channel.invokeMethod('canReceivePdfs');
      return result ?? false;
    } catch (e) {
      debugPrint('❌ Erro ao verificar capacidade de receber PDFs: $e');
      return false;
    }
  }

  // Obter último PDF recebido
  static Future<File?> getLastReceivedPdf() async {
    try {
      final result = await _channel.invokeMethod('getLastReceivedPdf');
      if (result != null) {
        final file = File(result);
        if (await file.exists()) {
          return file;
        }
      }
      return null;
    } catch (e) {
      debugPrint('❌ Erro ao obter último PDF: $e');
      return null;
    }
  }

  // Limpar PDFs temporários
  static Future<void> clearTempPdfs() async {
    try {
      await _channel.invokeMethod('clearTempPdfs');
      debugPrint('🗑️ PDFs temporários limpos');
    } catch (e) {
      debugPrint('❌ Erro ao limpar PDFs temporários: $e');
    }
  }

  // Verificar se o app foi aberto via Deep Link
  static Future<bool> wasOpenedViaDeepLink() async {
    try {
      final result = await _channel.invokeMethod('wasOpenedViaDeepLink');
      return result ?? false;
    } catch (e) {
      debugPrint('❌ Erro ao verificar se foi aberto via Deep Link: $e');
      return false;
    }
  }

  // Obter informações do Deep Link
  static Future<Map<String, dynamic>?> getDeepLinkInfo() async {
    try {
      final result = await _channel.invokeMethod('getDeepLinkInfo');
      return result != null ? Map<String, dynamic>.from(result) : null;
    } catch (e) {
      debugPrint('❌ Erro ao obter informações do Deep Link: $e');
      return null;
    }
  }
}

// Classe para gerenciar navegação de Deep Links
class DeepLinkNavigator {
  static Function(String, int)? onNavigateToUpload;
  static Function()? onNavigateToBillsList;
  static Function(File)? onPdfReceived;

  // Configurar callbacks
  static void configure({
    Function(String, int)? onNavigateToUpload,
    Function()? onNavigateToBillsList,
    Function(File)? onPdfReceived,
  }) {
    DeepLinkNavigator.onNavigateToUpload = onNavigateToUpload;
    DeepLinkNavigator.onNavigateToBillsList = onNavigateToBillsList;
    DeepLinkNavigator.onPdfReceived = onPdfReceived;
  }

  // Navegar para upload específico
  static void navigateToUpload(String billId, int installmentNumber) {
    onNavigateToUpload?.call(billId, installmentNumber);
  }

  // Navegar para lista de boletos
  static void navigateToBillsList() {
    onNavigateToBillsList?.call();
  }

  // Processar PDF recebido
  static void processPdfReceived(File pdfFile) {
    onPdfReceived?.call(pdfFile);
  }
}
