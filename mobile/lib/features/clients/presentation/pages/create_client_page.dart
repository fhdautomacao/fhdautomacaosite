import 'package:flutter/material.dart';

class CreateClientPage extends StatelessWidget {
  final String? clientId;

  const CreateClientPage({super.key, this.clientId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(clientId != null ? 'Editar Cliente' : 'Criar Cliente')),
      body: const Center(child: Text('Em desenvolvimento')),
    );
  }
}