import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createModel, startTraining } from '@/lib/replicate';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic';

// Schema de validación para el body de la petición
const TrainingRequestSchema = z.object({
  modelName: z.string(),
  triggerWord: z.string(),
  zipUrl: z.string().url(),
  webhook: z.string().url(),
  webhook_events_filter: z.array(z.string())
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validar el body de la petición
    const { modelName, triggerWord, zipUrl, webhook, webhook_events_filter } = TrainingRequestSchema.parse(body);

    // Obtener el usuario actual
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Usuario no autenticado' }), 
        { status: 401 }
      );
    }

    // 1. Crear el modelo en Replicate
    const model = await createModel({ modelName });

    // 2. Iniciar el entrenamiento
    const training = await startTraining({
      modelName,
      triggerWord,
      zipUrl,
      webhook,
      webhook_events_filter
    });

    // 3. Crear el registro en Supabase
    const { error: insertError } = await supabase
      .from('models')
      .insert({
        name: modelName,
        user_id: user.id,
        training_id: training.id,
        status: 'training',
        trigger_word: triggerWord,
        replicate_model_id: model.id,
        style: 'default', // TODO: Agregar estilo cuando se implemente
        error_message: null
      });

    if (insertError) {
      console.error('Error al crear el registro en Supabase:', insertError);
      return new Response(
        JSON.stringify({ success: false, error: 'Error al crear el registro del modelo' }), 
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        model,
        training,
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error in training endpoint:', error);
    
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid request data', details: error.errors }), 
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Failed to start training' }), 
      { status: 500 }
    );
  }
} 