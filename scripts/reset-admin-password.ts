export { } // Make this a module to avoid Top-level declarations conflicts
// Run with: npx tsx scripts/reset-admin-password.ts

const SUPABASE_URL = 'https://gowgutmkaifhkhjuzhaj.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key-here'

async function resetPassword() {
    const email = 'admin@muskypaws.gr'
    const newPassword = 'muskypaws123'

    console.log('🔑 Looking up admin user...')

    // 1. Find the user by email
    const listRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?page=1&per_page=50`, {
        headers: {
            'apikey': SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        }
    })
    const listData = await listRes.json()
    const users = listData.users || listData
    const adminUser = Array.isArray(users) ? users.find((u: any) => u.email === email) : null

    if (!adminUser) {
        console.log('❌ Admin user not found. Creating...')
        const createRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            },
            body: JSON.stringify({
                email,
                password: newPassword,
                email_confirm: true,
                user_metadata: { role: 'admin', name: 'Musky Paws Admin' }
            })
        })
        const createData = await createRes.json()
        if (createRes.ok) {
            console.log('✅ Admin user created!')
            console.log(`   User ID: ${createData.id}`)
        } else {
            console.error('❌ Error:', createData)
        }
    } else {
        console.log(`   Found user: ${adminUser.id}`)
        console.log('🔄 Updating password...')

        // 2. Update with new password
        const updateRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${adminUser.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            },
            body: JSON.stringify({
                password: newPassword,
                email_confirm: true,
            })
        })
        const updateData = await updateRes.json()
        if (updateRes.ok) {
            console.log('✅ Password updated successfully!')
        } else {
            console.error('❌ Error updating:', updateData)
        }
    }

    console.log(`\n   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.log(`   Login at: http://localhost:3050/admin/login`)
    console.log(`   Email:    ${email}`)
    console.log(`   Password: ${newPassword}`)
    console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)
}

resetPassword()
