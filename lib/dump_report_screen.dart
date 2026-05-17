import 'dart:io';
import 'package:ubi_container_new/config.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:ubi_container_new/map_picker_screen.dart';
import 'package:ubi_container_new/auth_service.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

const String backendUrl = Config.backendUrl;

/// Pantalla para crear reportes de vertederos ilegales
class DumpReportScreen extends StatefulWidget {
  final String userEmail;

  const DumpReportScreen({super.key, required this.userEmail});

  @override
  State<DumpReportScreen> createState() => _DumpReportScreenState();
}

class _DumpReportScreenState extends State<DumpReportScreen> {
  final TextEditingController _descriptionController = TextEditingController();
  final ImagePicker _picker = ImagePicker();
  
  File? _selectedImage;
  double? _selectedLatitude;
  double? _selectedLongitude;
  bool _isSubmitting = false;

  @override
  void dispose() {
    _descriptionController.dispose();
    super.dispose();
  }

  /// Tomar foto con la cámara
  Future<void> _takePhoto() async {
    try {
      final XFile? photo = await _picker.pickImage(
        source: ImageSource.camera,
        maxWidth: 1920,
        maxHeight: 1080,
        imageQuality: 85,
      );

      if (photo != null) {
        setState(() {
          _selectedImage = File(photo.path);
        });
      }
    } catch (e) {
      _showMessage('Error', 'No se pudo acceder a la cámara: $e');
    }
  }

  /// Seleccionar foto de la galería
  Future<void> _pickFromGallery() async {
    try {
      final XFile? image = await _picker.pickImage(
        source: ImageSource.gallery,
        maxWidth: 1920,
        maxHeight: 1080,
        imageQuality: 85,
      );

      if (image != null) {
        setState(() {
          _selectedImage = File(image.path);
        });
      }
    } catch (e) {
      _showMessage('Error', 'No se pudo acceder a la galería: $e');
    }
  }

  /// Abrir selector de ubicación en el mapa
  Future<void> _selectLocation() async {
    final result = await Navigator.push<Map<String, double>>(
      context,
      MaterialPageRoute(
        builder: (context) => MapPickerScreen(
          initialLatitude: _selectedLatitude,
          initialLongitude: _selectedLongitude,
        ),
      ),
    );

    if (result != null) {
      setState(() {
        _selectedLatitude = result['latitude'];
        _selectedLongitude = result['longitude'];
      });
    }
  }

  /// Validar y enviar reporte
  Future<void> _submitReport() async {
    // Validaciones
    if (_selectedImage == null) {
      _showMessage('Foto requerida', 'Por favor, toma o selecciona una foto del vertedero');
      return;
    }

    if (_selectedLatitude == null || _selectedLongitude == null) {
      _showMessage('Ubicación requerida', 'Por favor, selecciona la ubicación en el mapa');
      return;
    }

    setState(() {
      _isSubmitting = true;
    });

    try {
      // Obtener token de autenticación
      final token = await AuthService.getToken();
      if (token == null) {
        throw Exception('No hay sesión activa');
      }

      // Crear petición multipart
      var request = http.MultipartRequest(
        'POST',
        Uri.parse('$backendUrl/dump-reports'),
      );

      // Agregar headers
      request.headers.addAll({
      'Authorization': 'Bearer $token',
      'ngrok-skip-browser-warning': 'true',
    });

      // Agregar campos del formulario
      request.fields['latitude'] = _selectedLatitude.toString();
      request.fields['longitude'] = _selectedLongitude.toString();
      
      if (_descriptionController.text.isNotEmpty) {
        request.fields['description'] = _descriptionController.text;
      }

      // Agregar archivo de imagen
      request.files.add(
        await http.MultipartFile.fromPath(
          'photo',
          _selectedImage!.path,
        ),
      );

      // Enviar petición
      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      if (response.statusCode == 200) {
        debugPrint('✅ Reporte de vertedero enviado exitosamente');
        
        if (mounted) {
          _showMessage('¡Éxito!', 'Reporte enviado correctamente');
          
          // Limpiar formulario
          setState(() {
            _selectedImage = null;
            _selectedLatitude = null;
            _selectedLongitude = null;
            _descriptionController.clear();
          });

          // Regresar a la pantalla anterior después de 2 segundos
          await Future.delayed(const Duration(seconds: 2));
          if (mounted) {
            Navigator.pop(context);
          }
        }
      } else {
        final errorData = json.decode(response.body);
        throw Exception(errorData['detail'] ?? 'Error desconocido');
      }
    } catch (e) {
      debugPrint('❌ Error al enviar reporte: $e');
      _showMessage('Error', 'No se pudo enviar el reporte: $e');
    } finally {
      if (mounted) {
        setState(() {
          _isSubmitting = false;
        });
      }
    }
  }

