import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/timezone.dart' as tz;
import 'package:timezone/data/latest.dart' as tz;
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

enum NotificationType {
  billOverdue,
  billUpcoming,
  quotationNew,
  quotationUpdated,
  general,
}

enum NotificationPriority {
  low,
  normal,
  high,
  urgent,
}

class NotificationService {
  static final FlutterLocalNotificationsPlugin _notifications = FlutterLocalNotificationsPlugin();
  static bool _initialized = false;

  static Future<void> initialize() async {
    if (_initialized) return;

    const AndroidInitializationSettings initializationSettingsAndroid =
        AndroidInitializationSettings('@mipmap/ic_launcher');

    const DarwinInitializationSettings initializationSettingsIOS =
        DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );

    const InitializationSettings initializationSettings = InitializationSettings(
      android: initializationSettingsAndroid,
      iOS: initializationSettingsIOS,
    );

    await _notifications.initialize(
      initializationSettings,
      onDidReceiveNotificationResponse: _onNotificationTapped,
    );

    _initialized = true;
  }

  static void _onNotificationTapped(NotificationResponse response) {
    // Implementar navegação baseada no payload
    print('Notificação clicada: ${response.payload}');
  }

  static Future<void> showNotification({
    required String title,
    required String body,
    NotificationType type = NotificationType.general,
    NotificationPriority priority = NotificationPriority.normal,
    DateTime? scheduleDate,
    Map<String, String>? payload,
  }) async {
    if (!_initialized) await initialize();

    const AndroidNotificationDetails androidPlatformChannelSpecifics =
        AndroidNotificationDetails(
      'gestao_fhd_channel',
      'Gestão FHD',
      channelDescription: 'Notificações do Gestão FHD',
      importance: Importance.high,
      priority: Priority.high,
      showWhen: true,
      enableVibration: true,
      playSound: true,
    );

    const DarwinNotificationDetails iOSPlatformChannelSpecifics =
        DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
    );

    const NotificationDetails platformChannelSpecifics = NotificationDetails(
      android: androidPlatformChannelSpecifics,
      iOS: iOSPlatformChannelSpecifics,
    );

    if (scheduleDate != null) {
      await _notifications.zonedSchedule(
        0,
        title,
        body,
        tz.TZDateTime.from(scheduleDate, tz.local),
        platformChannelSpecifics,
        androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
        uiLocalNotificationDateInterpretation:
            UILocalNotificationDateInterpretation.absoluteTime,
        payload: payload?.toString(),
      );
    } else {
      await _notifications.show(
        0,
        title,
        body,
        platformChannelSpecifics,
        payload: payload?.toString(),
      );
    }
  }

  static Future<void> cancelAllNotifications() async {
    await _notifications.cancelAll();
  }

  static Future<void> cancelNotification(int id) async {
    await _notifications.cancel(id);
  }

  static Future<void> cancelNotificationsByBillId(String billId) async {
    // Implementar cancelamento por billId se necessário
    await cancelAllNotifications();
  }

  // Métodos auxiliares para tipos específicos de notificação
  static Future<void> showBillOverdueNotification({
    required String billId,
    required String billTitle,
    required DateTime dueDate,
  }) async {
    await showNotification(
      title: 'Boleto Vencido',
      body: 'O boleto "$billTitle" venceu em ${_formatDate(dueDate)}',
      type: NotificationType.billOverdue,
      priority: NotificationPriority.high,
      payload: {'bill_id': billId, 'type': 'overdue'},
    );
  }

  static Future<void> showBillUpcomingNotification({
    required String billId,
    required String billTitle,
    required DateTime dueDate,
  }) async {
    await showNotification(
      title: 'Boleto Vencendo',
      body: 'O boleto "$billTitle" vence em ${_formatDate(dueDate)}',
      type: NotificationType.billUpcoming,
      priority: NotificationPriority.normal,
      payload: {'bill_id': billId, 'type': 'upcoming'},
    );
  }

  static Future<void> showQuotationNotification({
    required String quotationId,
    required String quotationTitle,
  }) async {
    await showNotification(
      title: 'Novo Orçamento',
      body: 'Orçamento "$quotationTitle" foi criado',
      type: NotificationType.quotationNew,
      priority: NotificationPriority.normal,
      payload: {'quotation_id': quotationId, 'type': 'new'},
    );
  }

  static String _formatDate(DateTime date) {
    return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';
  }
}