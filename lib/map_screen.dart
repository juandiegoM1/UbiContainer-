import 'package:flutter/material.dart';
import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart';
import 'package:geolocator/geolocator.dart' as geo;
import 'dart:math' as math;
import 'dart:async';
import 'dart:convert';
import 'dart:ui' as ui;
import 'package:http/http.dart' as http;
import 'package:uuid/uuid.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:ubi_container_new/models.dart';
import 'package:ubi_container_new/services/report_queue_service.dart';
import 'package:ubi_container_new/auth_service.dart';
import 'package:ubi_container_new/config.dart';
import 'package:ubi_container_new/dump_report_screen.dart' hide backendUrl;

const String backendUrl = Config.backendUrl;

class _AvatarSkin {
  final int variant;
  final Color bgColor;

  const _AvatarSkin({
    required this.variant,
    required this.bgColor,
  });
}

const List<_AvatarSkin> _avatarSkins = [
  _AvatarSkin(variant: 0, bgColor: Color(0xffA78767)),
  _AvatarSkin(variant: 1, bgColor: Color(0xff122320)),
  _AvatarSkin(variant: 2, bgColor: Color(0xff2D6A4F)),
  _AvatarSkin(variant: 3, bgColor: Color(0xff1D4ED8)),
  _AvatarSkin(variant: 4, bgColor: Color(0xff6D28D9)),
  _AvatarSkin(variant: 5, bgColor: Color(0xff0F766E)),
];

class _AvatarPersonPainter extends CustomPainter {
  final int variant;

  const _AvatarPersonPainter({required this.variant});

  @override
  void paint(ui.Canvas canvas, ui.Size size) {
    final s = math.min(size.width, size.height);
    final c = Offset(size.width / 2, size.height / 2);

    final skinTone = <Color>[
      const Color(0xffF2C9A5),
      const Color(0xffE7B894),
      const Color(0xffD7A37E),
      const Color(0xffC68A6B),
      const Color(0xffB07559),
      const Color(0xff915B45),
    ][variant % 6];

    final hair = <Color>[
      const Color(0xff111827),
      const Color(0xff3F2D20),
      const Color(0xff6B4F2A),
      const Color(0xff374151),
      const Color(0xff0B1320),
      const Color(0xff1F2937),
    ][(variant + 2) % 6];

    final shirt = <Color>[
      const Color(0xffF59E0B),
      const Color(0xff10B981),
      const Color(0xff60A5FA),
      const Color(0xffFB7185),
      const Color(0xffA78BFA),
      const Color(0xff22C55E),
    ][(variant + 3) % 6];

    final shadowPaint = Paint()
      ..color = Colors.black.withOpacity(0.10)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 10);
    canvas.drawCircle(c + Offset(0, s * 0.04), s * 0.38, shadowPaint);

    final facePaint = Paint()..color = skinTone;
    final faceRect = Rect.fromCircle(center: c.translate(0, -s * 0.02), radius: s * 0.26);
    canvas.drawOval(faceRect, facePaint);

    final neckRect = RRect.fromRectAndRadius(
      Rect.fromCenter(
        center: c.translate(0, s * 0.18),
        width: s * 0.16,
        height: s * 0.14,
      ),
      Radius.circular(s * 0.08),
    );
    canvas.drawRRect(neckRect, facePaint);

    final shirtRect = RRect.fromRectAndRadius(
      Rect.fromCenter(
        center: c.translate(0, s * 0.36),
        width: s * 0.62,
        height: s * 0.42,
      ),
      Radius.circular(s * 0.22),
    );
    canvas.drawRRect(shirtRect, Paint()..color = shirt);

    final collarPaint = Paint()..color = Colors.white.withOpacity(0.65);
    final collarPath = Path()
      ..moveTo(c.dx - s * 0.10, c.dy + s * 0.20)
      ..quadraticBezierTo(c.dx, c.dy + s * 0.28, c.dx + s * 0.10, c.dy + s * 0.20)
      ..lineTo(c.dx + s * 0.06, c.dy + s * 0.34)
      ..quadraticBezierTo(c.dx, c.dy + s * 0.30, c.dx - s * 0.06, c.dy + s * 0.34)
      ..close();
    canvas.drawPath(collarPath, collarPaint);

    final hairPaint = Paint()..color = hair;
    final hairPath = Path()
      ..moveTo(c.dx - s * 0.30, c.dy - s * 0.06)
      ..cubicTo(c.dx - s * 0.26, c.dy - s * 0.30, c.dx - s * 0.02, c.dy - s * 0.34, c.dx + s * 0.18, c.dy - s * 0.24)
      ..cubicTo(c.dx + s * 0.34, c.dy - s * 0.16, c.dx + s * 0.30, c.dy + s * 0.02, c.dx + s * 0.18, c.dy + s * 0.06)
      ..cubicTo(c.dx + s * 0.10, c.dy - s * 0.06, c.dx - s * 0.04, c.dy - s * 0.04, c.dx - s * 0.14, c.dy + s * 0.04)
      ..cubicTo(c.dx - s * 0.22, c.dy + s * 0.10, c.dx - s * 0.30, c.dy + s * 0.08, c.dx - s * 0.30, c.dy - s * 0.06)
      ..close();
    canvas.drawPath(hairPath, hairPaint);

    final eyePaint = Paint()..color = const Color(0xff111827);
    canvas.drawCircle(c.translate(-s * 0.09, -s * 0.06), s * 0.018, eyePaint);
    canvas.drawCircle(c.translate(s * 0.09, -s * 0.06), s * 0.018, eyePaint);

    final blushPaint = Paint()..color = const Color(0xffFB7185).withOpacity(0.18);
    canvas.drawCircle(c.translate(-s * 0.14, -s * 0.02), s * 0.05, blushPaint);
    canvas.drawCircle(c.translate(s * 0.14, -s * 0.02), s * 0.05, blushPaint);

    final mouthPaint = Paint()
      ..color = const Color(0xff9F1239).withOpacity(0.70)
      ..style = PaintingStyle.stroke
      ..strokeWidth = math.max(2.0, s * 0.02)
      ..strokeCap = StrokeCap.round;
    final mouthPath = Path()
      ..moveTo(c.dx - s * 0.07, c.dy + s * 0.06)
      ..quadraticBezierTo(c.dx, c.dy + s * 0.10, c.dx + s * 0.07, c.dy + s * 0.06);
    canvas.drawPath(mouthPath, mouthPaint);
  }

  @override
  bool shouldRepaint(covariant _AvatarPersonPainter oldDelegate) {
    return oldDelegate.variant != variant;
  }
}

class Contenedor {
  final String id;
  final double latitude;
  final double longitude;
  final String type;
  final String? name;

  Contenedor({
    required this.id,
    required this.latitude,
    required this.longitude,
    this.type = 'desconocido',
    this.name,
  });

  factory Contenedor.fromJson(Map<String, dynamic> json) {
    return Contenedor(
      id: json['id']?.toString() ?? '',
      latitude: (json['latitude'] ?? 0.0).toDouble(),
      longitude: (json['longitude'] ?? 0.0).toDouble(),
      type: json['type']?.toString() ?? 'desconocido',
      name: json['name']?.toString() ?? json['nombre']?.toString(),
    );
  }
}

class MapScreen extends StatefulWidget {
  final String userEmail;
  const MapScreen({super.key, required this.userEmail});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  MapboxMap? mapboxMap;
  PointAnnotationManager? pointAnnotationManager;
  CircleAnnotationManager? circleAnnotationManager;
  PolygonAnnotationManager? polygonAnnotationManager;
  geo.Position? _currentPosition;
  List<Contenedor> _containers = [];
  bool _isLoading = true;
  String? _errorMessage;
  StreamSubscription<geo.Position>? _positionStreamSubscription;

  int _avatarSkinIndex = 0;
  
  final ReportQueueService _reportQueueService = reportQueueService;
  List<Reporte> _reports = [];
  
  final TextEditingController _searchController = TextEditingController();
  Contenedor? _nearestContainer;
  double? _nearestDistance;
  String _selectedFilter = 'todos'; // 'todos', 'verde', 'naranja', 'soterrado'
  List<Contenedor> _filteredContainers = [];
  bool _showSearchPanel = false;
  
  bool _isNavigating = false;
  List<Map<String, dynamic>>? _routeInstructions;
  List<List<double>>? _routeCoordinates; // [longitude, latitude]
  int _currentInstructionIndex = 0;
  String? _currentStreetName;
  
  String _selectedTransportMode = 'driving'; // 'driving', 'walking', 'cycling'
  bool _isLoadingRoute = false; // Indicador de carga de ruta
  PolylineAnnotationManager? polylineAnnotationManager;

  final FlutterTts _tts = FlutterTts();
  bool _voiceEnabled = true;
  int _lastSpokenInstructionIndex = -1;

