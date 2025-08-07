import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:awesome_notifications/awesome_notifications.dart';

import 'app.dart';
import 'core/services/notification_service.dart';
import 'core/services/storage_service.dart';
import 'core/services/sync_service.dart';
import 'core/constants/app_colors.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Configurar orientação da tela
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);
  
  // Configurar status bar
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
      systemNavigationBarColor: Colors.white,
      systemNavigationBarIconBrightness: Brightness.dark,
    ),
  );
  
  // Inicializar Hive para armazenamento local
  await Hive.initFlutter();
  await StorageService.initialize();
  
  // Inicializar notificações
  await NotificationService.initialize();
  
  // Configurar notificações para inicialização
  AwesomeNotifications().setListeners(
    onActionReceivedMethod: NotificationService.onActionReceivedMethod,
    onNotificationCreatedMethod: NotificationService.onNotificationCreatedMethod,
    onNotificationDisplayedMethod: NotificationService.onNotificationDisplayedMethod,
    onDismissActionReceivedMethod: NotificationService.onDismissActionReceivedMethod,
  );
  
  runApp(
    const ProviderScope(
      child: GestaoFHDApp(),
    ),
  );
} 