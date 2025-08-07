import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';

import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/routes/app_routes.dart';
import '../../../auth/presentation/providers/auth_provider.dart';

class SettingsPage extends ConsumerWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final user = authState.user;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(AppStrings.settingsTitle),
        automaticallyImplyLeading: false,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Profile Section
            Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: AppColors.cardShadow,
              ),
              child: Row(
                children: [
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      gradient: AppColors.primaryGradient,
                      borderRadius: BorderRadius.circular(30),
                    ),
                    child: Icon(
                      MdiIcons.account,
                      color: AppColors.white,
                      size: 30,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          user?.name ?? 'Usuário',
                          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.w600,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          user?.email ?? '',
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: AppColors.textSecondary,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          user?.isAdmin == true ? 'Administrador' : 'Usuário',
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: AppColors.primary,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    onPressed: () {
                      Navigator.pushNamed(context, AppRoutes.profile);
                    },
                    icon: Icon(
                      MdiIcons.chevronRight,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),

            // Settings Sections
            _buildSettingsSection(
              context,
              title: 'Notificações',
              items: [
                _SettingsItem(
                  icon: MdiIcons.bell,
                  title: 'Configurar Notificações',
                  subtitle: 'Gerencie alertas e lembretes',
                  onTap: () => Navigator.pushNamed(context, AppRoutes.notificationSettings),
                ),
                _SettingsItem(
                  icon: MdiIcons.bellAlert,
                  title: 'Histórico de Notificações',
                  subtitle: 'Veja notificações anteriores',
                  onTap: () => Navigator.pushNamed(context, AppRoutes.notifications),
                ),
              ],
            ),

            _buildSettingsSection(
              context,
              title: 'Aplicativo',
              items: [
                _SettingsItem(
                  icon: MdiIcons.palette,
                  title: AppStrings.appearance,
                  subtitle: 'Tema e personalização',
                  onTap: () => _showThemeDialog(context),
                ),
                _SettingsItem(
                  icon: MdiIcons.server,
                  title: 'Servidor',
                  subtitle: 'Configurar URL do servidor',
                  onTap: () => _showServerDialog(context),
                ),
                _SettingsItem(
                  icon: MdiIcons.refresh,
                  title: 'Sincronizar Dados',
                  subtitle: 'Atualizar dados do servidor',
                  onTap: () => _syncData(context, ref),
                ),
              ],
            ),

            _buildSettingsSection(
              context,
              title: 'Informações',
              items: [
                _SettingsItem(
                  icon: MdiIcons.informationOutline,
                  title: AppStrings.about,
                  subtitle: 'Sobre o ${AppStrings.appName}',
                  onTap: () => _showAboutDialog(context),
                ),
                _SettingsItem(
                  icon: MdiIcons.history,
                  title: 'Versão',
                  subtitle: 'v${AppStrings.appVersion}',
                  trailing: const SizedBox(),
                ),
              ],
            ),

            // Logout Section
            Container(
              margin: const EdgeInsets.all(16),
              child: SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  onPressed: () => _showLogoutDialog(context, ref),
                  icon: Icon(MdiIcons.logout, color: AppColors.error),
                  label: Text(
                    AppStrings.logout,
                    style: TextStyle(color: AppColors.error),
                  ),
                  style: OutlinedButton.styleFrom(
                    side: BorderSide(color: AppColors.error),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                ),
              ),
            ),

            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildSettingsSection(
    BuildContext context, {
    required String title,
    required List<_SettingsItem> items,
  }) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppColors.cardShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 12),
            child: Text(
              title,
              style: Theme.of(context).textTheme.titleSmall?.copyWith(
                fontWeight: FontWeight.w600,
                color: AppColors.textSecondary,
              ),
            ),
          ),
          ...items.asMap().entries.map((entry) {
            final index = entry.key;
            final item = entry.value;
            final isLast = index == items.length - 1;

            return Column(
              children: [
                ListTile(
                  onTap: item.onTap,
                  leading: Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Icon(
                      item.icon,
                      color: AppColors.primary,
                      size: 20,
                    ),
                  ),
                  title: Text(
                    item.title,
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      fontWeight: FontWeight.w500,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  subtitle: item.subtitle != null
                      ? Text(
                          item.subtitle!,
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: AppColors.textSecondary,
                          ),
                        )
                      : null,
                  trailing: item.trailing ??
                      Icon(
                        MdiIcons.chevronRight,
                        color: AppColors.textTertiary,
                        size: 20,
                      ),
                ),
                if (!isLast)
                  Divider(
                    height: 1,
                    indent: 76,
                    endIndent: 20,
                    color: AppColors.grey200,
                  ),
              ],
            );
          }),
        ],
      ),
    );
  }

  void _showThemeDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Tema do Aplicativo'),
        content: const Text('Configuração de tema será implementada em breve.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  void _showServerDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Configurar Servidor'),
        content: const Text('Configuração de servidor será implementada em breve.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  void _syncData(BuildContext context, WidgetRef ref) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Sincronizando dados...')),
    );
  }

  void _showAboutDialog(BuildContext context) {
    showAboutDialog(
      context: context,
      applicationName: AppStrings.appName,
      applicationVersion: AppStrings.appVersion,
      applicationIcon: Container(
        width: 60,
        height: 60,
        decoration: BoxDecoration(
          gradient: AppColors.primaryGradient,
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Icon(
          Icons.business,
          color: AppColors.white,
          size: 30,
        ),
      ),
      children: [
        const Text('Aplicativo de gestão empresarial da FHD Automação Industrial.'),
        const SizedBox(height: 16),
        const Text('Desenvolvido para facilitar o controle de boletos, orçamentos e clientes.'),
      ],
    );
  }

  void _showLogoutDialog(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Sair do aplicativo'),
        content: const Text('Tem certeza que deseja sair?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar'),
          ),
          FilledButton(
            onPressed: () {
              Navigator.pop(context);
              ref.read(authProvider.notifier).logout();
              Navigator.pushReplacementNamed(context, AppRoutes.login);
            },
            style: FilledButton.styleFrom(
              backgroundColor: AppColors.error,
            ),
            child: const Text('Sair'),
          ),
        ],
      ),
    );
  }
}

class _SettingsItem {
  final IconData icon;
  final String title;
  final String? subtitle;
  final VoidCallback? onTap;
  final Widget? trailing;

  const _SettingsItem({
    required this.icon,
    required this.title,
    this.subtitle,
    this.onTap,
    this.trailing,
  });
}