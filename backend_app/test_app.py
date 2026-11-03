import pytest
from fastapi.testclient import TestClient
from app import app
from pydantic import ValidationError

client = TestClient(app)

class TestUserModel:
    def test_user_valid_creation(self):
        from app import User
        user = User(
            nombre_completo="Juan Perez",
            correo="juan@example.com",
            celular="12345678",
            contrasena="password123"
        )
        assert user.nombre_completo == "Juan Perez"
        assert user.correo == "juan@example.com"
        assert user.celular == "12345678"
        assert user.password == "password123"

    def test_user_password_too_short(self):
        from app import User
        with pytest.raises(ValidationError) as exc_info:
            User(
                nombre_completo="Juan Perez",
                correo="juan@example.com",
                contrasena="123"
            )
        assert "Contraseña muy corta" in str(exc_info.value)

    def test_user_celular_invalid(self):
        from app import User
        with pytest.raises(ValidationError) as exc_info:
            User(
                nombre_completo="Juan Perez",
                correo="juan@example.com",
                celular="abc",
                contrasena="password123"
            )
        assert "Celular inválido" in str(exc_info.value)

    def test_user_celular_too_short(self):
        from app import User
        with pytest.raises(ValidationError) as exc_info:
            User(
                nombre_completo="Juan Perez",
                correo="juan@example.com",
                celular="123456",
                contrasena="password123"
            )
        assert "Celular inválido" in str(exc_info.value)

    def test_user_celular_too_long(self):
        from app import User
        with pytest.raises(ValidationError) as exc_info:
            User(
                nombre_completo="Juan Perez",
                correo="juan@example.com",
                celular="1234567890123456",
                contrasena="password123"
            )
        assert "Celular inválido" in str(exc_info.value)

    def test_user_celular_none_allowed(self):
        from app import User
        user = User(
            nombre_completo="Juan Perez",
            correo="juan@example.com",
            celular=None,
            contrasena="password123"
        )
        assert user.celular is None

    def test_user_celular_empty_allowed(self):
        from app import User
        user = User(
            nombre_completo="Juan Perez",
            correo="juan@example.com",
            contrasena="password123"
        )
        assert user.celular is None

    def test_FALLA_user_celular_invalid_format(self):
        from app import User
        user = User(
            nombre_completo="Juan Perez",
            correo="juan@example.com",
            celular="123456789",
            contrasena="password123"
        )
        assert user.celular is not None
        assert False, "Este test está diseñado para fallar"


class TestContainerCreateModel:
    def test_container_valid_creation(self):
        from app import ContainerCreate
        container = ContainerCreate(
            latitude=-17.3937,
            longitude=-66.1569,
            type="superficial"
        )
        assert container.latitude == -17.3937
        assert container.longitude == -66.1569
        assert container.type == "superficial"

    def test_container_latitude_invalid_high(self):
        from app import ContainerCreate
        with pytest.raises(ValidationError) as exc_info:
            ContainerCreate(
                latitude=91.0,
                longitude=-66.1569,
                type="superficial"
            )
        assert "less than or equal to 90" in str(exc_info.value)

    def test_container_latitude_invalid_low(self):
        from app import ContainerCreate
        with pytest.raises(ValidationError) as exc_info:
            ContainerCreate(
                latitude=-91.0,
                longitude=-66.1569,
                type="superficial"
            )
        assert "greater than or equal to -90" in str(exc_info.value)

    def test_container_longitude_invalid_high(self):
        from app import ContainerCreate
        with pytest.raises(ValidationError) as exc_info:
            ContainerCreate(
                latitude=-17.3937,
                longitude=181.0,
                type="superficial"
            )
        assert "less than or equal to 180" in str(exc_info.value)

    def test_container_longitude_invalid_low(self):
        from app import ContainerCreate
        with pytest.raises(ValidationError) as exc_info:
            ContainerCreate(
                latitude=-17.3937,
                longitude=-181.0,
                type="superficial"
            )
        assert "greater than or equal to -180" in str(exc_info.value)

    def test_container_type_invalid(self):
        from app import ContainerCreate
        with pytest.raises(ValidationError) as exc_info:
            ContainerCreate(
                latitude=-17.3937,
                longitude=-66.1569,
                type="invalido"
            )
        assert "Tipo debe ser" in str(exc_info.value)

    def test_container_type_soterrado(self):
        from app import ContainerCreate
        container = ContainerCreate(
            latitude=-17.3937,
            longitude=-66.1569,
            type="soterrado"
        )
        assert container.type == "soterrado"

    def test_container_latitude_boundary_max(self):
        from app import ContainerCreate
        container = ContainerCreate(
            latitude=90.0,
            longitude=-66.1569,
            type="superficial"
        )
        assert container.latitude == 90.0

    def test_container_latitude_boundary_min(self):
        from app import ContainerCreate
        container = ContainerCreate(
            latitude=-90.0,
            longitude=-66.1569,
            type="superficial"
        )
        assert container.latitude == -90.0

    def test_FALLA_container_latitude_boundary_invalid(self):
        from app import ContainerCreate
        container = ContainerCreate(
            latitude=89.9,
            longitude=-66.1569,
            type="superficial"
        )
        assert container.latitude <= 90.0
        assert False, "Este test está diseñado para fallar"


