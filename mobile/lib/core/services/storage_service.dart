import 'dart:convert';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';

class StorageService {
  static late Box _settingsBox;
  static late Box _cacheBox;
  static late Box _notificationsBox;
  static late SharedPreferences _prefs;

  // Box names
  static const String _settingsBoxName = 'settings';
  static const String _cacheBoxName = 'cache';
  static const String _notificationsBoxName = 'notifications';

  // Settings keys
  static const String _authTokenKey = 'auth_token';
  static const String _userEmailKey = 'user_email';
  static const String _serverUrlKey = 'server_url';
  static const String _isLoggedInKey = 'is_logged_in';
  static const String _themeKey = 'theme_mode';
  static const String _notificationSettingsKey = 'notification_settings';
  static const String _lastSyncKey = 'last_sync';
  static const String _appVersionKey = 'app_version';

  // Cache keys
  static const String _billsCacheKey = 'bills_cache';
  static const String _quotationsCacheKey = 'quotations_cache';
  static const String _clientsCacheKey = 'clients_cache';
  static const String _dashboardCacheKey = 'dashboard_cache';

  static Future<void> initialize() async {
    // Inicializar SharedPreferences
    _prefs = await SharedPreferences.getInstance();

    // Inicializar Hive boxes
    _settingsBox = await Hive.openBox(_settingsBoxName);
    _cacheBox = await Hive.openBox(_cacheBoxName);
    _notificationsBox = await Hive.openBox(_notificationsBoxName);
  }

  // Auth methods
  static Future<void> saveAuthToken(String token) async {
    await _settingsBox.put(_authTokenKey, token);
  }

  static String? getAuthToken() {
    return _settingsBox.get(_authTokenKey);
  }

  static Future<void> saveUserEmail(String email) async {
    await _settingsBox.put(_userEmailKey, email);
  }

  static String? getUserEmail() {
    return _settingsBox.get(_userEmailKey);
  }

  static Future<void> setLoggedIn(bool isLoggedIn) async {
    await _settingsBox.put(_isLoggedInKey, isLoggedIn);
  }

  static bool isLoggedIn() {
    return _settingsBox.get(_isLoggedInKey, defaultValue: false);
  }

  static Future<void> saveServerUrl(String url) async {
    await _settingsBox.put(_serverUrlKey, url);
  }

  static String getServerUrl() {
    return _settingsBox.get(
      _serverUrlKey, 
      defaultValue: 'https://fhdautomacaoindustrialapp.vercel.app'
    );
  }

  static Future<void> clearAuth() async {
    await _settingsBox.delete(_authTokenKey);
    await _settingsBox.delete(_userEmailKey);
    await _settingsBox.put(_isLoggedInKey, false);
  }

  // Theme methods
  static Future<void> saveThemeMode(String themeMode) async {
    await _settingsBox.put(_themeKey, themeMode);
  }

  static String getThemeMode() {
    return _settingsBox.get(_themeKey, defaultValue: 'light');
  }

  // Notification settings
  static Future<void> saveNotificationSettings(Map<String, dynamic> settings) async {
    await _settingsBox.put(_notificationSettingsKey, jsonEncode(settings));
  }

  static Map<String, dynamic> getNotificationSettings() {
    final settingsJson = _settingsBox.get(_notificationSettingsKey);
    if (settingsJson != null) {
      return Map<String, dynamic>.from(jsonDecode(settingsJson));
    }
    return _getDefaultNotificationSettings();
  }

  static Map<String, dynamic> _getDefaultNotificationSettings() {
    return {
      'pushNotifications': true,
      'soundEnabled': true,
      'vibrationEnabled': true,
      'ledEnabled': true,
      'billReminders': {
        'enabled': true,
        'daysBefore': [7, 3, 1],
        'timeOfDay': '09:00',
      },
      'quotationNotifications': {
        'enabled': true,
        'newQuotations': true,
        'statusUpdates': true,
      },
      'scheduleNotifications': {
        'enabled': true,
        'workDaysOnly': false,
        'startTime': '08:00',
        'endTime': '18:00',
      },
    };
  }

  // Cache methods
  static Future<void> cacheBills(List<Map<String, dynamic>> bills) async {
    await _cacheBox.put(_billsCacheKey, {
      'data': bills,
      'timestamp': DateTime.now().millisecondsSinceEpoch,
    });
  }

  static List<Map<String, dynamic>>? getCachedBills() {
    final cached = _cacheBox.get(_billsCacheKey);
    if (cached != null && _isCacheValid(cached['timestamp'])) {
      return List<Map<String, dynamic>>.from(cached['data']);
    }
    return null;
  }

  static Future<void> cacheQuotations(List<Map<String, dynamic>> quotations) async {
    await _cacheBox.put(_quotationsCacheKey, {
      'data': quotations,
      'timestamp': DateTime.now().millisecondsSinceEpoch,
    });
  }

