-- Inventario oficial: 96 contenedores naranja (9 m³)
-- Fuente: Inventario_Contenedores_Naranja_9m3.docx
BEGIN;

DELETE FROM public.contenedores
WHERE tipo = 'naranja' AND id > 96;

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (1, 'naranja', -17.348187, -66.172922, '2ª circumvalacion 1', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.348187, longitude = -66.172922, nombre = '2ª circumvalacion 1', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (2, 'naranja', -17.348205, -66.172896, '2ª circumvalacion 2', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.348205, longitude = -66.172896, nombre = '2ª circumvalacion 2', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (3, 'naranja', -17.348232, -66.172952, '2ª circumvalacion 3', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.348232, longitude = -66.172952, nombre = '2ª circumvalacion 3', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (4, 'naranja', -17.348252, -66.172915, '2ª circumvalacion escombros', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.348252, longitude = -66.172915, nombre = '2ª circumvalacion escombros', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (5, 'naranja', -17.350445, -66.16454, 'Phajcha', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.350445, longitude = -66.16454, nombre = 'Phajcha', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (6, 'naranja', -17.350466, -66.164486, 'Phajcha 2', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.350466, longitude = -66.164486, nombre = 'Phajcha 2', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (7, 'naranja', -17.350454, -66.164438, 'Phajcha 3', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.350454, longitude = -66.164438, nombre = 'Phajcha 3', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (8, 'naranja', -17.369237, -66.120591, 'Pacata 1', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.369237, longitude = -66.120591, nombre = 'Pacata 1', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (9, 'naranja', -17.369414, -66.12088, 'Pacata 2', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.369414, longitude = -66.12088, nombre = 'Pacata 2', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (10, 'naranja', -17.373385, -66.112201, 'Rio seco', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.373385, longitude = -66.112201, nombre = 'Rio seco', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (11, 'naranja', -17.373308, -66.112169, 'Rio seco 2', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.373308, longitude = -66.112169, nombre = 'Rio seco 2', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (12, 'naranja', -17.373477, -66.112183, 'Rio Seco 3', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.373477, longitude = -66.112183, nombre = 'Rio Seco 3', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (13, 'naranja', -17.381557, -66.161412, 'Humbol 1', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.381557, longitude = -66.161412, nombre = 'Humbol 1', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (14, 'naranja', -17.381557, -66.161412, 'Humbol 2', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.381557, longitude = -66.161412, nombre = 'Humbol 2', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (15, 'naranja', -17.381559, -66.161238, 'Humbol 3', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.381559, longitude = -66.161238, nombre = 'Humbol 3', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (16, 'naranja', -17.381557, -66.161412, 'Humbol 4', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.381557, longitude = -66.161412, nombre = 'Humbol 4', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (17, 'naranja', -17.381557, -66.161412, 'Humbol 5 Organicos', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.381557, longitude = -66.161412, nombre = 'Humbol 5 Organicos', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (18, 'naranja', -17.385395, -66.207901, 'Coña coña 1', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.385395, longitude = -66.207901, nombre = 'Coña coña 1', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (19, 'naranja', -17.385461, -66.207926, 'Coña coña 2', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.385461, longitude = -66.207926, nombre = 'Coña coña 2', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (20, 'naranja', -17.385385, -66.207817, 'Coña coña 3', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.385385, longitude = -66.207817, nombre = 'Coña coña 3', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (21, 'naranja', -17.406661, -66.169795, 'Sajama 1', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.406661, longitude = -66.169795, nombre = 'Sajama 1', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (22, 'naranja', -17.406718, -66.169696, 'sajama 2', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.406718, longitude = -66.169696, nombre = 'sajama 2', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (23, 'naranja', -17.40674, -66.169611, 'Sajama 3', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.40674, longitude = -66.169611, nombre = 'Sajama 3', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (24, 'naranja', -17.397039, -66.21325, 'Capitan Ustaris 1', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.397039, longitude = -66.21325, nombre = 'Capitan Ustaris 1', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (25, 'naranja', -17.397054, -66.213172, 'Capitan Ustaris 2', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.397054, longitude = -66.213172, nombre = 'Capitan Ustaris 2', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (26, 'naranja', -17.402675, -66.198928, 'Imba 1', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.402675, longitude = -66.198928, nombre = 'Imba 1', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (27, 'naranja', -17.402675, -66.198928, 'Imba 2', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.402675, longitude = -66.198928, nombre = 'Imba 2', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (28, 'naranja', -17.409014, -66.180583, 'Daniel campos 1', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.409014, longitude = -66.180583, nombre = 'Daniel campos 1', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (29, 'naranja', -17.409147, -66.180574, 'Daniel campos 2', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.409147, longitude = -66.180574, nombre = 'Daniel campos 2', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (30, 'naranja', -17.408776, -66.178675, 'Chimba (pilihuachana)', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.408776, longitude = -66.178675, nombre = 'Chimba (pilihuachana)', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (31, 'naranja', -17.429278, -66.155837, 'Santa barbara 1', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.429278, longitude = -66.155837, nombre = 'Santa barbara 1', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (32, 'naranja', -17.429312, -66.155794, 'Santa barbara 2', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.429312, longitude = -66.155794, nombre = 'Santa barbara 2', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (33, 'naranja', -17.429373, -66.155768, 'Santa Barbara 3', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.429373, longitude = -66.155768, nombre = 'Santa Barbara 3', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (34, 'naranja', -17.407318, -66.146781, 'Corte', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.407318, longitude = -66.146781, nombre = 'Corte', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (35, 'naranja', -17.407064, -66.145215, 'Castillo', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.407064, longitude = -66.145215, nombre = 'Castillo', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (36, 'naranja', -17.415139, -66.142118, 'Cerro Verde 1', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.415139, longitude = -66.142118, nombre = 'Cerro Verde 1', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (37, 'naranja', -17.415161, -66.142097, 'Cerro Verde 2', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.415161, longitude = -66.142097, nombre = 'Cerro Verde 2', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (38, 'naranja', -17.415203, -66.142077, 'Cerro Verde ( organicos)', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.415203, longitude = -66.142077, nombre = 'Cerro Verde ( organicos)', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (39, 'naranja', -17.438168, -66.132665, 'Valle Hermoso', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.438168, longitude = -66.132665, nombre = 'Valle Hermoso', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (40, 'naranja', -17.430415, -66.127986, 'Siglo XX - 1', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.430415, longitude = -66.127986, nombre = 'Siglo XX - 1', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (41, 'naranja', -17.430465, -66.127982, 'Siglo XX - 2', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.430465, longitude = -66.127982, nombre = 'Siglo XX - 2', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (42, 'naranja', -17.430512, -66.127977, 'Siglo XX - 3', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.430512, longitude = -66.127977, nombre = 'Siglo XX - 3', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (43, 'naranja', -17.424266, -66.154059, 'Tras Arco 1', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.424266, longitude = -66.154059, nombre = 'Tras Arco 1', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (44, 'naranja', -17.424312, -66.154067, 'Tras Arco 2', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.424312, longitude = -66.154067, nombre = 'Tras Arco 2', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (45, 'naranja', -17.424359, -66.154055, 'Tras arco 3', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.424359, longitude = -66.154055, nombre = 'Tras arco 3', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (46, 'naranja', -17.449123, -66.132401, 'Petrolera km5 1', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.449123, longitude = -66.132401, nombre = 'Petrolera km5 1', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (47, 'naranja', -17.449177, -66.132393, 'Petrolera km5 2', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.449177, longitude = -66.132393, nombre = 'Petrolera km5 2', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (48, 'naranja', -17.450872, -66.143253, 'Pasaje politecnico 1', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.450872, longitude = -66.143253, nombre = 'Pasaje politecnico 1', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (49, 'naranja', -17.450925, -66.143218, 'Pasaje politecnico 2', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.450925, longitude = -66.143218, nombre = 'Pasaje politecnico 2', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (50, 'naranja', -17.443498, -66.165444, 'Epi Sud 1', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.443498, longitude = -66.165444, nombre = 'Epi Sud 1', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (51, 'naranja', -17.443578, -66.165464, 'Epi Sud 2', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.443578, longitude = -66.165464, nombre = 'Epi Sud 2', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (52, 'naranja', -17.445725, -66.173497, 'Mercado Mayorista 1', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.445725, longitude = -66.173497, nombre = 'Mercado Mayorista 1', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (53, 'naranja', -17.445804, -66.173507, 'Mercado Mayorista 2', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.445804, longitude = -66.173507, nombre = 'Mercado Mayorista 2', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (54, 'naranja', -17.462692, -66.173548, 'Otb - 16 de Julio', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.462692, longitude = -66.173548, nombre = 'Otb - 16 de Julio', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (55, 'naranja', -17.471732, -66.173073, 'Mejillones 1', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.471732, longitude = -66.173073, nombre = 'Mejillones 1', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (56, 'naranja', -17.471789, -66.173108, 'Mejillones 2', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.471789, longitude = -66.173108, nombre = 'Mejillones 2', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (57, 'naranja', -17.492862, -66.172873, 'Santivañez 1', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.492862, longitude = -66.172873, nombre = 'Santivañez 1', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (58, 'naranja', -17.49295, -66.172899, 'Santivañes 2', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.49295, longitude = -66.172899, nombre = 'Santivañes 2', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (59, 'naranja', -17.483293, -66.098133, 'Arbiero', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.483293, longitude = -66.098133, nombre = 'Arbiero', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (60, 'naranja', -17.471396, -66.112595, 'calicanto 1', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.471396, longitude = -66.112595, nombre = 'calicanto 1', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (61, 'naranja', -17.471469, -66.112593, 'calicanto 2', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.471469, longitude = -66.112593, nombre = 'calicanto 2', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (62, 'naranja', -17.481937, -66.109153, 'Uspa Uspa', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.481937, longitude = -66.109153, nombre = 'Uspa Uspa', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (63, 'naranja', -17.451009, -66.119269, 'Urkupiña 1', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.451009, longitude = -66.119269, nombre = 'Urkupiña 1', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (64, 'naranja', -17.451055, -66.119267, 'Urkupiña 2', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.451055, longitude = -66.119267, nombre = 'Urkupiña 2', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (65, 'naranja', -17.429041, -66.118133, 'Ende 1', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.429041, longitude = -66.118133, nombre = 'Ende 1', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (66, 'naranja', -17.42909, -66.118104, 'Ende 2', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.42909, longitude = -66.118104, nombre = 'Ende 2', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (67, 'naranja', -17.429123, -66.11807, 'Ende 3', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.429123, longitude = -66.11807, nombre = 'Ende 3', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (68, 'naranja', -17.402262, -66.155453, 'Punata Esteban Arce', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.402262, longitude = -66.155453, nombre = 'Punata Esteban Arce', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (69, 'naranja', -17.402412, -66.152625, 'Lanza Punata', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.402412, longitude = -66.152625, nombre = 'Lanza Punata', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (70, 'naranja', -17.402491, -66.151021, 'Republica Punata', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.402491, longitude = -66.151021, nombre = 'Republica Punata', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (71, 'naranja', -17.407721, -66.150744, 'San Carlos', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.407721, longitude = -66.150744, nombre = 'San Carlos', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (72, 'naranja', -17.401522, -66.151235, 'Honduras Republica', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.401522, longitude = -66.151235, nombre = 'Honduras Republica', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (73, 'naranja', -17.399933, -66.149941, 'Republica 16 De Julio', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.399933, longitude = -66.149941, nombre = 'Republica 16 De Julio', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (74, 'naranja', -17.404951, -66.153338, 'Barrientos Pulacayo 1', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.404951, longitude = -66.153338, nombre = 'Barrientos Pulacayo 1', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (75, 'naranja', -17.405079, -66.153375, 'Barrientos Pulacayo 2', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.405079, longitude = -66.153375, nombre = 'Barrientos Pulacayo 2', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (76, 'naranja', -17.406413, -66.148545, 'Victor Paz', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.406413, longitude = -66.148545, nombre = 'Victor Paz', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (77, 'naranja', -17.402247, -66.149419, 'Piscina San Miguel', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.402247, longitude = -66.149419, nombre = 'Piscina San Miguel', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (78, 'naranja', -17.404426, -66.158376, 'Pasaje Corinilla', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.404426, longitude = -66.158376, nombre = 'Pasaje Corinilla', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (79, 'naranja', -17.398406, -66.160316, 'Carcel', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.398406, longitude = -66.160316, nombre = 'Carcel', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (80, 'naranja', -17.449913, -66.243291, 'Caico', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.449913, longitude = -66.243291, nombre = 'Caico', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (81, 'naranja', -17.466123, -66.126282, 'Cementerio de kara kara', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.466123, longitude = -66.126282, nombre = 'Cementerio de kara kara', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (82, 'naranja', -17.402392, -66.128181, 'Contri club', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.402392, longitude = -66.128181, nombre = 'Contri club', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (83, 'naranja', -17.328705, -66.185304, 'Taquiña', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.328705, longitude = -66.185304, nombre = 'Taquiña', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (84, 'naranja', -17.345598, -66.183545, 'Fabe', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.345598, longitude = -66.183545, nombre = 'Fabe', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (85, 'naranja', -17.364491, -66.162298, 'Semapa Circumvalacion', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.364491, longitude = -66.162298, nombre = 'Semapa Circumvalacion', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (86, 'naranja', -17.432797, -66.191654, 'Semapa Champarrancho', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.432797, longitude = -66.191654, nombre = 'Semapa Champarrancho', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (87, 'naranja', -17.392179, -66.219762, 'Duralit', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.392179, longitude = -66.219762, nombre = 'Duralit', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (88, 'naranja', -17.40133, -66.158429, 'Terminal 1', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.40133, longitude = -66.158429, nombre = 'Terminal 1', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (89, 'naranja', -17.401335, -66.1585, 'Terminal 2', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.401335, longitude = -66.1585, nombre = 'Terminal 2', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (90, 'naranja', -17.411557, -66.158527, 'Cementerio General 1', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.411557, longitude = -66.158527, nombre = 'Cementerio General 1', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (91, 'naranja', -17.409998, -66.162721, 'Cementerio General 2', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.409998, longitude = -66.162721, nombre = 'Cementerio General 2', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (92, 'naranja', -17.410683, -66.172194, 'Nabol 1', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.410683, longitude = -66.172194, nombre = 'Nabol 1', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (93, 'naranja', -17.410674, -66.172092, 'Nabol 2', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.410674, longitude = -66.172092, nombre = 'Nabol 2', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (94, 'naranja', -17.41068, -66.171986, 'Nabol 3', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.41068, longitude = -66.171986, nombre = 'Nabol 3', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (95, 'naranja', -17.421934, -66.129644, 'FeXco 1', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.421934, longitude = -66.129644, nombre = 'FeXco 1', cantidad = 1, estado = 'activo';

INSERT INTO public.contenedores (id, tipo, latitude, longitude, nombre, cantidad, estado, nivel_llenado)
VALUES (96, 'naranja', -17.421944, -66.129714, 'FeXco 2', 1, 'activo', 0)
ON CONFLICT (id) DO UPDATE SET
  tipo = 'naranja', latitude = -17.421944, longitude = -66.129714, nombre = 'FeXco 2', cantidad = 1, estado = 'activo';

SELECT setval(
  pg_get_serial_sequence('public.contenedores', 'id'),
  (SELECT COALESCE(MAX(id), 1) FROM public.contenedores)
);
COMMIT;