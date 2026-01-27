<?php

namespace MemeCloud\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use MemeCloud\Models\Bucket;

class AddBucket extends Command
{
    protected $signature = 'app:bucket:add {name} {endpoint} {access_key} {secret_key}';

    protected $description = 'Добавляет новый бакет в базу';

    public function handle()
    {
        $data = [
            'name' => $this->argument('name'),
            'endpoint' => $this->argument('endpoint'),
            'access_key' => $this->argument('access_key'),
            'secret_key' => $this->argument('secret_key'),
        ];

        $validator = Validator::make($data, [
            'name' => ['required', 'string', 'max:255', Rule::unique('buckets', 'name')],
            'endpoint' => ['required', 'url', 'max:255'],
            'access_key' => ['required', 'string', 'max:255'],
            'secret_key' => ['required', 'string', 'max:255'],
        ]);

        if ($validator->fails()) {
            $this->error('Validation failed:');
            foreach ($validator->errors()->all() as $message) {
                $this->line(" - {$message}");
            }

            return self::FAILURE;
        }

        $bucket = new Bucket($data);
        $bucket->save();

        $secret = $bucket->secret_key;
        $maskedSecret = strlen($secret) <= 4
            ? str_repeat('*', strlen($secret))
            : substr($secret, 0, 2).str_repeat('*', max(strlen($secret) - 4, 0)).substr($secret, -2);

        $this->info('Bucket created.');
        $this->table(
            ['ID', 'Name', 'Endpoint', 'Access Key', 'Secret Key'],
            [[
                $bucket->id,
                $bucket->name,
                $bucket->endpoint,
                $bucket->access_key,
                $maskedSecret,
            ]]
        );

        return self::SUCCESS;

    }
}
