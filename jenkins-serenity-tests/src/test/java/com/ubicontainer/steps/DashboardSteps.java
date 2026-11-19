package com.ubicontainer.steps;

import io.cucumber.java.es.Dado;
import io.cucumber.java.es.Cuando;
import io.cucumber.java.es.Entonces;
import io.cucumber.java.es.Y;
import io.cucumber.datatable.DataTable;

import net.serenitybdd.rest.SerenityRest;
import net.serenitybdd.annotations.Step;

import io.restassured.response.Response;

import java.util.List;
import java.util.Map;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

public class DashboardSteps {

    private String backendUrl;
    private String dashboardUrl;
    private Response response;

    // ========== ANTECEDENTES ==========

    @Dado("que el backend de UbiContainer está corriendo en {string}")
    public void backendCorriendo(String url) {
        this.backendUrl = url;
    }

    @Dado("que el dashboard está disponible en {string}")
    public void dashboardDisponible(String url) {
        this.dashboardUrl = url;
    }

    // ========== CUANDO ==========

    @Cuando("hago una petición GET a {string}")
    public void hacerPeticionGet(String endpoint) {
        response = SerenityRest
                .given()
                .baseUri(backendUrl)
                .when()
                .get(endpoint);
    }

    @Cuando("accedo al dashboard en {string}")
    public void accederAlDashboard(String url) {
        response = SerenityRest
                .given()
                .when()
                .get(url);
    }

    @Cuando("creo un contenedor con los siguientes datos:")
    public void crearContenedor(DataTable dataTable) {
        List<Map<String, String>> datos = dataTable.asMaps();
        Map<String, String> contenedor = datos.get(0);

        String body = String.format(
            "{\"type\":\"%s\",\"latitude\":%s,\"longitude\":%s}",
            contenedor.get("type"),
            contenedor.get("latitude"),
            contenedor.get("longitude")
        );

        response = SerenityRest
                .given()
                .baseUri(backendUrl)
                .contentType("application/json")
                .body(body)
                .when()
                .post("/containers");
    }

    @Cuando("intento crear un reporte de vertedero sin autenticarme")
    public void crearReporteVertederoSinAutenticacion() {
        response = SerenityRest
                .given()
                .baseUri(backendUrl)
                .multiPart("latitude", "-17.3895")
                .multiPart("longitude", "-66.1568")
                .multiPart("description", "Prueba de autorización")
                .multiPart("photo", "test.jpg", new byte[] {1, 2, 3}, "image/jpeg")
                .when()
                .post("/dump-reports");
    }

    // ========== ENTONCES ==========

    @Entonces("el código de respuesta debe ser {int}")
    public void verificarCodigoRespuesta(int statusCode) {
        assertThat(response.getStatusCode(), is(statusCode));
    }

    @Entonces("la respuesta debe ser una lista JSON")
    public void respuestaEsListaJson() {
        List<?> lista = response.jsonPath().getList("$");
        assertThat(lista, is(notNullValue()));
    }

    @Entonces("la página debe responder con código {int}")
    public void paginaRespondeConCodigo(int statusCode) {
        assertThat(response.getStatusCode(), is(statusCode));
    }

    // ========== Y (validaciones adicionales) ==========

    @Y("cada contenedor debe tener los campos {string}, {string}, {string}, {string}")
    public void contenedorTieneCampos(String c1, String c2, String c3, String c4) {
        List<Map<String, Object>> lista = response.jsonPath().getList("$");
        if (!lista.isEmpty()) {
            for (Map<String, Object> item : lista) {
                assertThat(item, hasKey(c1));
                assertThat(item, hasKey(c2));
                assertThat(item, hasKey(c3));
                assertThat(item, hasKey(c4));
            }
        }
    }

    @Y("los tipos de contenedor deben ser {string}, {string} o {string}")
    public void tiposValidos(String t1, String t2, String t3) {
        List<String> tipos = response.jsonPath().getList("type");
        if (tipos != null && !tipos.isEmpty()) {
            for (String tipo : tipos) {
                assertThat(tipo, isOneOf(t1, t2, t3));
            }
        }
    }

    @Y("la respuesta debe contener el campo {string}")
    public void respuestaContieneCampo(String campo) {
        Object valor = response.jsonPath().get(campo);
        assertThat(valor, is(notNullValue()));
    }

    @Y("cada contenedor debe tener latitud entre {int} y {int}")
    public void latitudEnRango(int min, int max) {
        List<Float> latitudes = response.jsonPath().getList("latitude", Float.class);
        if (latitudes != null) {
            for (Float lat : latitudes) {
                assertThat((double) lat, is(both(greaterThanOrEqualTo((double) min)).and(lessThanOrEqualTo((double) max))));
            }
        }
    }

    @Y("cada contenedor debe tener longitud entre {int} y {int}")
    public void longitudEnRango(int min, int max) {
        List<Float> longitudes = response.jsonPath().getList("longitude", Float.class);
        if (longitudes != null) {
            for (Float lon : longitudes) {
                assertThat((double) lon, is(both(greaterThanOrEqualTo((double) min)).and(lessThanOrEqualTo((double) max))));
            }
        }
    }

}
