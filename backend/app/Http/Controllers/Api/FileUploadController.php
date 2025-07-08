<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class FileUploadController extends Controller
{
    /**
     * Handle file upload for resident profile photos.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function upload(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'file' => 'required|file|image|max:2048', // max 2MB
            ]);

            $file = $request->file('file');
            $extension = $file->getClientOriginalExtension();
            $filename = 'resident_' . Str::random(16) . '_' . time() . '.' . $extension;

            // Ensure the directory exists
            $directory = storage_path('app/public/profile_photos');
            if (!is_dir($directory)) {
                if (!mkdir($directory, 0775, true) && !is_dir($directory)) {
                    throw new \RuntimeException('Failed to create directory: ' . $directory);
                }
            }

            $path = $file->storeAs('public/profile_photos', $filename);

            // Double-check file existence
            if (!Storage::exists('public/profile_photos/' . $filename)) {
                Log::error('File not found after upload: ' . $filename);
                return response()->json([
                    'error' => 'File was not saved to storage.',
                    'filename' => $filename,
                ], 500);
            }

            // Generate a public URL
            $url = Storage::url($path);

            return response()->json([
                'url' => $url,
                'path' => $path,
                'filename' => $filename,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('File upload error: ' . $e->getMessage());
            return response()->json([
                'error' => 'File upload failed',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
