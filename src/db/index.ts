import { existsSync, renameSync } from "node:fs";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

export const DB_FILE = "repuestos-mendez.db";

// La base se llamaba gestoria.db. Si en el servidor todavía está con el nombre
// viejo, se renombra una sola vez al arrancar para no perder los datos.
if (!existsSync(DB_FILE) && existsSync("gestoria.db")) renameSync("gestoria.db", DB_FILE);

const client = createClient({ url: `file:${DB_FILE}` });

export const db = drizzle(client, { schema });
export { client };
export * from "./schema";
