const { After, AfterAll, Before, BeforeAll, Status, setDefaultTimeout } =
  require("@cucumber/cucumber");
const { chromium } = require("playwright");
const { spawn } = require("node:child_process");
const fs = require("node:fs/promises");
const path = require("node:path");
const { containers, reports } = require("./fixtures");

const dashboardDirectory = path.resolve(__dirname, "../..");
const nextCli = path.join(
  dashboardDirectory,
  "node_modules",
  "next",
  "dist",
  "bin",
  "next"
);
const baseUrl = "http://127.0.0.1:4173";
const localHosts = new Set(["127.0.0.1", "localhost"]);

let server;
let serverOutput = "";
let browser;

setDefaultTimeout(60_000);

function appendServerOutput(chunk) {
  serverOutput = `${serverOutput}${chunk}`.slice(-8000);
}

async function waitForServer() {
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`El servidor Next.js terminó antes de iniciar.\n${serverOutput}`);
    }

    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // Next.js has not started listening yet.
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`El servidor Next.js no inició a tiempo.\n${serverOutput}`);
}

function responseHeaders(count, start = 0) {
  const contentRange = count > 0 ? `${start}-${start + count - 1}/${count}` : "*/0";
  return {
    "content-type": "application/json",
    "content-range": contentRange,
  };
}

async function mockExternalRequest(route, world) {
  const request = route.request();
  const url = new URL(request.url());
  const isHead = request.method() === "HEAD";

  if (url.pathname.endsWith("/rest/v1/contenedores")) {
    if (request.headers().prefer?.includes("count=exact")) {
      const tipo = url.searchParams.get("tipo")?.replace(/^eq\./, "");
      const filtered = tipo
        ? containers.filter((container) => container.tipo === tipo)
        : containers;
      return route.fulfill({
        status: 200,
        headers: responseHeaders(filtered.length),
        body: isHead ? "" : "[]",
      });
    }

    return route.fulfill({
      status: 200,
      headers: responseHeaders(containers.length),
      body: isHead ? "" : JSON.stringify(containers),
    });
  }

  if (url.pathname.endsWith("/rest/v1/reportes_vertederos")) {
    if (request.method() === "PATCH") {
      const reportId = Number(
        url.searchParams.get("id")?.replace(/^eq\./, "")
      );
      const update = JSON.parse(request.postData() || "{}");
      const report = reports.find((item) => item.id === reportId);
      if (!report || !update.estado) {
        return route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify({ message: "Invalid test fixture update" }),
        });
      }

      world.mockedReportUpdates.push({
        id: reportId,
        estado: update.estado,
      });
      const updatedReport = { ...report, estado: update.estado };
      return route.fulfill({
        status: 200,
        headers: responseHeaders(1),
        body: JSON.stringify(updatedReport),
      });
    }

    return route.fulfill({
      status: 200,
      headers: responseHeaders(reports.length),
      body: isHead ? "" : JSON.stringify(reports),
    });
  }

  return route.abort();
}

BeforeAll({ timeout: 180_000 }, async () => {
  await fs.mkdir(path.join(dashboardDirectory, "test-results"), {
    recursive: true,
  });

  server = spawn(
    process.execPath,
    [nextCli, "dev", "--hostname", "127.0.0.1", "--port", "4173"],
    {
      cwd: dashboardDirectory,
      detached: true,
      env: {
        ...process.env,
        NEXT_TELEMETRY_DISABLED: "1",
        NEXT_PUBLIC_SUPABASE_URL: "https://frontend-tests.invalid",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "frontend-test-anon-key",
        NEXT_PUBLIC_MAPBOX_TOKEN: "pk.frontend-tests",
      },
      stdio: ["ignore", "pipe", "pipe"],
    }
  );
  server.stdout.on("data", appendServerOutput);
  server.stderr.on("data", appendServerOutput);

  try {
    await waitForServer();
    browser = await chromium.launch({ channel: "chrome", headless: true });
  } catch (error) {
    if (server.pid) process.kill(-server.pid, "SIGTERM");
    throw error;
  }
});

Before(async function () {
  this.mockedReportUpdates = [];
  this.context = await browser.newContext({
    baseURL: baseUrl,
    serviceWorkers: "block",
    viewport: { width: 1365, height: 900 },
  });

  await this.context.routeWebSocket("wss://**/*", (socket) => socket.close());
  this.page = await this.context.newPage();
  this.page.setDefaultTimeout(10_000);
  this.page.setDefaultNavigationTimeout(20_000);
  await this.page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (localHosts.has(url.hostname)) {
      return route.continue();
    }

    return mockExternalRequest(route, this);
  });
});

After(async function ({ result }) {
  if (result?.status === Status.FAILED && this.page) {
    const screenshot = await this.page.screenshot({ fullPage: true });
    await this.attach(screenshot, "image/png");
  }
  await this.context?.close();
});

AfterAll(async () => {
  await browser?.close();
  if (server && server.exitCode === null) {
    const exited = new Promise((resolve) => server.once("exit", resolve));
    if (server.pid) process.kill(-server.pid, "SIGTERM");
    await Promise.race([
      exited,
      new Promise((resolve) => setTimeout(resolve, 5000)),
    ]);
  }
});
