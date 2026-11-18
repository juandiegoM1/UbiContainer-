-- Inventario oficial: 22 contenedores soterrados
-- Fuente: Contenedores_Soterrados_Transcritos.xlsx
-- IDs: 133-154
BEGIN;

DELETE FROM public.contenedores WHERE tipo = 'soterrado';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (133, 'soterrado', -17.369255, -66.175921, 'Melchor Pérez de Olguín y Calle Quilla (Canchas de Racquet)', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'soterrado', latitude = -17.369255, longitude = -66.175921, nombre = 'Melchor Pérez de Olguín y Calle Quilla (Canchas de Racquet)', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (134, 'soterrado', -17.416843, -66.151695, 'Av. Barrientos y República (Rotonda)', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'soterrado', latitude = -17.416843, longitude = -66.151695, nombre = 'Av. Barrientos y República (Rotonda)', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (135, 'soterrado', -17.396269, -66.175344, 'Av. Capitán Víctor Ustariz y Av. Litoral (Víctor Ustariz)', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'soterrado', latitude = -17.396269, longitude = -66.175344, nombre = 'Av. Capitán Víctor Ustariz y Av. Litoral (Víctor Ustariz)', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (136, 'soterrado', -17.374868, -66.167082, 'Lucas Mendoza y José Aguirre Acha (Plaza Franz Tamayo)', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'soterrado', latitude = -17.374868, longitude = -66.167082, nombre = 'Lucas Mendoza y José Aguirre Acha (Plaza Franz Tamayo)', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (137, 'soterrado', -17.390004, -66.145537, 'Av. Heroínas y Parque La Torre (Av. Heroínas)', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'soterrado', latitude = -17.390004, longitude = -66.145537, nombre = 'Av. Heroínas y Parque La Torre (Av. Heroínas)', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (138, 'soterrado', -17.370625, -66.165419, 'B.M. Pula Cayó y Enrique Arce (Parque Lincoln)', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'soterrado', latitude = -17.370625, longitude = -66.165419, nombre = 'B.M. Pula Cayó y Enrique Arce (Parque Lincoln)', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (139, 'soterrado', -17.370081, -66.153707, 'Av. Julio Rodríguez Morales (Colegio Instituto Americano)', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'soterrado', latitude = -17.370081, longitude = -66.153707, nombre = 'Av. Julio Rodríguez Morales (Colegio Instituto Americano)', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (140, 'soterrado', -17.395473, -66.143401, 'Av. Guillermo Urquidi y Ricardo Terrazas (Plazuela General Román y Parque)', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'soterrado', latitude = -17.395473, longitude = -66.143401, nombre = 'Av. Guillermo Urquidi y Ricardo Terrazas (Plazuela General Román y Parque)', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (141, 'soterrado', -17.397218, -66.137926, 'Calle Hans Gretel esquina Parque del Maestro (Parque del Maestro)', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'soterrado', latitude = -17.397218, longitude = -66.137926, nombre = 'Calle Hans Gretel esquina Parque del Maestro (Parque del Maestro)', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (142, 'soterrado', -17.393917, -66.139637, 'Calle José Antonio Arce esquina Parque del Maestro', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'soterrado', latitude = -17.393917, longitude = -66.139637, nombre = 'Calle José Antonio Arce esquina Parque del Maestro', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (143, 'soterrado', -17.392212, -66.136481, 'Av. Franz Tamayo y Moctezuma', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'soterrado', latitude = -17.392212, longitude = -66.136481, nombre = 'Av. Franz Tamayo y Moctezuma', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (144, 'soterrado', -17.392505, -66.147576, 'Calle Sucre y Aurelio Meleán (San Pedro)', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'soterrado', latitude = -17.392505, longitude = -66.147576, nombre = 'Calle Sucre y Aurelio Meleán (San Pedro)', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (145, 'soterrado', -17.383809, -66.147601, 'Av. Papa Paolo esquina Venezuela (Seminario San Luis)', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'soterrado', latitude = -17.383809, longitude = -66.147601, nombre = 'Av. Papa Paolo esquina Venezuela (Seminario San Luis)', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (146, 'soterrado', -17.38258, -66.148773, 'Calle Eufrasio Viscarra entre Calle T. Beltrán y Calle Erasmo Arce (Seminario San Luis)', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'soterrado', latitude = -17.38258, longitude = -66.148773, nombre = 'Calle Eufrasio Viscarra entre Calle T. Beltrán y Calle Erasmo Arce (Seminario San Luis)', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (147, 'soterrado', -17.381592, -66.155403, 'Av. Ramón Rivero esquina Calle 16 de Julio (Central Santa María)', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'soterrado', latitude = -17.381592, longitude = -66.155403, nombre = 'Av. Ramón Rivero esquina Calle 16 de Julio (Central Santa María)', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (148, 'soterrado', -17.372449, -66.141206, 'Calle M. Márquez casi Av. Villalobos (Tupaya)', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'soterrado', latitude = -17.372449, longitude = -66.141206, nombre = 'Calle M. Márquez casi Av. Villalobos (Tupaya)', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (149, 'soterrado', -17.374065, -66.137103, 'Final América Este (Tupaya)', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'soterrado', latitude = -17.374065, longitude = -66.137103, nombre = 'Final América Este (Tupaya)', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (150, 'soterrado', -17.35704, -66.185029, 'Av. Segunda y Av. Simón López', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'soterrado', latitude = -17.35704, longitude = -66.185029, nombre = 'Av. Segunda y Av. Simón López', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (151, 'soterrado', -17.365308, -66.138963, 'Av. Las Begonias', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'soterrado', latitude = -17.365308, longitude = -66.138963, nombre = 'Av. Las Begonias', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (152, 'soterrado', -17.425974, -66.162205, 'Av. Copacabana', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'soterrado', latitude = -17.425974, longitude = -66.162205, nombre = 'Av. Copacabana', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (153, 'soterrado', -17.367466, -66.157742, 'Calle Elena Rendón y Av. Gualberto Villarroel (Las Islas)', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'soterrado', latitude = -17.367466, longitude = -66.157742, nombre = 'Calle Elena Rendón y Av. Gualberto Villarroel (Las Islas)', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (154, 'soterrado', -17.420259, -66.133419, 'Calle Araucarias y Amboró (Univalle)', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'soterrado', latitude = -17.420259, longitude = -66.133419, nombre = 'Calle Araucarias y Amboró (Univalle)', cantidad = 1, estado = 'activo';

SELECT setval(pg_get_serial_sequence('public.contenedores', 'id'), (SELECT COALESCE(MAX(id), 1) FROM public.contenedores));
COMMIT;