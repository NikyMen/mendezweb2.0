import type { APIRoute } from 'astro';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
// Eliminamos dependencias nativas para evitar errores en Vercel

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    
    // Intentar obtener archivos de diferentes campos
    let files: File[] = [];
    
    // Para archivo individual (campo 'file')
    const singleFile = formData.get('file') as File;
    if (singleFile && singleFile.size > 0) {
      files = [singleFile];
    } else {
      // Para múltiples archivos (campo 'images')
      const multipleFiles = formData.getAll('images') as File[];
      files = multipleFiles.filter(file => file && file.size > 0);
    }
    
    if (!files || files.length === 0) {
      return new Response(JSON.stringify({ error: 'No se proporcionaron archivos' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    if (files.length > 4) {
      return new Response(JSON.stringify({ error: 'Máximo 4 imágenes permitidas' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // No guardar en disco. Devolver data URLs en base64 para almacenar en DB
    const uploadedFiles: string[] = [];

    for (const file of files) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        return new Response(JSON.stringify({ error: 'Solo se permiten archivos de imagen' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      // Validar tamaño (máximo 50MB)
      if (file.size > 50 * 1024 * 1024) {
        return new Response(JSON.stringify({ error: 'El archivo es demasiado grande. Máximo 50MB' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      // Exigir WebP para mantener consistencia con el cliente
      if (file.type.toLowerCase() !== 'image/webp') {
        return new Response(JSON.stringify({ error: 'La imagen debe estar en formato WebP' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      // Convertir a base64 y devolver como data URL
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      const dataUrl = `data:image/webp;base64,${base64}`;
      uploadedFiles.push(dataUrl);
    }

    // Para compatibilidad con código que espera un solo archivo
    const response = files.length === 1 ? {
      success: true,
      url: uploadedFiles[0], // Para archivo individual
      files: uploadedFiles,
      message: `${uploadedFiles.length} imagen(es) subida(s) correctamente`
    } : {
      success: true,
      files: uploadedFiles,
      message: `${uploadedFiles.length} imagen(es) subida(s) correctamente`
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error al subir archivos:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
