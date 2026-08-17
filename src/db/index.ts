import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// En Vercel usamos Turso (SQLite remoto); en desarrollo local mantenemos el
// archivo SQLite para no cambiar el flujo de trabajo existente.
const url = process.env.TURSO_DATABASE_URL || "file:gestoria.db";
const authToken = process.env.TURSO_AUTH_TOKEN;
const client = createClient({
  url,
  ...(authToken ? { authToken } : {}),
});

export const db = drizzle(client, { schema });
export { client };
export * from "./schema";
