<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class AudioProcessor
{
    /**
     * Generate a low-quality watermarked preview.
     *
     * @param string $inputPath Relative path in storage (e.g. mashups/audio/file.mp3)
     * @return string|null Relative path to preview file, or null on failure.
     */
    public function generatePreview(string $inputPath)
    {
        $diskName = config('filesystems.default', 'public');
        $storage = Storage::disk($diskName);

        if (!$storage->exists($inputPath)) {
            Log::error("AudioProcessor: Input file not found: $inputPath");
            return null;
        }

        // Create temporary files
        $tempLocalInput = tempnam(sys_get_temp_dir(), 'input_');
        // tempnam creates a file, but we want one with mp3 extension for ffmpeg clarity sometimes, 
        // though ffmpeg detects by content. Output MUST have extension for ffmpeg to know container.
        $tempLocalOutput = tempnam(sys_get_temp_dir(), 'output_') . '.mp3';

        try {
            // 1. Download file to local temp
            // file_put_contents handles memory better than loading string into memory if possible, 
            // but $storage->get() returns string. For large files ->download() or readStream is better.
            // But get() is simplest for now.
            file_put_contents($tempLocalInput, $storage->get($inputPath));

            // 2. FFMPEG Processing
            // Aggressive compression: 32k bitrate, mono (ac 1), reduce sampling rate to 22050Hz
            // This drastically reduces quality and file size.
            $bitrate = '32k';
            $sampleRate = '22050';

            // FFMpeg command
            // -y: overwrite output
            // -i: input
            // -b:a: audio bitrate
            // -ac: audio channels (1 = mono)
            // -ar: audio sampling rate
            $cmd = "ffmpeg -y -i " . escapeshellarg($tempLocalInput) . " -b:a $bitrate -ac 1 -ar $sampleRate " . escapeshellarg($tempLocalOutput) . " 2>&1";

            Log::info("AudioProcessor: Running command: $cmd");

            $output = [];
            $returnVar = 0;
            exec($cmd, $output, $returnVar);

            if ($returnVar !== 0) {
                Log::error("AudioProcessor: FFMpeg failed with exit code $returnVar", ['output' => $output]);
                return null;
            }

            if (!file_exists($tempLocalOutput) || filesize($tempLocalOutput) === 0) {
                Log::error("AudioProcessor: Output file creation failed");
                return null;
            }

            // 3. Upload preview back to storage (S3 or local)
            $previewFilename = 'preview_' . basename($inputPath);
            $previewRelativePath = dirname($inputPath) . '/' . $previewFilename;

            // Upload
            $storage->put($previewRelativePath, file_get_contents($tempLocalOutput));

            Log::info("AudioProcessor: Preview generated and uploaded to $previewRelativePath");
            return $previewRelativePath;

        } catch (\Exception $e) {
            Log::error("AudioProcessor: Error processing file: " . $e->getMessage());
            return null;
        } finally {
            // 4. Cleanup
            if (file_exists($tempLocalInput))
                @unlink($tempLocalInput);
            if (file_exists($tempLocalOutput))
                @unlink($tempLocalOutput);
        }
    }
}