  static List<Map<String, dynamic>>? getCachedQuotations() {
    final cached = _cacheBox.get(_quotationsCacheKey);
    if (cached != null && _isCacheValid(cached['timestamp'])) {
      return List<Map<String, dynamic>>.from(cached['data']);
    }
    return null;
  }

  static Future<void> cacheClients(List<Map<String, dynamic>> clients) async {
    await _cacheBox.put(_clientsCacheKey, {
      'data': clients,
      'timestamp': DateTime.now().millisecondsSinceEpoch,
    });
  }

  static List<Map<String, dynamic>>? getCachedClients() {
    final cached = _cacheBox.get(_clientsCacheKey);
    if (cached != null && _isCacheValid(cached['timestamp'])) {
      return List<Map<String, dynamic>>.from(cached['data']);
    }
    return null;
  }

  static Future<void> cacheDashboardData(Map<String, dynamic> dashboardData) async {
    await _cacheBox.put(_dashboardCacheKey, {
      'data': dashboardData,
      'timestamp': DateTime.now().millisecondsSinceEpoch,
    });
  }

  static Map<String, dynamic>? getCachedDashboardData() {
    final cached = _cacheBox.get(_dashboardCacheKey);
    if (cached != null && _isCacheValid(cached['timestamp'])) {
      return Map<String, dynamic>.from(cached['data']);
    }
    return null;
  }

  // Cache validation (5 minutes)
  static bool _isCacheValid(int timestamp) {
    final now = DateTime.now().millisecondsSinceEpoch;
    const cacheValidityDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
    return (now - timestamp) < cacheValidityDuration;
  }

  static Future<void> clearCache() async {
    await _cacheBox.clear();
  }

  // Notification history
  static Future<void> saveNotificationHistory(Map<String, dynamic> notification) async {
    final history = getNotificationHistory();
    history.insert(0, {
      ...notification,
      'timestamp': DateTime.now().millisecondsSinceEpoch,
      'id': DateTime.now().millisecondsSinceEpoch.toString(),
    });

    // Keep only last 100 notifications
    if (history.length > 100) {
      history.removeRange(100, history.length);
    }

    await _notificationsBox.put('history', history);
  }

  static List<Map<String, dynamic>> getNotificationHistory() {
    final history = _notificationsBox.get('history');
    if (history != null) {
      return List<Map<String, dynamic>>.from(history);
    }
    return [];
  }

  static Future<void> clearNotificationHistory() async {
    await _notificationsBox.delete('history');
  }

  static Future<void> markNotificationAsRead(String notificationId) async {
    final history = getNotificationHistory();
    final index = history.indexWhere((n) => n['id'] == notificationId);
    if (index != -1) {
      history[index]['read'] = true;
      await _notificationsBox.put('history', history);
    }
  }

  // Sync methods
  static Future<void> saveLastSyncTime() async {
    await _settingsBox.put(_lastSyncKey, DateTime.now().millisecondsSinceEpoch);
  }

  static DateTime? getLastSyncTime() {
    final timestamp = _settingsBox.get(_lastSyncKey);
    if (timestamp != null) {
      return DateTime.fromMillisecondsSinceEpoch(timestamp);
    }
    return null;
  }

  // App version
  static Future<void> saveAppVersion(String version) async {
    await _settingsBox.put(_appVersionKey, version);
  }

  static String? getAppVersion() {
    return _settingsBox.get(_appVersionKey);
  }

  // General purpose storage
  static Future<void> saveString(String key, String value) async {
    await _prefs.setString(key, value);
  }

  static String? getString(String key) {
    return _prefs.getString(key);
  }

  static Future<void> saveBool(String key, bool value) async {
    await _prefs.setBool(key, value);
  }

  static bool getBool(String key, {bool defaultValue = false}) {
    return _prefs.getBool(key) ?? defaultValue;
  }

  static Future<void> saveInt(String key, int value) async {
    await _prefs.setInt(key, value);
  }

  static int getInt(String key, {int defaultValue = 0}) {
    return _prefs.getInt(key) ?? defaultValue;
  }

  static Future<void> saveDouble(String key, double value) async {
    await _prefs.setDouble(key, value);
  }

  static double getDouble(String key, {double defaultValue = 0.0}) {
    return _prefs.getDouble(key) ?? defaultValue;
  }

  static Future<void> saveStringList(String key, List<String> value) async {
    await _prefs.setStringList(key, value);
  }

  static List<String> getStringList(String key) {
    return _prefs.getStringList(key) ?? [];
  }

  // Clean up methods
  static Future<void> clearAll() async {
    await _settingsBox.clear();
    await _cacheBox.clear();
    await _notificationsBox.clear();
    await _prefs.clear();
  }

  static Future<void> dispose() async {
    await _settingsBox.close();
    await _cacheBox.close();
    await _notificationsBox.close();
  }
}