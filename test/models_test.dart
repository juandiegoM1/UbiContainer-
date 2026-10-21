import 'package:flutter_test/flutter_test.dart';
import 'package:ubi_container_new/models.dart';

void main() {
  group('Contenedor Tests', () {
    test('Debería crear un Contenedor con valores por defecto', () {
      final contenedor = Contenedor(
        id: '1',
        latitude: -17.3937,
        longitude: -66.1569,
      );

      expect(contenedor.id, '1');
      expect(contenedor.latitude, -17.3937);
      expect(contenedor.longitude, -66.1569);
      expect(contenedor.type, 'desconocido');
      expect(contenedor.estado, 'activo');
      expect(contenedor.nivelLlenado, 0);
    });

    test('Debería crear un Contenedor con todos los valores', () {
      final contenedor = Contenedor(
        id: '2',
        latitude: -17.3937,
        longitude: -66.1569,
        type: 'soterrado',
        name: 'Contenedor Central',
        estado: 'activo',
        nivelLlenado: 75,
      );

      expect(contenedor.id, '2');
      expect(contenedor.type, 'soterrado');
      expect(contenedor.name, 'Contenedor Central');
      expect(contenedor.estado, 'activo');
      expect(contenedor.nivelLlenado, 75);
    });

    test('Debería serializar Contenedor a JSON correctamente', () {
      final contenedor = Contenedor(
        id: '3',
        latitude: -17.3937,
        longitude: -66.1569,
        type: 'superficial',
        name: 'Contenedor Plaza',
        estado: 'activo',
        nivelLlenado: 50,
      );

      final json = contenedor.toJson();

      expect(json['id'], '3');
      expect(json['latitude'], -17.3937);
      expect(json['longitude'], -66.1569);
      expect(json['type'], 'superficial');
      expect(json['name'], 'Contenedor Plaza');
      expect(json['estado'], 'activo');
      expect(json['nivel_llenado'], 50);
    });

    test('Debería deserializar Contenedor desde JSON correctamente', () {
      final json = {
        'id': '4',
        'latitude': -17.3937,
        'longitude': -66.1569,
        'type': 'soterrado',
        'name': 'Contenedor Test',
        'estado': 'activo',
        'nivel_llenado': 80,
      };

      final contenedor = Contenedor.fromJson(json);

      expect(contenedor.id, '4');
      expect(contenedor.latitude, -17.3937);
      expect(contenedor.longitude, -66.1569);
      expect(contenedor.type, 'soterrado');
      expect(contenedor.name, 'Contenedor Test');
      expect(contenedor.estado, 'activo');
      expect(contenedor.nivelLlenado, 80);
    });

    test('Debería manejar valores nulos en fromJson', () {
      final json = {
        'id': '5',
        'latitude': -17.3937,
        'longitude': -66.1569,
      };

      final contenedor = Contenedor.fromJson(json);

      expect(contenedor.id, '5');
      expect(contenedor.type, 'desconocido');
      expect(contenedor.name, null);
      expect(contenedor.estado, 'activo');
      expect(contenedor.nivelLlenado, 0);
    });

    test('Debería clamping nivelLlenado entre 0 y 100', () {
      final json1 = {'id': '6', 'latitude': -17.3937, 'longitude': -66.1569, 'nivel_llenado': 150};
      final json2 = {'id': '7', 'latitude': -17.3937, 'longitude': -66.1569, 'nivel_llenado': -50};

      final contenedor1 = Contenedor.fromJson(json1);
      final contenedor2 = Contenedor.fromJson(json2);

      expect(contenedor1.nivelLlenado, 100);
      expect(contenedor2.nivelLlenado, 0);
    });

    test('Debería parsear nivelLlenado como string', () {
      final json = {
        'id': '8',
        'latitude': -17.3937,
        'longitude': -66.1569,
        'nivel_llenado': '75',
      };

      final contenedor = Contenedor.fromJson(json);
      expect(contenedor.nivelLlenado, 75);
    });

    test('FALLA: Este test está diseñado para fallar - validación de ID vacío', () {
      final contenedor = Contenedor(
        id: '',
        latitude: -17.3937,
        longitude: -66.1569,
      );

      expect(contenedor.id.isNotEmpty, true);
    });
  });

  group('Reporte Tests', () {
    test('Debería crear un Reporte con valores por defecto', () {
      final reporte = Reporte(
        id: 'r1',
        userId: 'u1',
        containerId: 'c1',
        tipo: ReporteTipo.lleno,
        timestamp: DateTime(2024, 1, 1),
        latitude: -17.3937,
        longitude: -66.1569,
      );

      expect(reporte.id, 'r1');
      expect(reporte.userId, 'u1');
      expect(reporte.containerId, 'c1');
      expect(reporte.tipo, ReporteTipo.lleno);
      expect(reporte.estado, ReporteEstado.pendiente);
    });

    test('Debería obtener descripción para tipo lleno', () {
      final reporte = Reporte(
        id: 'r2',
        userId: 'u1',
        containerId: 'c1',
        tipo: ReporteTipo.lleno,
        timestamp: DateTime(2024, 1, 1),
        latitude: -17.3937,
        longitude: -66.1569,
      );

      expect(reporte.description, 'Contenedor Lleno');
    });

    test('Debería obtener descripción para tipo fueraDeServicio', () {
      final reporte = Reporte(
        id: 'r3',
        userId: 'u1',
        containerId: 'c1',
        tipo: ReporteTipo.fueraDeServicio,
        timestamp: DateTime(2024, 1, 1),
        latitude: -17.3937,
        longitude: -66.1569,
      );

      expect(reporte.description, 'Contenedor Fuera de Servicio');
    });

    test('Debería obtener descripción personalizada si existe comentario', () {
      final reporte = Reporte(
        id: 'r4',
        userId: 'u1',
        containerId: 'c1',
        tipo: ReporteTipo.lleno,
        comentario: 'Necesita atención urgente',
        timestamp: DateTime(2024, 1, 1),
        latitude: -17.3937,
        longitude: -66.1569,
      );

      expect(reporte.description, 'Necesita atención urgente');
    });

    test('Debería serializar Reporte a JSON', () {
      final reporte = Reporte(
        id: 'r5',
        userId: 'u1',
        containerId: 'c1',
        tipo: ReporteTipo.lleno,
        comentario: 'Test',
        timestamp: DateTime(2024, 1, 1, 12, 0),
        estado: ReporteEstado.enviado,
        latitude: -17.3937,
        longitude: -66.1569,
      );

      final json = reporte.toJson();

      expect(json['id'], 'r5');
      expect(json['userId'], 'u1');
      expect(json['containerId'], 'c1');
      expect(json['tipo'], 'lleno');
      expect(json['comentario'], 'Test');
      expect(json['estado'], 'enviado');
    });

    test('Debería deserializar Reporte desde JSON', () {
      final json = {
        'id': 'r6',
        'userId': 'u1',
        'containerId': 'c1',
        'tipo': 'fueraDeServicio',
        'comentario': 'Test',
        'timestamp': '2024-01-01T12:00:00',
        'estado': 'atendido',
        'latitude': -17.3937,
        'longitude': -66.1569,
      };

      final reporte = Reporte.fromJson(json);

      expect(reporte.id, 'r6');
      expect(reporte.tipo, ReporteTipo.fueraDeServicio);
      expect(reporte.estado, ReporteEstado.atendido);
    });

    test('Debería manejar tipo desconocido en fromJson', () {
      final json = {
        'id': 'r7',
        'userId': 'u1',
        'containerId': 'c1',
        'tipo': 'tipo_invalido',
        'timestamp': '2024-01-01T12:00:00',
        'latitude': -17.3937,
        'longitude': -66.1569,
      };

      final reporte = Reporte.fromJson(json);
      expect(reporte.tipo, ReporteTipo.otro);
    });

    test('FALLA: Este test está diseñado para fallar - validación de timestamp', () {
      final json = {
        'id': 'r8',
        'userId': 'u1',
        'containerId': 'c1',
        'tipo': 'lleno',
        'timestamp': 'fecha_invalida',
        'latitude': -17.3937,
        'longitude': -66.1569,
      };

      final reporte = Reporte.fromJson(json);
      expect(reporte.timestamp.isAfter(DateTime.now()), true);
    });
  });

  group('DumpReport Tests', () {
    test('Debería crear un DumpReport con valores por defecto', () {
      final dumpReport = DumpReport(
        id: 'd1',
        userId: 'u1',
        latitude: -17.3937,
        longitude: -66.1569,
        photoPath: '/path/to/photo.jpg',
        timestamp: DateTime(2024, 1, 1),
      );

      expect(dumpReport.id, 'd1');
      expect(dumpReport.userId, 'u1');
      expect(dumpReport.synced, false);
      expect(dumpReport.estado, 'pendiente');
    });

    test('Debería serializar DumpReport a JSON', () {
      final dumpReport = DumpReport(
        id: 'd2',
        userId: 'u1',
        latitude: -17.3937,
        longitude: -66.1569,
        description: 'Vertedero grande',
        photoPath: '/path/to/photo.jpg',
        photoUrl: 'http://example.com/photo.jpg',
        synced: true,
        timestamp: DateTime(2024, 1, 1),
        estado: 'atendido',
      );

      final json = dumpReport.toJson();

      expect(json['id'], 'd2');
      expect(json['description'], 'Vertedero grande');
      expect(json['synced'], true);
      expect(json['estado'], 'atendido');
    });

    test('Debería deserializar DumpReport desde JSON con snake_case', () {
      final json = {
        'id': 'd3',
        'user_id': 'u1',
        'latitude': -17.3937,
        'longitude': -66.1569,
        'photo_path': '/path/to/photo.jpg',
        'created_at': '2024-01-01T12:00:00',
      };

      final dumpReport = DumpReport.fromJson(json);

      expect(dumpReport.id, 'd3');
      expect(dumpReport.userId, 'u1');
      expect(dumpReport.photoPath, '/path/to/photo.jpg');
    });

    test('Debería manejar valores nulos en DumpReport fromJson', () {
      final json = {
        'id': 'd4',
        'userId': 'u1',
        'latitude': -17.3937,
        'longitude': -66.1569,
        'photoPath': '/path/to/photo.jpg',
      };

      final dumpReport = DumpReport.fromJson(json);

      expect(dumpReport.description, null);
      expect(dumpReport.photoUrl, null);
      expect(dumpReport.synced, false);
    });

    test('Debería convertir timestamp válido', () {
      final json = {
        'id': 'd5',
        'userId': 'u1',
        'latitude': -17.3937,
        'longitude': -66.1569,
        'photoPath': '/path/to/photo.jpg',
        'timestamp': '2024-06-15T10:30:00',
      };

      final dumpReport = DumpReport.fromJson(json);
      expect(dumpReport.timestamp.year, 2024);
      expect(dumpReport.timestamp.month, 6);
      expect(dumpReport.timestamp.day, 15);
    });

    test('FALLA: Este test está diseñado para fallar - validación de photoPath', () {
      final dumpReport = DumpReport(
        id: 'd6',
        userId: 'u1',
        latitude: -17.3937,
        longitude: -66.1569,
        photoPath: '',
        timestamp: DateTime(2024, 1, 1),
      );

      expect(dumpReport.photoPath.isNotEmpty, true);
    });
  });

  group('Funciones auxiliares Tests', () {
    test('Debería convertir estado "en_proceso" a enProceso', () {
      final estado = dumpEstadoToReporteEstado('en_proceso');
      expect(estado, ReporteEstado.enProceso);
    });

    test('Debería convertir estado "atendido" a atendido', () {
      final estado = dumpEstadoToReporteEstado('atendido');
      expect(estado, ReporteEstado.atendido);
    });

    test('Debería convertir estado desconocido a pendiente', () {
      final estado = dumpEstadoToReporteEstado('desconocido');
      expect(estado, ReporteEstado.pendiente);
    });

    test('Debería convertir estado null a pendiente', () {
      final estado = dumpEstadoToReporteEstado('');
      expect(estado, ReporteEstado.pendiente);
    });

    test('FALLA: Este test está diseñado para fallar - conversión de estado', () {
      final estado = dumpEstadoToReporteEstado('atendido');
      expect(estado, ReporteEstado.enProceso);
    });
  });

  group('Config Tests', () {
    test('Debería tener backendUrl configurado', () {
      expect(Config.backendUrl, isNotEmpty);
      expect(Config.backendUrl.startsWith('http'), true);
    });

    test('Debería ser localhost en desarrollo', () {
      expect(Config.backendUrl.contains('127.0.0.1') || Config.backendUrl.contains('localhost'), true);
    });
  });
}
