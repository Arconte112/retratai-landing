'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Model {
  id: string;
  name: string;
  status: string;
  created_at: string;
  // Agrega más campos según necesites
}

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        // Aquí irá la lógica para obtener los modelos del usuario desde Supabase
        // Por ahora usamos datos de ejemplo
        setModels([
          {
            id: '1',
            name: 'Modelo de Ejemplo 1',
            status: 'Completado',
            created_at: new Date().toISOString(),
          },
        ]);
      } catch (error) {
        console.error('Error al cargar los modelos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mis Modelos</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gestiona y visualiza todos tus modelos entrenados.
        </p>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Cargando modelos...</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {models.map((model) => (
              <li key={model.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center">
                          <svg
                            className="h-6 w-6 text-sky-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h2 className="text-sm font-medium text-gray-900">{model.name}</h2>
                        <div className="mt-1 flex items-center">
                          <span className="text-xs text-gray-500">
                            Creado el {new Date(model.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex items-center">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        {model.status}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 