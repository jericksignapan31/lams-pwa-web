import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.anonKey
    );
  }

  /**
   * Upload a single file to Supabase Storage
   */
  async uploadFile(file: File, bucket: string, path: string): Promise<any> {
    try {
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .upload(path, file);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  /**
   * Upload multiple files to Supabase Storage
   */
  async uploadFiles(files: File[], bucket: string, basePath: string = ''): Promise<any[]> {
    const uploadPromises = files.map((file, index) => {
      const fileName = `${basePath}${file.name}`;
      return this.uploadFile(file, bucket, fileName);
    });

    try {
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  }

  /**
   * Get public URL for a file
   */
  getPublicUrl(bucket: string, path: string): string {
    const { data } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  }

  /**
   * Delete a file from Supabase Storage
   */
  async deleteFile(bucket: string, path: string): Promise<any> {
    try {
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  /**
   * List files in a bucket
   */
  async listFiles(bucket: string, path: string = ''): Promise<any> {
    try {
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .list(path);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  /**
   * Create a new bucket
   */
  async createBucket(bucketName: string, isPublic: boolean = true): Promise<any> {
    try {
      const { data, error } = await this.supabase.storage
        .createBucket(bucketName, {
          public: isPublic,
          allowedMimeTypes: [
            'image/*',
            'application/pdf',
            'text/*',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          ],
          fileSizeLimit: 10485760 // 10MB
        });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error creating bucket:', error);
      throw error;
    }
  }
}
