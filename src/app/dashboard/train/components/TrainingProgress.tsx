import React, { useEffect, useState, useRef } from 'react';
import JSZip from 'jszip';
import { v4 as uuidv4 } from 'uuid';
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
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<'processing' | 'training' | 'finishing'>('processing');
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const processingRef = useRef(false);
  const modelCreatedRef = useRef(false);

  useEffect(() => {
    const controller = new AbortController();

    const startProcess = async () => {
      if (processingRef.current || modelCreatedRef.current) return;
      processingRef.current = true;
      
      try {
        await processImagesAndStart();
        modelCreatedRef.current = true;
      } catch (error) {
        console.error('Error in startProcess:', error);
        setIsError(true);
        setErrorMessage(error instanceof Error ? error.message : 'Error desconocido en el procesamiento');
        toast.error('El entrenamiento ha fallado. Por favor, intenta de nuevo.');
      } finally {
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
      console.log('🚀 Starting processImagesAndStart');
      // 1. Crear y procesar el ZIP
      console.log('📦 Creating new ZIP object');
      const zip = new JSZip();
      const totalSteps = images.length * 2;
      let currentStep = 0;

      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const extension = image.name.split('.').pop();
        const baseName = `image_${i + 1}`;
        
        console.log(`📸 Adding image ${i + 1} of ${images.length} to ZIP`);
        zip.file(`${baseName}.${extension}`, image);
        currentStep++;
        setProgress((currentStep / totalSteps) * 30);

        try {
          console.log(`🤖 Generating caption for image ${i + 1}`);
          const caption = await generateImageCaption(image, modelName, gender);
          console.log(`📝 Adding caption for image ${i + 1} to ZIP`);
          zip.file(`${baseName}.txt`, caption);
          currentStep++;
          setProgress((currentStep / totalSteps) * 30);
        } catch (error) {
          console.error(`Error generating caption for image ${i + 1}:`, error);
          throw new Error(`Error al generar la descripción para la imagen ${i + 1}`);
        }
      }

      // 2. Generar y subir el ZIP
      console.log('🔄 Generating ZIP blob');
      const zipContent = await zip.generateAsync({ type: 'blob' });
      const uniqueId = uuidv4();
      const fileName = `${modelName.toLowerCase().replace(/\s+/g, '_')}_${uniqueId}.zip`;
      console.log(`⬆️ Uploading ZIP file: ${fileName}`);
      const uploadedFile = await uploadZipToStorage(zipContent, fileName);

      if (!uploadedFile) {
        throw new Error('Error al subir el archivo ZIP');
      }
      console.log('✅ ZIP file uploaded successfully');

      setProgress(40);
      setCurrentStep('training');

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

      setProgress(90);
      setCurrentStep('finishing');

      // 5. Finalizar y redirigir
      setTimeout(() => {
        setProgress(100);
        router.push('/dashboard/models');
      }, 2000);

    } catch (error) {
      console.error('Error en el procesamiento:', error);
      setIsError(true);
      setErrorMessage(error instanceof Error ? error.message : 'Error desconocido en el procesamiento');
      toast.error('El entrenamiento ha fallado. Por favor, intenta de nuevo.');
    }
  };

  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-center space-y-6">
          <div className="text-red-500 text-xl">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            El entrenamiento ha fallado
          </div>
          <p className="text-gray-600">
            {errorMessage}
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

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
            {currentStep === 'processing' && 'Procesando imágenes'}
            {currentStep === 'training' && 'Entrenando tu modelo'}
            {currentStep === 'finishing' && 'Finalizando'}
          </h2>
          <p className="text-gray-600">
            {currentStep === 'processing' && 'Preparando tus imágenes para el entrenamiento...'}
            {currentStep === 'training' && 'Creando un modelo único para ti...'}
            {currentStep === 'finishing' && '¡Casi listo! Aplicando los últimos ajustes...'}
          </p>
        </div>

        {/* Barra de progreso */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-8">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Etapas del proceso */}
        <div className="mt-8 space-y-2 text-left">
          <div className="flex items-center text-green-600">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Imágenes procesadas</span>
          </div>
          <div className={`flex items-center ${currentStep === 'training' ? 'text-blue-600' : currentStep === 'finishing' ? 'text-green-600' : 'text-gray-400'}`}>
            {currentStep === 'training' ? (
              <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : currentStep === 'finishing' ? (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span>Entrenando modelo</span>
          </div>
          <div className={`flex items-center ${currentStep === 'finishing' ? 'text-blue-600' : 'text-gray-400'}`}>
            {currentStep === 'finishing' ? (
              <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span>Finalizando</span>
          </div>
        </div>

        {/* Mensaje de tiempo estimado */}
        <p className="text-sm text-gray-500 mt-6">
          Tiempo estimado restante: ~{currentStep === 'processing' ? '2' : currentStep === 'training' ? '3' : '1'} minutos
        </p>
      </div>
    </div>
  );
} 