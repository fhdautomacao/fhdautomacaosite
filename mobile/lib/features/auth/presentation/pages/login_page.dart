import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/routes/app_routes.dart';
import '../providers/auth_provider.dart';

class LoginPage extends ConsumerStatefulWidget {
  const LoginPage({super.key});

  @override
  ConsumerState<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends ConsumerState<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);

    // Navegar para home se login for bem-sucedido
    ref.listen<AuthState>(authProvider, (previous, current) {
      if (current.isLoggedIn && previous?.isLoggedIn != true) {
        Navigator.of(context).pushReplacementNamed(AppRoutes.home);
      }
    });

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 40),

                // Logo e título
                _buildHeader(),

                const SizedBox(height: 60),

                // Formulário de login
                _buildLoginForm(authState),

                const SizedBox(height: 32),

                // Botão de login
                _buildLoginButton(authState),

                const SizedBox(height: 24),

                // Link de esqueci a senha
                _buildForgotPasswordLink(),

                const SizedBox(height: 40),

                // Informações de desenvolvimento
                _buildDevInfo(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Column(
      children: [
        // Logo
        Container(
          width: 100,
          height: 100,
          decoration: BoxDecoration(
            gradient: AppColors.primaryGradient,
            borderRadius: BorderRadius.circular(20),
            boxShadow: AppColors.cardShadow,
          ),
          child: const Icon(
            Icons.business,
            size: 50,
            color: AppColors.white,
          ),
        )
            .animate()
            .scale(delay: 200.ms, duration: 600.ms, curve: Curves.elasticOut)
            .fadeIn(delay: 200.ms, duration: 600.ms),

        const SizedBox(height: 24),

        // Título
        Text(
          AppStrings.welcome,
          style: Theme.of(context).textTheme.displaySmall?.copyWith(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.w700,
          ),
          textAlign: TextAlign.center,
        )
            .animate()
            .slideY(begin: 0.3, delay: 400.ms, duration: 600.ms, curve: Curves.easeOut)
            .fadeIn(delay: 400.ms, duration: 600.ms),

        const SizedBox(height: 8),

        // Subtítulo
        Text(
          AppStrings.loginSubtitle,
          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
            color: AppColors.textSecondary,
          ),
          textAlign: TextAlign.center,
        )
            .animate()
            .slideY(begin: 0.3, delay: 600.ms, duration: 600.ms, curve: Curves.easeOut)
            .fadeIn(delay: 600.ms, duration: 600.ms),
      ],
    );
  }

  Widget _buildLoginForm(AuthState authState) {
    return Column(
      children: [
        // Campo de email
        TextFormField(
          controller: _emailController,
          keyboardType: TextInputType.emailAddress,
          textInputAction: TextInputAction.next,
          decoration: InputDecoration(
            labelText: AppStrings.email,
            prefixIcon: const Icon(Icons.email_outlined),
            errorText: authState.error,
          ),
          validator: (value) {
            if (value == null || value.isEmpty) {
              return AppStrings.fieldRequired;
            }
            if (!value.contains('@')) {
              return AppStrings.invalidEmail;
            }
            return null;
          },
        )
            .animate()
            .slideY(begin: 0.3, delay: 800.ms, duration: 600.ms, curve: Curves.easeOut)
            .fadeIn(delay: 800.ms, duration: 600.ms),

        const SizedBox(height: 16),

        // Campo de senha
        TextFormField(
          controller: _passwordController,
          obscureText: _obscurePassword,
          textInputAction: TextInputAction.done,
          onFieldSubmitted: (_) => _handleLogin(),
          decoration: InputDecoration(
            labelText: AppStrings.password,
            prefixIcon: const Icon(Icons.lock_outlined),
            suffixIcon: IconButton(
              icon: Icon(
                _obscurePassword ? Icons.visibility_outlined : Icons.visibility_off_outlined,
              ),
              onPressed: () {
                setState(() {
                  _obscurePassword = !_obscurePassword;
                });
              },
            ),
          ),
          validator: (value) {
            if (value == null || value.isEmpty) {
              return AppStrings.fieldRequired;
            }
            if (value.length < 3) {
              return AppStrings.passwordTooShort;
            }
            return null;
          },
        )
            .animate()
            .slideY(begin: 0.3, delay: 1000.ms, duration: 600.ms, curve: Curves.easeOut)
            .fadeIn(delay: 1000.ms, duration: 600.ms),
      ],
    );
  }

  Widget _buildLoginButton(AuthState authState) {
    return FilledButton(
      onPressed: authState.isLoading ? null : _handleLogin,
      style: FilledButton.styleFrom(
        padding: const EdgeInsets.symmetric(vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
      child: authState.isLoading
          ? const SizedBox(
              height: 20,
              width: 20,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                valueColor: AlwaysStoppedAnimation<Color>(AppColors.white),
              ),
            )
          : Text(
              AppStrings.login,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
    )
        .animate()
        .slideY(begin: 0.3, delay: 1200.ms, duration: 600.ms, curve: Curves.easeOut)
        .fadeIn(delay: 1200.ms, duration: 600.ms);
  }

  Widget _buildForgotPasswordLink() {
    return TextButton(
      onPressed: () {
        _showForgotPasswordDialog();
      },
      child: Text(
        AppStrings.forgotPassword,
        style: TextStyle(
          color: AppColors.primary,
          fontWeight: FontWeight.w500,
        ),
      ),
    )
        .animate()
        .slideY(begin: 0.3, delay: 1400.ms, duration: 600.ms, curve: Curves.easeOut)
        .fadeIn(delay: 1400.ms, duration: 600.ms);
  }

  Widget _buildDevInfo() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.grey50,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.grey200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Credenciais de Desenvolvimento:',
            style: Theme.of(context).textTheme.titleSmall?.copyWith(
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 8),
          _buildCredentialRow('Admin:', 'adminfhd@fhd.com', 'admin123'),
          _buildCredentialRow('Usuário:', 'fhduser@fhd.com', 'user123'),
        ],
      ),
    )
        .animate()
        .slideY(begin: 0.3, delay: 1600.ms, duration: 600.ms, curve: Curves.easeOut)
        .fadeIn(delay: 1600.ms, duration: 600.ms);
  }

  Widget _buildCredentialRow(String title, String email, String password) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Row(
        children: [
          SizedBox(
            width: 60,
            child: Text(
              title,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                fontWeight: FontWeight.w500,
                color: AppColors.textSecondary,
              ),
            ),
          ),
          Expanded(
            child: Text(
              '$email / $password',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                fontFamily: 'monospace',
                color: AppColors.textTertiary,
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _handleLogin() {
    if (_formKey.currentState?.validate() ?? false) {
      final email = _emailController.text.trim();
      final password = _passwordController.text;

      ref.read(authProvider.notifier).login(email, password);
    }
  }

  void _showForgotPasswordDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Esqueci minha senha'),
        content: const Text(
          'Entre em contato com o administrador do sistema para recuperar sua senha.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }
}