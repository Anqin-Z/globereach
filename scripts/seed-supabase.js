/**
 * Seed script: imports visaPolicy.json and visaDuration.json into Supabase.
 *
 * Usage:
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co \
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key \
 *   node scripts/seed-supabase.js
 */

const { createClient } = require('@supabase/supabase-js')
const visaPolicy = require('../public/visaPolicy.json')
const visaDuration = require('../public/visaDuration.json')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
  const passports = Object.keys(visaPolicy)
  console.log(`Seeding ${passports.length} passports...`)

  // Process in batches of 500 rows
  const BATCH_SIZE = 500
  let totalInserted = 0

  for (const passport of passports) {
    const destinations = Object.keys(visaPolicy[passport])
    const rows = destinations.map(dest => ({
      passport,
      destination: dest,
      policy: visaPolicy[passport][dest],
      duration: (visaDuration[passport] && visaDuration[passport][dest]) || 0,
    }))

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE)
      const { error } = await supabase
        .from('visa_policies')
        .upsert(batch, { onConflict: 'passport,destination' })

      if (error) {
        console.error(`Error seeding ${passport} (batch ${i}):`, error.message)
      } else {
        totalInserted += batch.length
      }
    }

    process.stdout.write(`\r  ${passport} done (${totalInserted} rows total)`)
  }

  console.log(`\nSeeding complete: ${totalInserted} rows inserted.`)
}

seed().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
