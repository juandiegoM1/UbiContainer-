-- Inventario oficial: 54 contenedores verdes (2500 L)
-- Fuente: transcripcion_contenedores_verdes.xlsx (36 ubicaciones, 54 unidades)
-- IDs: 236-289
BEGIN;

ALTER TABLE public.contenedores ADD COLUMN IF NOT EXISTS capacidad integer;

DELETE FROM public.contenedores WHERE tipo = 'verde';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (236, 'verde', -17.383859, -66.160506, 'Av. Ayacucho y Tte. Arevalo 1', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.383859, longitude = -66.160506, nombre = 'Av. Ayacucho y Tte. Arevalo 1', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (237, 'verde', -17.383859, -66.160422, 'Av. Ayacucho y Tte. Arevalo 2', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.383859, longitude = -66.160422, nombre = 'Av. Ayacucho y Tte. Arevalo 2', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (238, 'verde', -17.386193, -66.16003, 'Av. Ayacucho y C. La Paz', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.386193, longitude = -66.16003, nombre = 'Av. Ayacucho y C. La Paz', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (239, 'verde', -17.385628, -66.157926, 'España y C. La Paz 1', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.385628, longitude = -66.157926, nombre = 'España y C. La Paz 1', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (240, 'verde', -17.385628, -66.157842, 'España y C. La Paz 2', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.385628, longitude = -66.157842, nombre = 'España y C. La Paz 2', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (241, 'verde', -17.385725, -66.155406, 'Lanza y Chuquisaca 1', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.385725, longitude = -66.155406, nombre = 'Lanza y Chuquisaca 1', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (242, 'verde', -17.385658, -66.155365, 'Lanza y Chuquisaca 2', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.385658, longitude = -66.155365, nombre = 'Lanza y Chuquisaca 2', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (243, 'verde', -17.385658, -66.155447, 'Lanza y Chuquisaca 3', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.385658, longitude = -66.155447, nombre = 'Lanza y Chuquisaca 3', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (244, 'verde', -17.387043, -66.158834, 'Baptista y J. de la Reza 1', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.387043, longitude = -66.158834, nombre = 'Baptista y J. de la Reza 1', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (245, 'verde', -17.387043, -66.15875, 'Baptista y J. de la Reza 2', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.387043, longitude = -66.15875, nombre = 'Baptista y J. de la Reza 2', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (246, 'verde', -17.385692, -66.153919, 'Antezana y Av. Salamanca 1', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.385692, longitude = -66.153919, nombre = 'Antezana y Av. Salamanca 1', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (247, 'verde', -17.385692, -66.153835, 'Antezana y Av. Salamanca 2', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.385692, longitude = -66.153835, nombre = 'Antezana y Av. Salamanca 2', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (248, 'verde', -17.386557, -66.154756, 'Lanza y Av. Salamanca', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.386557, longitude = -66.154756, nombre = 'Lanza y Av. Salamanca', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (249, 'verde', -17.386939, -66.153302, 'Antezana y Paccieri', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.386939, longitude = -66.153302, nombre = 'Antezana y Paccieri', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (250, 'verde', -17.387212, -66.154469, 'Lanza y Paccieri 1', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.387212, longitude = -66.154469, nombre = 'Lanza y Paccieri 1', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (251, 'verde', -17.387212, -66.154385, 'Lanza y Paccieri 2', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.387212, longitude = -66.154385, nombre = 'Lanza y Paccieri 2', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (252, 'verde', -17.386434, -66.152168, '16 de Julio y Paccieri 1', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.386434, longitude = -66.152168, nombre = '16 de Julio y Paccieri 1', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (253, 'verde', -17.386434, -66.152084, '16 de Julio y Paccieri 2', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.386434, longitude = -66.152084, nombre = '16 de Julio y Paccieri 2', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (254, 'verde', -17.387873, -66.151877, '16 de Julio y Venezuela', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.387873, longitude = -66.151877, nombre = '16 de Julio y Venezuela', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (255, 'verde', -17.388311, -66.157387, 'España entre Mexico y Mayor Rocha', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.388311, longitude = -66.157387, nombre = 'España entre Mexico y Mayor Rocha', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (256, 'verde', -17.388355, -66.158575, 'Baptista y Mexico', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.388355, longitude = -66.158575, nombre = 'Baptista y Mexico', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (257, 'verde', -17.388438, -66.159589, 'Av. Ayacucho y Mexico', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.388438, longitude = -66.159589, nombre = 'Av. Ayacucho y Mexico', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (258, 'verde', -17.389445, -66.159381, 'Av. Ayacucho y Mayor Rocha', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.389445, longitude = -66.159381, nombre = 'Av. Ayacucho y Mayor Rocha', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (259, 'verde', -17.389425, -66.158384, 'Baptista y Mayor Rocha', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.389425, longitude = -66.158384, nombre = 'Baptista y Mayor Rocha', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (260, 'verde', -17.389754, -66.155595, 'Ecuador entre 25 de Mayo y San Martin 1', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.389754, longitude = -66.155595, nombre = 'Ecuador entre 25 de Mayo y San Martin 1', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (261, 'verde', -17.389754, -66.155511, 'Ecuador entre 25 de Mayo y San Martin 2', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.389754, longitude = -66.155511, nombre = 'Ecuador entre 25 de Mayo y San Martin 2', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (262, 'verde', -17.389623, -66.154894, 'Ecuador y San Martin 1', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.389623, longitude = -66.154894, nombre = 'Ecuador y San Martin 1', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (263, 'verde', -17.389623, -66.15481, 'Ecuador y San Martin 2', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.389623, longitude = -66.15481, nombre = 'Ecuador y San Martin 2', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (264, 'verde', -17.388271, -66.152945, 'Antezana y Venezuela', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.388271, longitude = -66.152945, nombre = 'Antezana y Venezuela', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (265, 'verde', -17.388538, -66.151756, '16 de Julio entre Venezuela y Ecuador', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.388538, longitude = -66.151756, nombre = '16 de Julio entre Venezuela y Ecuador', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (266, 'verde', -17.390525, -66.159175, 'Av. Ayacucho y Ecuador', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.390525, longitude = -66.159175, nombre = 'Av. Ayacucho y Ecuador', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (267, 'verde', -17.391383, -66.159256, 'Av. Ayacucho y Colombia 1', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.391383, longitude = -66.159256, nombre = 'Av. Ayacucho y Colombia 1', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (268, 'verde', -17.391383, -66.159172, 'Av. Ayacucho y Colombia 2', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.391383, longitude = -66.159172, nombre = 'Av. Ayacucho y Colombia 2', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (269, 'verde', -17.390142, -66.157056, 'España y Ecuador', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.390142, longitude = -66.157056, nombre = 'España y Ecuador', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (270, 'verde', -17.389572, -66.153961, 'Lanza y Ecuador 1', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.389572, longitude = -66.153961, nombre = 'Lanza y Ecuador 1', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (271, 'verde', -17.389572, -66.153877, 'Lanza y Ecuador 2', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.389572, longitude = -66.153877, nombre = 'Lanza y Ecuador 2', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (272, 'verde', -17.389272, -66.152694, 'Antezana y Ecuador', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.389272, longitude = -66.152694, nombre = 'Antezana y Ecuador', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (273, 'verde', -17.391307, -66.152123, 'Av. Heroinas y Antezana', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.391307, longitude = -66.152123, nombre = 'Av. Heroinas y Antezana', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (274, 'verde', -17.391573, -66.153513, 'Av. Heroinas y Lanza', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.391573, longitude = -66.153513, nombre = 'Av. Heroinas y Lanza', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (275, 'verde', -17.391734, -66.154531, 'Av. Heroinas y San Martin 1', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.391734, longitude = -66.154531, nombre = 'Av. Heroinas y San Martin 1', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (276, 'verde', -17.391734, -66.154447, 'Av. Heroinas y San Martin 2', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.391734, longitude = -66.154447, nombre = 'Av. Heroinas y San Martin 2', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (277, 'verde', -17.392244, -66.150905, 'Bolivar y 16 de Julio 1', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.392244, longitude = -66.150905, nombre = 'Bolivar y 16 de Julio 1', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (278, 'verde', -17.392177, -66.150864, 'Bolivar y 16 de Julio 2', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.392177, longitude = -66.150864, nombre = 'Bolivar y 16 de Julio 2', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (279, 'verde', -17.392177, -66.150946, 'Bolivar y 16 de Julio 3', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.392177, longitude = -66.150946, nombre = 'Bolivar y 16 de Julio 3', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (280, 'verde', -17.393203, -66.150924, '16 de Julio y Sucre', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.393203, longitude = -66.150924, nombre = '16 de Julio y Sucre', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (281, 'verde', -17.395862, -66.158179, 'Av. Ayacucho y Jordan 1', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.395862, longitude = -66.158179, nombre = 'Av. Ayacucho y Jordan 1', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (282, 'verde', -17.395862, -66.158095, 'Av. Ayacucho y Jordan 2', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.395862, longitude = -66.158095, nombre = 'Av. Ayacucho y Jordan 2', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (283, 'verde', -17.395661, -66.152782, 'Lanza y Calama 1', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.395661, longitude = -66.152782, nombre = 'Lanza y Calama 1', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (284, 'verde', -17.395661, -66.152698, 'Lanza y Calama 2', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.395661, longitude = -66.152698, nombre = 'Lanza y Calama 2', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (285, 'verde', -17.383114, -66.157289, 'Lanza y Oruro', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.383114, longitude = -66.157289, nombre = 'Lanza y Oruro', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (286, 'verde', -17.393489, -66.151654, 'Sucre y Antezana', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.393489, longitude = -66.151654, nombre = 'Sucre y Antezana', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (287, 'verde', -17.3946, -66.152975, 'Lanza y Jordan 1', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.3946, longitude = -66.152975, nombre = 'Lanza y Jordan 1', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (288, 'verde', -17.3946, -66.152891, 'Lanza y Jordan 2', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.3946, longitude = -66.152891, nombre = 'Lanza y Jordan 2', cantidad = 1, capacidad = 2500, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, capacidad, estado, nivel_llenado)
VALUES (289, 'verde', -17.393015, -66.165951, 'Rafael Urquidi (ELFEC)', 1, 2500, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'verde', latitude = -17.393015, longitude = -66.165951, nombre = 'Rafael Urquidi (ELFEC)', cantidad = 1, capacidad = 2500, estado = 'activo';

SELECT setval(pg_get_serial_sequence('public.contenedores', 'id'), (SELECT COALESCE(MAX(id), 1) FROM public.contenedores));
COMMIT;