  void _showMessage(String title, String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$title: $message'),
        duration: const Duration(seconds: 4),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Reportar Vertedero Ilegal', style: TextStyle(color: Colors.white)),
        backgroundColor: const Color(0xff2D6A4F),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: Container(
        color: const Color(0xfff5f5f5),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Card(
                elevation: 4,
                color: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                    const Row(
                      children: [
                        Icon(Icons.camera_alt, color: Color(0xff2D6A4F)),
                        SizedBox(width: 8),
                        Text(
                          'Foto del Vertedero *',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    
                    
                    if (_selectedImage != null)
                      Container(
                        height: 200,
                        width: double.infinity,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(8),
                          image: DecorationImage(
                            image: FileImage(_selectedImage!),
                            fit: BoxFit.cover,
                          ),
                        ),
                      )
                    else
                      Container(
                        height: 200,
                        decoration: BoxDecoration(
                          color: Colors.grey[200],
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.image, size: 64, color: Colors.grey),
                              SizedBox(height: 8),
                              Text(
                                'No hay foto seleccionada',
                                style: TextStyle(color: Colors.grey),
                              ),
                            ],
                          ),
                        ),
                      ),
                    
                    const SizedBox(height: 16),
                    
                    
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton.icon(
                            icon: const Icon(Icons.camera_alt, color: Colors.white),
                            label: const Text('Tomar Foto', style: TextStyle(color: Colors.white)),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xff2D6A4F),
                              padding: const EdgeInsets.symmetric(vertical: 12),
                            ),
                            onPressed: _isSubmitting ? null : _takePhoto,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: OutlinedButton.icon(
                            icon: const Icon(Icons.photo_library, color: Color(0xff2D6A4F)),
                            label: const Text('Galería', style: TextStyle(color: Color(0xff2D6A4F))),
                            style: OutlinedButton.styleFrom(
                              side: const BorderSide(color: Color(0xff2D6A4F)),
                              padding: const EdgeInsets.symmetric(vertical: 12),
                            ),
                            onPressed: _isSubmitting ? null : _pickFromGallery,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            
            const SizedBox(height: 16),
            
            // Sección de ubicación
            Card(
              elevation: 4,
              color: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
                side: const BorderSide(color: Color(0xffe0e0e0), width: 1),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.location_on, color: Color(0xff2D6A4F)),
                        SizedBox(width: 8),
                        Text(
                          'Ubicación *',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    
                    if (_selectedLatitude != null && _selectedLongitude != null)
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.green[50],
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.green),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.check_circle, color: Colors.green),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Ubicación seleccionada:',
                                    style: TextStyle(fontWeight: FontWeight.bold),
                                  ),
                                  Text('Lat: ${_selectedLatitude!.toStringAsFixed(6)}'),
                                  Text('Lon: ${_selectedLongitude!.toStringAsFixed(6)}'),
                                ],
                              ),
                            ),
                          ],
                        ),
                      )
                    else
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.orange[50],
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.orange),
                        ),
                        child: const Row(
                          children: [
                            Icon(Icons.warning, color: Colors.orange),
                            SizedBox(width: 8),
                            Expanded(
                              child: Text('No has seleccionado una ubicación'),
                            ),
                          ],
                        ),
                      ),
                    
                    const SizedBox(height: 16),
                    
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        icon: const Icon(Icons.map, color: Colors.white, size: 20),
                        label: const Text(
                          'Seleccionar en Mapa',
                          style: TextStyle(color: Colors.white, fontSize: 13),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xff2D6A4F),
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                        ),
                        onPressed: _isSubmitting ? null : _selectLocation,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            
            const SizedBox(height: 16),
            
            // Sección de descripción
            Card(
              elevation: 4,
              color: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
                side: const BorderSide(color: Color(0xffe0e0e0), width: 1),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.description, color: Color(0xff2D6A4F)),
                        SizedBox(width: 8),
                        Text(
                          'Descripción (opcional)',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: _descriptionController,
                      maxLines: 4,
                      maxLength: 500,
                      decoration: const InputDecoration(
                        hintText: 'Describe el vertedero (tipo de basura, tamaño aproximado, etc.)',
                        border: OutlineInputBorder(),
                      ),
                      enabled: !_isSubmitting,
                    ),
                  ],
                ),
              ),
            ),
            
            const SizedBox(height: 24),
            
            
            ElevatedButton.icon(
              icon: _isSubmitting
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        color: Colors.white,
                        strokeWidth: 2,
                      ),
                    )
                  : const Icon(Icons.send, color: Colors.white),
              label: Text(
                _isSubmitting ? 'Enviando...' : 'Enviar Reporte',
                style: const TextStyle(fontSize: 18, color: Colors.white),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xff2D6A4F),
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onPressed: _isSubmitting ? null : _submitReport,
            ),
            
            const SizedBox(height: 16),
            
            
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.blue[50],
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(Icons.info, color: Colors.blue, size: 20),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Los campos marcados con * son obligatorios. Tu reporte ayudará a mantener limpia nuestra ciudad.',
                      style: TextStyle(fontSize: 12, color: Colors.blue),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    ),
    );
  }
}
