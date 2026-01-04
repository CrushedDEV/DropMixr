<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\Storage;

echo "Testing S3 connection...\n";
echo "Disk: " . config('filesystems.default') . "\n";
echo "Bucket: " . config('filesystems.disks.s3.bucket') . "\n";
echo "Region: " . config('filesystems.disks.s3.region') . "\n";

try {
    $result = Storage::disk('s3')->put('test/test.txt', 'Hello from Laravel');

    if ($result) {
        echo "SUCCESS! File uploaded to S3.\n";
        // Clean up
        Storage::disk('s3')->delete('test/test.txt');
        echo "Test file deleted.\n";
    } else {
        echo "FAILED: put() returned false.\n";
    }
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "Class: " . get_class($e) . "\n";
    if ($e->getPrevious()) {
        echo "Caused by: " . $e->getPrevious()->getMessage() . "\n";
        echo "AWS Error Class: " . get_class($e->getPrevious()) . "\n";
    }
}
