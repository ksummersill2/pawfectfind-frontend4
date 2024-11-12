import { supabase } from './client';

export type ImageBucket = 'dogs' | 'breeds' | 'products' | 'avatars';

export const uploadImage = async (file: File, bucket: ImageBucket, options?: {
  maxSizeMB?: number;
  quality?: number;
  folder?: string;
}): Promise<string> => {
  try {
    const { maxSizeMB = 5, quality = 0.8, folder = '' } = options || {};

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      throw new Error(`File size must be less than ${maxSizeMB}MB`);
    }

    // Generate file path
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
    const filePath = folder ? `${folder}/${fileName}.${fileExt}` : `${fileName}.${fileExt}`;

    // Upload file
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (err) {
    console.error('Error uploading image:', err);
    throw err;
  }
};

export const deleteImage = async (path: string, bucket: ImageBucket): Promise<void> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  } catch (err) {
    console.error('Error deleting image:', err);
    throw err;
  }
};