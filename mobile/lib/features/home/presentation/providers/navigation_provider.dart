import 'package:flutter_riverpod/flutter_riverpod.dart';

final navigationProvider = StateNotifierProvider<NavigationNotifier, int>((ref) {
  return NavigationNotifier();
});

class NavigationNotifier extends StateNotifier<int> {
  NavigationNotifier() : super(0);

  void setIndex(int index) {
    state = index;
  }

  void navigateToDashboard() => setIndex(0);
  void navigateToBills() => setIndex(1);
  void navigateToQuotations() => setIndex(2);
  void navigateToClients() => setIndex(3);
  void navigateToSettings() => setIndex(4);
}