import 'package:flutter/foundation.dart';
import 'dart:convert'; 


/// Modelo para representar un Contenedor
class Contenedor {
  final String id;
  final double latitude;
  final double longitude;
  final String type; // e.g., 'soterrado'
  final String? name;

  Contenedor({
    required this.id,
    required this.latitude,
    required this.longitude,
    this.type = 'desconocido',
    this.name,
  });

  // Constructor de para crear un Contenedor desde un mapa JSON
  factory Contenedor.fromJson(Map<String, dynamic> json) {
    return Contenedor(
      id: json['id']?.toString() ?? '',
      latitude: (json['latitude'] ?? 0.0).toDouble(),
      longitude: (json['longitude'] ?? 0.0).toDouble(),
      type: json['type']?.toString() ?? 'desconocido',
      name: json['name']?.toString() ?? json['nombre']?.toString(),
    );
  }

  // Método toJson para serializar Contenedor
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'latitude': latitude,
      'longitude': longitude,
      'type': type,
      'name': name,
    };
  }
}


enum ReporteTipo { lleno, fueraDeServicio, otro }


enum ReporteEstado { pendiente, enviado, error }

///datos para un Reporte.
class Reporte {
  final String id;
  final String userId;
  final String containerId; 
  final ReporteTipo tipo; 
  final String? comentario; 
  final DateTime timestamp;
  ReporteEstado estado;
  final String? containerType;
  final double latitude; 
  final double longitude;

  Reporte({
    required this.id,
    required this.userId,
    required this.containerId,
    required this.tipo, 
    this.comentario,
    required this.timestamp,
    this.estado = ReporteEstado.pendiente,
    this.containerType,
    required this.latitude,
    required this.longitude,
  });

  // Getter para obtener la descripción legible del reporte
  String get description {
    if (comentario != null && comentario!.isNotEmpty) {
      return comentario!;
    }
    switch (tipo) {
      case ReporteTipo.lleno:
        return 'Contenedor Lleno';
      case ReporteTipo.fueraDeServicio:
        return 'Contenedor Fuera de Servicio';
      case ReporteTipo.otro:
      default:
        return 'Otro Problema con Contenedor';
    }
  }

  // Convertir Reporte a JSON para guardar en SharedPreferences o enviar al backend
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'containerId': containerId,
      'tipo': tipo.toString().split('.').last, 
      'comentario': comentario,
      'timestamp': timestamp.toIso8601String(),
      'estado': estado.toString().split('.').last,
      'containerType': containerType,
      'latitude': latitude,
      'longitude': longitude,
    };
  }

  // Crear Reporte desde JSON (para cargar desde SharedPreferences)
  factory Reporte.fromJson(Map<String, dynamic> json) {
    return Reporte(
      id: json['id'] ?? '', 
      userId: json['userId'] ?? '',
      containerId: json['containerId']?.toString() ?? '', 
      tipo: ReporteTipo.values.firstWhere(
            (e) => e.toString().split('.').last == json['tipo'],
            orElse: () => ReporteTipo.otro),
      comentario: json['comentario'],
      timestamp: DateTime.tryParse(json['timestamp'] ?? '') ?? DateTime.now(),
      estado: ReporteEstado.values.firstWhere(
            (e) => e.toString().split('.').last == json['estado'],
            orElse: () => ReporteEstado.pendiente),
      containerType: json['containerType'],
      latitude: json['latitude'] ?? 0.0,
      longitude: json['longitude'] ?? 0.0,
    );
  }
}

///para reportes de vertederos ilegales
class DumpReport {
  final String id;
  final String userId;
  final double latitude;
  final double longitude;
  final String? description;
  final String photoPath;
  final DateTime timestamp;

  DumpReport({
    required this.id,
    required this.userId,
    required this.latitude,
    required this.longitude,
    this.description,
    required this.photoPath,
    required this.timestamp,
  });

 
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'latitude': latitude,
      'longitude': longitude,
      'description': description,
      'photoPath': photoPath,
      'timestamp': timestamp.toIso8601String(),
    };
  }

 
  factory DumpReport.fromJson(Map<String, dynamic> json) {
    return DumpReport(
      id: json['id']?.toString() ?? '',
      userId: json['userId']?.toString() ?? '',
      latitude: (json['latitude'] ?? 0.0).toDouble(),
      longitude: (json['longitude'] ?? 0.0).toDouble(),
      description: json['description'],
      photoPath: json['photoPath'] ?? json['photo_path'] ?? '',
      timestamp: DateTime.tryParse(json['timestamp'] ?? json['created_at'] ?? '') ?? DateTime.now(),
    );
  }
}
