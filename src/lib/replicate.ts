import { z } from 'zod';
import Replicate from "replicate";
import { withRetries, handleReplicateError } from './api-utils';

if (!process.env.REPLICATE_API_TOKEN) {
  throw new Error('REPLICATE_API_TOKEN is not defined in environment variables');
}

if (!process.env.NEXT_PUBLIC_REPLICATE_USERNAME) {
  throw new Error('NEXT_PUBLIC_REPLICATE_USERNAME is not defined in environment variables');
}

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const REPLICATE_USERNAME = process.env.NEXT_PUBLIC_REPLICATE_USERNAME;
const REPLICATE_API_URL = 'https://api.replicate.com/v1';

const replicate = new Replicate({
  auth: REPLICATE_API_TOKEN,
});

// Schema para validar la respuesta de creación del modelo
const ModelResponseSchema = z.object({
  id: z.string(),
  url: z.string(),
  owner: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  visibility: z.enum(['public', 'private']),
  github_url: z.string().nullable(),
  paper_url: z.string().nullable(),
  license_url: z.string().nullable(),
  run_count: z.number(),
  cover_image_url: z.string().nullable(),
  default_example: z.any().nullable(),
  latest_version: z.any().nullable(),
});

type ModelResponse = z.infer<typeof ModelResponseSchema>;

interface CreateModelParams {
  modelName: string;
  visibility?: 'public' | 'private';
}

interface StartTrainingParams {
  modelName: string;
  triggerWord: string;
  zipUrl: string;
  webhook?: string;
  webhook_events_filter?: string[];
}

export async function createModel({ 
  modelName, 
  visibility = 'private' 
}: CreateModelParams): Promise<ModelResponse> {
  return withRetries(
    async () => {
      const response = await fetch(`${REPLICATE_API_URL}/models`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner: REPLICATE_USERNAME,
          name: modelName,
          visibility: visibility,
          hardware: 'gpu-t4'
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to create model: ${JSON.stringify(error)}`);
      }

      const data = await response.json();
      return ModelResponseSchema.parse(data);
    },
    {
      maxRetries: 3,
      initialDelay: 2000,
    },
    {
      customErrorMessage: 'Error al crear el modelo. Por favor, intenta de nuevo.',
    }
  ).catch(handleReplicateError);
}

export async function startTraining({
  modelName,
  triggerWord,
  zipUrl,
  webhook,
  webhook_events_filter,
}: StartTrainingParams) {
  return withRetries(
    async () => {
      const training = await replicate.trainings.create(
        "ostris",
        "flux-dev-lora-trainer",
        "e440909d3512c31646ee2e0c7d6f6f4923224863a6a10c494606e79fb5844497",
        {
          destination: `${REPLICATE_USERNAME}/${modelName}`,
          input: {
            steps: 30,
            lora_rank: 16,
            optimizer: "adamw8bit",
            batch_size: 1,
            resolution: "512,768,1024",
            autocaption: false,
            input_images: zipUrl,
            trigger_word: triggerWord,
            learning_rate: 0.0004,
            wandb_project: "flux_train_replicate",
            wandb_save_interval: 100,
            caption_dropout_rate: 0.05,
            cache_latents_to_disk: false,
            wandb_sample_interval: 100
          }
        }
      );

      return training;
    },
    {
      maxRetries: 2,
      initialDelay: 3000,
    },
    {
      customErrorMessage: 'Error al iniciar el entrenamiento. Por favor, intenta de nuevo.',
    }
  ).catch(handleReplicateError);
} 