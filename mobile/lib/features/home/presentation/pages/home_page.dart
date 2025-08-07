import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';

import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../dashboard/presentation/pages/dashboard_page.dart';
import '../../../bills/presentation/pages/bills_page.dart';
import '../../../quotations/presentation/pages/quotations_page.dart';
import '../../../clients/presentation/pages/clients_page.dart';
import '../../../settings/presentation/pages/settings_page.dart';
import '../providers/navigation_provider.dart';

class HomePage extends ConsumerWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedIndex = ref.watch(navigationProvider);

    return Scaffold(
      body: IndexedStack(
        index: selectedIndex,
        children: const [
          DashboardPage(),
          BillsPage(),
          QuotationsPage(),
          ClientsPage(),
          SettingsPage(),
        ],
      ),
      bottomNavigationBar: _buildBottomNavigationBar(context, ref, selectedIndex),
    );
  }

  Widget _buildBottomNavigationBar(BuildContext context, WidgetRef ref, int selectedIndex) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.white,
        boxShadow: [
          BoxShadow(
            color: AppColors.grey900.withOpacity(0.1),
            offset: const Offset(0, -1),
            blurRadius: 8,
            spreadRadius: 0,
          ),
        ],
      ),
      child: SafeArea(
        child: Container(
          height: 70,
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildNavItem(
                context: context,
                ref: ref,
                index: 0,
                icon: MdiIcons.viewDashboard,
                label: AppStrings.dashboard,
                isSelected: selectedIndex == 0,
              ),
              _buildNavItem(
                context: context,
                ref: ref,
                index: 1,
                icon: MdiIcons.fileDocumentOutline,
                label: AppStrings.bills,
                isSelected: selectedIndex == 1,
              ),
              _buildNavItem(
                context: context,
                ref: ref,
                index: 2,
                icon: MdiIcons.calculatorVariant,
                label: AppStrings.quotations,
                isSelected: selectedIndex == 2,
              ),
              _buildNavItem(
                context: context,
                ref: ref,
                index: 3,
                icon: MdiIcons.accountGroup,
                label: AppStrings.clients,
                isSelected: selectedIndex == 3,
              ),
              _buildNavItem(
                context: context,
                ref: ref,
                index: 4,
                icon: MdiIcons.cog,
                label: AppStrings.settings,
                isSelected: selectedIndex == 4,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem({
    required BuildContext context,
    required WidgetRef ref,
    required int index,
    required IconData icon,
    required String label,
    required bool isSelected,
  }) {
    return Expanded(
      child: GestureDetector(
        onTap: () => ref.read(navigationProvider.notifier).setIndex(index),
        behavior: HitTestBehavior.opaque,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 6),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.primary.withOpacity(0.1) : Colors.transparent,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                icon,
                size: 24,
                color: isSelected ? AppColors.primary : AppColors.grey400,
              ),
              const SizedBox(height: 4),
              Text(
                label,
                style: Theme.of(context).textTheme.labelSmall?.copyWith(
                  color: isSelected ? AppColors.primary : AppColors.grey400,
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }
}