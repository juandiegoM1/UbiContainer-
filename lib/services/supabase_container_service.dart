import 'package:supabase/supabase.dart';
import 'package:ubi_container_new/supabase_client.dart';

typedef ContainerChangeCallback = void Function(PostgresChangePayload payload);

class SupabaseContainerService {
  static const String _table = 'contenedores';

  static Map<String, dynamic> _normalizeRow(Map<String, dynamic> row) {
    return {
      'id': row['id'],
      'latitude': row['latitude'],
      'longitude': row['longitude'],
      'type': row['tipo'],
      'name': row['nombre'],
      'estado': row['estado'] ?? 'activo',
      'nivel_llenado': row['nivel_llenado'] ?? 0,
    };
  }

  static Future<List<Map<String, dynamic>>> fetchContainers() async {
    const selectWithCapacity =
        'id, latitude, longitude, tipo, nombre, estado, nivel_llenado';
    const selectBase = 'id, latitude, longitude, tipo, nombre, estado';

    try {
      final rows = await supabaseClient.from(_table).select(selectWithCapacity).order('id');
      return rows.map<Map<String, dynamic>>(_normalizeRow).toList();
    } catch (e) {
      final message = e.toString().toLowerCase();
      if (!message.contains('nivel_llenado')) rethrow;
    }

    final rows = await supabaseClient.from(_table).select(selectBase).order('id');
    return rows.map<Map<String, dynamic>>(_normalizeRow).toList();
  }

  static Future<int> _fetchNextContainerId() async {
    final rows = await supabaseClient
        .from(_table)
        .select('id')
        .order('id', ascending: false)
        .limit(1);
    if (rows.isEmpty) return 1;
    final maxId = rows.first['id'];
    if (maxId is int) return maxId + 1;
    if (maxId is num) return maxId.toInt() + 1;
    return (int.tryParse('$maxId') ?? 0) + 1;
  }

  static Future<Map<String, dynamic>> createContainer({
    required String tipo,
    required double latitude,
    required double longitude,
    String? nombre,
    int cantidad = 1,
  }) async {
    final nextId = await _fetchNextContainerId();
    final row = await supabaseClient
        .from(_table)
        .insert({
          'id': nextId,
          'tipo': tipo,
          'latitude': latitude,
          'longitude': longitude,
          'nombre': nombre,
          'cantidad': cantidad,
          'estado': 'activo',
        })
        .select('id, latitude, longitude, tipo, nombre')
        .single();

    return {
      'id': row['id'],
      'latitude': row['latitude'],
      'longitude': row['longitude'],
      'type': row['tipo'],
      'name': row['nombre'],
    };
  }

  static Future<Map<String, dynamic>> updateContainer({
    required int id,
    required String tipo,
    required double latitude,
    required double longitude,
    String? nombre,
    int cantidad = 1,
  }) async {
    final row = await supabaseClient
        .from(_table)
        .update({
          'tipo': tipo,
          'latitude': latitude,
          'longitude': longitude,
          'nombre': nombre,
          'cantidad': cantidad,
        })
        .eq('id', id)
        .select('id, latitude, longitude, tipo, nombre')
        .single();

    return {
      'id': row['id'],
      'latitude': row['latitude'],
      'longitude': row['longitude'],
      'type': row['tipo'],
      'name': row['nombre'],
    };
  }

  static Future<void> deleteContainer(int id) async {
    await supabaseClient.from(_table).delete().eq('id', id);
  }

  static RealtimeChannel subscribeToChanges(ContainerChangeCallback onChange) {
    final channel = supabaseClient.channel('contenedores-realtime-mobile');
    channel.onPostgresChanges(
      event: PostgresChangeEvent.all,
      schema: 'public',
      table: _table,
      callback: onChange,
    );
    channel.subscribe();
    return channel;
  }
}
