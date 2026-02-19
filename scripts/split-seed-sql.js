const fs = require('fs')
const path = require('path')

const seedSql = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'seed.sql'), 'utf8')
// Split on the double newline between INSERT statements
const statements = seedSql.split(/\n\n/).filter(s => s.trim())

const CHUNKS = 6
const chunkSize = Math.ceil(statements.length / CHUNKS)

for (let i = 0; i < CHUNKS; i++) {
  const chunk = statements.slice(i * chunkSize, (i + 1) * chunkSize)
  const outPath = path.join(__dirname, '..', 'supabase', `seed-part${i + 1}.sql`)
  fs.writeFileSync(outPath, chunk.join('\n\n') + '\n')
  console.log(`Part ${i + 1}: ${chunk.length} statements -> ${outPath}`)
}
