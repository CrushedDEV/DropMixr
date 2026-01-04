<?php

namespace App\Services;

use ZipArchive;
use Illuminate\Support\Facades\Log;

class ZipProcessor
{
    /**
     * Count valid audio files in a zip archive.
     * 
     * @param string $path Path to the zip file
     * @return int Number of valid audio files
     * @throws \Exception If zip cannot be opened or is invalid
     */
    public function countAudioUtils(string $path): int
    {
        $zip = new ZipArchive;
        $res = $zip->open($path);

        if ($res !== true) {
            throw new \Exception("Could not open zip file. Error code: " . $res);
        }

        $audioCount = 0;
        $allowedExtensions = ['mp3', 'wav', 'ogg', 'm4a'];

        for ($i = 0; $i < $zip->numFiles; $i++) {
            $stat = $zip->statIndex($i);

            // Skip directories
            if (substr($stat['name'], -1) === '/') {
                continue;
            }

            // Skip macOS invisible files
            if (str_contains($stat['name'], '__MACOSX') || str_starts_with(basename($stat['name']), '.')) {
                continue;
            }

            $extension = strtolower(pathinfo($stat['name'], PATHINFO_EXTENSION));
            if (in_array($extension, $allowedExtensions)) {
                $audioCount++;
            }
        }

        $zip->close();

        return $audioCount;
    }
}
