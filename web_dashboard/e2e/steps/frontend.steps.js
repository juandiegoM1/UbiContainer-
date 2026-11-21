const assert = require("node:assert/strict");
const { Given, When, Then } = require("@cucumber/cucumber");

const adminEmail = "admin@ubicontainer.com";
const adminPassword = "123456";

async function signIn(page, email, password) {
  await page.getByPlaceholder("tu@email.com").fill(email);
  await page.getByPlaceholder("********").fill(password);
  await page.getByRole("button", { name: "Iniciar Sesion" }).click();
}

async function expectVisible(locator) {
  await locator.waitFor({ state: "visible", timeout: 15_000 });
}

Given("que abro la página de inicio de sesión", async function () {
  await this.page.goto("/");
});

Given("que tengo una sesión de administrador", async function () {
  await this.page.goto("/");
  await signIn(this.page, adminEmail, adminPassword);
  await this.page.waitForURL("**/dashboard");
});

When("envío el formulario sin completar los campos obligatorios", async function () {
  await this.page.getByRole("button", { name: "Iniciar Sesion" }).click();
});

Then("el formulario permanece abierto y exige el correo", async function () {
  assert.equal(new URL(this.page.url()).pathname, "/");
  assert.equal(
    await this.page.locator('input[type="email"]').evaluate((input) => input.validity.valueMissing),
    true
  );
});

When("inicio sesión con credenciales demo válidas", async function () {
  await signIn(this.page, adminEmail, adminPassword);
});

Then("se muestra el panel de control", async function () {
  await this.page.waitForURL("**/dashboard");
  await expectVisible(
    this.page.getByRole("heading", { name: "Panel de Control", exact: true })
  );
});

When("inicio sesión con credenciales inválidas", async function () {
  await signIn(this.page, "invalid@example.test", "wrong-password");
});

Then("la página de inicio de sesión muestra un mensaje de credenciales inválidas", async function () {
  await expectVisible(this.page.getByText("Credenciales incorrectas."));
  assert.equal(new URL(this.page.url()).pathname, "/");
});

When("abro directamente el dashboard sin una sesión", async function () {
  await this.page.goto("/dashboard");
});

Then("soy redirigido a la página de inicio de sesión", async function () {
  await this.page.waitForURL((url) => url.pathname === "/");
  await expectVisible(this.page.getByRole("heading", { name: "UbiContainer" }));
});

When("sigo la navegación del dashboard", async function (dataTable) {
  this.visitedPages = [];
  for (const { label, path, heading } of dataTable.hashes()) {
    await this.page.getByRole("button", { name: label, exact: true }).click();
    await this.page.waitForURL((url) => url.pathname === path);
    await expectVisible(
      this.page.getByRole("heading", { name: heading, exact: true })
    );
    this.visitedPages.push(path);
  }
});

Then("se alcanza cada sección del dashboard", async function (dataTable) {
  const expectedPaths = dataTable.hashes().map(({ path }) => path);
  assert.deepEqual(this.visitedPages, expectedPaths);
});

When("cierro mi sesión", async function () {
  await this.page.getByRole("button", { name: "Cerrar Sesion" }).click();
});

Then("vuelvo al login y la sesión queda eliminada", async function () {
  await this.page.waitForURL((url) => url.pathname === "/");
  assert.equal(
    await this.page.evaluate(() =>
      sessionStorage.getItem("ubicontainer_session")
    ),
    null
  );
  await expectVisible(this.page.getByRole("button", { name: "Iniciar Sesion" }));
});

When("abro el dashboard", async function () {
  await this.page.goto("/dashboard");
});

Then("se muestran el resumen y las secciones operativas", async function () {
  await expectVisible(
    this.page.getByRole("heading", { name: "Panel de Control", exact: true })
  );
  await expectVisible(this.page.getByText("Contenedores Totales", { exact: true }));
  await expectVisible(
    this.page.getByRole("heading", { name: "Plan operativo de recoleccion" })
  );
  await expectVisible(
    this.page.getByRole("heading", { name: "Distribucion por Tipo" })
  );
});

When("abro la sección de contenedores", async function () {
  await this.page.goto("/contenedores");
});

Then("se muestran la lista de contenedores y sus indicadores", async function () {
  await expectVisible(this.page.getByRole("heading", { name: "Contenedores", exact: true }));
  await expectVisible(this.page.getByText("#1", { exact: true }).last());
  await expectVisible(this.page.getByText("#2", { exact: true }).last());
  await expectVisible(this.page.getByText("Parque Central", { exact: true }).last());
  await expectVisible(this.page.getByText("Total", { exact: true }));
  await expectVisible(this.page.getByText("Verdes", { exact: true }));
});

