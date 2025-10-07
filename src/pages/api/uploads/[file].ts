import type { APIRoute } from 'astro';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const GET: APIRoute = async ({ params }) => {
  try {
    const filename = params.file;
    if (!filename) {
      return new Response(JSON.stringify({ error: 'Nombre de archivo requerido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const filePath = join('/tmp', 'uploads', filename);
    const data = await readFile(filePath);

    const ext = filename.split('.').pop()?.toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg';
    else if (ext === 'png') contentType = 'image/png';
    else if (ext === 'webp') contentType = 'image/webp';
    else if (ext === 'gif') contentType = 'image/gif';

    return new Response(data, {
      status: 200,
      headers: { 'Content-Type': contentType },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Archivo no encontrado' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};