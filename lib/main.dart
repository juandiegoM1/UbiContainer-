import 'package:flutter/material.dart';
import 'package:ubi_container_new/welcome_screen.dart'; 
import 'package:ubi_container_new/auth_service.dart'; 

import 'package:ubi_container_new/services/report_queue_service.dart';

import 'package:ubi_container_new/map_screen.dart' as mapScreen;


void main() async {
  // Asegura que los bindings de Flutter estén inicializados
  WidgetsFlutterBinding.ensureInitialized();
  debugPrint('DEBUG main: WidgetsFlutterBinding inicializado.');

  // Inicializa AuthService (carga el token si existe)
  await AuthService.init();
  debugPrint('DEBUG main: AuthService inicializado.');

  // Inicializa el ReportQueueService.
  // Al simplemente acceder a ella, su constructor (_init) se ejecuta.
  reportQueueService; 
  debugPrint('DEBUG main: ReportQueueService inicializado.');

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key}); 

  @override
  Widget build(BuildContext context) {
    debugPrint('DEBUG main: MyApp construyendo.');
    return MaterialApp(
      debugShowCheckedModeBanner: false, 
      title: 'UbiContainer', 
      theme: ThemeData(
        primarySwatch: Colors.blue, 
      ),
      home: const WelcomeScreen(), 
    );
  }
}
