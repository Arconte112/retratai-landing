import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const uploadZipToStorage = async (zipFile: Blob, fileName: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('zip')
      .upload(fileName, zipFile, {
        contentType: 'application/zip',
        upsert: false
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error uploading zip:', error);
    throw error;
  }
}; 