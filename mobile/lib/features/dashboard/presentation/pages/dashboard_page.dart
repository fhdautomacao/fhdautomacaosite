import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../auth/presentation/providers/auth_provider.dart';

class DashboardPage extends ConsumerWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final user = authState.user;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () async {
            // Implementar refresh dos dados
            await Future.delayed(const Duration(seconds: 1));
          },
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header
                  _buildHeader(context, user?.name ?? 'Usuário'),
                  
                  const SizedBox(height: 24),
                  
                  // Métricas principais
                  _buildMetricsSection(context),
                  
                  const SizedBox(height: 24),
                  
                  // Ações rápidas
                  _buildQuickActions(context),
                  
                  const SizedBox(height: 24),
                  
                  // Atividade recente
                  _buildRecentActivity(context),
                  
                  const SizedBox(height: 24),
                  
                  // Notificações importantes
                  _buildImportantNotifications(context),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context, String userName) {
    return Row(
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Olá, $userName! 👋',
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              )
                  .animate()
                  .fadeIn(delay: 100.ms, duration: 600.ms)
                  .slideY(begin: 0.3, delay: 100.ms, duration: 600.ms),
              
              const SizedBox(height: 4),
              
              Text(
                'Bem-vindo ao ${AppStrings.appName}',
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color: AppColors.textSecondary,
                ),
              )
                  .animate()
                  .fadeIn(delay: 200.ms, duration: 600.ms)
                  .slideY(begin: 0.3, delay: 200.ms, duration: 600.ms),
            ],
          ),
        ),
        
        // Avatar
        Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            gradient: AppColors.primaryGradient,
            borderRadius: BorderRadius.circular(24),
            boxShadow: AppColors.cardShadow,
          ),
          child: Icon(
            MdiIcons.account,
            color: AppColors.white,
            size: 24,
          ),
        )
            .animate()
            .scale(delay: 300.ms, duration: 600.ms, curve: Curves.elasticOut),
      ],
    );
  }

  Widget _buildMetricsSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          AppStrings.overview,
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        )
            .animate()
            .fadeIn(delay: 400.ms, duration: 600.ms),
        
        const SizedBox(height: 16),
        
        Row(
          children: [
            Expanded(
              child: _buildMetricCard(
                context: context,
                title: 'Boletos Vencidos',
                value: '3',
                icon: MdiIcons.alertCircle,
                color: AppColors.error,
                delay: 500.ms,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildMetricCard(
                context: context,
                title: 'Próximos Venc.',
                value: '7',
                icon: MdiIcons.clockOutline,
                color: AppColors.warning,
                delay: 600.ms,
              ),
            ),
          ],
        ),
        
        const SizedBox(height: 12),
        
        Row(
          children: [
            Expanded(
              child: _buildMetricCard(
                context: context,
                title: 'Orçamentos',
                value: '12',
                icon: MdiIcons.calculatorVariant,
                color: AppColors.info,
                delay: 700.ms,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildMetricCard(
                context: context,
                title: 'Clientes',
                value: '45',
                icon: MdiIcons.accountGroup,
                color: AppColors.success,
                delay: 800.ms,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildMetricCard({
    required BuildContext context,
    required String title,
    required String value,
    required IconData icon,
    required Color color,
    required Duration delay,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppColors.cardShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Icon(
                icon,
                color: color,
                size: 24,
              ),
              Text(
                value,
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            title,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: AppColors.textSecondary,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    )
        .animate()
        .fadeIn(delay: delay, duration: 600.ms)
        .slideY(begin: 0.3, delay: delay, duration: 600.ms);
  }

  Widget _buildQuickActions(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Ações Rápidas',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        )
            .animate()
            .fadeIn(delay: 900.ms, duration: 600.ms),
        
        const SizedBox(height: 16),
        
        Row(
          children: [
            Expanded(
              child: _buildActionCard(
                context: context,
                title: 'Novo Boleto',
                icon: MdiIcons.plus,
                color: AppColors.primary,
                onTap: () {
                  // Navegar para criar boleto
                },
                delay: 1000.ms,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildActionCard(
                context: context,
                title: 'Novo Orçamento',
                icon: MdiIcons.calculatorVariant,
                color: AppColors.secondary,
                onTap: () {
                  // Navegar para criar orçamento
                },
                delay: 1100.ms,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildActionCard({
    required BuildContext context,
    required String title,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
    required Duration delay,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withOpacity(0.2)),
        ),
        child: Column(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: color,
                borderRadius: BorderRadius.circular(24),
              ),
              child: Icon(
                icon,
                color: AppColors.white,
                size: 24,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              title,
              style: Theme.of(context).textTheme.titleSmall?.copyWith(
                fontWeight: FontWeight.w600,
                color: color,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    )
        .animate()
        .fadeIn(delay: delay, duration: 600.ms)
        .slideY(begin: 0.3, delay: delay, duration: 600.ms);
  }

  Widget _buildRecentActivity(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          AppStrings.recentActivity,
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        )
            .animate()
            .fadeIn(delay: 1200.ms, duration: 600.ms),
        
        const SizedBox(height: 16),
        
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: AppColors.cardShadow,
          ),
          child: Column(
            children: [
              _buildActivityItem(
                context: context,
                title: 'Boleto criado para Empresa ABC',
                subtitle: '2 horas atrás',
                icon: MdiIcons.fileDocumentOutline,
                color: AppColors.success,
              ),
              const Divider(height: 24),
              _buildActivityItem(
                context: context,
                title: 'Orçamento aprovado - Cliente XYZ',
                subtitle: '5 horas atrás',
                icon: MdiIcons.checkCircle,
                color: AppColors.primary,
              ),
              const Divider(height: 24),
              _buildActivityItem(
                context: context,
                title: 'Novo cliente cadastrado',
                subtitle: '1 dia atrás',
                icon: MdiIcons.accountPlus,
                color: AppColors.secondary,
              ),
            ],
          ),
        )
            .animate()
            .fadeIn(delay: 1300.ms, duration: 600.ms)
            .slideY(begin: 0.3, delay: 1300.ms, duration: 600.ms),
      ],
    );
  }

  Widget _buildActivityItem({
    required BuildContext context,
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
  }) {
    return Row(
      children: [
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Icon(
            icon,
            color: color,
            size: 20,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  fontWeight: FontWeight.w500,
                  color: AppColors.textPrimary,
                ),
              ),
              Text(
                subtitle,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildImportantNotifications(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Alertas Importantes',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        )
            .animate()
            .fadeIn(delay: 1400.ms, duration: 600.ms),
        
        const SizedBox(height: 16),
        
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.error.withOpacity(0.1),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.error.withOpacity(0.2)),
          ),
          child: Row(
            children: [
              Icon(
                MdiIcons.alertCircle,
                color: AppColors.error,
                size: 24,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Boletos Vencidos',
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(
                        fontWeight: FontWeight.w600,
                        color: AppColors.error,
                      ),
                    ),
                    Text(
                      '3 boletos estão vencidos e precisam de atenção',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              Icon(
                MdiIcons.chevronRight,
                color: AppColors.error,
                size: 20,
              ),
            ],
          ),
        )
            .animate()
            .fadeIn(delay: 1500.ms, duration: 600.ms)
            .slideY(begin: 0.3, delay: 1500.ms, duration: 600.ms),
      ],
    );
  }
}