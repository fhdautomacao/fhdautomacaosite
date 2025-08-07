import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/foundation.dart';
import 'package:file_picker/file_picker.dart';
import 'package:path/path.dart' as path;

import 'api_service.dart';
import 'storage_service.dart';

class UploadService {
  static const int _maxFileSize = 10 * 1024 * 1024; // 10MB
  static const List<String> _allowedExtensions = ['pdf'];
  static const String _bucketName = 'arquivos';
  static const String _folderName = 'payment-receipts';

  // Selecionar arquivo PDF
  static Future<FilePickerResult?> pickPdfFile() async {
    try {
      final result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: _allowedExtensions,
        allowMultiple: false,
      );

      if (result != null && result.files.isNotEmpty) {
        final file = result.files.first;
        
        // Validar tamanho
        if (file.size > _maxFileSize) {
          throw Exception('Arquivo muito grande. Máximo: ${_maxFileSize / (1024 * 1024)}MB');
        }

        // Validar extensão
        final extension = path.extension(file.name).toLowerCase();
        if (!_allowedExtensions.contains(extension.replaceAll('.', ''))) {
          throw Exception('Apenas arquivos PDF são permitidos');
        }

        return result;
      }

      return null;
    } catch (e) {
      debugPrint('Erro ao selecionar arquivo: $e');
      rethrow;
    }
  }

  // Upload de comprovante de pagamento
  static Future<UploadResult> uploadPaymentReceipt({
    required String billId,
    required int installmentNumber,
    required File file,
  }) async {
    try {
      debugPrint('📤 Iniciando upload de comprovante...');

      // Validar arquivo
      final validation = _validateFile(file);
      if (!validation.isValid) {
        return UploadResult.error(validation.error!);
      }

      // Criar FormData
      final formData = {
        'billId': billId,
        'installmentNumber': installmentNumber.toString(),
        'file': file,
      };

      // Fazer upload via API
      final response = await ApiService.uploadPaymentReceipt(formData);

      if (response.isSuccess) {
        debugPrint('✅ Upload concluído com sucesso');
        return UploadResult.success(
          url: response.data!['url'],
          filename: response.data!['filename'],
        );
      } else {
        debugPrint('❌ Erro no upload: ${response.error}');
        return UploadResult.error(response.error!);
      }

    } catch (e) {
      debugPrint('❌ Erro no upload: $e');
      return UploadResult.error('Erro ao fazer upload: $e');
    }
  }

  // Validar arquivo
  static FileValidation _validateFile(File file) {
    try {
      // Verificar se arquivo existe
      if (!file.existsSync()) {
        return FileValidation.error('Arquivo não encontrado');
      }

      // Verificar tamanho
      final size = file.lengthSync();
      if (size > _maxFileSize) {
        return FileValidation.error(
          'Arquivo muito grande. Máximo: ${_maxFileSize / (1024 * 1024)}MB'
        );
      }

      // Verificar extensão
      final extension = path.extension(file.path).toLowerCase();
      if (!_allowedExtensions.contains(extension.replaceAll('.', ''))) {
        return FileValidation.error('Apenas arquivos PDF são permitidos');
      }

      return FileValidation.success();
    } catch (e) {
      return FileValidation.error('Erro ao validar arquivo: $e');
    }
  }

  // Baixar comprovante
  static Future<DownloadResult> downloadPaymentReceipt({
    required String url,
    required String filename,
  }) async {
    try {
      debugPrint('📥 Iniciando download de comprovante...');

      final response = await ApiService.downloadFile(url);
      
      if (response.isSuccess) {
        // Salvar arquivo localmente
        final localPath = await _saveFileLocally(
          response.data!,
          filename,
        );

        debugPrint('✅ Download concluído: $localPath');
        return DownloadResult.success(localPath);
      } else {
        debugPrint('❌ Erro no download: ${response.error}');
        return DownloadResult.error(response.error!);
      }

    } catch (e) {
      debugPrint('❌ Erro no download: $e');
      return DownloadResult.error('Erro ao baixar arquivo: $e');
    }
  }

  // Salvar arquivo localmente
  static Future<String> _saveFileLocally(
    Uint8List bytes,
    String filename,
  ) async {
    try {
      final directory = await _getDocumentsDirectory();
      final filePath = path.join(directory.path, filename);
      
      final file = File(filePath);
      await file.writeAsBytes(bytes);
      
      return filePath;
    } catch (e) {
      throw Exception('Erro ao salvar arquivo: $e');
    }
  }

  // Obter diretório de documentos
  static Future<Directory> _getDocumentsDirectory() async {
    // Implementar obtenção do diretório de documentos
    // Depende da plataforma (Android/iOS)
    return Directory('/storage/emulated/0/Download');
  }

  // Deletar comprovante
  static Future<DeleteResult> deletePaymentReceipt({
    required String billId,
    required String installmentId,
  }) async {
    try {
      debugPrint('🗑️ Deletando comprovante...');

      final response = await ApiService.deletePaymentReceipt(
        billId: billId,
        installmentId: installmentId,
      );

      if (response.isSuccess) {
        debugPrint('✅ Comprovante deletado com sucesso');
        return DeleteResult.success();
      } else {
        debugPrint('❌ Erro ao deletar: ${response.error}');
        return DeleteResult.error(response.error!);
      }

    } catch (e) {
      debugPrint('❌ Erro ao deletar comprovante: $e');
      return DeleteResult.error('Erro ao deletar comprovante: $e');
    }
  }

  // Verificar se arquivo existe localmente
  static Future<bool> fileExistsLocally(String filename) async {
    try {
      final directory = await _getDocumentsDirectory();
      final filePath = path.join(directory.path, filename);
      return File(filePath).existsSync();
    } catch (e) {
      return false;
    }
  }

  // Obter tamanho do arquivo
  static String formatFileSize(int bytes) {
    if (bytes < 1024) return '$bytes B';
    if (bytes < 1024 * 1024) return '${(bytes / 1024).toStringAsFixed(1)} KB';
    return '${(bytes / (1024 * 1024)).toStringAsFixed(1)} MB';
  }

  // Gerar nome único para o arquivo
  static String generateFileName(String originalName, String billId, int installmentNumber) {
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    final extension = path.extension(originalName);
    return 'bill_${billId}_installment_${installmentNumber}_$timestamp$extension';
  }

  // Obter caminho completo do arquivo no bucket
  static String getFilePath(String billId, String fileName) {
    return '$_folderName/$billId/$fileName';
  }
}

