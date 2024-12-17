/**
 * Genera una triggerword a partir del nombre del modelo
 * Convierte el texto a mayúsculas y mezcla las letras de forma aleatoria
 */
export function generateTriggerword(modelName: string): string {
  // Convertir a mayúsculas y eliminar espacios
  const cleanName = modelName.toUpperCase().replace(/\s+/g, '');
  
  // Convertir a array y mezclar
  const letters = cleanName.split('');
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  
  return letters.join('');
} 