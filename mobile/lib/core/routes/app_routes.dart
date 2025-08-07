import 'package:flutter/material.dart';

import '../../features/auth/presentation/pages/login_page.dart';
import '../../features/splash/presentation/pages/splash_page.dart';
import '../../features/home/presentation/pages/home_page.dart';
import '../../features/dashboard/presentation/pages/dashboard_page.dart';
import '../../features/bills/presentation/pages/bills_page.dart';
import '../../features/bills/presentation/pages/bill_details_page.dart';
import '../../features/bills/presentation/pages/create_bill_page.dart';
import '../../features/quotations/presentation/pages/quotations_page.dart';
import '../../features/quotations/presentation/pages/quotation_details_page.dart';
import '../../features/quotations/presentation/pages/create_quotation_page.dart';
import '../../features/clients/presentation/pages/clients_page.dart';
import '../../features/clients/presentation/pages/client_details_page.dart';
import '../../features/clients/presentation/pages/create_client_page.dart';
import '../../features/notifications/presentation/pages/notifications_page.dart';
import '../../features/notifications/presentation/pages/notification_settings_page.dart';
import '../../features/settings/presentation/pages/settings_page.dart';
import '../../features/settings/presentation/pages/profile_page.dart';

class AppRoutes {
  // Route names
  static const String splash = '/';
  static const String login = '/login';
  static const String home = '/home';
  static const String dashboard = '/dashboard';
  
  // Bills
  static const String bills = '/bills';
  static const String billDetails = '/bills/details';
  static const String createBill = '/bills/create';
  static const String editBill = '/bills/edit';
  
  // Quotations
  static const String quotations = '/quotations';
  static const String quotationDetails = '/quotations/details';
  static const String createQuotation = '/quotations/create';
  static const String editQuotation = '/quotations/edit';
  
  // Clients
  static const String clients = '/clients';
  static const String clientDetails = '/clients/details';
  static const String createClient = '/clients/create';
  static const String editClient = '/clients/edit';
  
  // Notifications
  static const String notifications = '/notifications';
  static const String notificationSettings = '/notifications/settings';
  
  // Settings
  static const String settings = '/settings';
  static const String profile = '/profile';
  
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case splash:
        return _buildRoute(const SplashPage());
        
      case login:
        return _buildRoute(const LoginPage());
        
      case home:
        return _buildRoute(const HomePage());
        
      case dashboard:
        return _buildRoute(const DashboardPage());
        
      // Bills routes
      case bills:
        return _buildRoute(const BillsPage());
        
      case billDetails:
        final args = settings.arguments as Map<String, dynamic>?;
        return _buildRoute(BillDetailsPage(
          billId: args?['billId'] ?? '',
        ));
        
      case createBill:
        return _buildRoute(const CreateBillPage());
        
      case editBill:
        final args = settings.arguments as Map<String, dynamic>?;
        return _buildRoute(CreateBillPage(
          billId: args?['billId'],
        ));
        
      // Quotations routes
      case quotations:
        return _buildRoute(const QuotationsPage());
        
      case quotationDetails:
        final args = settings.arguments as Map<String, dynamic>?;
        return _buildRoute(QuotationDetailsPage(
          quotationId: args?['quotationId'] ?? '',
        ));
        
      case createQuotation:
        return _buildRoute(const CreateQuotationPage());
        
      case editQuotation:
        final args = settings.arguments as Map<String, dynamic>?;
        return _buildRoute(CreateQuotationPage(
          quotationId: args?['quotationId'],
        ));
        
      // Clients routes
      case clients:
        return _buildRoute(const ClientsPage());
        
      case clientDetails:
        final args = settings.arguments as Map<String, dynamic>?;
        return _buildRoute(ClientDetailsPage(
          clientId: args?['clientId'] ?? '',
        ));
        
      case createClient:
        return _buildRoute(const CreateClientPage());
        
      case editClient:
        final args = settings.arguments as Map<String, dynamic>?;
        return _buildRoute(CreateClientPage(
          clientId: args?['clientId'],
        ));
        
      // Notifications routes
      case notifications:
        return _buildRoute(const NotificationsPage());
        
      case notificationSettings:
        return _buildRoute(const NotificationSettingsPage());
        
      // Settings routes
      case AppRoutes.settings:
        return _buildRoute(const SettingsPage());
        
      case profile:
        return _buildRoute(const ProfilePage());
        
      default:
        return _buildRoute(
          Scaffold(
            body: Center(
              child: Text('Route ${settings.name} not found'),
            ),
          ),
        );
    }
  }
  
  static PageRouteBuilder<dynamic> _buildRoute(Widget page) {
    return PageRouteBuilder<dynamic>(
      pageBuilder: (context, animation, secondaryAnimation) => page,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        const begin = Offset(1.0, 0.0);
        const end = Offset.zero;
        const curve = Curves.easeInOut;
        
        var tween = Tween(begin: begin, end: end).chain(
          CurveTween(curve: curve),
        );
        
        return SlideTransition(
          position: animation.drive(tween),
          child: child,
        );
      },
      transitionDuration: const Duration(milliseconds: 300),
    );
  }
}