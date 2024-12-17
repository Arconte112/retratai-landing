import React, { useState } from 'react';
import Image from 'next/image';

interface StyleSelectorProps {
  onStyleSelect: (style: string, images: File[], modelName: string) => void;
  modelName: string;
  images: File[];
}

export default function StyleSelector({ onStyleSelect, modelName, images }: StyleSelectorProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  const handleStyleClick = (style: string) => {
    setSelectedStyle(style);
    setShowConfirmDialog(true);
  };

  const handleConfirm = async () => {
    if (!selectedStyle) return;
    setShowConfirmDialog(false);
    onStyleSelect(selectedStyle, images, modelName);
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Selecciona un estilo</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Tarjeta de Foto Profesional */}
        <div 
          onClick={() => handleStyleClick('professional')}
          className="relative group cursor-pointer rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02]"
        >
          <div className="aspect-[4/5] relative">
            <Image
              src="/styles/professional.jpeg"
              alt="Estilo Profesional"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-xl font-semibold text-white">Foto Profesional</h3>
              <p className="text-sm text-gray-200 mt-1">
                Fotos de perfil con aspecto profesional y corporativo
              </p>
            </div>
          </div>
        </div>

        {/* Tarjeta de Próximamente */}
        <div className="relative rounded-xl overflow-hidden shadow-lg bg-gray-100">
          <div className="aspect-[4/5] relative flex items-center justify-center">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-200/60 to-transparent">
                <h3 className="text-xl font-semibold text-gray-700">Nuevo Estilo</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Próximamente nuevos estilos disponibles
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diálogo de confirmación */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 transform transition-all scale-100 animate-fade-in">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ¿Comenzar entrenamiento?
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Al confirmar, se descontará 1 crédito de tu cuenta y comenzará el proceso de entrenamiento.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirm}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                >
                  Confirmar y comenzar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 