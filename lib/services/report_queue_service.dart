import 'package:flutter/material.dart';
import '../models.dart';




class ReportQueueService extends ChangeNotifier {
  // Singleton
  static final ReportQueueService _instance = ReportQueueService._internal();

  factory ReportQueueService() => _instance;

  ReportQueueService._internal();

  final List<Reporte> _reports = [];

  // Lista pública de reportes pendientes
  List<Reporte> get pendingReports => List.unmodifiable(_reports);

  // Cantidad de reportes pendientes
  int get pendingReportsCount => _reports.length;

  // Agregar reporte a la cola
  void addReport(Reporte report) {
    _reports.add(report);
    debugPrint('DEBUG ReportQueueService: Reporte agregado: ${report.id}');
    notifyListeners();
  }

  // Eliminar reporte por ID
  void removeReportById(String id) {
    _reports.removeWhere((r) => r.id == id);
    notifyListeners();
  }

  // Enviar todos los reportes pendientes
  void sendAllPendingReports() {
    for (var report in _reports) {
      debugPrint('DEBUG ReportQueueService: Enviando reporte: ${report.id}');
      report.estado = ReporteEstado.enviado;
    }
    _reports.clear();
    notifyListeners();
  }
}

// Instancia global
final reportQueueService = ReportQueueService();