import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../core/services/supabase.service';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="file-upload-container">
      <div class="upload-area" 
           [class.dragover]="isDragOver"
           (dragover)="onDragOver($event)"
           (dragleave)="onDragLeave($event)"
           (drop)="onDrop($event)"
           (click)="fileInput.click()">
        
        <input #fileInput 
               type="file" 
               [multiple]="allowMultiple"
               [accept]="acceptedFileTypes"
               (change)="onFileSelected($event)"
               style="display: none;">
        
        <div class="upload-content">
          <i class="pi pi-cloud-upload upload-icon"></i>
          <h3>Upload Files to Supabase</h3>
          <p>Drag and drop files here or click to browse</p>
          <small>Max file size: 10MB | Accepted: {{acceptedFileTypes}}</small>
        </div>
      </div>

      <!-- Selected Files List -->
      <div *ngIf="selectedFiles.length > 0" class="selected-files">
        <h4>Selected Files ({{selectedFiles.length}})</h4>
        <div class="file-list">
          <div *ngFor="let file of selectedFiles; let i = index" class="file-item">
            <i class="pi pi-file file-icon"></i>
            <span class="file-name">{{file.name}}</span>
            <span class="file-size">({{formatFileSize(file.size)}})</span>
            <button class="remove-btn" (click)="removeFile(i)">
              <i class="pi pi-times"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Upload Controls -->
      <div *ngIf="selectedFiles.length > 0" class="upload-controls">
        <div class="bucket-selector">
          <label for="bucketName">Bucket Name:</label>
          <input id="bucketName" 
                 type="text" 
                 [(ngModel)]="bucketName" 
                 placeholder="Enter bucket name (e.g., lams-files)"
                 class="bucket-input">
        </div>
        
        <div class="path-selector">
          <label for="uploadPath">Upload Path (optional):</label>
          <input id="uploadPath" 
                 type="text" 
                 [(ngModel)]="uploadPath" 
                 placeholder="e.g., documents/, images/2024/"
                 class="path-input">
        </div>

        <div class="upload-buttons">
          <button class="upload-btn" 
                  [disabled]="!bucketName || isUploading"
                  (click)="uploadFiles()">
            <i class="pi pi-upload" *ngIf="!isUploading"></i>
            <i class="pi pi-spin pi-spinner" *ngIf="isUploading"></i>
            {{isUploading ? 'Uploading...' : 'Upload to Supabase'}}
          </button>
          
          <button class="clear-btn" (click)="clearFiles()" [disabled]="isUploading">
            Clear All
          </button>
        </div>
      </div>

      <!-- Upload Progress -->
      <div *ngIf="uploadProgress.length > 0" class="upload-progress">
        <h4>Upload Progress</h4>
        <div *ngFor="let progress of uploadProgress" class="progress-item">
          <span class="progress-filename">{{progress.fileName}}</span>
          <span class="progress-status" [class]="progress.status">
            {{progress.message}}
          </span>
        </div>
      </div>

      <!-- Uploaded Files -->
      <div *ngIf="uploadedFiles.length > 0" class="uploaded-files">
        <h4>Successfully Uploaded Files</h4>
        <div *ngFor="let file of uploadedFiles" class="uploaded-item">
          <i class="pi pi-check-circle success-icon"></i>
          <span class="uploaded-name">{{file.name}}</span>
          <a [href]="file.publicUrl" target="_blank" class="view-link">
            <i class="pi pi-external-link"></i> View
          </a>
          <button class="copy-btn" (click)="copyToClipboard(file.publicUrl)">
            <i class="pi pi-copy"></i> Copy URL
          </button>
        </div>
      </div>
    </div>  `,
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {
  @Input() allowMultiple: boolean = true;
  @Input() acceptedFileTypes: string = 'image/*,application/pdf,text/*,.doc,.docx,.xls,.xlsx';
  @Input() maxFileSize: number = 10485760; // 10MB
  @Output() filesUploaded = new EventEmitter<any[]>();

  selectedFiles: File[] = [];
  isDragOver: boolean = false;
  isUploading: boolean = false;
  bucketName: string = 'lams-files';
  uploadPath: string = '';
  uploadProgress: any[] = [];
  uploadedFiles: any[] = [];

  constructor(
    private supabaseService: SupabaseService,
    private alertService: AlertService
  ) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = Array.from(event.dataTransfer?.files || []);
    this.handleFiles(files);
  }
  onFileSelected(event: any) {
    const files = Array.from(event.target.files || []) as File[];
    this.handleFiles(files);
  }

  handleFiles(files: File[]) {
    const validFiles = files.filter(file => this.validateFile(file));
    
    if (this.allowMultiple) {
      this.selectedFiles = [...this.selectedFiles, ...validFiles];
    } else {
      this.selectedFiles = validFiles.slice(0, 1);
    }
  }

  validateFile(file: File): boolean {
    if (file.size > this.maxFileSize) {
      this.alertService.handleError(`File ${file.name} is too large. Max size: ${this.formatFileSize(this.maxFileSize)}`);
      return false;
    }
    return true;
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  clearFiles() {
    this.selectedFiles = [];
    this.uploadProgress = [];
    this.uploadedFiles = [];
  }

  async uploadFiles() {
    if (!this.bucketName || this.selectedFiles.length === 0) {
      this.alertService.handleError('Please select files and enter a bucket name');
      return;
    }

    this.isUploading = true;
    this.uploadProgress = [];
    this.uploadedFiles = [];

    try {
      // First, try to create the bucket (in case it doesn't exist)
      try {
        await this.supabaseService.createBucket(this.bucketName);
        console.log(`Bucket '${this.bucketName}' created or already exists`);
      } catch (bucketError) {
        console.log('Bucket might already exist:', bucketError);
      }

      // Upload each file
      for (const file of this.selectedFiles) {
        const fileName = `${this.uploadPath}${Date.now()}_${file.name}`;
        
        this.uploadProgress.push({
          fileName: file.name,
          status: 'uploading',
          message: 'Uploading...'
        });

        try {
          const uploadResult = await this.supabaseService.uploadFile(file, this.bucketName, fileName);
          const publicUrl = this.supabaseService.getPublicUrl(this.bucketName, fileName);
          
          // Update progress
          const progressIndex = this.uploadProgress.findIndex(p => p.fileName === file.name);
          if (progressIndex >= 0) {
            this.uploadProgress[progressIndex] = {
              fileName: file.name,
              status: 'success',
              message: 'Uploaded successfully'
            };
          }

          // Add to uploaded files
          this.uploadedFiles.push({
            name: file.name,
            path: fileName,
            publicUrl: publicUrl,
            uploadResult: uploadResult
          });

        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          
          const progressIndex = this.uploadProgress.findIndex(p => p.fileName === file.name);
          if (progressIndex >= 0) {
            this.uploadProgress[progressIndex] = {
              fileName: file.name,
              status: 'error',
              message: `Error: ${error}`
            };
          }
        }
      }

      if (this.uploadedFiles.length > 0) {
        this.alertService.handleSuccess(`Successfully uploaded ${this.uploadedFiles.length} file(s) to Supabase!`);
        this.filesUploaded.emit(this.uploadedFiles);
      }

    } catch (error) {
      console.error('Upload error:', error);
      this.alertService.handleError('Failed to upload files to Supabase');
    } finally {
      this.isUploading = false;
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.alertService.handleSuccess('URL copied to clipboard!');
    }).catch(() => {
      this.alertService.handleError('Failed to copy URL');
    });
  }
}
