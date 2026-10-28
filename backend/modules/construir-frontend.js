import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Red de seguridad para el hosting: si el servicio se creó a mano con backend/ como
// raíz y "npm install" como build, igual se compila el frontend al instalar.
// Corre solo en Render o con NODE_ENV=production; en las PC del equipo no hace nada.
const enHosting =
  process.env.RENDER === "true" || process.env.NODE_ENV === "production";
const frontend = fileURLToPath(new URL("../../frontend", import.meta.url));

// El build de la raíz compila el frontend antes de instalar backend: ahí ya existe.
if (
  enHosting &&
  existsSync(`${frontend}/package.json`) &&
  !existsSync(`${frontend}/dist/index.html`)
) {
  console.log("Hosting: compilando el frontend (frontend/dist)...");
  execSync("npm ci --include=dev && npm run build", {
    cwd: frontend,
    stdio: "inherit",
  });
}