When("busco, filtro por tipo y limpio los filtros de contenedores", async function () {
  await this.page.goto("/contenedores");
  const search = this.page.getByPlaceholder("Buscar por #ID, nombre o tipo...");
  await search.fill("Mercado");
  await this.page.getByRole("button", { name: "Naranja", exact: true }).click();
  await expectVisible(this.page.getByText("#2", { exact: true }).last());
  assert.equal(await this.page.getByText("#1", { exact: true }).count(), 0);

  await search.fill("#999");
  await expectVisible(
    this.page.getByRole("heading", { name: "Ningun contenedor encontrado" })
  );
  await this.page.getByRole("button", { name: "Limpiar filtros" }).click();
});

Then("se muestran todos los tipos de contenedor y la búsqueda queda vacía", async function () {
  assert.equal(
    await this.page.getByPlaceholder("Buscar por #ID, nombre o tipo...").inputValue(),
    ""
  );
  await expectVisible(this.page.getByText("#1", { exact: true }).last());
  await expectVisible(this.page.getByText("#2", { exact: true }).last());
  await expectVisible(this.page.getByText("#3", { exact: true }).last());
});

When("abro la sección del mapa", async function () {
  await this.page.goto("/mapa");
});

Then("se muestran el título del mapa y la acción de contenedores", async function () {
  await expectVisible(
    this.page.getByRole("heading", { name: "Mapa de Contenedores", exact: true })
  );
  await expectVisible(
    this.page.getByRole("button", { name: "+ Nuevo contenedor" })
  );
});

When("abro la sección de reportes", async function () {
  await this.page.goto("/reportes");
});

When("filtro los reportes por estado pendiente", async function () {
  await this.page.getByRole("button", { name: "Pendiente", exact: true }).click();
});

Then("solo se muestran los reportes pendientes", async function () {
  const table = this.page.getByRole("table");
  await expectVisible(table.getByText("Reporte pendiente de prueba"));
  assert.equal(await table.getByText("Reporte en proceso de prueba").count(), 0);
  assert.equal(await table.getByText("Reporte atendido de prueba").count(), 0);
});

When("cambio el reporte pendiente a en proceso", async function () {
  const reportRow = this.page
    .getByRole("row")
    .filter({ hasText: "Reporte pendiente de prueba" });
  await reportRow.getByRole("combobox").selectOption("en_proceso");
});

Then("se muestra el nuevo estado y la actualización usa datos de prueba", async function () {
  const reportRow = this.page
    .getByRole("row")
    .filter({ hasText: "Reporte pendiente de prueba" });
  assert.equal(await reportRow.getByRole("combobox").inputValue(), "en_proceso");
  assert.deepEqual(this.mockedReportUpdates, [
    { id: 101, estado: "en_proceso" },
  ]);
});

When("abro la sección de alertas de capacidad", async function () {
  await this.page.goto("/alertas");
});

Then("solo se listan los contenedores que requieren atención", async function () {
  await expectVisible(
    this.page.getByRole("heading", { name: "Alertas de capacidad", exact: true })
  );
  await expectVisible(this.page.getByRole("heading", { name: "Contenedor #2" }));
  await expectVisible(this.page.getByRole("heading", { name: "Contenedor #3" }));
  assert.equal(
    await this.page.getByRole("heading", { name: "Contenedor #1" }).count(),
    0
  );
});

When("activo el modo oscuro y recargo la configuración", async function () {
  const darkMode = this.page.getByRole("switch", { name: "Modo oscuro" });
  await darkMode.click();
  await this.page.getByText("Cambios guardados", { exact: true }).waitFor();
  await this.page.reload();
  await expectVisible(darkMode);
});

Then("el modo oscuro permanece activo después de recargar", async function () {
  assert.equal(
    await this.page.getByRole("switch", { name: "Modo oscuro" }).getAttribute("aria-checked"),
    "true"
  );
  assert.equal(
    await this.page.locator("html").evaluate((element) => element.classList.contains("dark")),
    true
  );
});

Given("abro la configuración", async function () {
  await this.page.goto("/configuracion");
});

Given("cambié las preferencias de apariencia e idioma", async function () {
  await this.page.goto("/configuracion");
  await this.page.getByRole("switch", { name: "Modo oscuro" }).click();
  await this.page.getByRole("button", { name: "English", exact: true }).click();
});

When("restauro la configuración predeterminada", async function () {
  await this.page.getByRole("button", { name: "Restaurar valores por defecto" }).click();
});

Then("se restauran la apariencia y el idioma predeterminados", async function () {
  assert.equal(
    await this.page.getByRole("switch", { name: "Modo oscuro" }).getAttribute("aria-checked"),
    "false"
  );
  assert.equal(
    await this.page.locator("html").evaluate((element) => element.lang),
    "es"
  );
});
