import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:ubi_container_new/map_screen.dart';
import 'package:ubi_container_new/login_screen.dart'; // Importación necesaria para navegar a LoginScreen

class RegScreen extends StatefulWidget {
  const RegScreen({super.key});

  @override
  State<RegScreen> createState() => _RegScreenState();
}

class _RegScreenState extends State<RegScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController nombreController = TextEditingController();
  final TextEditingController correoController = TextEditingController();
  final TextEditingController celularController = TextEditingController(); 
  final TextEditingController contrasenaController = TextEditingController();
  final TextEditingController confirmarContrasenaController = TextEditingController();

  Future<void> registrarUsuario() async {
    final nombre = nombreController.text.trim();
    final correo = correoController.text.trim();
    final celular = celularController.text.trim(); 
    final contrasena = contrasenaController.text.trim();
    final confirmarContrasena = confirmarContrasenaController.text.trim();

    if (contrasena != confirmarContrasena) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Las contraseñas no coinciden")),
      );
      return;
    }

    final url = Uri.parse('https://corrigibly-ungeneralizing-janell.ngrok-free.dev/register');
    try {
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: jsonEncode({
          "nombre_completo": nombre,
          "correo": correo,
          "celular": celular.isEmpty ? null : celular, // Enviar celular, o null si está vacío
          "contrasena": contrasena,
        }),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data['message'] != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Registro exitoso")),
        );
        
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => MapScreen(userEmail: correo)), // Pasa el email registrado
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(data['error'] ?? 'Error desconocido')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error de conexión: $e")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container( 
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Color(0xffB81736),
              Color(0xff281537),
            ],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SingleChildScrollView( 
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32.0), // Padding 
            child: Form(
              key: _formKey,
              child: Column(
                children: [
                  const SizedBox(height: 60), // 
                  const Align( // Título "Crea tu Cuenta"
                    alignment: Alignment.centerLeft,
                    child: Text(
                      'Crea tu\nCuenta',
                      style: TextStyle(
                        fontSize: 30,
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(height: 50), 

                  // Campo: Nombre completo
                  TextFormField(
                    controller: nombreController,
                    style: const TextStyle(color: Colors.white), 
                    decoration: InputDecoration(
                      hintText: 'Nombre completo',
                      hintStyle: const TextStyle(color: Colors.white70), 
                      filled: true,
                      fillColor: Colors.white12, 
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(30),
                        borderSide: BorderSide.none,
                      ),
                      suffixIcon: const Icon(Icons.check, color: Colors.grey),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 20),
                    ),
                    validator: (value) =>
                        value!.isEmpty ? 'Campo requerido' : null,
                  ),
                  const SizedBox(height: 20),

                  // Campo: Correo electrónico
                  TextFormField(
                    controller: correoController,
                    style: const TextStyle(color: Colors.white),
                    keyboardType: TextInputType.emailAddress, 
                    decoration: InputDecoration(
                      hintText: 'Correo electrónico',
                      hintStyle: const TextStyle(color: Colors.white70),
                      filled: true,
                      fillColor: Colors.white12,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(30),
                        borderSide: BorderSide.none,
                      ),
                      suffixIcon: const Icon(Icons.check, color: Colors.grey),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 20),
                    ),
                    validator: (value) =>
                        value!.isEmpty ? 'Campo requerido' : null,
                  ),
                  const SizedBox(height: 20),

                  // Campo: Celular ( aqui sera Opcional) - 
                  TextFormField(
                    controller: celularController,
                    style: const TextStyle(color: Colors.white),
                    keyboardType: TextInputType.phone, 
                    decoration: InputDecoration(
                      hintText: 'Celular (Opcional)',
                      hintStyle: const TextStyle(color: Colors.white70),
                      filled: true,
                      fillColor: Colors.white12,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(30),
                        borderSide: BorderSide.none,
                      ),
                      suffixIcon: const Icon(Icons.phone, color: Colors.grey),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 20),
                    ),
                    
                  ),
                  const SizedBox(height: 20),

                  // Campo: Contraseña
                  TextFormField(
                    controller: contrasenaController,
                    obscureText: true,
                    style: const TextStyle(color: Colors.white),
                    decoration: InputDecoration(
                      hintText: 'Contraseña',
                      hintStyle: const TextStyle(color: Colors.white70),
                      filled: true,
                      fillColor: Colors.white12,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(30),
                        borderSide: BorderSide.none,
                      ),
                      suffixIcon: const Icon(Icons.visibility_off, color: Colors.grey),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 20),
                    ),
                    validator: (value) =>
                        value!.length < 6 ? 'Mínimo 6 caracteres' : null,
                  ),
                  const SizedBox(height: 20),

                  // Campo: Confirma contraseña
                  TextFormField(
                    controller: confirmarContrasenaController,
                    obscureText: true,
                    style: const TextStyle(color: Colors.white),
                    decoration: InputDecoration(
                      hintText: 'Confirmar contraseña',
                      hintStyle: const TextStyle(color: Colors.white70),
                      filled: true,
                      fillColor: Colors.white12,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(30),
                        borderSide: BorderSide.none,
                      ),
                      suffixIcon: const Icon(Icons.visibility_off, color: Colors.grey),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 20),
                    ),
                    validator: (value) => value != contrasenaController.text
                        ? 'Las contraseñas no coinciden'
                        : null,
                  ),
                  const SizedBox(height: 50),

                  // Botón REGISTRARSE
                  GestureDetector(
                    onTap: () {
                      if (_formKey.currentState!.validate()) {
                        registrarUsuario();
                      }
                    },
                    child: Container(
                      height: 55,
                      width: 300,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(30),
                        gradient: const LinearGradient(
                          colors: [
                            Color(0xffB81736),
                            Color(0xff281537),
                          ],
                        ),
                      ),
                      child: const Center(
                        child: Text(
                          'REGISTRARSE',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 20,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 60),

                  // Texto para volver a iniciar sesión
                  Align(
                    alignment: Alignment.centerRight,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        const Text(
                          "¿Ya tienes una cuenta?",
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Colors.white70,
                          ),
                        ),
                        GestureDetector(
                          onTap: () {
                            //  este Navega a la pantalla de Login :)
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (context) =>  LoginScreen()),
                            );
                          },
                          child: const Text(
                            "Iniciar sesión",
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 17,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 30),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
