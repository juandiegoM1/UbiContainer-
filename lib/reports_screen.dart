import 'package:flutter/material.dart';
import 'package:ubi_container_new/models.dart'; 
import 'package:ubi_container_new/auth_service.dart';
import 'package:ubi_container_new/services/report_queue_service.dart';

class ReportsScreen extends StatefulWidget {
  final String userEmail;
  const ReportsScreen({super.key, required this.userEmail});

  @override
  State<ReportsScreen> createState() => _ReportsScreenState();
}

class _ReportsScreenState extends State<ReportsScreen> {
  final ReportQueueService _reportQueueService = reportQueueService; // <- instancia local

  // Lista de reportes que se mostrarán. Se actualizará desde el ReportQueueService.
  List<Reporte> _reports = []; 

  @override
  void initState() {
    super.initState();
    debugPrint('DEBUG ReportsScreen: [INIT] ReportsScreen inicializada.');
    _reports = _reportQueueService.pendingReports;
    
    // Suscribirse a los cambios en la cola de reportes.
    _reportQueueService.addListener(_onQueueChanged);
  }

  @override
  void dispose() {
    debugPrint('DEBUG ReportsScreen: [DISPOSE] ReportsScreen desechada.');
    _reportQueueService.removeListener(_onQueueChanged);
    super.dispose();
  }

  // Callback que se ejecuta cuando la cola de reportes cambia.
  void _onQueueChanged() {
    if (mounted) { 
      debugPrint('DEBUG ReportsScreen: [ON_QUEUE_CHANGED] Cola de reportes actualizada. Actualizando UI.');
      setState(() {
        _reports = _reportQueueService.pendingReports;
      });
    }
  }

  String _getReportTypeString(ReporteTipo tipo) {
    switch (tipo) {
      case ReporteTipo.lleno:
        return 'Contenedor Lleno';
      case ReporteTipo.fueraDeServicio:
        return 'Fuera de Servicio';
      case ReporteTipo.otro:
        return 'Otro Problema';
    }
  }

  String _getReportStateString(ReporteEstado estado) {
    switch (estado) {
      case ReporteEstado.pendiente:
        return 'Pendiente';
      case ReporteEstado.enviado:
        return 'Enviado';
      case ReporteEstado.error: 
        return 'Fallido';
    }
  }

  Color _getReportStateColor(ReporteEstado estado) {
    switch (estado) {
      case ReporteEstado.pendiente:
        return Colors.orange;
      case ReporteEstado.enviado:
        return Colors.green;
      case ReporteEstado.error: 
        return Colors.red;
    }
  }

  void _retryReport(Reporte report) {
    debugPrint('DEBUG ReportsScreen: [RETRY] Reintentando reporte ID: ${report.id}');
    report.estado = ReporteEstado.pendiente;
    _reportQueueService.sendAllPendingReports(); 
    _showMessage('Reintentando', 'Reporte ${report.id} reintentando envío.');
  }

  void _deleteReport(Reporte report) {
    debugPrint('DEBUG ReportsScreen: [DELETE] Eliminando reporte ID: ${report.id}');
    _reportQueueService.removeReportById(report.id); 
    _showMessage('Reporte Eliminado', 'El reporte ha sido eliminado de la cola.');
  }

  void _showMessage(String title, String content) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$title: $content'),
        duration: const Duration(seconds: 4),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    debugPrint('DEBUG ReportsScreen: [BUILD] Reconstruyendo ReportsScreen. Reportes actuales: ${_reports.length}');
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mis Reportes', style: TextStyle(color: Colors.white)),
        backgroundColor: const Color(0xff2D6A4F),
        iconTheme: const IconThemeData(color: Colors.white), 
      ),
      body: _reports.isEmpty
          ? const Center(
              child: Text(
                'No hay reportes pendientes.',
                style: TextStyle(fontSize: 18, color: Colors.grey),
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(8.0),
              itemCount: _reports.length,
              itemBuilder: (context, index) {
                final reporte = _reports[index];
                return Card(
                  margin: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 4.0),
                  elevation: 5,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(15.0),
                  ),
                  color: const Color(0xff6B4F2A), 
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'ID: ${reporte.id.substring(0, 8)}...', 
                          style: const TextStyle(
                            color: Colors.white70,
                            fontSize: 12,
                          ),
                        ),
                        const SizedBox(height: 5),
                        Text(
                          _getReportTypeString(reporte.tipo), 
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 5),
                        Text(
                          'Descripción: ${reporte.description}',
                          style: const TextStyle(color: Colors.white),
                        ),
                        if (reporte.comentario != null && reporte.comentario!.isNotEmpty && reporte.description != reporte.comentario) 
                          Text(
                            'Comentario Adicional: ${reporte.comentario}',
                            style: const TextStyle(color: Colors.white70, fontStyle: FontStyle.italic),
                          ),
                        const SizedBox(height: 5),
                        Text(
                          'Contenedor ID: ${reporte.containerId}', 
                          style: const TextStyle(color: Colors.white),
                        ),
                        const SizedBox(height: 5),
                        Text(
                          'Ubicación: Lat ${reporte.latitude.toStringAsFixed(4)}, Lon ${reporte.longitude.toStringAsFixed(4)}',
                          style: const TextStyle(color: Colors.white),
                        ),
                        const SizedBox(height: 5),
                        Align(
                          alignment: Alignment.bottomRight,
                          child: Text(
                            'Fecha: ${reporte.timestamp.toLocal().toString().split('.')[0]}',
                            style: const TextStyle(color: Colors.white70, fontSize: 12),
                          ),
                        ),
                        const SizedBox(height: 10),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: _getReportStateColor(reporte.estado),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                _getReportStateString(reporte.estado),
                                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                              ),
                            ),
                            if (reporte.estado == ReporteEstado.error)
                              IconButton(
                                icon: const Icon(Icons.refresh, color: Colors.lightBlueAccent),
                                onPressed: () => _retryReport(reporte),
                                tooltip: 'Reintentar envío',
                              ),
                            if (reporte.estado != ReporteEstado.enviado)
                              ElevatedButton.icon(
                                icon: const Icon(Icons.delete_forever, size: 18),
                                label: const Text('Eliminar', style: TextStyle(fontSize: 12)),
                                onPressed: () => _deleteReport(reporte),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.red,
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                  minimumSize: Size.zero,
                                ),
                              ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}
