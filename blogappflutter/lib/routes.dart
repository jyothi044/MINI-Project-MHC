import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'auth_provider.dart';
import 'login_screen.dart';
import 'signup_screen.dart';
import 'splash_screen.dart';
import 'post_list_screen.dart';
import 'post_form_screen.dart';
import 'package:provider/provider.dart';

class AppRouter {
  static final router = GoRouter(
    initialLocation: '/login', // Login page is the initial route
    routes: [
      // Public routes
      GoRoute(
        path: '/login',
        builder: (context, state) => LoginScreen(),
      ),
      GoRoute(
        path: '/signup',
        builder: (context, state) => SignupScreen(),
      ),

      // Protected routes
      GoRoute(
        path: '/',
        builder: (context, state) => ProtectedRoute(child: SplashScreen()),
      ),
      GoRoute(
        path: '/stories',
        builder: (context, state) => ProtectedRoute(child: PostList()),
      ),
      GoRoute(
        path: '/create',
        builder: (context, state) => ProtectedRoute(child: PostFormScreen()),
      ),
      GoRoute(
        path: '/edit/:id',
        builder: (context, state) {
          final id = state.params['id']!;
          return ProtectedRoute(child: PostFormScreen(postId: id));
        },
      ),
    ],
    errorBuilder: (context, state) => Scaffold(
      body: Center(child: Text('Page not found')),
    ),
  );
}

class ProtectedRoute extends StatelessWidget {
  final Widget child;

  ProtectedRoute({required this.child});

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);

    // Check if the user is authenticated
    if (!authProvider.isAuthenticated) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        GoRouter.of(context).go('/login'); // Redirect to login if not authenticated
      });
      return Container(); // Show a placeholder while redirecting
    }

    return child;
  }
}
