import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';

class BillDetailsPage extends StatelessWidget {
  final String billId;

  const BillDetailsPage({super.key, required this.billId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Detalhes do Boleto'),
      ),
      body: const Center(
        child: Text('Detalhes do Boleto - Em desenvolvimento'),
      ),
    );
  }
}