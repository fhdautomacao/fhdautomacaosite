import 'package:flutter/material.dart';

class ClientDetailsPage extends StatelessWidget {
  final String clientId;

  const ClientDetailsPage({super.key, required this.clientId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Detalhes do Cliente')),
      body: const Center(child: Text('Em desenvolvimento')),
    );
  }
}