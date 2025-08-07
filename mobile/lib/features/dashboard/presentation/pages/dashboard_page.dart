import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../auth/presentation/providers/auth_provider.dart';
import '../providers/dashboard_provider.dart';

class DashboardPage extends ConsumerWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final dashboardState = ref.watch(dashboardProvider);
    final user = authState.user;

    // Carregar dados do dashboard quando a página for montada
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (dashboardState.data == null && !dashboardState.isLoading) {
        ref.read(dashboardProvider.notifier).loadDashboardData();
      }
    });

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () async {
            await ref.read(dashboardProvider.notifier).refreshDashboard();
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
                  
                  // Loading state
                  if (dashboardState.isLoading)
                    _buildLoadingState(context)
                  else if (dashboardState.error != null)
                    _buildErrorState(context, dashboardState.error!)
                  else
                    Column(
                      children: [
                        // Métricas principais
                        _buildMetricsSection(context, ref),
                        
                        const SizedBox(height: 24),
                        
                        // Ações rápidas
                        _buildQuickActions(context),
                        
                        const SizedBox(height: 24),
                        
                        // Atividade recente
                        _buildRecentActivity(context, ref),
                        
                        const SizedBox(height: 24),
                        
                        // Notificações importantes
                        _buildImportantNotifications(context, ref),
                      ],
                    ),
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

  Widget _buildMetricsSection(BuildContext context, WidgetRef ref) {
    final dashboardNotifier = ref.read(dashboardProvider.notifier);
    
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
                value: dashboardNotifier.totalOverdue.toString(),
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
                value: dashboardNotifier.pendingCount.toString(),
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
                value: dashboardNotifier.totalQuotations.toString(),
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
                value: dashboardNotifier.totalClients.toString(),
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

  Widget _buildRecentActivity(BuildContext context, WidgetRef ref) {
    final dashboardNotifier = ref.read(dashboardProvider.notifier);
    final recentBills = dashboardNotifier.recentBills ?? [];
    final recentQuotations = dashboardNotifier.recentQuotations ?? [];
    final recentClients = dashboardNotifier.recentClients ?? [];
    
    // Combinar todas as atividades recentes
    final activities = <Map<String, dynamic>>[];
    
    // Adicionar boletos recentes
    for (final bill in recentBills.take(2)) {
      activities.add({
        'title': 'Boleto criado para ${bill['company_name'] ?? 'Cliente'}',
        'subtitle': _formatTimeAgo(bill['created_at']),
        'icon': MdiIcons.fileDocumentOutline,
        'color': AppColors.success,
      });
    }
    
    // Adicionar orçamentos recentes
    for (final quotation in recentQuotations.take(2)) {
      activities.add({
        'title': 'Orçamento ${quotation['status'] == 'approved' ? 'aprovado' : 'criado'} - ${quotation['client_name'] ?? 'Cliente'}',
        'subtitle': _formatTimeAgo(quotation['created_at']),
        'icon': quotation['status'] == 'approved' ? MdiIcons.checkCircle : MdiIcons.calculatorVariant,
        'color': quotation['status'] == 'approved' ? AppColors.primary : AppColors.info,
      });
    }
    
    // Adicionar clientes recentes
    for (final client in recentClients.take(1)) {
      activities.add({
        'title': 'Novo cliente cadastrado: ${client['name'] ?? 'Cliente'}',
        'subtitle': _formatTimeAgo(client['created_at']),
        'icon': MdiIcons.accountPlus,
        'color': AppColors.secondary,
      });
    }
    
    // Ordenar por data mais recente
    activities.sort((a, b) => b['subtitle'].compareTo(a['subtitle']));
    
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
          child: activities.isEmpty
              ? _buildEmptyActivityState(context)
              : Column(
                  children: activities.take(3).map((activity) {
                    final index = activities.indexOf(activity);
                    return Column(
                      children: [
                        _buildActivityItem(
                          context: context,
                          title: activity['title'],
                          subtitle: activity['subtitle'],
                          icon: activity['icon'],
                          color: activity['color'],
                        ),
                        if (index < activities.length - 1 && index < 2)
                          const Divider(height: 24),
                      ],
                    );
                  }).toList(),
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

  Widget _buildImportantNotifications(BuildContext context, WidgetRef ref) {
    final dashboardNotifier = ref.read(dashboardProvider.notifier);
    final overdueBills = dashboardNotifier.overdueBills ?? [];
    final pendingBills = dashboardNotifier.pendingBills ?? [];
    
    final notifications = <Map<String, dynamic>>[];
    
    // Adicionar alertas para boletos vencidos
    if (overdueBills.isNotEmpty) {
      notifications.add({
        'title': 'Boletos Vencidos',
        'subtitle': '${overdueBills.length} boleto(s) vencido(s)',
        'icon': MdiIcons.alertCircle,
        'color': AppColors.error,
        'action': 'Ver detalhes',
      });
    }
    
    // Adicionar alertas para boletos pendentes
    if (pendingBills.isNotEmpty) {
      notifications.add({
        'title': 'Boletos Pendentes',
        'subtitle': '${pendingBills.length} boleto(s) pendente(s)',
        'icon': MdiIcons.clockOutline,
        'color': AppColors.warning,
        'action': 'Ver detalhes',
      });
    }
    
    if (notifications.isEmpty) {
      return const SizedBox.shrink();
    }
    
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
        
        ...notifications.map((notification) => Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: notification['color'].withOpacity(0.1),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: notification['color'].withOpacity(0.3)),
          ),
          child: Row(
            children: [
              Icon(
                notification['icon'],
                color: notification['color'],
                size: 24,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      notification['title'],
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      notification['subtitle'],
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              Text(
                notification['action'],
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: notification['color'],
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ))
            .animate()
            .fadeIn(delay: 1500.ms, duration: 600.ms)
            .slideY(begin: 0.3, delay: 1500.ms, duration: 600.ms),
      ],
    );
  }

  Widget _buildLoadingState(BuildContext context) {
    return Column(
      children: [
        const SizedBox(height: 100),
        Center(
          child: Column(
            children: [
              CircularProgressIndicator(
                color: AppColors.primary,
              ),
              const SizedBox(height: 16),
              Text(
                'Carregando dados...',
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildErrorState(BuildContext context, String error) {
    return Column(
      children: [
        const SizedBox(height: 100),
        Center(
          child: Column(
            children: [
              Icon(
                MdiIcons.alertCircle,
                color: AppColors.error,
                size: 48,
              ),
              const SizedBox(height: 16),
              Text(
                'Erro ao carregar dados',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  color: AppColors.textPrimary,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                error,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: AppColors.textSecondary,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () {
                  // Recarregar dados
                },
                child: const Text('Tentar novamente'),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildEmptyActivityState(BuildContext context) {
    return Column(
      children: [
        Icon(
          MdiIcons.informationOutline,
          color: AppColors.textSecondary,
          size: 32,
        ),
        const SizedBox(height: 8),
        Text(
          'Nenhuma atividade recente',
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
            color: AppColors.textSecondary,
          ),
        ),
      ],
    );
  }

  String _formatTimeAgo(String? dateString) {
    if (dateString == null) return 'Data desconhecida';
    
    try {
      final date = DateTime.parse(dateString);
      final now = DateTime.now();
      final difference = now.difference(date);
      
      if (difference.inDays > 0) {
        return '${difference.inDays} dia(s) atrás';
      } else if (difference.inHours > 0) {
        return '${difference.inHours} hora(s) atrás';
      } else if (difference.inMinutes > 0) {
        return '${difference.inMinutes} minuto(s) atrás';
      } else {
        return 'Agora mesmo';
      }
    } catch (e) {
      return 'Data desconhecida';
    }
  }
}