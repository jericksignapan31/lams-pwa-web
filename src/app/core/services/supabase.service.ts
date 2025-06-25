import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
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
      console.log('🔄 Starting file upload...');
      console.log('File:', file.name, file.type, file.size);
      console.log('Bucket:', bucket);
      console.log('Path:', path);
      
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .upload(path, file);

      console.log('📤 Upload response:', { data, error });

      if (error) {
        console.error('❌ Upload error details:', error);
        throw error;
      }

      console.log('✅ Upload successful:', data);
      return data;
    } catch (error) {
      console.error('❌ Error uploading file:', error);
      throw error;
    }
  }

  /**
   * Upload multiple files to Supabase Storage
   */
  async uploadFiles(
    files: File[],
    bucket: string,
    basePath: string = ''
  ): Promise<any[]> {
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
    const { data } = this.supabase.storage.from(bucket).getPublicUrl(path);

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
  async createBucket(
    bucketName: string,
    isPublic: boolean = true
  ): Promise<any> {
    try {
      const { data, error } = await this.supabase.storage.createBucket(
        bucketName,
        {
          public: isPublic,
          allowedMimeTypes: [
            'image/*',
            'application/pdf',
            'text/*',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          ],
          fileSizeLimit: 10485760, // 10MB
        }
      );

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error creating bucket:', error);
      throw error;
    }
  }

  /**
   * Check if a bucket exists
   */
  async bucketExists(bucketName: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase.storage.listBuckets();
      
      if (error) {
        console.error('Error listing buckets:', error);
        return false;
      }

      return data?.some(bucket => bucket.name === bucketName) || false;
    } catch (error) {
      console.error('Error checking bucket existence:', error);
      return false;
    }
  }

  /**
   * Test Supabase connection and bucket access
   */
  async testConnection(): Promise<boolean> {
    try {
      console.log('Testing Supabase connection...');
      
      // Try to list buckets
      const { data: buckets, error: bucketsError } = await this.supabase.storage.listBuckets();
      
      if (bucketsError) {
        console.error('Error listing buckets:', bucketsError);
        return false;
      }
      
      console.log('Available buckets:', buckets);
      
      // Check if profile-pictures bucket exists
      const profileBucket = buckets?.find(b => b.name === 'profile-pictures');
      if (profileBucket) {
        console.log('Profile-pictures bucket found:', profileBucket);
        
        // Try to list files in the bucket
        const { data: files, error: filesError } = await this.supabase.storage
          .from('profile-pictures')
          .list('profiles', { limit: 1 });
          
        if (filesError) {
          console.error('Error accessing bucket files:', filesError);
          return false;
        }
        
        console.log('Bucket access successful, sample files:', files);
        return true;
      } else {
        console.log('Profile-pictures bucket not found');
        return false;
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  /**
   * Simple storage test - try to upload a tiny test file
   */
  async testStorageUpload(): Promise<boolean> {
    try {
      console.log('🧪 Testing storage upload...');
      
      // Create a tiny test file
      const testContent = 'test';
      const testFile = new File([testContent], 'test.txt', { type: 'text/plain' });
      
      const testPath = `test/${Date.now()}_test.txt`;
      
      const { data, error } = await this.supabase.storage
        .from('profile-pictures')
        .upload(testPath, testFile);

      if (error) {
        console.error('❌ Storage test failed:', error);
        return false;
      }

      console.log('✅ Storage test successful:', data);
      
      // Clean up test file
      try {
        await this.supabase.storage.from('profile-pictures').remove([testPath]);
        console.log('🧹 Test file cleaned up');
      } catch (cleanupError) {
        console.log('⚠️ Test file cleanup failed (not critical):', cleanupError);
      }
      
      return true;
    } catch (error) {
      console.error('❌ Storage test error:', error);
      return false;
    }
  }
}
