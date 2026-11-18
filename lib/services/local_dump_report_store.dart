import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:ubi_container_new/models.dart';

/// Almacenamiento local de reportes de vertederos ilegales.
///
/// Persiste los reportes en SharedPreferences para que sobrevivan al cierre
/// de la app. Sirve como respaldo cuando no hay backend disponible.
class LocalDumpReportStore {
  static const String _key = 'dump_reports_local';

  static Future<List<DumpReport>> getAll() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_key);
    if (raw == null || raw.isEmpty) return [];

    try {
      final decoded = json.decode(raw) as List<dynamic>;
      return decoded
          .map((e) => DumpReport.fromJson(e as Map<String, dynamic>))
          .toList();
    } catch (e) {
      debugPrint('LocalDumpReportStore: error al leer reportes: $e');
      return [];
    }
  }

  static Future<void> add(DumpReport report) async {
    final prefs = await SharedPreferences.getInstance();
    final reports = await getAll();
    reports.add(report);
    final raw = json.encode(reports.map((r) => r.toJson()).toList());
    await prefs.setString(_key, raw);
    debugPrint('LocalDumpReportStore: reporte guardado localmente (${report.id}).');
  }

  static Future<void> removeById(String id) async {
    final prefs = await SharedPreferences.getInstance();
    final reports = await getAll()
      ..removeWhere((r) => r.id == id);
    final raw = json.encode(reports.map((r) => r.toJson()).toList());
    await prefs.setString(_key, raw);
  }

  static Future<bool> updateEstadoById(String id, String estado) async {
    final prefs = await SharedPreferences.getInstance();
    final reports = await getAll();
    var updated = false;

    final nextReports = reports.map((report) {
      if (report.id != id) return report;
      updated = true;
      return DumpReport(
        id: report.id,
        userId: report.userId,
        latitude: report.latitude,
        longitude: report.longitude,
        description: report.description,
        photoPath: report.photoPath,
        photoUrl: report.photoUrl,
        synced: report.synced,
        timestamp: report.timestamp,
        estado: estado,
      );
    }).toList();

    if (!updated) return false;

    final raw = json.encode(nextReports.map((r) => r.toJson()).toList());
    await prefs.setString(_key, raw);
    debugPrint('LocalDumpReportStore: estado actualizado ($id -> $estado)');
    return true;
  }
}
