// Seed Admin User Script
// Run with: npx tsx scripts/seed-admin.ts

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gowgutmkaifhkhjuzhaj.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key-here'

async function seedAdmin() {
    const email = 'admin@muskypaws.gr'
    const password = 'muskypaws123'

    console.log('🐾 Creating admin user...')
    console.log(`   Email: ${email}`)

    const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
            email,
            password,
            email_confirm: true,
            user_metadata: { role: 'admin', name: 'Musky Paws Admin' }
        })
    })

    const data = await res.json()

    if (res.ok) {
        console.log('✅ Admin user created successfully!')
        console.log(`   User ID: ${data.id}`)
        console.log(`\n   Login at: http://localhost:3050/admin/login`)
        console.log(`   Email:    ${email}`)
        console.log(`   Password: ${password}`)
    } else if (data.msg?.includes('already been registered') || data.message?.includes('already been registered')) {
        console.log('ℹ️  Admin user already exists. Skipping.')
        console.log(`\n   Login at: http://localhost:3050/admin/login`)
        console.log(`   Email:    ${email}`)
        console.log(`   Password: ${password}`)
    } else {
        console.error('❌ Error creating admin user:', data)
    }
}

seedAdmin()
