import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Upload, X, Star } from 'lucide-react';
import type { Product } from '../../types';

const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  category: z.string().min(1, 'La categoría es requerida'),
  price: z.number().min(0, 'El precio debe ser mayor a 0'),
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  categories: string[];
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
  categories
}) => {
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(product?.image || '');
  const [additionalImages, setAdditionalImages] = useState<string[]>(product?.images || []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const additionalFileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      category: product?.category || '',
      price: product?.price || 0,
      image: product?.image || '',
      images: product?.images || [],
      featured: product?.featured || false,
    }
  });

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error uploading image');
    }

    const data = await response.json();
    return data.url;
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validaciones del lado del cliente
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Convertir a WebP antes de subir (obligatorio)
    const convertToWebP = async (inputFile: File, quality = 0.8): Promise<File> => {
      return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(inputFile);
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              URL.revokeObjectURL(url);
              return reject(new Error('No se pudo inicializar el contexto del canvas'));
            }
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
              URL.revokeObjectURL(url);
              if (!blob) {
                return reject(new Error('No se pudo convertir la imagen a WebP'));
              }
              // Asegurar nombre de archivo válido
              const originalBaseName = inputFile.name.replace(/\.[^/.]+$/, '');
              const safeBaseName = originalBaseName.replace(/[^a-zA-Z0-9_.-]/g, '_') || 'image';
              const webpFile = new File([blob], `${safeBaseName}.webp`, { type: 'image/webp' });
              if (webpFile.size > 50 * 1024 * 1024) {
                return reject(new Error('La imagen convertida supera 50MB'));
              }
              resolve(webpFile);
            }, 'image/webp', quality);
          } catch (e) {
            URL.revokeObjectURL(url);
            reject(e);
          }
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('No se pudo cargar la imagen para convertir'));
        };
        img.src = url;
      });
    };

    setUploading(true);
    try {
      const webpFile = await convertToWebP(file, 0.8);
      const imageUrl = await uploadImage(webpFile);
      setImagePreview(imageUrl);
      setValue('image', imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(`Error al subir la imagen: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setUploading(false);
      // Limpiar el input para permitir subir el mismo archivo nuevamente si es necesario
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleAdditionalImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validaciones del lado del cliente
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Convertir a WebP antes de subir (obligatorio)
    const convertToWebP = async (inputFile: File, quality = 0.8): Promise<File> => {
      return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(inputFile);
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              URL.revokeObjectURL(url);
              return reject(new Error('No se pudo inicializar el contexto del canvas'));
            }
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
              URL.revokeObjectURL(url);
              if (!blob) {
                return reject(new Error('No se pudo convertir la imagen a WebP'));
              }
              // Asegurar nombre de archivo válido
              const originalBaseName = inputFile.name.replace(/\.[^/.]+$/, '');
              const safeBaseName = originalBaseName.replace(/[^a-zA-Z0-9_.-]/g, '_') || 'image';
              const webpFile = new File([blob], `${safeBaseName}.webp`, { type: 'image/webp' });
              if (webpFile.size > 50 * 1024 * 1024) {
                return reject(new Error('La imagen convertida supera 50MB'));
              }
              resolve(webpFile);
            }, 'image/webp', quality);
          } catch (e) {
            URL.revokeObjectURL(url);
            reject(e);
          }
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('No se pudo cargar la imagen para convertir'));
        };
        img.src = url;
      });
    };

    if (additionalImages.length >= 4) {
      alert('Máximo 4 imágenes adicionales permitidas');
      return;
    }

    setUploading(true);
    try {
      const webpFile = await convertToWebP(file, 0.8);
      const imageUrl = await uploadImage(webpFile);
      const newImages = [...additionalImages, imageUrl];
      setAdditionalImages(newImages);
      setValue('images', newImages);
    } catch (error) {
      console.error('Error uploading additional image:', error);
      alert(`Error al subir la imagen adicional: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setUploading(false);
      // Limpiar el input para permitir subir el mismo archivo nuevamente si es necesario
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const removeAdditionalImage = (index: number) => {
    const newImages = additionalImages.filter((_, i) => i !== index);
    setAdditionalImages(newImages);
    setValue('images', newImages);
  };

  const onSubmitForm = (data: ProductFormData) => {
    const formDataToSend = {
      ...data,
      image: imagePreview,
      images: additionalImages,
      featured: data.featured || false, // Asegurar que featured siempre se incluya
    };
    
    console.log('Datos del formulario a enviar:', formDataToSend);
    onSubmit(formDataToSend);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {product ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Producto
              </label>
              <input
                type="text"
                {...register('name')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Ingresa el nombre del producto"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Describe el producto"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                {...register('category')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            {/* Precio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio ($)
              </label>
              <input
                type="number"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="0.00"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            {/* Producto Destacado */}
            <div className="flex items-center space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <input
                type="checkbox"
                {...register('featured')}
                className="w-5 h-5 text-yellow-600 bg-white border-yellow-300 rounded focus:ring-yellow-500 focus:ring-2"
              />
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <div>
                  <span className="text-sm font-medium text-gray-900">Producto Destacado</span>
                  <p className="text-xs text-gray-600">
                    Los productos destacados aparecerán en el carrusel de la página principal
                  </p>
                </div>
              </div>
            </div>

            {/* Imagen Principal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen Principal
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  <Upload size={16} />
                  <span>{uploading ? 'Subiendo...' : 'Subir Imagen'}</span>
                </button>
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setValue('image', '');
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Imágenes Adicionales */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imágenes Adicionales (máximo 4)
              </label>
              <div className="space-y-2">
                {additionalImages.length < 4 && (
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      ref={additionalFileInputRef}
                      onChange={handleAdditionalImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => additionalFileInputRef.current?.click()}
                      disabled={uploading}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                      <Plus size={16} />
                      <span>{uploading ? 'Subiendo...' : 'Agregar Imagen'}</span>
                    </button>
                  </div>
                )}
                {additionalImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {additionalImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Additional ${index + 1}`}
                          className="w-full h-16 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeAdditionalImage(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                {product ? 'Actualizar' : 'Crear'} Producto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};