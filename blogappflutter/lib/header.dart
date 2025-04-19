import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'auth_provider.dart';

class Header extends StatefulWidget {
  @override
  _HeaderState createState() => _HeaderState();
}

class _HeaderState extends State<Header> {
  bool isMenuOpen = false;

  void toggleMenu() {
    setState(() {
      isMenuOpen = !isMenuOpen;
    });
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);

    return Container(
      color: Colors.white,
      width: double.infinity,
      padding: EdgeInsets.all(16),
      child: Column(
        children: [
          // Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Logo
              GestureDetector(
                onTap: () {
                  Navigator.pushNamed(context, '/');
                },
                child: Text(
                  'Nova',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.purple,
                    background: Paint()
                      ..shader = LinearGradient(
                        colors: [Colors.purple, Colors.pink],
                      ).createShader(Rect.fromLTWH(0.0, 0.0, 200.0, 70.0)),
                  ),
                ),
              ),

              // Desktop Navigation & Actions
              if (!isMenuOpen) ...[
                // Desktop Navigation
                Row(
                  children: [
                    NavigationItem(title: 'Products', route: '/products'),
                    NavigationItem(title: 'Solutions', route: '/solutions'),
                    NavigationItem(title: 'Resources', route: '/resources'),
                    NavigationItem(title: 'Pricing', route: '/pricing'),
                  ],
                ),

                // Desktop Actions
                Row(
                  children: [
                    IconButton(onPressed: () {}, icon: Icon(Icons.search)),
                    IconButton(onPressed: () {}, icon: Icon(Icons.notifications)),
                    IconButton(onPressed: () {}, icon: Icon(Icons.settings)),
                    ElevatedButton(
                      onPressed: () => authProvider.logout(),
                      child: Text('Logout'),
                    ),
                  ],
                ),
              ],

              // Mobile Menu Button
              IconButton(
                onPressed: toggleMenu,
                icon: Icon(isMenuOpen ? Icons.close : Icons.menu),
              ),
            ],
          ),

          // Mobile Navigation Menu
          if (isMenuOpen) ...[
            Column(
              children: [
                NavigationItem(title: 'Products', route: '/products'),
                NavigationItem(title: 'Solutions', route: '/solutions'),
                NavigationItem(title: 'Resources', route: '/resources'),
                NavigationItem(title: 'Pricing', route: '/pricing'),
                Row(
                  children: [
                    IconButton(onPressed: () {}, icon: Icon(Icons.search)),
                    IconButton(onPressed: () {}, icon: Icon(Icons.notifications)),
                    IconButton(onPressed: () {}, icon: Icon(Icons.settings)),
                  ],
                ),
                ElevatedButton(
                  onPressed: () => authProvider.logout(),
                  child: Text('Logout'),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}

class NavigationItem extends StatelessWidget {
  final String title;
  final String route;

  const NavigationItem({
    required this.title,
    required this.route,
  });

  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: () {
        Navigator.pushNamed(context, route);
      },
      child: Text(
        title,
        style: TextStyle(color: Colors.grey),
      ),
    );
  }
}
