const fs = require('fs');
const path = require('path');

// Parse .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        let value = match[2].trim();
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        env[match[1]] = value;
    }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL in .env.local');
    process.exit(1);
}

if (!serviceRoleKey) {
    console.log('⚠️  SUPABASE_SERVICE_ROLE_KEY not found in .env.local');
    console.log('');
    console.log('Para ejecutar la migración necesitas la Service Role Key.');
    console.log('Encuéntrala en: https://supabase.com/dashboard/project/xeigjrthbpayjyotvxlz/settings/api');
    console.log('');
    console.log('Agrega esta línea a tu .env.local:');
    console.log('SUPABASE_SERVICE_ROLE_KEY="tu-service-role-key-aqui"');
    console.log('');
    console.log('Luego vuelve a ejecutar: node run-migration.js');
    process.exit(1);
}

// Extraer el project ref de la URL
const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
const sqlFile = path.join(__dirname, 'supabase/migrations/20260502_create_reports_and_crews.sql');
const sql = fs.readFileSync(sqlFile, 'utf8');

console.log(`🚀 Ejecutando migración en proyecto: ${projectRef}`);
console.log(`📄 Archivo: ${sqlFile}`);
console.log('');

async function runMigration() {
    try {
        const response = await fetch(
            `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query: sql })
            }
        );

        const responseText = await response.text();
        
        if (!response.ok) {
            // Try the direct REST SQL approach via supabase-js anon but with service role
            console.log('⚠️  Management API no disponible, intentando via SQL REST...');
            
            const restResponse = await fetch(
                `${supabaseUrl}/rest/v1/rpc/exec_sql`,
                {
                    method: 'POST',
                    headers: {
                        'apikey': serviceRoleKey,
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ sql_query: sql })
                }
            );
            
            const restText = await restResponse.text();
            if (restResponse.ok) {
                console.log('✅ Migración ejecutada exitosamente via REST!');
                console.log(restText);
            } else {
                console.log('');
                console.log('═══════════════════════════════════════════════════════');
                console.log('⚠️  No se pudo ejecutar automáticamente.');
                console.log('');
                console.log('POR FAVOR EJECUTA EL SQL MANUALMENTE:');
                console.log('1. Ve a: https://supabase.com/dashboard/project/xeigjrthbpayjyotvxlz/sql/new');
                console.log('2. Copia el contenido de:');
                console.log('   supabase/migrations/20260502_create_reports_and_crews.sql');
                console.log('3. Pega y ejecuta en el SQL Editor');
                console.log('═══════════════════════════════════════════════════════');
            }
            return;
        }

        console.log('✅ Migración ejecutada exitosamente!');
        console.log(responseText);
        
    } catch (err) {
        console.error('❌ Error de red:', err.message);
        console.log('');
        console.log('Por favor ejecuta el SQL manualmente:');
        console.log('→ https://supabase.com/dashboard/project/xeigjrthbpayjyotvxlz/sql/new');
    }
}

runMigration();
