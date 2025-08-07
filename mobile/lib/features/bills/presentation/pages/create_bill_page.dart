import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';

class CreateBillPage extends StatelessWidget {
  final String? billId;

  const CreateBillPage({super.key, this.billId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(billId != null ? 'Editar Boleto' : 'Criar Boleto'),
      ),
      body: const Center(
        child: Text('Formulário de Boleto - Em desenvolvimento'),
      ),
    );
  }
}