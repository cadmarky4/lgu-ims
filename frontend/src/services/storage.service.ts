// storageService.ts
// Abstracted file upload logic for reusability
import { BaseApiService } from './api';

export interface UploadResult {
    url: string;
}

// URL for uploaded files
export const STORAGE_BASE_URL = 'http://127.0.0.1:8000/storage';

export const API_BASE_URL = 'http://127.0.0.1:8000/api';

export async function uploadFile(file: File): Promise<UploadResult> {
    const uploadData = new FormData();
    uploadData.append('file', file);
    // Get auth token from BaseApiService
    const token = BaseApiService.getStoredToken();
    const headers: HeadersInit = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    // Do not set Content-Type for FormData, browser will set it
    const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: uploadData,
        headers,
    });
    if (!response.ok) throw new Error('Failed to upload image');
    const data = await response.json();
    return { url: data.url };
}
