import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/routes/app_routes.dart';
import '../../../../core/services/storage_service.dart';
import '../../../../core/services/api_service.dart';

class SplashPage extends ConsumerStatefulWidget {
  const SplashPage({super.key});

  @override
  ConsumerState<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends ConsumerState<SplashPage> {
  @override
  void initState() {
    super.initState();
    _initializeApp();
  }

  Future<void> _initializeApp() async {
    // Simular carregamento mínimo
    await Future.delayed(const Duration(milliseconds: 2000));

    try {
      // Inicializar serviços
      ApiService.initialize();
      
      // Verificar se usuário está logado
      final isLoggedIn = StorageService.isLoggedIn();
      final authToken = StorageService.getAuthToken();

      if (mounted) {
        if (isLoggedIn && authToken != null) {
          // Usuário logado, ir para home
          Navigator.of(context).pushReplacementNamed(AppRoutes.home);
        } else {
          // Usuário não logado, ir para login
          Navigator.of(context).pushReplacementNamed(AppRoutes.login);
        }
      }
    } catch (e) {
      // Em caso de erro, ir para login
      if (mounted) {
        Navigator.of(context).pushReplacementNamed(AppRoutes.login);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: AppColors.primaryGradient,
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Logo animado
            Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                color: AppColors.white,
                borderRadius: BorderRadius.circular(24),
                boxShadow: AppColors.elevatedShadow,
              ),
              child: const Icon(
                Icons.business,
                size: 64,
                color: AppColors.primary,
              ),
            )
                .animate()
                .scale(delay: 300.ms, duration: 600.ms, curve: Curves.elasticOut)
                .fadeIn(delay: 300.ms, duration: 600.ms),

            const SizedBox(height: 32),

            // Título
            Text(
              AppStrings.appName,
              style: Theme.of(context).textTheme.displayMedium?.copyWith(
                color: AppColors.white,
                fontWeight: FontWeight.w700,
              ),
            )
                .animate()
                .slideY(
                  begin: 0.3,
                  delay: 600.ms,
                  duration: 600.ms,
                  curve: Curves.easeOut,
                )
                .fadeIn(delay: 600.ms, duration: 600.ms),

            const SizedBox(height: 8),

            // Subtítulo
            Text(
              AppStrings.companyName,
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                color: AppColors.white.withOpacity(0.9),
                fontWeight: FontWeight.w400,
              ),
              textAlign: TextAlign.center,
            )
                .animate()
                .slideY(
                  begin: 0.3,
                  delay: 800.ms,
                  duration: 600.ms,
                  curve: Curves.easeOut,
                )
                .fadeIn(delay: 800.ms, duration: 600.ms),

            const SizedBox(height: 64),

            // Loading indicator
            const SizedBox(
              width: 32,
              height: 32,
              child: CircularProgressIndicator(
                strokeWidth: 3,
                valueColor: AlwaysStoppedAnimation<Color>(AppColors.white),
              ),
            )
                .animate()
                .fadeIn(delay: 1200.ms, duration: 400.ms),

            const SizedBox(height: 16),

            // Loading text
            Text(
              AppStrings.loading,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: AppColors.white.withOpacity(0.8),
              ),
            )
                .animate()
                .fadeIn(delay: 1400.ms, duration: 400.ms),

            const SizedBox(height: 120),

            // Versão
            Text(
              'v${AppStrings.appVersion}',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: AppColors.white.withOpacity(0.6),
              ),
            )
                .animate()
                .fadeIn(delay: 1600.ms, duration: 400.ms),
          ],
        ),
      ),
    );
  }
}