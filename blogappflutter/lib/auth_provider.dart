import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:jwt_decoder/jwt_decoder.dart';

class AuthProvider with ChangeNotifier {
  Map<String, dynamic>? _authTokens; // Store tokens
  Map<String, dynamic>? _user; // Store user data
  bool _loading = true;

  bool get loading => _loading;
  Map<String, dynamic>? get user => _user;
  Map<String, dynamic>? get authTokens => _authTokens;

  // Add the isAuthenticated getter
  bool get isAuthenticated => _authTokens != null && _user != null;

  AuthProvider() {
    _initializeAuth();
  }

  // Initialize authentication state
  Future<void> _initializeAuth() async {
    final prefs = await SharedPreferences.getInstance();
    final authTokensString = prefs.getString('authTokens');

    if (authTokensString != null) {
      final tokens = json.decode(authTokensString);
      _authTokens = tokens;
      _user = JwtDecoder.decode(tokens['access']);
      await _refreshToken(); // Refresh tokens at start
    }

    _loading = false;
    notifyListeners();
  }

  // Login user
  Future<bool> loginUser(String username, String password) async {
    try {
      final response = await http.post(
        Uri.parse('http://127.0.0.1:8000/api/auth/jwt/create/'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'username': username, 'password': password}),
      );

      if (response.statusCode == 200) {
        final tokens = json.decode(response.body);
        _authTokens = tokens;
        _user = JwtDecoder.decode(tokens['access']);

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('authTokens', json.encode(tokens));

        notifyListeners();
        return true;
      }
    } catch (e) {
      print('Login failed: $e');
    }
    return false;
  }

  // Logout user
  Future<void> logoutUser() async {
    _authTokens = null;
    _user = null;

    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('authTokens');

    notifyListeners();
  }

  // Signup user
  Future<bool> signupUser(String username, String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('http://127.0.0.1:8000/api/auth/users/'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'username': username,
          'email': email,
          'password': password,
        }),
      );

      if (response.statusCode == 201) {
        return true;
      }
    } catch (e) {
      print('Signup failed: $e');
    }
    return false;
  }

  // Refresh token
  Future<void> _refreshToken() async {
    if (_authTokens == null) return;

    try {
      final response = await http.post(
        Uri.parse('http://127.0.0.1:8000/api/auth/jwt/refresh/'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'refresh': _authTokens!['refresh']}),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        _authTokens!['access'] = data['access'];
        _user = JwtDecoder.decode(data['access']);

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('authTokens', json.encode(_authTokens));

        notifyListeners();
      } else {
        await logoutUser();
      }
    } catch (e) {
      await logoutUser();
    }
  }

  // Schedule token refresh every 4 minutes
  void scheduleTokenRefresh() {
    Future.delayed(Duration(minutes: 4), () async {
      if (_authTokens != null) {
        await _refreshToken();
        scheduleTokenRefresh();
      }
    });
  }
}