  DateTime _lastRerouteAt = DateTime.fromMillisecondsSinceEpoch(0);

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _searchController.addListener(_onSearchChanged);
    _loadAvatarSkin();
    _initTts();
    _initialize();
    _reports = _reportQueueService.pendingReports;
    _reportQueueService.addListener(_onReportsChanged);
  }

  Future<void> _initTts() async {
    try {
      await _tts.setLanguage('es-ES');
      await _tts.setSpeechRate(0.48);
      await _tts.setVolume(1.0);
      await _tts.setPitch(1.0);
    } catch (e) {
      debugPrint('❌ Error inicializando TTS: $e');
    }
  }

  Future<void> _speakInstruction(int index) async {
    if (!_voiceEnabled) return;
    if (_routeInstructions == null) return;
    if (index < 0 || index >= _routeInstructions!.length) return;
    if (_lastSpokenInstructionIndex == index) return;

    final instruction = _routeInstructions![index]['instruction']?.toString().trim() ?? '';
    if (instruction.isEmpty) return;

    try {
      await _tts.stop();
      await _tts.speak(instruction);
      _lastSpokenInstructionIndex = index;
    } catch (e) {
      debugPrint('❌ Error TTS speak: $e');
    }
  }

  Future<void> _stopTts() async {
    try {
      await _tts.stop();
    } catch (_) {}
  }

  String get _avatarSkinPrefsKey => 'avatar_skin_${widget.userEmail}';

  Future<void> _loadAvatarSkin() async {
    final prefs = await SharedPreferences.getInstance();
    final savedIndex = prefs.getInt(_avatarSkinPrefsKey) ?? 0;
    if (!mounted) return;
    setState(() {
      _avatarSkinIndex = savedIndex.clamp(0, _avatarSkins.length - 1);
    });
  }

  Future<void> _setAvatarSkin(int index) async {
    final clampedIndex = index.clamp(0, _avatarSkins.length - 1);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt(_avatarSkinPrefsKey, clampedIndex);
    if (!mounted) return;
    setState(() {
      _avatarSkinIndex = clampedIndex;
    });
  }

  void _showAvatarSkinPicker() {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xff122320),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: GridView.builder(
              shrinkWrap: true,
              itemCount: _avatarSkins.length,
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 3,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
              ),
              itemBuilder: (context, index) {
                final skin = _avatarSkins[index];
                final isSelected = index == _avatarSkinIndex;

                return InkWell(
                  borderRadius: BorderRadius.circular(16),
                  onTap: () {
                    Navigator.pop(context);
                    _setAvatarSkin(index);
                  },
                  child: Container(
                    decoration: BoxDecoration(
                      color: skin.bgColor,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isSelected
                            ? const Color(0xffA78767)
                            : Colors.white.withOpacity(0.15),
                        width: isSelected ? 3 : 1,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.25),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Center(
                      child: CustomPaint(
                        size: const ui.Size(44, 44),
                        painter: _AvatarPersonPainter(variant: skin.variant),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        );
      },
    );
  }
  
  void _onSearchChanged() {
    _filterContainers();
    Future.microtask(() => _updateMarkers());
  }
  
  void _onReportsChanged() {
    if (mounted) {
      setState(() {
        _reports = _reportQueueService.pendingReports;
      });
    }
  }

  Future<void> _initialize() async {
    await _getUserLocation();
    await _fetchContainers();
    setState(() {
      _isLoading = false;
    });
  }

  Future<void> _getUserLocation() async {
    bool serviceEnabled;
    geo.LocationPermission permission;

    serviceEnabled = await geo.Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      _showMessage('Ubicación deshabilitada', 'Por favor, habilita los servicios de ubicación.');
      return;
    }

    permission = await geo.Geolocator.checkPermission();
    if (permission == geo.LocationPermission.denied) {
      permission = await geo.Geolocator.requestPermission();
      if (permission == geo.LocationPermission.denied) {
        _showMessage('Permisos de ubicación denegados', 'Necesitamos acceso a tu ubicación.');
        return;
      }
    }

    if (permission == geo.LocationPermission.deniedForever) {
      _showMessage('Permisos denegados permanentemente', 'Habilita los permisos desde la configuración.');
      return;
    }

    try {
      geo.Position position = await geo.Geolocator.getCurrentPosition(
        locationSettings: const geo.LocationSettings(
          accuracy: geo.LocationAccuracy.high,
        ),
      );
      setState(() {
        _currentPosition = position;
      });

      if (mapboxMap != null && _currentPosition != null) {
        mapboxMap!.setCamera(
          CameraOptions(
            center: Point(
              coordinates: Position(
                _currentPosition!.longitude,
                _currentPosition!.latitude,
              ),
            ),
            zoom: 14.0,
          ),
        );
        _updateMarkers();
      }

      _positionStreamSubscription?.cancel();
      _positionStreamSubscription = geo.Geolocator.getPositionStream(
        locationSettings: const geo.LocationSettings(
          accuracy: geo.LocationAccuracy.high,
          distanceFilter: 10, // Actualizar cada 10 metros
        ),
      ).listen(
        (geo.Position position) {
          if (mounted) {
            setState(() {
              _currentPosition = position;
            });
            _findNearestContainer();
            _filterContainers();
            _updateMarkers();
            
            if (_isNavigating) {
              _updateNavigation(position);
            } else {
              if (mapboxMap != null) {
                mapboxMap!.setCamera(
                  CameraOptions(
                    center: Point(
                      coordinates: Position(
                        position.longitude,
                        position.latitude,
                      ),
                    ),
                    zoom: 14.0,
                  ),
                );
              }
            }
          }
        },
        onError: (error) {
          print('Error en stream de ubicación: $error');
        },
      );
    } catch (e) {
      _showMessage('Error', 'No se pudo obtener la ubicación: $e');
    }
  }

  Future<void> _fetchContainers() async {
    try {
      final response = await http.get(
        Uri.parse('$backendUrl/containers'),
        headers: {'ngrok-skip-browser-warning': 'true'},
      );
      print('📦 Response status: ${response.statusCode}');
      print('📦 Response body: ${response.body}');
      
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        print('📦 Contenedores recibidos: ${data.length}');
        
        List<Contenedor> fetchedContainers = data
            .map((json) => Contenedor.fromJson(json))
            .toList();
        
        print('📦 Contenedores parseados: ${fetchedContainers.length}');
        
        int totalVerdes = fetchedContainers.where((c) => c.type == 'verde').length;
        int totalNaranjas = fetchedContainers.where((c) => c.type == 'naranja').length;
        int totalSoterrados = fetchedContainers.where((c) => c.type == 'soterrado').length;
        print('   📊 Total: $totalVerdes verdes, $totalNaranjas naranjas y $totalSoterrados soterrados');
        
        var ejemplosSoterrados = fetchedContainers.where((c) => c.type == 'soterrado').take(3).toList();
        if (ejemplosSoterrados.isNotEmpty) {
          print('   🔴 Ejemplos de soterrados:');
          for (var c in ejemplosSoterrados) {
            print('      - ID ${c.id}: lat=${c.latitude}, lon=${c.longitude}');
          }
        }
        
        setState(() {
          _containers = fetchedContainers;
        });
        _findNearestContainer();
        _filterContainers();
        _updateMarkers();
      } else {
        _showMessage('Error al cargar contenedores', 'Código: ${response.statusCode}');
      }
    } catch (e) {
      print('❌ Error al cargar contenedores: $e');
      _showMessage('Error de conexión', 'No se pudo conectar al servidor: $e');
    }
  }


  double _calculateDistance(double lat1, double lon1, double lat2, double lon2) {
    return geo.Geolocator.distanceBetween(lat1, lon1, lat2, lon2);
  }

  void _findNearestContainer() {
    if (_currentPosition == null || _containers.isEmpty) {
      setState(() {
        _nearestContainer = null;
        _nearestDistance = null;
      });
      return;
    }

    List<Contenedor> containersToSearch;
    if (_selectedFilter == 'todos') {
      containersToSearch = _containers;
    } else {
      containersToSearch = _filteredContainers.isNotEmpty 
          ? _filteredContainers 
          : _containers.where((container) => container.type == _selectedFilter).toList();
    }

    if (containersToSearch.isEmpty) {
      setState(() {
        _nearestContainer = null;
        _nearestDistance = null;
      });
      return;
    }

    Contenedor? nearest;
    double? minDistance;

    for (var container in containersToSearch) {
      if (container.latitude == 0.0 || container.longitude == 0.0) continue;

      double distance = _calculateDistance(
        _currentPosition!.latitude,
        _currentPosition!.longitude,
        container.latitude,
        container.longitude,
      );

      if (minDistance == null || distance < minDistance) {
        minDistance = distance;
        nearest = container;
      }
    }

    setState(() {
      _nearestContainer = nearest;
      _nearestDistance = minDistance;
    });
  }

  void _filterContainers() {
    String searchText = _searchController.text.toLowerCase().trim();
    
    List<Contenedor> filtered = _containers.where((container) {
      bool matchesType = _selectedFilter == 'todos' || 
                        container.type == _selectedFilter;
      
      bool matchesSearch = searchText.isEmpty ||
                          container.id.toLowerCase().contains(searchText) ||
                          container.type.toLowerCase().contains(searchText) ||
                          (container.name?.toLowerCase().contains(searchText) ?? false);
      
      return matchesType && matchesSearch;
    }).toList();

    if (_currentPosition != null) {
      filtered.sort((a, b) {
        double distA = _calculateDistance(
          _currentPosition!.latitude,
          _currentPosition!.longitude,
          a.latitude,
          a.longitude,
        );
        double distB = _calculateDistance(
          _currentPosition!.latitude,
          _currentPosition!.longitude,
          b.latitude,
          b.longitude,
        );
        return distA.compareTo(distB);
      });
    }

    setState(() {
      _filteredContainers = filtered;
    });
  }

  void _goToNearestContainer() async {
    if (_nearestContainer == null || mapboxMap == null) {
      _showMessage('Sin contenedores', 'No hay contenedores cercanos disponibles.');
      return;
    }

    if (_currentPosition == null) {
      _showMessage('Sin ubicación', 'Esperando ubicación del GPS...');
      return;
    }

    await _getRouteToContainer(_nearestContainer!);

    if (_routeCoordinates != null && _routeCoordinates!.isNotEmpty) {
      double minLat = _currentPosition!.latitude;
      double maxLat = _currentPosition!.latitude;
      double minLon = _currentPosition!.longitude;
      double maxLon = _currentPosition!.longitude;

      for (var coord in _routeCoordinates!) {
        double lon = coord[0]; // longitude
        double lat = coord[1]; // latitude
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
        if (lon < minLon) minLon = lon;
        if (lon > maxLon) maxLon = lon;
      }

      double centerLat = (minLat + maxLat) / 2;
      double centerLon = (minLon + maxLon) / 2;

      mapboxMap!.setCamera(
        CameraOptions(
          center: Point(
            coordinates: Position(centerLon, centerLat),
          ),
          zoom: 14.0,
        ),
      );
    } else {
      mapboxMap!.setCamera(
        CameraOptions(
          center: Point(
            coordinates: Position(
              _nearestContainer!.longitude,
              _nearestContainer!.latitude,
            ),
          ),
          zoom: 16.0,
        ),
      );
    }

    setState(() {
      _showSearchPanel = true;
    });
  }

  Future<void> _getRouteToContainer(Contenedor container) async {
    if (_currentPosition == null) return;

    setState(() {
      _isLoadingRoute = true;
    });

    if (polylineAnnotationManager != null) {
      await polylineAnnotationManager!.deleteAll();
    }
    
    _routeCoordinates = null;
    _routeInstructions = null;

    try {
      const String mapboxToken = 'TU_TOKEN_DE_MAPBOX_AQUI';
      
      String origin = '${_currentPosition!.longitude},${_currentPosition!.latitude}';
      String destination = '${container.longitude},${container.latitude}';
      
      String profile = _selectedTransportMode; // 'driving', 'walking', 'cycling'
      
      String url = 'https://api.mapbox.com/directions/v5/mapbox/$profile/$origin;$destination?'
          'geometries=geojson&'
          'steps=true&'
          'overview=full&'
          'banner_instructions=true&'  
          'voice_instructions=false&'  
          'language=es&'  
          'access_token=$mapboxToken';

      print('🗺️ Obteniendo ruta: $url');

      final response = await http.get(Uri.parse(url));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        
        if (data['routes'] != null && data['routes'].isNotEmpty) {
          final route = data['routes'][0];
          final geometry = route['geometry'];
          final coordinates = geometry['coordinates'] as List;
          
          _routeCoordinates = coordinates.map((coord) {
            return [coord[0] as double, coord[1] as double];
          }).toList();

          _routeInstructions = [];
          if (route['legs'] != null && route['legs'].isNotEmpty) {
            final leg = route['legs'][0];
            if (leg['steps'] != null) {
              for (var step in leg['steps']) {
                final maneuver = step['maneuver'] ?? {};
                
                String? streetName;
                
                if (step['bannerInstructions'] != null && step['bannerInstructions'] is List) {
                  List bannerInstructions = step['bannerInstructions'] as List;
                  if (bannerInstructions.isNotEmpty) {
                    var banner = bannerInstructions[0];
                    if (banner['primary'] != null && banner['primary'] is Map) {
                      var primary = banner['primary'] as Map;
                      if (primary['text'] != null) {
                        String bannerText = primary['text'].toString().trim();
                        if (bannerText.isNotEmpty && !_isGenericName(bannerText)) {
                          List<String> patterns = [
                            r'en\s+([A-ZÁÉÍÓÚÑ][A-Za-záéíóúñÁÉÍÓÚÑ\s\.]+)',
                            r'hacia\s+([A-ZÁÉÍÓÚÑ][A-Za-záéíóúñÁÉÍÓÚÑ\s\.]+)',
                            r'por\s+([A-ZÁÉÍÓÚÑ][A-Za-záéíóúñÁÉÍÓÚÑ\s\.]+)',
                          ];
                          for (String pattern in patterns) {
                            RegExp regex = RegExp(pattern, caseSensitive: false);
                            Match? match = regex.firstMatch(bannerText);
                            if (match != null && match.groupCount >= 1) {
                              String? extracted = match.group(1);
                              if (extracted != null && !_isGenericName(extracted)) {
                                streetName = extracted.trim();
                                break;
                              }
                            }
                          }
                          if (streetName == null && _hasStreetPrefix(bannerText)) {
                            streetName = bannerText;
                          }
                        }
                      }
                      if ((streetName == null || _isGenericName(streetName)) && 
                          primary['components'] != null && primary['components'] is List) {
                        List components = primary['components'] as List;
                        for (var component in components) {
                          if (component is Map) {
                            String? type = component['type']?.toString();
                            String? text = component['text']?.toString();
                            if ((type == 'name' || type == 'text') && 
                                text != null && 
                                text.isNotEmpty && 
                                !_isGenericName(text) &&
                                _hasStreetPrefix(text)) {
                              streetName = text.trim();
                              break;
                            }
                          }
                        }
                      }
                    }
                  }
                }
                
                if ((streetName == null || streetName.isEmpty || _isGenericName(streetName)) &&
                    step['name'] != null) {
                  if (step['name'] is List) {
                    List nameList = step['name'] as List;
                    if (nameList.isNotEmpty) {
                      for (var name in nameList) {
                        String nameStr = name.toString().trim();
                        if (nameStr.isNotEmpty && 
                            nameStr != 'null' && 
                            !_isGenericName(nameStr)) {
                          streetName = nameStr;
                          break;
                        }
                      }
                      if (streetName == null && nameList.isNotEmpty) {
                        streetName = nameList[0].toString().trim();
                      }
                    }
                  } else {
                    String nameStr = step['name'].toString().trim();
                    if (nameStr.isNotEmpty && nameStr != 'null') {
                      streetName = nameStr;
                    }
                  }
                }
                
                if ((streetName == null || streetName.isEmpty || _isGenericName(streetName)) && 
                    step['intersections'] != null) {
                  List intersections = step['intersections'] as List;
                  for (var intersection in intersections) {
                    if (intersection['street_names'] != null) {
                      List streetNames = intersection['street_names'] as List;
                      if (streetNames.isNotEmpty) {
                        for (var name in streetNames) {
                          String nameStr = name.toString().trim();
                          if (nameStr.isNotEmpty && 
                              nameStr != 'null' && 
                              !_isGenericName(nameStr)) {
                            streetName = nameStr;
                            break;
                          }
                        }
                        if (streetName == null && streetNames.isNotEmpty) {
                          streetName = streetNames[0].toString().trim();
                        }
                        break;
                      }
                    }
                  }
                }
                
                if ((streetName == null || streetName.isEmpty || _isGenericName(streetName)) &&
                    step['way_name'] != null) {
                  String wayName = step['way_name'].toString().trim();
                  if (wayName.isNotEmpty && wayName != 'null' && !_isGenericName(wayName)) {
                    streetName = wayName;
                  }
                }
                
                if ((streetName == null || streetName.isEmpty || _isGenericName(streetName)) &&
                    step['ref'] != null) {
                  String refStr = step['ref'].toString().trim();
                  if (refStr.isNotEmpty && refStr != 'null' && !_isGenericName(refStr)) {
                    streetName = refStr;
                  }
                }
                
                if (streetName == null || streetName.isEmpty || _isGenericName(streetName)) {
                  String? instruction = maneuver['instruction']?.toString();
                  if (instruction != null && instruction.isNotEmpty) {
                    
                    if (instruction.toLowerCase().contains('hacia')) {
                      List<String> parts = instruction.split(RegExp(r'\s+hacia\s+', caseSensitive: false));
                      if (parts.length > 1) {
                        streetName = parts[1].trim();
                      }
                    }
                    else if (instruction.toLowerCase().contains(RegExp(r'\s+en\s+'))) {
                      List<String> parts = instruction.split(RegExp(r'\s+en\s+', caseSensitive: false));
                      if (parts.length > 1) {
                        streetName = parts[1].trim();
                      }
                    }
                    else if (instruction.toLowerCase().contains(RegExp(r'\s+por\s+'))) {
                      List<String> parts = instruction.split(RegExp(r'\s+por\s+', caseSensitive: false));
                      if (parts.length > 1) {
                        streetName = parts[1].trim();
                      }
                    }
                  }
                }
                
                if (streetName != null && streetName.isNotEmpty) {
                  streetName = streetName.trim();
                  streetName = streetName.replaceAll(RegExp(r'\.+$'), '');
                  streetName = streetName.replaceAll(RegExp(r'\s+'), ' ');
                  streetName = streetName.trim();
                  
                  if (!_hasStreetPrefix(streetName)) {
                    streetName = streetName.replaceAll(RegExp(r'^(el|la|los|las)\s+', caseSensitive: false), '');
                    streetName = streetName.trim();
                  }
                  
                  if (_isGenericName(streetName)) {
                    streetName = null;
                  }
                }
                
                if (streetName == null || streetName.isEmpty || _isGenericName(streetName)) {
                  streetName = null; 
                }
                
                print('📍 Step ${_routeInstructions!.length + 1}: instrucción="${maneuver['instruction']}", nombre="$streetName"');
                print('   - step["name"]: ${step['name']}');
                print('   - step["ref"]: ${step['ref']}');
                print('   - step["way_name"]: ${step['way_name']}');
                if (step['bannerInstructions'] != null) {
                  print('   - step["bannerInstructions"]: ${step['bannerInstructions']}');
                }
                if (step['intersections'] != null) {
                  List intersections = step['intersections'] as List;
                  for (int i = 0; i < intersections.length; i++) {
                    var intersection = intersections[i];
                    if (intersection['street_names'] != null) {
                      print('   - intersection[$i]["street_names"]: ${intersection['street_names']}');
                    }
                  }
                }
                
                _routeInstructions!.add({
                  'instruction': _translateInstruction(maneuver['instruction'] ?? ''),
                  'type': maneuver['type'] ?? '',
                  'modifier': maneuver['modifier'] ?? '',
                  'distance': step['distance']?.toDouble() ?? 0.0,
                  'duration': step['duration']?.toDouble() ?? 0.0,
                  'name': streetName,
                });
              }
            }
          }

          await _drawRoute();
          
          setState(() {
            _isLoadingRoute = false;
          });

          print('✅ Ruta obtenida: ${_routeCoordinates!.length} puntos, ${_routeInstructions!.length} instrucciones');
        } else {
          print('⚠️ No se encontró ruta');
          _routeCoordinates = null;
          _routeInstructions = null;
          setState(() {
            _isLoadingRoute = false;
          });
        }
      } else {
        print('❌ Error obteniendo ruta: ${response.statusCode}');
        _routeCoordinates = null;
        _routeInstructions = null;
        setState(() {
          _isLoadingRoute = false;
        });
      }
    } catch (e) {
      print('❌ Error al obtener ruta: $e');
      _routeCoordinates = null;
      _routeInstructions = null;
      setState(() {
        _isLoadingRoute = false;
      });
    }
  }

  Future<void> _drawRoute() async {
    if (mapboxMap == null || _routeCoordinates == null || _routeCoordinates!.isEmpty) {
      print('⚠️ No se puede dibujar ruta: mapa o coordenadas no disponibles');
      return;
    }

    if (polylineAnnotationManager == null) {
      print('⚠️ PolylineAnnotationManager no está listo, intentando recrearlo...');
      if (mapboxMap != null) {
        try {
          polylineAnnotationManager = await mapboxMap!.annotations.createPolylineAnnotationManager();
          print('✅ PolylineAnnotationManager recreado');
        } catch (e) {
          print('❌ Error recreando PolylineAnnotationManager: $e');
          return;
        }
      } else {
        return;
      }
    }

    try {
      await polylineAnnotationManager!.deleteAll();
      await Future.delayed(const Duration(milliseconds: 100));

      List<Position> positions = _routeCoordinates!.map((coord) {
        return Position(coord[0], coord[1]); // longitude, latitude
      }).toList();

      final polyline = PolylineAnnotationOptions(
        geometry: LineString(coordinates: positions),
        lineColor: Colors.blue.shade700.value,
        lineWidth: 8.0, // Más gruesa para mejor visibilidad
        lineOpacity: 0.9,
      );

      await polylineAnnotationManager!.create(polyline);
      print('✅ Ruta dibujada en el mapa');
    } catch (e) {
      print('❌ Error dibujando ruta: $e');
    }
  }

  void _startNavigation() {
    if (_routeInstructions == null || _routeInstructions!.isEmpty) {
      _showMessage('Sin ruta', 'No hay ruta disponible para navegar.');
      return;
    }

    setState(() {
      _isNavigating = true;
      _currentInstructionIndex = 0;
      _lastSpokenInstructionIndex = -1;
      _updateCurrentStreet(); // Actualizar dentro de setState para que se refleje en el UI
    });

    Future.microtask(() => _speakInstruction(_currentInstructionIndex));

    if (mapboxMap != null && _currentPosition != null) {
      mapboxMap!.setCamera(
        CameraOptions(
          center: Point(
            coordinates: Position(
              _currentPosition!.longitude,
              _currentPosition!.latitude,
            ),
          ),
          zoom: 17.0,
          bearing: 0.0,
        ),
      );
    }
  }

  void _stopNavigation() async {
    await _stopTts();
    setState(() {
      _isNavigating = false;
      _currentInstructionIndex = 0;
      _currentStreetName = null;
      _lastSpokenInstructionIndex = -1;
    });
    
    if (polylineAnnotationManager != null) {
      await polylineAnnotationManager!.deleteAll();
    }
    
    setState(() {
      _routeCoordinates = null;
      _routeInstructions = null;
    });
    
    print('✅ Navegación detenida y rutas limpiadas');
  }

  void _updateCurrentStreet() {
    if (!_isNavigating || _currentPosition == null || _routeInstructions == null) {
      return;
    }

    if (_currentInstructionIndex < _routeInstructions!.length) {
      String? streetName = _routeInstructions![_currentInstructionIndex]['name'] as String?;
      
      if (streetName != null && streetName.isNotEmpty && !_isGenericName(streetName)) {
        streetName = streetName.trim();
        streetName = streetName.replaceAll(RegExp(r'\.+$'), '');
        streetName = streetName.replaceAll(RegExp(r'\s+'), ' ');
        streetName = streetName.trim();
        
        if (!_hasStreetPrefix(streetName)) {
          streetName = streetName.replaceAll(RegExp(r'^(el|la|los|las)\s+', caseSensitive: false), '');
          streetName = streetName.trim();
        }
        
        if (!_isGenericName(streetName) && streetName.isNotEmpty) {
          _currentStreetName = streetName;
          return;
        }
      }
      
      String? instruction = _routeInstructions![_currentInstructionIndex]['instruction'] as String?;
      if (instruction != null && instruction.isNotEmpty) {
        
        if (instruction.toLowerCase().contains(RegExp(r'\s+hacia\s+'))) {
          List<String> parts = instruction.split(RegExp(r'\s+hacia\s+', caseSensitive: false));
          if (parts.length > 1) {
            streetName = parts[1].trim();
          }
        }
        else if (instruction.toLowerCase().contains(RegExp(r'\s+en\s+'))) {
          List<String> parts = instruction.split(RegExp(r'\s+en\s+', caseSensitive: false));
          if (parts.length > 1) {
            streetName = parts[1].trim();
          }
        }
        else if (instruction.toLowerCase().contains(RegExp(r'\s+por\s+'))) {
          List<String> parts = instruction.split(RegExp(r'\s+por\s+', caseSensitive: false));
          if (parts.length > 1) {
            streetName = parts[1].trim();
          }
        }
        
        if (streetName != null) {
          streetName = streetName.trim();
          streetName = streetName.replaceAll(RegExp(r'\.+$'), '');
          streetName = streetName.replaceAll(RegExp(r'\s+'), ' ');
          streetName = streetName.trim();
          
          if (!_hasStreetPrefix(streetName)) {
            streetName = streetName.replaceAll(RegExp(r'^(el|la|los|las)\s+', caseSensitive: false), '');
            streetName = streetName.trim();
          }
        }
        
        if (streetName != null && !_isGenericName(streetName) && streetName.isNotEmpty) {
          _currentStreetName = streetName;
        } else {
          _currentStreetName = null; // Se manejará en el UI
        }
      } else {
        _currentStreetName = null; // Se manejará en el UI
      }
    }
  }

  void _updateNavigation(geo.Position newPosition) {
    if (!_isNavigating || _routeCoordinates == null || _routeCoordinates!.isEmpty) {
      return;
    }

    if (_routeInstructions == null || _routeInstructions!.isEmpty) {
      return;
    }

    double minDistance = double.infinity;
    int nearestPointIndex = 0;

    for (int i = 0; i < _routeCoordinates!.length; i++) {
      double distance = _calculateDistance(
        newPosition.latitude,
        newPosition.longitude,
        _routeCoordinates![i][1], // latitude
        _routeCoordinates![i][0], // longitude
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestPointIndex = i;
      }
    }

    if (_nearestContainer != null && minDistance > 45) {
      final now = DateTime.now();
      if (now.difference(_lastRerouteAt).inSeconds >= 12) {
        _lastRerouteAt = now;
        debugPrint('🔁 Usuario fuera de ruta (${minDistance.toStringAsFixed(0)}m). Recalculando...');
        Future.microtask(() async {
          await _getRouteToContainer(_nearestContainer!);
          if (!mounted) return;
          setState(() {
            _currentInstructionIndex = 0;
            _lastSpokenInstructionIndex = -1;
            _updateCurrentStreet();
          });
          await _speakInstruction(_currentInstructionIndex);
        });
        return;
      }
    }

    if (_routeInstructions!.isNotEmpty) {
      double progress = nearestPointIndex / _routeCoordinates!.length;
      int estimatedIndex = (progress * _routeInstructions!.length).floor();
      
      if (estimatedIndex < _routeInstructions!.length) {
        int newIndex = estimatedIndex.clamp(0, _routeInstructions!.length - 1);
        bool indexChanged = newIndex != _currentInstructionIndex;
        
        if (indexChanged) {
          setState(() {
            _currentInstructionIndex = newIndex;
            _updateCurrentStreet(); // Actualizar dentro de setState para que se refleje en el UI
          });

          Future.microtask(() => _speakInstruction(newIndex));
        } else {
          setState(() {
            _updateCurrentStreet();
          });
        }
      }
    }

    if (mapboxMap != null) {
      mapboxMap!.setCamera(
        CameraOptions(
          center: Point(
            coordinates: Position(
              newPosition.longitude,
              newPosition.latitude,
            ),
          ),
          zoom: 17.0,
        ),
      );
      
      setState(() {
        _currentPosition = newPosition;
      });
      Future.microtask(() => _updateMarkers());
    }
  }

  bool _isGenericName(String? name) {
    if (name == null || name.isEmpty || name.trim().isEmpty) {
      return true;
    }
    
    String lowerName = name.toLowerCase().trim();
    
    if (lowerName == 'este' || 
        lowerName == 'oeste' || 
        lowerName == 'norte' || 
        lowerName == 'sur' ||
        lowerName == 'continuar' ||
        lowerName == 'sin nombre' ||
        lowerName == 'null' ||
        lowerName.length < 2) {
      return true;
    }
    
    return false;
  }
  
  bool _hasStreetPrefix(String name) {
    if (name.isEmpty) return false;
    
    String lowerName = name.toLowerCase().trim();
    
    List<String> streetPrefixes = [
      'avenida', 'av.', 'av', 'avda', 'avda.',
      'calle', 'c.', 'c/', 'cal',
      'boulevard', 'blvd.', 'blvd', 'boul.',
      'paseo', 'p.',
      'carretera', 'carr.', 'carretera',
      'camino', 'cam.',
      'plaza', 'pl.',
      'ruta', 'rt.',
      'autopista', 'aut.',
      'vía', 'via',
    ];
    
    for (String prefix in streetPrefixes) {
      if (lowerName.startsWith(prefix + ' ') || lowerName == prefix) {
        return true;
      }
    }
    
    return false;
  }

  String _translateInstruction(String instruction) {
    if (instruction.isEmpty) return 'Continuar';
    
    String lower = instruction.toLowerCase();
    
    if (lower.contains('turn left') || lower.contains('gire a la izquierda')) {
      return 'Gire a la izquierda';
    } else if (lower.contains('turn right') || lower.contains('gire a la derecha')) {
      return 'Gire a la derecha';
    } else if (lower.contains('go straight') || lower.contains('continúe')) {
      return 'Continúe recto';
    } else if (lower.contains('u-turn') || lower.contains('gire en u')) {
      return 'Gire en U';
    } else if (lower.contains('slight left') || lower.contains('ligeramente a la izquierda')) {
      return 'Gire ligeramente a la izquierda';
    } else if (lower.contains('slight right') || lower.contains('ligeramente a la derecha')) {
      return 'Gire ligeramente a la derecha';
    } else if (lower.contains('sharp left') || lower.contains('pronunciada a la izquierda')) {
      return 'Gire pronunciadamente a la izquierda';
    } else if (lower.contains('sharp right') || lower.contains('pronunciada a la derecha')) {
      return 'Gire pronunciadamente a la derecha';
    }
    
    return instruction;
  }

  String _formatDistance(double? distance) {
    if (distance == null) return 'Calculando...';
    
    if (distance < 1000) {
      return '${distance.toStringAsFixed(0)} m';
    } else {
      return '${(distance / 1000).toStringAsFixed(2)} km';
    }
  }

  Future<void> _updateMarkers() async {
    if (pointAnnotationManager == null || circleAnnotationManager == null) {
      print('⚠️ AnnotationManagers no están listos');
      return;
    }

    await pointAnnotationManager!.deleteAll();
    await circleAnnotationManager!.deleteAll();

    List<CircleAnnotationOptions> circleAnnotations = [];
    List<PointAnnotationOptions> pointAnnotations = [];

    if (_currentPosition != null) {
      print('📍 Agregando marcador de usuario en: ${_currentPosition!.latitude}, ${_currentPosition!.longitude}');
      circleAnnotations.add(
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

    List<Contenedor> containersToShow = (_selectedFilter != 'todos' || 
                                         _searchController.text.isNotEmpty)
        ? _filteredContainers
        : _containers;

    Map<String, List<Contenedor>> groupedContainers = {};
    for (var container in containersToShow) {
      if (container.latitude != 0.0 && container.longitude != 0.0) {
        String key = '${container.latitude.toStringAsFixed(6)},${container.longitude.toStringAsFixed(6)}';
        if (!groupedContainers.containsKey(key)) {
          groupedContainers[key] = [];
        }
        groupedContainers[key]!.add(container);
      }
    }

    print('📦 Agregando ${containersToShow.length} contenedores en ${groupedContainers.length} ubicaciones');

    groupedContainers.forEach((key, containers) {
      var firstContainer = containers.first;
      int count = containers.length;
      
      int soterrados = containers.where((c) => c.type == 'soterrado').length;
      int verdes = containers.where((c) => c.type == 'verde').length;
      int naranjas = containers.where((c) => c.type == 'naranja').length;
      
      print('   ✓ Ubicación ${firstContainer.latitude}, ${firstContainer.longitude}: $count contenedores (${verdes} verdes, ${naranjas} naranjas, ${soterrados} soterrados)');

      Color circleColor = Colors.green;
      if (soterrados > 0) {
        circleColor = Colors.red;
      } else if (naranjas > 0) {
        circleColor = Colors.orange;
      } else {
        circleColor = Colors.green;
      }
      
      bool isNearest = _nearestContainer != null &&
          firstContainer.id == _nearestContainer!.id &&
          firstContainer.latitude == _nearestContainer!.latitude &&
          firstContainer.longitude == _nearestContainer!.longitude;
      
      double radius = 8.0;
      
      if (isNearest) {
        circleColor = const Color(0xff6D28D9);
      }
      
      circleAnnotations.add(
        CircleAnnotationOptions(
          geometry: Point(
            coordinates: Position(
              firstContainer.longitude,
              firstContainer.latitude,
            ),
          ),
          circleRadius: radius,
          circleColor: circleColor.value,
          circleStrokeColor: isNearest ? const Color(0xffA78BFA).value : Colors.white.value,
          circleStrokeWidth: 2.0,
        ),
      );

      if (count > 1) {
        pointAnnotations.add(
          PointAnnotationOptions(
            geometry: Point(
              coordinates: Position(
                firstContainer.longitude,
                firstContainer.latitude,
              ),
            ),
            textField: count.toString(),
            textSize: 14.0,
            textColor: Colors.white.value,
            textHaloColor: Colors.black.value,
            textHaloWidth: 2.0,
            textHaloBlur: 0.5,
            iconOpacity: 0.0,
            iconSize: 0.0,
          ),
        );
      }
    });

    if (circleAnnotations.isNotEmpty) {
      print('✅ Creando ${circleAnnotations.length} marcadores circulares');
      await circleAnnotationManager!.createMulti(circleAnnotations);
    }

    if (pointAnnotations.isNotEmpty) {
      print('✅ Creando ${pointAnnotations.length} marcadores de texto');
      await pointAnnotationManager!.createMulti(pointAnnotations);
    }
  }

  void _showMessage(String title, String content) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$title: $content'),
        duration: const Duration(seconds: 4),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: TabBarView(
        controller: _tabController,
        physics: const NeverScrollableScrollPhysics(), // Evita swipe entre tabs
        children: [
          _buildMapTab(),
          _buildReportsTab(),
          _buildProfileTab(),
        ],
      ),
      bottomNavigationBar: _buildBottomTabBar(),
      floatingActionButton: null,
      floatingActionButtonLocation: null,
    );
  }

  Widget _buildMapTab() {
    return _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _errorMessage != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.error_outline, size: 64, color: Colors.red),
                      const SizedBox(height: 16),
                      Text(
                        'Error al cargar el mapa',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                      const SizedBox(height: 8),
                      Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Text(
                          _errorMessage!,
                          textAlign: TextAlign.center,
                        ),
                      ),
                      ElevatedButton(
                        onPressed: () {
                          setState(() {
                            _errorMessage = null;
                            _isLoading = true;
                          });
                          _initialize();
                        },
                        child: const Text('Reintentar'),
                      ),
                    ],
                  ),
                )
              : Stack(
                  children: [
                    SizedBox.expand(
                  child: MapWidget(
                    key: const ValueKey("mapWidget"),
                    cameraOptions: CameraOptions(
                      center: _currentPosition != null
                          ? Point(
                              coordinates: Position(
                                _currentPosition!.longitude,
                                _currentPosition!.latitude,
                              ),
                            )
                          : Point(coordinates: Position(-66.1568, -17.3895)),
                      zoom: 14.0,
                    ),
                    styleUri: MapboxStyles.MAPBOX_STREETS,
                    textureView: true,
                    onMapCreated: (MapboxMap map) async {
                      print('✅ Mapa creado correctamente');
                      mapboxMap = map;
                      
                      try {
                        pointAnnotationManager = await map.annotations.createPointAnnotationManager();
                        print('✅ PointAnnotationManager creado');
                            
                            circleAnnotationManager = await map.annotations.createCircleAnnotationManager();
                            print('✅ CircleAnnotationManager creado');
                            
                            polylineAnnotationManager = await map.annotations.createPolylineAnnotationManager();
                            print('✅ PolylineAnnotationManager creado');
                            
                        _updateMarkers();
                      } catch (e) {
                            print('❌ Error creando AnnotationManagers: $e');
                        setState(() {
                          _errorMessage = 'Error al inicializar marcadores: $e';
                        });
                      }
                    },
                    onMapLoadErrorListener: (eventData) {
                      print('❌ Error de carga del mapa: ${eventData.type} - ${eventData.message}');
                      setState(() {
                        _errorMessage = 'Error de Mapbox: ${eventData.message}';
                      });
                    },
                    onStyleLoadedListener: (_) {
                      print('✅ Estilo del mapa cargado correctamente');
                    },
                  ),
                ),
                    if (!_isNavigating)
                      _buildSearchAndFiltersBar(),
                    if (_isNavigating)
                      _buildNavigationPanel(),
                    if (_isNavigating)
                      _buildNavigationFloatingButtons(),
                    if (!_isNavigating && !_showSearchPanel)
                      _buildStackFloatingButtons(),
                    if (_showSearchPanel && _nearestContainer != null && !_isNavigating)
                      _buildNearestContainerPanel(),
                  ],
                );
  }


  Widget _buildSearchAndFiltersBar() {
    return Positioned(
      top: 16,
      left: 16,
      right: 16,
      child: SafeArea(
        child: Column(
          children: [
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(30),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.2),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: ValueListenableBuilder<TextEditingValue>(
                valueListenable: _searchController,
                builder: (context, value, child) {
                  return TextField(
                    controller: _searchController,
                    decoration: InputDecoration(
                      hintText: 'Buscar contenedor...',
                      prefixIcon: const Icon(Icons.search, color: Colors.grey),
                      suffixIcon: value.text.isNotEmpty
                          ? IconButton(
                              icon: const Icon(Icons.clear, color: Colors.grey),
                              onPressed: () {
                                _searchController.clear();
                                _filterContainers();
                              },
                            )
                          : null,
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 20,
                        vertical: 12,
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                _buildFilterChip(
                  label: 'Todos',
                  icon: Icons.all_inclusive,
                  isSelected: _selectedFilter == 'todos',
                  onTap: () {
                    setState(() {
                      _selectedFilter = 'todos';
                    });
                    _filterContainers(); // Filtrar primero
                    Future.microtask(() {
                      _findNearestContainer(); // Luego actualizar el más cercano según el filtro
                      _updateMarkers();
                    });
                  },
                ),
                _buildFilterChip(
                  label: 'Verde',
                  icon: Icons.circle,
                  color: Colors.green,
                  isSelected: _selectedFilter == 'verde',
                  onTap: () {
                    setState(() {
                      _selectedFilter = 'verde';
                    });
                    _filterContainers(); // Filtrar primero
                    Future.microtask(() {
                      _findNearestContainer(); // Luego actualizar el más cercano según el filtro
                      _updateMarkers();
                    });
                  },
                ),
                _buildFilterChip(
                  label: 'Naranja',
                  icon: Icons.circle,
                  color: Colors.orange,
                  isSelected: _selectedFilter == 'naranja',
                  onTap: () {
                    setState(() {
                      _selectedFilter = 'naranja';
                    });
                    _filterContainers(); // Filtrar primero
                    Future.microtask(() {
                      _findNearestContainer(); // Luego actualizar el más cercano según el filtro
                      _updateMarkers();
                    });
                  },
                ),
                _buildFilterChip(
                  label: 'Soterrado',
                  icon: Icons.circle,
                  color: Colors.red,
                  isSelected: _selectedFilter == 'soterrado',
                  onTap: () {
                    setState(() {
                      _selectedFilter = 'soterrado';
                    });
                    _filterContainers();
                    Future.microtask(() {
                      _findNearestContainer();
                      _updateMarkers();
                    });
                  },
                ),
              ],
            ),
            if (_nearestContainer != null)
              Padding(
                padding: const EdgeInsets.only(top: 12),
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.amber,
                    borderRadius: BorderRadius.circular(25),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.amber.withOpacity(0.4),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      onTap: _goToNearestContainer,
                      borderRadius: BorderRadius.circular(25),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 20,
                          vertical: 12,
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(
                              Icons.near_me,
                              color: Colors.white,
                              size: 24,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'Más cercano: ${_formatDistance(_nearestDistance)}',
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterChip({
    required String label,
    required IconData icon,
    required bool isSelected,
    required VoidCallback onTap,
    Color? color,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(20),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: BoxDecoration(
            color: isSelected
                ? (color ?? const Color(0xffA78767))
                : Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: isSelected
                  ? (color ?? const Color(0xffA78767))
                  : Colors.grey.shade300,
              width: 2,
            ),
            boxShadow: isSelected
                ? [
                    BoxShadow(
                      color: (color ?? const Color(0xffA78767))
                          .withOpacity(0.3),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ]
                : null,
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                icon,
                size: 16,
                color: isSelected
                    ? Colors.white
                    : (color ?? Colors.grey),
              ),
              const SizedBox(width: 6),
              Flexible(
                child: Text(
                  label,
                  style: TextStyle(
                    color: isSelected ? Colors.white : Colors.black87,
                    fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                    fontSize: 12,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNearestContainerPanel() {
    return Positioned(
      bottom: 8, // Posicionado justo arriba del TabBar, sin espacio visible entre ellos
      left: 16,
      right: 16,
      child: SafeArea(
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.3),
                blurRadius: 20,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Padding(
                padding: const EdgeInsets.only(top: 12, left: 16, right: 16, bottom: 8),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: Colors.amber.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(
                        Icons.near_me,
                        color: Colors.amber,
                        size: 24,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Contenedor Más Cercano',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.black87,
                            ),
                          ),
                          Text(
                            _formatDistance(_nearestDistance),
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.grey.shade600,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    Material(
                      color: Colors.white,
                      elevation: 2,
                      shadowColor: Colors.black.withOpacity(0.18),
                      shape: const CircleBorder(),
                      child: InkWell(
                        customBorder: const CircleBorder(),
                        onTap: () async {
                          if (polylineAnnotationManager != null && !_isNavigating) {
                            await polylineAnnotationManager!.deleteAll();
                          }
                          setState(() {
                            _showSearchPanel = false;
                            if (!_isNavigating) {
                              _routeCoordinates = null;
                              _routeInstructions = null;
                            }
                          });
                        },
                        child: Container(
                          width: 40,
                          height: 40,
                          alignment: Alignment.center,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: Colors.black.withOpacity(0.08),
                              width: 1,
                            ),
                          ),
                          child: const Icon(
                            Icons.close,
                            size: 18,
                            color: Colors.black87,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(left: 16, right: 16, bottom: 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: Colors.grey.shade50,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 12,
                            height: 12,
                            decoration: BoxDecoration(
                              color: _nearestContainer!.type == 'soterrado'
                                  ? Colors.red
                                  : Colors.green,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'ID: ${_nearestContainer!.id.length > 12 ? _nearestContainer!.id.substring(0, 12) : _nearestContainer!.id}...',
                                  style: const TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                                Text(
                                  'Tipo: ${_nearestContainer!.type}',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Colors.grey.shade600,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 10),
                    if (!_isNavigating) 
                      Column(
                        children: [
                          _buildTransportOptions(),
                          const SizedBox(height: 8),
                        ],
                      ),
                    if (_routeCoordinates != null && !_isNavigating)
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          onPressed: () {
                            setState(() {
                              _isNavigating = true;
                              _currentInstructionIndex = 0;
                            });
                            _startNavigation();
                          },
                          icon: const Icon(Icons.directions),
                          label: const Text('Cómo llegar'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.blue,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                        ),
                      ),
                    if (_routeCoordinates == null && !_isNavigating)
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          onPressed: () async {
                            if (_nearestContainer != null) {
                              await _getRouteToContainer(_nearestContainer!);
                              if (_routeCoordinates != null) {
                                setState(() {
                                  _isNavigating = true;
                                  _currentInstructionIndex = 0;
                                });
                                _startNavigation();
                              }
                            }
                          },
                          icon: const Icon(Icons.route),
                          label: const Text('Cómo llegar'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.blue,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                        ),
                      ),
                    const SizedBox(height: 6),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: () async {
                          if (polylineAnnotationManager != null && !_isNavigating) {
                            await polylineAnnotationManager!.deleteAll();
                          }
                          _showCreateReportBottomSheet();
                          setState(() {
                            _showSearchPanel = false;
                            if (!_isNavigating) {
                              _routeCoordinates = null;
                              _routeInstructions = null;
                            }
                          });
                        },
                        icon: const Icon(Icons.add_alert),
                        label: const Text('Crear Reporte'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.green,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 10),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
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

  Widget _buildTransportOptions() {
    if (_nearestContainer == null) return const SizedBox.shrink();
    
    String? estimatedTime;
    double? totalDistance;
    if (!_isLoadingRoute && _routeInstructions != null && _routeInstructions!.isNotEmpty) {
      double totalDuration = 0.0;
      double distance = 0.0;
      for (var instruction in _routeInstructions!) {
        totalDuration += instruction['duration'] as double? ?? 0.0;
        distance += instruction['distance'] as double? ?? 0.0;
      }
      estimatedTime = _formatDuration(totalDuration);
      totalDistance = distance;
    } else if (_isLoadingRoute) {
      estimatedTime = 'Calculando...';
    }
    
    return Semantics(
      label: _getTransportTitle(),
      child: Row(
        children: [
          Expanded(
            child: _buildTransportButton(
              icon: Icons.directions_car,
              label: 'Automóvil',
              time: _selectedTransportMode == 'driving' ? estimatedTime : null,
              distance: _selectedTransportMode == 'driving' ? totalDistance : null,
              isSelected: _selectedTransportMode == 'driving',
              onTap: () => _changeTransportMode('driving'),
              isLoading: _isLoadingRoute && _selectedTransportMode == 'driving',
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: _buildTransportButton(
              icon: Icons.two_wheeler,
              label: 'Moto',
              time: _selectedTransportMode == 'cycling' ? estimatedTime : null,
              distance: _selectedTransportMode == 'cycling' ? totalDistance : null,
              isSelected: _selectedTransportMode == 'cycling',
              onTap: () => _changeTransportMode('cycling'),
              isLoading: _isLoadingRoute && _selectedTransportMode == 'cycling',
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: _buildTransportButton(
              icon: Icons.directions_walk,
              label: 'A pie',
              time: _selectedTransportMode == 'walking' ? estimatedTime : null,
              distance: _selectedTransportMode == 'walking' ? totalDistance : null,
              isSelected: _selectedTransportMode == 'walking',
              onTap: () => _changeTransportMode('walking'),
              isLoading: _isLoadingRoute && _selectedTransportMode == 'walking',
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildTransportButton({
    required IconData icon,
    required String label,
    String? time,
    double? distance,
    required bool isSelected,
    required VoidCallback onTap,
    bool isLoading = false,
  }) {
    return Semantics(
      button: true,
      selected: isSelected,
      label: label,
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
          decoration: BoxDecoration(
            color: isSelected ? Colors.blue.shade50 : Colors.white,
            border: Border.all(
              color: isSelected ? Colors.blue.shade700 : Colors.grey.shade300,
              width: isSelected ? 2.5 : 1.25,
            ),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                icon,
                color: isSelected ? Colors.blue.shade700 : Colors.grey.shade700,
                size: 22,
              ),
              if ((time != null || isLoading) && isSelected)
                Padding(
                  padding: const EdgeInsets.only(top: 4),
                  child: Text(
                    isLoading ? '...' : time!,
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: Colors.blue.shade700,
                      height: 1.1,
                    ),
                    textAlign: TextAlign.center,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
  
  String _getTransportTitle() {
    switch (_selectedTransportMode) {
      case 'driving':
        return 'En automóvil';
      case 'cycling':
        return 'En moto';
      case 'walking':
        return 'A pie';
      default:
        return 'Cómo llegar';
    }
  }
  
  Future<void> _changeTransportMode(String mode) async {
    if (_selectedTransportMode == mode && _routeCoordinates != null) {
      return; // Ya está seleccionado y tiene ruta
    }
    
    setState(() {
      _selectedTransportMode = mode;
    });
    
    if (_nearestContainer != null) {
      await _getRouteToContainer(_nearestContainer!);
    }
  }

  Widget _buildNavigationPanel() {
    if (_routeInstructions == null || 
        _currentInstructionIndex >= _routeInstructions!.length) {
      return const SizedBox.shrink();
    }

    final currentInstruction = _routeInstructions![_currentInstructionIndex];
    final nextInstruction = _currentInstructionIndex + 1 < _routeInstructions!.length
        ? _routeInstructions![_currentInstructionIndex + 1]
        : null;

    double totalDistance = 0.0;
    double totalDuration = 0.0;
    if (_routeInstructions != null) {
      for (int i = _currentInstructionIndex; i < _routeInstructions!.length; i++) {
        totalDistance += _routeInstructions![i]['distance'] as double? ?? 0.0;
        totalDuration += _routeInstructions![i]['duration'] as double? ?? 0.0;
      }
    }

    return Stack(
      children: [
        Positioned(
          top: 16,
          left: 16,
          child: SafeArea(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  constraints: const BoxConstraints(maxWidth: 300),
                  decoration: BoxDecoration(
                    color: Colors.green.shade600,
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.25),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          _getDirectionIcon(currentInstruction['modifier'] ?? ''),
                          color: Colors.white,
                          size: 26,
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Builder(
                                builder: (context) {
                                  String? displayName = _currentStreetName;
                                  
                                  if (displayName == null || 
                                      displayName.isEmpty || 
                                      _isGenericName(displayName)) {
                                    displayName = currentInstruction['name'] as String?;
                                  }
                                  
                                  if (displayName != null && displayName.isNotEmpty) {
                                    displayName = displayName.trim();
                                    
                                    displayName = displayName.replaceAll(RegExp(r'^conduzca\s+hacia\s+', caseSensitive: false), '');
                                    displayName = displayName.replaceAll(RegExp(r'^gire\s+en\s+', caseSensitive: false), '');
                                    displayName = displayName.replaceAll(RegExp(r'^siga\s+recto\s+por\s+', caseSensitive: false), '');
                                    
                                    if (!_hasStreetPrefix(displayName)) {
                                      displayName = displayName.replaceAll(RegExp(r'^el\s+', caseSensitive: false), '');
                                      displayName = displayName.replaceAll(RegExp(r'^la\s+', caseSensitive: false), '');
                                      displayName = displayName.replaceAll(RegExp(r'^los\s+', caseSensitive: false), '');
                                      displayName = displayName.replaceAll(RegExp(r'^las\s+', caseSensitive: false), '');
                                    }
                                    
                                    displayName = displayName.replaceAll(RegExp(r'\.+$'), '');
                                    displayName = displayName.replaceAll(RegExp(r'\s+'), ' ');
                                    displayName = displayName.trim();
                                  }
                                  
                                  if (displayName == null || 
                                      displayName.isEmpty || 
                                      _isGenericName(displayName)) {
                                    String modifier = currentInstruction['modifier'] ?? '';
                                    String type = currentInstruction['type'] ?? '';
                                    
                                    if (modifier.toLowerCase() == 'straight' || 
                                        type.toLowerCase() == 'continue') {
                                      displayName = 'Continuar recto';
                                    } else if (modifier.toLowerCase().contains('left')) {
                                      displayName = 'Gire a la izquierda';
                                    } else if (modifier.toLowerCase().contains('right')) {
                                      displayName = 'Gire a la derecha';
                                    } else {
                                      displayName = 'Continuar';
                                    }
                                  }
                                  
                                  return Text(
                                    displayName,
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                      height: 1.3,
                                    ),
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                  );
                                },
                              ),
                              if (nextInstruction != null) 
                                Builder(
                                  builder: (context) {
                                    String? nextName = nextInstruction['name'] as String?;
                                    
                                    if (nextName == null || 
                                        nextName.isEmpty || 
                                        _isGenericName(nextName)) {
                                      return const SizedBox.shrink();
                                    }
                                    
                                    nextName = nextName.trim();
                                    
                                    nextName = nextName.replaceAll(RegExp(r'^conduzca\s+hacia\s+', caseSensitive: false), '');
                                    nextName = nextName.replaceAll(RegExp(r'^gire\s+en\s+', caseSensitive: false), '');
                                    nextName = nextName.replaceAll(RegExp(r'^siga\s+recto\s+por\s+', caseSensitive: false), '');
                                    
                                    if (!_hasStreetPrefix(nextName)) {
                                      nextName = nextName.replaceAll(RegExp(r'^el\s+', caseSensitive: false), '');
                                      nextName = nextName.replaceAll(RegExp(r'^la\s+', caseSensitive: false), '');
                                      nextName = nextName.replaceAll(RegExp(r'^los\s+', caseSensitive: false), '');
                                      nextName = nextName.replaceAll(RegExp(r'^las\s+', caseSensitive: false), '');
                                    }
                                    
                                    nextName = nextName.replaceAll(RegExp(r'\.+$'), '');
                                    nextName = nextName.replaceAll(RegExp(r'\s+'), ' ');
                                    nextName = nextName.trim();
                                    
                                    if (nextName.isEmpty || _isGenericName(nextName)) {
                                      return const SizedBox.shrink();
                                    }
                                    
                                    return Padding(
                                      padding: const EdgeInsets.only(top: 1),
                                      child: Text(
                                        'en dirección a $nextName',
                                        style: TextStyle(
                                          color: Colors.white.withOpacity(0.9),
                                          fontSize: 12,
                                          height: 1.3,
                                          fontWeight: FontWeight.w400,
                                        ),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    );
                                  },
                                ),
                            ],
                          ),
                        ),
                        GestureDetector(
                          onTap: () async {
                            setState(() {
                              _voiceEnabled = !_voiceEnabled;
                            });
                            if (!_voiceEnabled) {
                              await _stopTts();
                            } else {
                              await _speakInstruction(_currentInstructionIndex);
                            }
                          },
                          child: Padding(
                            padding: const EdgeInsets.only(left: 6),
                            child: Icon(
                              _voiceEnabled ? Icons.volume_up : Icons.volume_off,
                              color: Colors.white,
                              size: 20,
                            ),
                          ),
                        ),
                        Material(
                          color: Colors.transparent,
                          child: InkWell(
                            customBorder: const CircleBorder(),
                            onTap: _stopNavigation,
                            child: Container(
                              width: 32,
                              height: 32,
                              alignment: Alignment.center,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: Colors.white.withOpacity(0.18),
                                border: Border.all(
                                  color: Colors.white.withOpacity(0.28),
                                  width: 1,
                                ),
                              ),
                              child: const Icon(
                                Icons.close,
                                color: Colors.white,
                                size: 18,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                if (nextInstruction != null)
                  Padding(
                    padding: const EdgeInsets.only(top: 6, left: 8),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(
                        color: Colors.green.shade700,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            _getDirectionIcon(nextInstruction['modifier'] ?? ''),
                            color: Colors.white,
                            size: 14,
                          ),
                          const SizedBox(width: 6),
                          Flexible(
                            child: Text(
                              'Luego ${nextInstruction['instruction'] ?? 'Continuar'}',
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 11,
                                fontWeight: FontWeight.w500,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
        Positioned(
          bottom: 20, // Más cerca del TabBar
          left: 16,
          right: 16,
          child: SafeArea(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.2),
                    blurRadius: 10,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _formatDuration(totalDuration),
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.orange.shade700,
                        ),
                      ),
                      Text(
                        _formatDistance(totalDistance),
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey.shade600,
                        ),
                      ),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        _getEstimatedArrivalTime(totalDuration),
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                          color: Colors.grey.shade800,
                        ),
                      ),
                      Text(
                        'Llegada',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey.shade600,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  IconData _getDirectionIcon(String modifier) {
    switch (modifier.toLowerCase()) {
      case 'left':
      case 'slight left':
      case 'sharp left':
        return Icons.turn_left;
      case 'right':
      case 'slight right':
      case 'sharp right':
        return Icons.turn_right;
      case 'straight':
      case 'uturn':
        return Icons.straight;
      default:
        return Icons.arrow_upward;
    }
  }

  String _getEstimatedArrivalTime(double durationSeconds) {
    if (durationSeconds <= 0) return 'Calculando...';
    
    DateTime arrivalTime = DateTime.now().add(Duration(seconds: durationSeconds.round()));
    int hour = arrivalTime.hour;
    int minute = arrivalTime.minute;
    
    return '${hour.toString().padLeft(2, '0')}:${minute.toString().padLeft(2, '0')}';
  }

  String _formatDuration(double? seconds) {
    if (seconds == null) return 'Calculando...';
    
    if (seconds < 60) {
      return '${seconds.toStringAsFixed(0)} seg';
    } else if (seconds < 3600) {
      int minutes = (seconds / 60).round();
      return '$minutes min';
    } else {
      int hours = (seconds / 3600).floor();
      int minutes = ((seconds % 3600) / 60).round();
      return '${hours}h ${minutes}min';
    }
  }

  Widget _buildReportsTab() {
    return Container(
      color: const Color(0xff122320),
      child: SafeArea(
        bottom: false,
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 20),
              decoration: const BoxDecoration(
                color: Color(0xff122320),
                borderRadius: BorderRadius.vertical(bottom: Radius.circular(20)),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.orange.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(
                      Icons.assignment,
                      color: Colors.orange,
                      size: 28,
                    ),
                  ),
                  const SizedBox(width: 16),
                  const Text(
                    'Mis Reportes',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: _reports.isEmpty
                  ? const Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.assignment_outlined,
                            size: 80,
                            color: Colors.white24,
                          ),
                          SizedBox(height: 16),
                          Text(
                            'No hay reportes pendientes',
                            style: TextStyle(
                              fontSize: 18,
                              color: Colors.white54,
                            ),
                          ),
                        ],
                      ),
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: _reports.length,
                      itemBuilder: (context, index) {
                        final report = _reports[index];
                        return _buildReportCard(report);
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildReportCard(Reporte report) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 5,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(15.0),
      ),
      color: const Color(0xff122320),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'ID: ${report.id.length > 8 ? report.id.substring(0, 8) : report.id}...',
                  style: const TextStyle(
                    color: Colors.white70,
                    fontSize: 12,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: _getReportStateColor(report.estado),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    _getReportStateString(report.estado),
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              _getReportTypeString(report.tipo),
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 18,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Descripción: ${report.description}',
              style: const TextStyle(color: Colors.white),
            ),
            if (report.comentario != null &&
                report.comentario!.isNotEmpty &&
                report.description != report.comentario)
              Padding(
                padding: const EdgeInsets.only(top: 8),
                child: Text(
                  'Comentario: ${report.comentario}',
                  style: const TextStyle(
                    color: Colors.white70,
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(
                  Icons.access_time,
                  size: 14,
                  color: Colors.white54,
                ),
                const SizedBox(width: 4),
                Text(
                  report.timestamp.toLocal().toString().split('.')[0],
                  style: const TextStyle(
                    color: Colors.white54,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
            if (report.estado == ReporteEstado.error ||
                report.estado != ReporteEstado.enviado)
              Padding(
                padding: const EdgeInsets.only(top: 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    if (report.estado == ReporteEstado.error)
                      TextButton.icon(
                        onPressed: () => _retryReport(report),
                        icon: const Icon(
                          Icons.refresh,
                          color: Colors.lightBlueAccent,
                        ),
                        label: const Text(
                          'Reintentar',
                          style: TextStyle(
                            color: Colors.lightBlueAccent,
                          ),
                        ),
                      ),
                    if (report.estado != ReporteEstado.enviado)
                      TextButton.icon(
                        onPressed: () => _deleteReport(report),
                        icon: const Icon(
                          Icons.delete_forever,
                          color: Colors.grey,
                        ),
                        label: const Text(
                          'Eliminar',
                          style: TextStyle(color: Colors.grey),
                        ),
                      ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileTab() {
    return Container(
      color: const Color(0xff122320),
      child: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            children: [
              const SizedBox(height: 20),
              Builder(
                builder: (context) {
                  final skin = _avatarSkins[_avatarSkinIndex.clamp(0, _avatarSkins.length - 1)];
                  return Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: skin.bgColor.withOpacity(0.2),
                      shape: BoxShape.circle,
                      border: Border.all(color: skin.bgColor, width: 3),
                    ),
                    child: CustomPaint(
                      size: const ui.Size(90, 90),
                      painter: _AvatarPersonPainter(variant: skin.variant),
                    ),
                  );
                },
              ),
              const SizedBox(height: 12),
              TextButton.icon(
                onPressed: _showAvatarSkinPicker,
                icon: const Icon(Icons.edit, color: Color(0xffA78767)),
                label: const Text(
                  'Elegir skin',
                  style: TextStyle(
                    color: Color(0xffA78767),
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              const SizedBox(height: 24),
              const Text(
                'Mi Perfil',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 32),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xff122320),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.white.withOpacity(0.2)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.email, color: Colors.white70),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Email',
                            style: TextStyle(
                              color: Colors.white54,
                              fontSize: 12,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            widget.userEmail,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xff122320),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.green.withOpacity(0.3)),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.check_circle, color: Colors.green),
                    SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Estado',
                            style: TextStyle(
                              color: Colors.white54,
                              fontSize: 12,
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'Activo',
                            style: TextStyle(
                              color: Colors.green,
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () async {
                    await AuthService.deleteToken();
                    if (context.mounted) {
                      Navigator.of(context).pushNamedAndRemoveUntil(
                          '/welcome', (route) => false);
                    }
                  },
                  icon: const Icon(Icons.logout),
                  label: const Text(
                    'Cerrar Sesión',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xffA78767),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    elevation: 4,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBottomTabBar() {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xff122320),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 10,
            offset: const Offset(0, -3),
          ),
        ],
      ),
      child: SafeArea(
        child: TabBar(
          controller: _tabController,
          indicatorColor: const Color(0xffA78767),
          indicatorWeight: 3,
          labelColor: const Color(0xffA78767),
          unselectedLabelColor: Colors.white54,
          onTap: (index) {
            setState(() {}); // Actualiza el FAB
          },
          tabs: [
            Tab(
              icon: const Icon(Icons.map, size: 26),
              text: 'Mapa',
            ),
            Tab(
              icon: Stack(
                clipBehavior: Clip.none,
                children: [
                  const Icon(Icons.assignment, size: 26),
                  if (_reports.isNotEmpty)
                    Positioned(
                      right: -6,
                      top: -6,
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: Colors.orange,
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.white, width: 1.5),
                        ),
                        constraints: const BoxConstraints(
                          minWidth: 18,
                          minHeight: 18,
                        ),
                        child: Center(
                          child: Text(
                            '${_reports.length}',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 9,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ),
                ],
              ),
              text: 'Reportes',
            ),
            const Tab(
              icon: Icon(Icons.person, size: 26),
              text: 'Perfil',
            ),
          ],
        ),
      ),
    );
  }

  
  Widget _buildNavigationFloatingButtons() {
    return Positioned(
      right: 16,
      bottom: 140, // Por encima del panel blanco (que está en bottom: 20) y del TabBar
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          FloatingActionButton(
            heroTag: 'createReportNav',
            onPressed: _showCreateReportBottomSheet,
            backgroundColor: Colors.green,
            child: const Icon(
              Icons.add_alert,
              color: Colors.white,
              size: 28,
            ),
            tooltip: 'Crear Reporte',
          ),
          const SizedBox(height: 16),
          FloatingActionButton(
            heroTag: 'myLocationNav',
            onPressed: _getUserLocation,
            backgroundColor: const Color(0xffA78767),
            child: const Icon(
              Icons.my_location,
              color: Colors.white,
              size: 28,
            ),
            tooltip: 'Mi Ubicación',
          ),
        ],
      ),
    );
  }

  Widget _buildStackFloatingButtons() {
    if (_showSearchPanel || _isNavigating) {
      return const SizedBox.shrink();
    }
    
    return Positioned(
      right: 16,
      bottom: 240, // Reposicionado para no chocar con el área superior ni con el TabBar
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          FloatingActionButton(
            heroTag: 'reportDumpStack',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => DumpReportScreen(userEmail: widget.userEmail),
                ),
              );
            },
            backgroundColor: Colors.orange,
            child: const Icon(
              Icons.warning_amber_rounded,
              color: Colors.white,
              size: 28,
            ),
            tooltip: 'Reportar Vertedero Ilegal',
          ),
          const SizedBox(height: 16),
          FloatingActionButton(
            heroTag: 'createReportStack',
            onPressed: _showCreateReportBottomSheet,
            backgroundColor: Colors.green,
            child: const Icon(
              Icons.add_alert,
              color: Colors.white,
              size: 28,
            ),
            tooltip: 'Reportar Contenedor',
          ),
          const SizedBox(height: 16),
          FloatingActionButton(
            heroTag: 'myLocationStack',
            onPressed: _getUserLocation,
            backgroundColor: const Color(0xffA78767),
            child: const Icon(
              Icons.my_location,
              color: Colors.white,
              size: 28,
            ),
            tooltip: 'Mi Ubicación',
          ),
        ],
      ),
    );
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
    report.estado = ReporteEstado.pendiente;
    _reportQueueService.sendAllPendingReports();
    _showMessage('Reintentando', 'Reporte enviando...');
  }

  void _deleteReport(Reporte report) {
    _reportQueueService.removeReportById(report.id);
    _showMessage('Eliminado', 'Reporte eliminado de la cola');
  }


  void _showCreateReportBottomSheet() {
    if (_containers.isEmpty) {
      _showMessage('Sin contenedores', 'No hay contenedores disponibles para reportar.');
      return;
    }

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => _CreateReportBottomSheet(
        containers: _containers,
        currentPosition: _currentPosition,
        userEmail: widget.userEmail,
        reportQueueService: _reportQueueService,
        onReportCreated: () {
          _tabController.animateTo(1);
        },
      ),
    );
  }


  @override
  void dispose() {
    unawaited(_stopTts());
    _searchController.removeListener(_onSearchChanged);
    _searchController.dispose();
    _positionStreamSubscription?.cancel();
    _reportQueueService.removeListener(_onReportsChanged);
    _tabController.dispose();
    super.dispose();
  }
}


class _CreateReportBottomSheet extends StatefulWidget {
  final List<Contenedor> containers;
  final geo.Position? currentPosition;
  final String userEmail;
  final ReportQueueService reportQueueService;
  final VoidCallback onReportCreated;

  const _CreateReportBottomSheet({
    required this.containers,
    required this.currentPosition,
    required this.userEmail,
    required this.reportQueueService,
    required this.onReportCreated,
  });

  @override
  State<_CreateReportBottomSheet> createState() => _CreateReportBottomSheetState();
}

class _CreateReportBottomSheetState extends State<_CreateReportBottomSheet> {
  Contenedor? _selectedContainer;
  ReporteTipo _selectedTipo = ReporteTipo.lleno;
  final TextEditingController _commentController = TextEditingController();

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  void _submitReport() {
    if (_selectedContainer == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Por favor selecciona un contenedor')),
      );
      return;
    }

    final report = Reporte(
      id: const Uuid().v4(),
      userId: widget.userEmail,
      containerId: _selectedContainer!.id,
      tipo: _selectedTipo,
      comentario: _commentController.text.isNotEmpty ? _commentController.text : null,
      timestamp: DateTime.now(),
      containerType: _selectedContainer!.type,
      latitude: _selectedContainer!.latitude,
      longitude: _selectedContainer!.longitude,
    );

    widget.reportQueueService.addReport(report);
    
    Navigator.pop(context);
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('✅ Reporte creado exitosamente'),
        backgroundColor: Colors.green,
        duration: Duration(seconds: 2),
      ),
    );
    
    Future.delayed(const Duration(milliseconds: 300), () {
      widget.onReportCreated();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Color(0xff122320),
        borderRadius: BorderRadius.vertical(top: Radius.circular(25)),
      ),
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: DraggableScrollableSheet(
        initialChildSize: 0.7,
        minChildSize: 0.5,
        maxChildSize: 0.95,
        builder: (_, controller) => SingleChildScrollView(
          controller: controller,
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.3),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.green.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(
                        Icons.add_alert,
                        color: Colors.green,
                        size: 28,
                      ),
                    ),
                    const SizedBox(width: 16),
                    const Text(
                      'Crear Reporte',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                const Text(
                  'Contenedor',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 12),
                Container(
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.white.withOpacity(0.2)),
                  ),
                  child: DropdownButtonFormField<Contenedor>(
                    value: _selectedContainer,
                    dropdownColor: const Color(0xff122320),
                    decoration: const InputDecoration(
                      contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      border: InputBorder.none,
                    ),
                    style: const TextStyle(color: Colors.white),
                    items: widget.containers.map((container) {
                      final displayId = container.id.length > 8 
                          ? '${container.id.substring(0, 8)}...' 
                          : container.id;
                      return DropdownMenuItem(
                        value: container,
                        child: Text(
                          'ID: $displayId (${container.type})',
                          style: const TextStyle(color: Colors.white),
                        ),
                      );
                    }).toList(),
                    onChanged: (value) {
                      setState(() {
                        _selectedContainer = value;
                      });
                    },
                  ),
                ),
                const SizedBox(height: 24),
                const Text(
                  'Tipo de Problema',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 12),
                ...[
                  (ReporteTipo.lleno, 'Contenedor Lleno', Icons.delete, Colors.orange),
                  (ReporteTipo.fueraDeServicio, 'Fuera de Servicio', Icons.warning, Colors.red),
                  (ReporteTipo.otro, 'Otro Problema', Icons.help_outline, Colors.blue),
                ].map((item) {
                  final tipo = item.$1;
                  final label = item.$2;
                  final icon = item.$3;
                  final color = item.$4;
                  final isSelected = _selectedTipo == tipo;
                  
                  return GestureDetector(
                    onTap: () {
                      setState(() {
                        _selectedTipo = tipo;
                      });
                    },
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: isSelected 
                            ? color.withOpacity(0.2) 
                            : Colors.white.withOpacity(0.05),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isSelected ? color : Colors.white.withOpacity(0.1),
                          width: 2,
                        ),
                      ),
                      child: Row(
                        children: [
                          Icon(icon, color: isSelected ? color : Colors.white54, size: 28),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Text(
                              label,
                              style: TextStyle(
                                color: isSelected ? Colors.white : Colors.white70,
                                fontSize: 16,
                                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                              ),
                            ),
                          ),
                          if (isSelected)
                            Icon(Icons.check_circle, color: color, size: 24),
                        ],
                      ),
                    ),
                  );
                }).toList(),
                const SizedBox(height: 24),
                const Text(
                  'Comentario Adicional (Opcional)',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 12),
                Container(
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.white.withOpacity(0.2)),
                  ),
                  child: TextField(
                    controller: _commentController,
                    style: const TextStyle(color: Colors.white),
                    maxLines: 3,
                    decoration: const InputDecoration(
                      contentPadding: EdgeInsets.all(16),
                      border: InputBorder.none,
                      hintText: 'Escribe detalles adicionales...',
                      hintStyle: TextStyle(color: Colors.white54),
                    ),
                  ),
                ),
                const SizedBox(height: 32),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _submitReport,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      elevation: 4,
                    ),
                    child: const Text(
                      'Crear Reporte',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

