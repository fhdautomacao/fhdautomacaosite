import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:path/path.dart' as path;

import '../../../../core/constants/app_colors.dart';
import '../../../../core/services/api_service.dart';
import '../../../../core/services/upload_service.dart';
import '../../../../widgets/payment_receipt_upload.dart';

class BillSelectionPage extends ConsumerStatefulWidget {
  final File? receivedPdf;
  final String? billId;
  final int? installmentNumber;

  const BillSelectionPage({
    super.key,
    this.receivedPdf,
    this.billId,
    this.installmentNumber,
  });

  @override
  ConsumerState<BillSelectionPage> createState() => _BillSelectionPageState();
}

class _BillSelectionPageState extends ConsumerState<BillSelectionPage> {
  List<Map<String, dynamic>> _bills = [];
  bool _isLoading = true;
  String? _error;
  Map<String, dynamic>? _selectedBill;
  Map<String, dynamic>? _selectedInstallment;
  bool _isUploading = false;
  bool _showCreateBillOption = false;

  @override
  void initState() {
    super.initState();
    _loadBills();
  }

  Future<void> _loadBills() async {
    try {
      setState(() {
        _isLoading = true;
        _error = null;
      });

      final response = await ApiService.getBills(status: 'pending');
      
      if (response.isSuccess) {
        setState(() {
          _bills = response.data!;
          _isLoading = false;
        });

        // Se há billId específico, selecionar automaticamente
        if (widget.billId != null) {
          _selectedBill = _bills.firstWhere(
            (bill) => bill['id'] == widget.billId,
            orElse: () => _bills.isNotEmpty ? _bills.first : {},
          );

          if (_selectedBill != null && widget.installmentNumber != null) {
            final installments = _selectedBill!['bill_installments'] as List<dynamic>? ?? [];
            _selectedInstallment = installments.firstWhere(
              (installment) => installment['installment_number'] == widget.installmentNumber,
              orElse: () => installments.isNotEmpty ? installments.first : {},
            );
          }
        }
      } else {
        setState(() {
          _error = response.error;
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Erro ao carregar boletos: $e';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Selecionar Boleto'),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        actions: [
          if (widget.receivedPdf != null)
            IconButton(
              icon: const Icon(Icons.add),
              onPressed: _showCreateBillDialog,
              tooltip: 'Criar Novo Boleto',
            ),
        ],
      ),
      body: _buildBody(),
      bottomNavigationBar: _buildBottomBar(),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    if (_error != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.error_outline,
              size: 64,
              color: Colors.red.shade300,
            ),
            const SizedBox(height: 16),
            Text(
              _error!,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _loadBills,
              child: const Text('Tentar Novamente'),
            ),
          ],
        ),
      );
    }

    return Column(
      children: [
        // Header com informações do PDF
        if (widget.receivedPdf != null) _buildPdfInfo(),
        
        // Opção para criar novo boleto
        if (widget.receivedPdf != null && !_showCreateBillOption) _buildCreateBillOption(),
        
        // Lista de boletos
        Expanded(
          child: _bills.isEmpty && widget.receivedPdf != null
              ? _buildEmptyState()
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _bills.length,
                  itemBuilder: (context, index) {
                    final bill = _bills[index];
                    return _buildBillCard(bill);
                  },
                ),
        ),
      ],
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.receipt_long,
            size: 64,
            color: Colors.grey.shade300,
          ),
          const SizedBox(height: 16),
          const Text(
            'Nenhum boleto pendente encontrado',
            style: TextStyle(fontSize: 16, color: Colors.grey),
          ),
          const SizedBox(height: 8),
          const Text(
            'Crie um novo boleto para fazer o upload do comprovante',
            style: TextStyle(fontSize: 14, color: Colors.grey),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildCreateBillOption() {
    return Container(
      margin: const EdgeInsets.all(16),
      child: Card(
        color: Colors.orange.shade50,
        child: InkWell(
          onTap: _showCreateBillDialog,
          borderRadius: BorderRadius.circular(12),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Icon(
                  Icons.add_circle_outline,
                  color: Colors.orange.shade700,
                  size: 32,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Não encontrou o boleto?',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: Colors.orange.shade700,
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Crie um novo boleto e faça o upload do comprovante',
                        style: TextStyle(
                          color: Colors.orange.shade600,
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ),
                Icon(
                  Icons.arrow_forward_ios,
                  color: Colors.orange.shade600,
                  size: 16,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPdfInfo() {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.blue.shade50,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.blue.shade200),
      ),
      child: Row(
        children: [
          Icon(
            Icons.picture_as_pdf,
            color: Colors.blue.shade700,
            size: 32,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'PDF Recebido',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.blue.shade700,
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  path.basename(widget.receivedPdf!.path),
                  style: TextStyle(
                    color: Colors.blue.shade600,
                    fontSize: 14,
                  ),
                ),
                Text(
                  'Tamanho: ${_formatFileSize(widget.receivedPdf!.lengthSync())}',
                  style: TextStyle(
                    color: Colors.blue.shade500,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBillCard(Map<String, dynamic> bill) {
    final isSelected = _selectedBill?['id'] == bill['id'];
    final installments = bill['bill_installments'] as List<dynamic>? ?? [];
    final pendingInstallments = installments.where((i) => i['status'] == 'pending').toList();

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: isSelected ? 4 : 2,
      color: isSelected ? AppColors.primary.withOpacity(0.1) : null,
      child: InkWell(
        onTap: () => _selectBill(bill),
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
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
                          bill['company_name'] ?? 'Empresa',
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Valor: ${_formatCurrency(bill['total_amount'])}',
                          style: TextStyle(
                            color: Colors.grey.shade600,
                            fontSize: 14,
                          ),
                        ),
                        Text(
                          'Parcelas: ${pendingInstallments.length} pendentes',
                          style: TextStyle(
                            color: Colors.grey.shade600,
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ),
                  if (isSelected)
                    Icon(
                      Icons.check_circle,
                      color: AppColors.primary,
                      size: 24,
                    ),
                ],
              ),
              
              // Mostrar parcelas se o boleto estiver selecionado
              if (isSelected && pendingInstallments.isNotEmpty) ...[
                const SizedBox(height: 12),
                const Divider(),
                const SizedBox(height: 8),
                Text(
                  'Selecione a parcela:',
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    color: Colors.grey.shade700,
                  ),
                ),
                const SizedBox(height: 8),
                ...pendingInstallments.map((installment) => _buildInstallmentTile(installment)),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInstallmentTile(Map<String, dynamic> installment) {
    final isSelected = _selectedInstallment?['id'] == installment['id'];
    
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: isSelected ? AppColors.primary.withOpacity(0.1) : Colors.grey.shade50,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: isSelected ? AppColors.primary : Colors.grey.shade300,
        ),
      ),
      child: ListTile(
        onTap: () => _selectInstallment(installment),
        leading: Icon(
          Icons.receipt,
          color: isSelected ? AppColors.primary : Colors.grey.shade600,
        ),
        title: Text(
          'Parcela ${installment['installment_number']}',
          style: TextStyle(
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          ),
        ),
        subtitle: Text(
          'Vencimento: ${_formatDate(installment['due_date'])} - ${_formatCurrency(installment['amount'])}',
        ),
        trailing: isSelected
            ? Icon(Icons.check_circle, color: AppColors.primary)
            : null,
      ),
    );
  }

  void _selectBill(Map<String, dynamic> bill) {
    setState(() {
      _selectedBill = bill;
      _selectedInstallment = null;
    });
  }

  void _selectInstallment(Map<String, dynamic> installment) {
    setState(() {
      _selectedInstallment = installment;
    });
  }

  // Mostrar diálogo para criar novo boleto
  void _showCreateBillDialog() {
    showDialog(
      context: context,
      builder: (context) => CreateBillDialog(
        onBillCreated: (newBill) {
          setState(() {
            _bills.insert(0, newBill);
            _selectedBill = newBill;
            _selectedInstallment = null;
          });
          
          // Fazer upload automático do PDF
          if (widget.receivedPdf != null) {
            _uploadToNewBill(newBill);
          }
        },
      ),
    );
  }

  // Upload para boleto recém-criado
  Future<void> _uploadToNewBill(Map<String, dynamic> newBill) async {
    if (widget.receivedPdf == null) return;

    try {
      setState(() {
        _isUploading = true;
      });

      // Aguardar um pouco para garantir que o boleto foi criado
      await Future.delayed(const Duration(seconds: 1));

      final installments = newBill['bill_installments'] as List<dynamic>? ?? [];
      if (installments.isNotEmpty) {
        // Selecionar a parcela mais recente (última a vencer)
        final selectedInstallment = _selectMostRecentInstallment(installments);
        
        if (selectedInstallment != null) {
          final uploadResult = await UploadService.uploadPaymentReceipt(
            billId: newBill['id'],
            installmentNumber: selectedInstallment['installment_number'],
            file: widget.receivedPdf!,
          );

          if (uploadResult.success) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('Boleto criado e comprovante enviado para a parcela ${selectedInstallment['installment_number']}!'),
                backgroundColor: Colors.green,
              ),
            );
            
            Navigator.of(context).pop();
          } else {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('Boleto criado, mas erro ao enviar comprovante: ${uploadResult.error}'),
                backgroundColor: Colors.orange,
              ),
            );
          }
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Boleto criado, mas não foi possível selecionar uma parcela'),
              backgroundColor: Colors.orange,
            ),
          );
        }
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Erro ao processar: $e'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      setState(() {
        _isUploading = false;
      });
    }
  }

  // Selecionar a parcela mais recente (última a vencer)
  Map<String, dynamic>? _selectMostRecentInstallment(List<dynamic> installments) {
    if (installments.isEmpty) return null;

    // Filtrar apenas parcelas pendentes
    final pendingInstallments = installments.where((i) => i['status'] == 'pending').toList();
    
    if (pendingInstallments.isEmpty) return null;

    // Ordenar por data de vencimento (mais recente primeiro)
    pendingInstallments.sort((a, b) {
      final dateA = DateTime.parse(a['due_date']);
      final dateB = DateTime.parse(b['due_date']);
      return dateB.compareTo(dateA); // Ordem decrescente (mais recente primeiro)
    });

    // Retornar a primeira (mais recente)
    return pendingInstallments.first;
  }

  // Upload do PDF recebido
  Future<void> _uploadReceivedPdf() async {
    if (widget.receivedPdf == null || _selectedInstallment == null) {
      return;
    }

    try {
      setState(() {
        _isUploading = true;
      });

      final uploadResult = await UploadService.uploadPaymentReceipt(
        billId: _selectedBill!['id'],
        installmentNumber: _selectedInstallment!['installment_number'],
        file: widget.receivedPdf!,
      );

      if (uploadResult.success) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Comprovante enviado com sucesso!'),
            backgroundColor: Colors.green,
          ),
        );
        
        // Navegar de volta
        Navigator.of(context).pop();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erro ao enviar: ${uploadResult.error}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Erro ao enviar comprovante: $e'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      setState(() {
        _isUploading = false;
      });
    }
  }

  String _formatCurrency(dynamic amount) {
    if (amount == null) return 'R\$ 0,00';
    try {
      final value = double.parse(amount.toString());
      return 'R\$ ${value.toStringAsFixed(2).replaceAll('.', ',')}';
    } catch (e) {
      return 'R\$ 0,00';
    }
  }

  String _formatDate(String? dateString) {
    if (dateString == null) return 'N/A';
    try {
      final date = DateTime.parse(dateString);
      return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';
    } catch (e) {
      return 'Data inválida';
    }
  }

  String _formatFileSize(int bytes) {
    if (bytes < 1024) return '$bytes B';
    if (bytes < 1024 * 1024) return '${(bytes / 1024).toStringAsFixed(1)} KB';
    return '${(bytes / (1024 * 1024)).toStringAsFixed(1)} MB';
  }

  Widget _buildBottomBar() {
    if (_selectedInstallment == null) {
      return null;
    }

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        child: SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: _isUploading ? null : _uploadReceivedPdf,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 16),
            ),
            child: _isUploading
                ? const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      ),
                      SizedBox(width: 12),
                      Text('Enviando...'),
                    ],
                  )
                : const Text('Enviar Comprovante'),
          ),
        ),
      ),
    );
  }
}

