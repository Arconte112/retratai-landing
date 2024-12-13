import React from 'react';

export default function TrainingProgress() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Spinner animado */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>

        {/* Título y descripción */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Entrenando tu modelo
          </h2>
          <p className="text-gray-600">
            Este proceso puede tomar varios minutos. Estamos procesando tus imágenes
            y creando un modelo único para ti.
          </p>
        </div>

        {/* Barra de progreso */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-8">
          <div className="bg-blue-600 h-2.5 rounded-full w-[45%] transition-all duration-1000"></div>
        </div>

        {/* Etapas del proceso */}
        <div className="mt-8 space-y-2 text-left">
          <div className="flex items-center text-green-600">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Imágenes procesadas</span>
          </div>
          <div className="flex items-center text-blue-600">
            <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Entrenando modelo</span>
          </div>
          <div className="flex items-center text-gray-400">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Finalizando</span>
          </div>
        </div>

        {/* Mensaje de tiempo estimado */}
        <p className="text-sm text-gray-500 mt-6">
          Tiempo estimado restante: ~3 minutos
        </p>
      </div>
    </div>
  );
} 