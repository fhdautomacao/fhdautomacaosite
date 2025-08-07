import 'package:flutter/material.dart';

class QuotationDetailsPage extends StatelessWidget {
  final String quotationId;

  const QuotationDetailsPage({super.key, required this.quotationId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Detalhes do Orçamento')),
      body: const Center(child: Text('Em desenvolvimento')),
    );
  }
}