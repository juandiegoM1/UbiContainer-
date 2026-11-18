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
            "{\"tipo\":\"%s\",\"latitude\":%s,\"longitude\":%s,\"nombre\":\"%s\",\"cantidad\":1,\"estado\":\"activo\",\"nivel_llenado\":0}",
            contenedor.get("tipo"),
            contenedor.get("latitude"),
            contenedor.get("longitude"),
            contenedor.get("nombre")
        );

        response = SerenityRest
                .given()
                .baseUri(backendUrl)
                .contentType("application/json")
                .body(body)
                .when()
                .post("/contenedores");
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
        List<String> tipos = response.jsonPath().getList("tipo");
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

    @Y("la respuesta debe contener tipo {string}")
    public void respuestaContieneTipo(String tipo) {
        String tipoResp = response.jsonPath().getString("tipo");
        assertThat(tipoResp, equalTo(tipo));
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

    @Y("cada reporte debe tener los campos {string}, {string}, {string}")
    public void reporteTieneCampos(String c1, String c2, String c3) {
        List<Map<String, Object>> lista = response.jsonPath().getList("$");
        if (!lista.isEmpty()) {
            for (Map<String, Object> item : lista) {
                assertThat(item, hasKey(c1));
                assertThat(item, hasKey(c2));
                assertThat(item, hasKey(c3));
            }
        }
    }

    @Y("los estados de reporte deben ser {string}, {string} o {string}")
    public void estadosValidos(String e1, String e2, String e3) {
        List<String> estados = response.jsonPath().getList("estado");
        if (estados != null && !estados.isEmpty()) {
            for (String estado : estados) {
                assertThat(estado, isOneOf(e1, e2, e3));
            }
        }
    }
}
