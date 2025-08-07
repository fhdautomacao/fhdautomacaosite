import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'core/constants/app_colors.dart';
import 'core/constants/app_strings.dart';
import 'core/routes/app_routes.dart';
import 'core/theme/app_theme.dart';
import 'features/auth/presentation/providers/auth_provider.dart';
import 'features/splash/presentation/pages/splash_page.dart';

class GestaoFHDApp extends ConsumerWidget {
  const GestaoFHDApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    
    return MaterialApp(
      title: AppStrings.appName,
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.light,
      
      // Configurações de localização
      locale: const Locale('pt', 'BR'),
      
      // Navegação inicial
      home: const SplashPage(),
      
      // Rotas do app
      onGenerateRoute: AppRoutes.generateRoute,
      
      // Builder para configurações globais
      builder: (context, child) {
        return MediaQuery(
          data: MediaQuery.of(context).copyWith(
            textScaler: const TextScaler.linear(1.0), // Evita zoom de acessibilidade
          ),
          child: child!,
        );
      },
    );
  }
}