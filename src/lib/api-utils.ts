import { toast } from 'sonner';

interface RetryConfig {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
}

interface ErrorConfig {
  showToast?: boolean;
  customErrorMessage?: string;
  logError?: boolean;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
};

const DEFAULT_ERROR_CONFIG: ErrorConfig = {
  showToast: true,
  customErrorMessage: 'Ha ocurrido un error. Por favor, intenta de nuevo.',
  logError: true,
};

/**
 * Función de utilidad para manejar reintentos y errores en llamadas a APIs
 * @param operation Función asíncrona a ejecutar
 * @param retryConfig Configuración de reintentos
 * @param errorConfig Configuración de manejo de errores
 * @returns Resultado de la operación
 */
export async function withRetries<T>(
  operation: () => Promise<T>,
  retryConfig: RetryConfig = {},
  errorConfig: ErrorConfig = {}
): Promise<T> {
  const config = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
  const errorConf = { ...DEFAULT_ERROR_CONFIG, ...errorConfig };
  let lastError: Error | null = null;
  let delay = config.initialDelay!;

  for (let attempt = 0; attempt <= config.maxRetries!; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (errorConf.logError) {
        console.error(`Error en intento ${attempt + 1}/${config.maxRetries! + 1}:`, error);
      }

      if (attempt === config.maxRetries) {
        if (errorConf.showToast) {
          toast.error(errorConf.customErrorMessage);
        }
        throw error;
      }

      // Esperar antes del siguiente intento
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Calcular el siguiente delay con backoff exponencial
      delay = Math.min(delay * config.backoffFactor!, config.maxDelay!);
    }
  }

  throw lastError;
}

/**
 * Función de utilidad para manejar errores específicos de Supabase
 */
export function handleSupabaseError(error: any, customMessage?: string): never {
  const message = customMessage || 'Error en la operación con Supabase';
  console.error('Supabase Error:', error);
  toast.error(message);
  throw error;
}

/**
 * Función de utilidad para manejar errores específicos de Replicate
 */
export function handleReplicateError(error: any, customMessage?: string): never {
  const message = customMessage || 'Error en la operación con Replicate';
  console.error('Replicate Error:', error);
  toast.error(message);
  throw error;
}

/**
 * Función de utilidad para manejar errores específicos de APIs de IA
 */
export function handleAIError(error: any, customMessage?: string): never {
  const message = customMessage || 'Error en el procesamiento de IA';
  console.error('AI Error:', error);
  toast.error(message);
  throw error;
} 