// Resultado do upload
class UploadResult {
  final bool success;
  final String? url;
  final String? filename;
  final String? error;

  UploadResult._({
    required this.success,
    this.url,
    this.filename,
    this.error,
  });

  factory UploadResult.success({
    required String url,
    required String filename,
  }) {
    return UploadResult._(
      success: true,
      url: url,
      filename: filename,
    );
  }

  factory UploadResult.error(String error) {
    return UploadResult._(
      success: false,
      error: error,
    );
  }
}

// Resultado do download
class DownloadResult {
  final bool success;
  final String? localPath;
  final String? error;

  DownloadResult._({
    required this.success,
    this.localPath,
    this.error,
  });

  factory DownloadResult.success(String localPath) {
    return DownloadResult._(
      success: true,
      localPath: localPath,
    );
  }

  factory DownloadResult.error(String error) {
    return DownloadResult._(
      success: false,
      error: error,
    );
  }
}

// Resultado da exclusão
class DeleteResult {
  final bool success;
  final String? error;

  DeleteResult._({
    required this.success,
    this.error,
  });

  factory DeleteResult.success() {
    return DeleteResult._(success: true);
  }

  factory DeleteResult.error(String error) {
    return DeleteResult._(
      success: false,
      error: error,
    );
  }
}

// Validação de arquivo
class FileValidation {
  final bool isValid;
  final String? error;

  FileValidation._({
    required this.isValid,
    this.error,
  });

  factory FileValidation.success() {
    return FileValidation._(isValid: true);
  }

  factory FileValidation.error(String error) {
    return FileValidation._(
      isValid: false,
      error: error,
    );
  }
}
