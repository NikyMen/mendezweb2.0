import type { APIRoute } from 'astro';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { db } from '../../lib/database';

function getContentTypeFromFilename(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'png') return 'image/png';
  if (ext === 'gif') return 'image/gif';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'svg') return 'image/svg+xml';
  return 'application/octet-stream';
}

async function readImageFromCandidates(filename: string): Promise<Buffer | null> {
  const candidates = [
    join('/tmp', 'uploads', filename),
    join(process.cwd(), 'public', 'uploads', filename),
  ];
  for (const path of candidates) {
    try {
      const data = await readFile(path);
      if (data) return data;
    } catch (_) {
      // try next candidate
    }
  }
  return null;
}

function isDataUrl(value?: string | null): boolean {
  return !!value && value.startsWith('data:');
}

function extractFilename(url: string): string | null {
  try {
    const parts = url.split('/');
    return parts[parts.length - 1] || null;
  } catch {
    return null;
  }
}

export const POST: APIRoute = async () => {
  try {
    const products = await db.products.getAll();

    let migratedCount = 0;
    const migratedIds: string[] = [];

    for (const product of products) {
      let updatedImage = product.image;
      let updatedImages = product.images || [];
      let changed = false;

      // Principal image
      if (product.image && !isDataUrl(product.image)) {
        const fname = extractFilename(product.image);
        if (fname) {
          const buffer = await readImageFromCandidates(fname);
          if (buffer) {
            const contentType = getContentTypeFromFilename(fname);
            const base64 = buffer.toString('base64');
            updatedImage = `data:${contentType};base64,${base64}`;
            changed = true;
          }
        }
      }

      // Additional images
      if (Array.isArray(product.images)) {
        const newImages: string[] = [];
        for (const img of product.images) {
          if (img && !isDataUrl(img)) {
            const fname = extractFilename(img);
            if (fname) {
              const buffer = await readImageFromCandidates(fname);
              if (buffer) {
                const contentType = getContentTypeFromFilename(fname);
                const base64 = buffer.toString('base64');
                newImages.push(`data:${contentType};base64,${base64}`);
                changed = true;
              } else {
                newImages.push(img); // keep original if not found
              }
            } else {
              newImages.push(img);
            }
          } else {
            newImages.push(img);
          }
        }
        updatedImages = newImages;
      }

      if (changed) {
        await db.products.update(product.id, {
          image: updatedImage,
          images: updatedImages,
        });
        migratedCount += 1;
        migratedIds.push(product.id);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      migratedCount,
      migratedIds,
      message: migratedCount > 0 ? `Migradas ${migratedCount} imágenes de productos a base64 en DB` : 'No había imágenes por migrar',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error en migración:', error);
    return new Response(JSON.stringify({ success: false, error: 'Error en migración' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};