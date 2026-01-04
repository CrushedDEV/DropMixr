<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Mashup;
use App\Services\AudioProcessor;
use Illuminate\Support\Facades\Storage;

class GenerateMashupPreviews extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mashups:generate-previews {--force : Overwrite existing previews}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate low-quality previews for all mashups';

    /**
     * Execute the console command.
     */
    public function handle(AudioProcessor $processor)
    {
        $mashups = Mashup::whereNotNull('file_path')->get();
        $bar = $this->output->createProgressBar($mashups->count());
        $force = $this->option('force');

        $bar->start();

        foreach ($mashups as $mashup) {
            if ($mashup->preview_path && !$force) {
                // Check if file actually exists
                $disk = config('filesystems.default', 'public');
                if (Storage::disk($disk)->exists($mashup->preview_path)) {
                    $bar->advance();
                    continue;
                }
            }

            try {
                $preview = $processor->generatePreview($mashup->file_path);

                if ($preview) {
                    $mashup->preview_path = $preview;
                    $mashup->save();
                } else {
                    $this->error(" Failed to generate preview for Mashup ID: {$mashup->id}");
                }
            } catch (\Exception $e) {
                $this->error(" Error processing Mashup ID {$mashup->id}: " . $e->getMessage());
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info('Previews generation completed.');
    }
}
