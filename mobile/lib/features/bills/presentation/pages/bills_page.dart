import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';

import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/routes/app_routes.dart';
import '../providers/bills_provider.dart';

class BillsPage extends ConsumerStatefulWidget {
  const BillsPage({super.key});

  @override
  ConsumerState<BillsPage> createState() => _BillsPageState();
}

class _BillsPageState extends ConsumerState<BillsPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final billsState = ref.watch(billsProvider);

    // Carregar dados quando a página for montada
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (billsState.bills.isEmpty && !billsState.isLoading) {
        ref.read(billsProvider.notifier).loadBills();
      }
    });

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(AppStrings.billsTitle),
        automaticallyImplyLeading: false,
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Todos'),
            Tab(text: 'Pendentes'),
            Tab(text: 'Vencidos'),
            Tab(text: 'Pagos'),
          ],
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.textSecondary,
          indicatorColor: AppColors.primary,
        ),
      ),
      body: billsState.isLoading
          ? _buildLoadingState(context)
          : billsState.error != null
              ? _buildErrorState(context, billsState.error!)
              : TabBarView(
                  controller: _tabController,
                  children: [
                    _buildBillsList('all'),
                    _buildBillsList('pending'),
                    _buildBillsList('overdue'),
                    _buildBillsList('paid'),
                  ],
                ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.pushNamed(context, AppRoutes.createBill);
        },
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildBillsList(String status) {
    final billsState = ref.watch(billsProvider);
    final billsNotifier = ref.read(billsProvider.notifier);
    List<Map<String, dynamic>> bills;

    switch (status) {
      case 'all':
        bills = billsNotifier.allBills;
        break;
      case 'pending':
        bills = billsNotifier.pendingBills;
        break;
      case 'overdue':
        bills = billsNotifier.overdueBills;
        break;
      case 'paid':
        bills = billsNotifier.paidBills;
        break;
      default:
        bills = billsNotifier.allBills;
    }

    if (bills.isEmpty) {
      return _buildEmptyState(status);
    }

    return RefreshIndicator(
      onRefresh: () async {
        await ref.read(billsProvider.notifier).refreshBills();
      },
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: bills.length,
        itemBuilder: (context, index) {
          final bill = bills[index];
          return _buildBillCard(bill);
        },
      ),
    );
  }

  Widget _buildBillCard(Map<String, dynamic> bill) {
    final isOverdue = bill['status'] == 'overdue';
    final isPaid = bill['status'] == 'paid';

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppColors.cardShadow,
        border: isOverdue
            ? Border.all(color: AppColors.error.withOpacity(0.3))
            : null,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      bill['company'],
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      bill['description'],
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              _buildStatusBadge(bill['status']),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Icon(
                MdiIcons.currencyUsd,
                size: 16,
                color: AppColors.textSecondary,
              ),
              const SizedBox(width: 4),
              Text(
                'R\$ ${bill['amount']}',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w600,
                  color: isOverdue ? AppColors.error : AppColors.textPrimary,
                ),
              ),
              const Spacer(),
              Icon(
                MdiIcons.calendar,
                size: 16,
                color: AppColors.textSecondary,
              ),
              const SizedBox(width: 4),
              Text(
                bill['dueDate'],
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: isOverdue ? AppColors.error : AppColors.textSecondary,
                  fontWeight: isOverdue ? FontWeight.w500 : FontWeight.w400,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {
                    Navigator.pushNamed(
                      context,
                      AppRoutes.billDetails,
                      arguments: {'billId': bill['id']},
                    );
                  },
                  icon: Icon(MdiIcons.eye, size: 16),
                  label: const Text('Detalhes'),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: FilledButton.icon(
                  onPressed: () {
                    Navigator.pushNamed(
                      context,
                      AppRoutes.editBill,
                      arguments: {'billId': bill['id']},
                    );
                  },
                  icon: Icon(MdiIcons.pencil, size: 16),
                  label: const Text('Editar'),
                  style: FilledButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    Color color;
    String label;
    IconData icon;

    switch (status) {
      case 'pending':
        color = AppColors.warning;
        label = 'Pendente';
        icon = MdiIcons.clockOutline;
        break;
      case 'overdue':
        color = AppColors.error;
        label = 'Vencido';
        icon = MdiIcons.alertCircle;
        break;
      case 'paid':
        color = AppColors.success;
        label = 'Pago';
        icon = MdiIcons.checkCircle;
        break;
      default:
        color = AppColors.grey400;
        label = 'Indefinido';
        icon = MdiIcons.help;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: color),
          const SizedBox(width: 4),
          Text(
            label,
            style: Theme.of(context).textTheme.labelSmall?.copyWith(
              color: color,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState(String status) {
    String message;
    IconData icon;

    switch (status) {
      case 'pending':
        message = 'Nenhum boleto pendente';
        icon = MdiIcons.checkAll;
        break;
      case 'overdue':
        message = 'Nenhum boleto vencido';
        icon = MdiIcons.checkCircle;
        break;
      case 'paid':
        message = 'Nenhum boleto pago';
        icon = MdiIcons.fileDocumentOutline;
        break;
      default:
        message = 'Nenhum boleto encontrado';
        icon = MdiIcons.fileDocumentOutline;
    }

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            size: 64,
            color: AppColors.grey300,
          ),
          const SizedBox(height: 16),
          Text(
            message,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Toque no botão + para criar um novo boleto',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: AppColors.textTertiary,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }



  Widget _buildLoadingState(BuildContext context) {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CircularProgressIndicator(),
          SizedBox(height: 16),
          Text('Carregando boletos...'),
        ],
      ),
    );
  }

  Widget _buildErrorState(BuildContext context, String error) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            MdiIcons.alertCircle,
            color: AppColors.error,
            size: 48,
          ),
          const SizedBox(height: 16),
          Text(
            'Erro ao carregar boletos',
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
              ref.read(billsProvider.notifier).loadBills();
            },
            child: const Text('Tentar novamente'),
          ),
        ],
      ),
    );
  }
}