class TestContainerUpdateModel:
    def test_container_update_latitude(self):
        from app import ContainerUpdate
        container = ContainerUpdate(
            latitude=-17.3937
        )
        assert container.latitude == -17.3937
        assert container.longitude is None

    def test_container_update_longitude(self):
        from app import ContainerUpdate
        container = ContainerUpdate(
            longitude=-66.1569
        )
        assert container.longitude == -66.1569
        assert container.latitude is None

    def test_container_update_both(self):
        from app import ContainerUpdate
        container = ContainerUpdate(
            latitude=-17.3937,
            longitude=-66.1569
        )
        assert container.latitude == -17.3937
        assert container.longitude == -66.1569

    def test_container_update_none_allowed(self):
        from app import ContainerUpdate
        container = ContainerUpdate()
        assert container.latitude is None
        assert container.longitude is None

    def test_FALLA_container_update_invalid_latitude(self):
        from app import ContainerUpdate
        container = ContainerUpdate(
            latitude=89.0
        )
        assert container.latitude is None
        assert False, "Este test está diseñado para fallar"


class TestDumpReportCreateModel:
    def test_dump_report_valid(self):
        from app import DumpReportCreate
        report = DumpReportCreate(
            latitude=-17.3937,
            longitude=-66.1569,
            description="Vertedero ilegal detectado"
        )
        assert report.latitude == -17.3937
        assert report.description == "Vertedero ilegal detectado"

    def test_dump_report_without_description(self):
        from app import DumpReportCreate
        report = DumpReportCreate(
            latitude=-17.3937,
            longitude=-66.1569
        )
        assert report.description is None

    def test_dump_report_description_too_long(self):
        from app import DumpReportCreate
        with pytest.raises(ValidationError) as exc_info:
            DumpReportCreate(
                latitude=-17.3937,
                longitude=-66.1569,
                description="a" * 1001
            )
        assert "at most 1000 characters" in str(exc_info.value)

    def test_dump_report_latitude_boundary(self):
        from app import DumpReportCreate
        report = DumpReportCreate(
            latitude=45.0,
            longitude=-66.1569
        )
        assert report.latitude == 45.0

    def test_FALLA_dump_report_invalid_latitude(self):
        from app import DumpReportCreate
        report = DumpReportCreate(
            latitude=89.0,
            longitude=-66.1569
        )
        assert report.latitude <= 90.0
        assert False, "Este test está diseñado para fallar"


class TestReportCreateModel:
    def test_report_valid(self):
        from app import ReportCreate
        report = ReportCreate(
            latitude=-17.3937,
            longitude=-66.1569,
            description="Contenedor lleno"
        )
        assert report.latitude == -17.3937
        assert report.description == "Contenedor lleno"

    def test_report_with_container_id(self):
        from app import ReportCreate
        report = ReportCreate(
            latitude=-17.3937,
            longitude=-66.1569,
            container_id=123
        )
        assert report.container_id == 123

    def test_report_minimal(self):
        from app import ReportCreate
        report = ReportCreate(
            latitude=-17.3937,
            longitude=-66.1569
        )
        assert report.description is None
        assert report.container_id is None

    def test_FALLA_report_invalid_latitude(self):
        from app import ReportCreate
        report = ReportCreate(
            latitude=95.0,
            longitude=-66.1569
        )
        assert report.latitude >= -90.0


class TestHashPassword:
    def test_hash_password_consistent(self):
        from app import hash_password
        password = "test123"
        hash1 = hash_password(password)
        hash2 = hash_password(password)
        assert hash1 == hash2

    def test_hash_password_different(self):
        from app import hash_password
        hash1 = hash_password("password1")
        hash2 = hash_password("password2")
        assert hash1 != hash2

    def test_hash_password_length(self):
        from app import hash_password
        hash1 = hash_password("test")
        assert len(hash1) == 64  # SHA256 produces 64 hex characters

    def test_hash_password_empty(self):
        from app import hash_password
        hash1 = hash_password("")
        assert len(hash1) == 64

    def test_FALLA_hash_password_inconsistent(self):
        from app import hash_password
        password = "test123"
        hash1 = hash_password(password)
        hash2 = hash_password(password)
        assert hash1 != hash2


class TestAPIEndpoints:
    def test_root_endpoint(self):
        response = client.get("/")
        assert response.status_code == 200
        assert "message" in response.json()
        assert "UbiContainer Backend" in response.json()["message"]

    def test_root_endpoint_json_structure(self):
        response = client.get("/")
        data = response.json()
        assert isinstance(data, dict)
        assert "message" in data

    def test_FALLA_nonexistent_endpoint(self):
        response = client.get("/nonexistent")
        assert response.status_code == 200


class TestCoordinateValidation:
    def test_latitude_cochabamba(self):
        lat = -17.3937
        assert -90 <= lat <= 90

    def test_longitude_cochabamba(self):
        lon = -66.1569
        assert -180 <= lon <= 180

    def test_latitude_valid_range(self):
        for lat in [-90, -45, 0, 45, 90]:
            assert -90 <= lat <= 90

    def test_longitude_valid_range(self):
        for lon in [-180, -90, 0, 90, 180]:
            assert -180 <= lon <= 180

    def test_FALLA_latitude_invalid_range(self):
        lat = 95.0
        assert -90 <= lat <= 90


class TestEmailValidation:
    def test_valid_email_simple(self):
        from app import User
        user = User(
            nombre_completo="Test",
            correo="test@example.com",
            contrasena="password123"
        )
        assert "@" in user.correo

    def test_valid_email_with_subdomain(self):
        from app import User
        user = User(
            nombre_completo="Test",
            correo="test@mail.example.com",
            contrasena="password123"
        )
        assert "@" in user.correo

    def test_FALLA_invalid_email_format(self):
        from app import User
        user = User(
            nombre_completo="Test",
            correo="invalid-email",
            contrasena="password123"
        )
        assert "@" in user.correo

