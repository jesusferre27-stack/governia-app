
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Manually parse .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const env = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        let value = match[2].trim();
        // Remove quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
        }
        env[match[1]] = value;
    }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.log('Error: Missing Supabase URL or Key in .env.local');
    process.exit(1);
}

console.log(`Testing connection to: ${supabaseUrl}`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        // Attempt to fetch from a non-existent table just to check connectivity
        // If we get a 404 or a Supabase error, we are connected.
        // If we get "fetch failed", we are not.
        const { data, error } = await supabase.from('test_connection_check').select('*').limit(1);

        if (error) {
            console.log('Supabase responded.');
            console.log('Response Error Code:', error.code);
            console.log('Response Error Message:', error.message);

            // PGRST204 = Table not found? No, usually 42P01. 
            // But ANY response means connectivity is OK.
            console.log('SUCCESS: Connection established (server responded).');
        } else {
            console.log('SUCCESS: Connection successful! Data:', data);
        }

        // Also test Auth
        console.log('Testing Auth endpoint...');
        const { data: authData, error: authError } = await supabase.auth.getSession();
        if (authError) {
            console.log('Auth check error:', authError.message);
        } else {
            console.log('Auth service reachable.');
        }

    } catch (err) {
        console.error('NETWORK ERROR: Could not connect to Supabase.');
        console.error(err);
    }
}

testConnection();
