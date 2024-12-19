import React, { useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import JSZip from 'jszip';
import { uploadZipToStorage } from '@/lib/supabase';
import { generateImageCaption, getGlobalTriggerword } from '@/lib/gemini';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface TrainingProgressProps {
  style: string;
  images: File[];
  modelName: string;
  gender: string;
}

export default function TrainingProgress({ style, images, modelName, gender }: TrainingProgressProps) {
  const router = useRouter();
  const [isError, setIsError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [trainingStarted, setTrainingStarted] = React.useState(false);
  const processingRef = useRef(false);
  const modelCreatedRef = useRef(false);

  useEffect(() => {
    const controller = new AbortController();

    const startProcess = async () => {
      if (processingRef.current || modelCreatedRef.current) return;
      processingRef.current = true;
      setIsLoading(true);
      
      try {
        await processImagesAndStart();
        modelCreatedRef.current = true;
        setTrainingStarted(true);
      } catch (error) {
        console.error('Error in startProcess:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
        if (!controller.signal.aborted) {
          processingRef.current = false;
        }
      }
    };

    startProcess();

    return () => {
      controller.abort();
    };
  }, [images, modelName, style, gender]);

  const processImagesAndStart = async () => {
    try {
      // 1. Crear y procesar el ZIP
      const zip = new JSZip();

      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const extension = image.name.split('.').pop();
        const baseName = `image_${i + 1}`;
        
        zip.file(`${baseName}.${extension}`, image);

        try {
          const caption = await generateImageCaption(image, modelName, gender);
          zip.file(`${baseName}.txt`, caption);
        } catch (error) {
          console.error(`Error generating caption for image ${i + 1}:`, error);
          throw new Error(`Error al generar la descripción para la imagen ${i + 1}`);
        }
      }

      // 2. Generar y subir el ZIP
      const zipContent = await zip.generateAsync({ type: 'blob' });
      const uniqueId = uuidv4();
      const fileName = `${modelName.toLowerCase().replace(/\s+/g, '_')}_${uniqueId}.zip`;
      const uploadedFile = await uploadZipToStorage(zipContent, fileName);

      if (!uploadedFile) {
        throw new Error('Error al subir el archivo ZIP');
      }

      // 3. Obtener la URL pública del ZIP
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const zipUrl = `${supabaseUrl}/storage/v1/object/public/zip/${fileName}`;

      // 4. Iniciar el entrenamiento
      const response = await fetch('/api/training', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modelName,
          triggerWord: getGlobalTriggerword(modelName),
          zipUrl,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Error al iniciar el entrenamiento');
      }

    } catch (error) {
      console.error('Error en el procesamiento:', error);
      setIsError(true);
      toast.error('El servicio no está disponible. Por favor, intenta de nuevo en 10 minutos.');
      throw error;
    }
  };

  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-center space-y-6 bg-white p-8 rounded-2xl shadow-lg max-w-md mx-auto">
          <div className="text-red-500 text-xl relative">
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-red-100 rounded-full p-4">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="mt-8 font-bold text-2xl text-gray-800">El servicio no está disponible</h2>
          </div>
          <p className="text-gray-600 text-lg">
            Por favor, intenta de nuevo en 10 minutos
          </p>
          <button
            onClick={() => router.push('/dashboard/train')}
            className="w-full mt-6 px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            Volver al Inicio del Entrenamiento
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-center space-y-6 bg-white p-8 rounded-2xl shadow-lg max-w-md mx-auto">
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-100 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Iniciando el entrenamiento
          </h2>
          <div className="space-y-2">
            <p className="text-gray-600 text-lg">
              Estamos preparando todo para comenzar...
            </p>
            <p className="text-blue-600 text-sm font-medium">
              Esto puede tomar unos momentos
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (trainingStarted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-center space-y-6 bg-white p-8 rounded-2xl shadow-lg max-w-md mx-auto relative">
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-green-100 rounded-full p-4">
            <svg className="w-16 h-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ¡Entrenamiento Iniciado!
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600 text-lg">
                Tu modelo <span className="font-semibold text-blue-600">{modelName}</span> ha comenzado su entrenamiento.
              </p>
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-gray-700">
                  Te enviaremos un correo con los resultados en aproximadamente <span className="font-semibold">30-40 minutos</span>.
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 mt-8">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out transform hover:scale-105"
            >
              Ir al Inicio
            </button>
            <button
              onClick={() => router.push('/dashboard/models')}
              className="flex-1 px-6 py-3 text-base font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out transform hover:scale-105"
            >
              Ver Modelos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
} 