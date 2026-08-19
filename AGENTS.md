# AGENTS.md

## Contexto

Proyecto Astro 4 + React 18 + Tailwind 3 para un ecommerce de repuestos. El codigo mezcla frontend publico, panel admin y endpoints API dentro de `src/pages/api`.

## Regla principal

Se brutalmente honesto. Si algo esta roto, inconsistente o viejo, dilo sin adornos y arreglalo si entra en el alcance.

## Stack real

- Node `20.x` (`package.json` lo exige).
- Astro con integracion React y deploy pensado para Vercel.
- Estado cliente con Zustand.
- Formularios con React Hook Form + Zod.
- Base de datos con Neon/Postgres a traves de `@neondatabase/serverless`.

## Comandos utiles

- `npm run dev`: desarrollo local.
- `npm run build`: build de produccion.
- `npm run preview`: revisar build localmente.

No hay scripts de lint, test ni format. No inventarlos en la documentacion ni asumir que existen.

## Estructura que importa

- `src/pages/index.astro`: home publica.
- `src/pages/admin.astro`: entrada del panel admin.
- `src/pages/api/*.ts`: endpoints del backend.
- `src/components/`: UI React.
- `src/stores/`: estado cliente con Zustand.
- `src/lib/database.ts`: acceso a Postgres y logica principal de productos/categorias.
- `src/lib/whatsapp.ts`: armado del mensaje y apertura de WhatsApp.
- `public/uploads/`: imagenes subidas.
- `scripts/*.js`: utilidades manuales para base de datos y diagnostico.

## Realidad del repo

- El `README.md` no es una fuente confiable. Tiene texto roto por encoding y partes viejas.
- La app ya no parece una demo en memoria: usa `DATABASE_URL` y Neon en `src/lib/database.ts`.
- La capa de datos tiene deuda tecnica evidente:
  - crea tablas con defaults genericos que no coinciden con el dominio de repuestos;
  - tolera a medias la columna `featured` con `try/catch` en lecturas;
  - tiene logs de debug en produccion;
  - mezcla responsabilidades de acceso a datos y compatibilidad de esquema.
- No hay suite de tests que sirva como red de seguridad.

## Variables de entorno

- `DATABASE_URL`: obligatoria para casi todo lo que toque productos/categorias.
- `PUBLIC_WPP_NUMBER`: usada en frontend para WhatsApp.

Si falta alguna, no supongas valores magicos. Mencionalo explicitamente.

## Convenciones para tocar codigo

- Manten los cambios chicos y concretos. Este repo no tiene buenas defensas automaticas.
- Preserva el estilo existente salvo que estes corrigiendo una inconsistencia clara.
- Si cambias esquema o queries, revisa tambien:
  - `src/pages/api/products.ts`
  - `src/pages/api/categories.ts`
  - `scripts/` relacionados
- Si tocas WhatsApp o variables publicas, valida que siga funcionando en cliente y no muevas secretos al frontend.
- Si agregas campos a `Product` o `Category`, sincroniza tipos, store y endpoints.

## Verificacion minima esperada

Cuando hagas cambios, intenta al menos:

- `npm run build` para detectar roturas de Astro/TypeScript.
- prueba manual del flujo afectado si el cambio es UI o endpoint.

Si no puedes verificar algo, dilo explicitamente.

## Que no hacer

- No digas que hay tests, lint o CI si no los viste.
- No confies ciegamente en el README.
- No metas refactors grandes "de paso" sin que el usuario lo pida.
- No borres logs o scripts de soporte sin revisar para que se estan usando.
