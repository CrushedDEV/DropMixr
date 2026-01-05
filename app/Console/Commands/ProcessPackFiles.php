<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Pack;
use App\Models\Mashup;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use ZipArchive;

class ProcessPackFiles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'packs:process-files';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process existing packs to extract mashups from zip files';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $packs = Pack::doesntHave('mashups')->get();

        $this->info("Found {$packs->count()} packs without mashups.");

        foreach ($packs as $pack) {
            $this->info("Processing Pack: {$pack->title} (ID: {$pack->id})");

            if (!$pack->file_path || !Storage::disk('public')->exists($pack->file_path)) {
                $this->error("  File not found: {$pack->file_path}");
                continue;
            }

            $zipPath = Storage::disk('public')->path($pack->file_path);
            $zip = new ZipArchive;

            if ($zip->open($zipPath) === TRUE) {
                $extractPath = 'packs/' . $pack->id . '/files';
                // Create directory if not exists
                if (!Storage::disk('public')->exists($extractPath)) {
                    Storage::disk('public')->makeDirectory($extractPath);
                }

                $allowedExtensions = ['mp3', 'wav', 'ogg', 'm4a'];
                $count = 0;

                DB::beginTransaction();
                try {
                    for ($i = 0; $i < $zip->numFiles; $i++) {
                        $filename = $zip->getNameIndex($i);
                        $fileinfo = pathinfo($filename);

                        // Skip macos/hidden
                        if (str_contains($filename, '__MACOSX') || str_starts_with($filename, '.'))
                            continue;
                        if (str_ends_with($filename, '/'))
                            continue; // Skip dirs

                        if (isset($fileinfo['extension']) && in_array(strtolower($fileinfo['extension']), $allowedExtensions)) {

                            $tempExtractPath = Storage::disk('public')->path($extractPath);
                            $zip->extractTo($tempExtractPath, $filename);

                            // Create Mashup
                            $mashup = new Mashup();
                            $mashup->user_id = $pack->user_id;
                            $mashup->title = $fileinfo['filename'];
                            $mashup->file_path = $extractPath . '/' . $filename;
                            $mashup->image_path = $pack->cover_image_path; // Use pack cover
                            $mashup->bpm = 0;
                            $mashup->key = 'N/A';
                            $mashup->status = 'approved';
                            $mashup->is_public = false;
                            $mashup->save();

                            // Attach to Pack
                            $pack->mashups()->attach($mashup->id);
                            $count++;
                        }
                    }
                    DB::commit();
                    $this->info("  Extracted {$count} files.");
                } catch (\Exception $e) {
                    DB::rollBack();
                    $this->error("  Error processing zip: " . $e->getMessage());
                }

                $zip->close();
            } else {
                $this->error("  Could not open zip file.");
            }
        }

        $this->info('Done.');
    }
}