// Diálogo para criar novo boleto
class CreateBillDialog extends StatefulWidget {
  final Function(Map<String, dynamic>) onBillCreated;

  const CreateBillDialog({
    super.key,
    required this.onBillCreated,
  });

  @override
  State<CreateBillDialog> createState() => _CreateBillDialogState();
}

class _CreateBillDialogState extends State<CreateBillDialog> {
  final _formKey = GlobalKey<FormState>();
  final _companyController = TextEditingController();
  final _amountController = TextEditingController();
  final _installmentsController = TextEditingController();
  final _dueDateController = TextEditingController();
  bool _isCreating = false;
  List<Map<String, dynamic>> _previewInstallments = [];

  @override
  void initState() {
    super.initState();
    _dueDateController.text = _formatDate(DateTime.now());
    _installmentsController.text = '1';
    _updatePreview();
    
    // Adicionar listeners para atualizar preview
    _amountController.addListener(_updatePreview);
    _installmentsController.addListener(_updatePreview);
    _dueDateController.addListener(_updatePreview);
  }

  void _updatePreview() {
    if (_amountController.text.isNotEmpty && 
        _installmentsController.text.isNotEmpty && 
        _dueDateController.text.isNotEmpty) {
      
      try {
        final amount = double.parse(_amountController.text.replaceAll(',', '.'));
        final installments = int.parse(_installmentsController.text);
        final dueDate = DateTime.parse(_dueDateController.text.split('/').reversed.join('-'));
        
        if (amount > 0 && installments > 0) {
          final installmentAmount = amount / installments;
          final preview = <Map<String, dynamic>>[];
          
          for (int i = 1; i <= installments; i++) {
            final installmentDate = DateTime(
              dueDate.year,
              dueDate.month + (i - 1),
              dueDate.day,
            );
            
            preview.add({
              'installment_number': i,
              'amount': installmentAmount,
              'due_date': installmentDate.toIso8601String(),
              'status': 'pending',
            });
          }
          
          setState(() {
            _previewInstallments = preview;
          });
        }
      } catch (e) {
        // Ignorar erros de parsing
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Criar Novo Boleto'),
      content: Form(
        key: _formKey,
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextFormField(
                controller: _companyController,
                decoration: const InputDecoration(
                  labelText: 'Empresa',
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Digite o nome da empresa';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _amountController,
                decoration: const InputDecoration(
                  labelText: 'Valor Total',
                  border: OutlineInputBorder(),
                  prefixText: 'R\$ ',
                ),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Digite o valor';
                  }
                  if (double.tryParse(value.replaceAll(',', '.')) == null) {
                    return 'Digite um valor válido';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _installmentsController,
                decoration: const InputDecoration(
                  labelText: 'Número de Parcelas',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Digite o número de parcelas';
                  }
                  final installments = int.tryParse(value);
                  if (installments == null || installments < 1) {
                    return 'Digite um número válido';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _dueDateController,
                decoration: const InputDecoration(
                  labelText: 'Data do Primeiro Vencimento',
                  border: OutlineInputBorder(),
                ),
                readOnly: true,
                onTap: () async {
                  final date = await showDatePicker(
                    context: context,
                    initialDate: DateTime.now(),
                    firstDate: DateTime.now(),
                    lastDate: DateTime.now().add(const Duration(days: 365)),
                  );
                  if (date != null) {
                    _dueDateController.text = _formatDate(date);
                  }
                },
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Selecione a data';
                  }
                  return null;
                },
              ),
              
              // Prévia das parcelas
              if (_previewInstallments.isNotEmpty) ...[
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.blue.shade50,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.blue.shade200),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(
                            Icons.info_outline,
                            color: Colors.blue.shade700,
                            size: 20,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'Prévia das Parcelas',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: Colors.blue.shade700,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      ..._previewInstallments.map((installment) {
                        final isLast = installment['installment_number'] == _previewInstallments.length;
                        return Container(
                          margin: const EdgeInsets.only(bottom: 4),
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: isLast ? Colors.orange.shade100 : Colors.white,
                            borderRadius: BorderRadius.circular(4),
                            border: Border.all(
                              color: isLast ? Colors.orange.shade300 : Colors.grey.shade300,
                            ),
                          ),
                          child: Row(
                            children: [
                              Text(
                                'Parcela ${installment['installment_number']}:',
                                style: TextStyle(
                                  fontWeight: FontWeight.w500,
                                  color: isLast ? Colors.orange.shade700 : Colors.grey.shade700,
                                ),
                              ),
                              const Spacer(),
                              Text(
                                'R\$ ${(installment['amount'] as double).toStringAsFixed(2).replaceAll('.', ',')}',
                                style: TextStyle(
                                  fontWeight: FontWeight.w500,
                                  color: isLast ? Colors.orange.shade700 : Colors.grey.shade700,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                _formatDate(DateTime.parse(installment['due_date'])),
                                style: TextStyle(
                                  fontSize: 12,
                                  color: isLast ? Colors.orange.shade600 : Colors.grey.shade600,
                                ),
                              ),
                              if (isLast) ...[
                                const SizedBox(width: 4),
                                Icon(
                                  Icons.upload,
                                  size: 16,
                                  color: Colors.orange.shade600,
                                ),
                              ],
                            ],
                          ),
                        );
                      }),
                      if (_previewInstallments.length > 1) ...[
                        const SizedBox(height: 8),
                        Text(
                          'O comprovante será anexado à parcela mais recente (última a vencer)',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.blue.shade600,
                            fontStyle: FontStyle.italic,
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
      actions: [
        TextButton(
          onPressed: _isCreating ? null : () => Navigator.of(context).pop(),
          child: const Text('Cancelar'),
        ),
        ElevatedButton(
          onPressed: _isCreating ? null : _createBill,
          child: _isCreating
              ? const SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              : const Text('Criar'),
        ),
      ],
    );
  }

  Future<void> _createBill() async {
    if (!_formKey.currentState!.validate()) return;

    try {
      setState(() {
        _isCreating = true;
      });

      final amount = double.parse(_amountController.text.replaceAll(',', '.'));
      final installments = int.parse(_installmentsController.text);
      final dueDate = DateTime.parse(_dueDateController.text.split('/').reversed.join('-'));

      final response = await ApiService.createBill({
        'company_name': _companyController.text,
        'total_amount': amount,
        'installments': installments,
        'first_due_date': dueDate.toIso8601String(),
      });

      if (response.isSuccess) {
        widget.onBillCreated(response.data!);
        Navigator.of(context).pop();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erro ao criar boleto: ${response.error}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Erro ao criar boleto: $e'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      setState(() {
        _isCreating = false;
      });
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';
  }

  @override
  void dispose() {
    _companyController.dispose();
    _amountController.dispose();
    _installmentsController.dispose();
    _dueDateController.dispose();
    super.dispose();
  }
}
