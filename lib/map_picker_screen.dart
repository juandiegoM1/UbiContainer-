import 'package:flutter/material.dart';
import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart';
import 'package:geolocator/geolocator.dart' as geo;
import 'dart:async';

/// Pantalla para seleccionar ubicación en el mapa
/// Permite al usuario seleccionar una ubicación exacta moviendo el mapa
class MapPickerScreen extends StatefulWidget {
  final double? initialLatitude;
  final double? initialLongitude;

  const MapPickerScreen({
    super.key,
    this.initialLatitude,
    this.initialLongitude,
  });

  @override
  State<MapPickerScreen> createState() => _MapPickerScreenState();
}

class _MapPickerScreenState extends State<MapPickerScreen> {
  CircleAnnotationManager? circleAnnotationManager;
  MapboxMap? mapboxMap;
  double? selectedLatitude;
  double? selectedLongitude;
  geo.Position? _currentPosition;
  StreamSubscription<geo.Position>? _positionStreamSubscription;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _initialize();
  }

  Future<void> _initialize() async {
    if (widget.initialLatitude != null && widget.initialLongitude != null) {
      selectedLatitude = widget.initialLatitude;
      selectedLongitude = widget.initialLongitude;
    } else {
      await _getCurrentLocation();
    }
    setState(() {
      _isLoading = false;
    });
  }

  Future<void> _getCurrentLocation() async {
    try {
      bool serviceEnabled = await geo.Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        // Usar ubicación por defecto (Cochabamba, Bolivia)
        selectedLatitude = -17.3895;
        selectedLongitude = -66.1568;
        return;
      }

      geo.LocationPermission permission = await geo.Geolocator.checkPermission();
      if (permission == geo.LocationPermission.denied) {
        permission = await geo.Geolocator.requestPermission();
        if (permission == geo.LocationPermission.denied) {
          selectedLatitude = -17.3895;
          selectedLongitude = -66.1568;
          return;
        }
      }

      if (permission == geo.LocationPermission.deniedForever) {
        selectedLatitude = -17.3895;
        selectedLongitude = -66.1568;
        return;
      }

      geo.Position position = await geo.Geolocator.getCurrentPosition();
      selectedLatitude = position.latitude;
      selectedLongitude = position.longitude;
      _currentPosition = position;
      _startLocationStream();
    } catch (e) {
      debugPrint('Error obteniendo ubicación: $e');
      selectedLatitude = -17.3895;
      selectedLongitude = -66.1568;
    }
  }

  void _startLocationStream() {
    const locationSettings = geo.LocationSettings(
      accuracy: geo.LocationAccuracy.high,
      distanceFilter: 10,
    );

    _positionStreamSubscription = geo.Geolocator.getPositionStream(locationSettings: locationSettings).listen(
      (geo.Position position) {
        if (mounted) {
          setState(() {
            _currentPosition = position;
          });
          _updateUserLocationMarker();
        }
      },
    );
  }

  Future<void> _updateUserLocationMarker() async {
    if (circleAnnotationManager == null || _currentPosition == null) return;

    await circleAnnotationManager!.deleteAll();
    
    await circleAnnotationManager!.create(
      CircleAnnotationOptions(
        geometry: Point(
          coordinates: Position(
            _currentPosition!.longitude,
            _currentPosition!.latitude,
          ),
        ),
        circleRadius: 8.0,
        circleColor: Colors.blue.value,
        circleStrokeColor: Colors.white.value,
        circleStrokeWidth: 2.0,
      ),
    );
  }

  void _onMapCreated(MapboxMap map) {
    mapboxMap = map;
    
    map.annotations.createCircleAnnotationManager().then((manager) {
      circleAnnotationManager = manager;
      if (_currentPosition != null) {
        _updateUserLocationMarker();
      }
    });

    if (selectedLatitude != null && selectedLongitude != null) {
      mapboxMap!.setCamera(
        CameraOptions(
          center: Point(
            coordinates: Position(selectedLongitude!, selectedLatitude!),
          ),
          zoom: 15.0,
        ),
      );
    }
  }

  void _confirmLocation() {
    debugPrint('DEBUG: selectedLatitude=$selectedLatitude, selectedLongitude=$selectedLongitude');
    if (selectedLatitude != null && selectedLongitude != null) {
      debugPrint('DEBUG: Navegando con lat=$selectedLatitude, lon=$selectedLongitude');
      Navigator.pop(context, {
        'latitude': selectedLatitude,
        'longitude': selectedLongitude,
      });
    } else {
      debugPrint('DEBUG: No hay ubicación seleccionada');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Por favor selecciona una ubicación'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  void dispose() {
    _positionStreamSubscription?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Seleccionar Ubicación', style: TextStyle(color: Colors.white)),
        backgroundColor: const Color(0xff2D6A4F),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: Column(
        children: [
          Expanded(
            child: Stack(
              children: [
                Positioned.fill(
                  child: MapWidget(
                    onMapCreated: _onMapCreated,
                    styleUri: MapboxStyles.MAPBOX_STREETS,
                    onCameraChangeListener: (event) {
                      if (mapboxMap != null) {
                        mapboxMap!.getCameraState().then((cameraState) {
                          if (cameraState.center.coordinates.lng != null &&
                              cameraState.center.coordinates.lat != null) {
                            setState(() {
                              selectedLongitude = cameraState.center.coordinates.lng!.toDouble();
                              selectedLatitude = cameraState.center.coordinates.lat!.toDouble();
                            });
                          }
                        });
                      }
                    },
                  ),
                ),
                Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(
                        Icons.location_on,
                        color: Colors.red,
                        size: 50,
                      ),
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(8),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.3),
                              blurRadius: 4,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Text(
                          'Lat: ${selectedLatitude?.toStringAsFixed(6)}\nLon: ${selectedLongitude?.toStringAsFixed(6)}',
                          style: const TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ],
                  ),
                ),
                Positioned(
                  top: 16,
                  left: 16,
                  right: 16,
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.2),
                          blurRadius: 8,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.info_outline, color: Color(0xff2D6A4F)),
                        SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            'Mueve el mapa para seleccionar la ubicación exacta del vertedero',
                            style: TextStyle(fontSize: 12),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.all(16),
            color: Colors.white,
            child: SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                icon: const Icon(Icons.check_circle, color: Colors.white),
                label: const Text(
                  'Confirmar Ubicación',
                  style: TextStyle(fontSize: 18, color: Colors.white),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xff2D6A4F),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                onPressed: _confirmLocation,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
