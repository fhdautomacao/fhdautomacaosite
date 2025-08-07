import 'dart:convert';
import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';

import 'storage_service.dart';

class ApiService {
  static late Dio _dio;
  static const int _connectTimeout = 15000;
  static const int _receiveTimeout = 15000;

  static void initialize() {
    _dio = Dio(BaseOptions(
      baseUrl: StorageService.getServerUrl(),
      connectTimeout: const Duration(milliseconds: _connectTimeout),
      receiveTimeout: const Duration(milliseconds: _receiveTimeout),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));

    // Adicionar interceptors
    _dio.interceptors.add(_AuthInterceptor());
    _dio.interceptors.add(_LoggingInterceptor());
    _dio.interceptors.add(_ErrorInterceptor());
  }

  // Auth endpoints
  static Future<ApiResponse<Map<String, dynamic>>> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _dio.post('/api/auth/login', data: {
        'email': email,
        'password': password,
      });

      return ApiResponse.success(response.data);
    } catch (e) {
      return ApiResponse.error(_handleError(e));
    }
  }

  static Future<ApiResponse<void>> logout() async {
    try {
      await _dio.post('/api/auth/logout');
      return ApiResponse.success(null);
    } catch (e) {
      return ApiResponse.error(_handleError(e));
    }
  }

  // Bills endpoints
  static Future<ApiResponse<List<Map<String, dynamic>>>> getBills({
    String? status,
    int page = 1,
    int limit = 50,
  }) async {
    try {
      final response = await _dio.get('/api/bills', queryParameters: {
        if (status != null) 'status': status,
        'page': page,
        'limit': limit,
      });

      final bills = List<Map<String, dynamic>>.from(response.data['data'] ?? []);
      await StorageService.cacheBills(bills);
      
      return ApiResponse.success(bills);
    } catch (e) {
      // Tentar usar cache em caso de erro
      final cachedBills = StorageService.getCachedBills();
      if (cachedBills != null) {
        return ApiResponse.success(cachedBills);
      }
      return ApiResponse.error(_handleError(e));
    }
  }

  static Future<ApiResponse<Map<String, dynamic>>> getBillById(String billId) async {
    try {
      final response = await _dio.get('/api/bills/$billId');
      return ApiResponse.success(response.data);
    } catch (e) {
      return ApiResponse.error(_handleError(e));
    }
  }

  static Future<ApiResponse<Map<String, dynamic>>> createBill({
    required Map<String, dynamic> billData,
  }) async {
    try {
      final response = await _dio.post('/api/bills', data: billData);
      return ApiResponse.success(response.data);
    } catch (e) {
      return ApiResponse.error(_handleError(e));
    }
  }

  static Future<ApiResponse<Map<String, dynamic>>> updateBill({
    required String billId,
    required Map<String, dynamic> billData,
  }) async {
    try {
      final response = await _dio.put('/api/bills/$billId', data: billData);
      return ApiResponse.success(response.data);
    } catch (e) {
      return ApiResponse.error(_handleError(e));
    }
  }

  static Future<ApiResponse<void>> deleteBill(String billId) async {
    try {
      await _dio.delete('/api/bills/$billId');
      return ApiResponse.success(null);
    } catch (e) {
      return ApiResponse.error(_handleError(e));
    }
  }

  // Quotations endpoints
  static Future<ApiResponse<List<Map<String, dynamic>>>> getQuotations({
    String? status,
    int page = 1,
    int limit = 50,
  }) async {
    try {
      final response = await _dio.get('/api/quotations', queryParameters: {
        if (status != null) 'status': status,
        'page': page,
        'limit': limit,
      });

      final quotations = List<Map<String, dynamic>>.from(response.data['data'] ?? []);
      await StorageService.cacheQuotations(quotations);
      
      return ApiResponse.success(quotations);
    } catch (e) {
      final cachedQuotations = StorageService.getCachedQuotations();
      if (cachedQuotations != null) {
        return ApiResponse.success(cachedQuotations);
      }
      return ApiResponse.error(_handleError(e));
    }
  }

  static Future<ApiResponse<Map<String, dynamic>>> getQuotationById(String quotationId) async {
    try {
      final response = await _dio.get('/api/quotations/$quotationId');
      return ApiResponse.success(response.data);
    } catch (e) {
      return ApiResponse.error(_handleError(e));
    }
  }

  static Future<ApiResponse<Map<String, dynamic>>> createQuotation({
    required Map<String, dynamic> quotationData,
  }) async {
    try {
      final response = await _dio.post('/api/quotations', data: quotationData);
      return ApiResponse.success(response.data);
    } catch (e) {
      return ApiResponse.error(_handleError(e));
    }
  }

  static Future<ApiResponse<Map<String, dynamic>>> updateQuotation({
    required String quotationId,
    required Map<String, dynamic> quotationData,
  }) async {
    try {
      final response = await _dio.put('/api/quotations/$quotationId', data: quotationData);
      return ApiResponse.success(response.data);
    } catch (e) {
      return ApiResponse.error(_handleError(e));
    }
  }

  // Clients endpoints
  static Future<ApiResponse<List<Map<String, dynamic>>>> getClients({
    int page = 1,
    int limit = 50,
  }) async {
    try {
      final response = await _dio.get('/api/clients', queryParameters: {
        'page': page,
        'limit': limit,
      });

      final clients = List<Map<String, dynamic>>.from(response.data['data'] ?? []);
      await StorageService.cacheClients(clients);
      
      return ApiResponse.success(clients);
    } catch (e) {
      final cachedClients = StorageService.getCachedClients();
      if (cachedClients != null) {
        return ApiResponse.success(cachedClients);
      }
      return ApiResponse.error(_handleError(e));
    }
  }

  static Future<ApiResponse<Map<String, dynamic>>> getClientById(String clientId) async {
    try {
      final response = await _dio.get('/api/clients/$clientId');
      return ApiResponse.success(response.data);
    } catch (e) {
      return ApiResponse.error(_handleError(e));
    }
  }

  static Future<ApiResponse<Map<String, dynamic>>> createClient({
    required Map<String, dynamic> clientData,
  }) async {
    try {
      final response = await _dio.post('/api/clients', data: clientData);
      return ApiResponse.success(response.data);
    } catch (e) {
      return ApiResponse.error(_handleError(e));
    }
  }

  static Future<ApiResponse<Map<String, dynamic>>> updateClient({
    required String clientId,
    required Map<String, dynamic> clientData,
  }) async {
    try {
      final response = await _dio.put('/api/clients/$clientId', data: clientData);
      return ApiResponse.success(response.data);
    } catch (e) {
      return ApiResponse.error(_handleError(e));
    }
  }

  // Dashboard endpoints
  static Future<ApiResponse<Map<String, dynamic>>> getDashboardData() async {
    try {
      final response = await _dio.get('/api/dashboard');
      
      final dashboardData = Map<String, dynamic>.from(response.data);
      await StorageService.cacheDashboardData(dashboardData);
      
      return ApiResponse.success(dashboardData);
    } catch (e) {
      final cachedData = StorageService.getCachedDashboardData();
      if (cachedData != null) {
        return ApiResponse.success(cachedData);
      }
      return ApiResponse.error(_handleError(e));
    }
  }

  // Notification endpoints
  static Future<ApiResponse<void>> registerDeviceToken({
    required String deviceToken,
    required String deviceId,
  }) async {
    try {
      await _dio.post('/api/notifications/register', data: {
        'device_token': deviceToken,
        'device_id': deviceId,
        'platform': Platform.isAndroid ? 'android' : 'ios',
      });
      return ApiResponse.success(null);
    } catch (e) {
      return ApiResponse.error(_handleError(e));
    }
  }

  // File upload
  static Future<ApiResponse<Map<String, dynamic>>> uploadFile({
    required String filePath,
    required String fileName,
  }) async {
    try {
      final formData = FormData.fromMap({
        'file': await MultipartFile.fromFile(filePath, filename: fileName),
      });

      final response = await _dio.post('/api/upload', data: formData);
      return ApiResponse.success(response.data);
    } catch (e) {
      return ApiResponse.error(_handleError(e));
    }
  }

  // Error handling
  static String _handleError(dynamic error) {
    if (error is DioException) {
      switch (error.type) {
        case DioExceptionType.connectionTimeout:
          return 'Tempo limite de conexão esgotado';
        case DioExceptionType.receiveTimeout:
          return 'Tempo limite de resposta esgotado';
        case DioExceptionType.badResponse:
          if (error.response?.statusCode == 401) {
            return 'Sessão expirada. Faça login novamente';
          } else if (error.response?.statusCode == 403) {
            return 'Acesso negado';
          } else if (error.response?.statusCode == 404) {
            return 'Recurso não encontrado';
          } else if (error.response?.statusCode == 500) {
            return 'Erro interno do servidor';
          }
          return error.response?.data['message'] ?? 'Erro na resposta do servidor';
        case DioExceptionType.cancel:
          return 'Requisição cancelada';
        case DioExceptionType.connectionError:
          return 'Erro de conexão. Verifique sua internet';
        default:
          return 'Erro desconhecido';
      }
    }
    return error.toString();
  }

  // Update base URL
  static void updateBaseUrl(String newUrl) {
    _dio.options.baseUrl = newUrl;
    StorageService.saveServerUrl(newUrl);
  }
}

