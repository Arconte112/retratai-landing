import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createModel, startTraining } from '@/lib/replicate';

// Schema de validación para el body de la petición
const TrainingRequestSchema = z.object({
  modelName: z.string(),
  triggerWord: z.string(),
  zipUrl: z.string().url(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validar el body de la petición
    const { modelName, triggerWord, zipUrl } = TrainingRequestSchema.parse(body);

    // 1. Crear el modelo en Replicate
    const model = await createModel({ modelName });

    // 2. Iniciar el entrenamiento
    const training = await startTraining({
      modelName,
      triggerWord,
      zipUrl,
    });

    return NextResponse.json({
      success: true,
      model,
      training,
    });
  } catch (error) {
    console.error('Error in training endpoint:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to start training' },
      { status: 500 }
    );
  }
} 