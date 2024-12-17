"use client";

import React, { useState, useEffect } from 'react';
import * as Select from '@radix-ui/react-select';
import * as Label from '@radix-ui/react-label';
import { ChevronDown, X } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import StyleSelector from './components/StyleSelector';
import TrainingProgress from './components/TrainingProgress';

interface ImagePreview extends File {
  preview?: string;
}

export default function TrainPage() {
  const [modelName, setModelName] = useState('');
  const [gender, setGender] = useState('');
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [showStyleSelector, setShowStyleSelector] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length < 10 || files.length > 15) {
      toast.error('Por favor selecciona entre 10 y 15 imágenes');
      return;
    }
    
    const validFiles = files.filter(file => {
      const type = file.type.toLowerCase();
      return type === 'image/png' || type === 'image/jpeg' || type === 'image/jpg';
    });

    if (validFiles.length !== files.length) {
      toast.error('Solo se permiten archivos PNG, JPG y JPEG');
      return;
    }

    // Crear previews para las imágenes
    const filesWithPreviews = validFiles.map(file => {
      const preview = URL.createObjectURL(file);
      return Object.assign(file, { preview });
    });

    setImages(filesWithPreviews);
    toast.success(`${validFiles.length} imágenes seleccionadas correctamente`);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    // Liberar la URL del preview para evitar memory leaks
    if (newImages[index].preview) {
      URL.revokeObjectURL(newImages[index].preview!);
    }
    newImages.splice(index, 1);
    setImages(newImages);

    if (newImages.length < 10) {
      toast.error('Recuerda que necesitas al menos 10 imágenes');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos los campos
    if (!modelName.trim()) {
      toast.error('El nombre del modelo es obligatorio');
      return;
    }

    if (!gender) {
      toast.error('Debes seleccionar un género');
      return;
    }

    if (images.length === 0) {
      toast.error('Debes seleccionar imágenes para el entrenamiento');
      return;
    }

    if (images.length < 10 || images.length > 15) {
      toast.error('Debes seleccionar entre 10 y 15 imágenes');
      return;
    }

    // Si todo está correcto, mostrar el selector de estilo
    setShowStyleSelector(true);
  };

  const handleStyleSelect = async (style: string, images: File[], modelName: string) => {
    setSelectedStyle(style);
    setSelectedImages(images);
    // Mostrar una animación de transición suave
    document.body.style.opacity = '0';
    setTimeout(() => {
      setIsTraining(true);
      document.body.style.opacity = '1';
    }, 300);
  };

  // Efecto para la animación inicial
  useEffect(() => {
    document.body.style.transition = 'opacity 300ms ease-in-out';
    return () => {
      document.body.style.transition = '';
    };
  }, []);

  // Cleanup de URLs al desmontar el componente
  useEffect(() => {
    return () => {
      images.forEach(image => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [images]);

  if (isTraining && selectedStyle) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 animate-fade-in">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrainingProgress
            style={selectedStyle}
            images={selectedImages}
            modelName={modelName}
            gender={gender}
          />
        </div>
      </div>
    );
  }

  if (showStyleSelector) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setShowStyleSelector(false)}
            className="mb-6 text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver
          </button>
          <StyleSelector 
            onStyleSelect={handleStyleSelect}
            modelName={modelName}
            images={images}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" richColors />
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Encabezado */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Entrenar Modelos</h1>
            <p className="mt-2 text-lg text-gray-600">
              Aquí podrás entrenar nuevos modelos de IA con tus datos.
            </p>
          </div>

          {/* Formulario */}
          <div className="bg-white shadow-lg rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Nombre del modelo */}
              <div className="space-y-2">
                <Label.Root className="text-sm font-medium text-gray-900" htmlFor="modelName">
                  Nombre del modelo *
                </Label.Root>
                <input
                  type="text"
                  id="modelName"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ingresa un nombre para tu modelo"
                  required
                />
              </div>

              {/* Selector de género */}
              <div className="space-y-2">
                <Label.Root className="text-sm font-medium text-gray-900">
                  Género *
                </Label.Root>
                <Select.Root value={gender} onValueChange={setGender} required>
                  <Select.Trigger
                    className="inline-flex items-center justify-between w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Género"
                  >
                    <Select.Value placeholder="Selecciona un género" />
                    <Select.Icon>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="overflow-hidden bg-white rounded-lg shadow-lg border border-gray-200">
                      <Select.Viewport className="p-1">
                        <Select.Item value="hombre" className="relative flex items-center px-8 py-2 text-gray-900 rounded-md hover:bg-blue-50 focus:bg-blue-50 outline-none select-none">
                          <Select.ItemText>Hombre</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="mujer" className="relative flex items-center px-8 py-2 text-gray-900 rounded-md hover:bg-blue-50 focus:bg-blue-50 outline-none select-none">
                          <Select.ItemText>Mujer</Select.ItemText>
                        </Select.Item>
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>

              {/* Uploader de imágenes */}
              <div className="space-y-2">
                <Label.Root className="text-sm font-medium text-gray-900">
                  Imágenes de entrenamiento *
                </Label.Root>
                <div className="mt-1">
                  <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Sube tus imágenes</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            multiple
                            accept=".png,.jpg,.jpeg"
                            onChange={handleImageUpload}
                            required
                          />
                        </label>
                        <p className="pl-1">o arrastra y suelta</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, JPEG (10-15 imágenes) *</p>
                    </div>
                  </div>

                  {/* Grid de imágenes */}
                  {images.length > 0 && (
                    <div className="mt-6">
                      <div className="text-sm text-gray-600 mb-4">
                        ✓ {images.length} imágenes seleccionadas
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {images.map((file, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                              <img
                                src={file.preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="Eliminar imagen"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Botón de Elegir estilo */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Elegir estilo
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 