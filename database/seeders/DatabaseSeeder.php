<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->seedAdminUser();
    }

    public function seedAdminUser () {

        User::create([
            'name' => 'administrator',
            'username' => 'admin',
            'password' => Hash::make('teamhrmo2019'),
            'role' => 'administrator'
        ]);

    }
}
