import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:supabase/supabase.dart';
import 'package:ubi_container_new/models.dart';
import 'package:ubi_container_new/supabase_client.dart';

typedef DumpReportChangeCallback = void Function(PostgresChangePayload payload);

class SupabaseDumpReportService {
  static const String _table = 'reportes_vertederos';
  static const String _bucket = 'dump-reports';

  static Future<DumpReport> submitReport({
    required String reportId,
    required String userId,
    required String? userEmail,
    required double latitude,
    required double longitude,
    required String photoPath,
    String? description,
  }) async {
    final storagePath = await _uploadPhoto(
      userId: userId,
      reportId: reportId,
      photoPath: photoPath,
    );

    final row = await supabaseClient.from(_table).insert({
      'user_id': userId,
      'latitude': latitude,
      'longitude': longitude,
      'description': description,
      'photo_path': storagePath,
      'estado': 'pendiente',
    }).select().single();

    final photoUrl =
        supabaseClient.storage.from(_bucket).getPublicUrl(storagePath);

    debugPrint('SupabaseDumpReportService: reporte enviado (${row['id']})');

    return DumpReport(
      id: row['id'].toString(),
      userId: userId,
      latitude: latitude,
      longitude: longitude,
      description: description,
      photoPath: photoPath,
      photoUrl: photoUrl,
      synced: true,
      timestamp: DateTime.tryParse(row['created_at']?.toString() ?? '') ??
          DateTime.now(),
      estado: row['estado']?.toString() ?? 'pendiente',
    );
  }

  static Future<Map<String, String>> fetchEstadosByIds(List<String> ids) async {
    if (ids.isEmpty) return {};

    final numericIds = ids
        .map((id) => int.tryParse(id))
        .whereType<int>()
        .toList();
    if (numericIds.isEmpty) return {};

    final rows = await supabaseClient
        .from(_table)
        .select('id, estado')
        .inFilter('id', numericIds);

    final estados = <String, String>{};
    for (final row in rows) {
      final id = row['id']?.toString();
      final estado = row['estado']?.toString();
      if (id != null && estado != null) {
        estados[id] = estado;
      }
    }
    return estados;
  }

  static RealtimeChannel subscribeToEstadoChanges(
    DumpReportChangeCallback onChange,
  ) {
    final channel = supabaseClient.channel('reportes-vertederos-realtime-mobile');
    channel.onPostgresChanges(
      event: PostgresChangeEvent.update,
      schema: 'public',
      table: _table,
      callback: onChange,
    );
    channel.subscribe();
    return channel;
  }

  static Future<String> _uploadPhoto({
    required String userId,
    required String reportId,
    required String photoPath,
  }) async {
    final file = File(photoPath);
    if (!await file.exists()) {
      throw Exception('No se encontró la foto del reporte');
    }

    final bytes = await file.readAsBytes();
    final extension = _extensionFromPath(photoPath);
    final storagePath = '$userId/$reportId.$extension';

    await supabaseClient.storage.from(_bucket).uploadBinary(
          storagePath,
          bytes,
          fileOptions: FileOptions(
            contentType: _contentTypeForExtension(extension),
            upsert: true,
          ),
        );

    return storagePath;
  }

  static String _extensionFromPath(String path) {
    final parts = path.split('.');
    if (parts.length < 2) return 'jpg';
    final ext = parts.last.toLowerCase();
    if (ext == 'jpeg') return 'jpg';
    return ext;
  }

  static String _contentTypeForExtension(String extension) {
    switch (extension) {
      case 'png':
        return 'image/png';
      case 'webp':
        return 'image/webp';
      case 'heic':
        return 'image/heic';
      default:
        return 'image/jpeg';
    }
  }
}
