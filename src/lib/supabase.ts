import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const uploadZipToStorage = async (zipFile: Blob, fileName: string) => {
  try {
    console.log(`📤 Starting upload to Supabase storage: ${fileName}`);
    console.log(`📊 ZIP file size: ${(zipFile.size / 1024 / 1024).toFixed(2)}MB`);
    
    const { data, error } = await supabase.storage
      .from('zip')
      .upload(fileName, zipFile, {
        contentType: 'application/zip',
        upsert: false
      });

    if (error) {
      console.error('❌ Supabase upload error:', error);
      throw error;
    }
    console.log('✅ Supabase upload successful:', data);
    return data;
  } catch (error) {
    console.error('Error uploading zip:', error);
    throw error;
  }
}; 