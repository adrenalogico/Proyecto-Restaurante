import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// En Render, aunque el servicio se haya creado a mano con "npm start" desde backend/:
// compila el frontend si falta y prepara la base (instala o migra, admin y datos de
// ejemplo) antes de servir. Ambos pasos son repetibles; en las PC del equipo no corren.
if (process.env.RENDER === "true") {
  // Los mismos valores fijos del render.yaml, por si el servicio no se creó con él.
  const entorno = process.env;
  entorno.NODE_ENV ||= "production";
  entorno.TZ ||= "America/Argentina/Buenos_Aires";
  entorno.DB_DATABASE ||= "nacar";
  entorno.NACAR_DATOS_DEMO ||= "1";
  if (/\.aivencloud\.com$/i.test(entorno.DB_HOST || "")) entorno.DB_SSL ||= "1";
  for (const paso of [
    ["./modules/construir-frontend.js"],
    ["./modules/preparar-equipo.js", "--online"],
  ]) {
    const [archivo, ...argumentos] = paso;
    execFileSync(
      process.execPath,
      [fileURLToPath(new URL(archivo, import.meta.url)), ...argumentos],
      { stdio: "inherit" },
    );
  }
}

const { app } = await import("./app.js");
const port = Number(process.env.PORT || 3005);
app.listen(port, () =>
  console.log(`Servidor escuchando en http://localhost:${port}`),
);
