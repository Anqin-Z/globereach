/**
 * Generates SQL INSERT statements from the JSON files.
 * Output goes to supabase/seed.sql — paste it into the Supabase SQL Editor.
 */
const fs = require('fs')
const path = require('path')
const visaPolicy = require('../public/visaPolicy.json')
const visaDuration = require('../public/visaDuration.json')

const passports = Object.keys(visaPolicy)
const lines = []

// Process in batches of 200 values per INSERT
const BATCH = 200
let allRows = []

for (const passport of passports) {
  const destinations = Object.keys(visaPolicy[passport])
  for (const dest of destinations) {
    const policy = visaPolicy[passport][dest]
    const duration = (visaDuration[passport] && visaDuration[passport][dest]) || 0
    const pEsc = passport.replace(/'/g, "''")
    const dEsc = dest.replace(/'/g, "''")
    allRows.push(`('${pEsc}','${dEsc}',${policy},${duration})`)
  }
}

for (let i = 0; i < allRows.length; i += BATCH) {
  const batch = allRows.slice(i, i + BATCH)
  lines.push(`INSERT INTO visa_policies (passport, destination, policy, duration) VALUES\n${batch.join(',\n')}\nON CONFLICT (passport, destination) DO UPDATE SET policy=EXCLUDED.policy, duration=EXCLUDED.duration;\n`)
}

const outPath = path.join(__dirname, '..', 'supabase', 'seed.sql')
fs.writeFileSync(outPath, lines.join('\n'))
console.log(`Written ${allRows.length} rows in ${lines.length} batches to ${outPath}`)
