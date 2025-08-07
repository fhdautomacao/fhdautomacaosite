import 'package:flutter/material.dart';

class CreateQuotationPage extends StatelessWidget {
  final String? quotationId;

  const CreateQuotationPage({super.key, this.quotationId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(quotationId != null ? 'Editar Orçamento' : 'Criar Orçamento')),
      body: const Center(child: Text('Em desenvolvimento')),
    );
  }
}