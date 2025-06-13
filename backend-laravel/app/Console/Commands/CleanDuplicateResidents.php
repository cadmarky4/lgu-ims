<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Resident;
use Illuminate\Support\Facades\DB;

class CleanDuplicateResidents extends Command
{
    protected $signature = 'residents:clean-duplicates';
    protected $description = 'Clean duplicate residents based on name and birth date';

    public function handle()
    {
        $this->info('Starting duplicate resident cleanup...');

        // Find and handle duplicates
        $duplicates = DB::select("
            SELECT first_name, last_name, birth_date, COUNT(*) as count 
            FROM residents 
            GROUP BY first_name, last_name, birth_date 
            HAVING COUNT(*) > 1
        ");

        $this->info('Found ' . count($duplicates) . ' sets of duplicate records');

        foreach ($duplicates as $duplicate) {
            $this->info("Processing: {$duplicate->first_name} {$duplicate->last_name} - {$duplicate->birth_date}");
            
            // Get all residents with this name and birth date
            $residents = Resident::where('first_name', $duplicate->first_name)
                ->where('last_name', $duplicate->last_name)
                ->where('birth_date', $duplicate->birth_date)
                ->orderBy('created_at', 'asc')
                ->get();

            // Keep the first one (oldest record), delete the rest
            $keepResident = $residents->first();
            $deleteResidents = $residents->skip(1);

            foreach ($deleteResidents as $resident) {
                $this->line("  Deleting duplicate ID: {$resident->id}");
                $resident->delete();
            }
        }

        $this->info('Duplicate cleanup completed!');
        return 0;
    }
}
