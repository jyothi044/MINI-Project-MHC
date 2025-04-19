import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static const String _baseUrl = 'http://127.0.0.1:8000/api/';

  // Perform GET request
  static Future<http.Response> getRequest(String endpoint) async {
    final headers = await _getAuthHeaders();
    final url = Uri.parse('$_baseUrl$endpoint');
    return http.get(url, headers: headers);
  }

  // Perform POST request
  static Future<http.Response> postRequest(String endpoint, Map<String, dynamic> body) async {
    final headers = await _getAuthHeaders();
    final url = Uri.parse('$_baseUrl$endpoint');
    return http.post(url, headers: headers, body: json.encode(body));
  }

  // Perform PUT request
  static Future<http.Response> putRequest(String endpoint, Map<String, dynamic> body) async {
    final headers = await _getAuthHeaders();
    final url = Uri.parse('$_baseUrl$endpoint');
    return http.put(url, headers: headers, body: json.encode(body));
  }

  // Intercept headers and handle tokens
  static Future<Map<String, String>> _getAuthHeaders() async {
    final prefs = await SharedPreferences.getInstance();
    final String? authTokens = prefs.getString('authTokens');

    if (authTokens != null) {
      final Map<String, dynamic> tokens = json.decode(authTokens);
      return {
        'Authorization': 'Bearer ${tokens['access']}',
        'Content-Type': 'application/json',
      };
    }
    return {
      'Content-Type': 'application/json',
    };
  }

  // Intercept errors and refresh tokens if necessary
  static Future<http.Response> handleRequestWithRetry(
      Future<http.Response> Function() request) async {
    try {
      final response = await request();
      if (response.statusCode == 401) {
        final isRefreshed = await _refreshTokens();
        if (isRefreshed) {
          return request();
        } else {
          _clearTokens();
          throw Exception('Session expired. Please login again.');
        }
      }
      return response;
    } catch (e) {
      rethrow;
    }
  }

  // Refresh tokens
  static Future<bool> _refreshTokens() async {
    final prefs = await SharedPreferences.getInstance();
    final String? authTokens = prefs.getString('authTokens');

    if (authTokens != null) {
      final Map<String, dynamic> tokens = json.decode(authTokens);

      try {
        final url = Uri.parse('$_baseUrl/auth/jwt/refresh/');
        final response = await http.post(url, body: json.encode({
          'refresh': tokens['refresh'],
        }), headers: {
          'Content-Type': 'application/json',
        });

        if (response.statusCode == 200) {
          final Map<String, dynamic> data = json.decode(response.body);
          tokens['access'] = data['access'];
          await prefs.setString('authTokens', json.encode(tokens));
          return true;
        }
      } catch (e) {
        // Token refresh failed
        return false;
      }
    }
    return false;
  }

  // Clear tokens and redirect to login
  static Future<void> _clearTokens() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('authTokens');
    // Redirect to login (use Navigator or other routing mechanism)
  }
}