// Response wrapper
class ApiResponse<T> {
  final T? data;
  final String? error;
  final bool isSuccess;

  ApiResponse._(this.data, this.error, this.isSuccess);

  factory ApiResponse.success(T data) {
    return ApiResponse._(data, null, true);
  }

  factory ApiResponse.error(String error) {
    return ApiResponse._(null, error, false);
  }
}

// Auth Interceptor
class _AuthInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    final token = StorageService.getAuthToken();
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    if (err.response?.statusCode == 401) {
      // Token expired, clear auth and redirect to login
      StorageService.clearAuth();
    }
    handler.next(err);
  }
}

// Logging Interceptor
class _LoggingInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    if (kDebugMode) {
      debugPrint('REQUEST[${options.method}] => PATH: ${options.path}');
      debugPrint('Headers: ${options.headers}');
      debugPrint('Data: ${options.data}');
    }
    handler.next(options);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    if (kDebugMode) {
      debugPrint('RESPONSE[${response.statusCode}] => PATH: ${response.requestOptions.path}');
      debugPrint('Data: ${response.data}');
    }
    handler.next(response);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    if (kDebugMode) {
      debugPrint('ERROR[${err.response?.statusCode}] => PATH: ${err.requestOptions.path}');
      debugPrint('Message: ${err.message}');
    }
    handler.next(err);
  }
}

// Error Interceptor
class _ErrorInterceptor extends Interceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    // Log error for analytics/monitoring
    // Can add crash reporting here (Firebase Crashlytics, Sentry, etc.)
    handler.next(err);
  }
}