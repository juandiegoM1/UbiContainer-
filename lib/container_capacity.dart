import 'package:flutter/material.dart';

const int capacityAlertThreshold = 70;

class ContainerCapacityInfo {
  final String label;
  final Color color;
  final int nivel;
  final bool isAlert;

  const ContainerCapacityInfo({
    required this.label,
    required this.color,
    required this.nivel,
    required this.isAlert,
  });
}

int normalizeCapacity(dynamic value) {
  final parsed = value is num ? value.toInt() : int.tryParse('$value') ?? 0;
  return parsed.clamp(0, 100);
}

ContainerCapacityInfo getContainerCapacityInfo({
  required dynamic nivelLlenado,
  required String? estado,
}) {
  final estadoNorm = (estado ?? 'activo').toLowerCase();
  final nivel = normalizeCapacity(nivelLlenado);

  if (estadoNorm == 'fuera_de_servicio') {
    return ContainerCapacityInfo(
      label: 'Fuera de servicio',
      color: const Color(0xff6B7280),
      nivel: nivel,
      isAlert: false,
    );
  }

  if (estadoNorm == 'lleno' || nivel >= 100) {
    return ContainerCapacityInfo(
      label: 'Lleno',
      color: const Color(0xffDC2626),
      nivel: nivel >= 100 ? nivel : 100,
      isAlert: true,
    );
  }

  if (nivel >= capacityAlertThreshold) {
    return ContainerCapacityInfo(
      label: 'Por llenarse ($nivel%)',
      color: const Color(0xffF97316),
      nivel: nivel,
      isAlert: true,
    );
  }

  if (nivel == 0) {
    return const ContainerCapacityInfo(
      label: 'Vacio',
      color: Color(0xff22C55E),
      nivel: 0,
      isAlert: false,
    );
  }

  return ContainerCapacityInfo(
    label: '$nivel% de capacidad',
    color: const Color(0xff3B82F6),
    nivel: nivel,
    isAlert: false,
  );
}
