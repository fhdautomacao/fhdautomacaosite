import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:awesome_notifications/awesome_notifications.dart';

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
  static const String _channelKeyGeneral = 'gestao_fhd_general';
  static const String _channelKeyBills = 'gestao_fhd_bills';
  static const String _channelKeyQuotations = 'gestao_fhd_quotations';
  static const String _channelKeyUrgent = 'gestao_fhd_urgent';

  static Future<void> initialize() async {
    await AwesomeNotifications().initialize(
      'resource://drawable/ic_launcher',
      [
        // Canal geral
        NotificationChannel(
          channelKey: _channelKeyGeneral,
          channelName: 'Notificações Gerais',
          channelDescription: 'Notificações gerais do Gestão FHD',
          defaultColor: const Color(0xFF1E40AF),
          ledColor: const Color(0xFF1E40AF),
          importance: NotificationImportance.Default,
          channelShowBadge: true,
          playSound: true,
          enableVibration: true,
          enableLights: true,
        ),
        
        // Canal de boletos
        NotificationChannel(
          channelKey: _channelKeyBills,
          channelName: 'Boletos',
          channelDescription: 'Notificações sobre boletos e vencimentos',
          defaultColor: const Color(0xFFEF4444),
          ledColor: const Color(0xFFEF4444),
          importance: NotificationImportance.High,
          channelShowBadge: true,
          playSound: true,
          enableVibration: true,
          enableLights: true,
          soundSource: 'resource://raw/notification_bills',
          vibrationPattern: highVibrationPattern,
        ),
        
        // Canal de orçamentos
        NotificationChannel(
          channelKey: _channelKeyQuotations,
          channelName: 'Orçamentos',
          channelDescription: 'Notificações sobre orçamentos',
          defaultColor: const Color(0xFF059669),
          ledColor: const Color(0xFF059669),
          importance: NotificationImportance.Default,
          channelShowBadge: true,
          playSound: true,
          enableVibration: true,
          enableLights: true,
          soundSource: 'resource://raw/notification_quotations',
        ),
        
        // Canal urgente
        NotificationChannel(
          channelKey: _channelKeyUrgent,
          channelName: 'Urgente',
          channelDescription: 'Notificações urgentes que requerem atenção imediata',
          defaultColor: const Color(0xFFDC2626),
          ledColor: const Color(0xFFDC2626),
          importance: NotificationImportance.Max,
          channelShowBadge: true,
          playSound: true,
          enableVibration: true,
          enableLights: true,
          soundSource: 'resource://raw/notification_urgent',
          vibrationPattern: urgentVibrationPattern,
          criticalAlerts: true,
        ),
      ],
    );

    // Solicitar permissões
    await _requestPermissions();

    // Configurar listeners
    _configureListeners();
  }

  static Future<void> _requestPermissions() async {
    await AwesomeNotifications().isNotificationAllowed().then((isAllowed) async {
      if (!isAllowed) {
        await AwesomeNotifications().requestPermissionToSendNotifications();
      }
    });

    // Permissões específicas do Android
    if (Platform.isAndroid) {
      await AwesomeNotifications().requestPermissionToSendNotifications(
        channelKey: _channelKeyUrgent,
        permissions: [
          NotificationPermission.Alert,
          NotificationPermission.Sound,
          NotificationPermission.Vibration,
          NotificationPermission.Light,
          NotificationPermission.FullScreenIntent,
          NotificationPermission.CriticalAlert,
        ],
      );
    }
  }

  static void _configureListeners() {
    // Listener para quando a notificação é exibida
    AwesomeNotifications().setListeners(
      onActionReceivedMethod: _onActionReceivedMethod,
      onNotificationCreatedMethod: _onNotificationCreatedMethod,
      onNotificationDisplayedMethod: _onNotificationDisplayedMethod,
      onDismissActionReceivedMethod: _onDismissActionReceivedMethod,
    );
  }

  @pragma("vm:entry-point")
  static Future<void> _onActionReceivedMethod(ReceivedAction receivedAction) async {
    debugPrint('Notification action received: ${receivedAction.actionType}');
    
    // Implementar navegação baseada na ação
    switch (receivedAction.buttonKeyPressed) {
      case 'VIEW_BILL':
        // Navegar para detalhes do boleto
        break;
      case 'VIEW_QUOTATION':
        // Navegar para detalhes do orçamento
        break;
      case 'SNOOZE':
        // Reagendar notificação
        await _scheduleSnoozeNotification(receivedAction);
        break;
    }
  }

  @pragma("vm:entry-point")
  static Future<void> _onNotificationCreatedMethod(ReceivedNotification receivedNotification) async {
    debugPrint('Notification created: ${receivedNotification.title}');
  }

  @pragma("vm:entry-point")
  static Future<void> _onNotificationDisplayedMethod(ReceivedNotification receivedNotification) async {
    debugPrint('Notification displayed: ${receivedNotification.title}');
  }

  @pragma("vm:entry-point")
  static Future<void> _onDismissActionReceivedMethod(ReceivedAction receivedAction) async {
    debugPrint('Notification dismissed: ${receivedAction.id}');
  }

  // Método principal para enviar notificações
  static Future<void> showNotification({
    required String title,
    required String body,
    required NotificationType type,
    NotificationPriority priority = NotificationPriority.normal,
    Map<String, String>? payload,
    List<NotificationActionButton>? actionButtons,
    DateTime? scheduleDate,
    String? bigPicture,
    String? largeIcon,
  }) async {
    final channelKey = _getChannelKey(type, priority);
    final notificationId = DateTime.now().millisecondsSinceEpoch.remainder(100000);

    await AwesomeNotifications().createNotification(
      content: NotificationContent(
        id: notificationId,
        channelKey: channelKey,
        title: title,
        body: body,
        payload: payload,
        notificationLayout: _getNotificationLayout(type),
        bigPicture: bigPicture,
        largeIcon: largeIcon,
        category: _getNotificationCategory(type),
        wakeUpScreen: priority == NotificationPriority.urgent,
        fullScreenIntent: priority == NotificationPriority.urgent,
        criticalAlert: priority == NotificationPriority.urgent,
        backgroundColor: _getNotificationColor(type),
        autoDismissible: priority != NotificationPriority.urgent,
      ),
      actionButtons: actionButtons,
      schedule: scheduleDate != null
          ? NotificationCalendar.fromDate(date: scheduleDate)
          : null,
    );
  }

  // Notificação de boleto vencido
  static Future<void> showBillOverdueNotification({
    required String companyName,
    required String amount,
    required String dueDate,
    required String billId,
  }) async {
    await showNotification(
      title: '🚨 Boleto Vencido!',
      body: '$companyName - R\$ $amount\nVencimento: $dueDate',
      type: NotificationType.billOverdue,
      priority: NotificationPriority.urgent,
      payload: {
        'type': 'bill_overdue',
        'bill_id': billId,
      },
      actionButtons: [
        NotificationActionButton(
          key: 'VIEW_BILL',
          label: 'Ver Boleto',
          actionType: ActionType.SilentAction,
        ),
        NotificationActionButton(
          key: 'SNOOZE',
          label: 'Lembrar em 1h',
          actionType: ActionType.SilentAction,
        ),
      ],
    );
  }

  // Notificação de boleto próximo do vencimento
  static Future<void> showBillUpcomingNotification({
    required String companyName,
    required String amount,
    required String dueDate,
    required String billId,
    int daysUntilDue = 1,
  }) async {
    await showNotification(
      title: '⚠️ Boleto Vence em $daysUntilDue ${daysUntilDue == 1 ? 'dia' : 'dias'}',
      body: '$companyName - R\$ $amount\nVencimento: $dueDate',
      type: NotificationType.billUpcoming,
      priority: NotificationPriority.high,
      payload: {
        'type': 'bill_upcoming',
        'bill_id': billId,
      },
      actionButtons: [
        NotificationActionButton(
          key: 'VIEW_BILL',
          label: 'Ver Boleto',
          actionType: ActionType.SilentAction,
        ),
      ],
    );
  }

  // Notificação de novo orçamento
  static Future<void> showNewQuotationNotification({
    required String clientName,
    required String projectType,
    required String quotationId,
  }) async {
    await showNotification(
      title: '📋 Novo Orçamento Recebido',
      body: 'Cliente: $clientName\nProjeto: $projectType',
      type: NotificationType.quotationNew,
      priority: NotificationPriority.normal,
      payload: {
        'type': 'quotation_new',
        'quotation_id': quotationId,
      },
      actionButtons: [
        NotificationActionButton(
          key: 'VIEW_QUOTATION',
          label: 'Ver Orçamento',
          actionType: ActionType.SilentAction,
        ),
      ],
    );
  }

  // Agendar notificações recorrentes
  static Future<void> scheduleRecurringBillReminders({
    required String billId,
    required DateTime dueDate,
    required String companyName,
    required String amount,
  }) async {
    final dueDateFormatted = '${dueDate.day.toString().padLeft(2, '0')}/${dueDate.month.toString().padLeft(2, '0')}/${dueDate.year}';

    // Notificação 7 dias antes
    if (dueDate.subtract(const Duration(days: 7)).isAfter(DateTime.now())) {
      await showNotification(
        title: '📅 Boleto vence em 7 dias',
        body: '$companyName - R\$ $amount\nVencimento: $dueDateFormatted',
        type: NotificationType.billUpcoming,
        priority: NotificationPriority.normal,
        scheduleDate: dueDate.subtract(const Duration(days: 7)),
        payload: {
          'type': 'bill_reminder_7d',
          'bill_id': billId,
        },
      );
    }

    // Notificação 3 dias antes
    if (dueDate.subtract(const Duration(days: 3)).isAfter(DateTime.now())) {
      await showNotification(
        title: '⚠️ Boleto vence em 3 dias',
        body: '$companyName - R\$ $amount\nVencimento: $dueDateFormatted',
        type: NotificationType.billUpcoming,
        priority: NotificationPriority.high,
        scheduleDate: dueDate.subtract(const Duration(days: 3)),
        payload: {
          'type': 'bill_reminder_3d',
          'bill_id': billId,
        },
      );
    }

    // Notificação 1 dia antes
    if (dueDate.subtract(const Duration(days: 1)).isAfter(DateTime.now())) {
      await showNotification(
        title: '🚨 Boleto vence amanhã!',
        body: '$companyName - R\$ $amount\nVencimento: $dueDateFormatted',
        type: NotificationType.billUpcoming,
        priority: NotificationPriority.urgent,
        scheduleDate: dueDate.subtract(const Duration(days: 1)),
        payload: {
          'type': 'bill_reminder_1d',
          'bill_id': billId,
        },
      );
    }

    // Notificação no dia do vencimento
    if (dueDate.isAfter(DateTime.now())) {
      await showNotification(
        title: '🔥 Boleto vence hoje!',
        body: '$companyName - R\$ $amount\nVencimento: HOJE',
        type: NotificationType.billOverdue,
        priority: NotificationPriority.urgent,
        scheduleDate: DateTime(dueDate.year, dueDate.month, dueDate.day, 9, 0),
        payload: {
          'type': 'bill_reminder_today',
          'bill_id': billId,
        },
      );
    }
  }

  // Cancelar notificações específicas
  static Future<void> cancelNotificationsByBillId(String billId) async {
    final notifications = await AwesomeNotifications().listScheduledNotifications();
    
    for (final notification in notifications) {
      if (notification.content?.payload?['bill_id'] == billId) {
        await AwesomeNotifications().cancel(notification.content!.id!);
      }
    }
  }

  // Cancelar todas as notificações
  static Future<void> cancelAllNotifications() async {
    await AwesomeNotifications().cancelAll();
  }

  // Métodos auxiliares
  static String _getChannelKey(NotificationType type, NotificationPriority priority) {
    if (priority == NotificationPriority.urgent) {
      return _channelKeyUrgent;
    }
    
    switch (type) {
      case NotificationType.billOverdue:
      case NotificationType.billUpcoming:
        return _channelKeyBills;
      case NotificationType.quotationNew:
      case NotificationType.quotationUpdated:
        return _channelKeyQuotations;
      case NotificationType.general:
        return _channelKeyGeneral;
    }
  }

  static NotificationLayout _getNotificationLayout(NotificationType type) {
    switch (type) {
      case NotificationType.billOverdue:
        return NotificationLayout.BigText;
      case NotificationType.billUpcoming:
        return NotificationLayout.BigText;
      case NotificationType.quotationNew:
        return NotificationLayout.Messaging;
      default:
        return NotificationLayout.Default;
    }
  }

  static NotificationCategory _getNotificationCategory(NotificationType type) {
    switch (type) {
      case NotificationType.billOverdue:
      case NotificationType.billUpcoming:
        return NotificationCategory.Reminder;
      case NotificationType.quotationNew:
      case NotificationType.quotationUpdated:
        return NotificationCategory.Message;
      default:
        return NotificationCategory.Service;
    }
  }

  static Color _getNotificationColor(NotificationType type) {
    switch (type) {
      case NotificationType.billOverdue:
        return const Color(0xFFDC2626);
      case NotificationType.billUpcoming:
        return const Color(0xFFF59E0B);
      case NotificationType.quotationNew:
      case NotificationType.quotationUpdated:
        return const Color(0xFF059669);
      default:
        return const Color(0xFF1E40AF);
    }
  }

  static Future<void> _scheduleSnoozeNotification(ReceivedAction action) async {
    final payload = action.payload;
    if (payload != null) {
      final snoozeDate = DateTime.now().add(const Duration(hours: 1));
      
      await showNotification(
        title: action.title ?? 'Lembrete',
        body: action.body ?? '',
        type: NotificationType.general,
        priority: NotificationPriority.normal,
        scheduleDate: snoozeDate,
        payload: payload,
      );
    }
  }

  // Padrões de vibração
  static Int64List get highVibrationPattern => Int64List.fromList([0, 200, 100, 200, 100, 200]);
  static Int64List get urgentVibrationPattern => Int64List.fromList([0, 300, 200, 300, 200, 300, 200, 300]);
}