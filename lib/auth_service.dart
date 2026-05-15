import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

import 'package:ubi_container_new/config.dart';

class AuthService {
  static const String baseUrl = Config.backendUrl; 
  static String? _authToken; 
  static final ValueNotifier<bool> isAuthenticatedNotifier = ValueNotifier<bool>(false);

  static String? getToken() => _authToken;

  static Future<void> init() async {
    debugPrint('DEBUG AuthService: [INIT] Iniciando AuthService...');
    await loadToken();
    debugPrint('DEBUG AuthService: [INIT] AuthService inicializado. Token presente: ${isAuthenticatedNotifier.value}');
  }

  static Future<void> loadToken() async {
    debugPrint('DEBUG AuthService: [LOAD] Intentando cargar token de SharedPreferences...');
    final prefs = await SharedPreferences.getInstance();
    _authToken = prefs.getString('access_token');
    isAuthenticatedNotifier.value = _authToken != null;
    debugPrint('DEBUG AuthService: [LOAD] Token cargado: ${_authToken != null ? _authToken!.substring(0, 10) + '...' : "NULO"} (¿existe? ${isAuthenticatedNotifier.value})');
  }

  static Future<void> saveToken(String token) async {
    debugPrint('DEBUG AuthService: [SAVE] Intentando guardar token en SharedPreferences...');
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('access_token', token);
    _authToken = token;
    isAuthenticatedNotifier.value = true;
    debugPrint('DEBUG AuthService: [SAVE] Token guardado: ${_authToken!.substring(0, 10)}.... isAuthenticatedNotifier.value: ${isAuthenticatedNotifier.value}');
  }

  static Future<void> deleteToken() async {
    debugPrint('DEBUG AuthService: [DELETE] Intentando eliminar token de SharedPreferences...');
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('access_token');
    _authToken = null;
    isAuthenticatedNotifier.value = false;
    debugPrint('DEBUG AuthService: [DELETE] Token eliminado. isAuthenticatedNotifier.value: ${isAuthenticatedNotifier.value}');
  }

  static Future<http.Response> getAuthenticated(String path, {Map<String, String>? queryParameters}) async {
    debugPrint('DEBUG AuthService: [GET_AUTH] Solicitud GET autenticada para: $path');
    await loadToken();
    
    if (_authToken == null) {
      debugPrint('DEBUG AuthService: [GET_AUTH] No hay token de autenticación disponible para $path. Retornando 401.');
      return http.Response('Unauthorized', 401);
    }

    final uri = Uri.parse('$baseUrl$path').replace(queryParameters: queryParameters);
    debugPrint('DEBUG AuthService: [GET_AUTH] Realizando GET autenticado a: $uri con Token: ${_authToken!.substring(0, 10)}...'); 
    
    final response = await http.get(
      uri,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $_authToken',
        'ngrok-skip-browser-warning': 'true',
      },
    );
    _handleAuthResponse(response);
    debugPrint('DEBUG AuthService: [GET_AUTH] Respuesta para $path - Status: ${response.statusCode}, Body: ${response.body.length > 200 ? response.body.substring(0, 200) + '...' : response.body}');
    return response;
  }

  static Future<http.Response> postAuthenticated(String path, {Map<String, dynamic>? body}) async {
    debugPrint('DEBUG AuthService: [POST_AUTH] Solicitud POST autenticada para: $path');
    await loadToken();
    
    if (_authToken == null) {
      debugPrint('DEBUG AuthService: [POST_AUTH] No hay token de autenticación disponible para $path. Retornando 401.');
      return http.Response('Unauthorized', 401);
    }

    final uri = Uri.parse('$baseUrl$path');
    debugPrint('DEBUG AuthService: [POST_AUTH] Realizando POST autenticado a: $uri con Token: ${_authToken!.substring(0, 10)}... y cuerpo: ${json.encode(body)}');
    
    final response = await http.post(
      uri,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $_authToken',
        'ngrok-skip-browser-warning': 'true',
      },
      body: json.encode(body),
    );
    _handleAuthResponse(response);
    debugPrint('DEBUG AuthService: [POST_AUTH] Respuesta para $path - Status: ${response.statusCode}, Body: ${response.body.length > 200 ? response.body.substring(0, 200) + '...' : response.body}');
    return response;
  }

  static void _handleAuthResponse(http.Response response) {
    if (response.statusCode == 401) {
      debugPrint('DEBUG AuthService: [HANDLE_AUTH_RESP] Recibido 401 para solicitud. Posible token expirado/inválido. Token interno: ${_authToken != null ? _authToken!.substring(0, 10) + '...' : "NULO"}');
    }
  }
}
 *cascade08*cascade08 *cascade08*cascade08 *cascade08*cascade08 *cascade08*cascade08 *cascade08*cascade08 *cascade08*cascade08 *cascade08*cascade08% *cascade08%%*cascade08%. *cascade082Ffile: