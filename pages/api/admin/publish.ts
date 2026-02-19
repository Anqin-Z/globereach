import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../lib/supabase'
import fs from 'fs'
import path from 'path'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const pw = req.headers['x-admin-password'] as string
  if (!process.env.ADMIN_PASSWORD || pw !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // Fetch all rows from Supabase
  const { data, error } = await supabase
    .from('visa_policies')
    .select('passport, destination, policy, duration')
    .order('passport')

  if (error) return res.status(500).json({ error: error.message })
  if (!data || data.length === 0) {
    return res.status(400).json({ error: 'No data in database — run the seed script first' })
  }

  // Build the JSON structures matching the existing format
  const visaPolicy: Record<string, Record<string, number>> = {}
  const visaDuration: Record<string, Record<string, number>> = {}

  for (const row of data) {
    if (!visaPolicy[row.passport]) visaPolicy[row.passport] = {}
    if (!visaDuration[row.passport]) visaDuration[row.passport] = {}
    visaPolicy[row.passport][row.destination] = row.policy
    visaDuration[row.passport][row.destination] = row.duration
  }

  // Write to the public JSON files
  const publicDir = path.join(process.cwd(), 'public')
  fs.writeFileSync(
    path.join(publicDir, 'visaPolicy.json'),
    JSON.stringify(visaPolicy, null, 2)
  )
  fs.writeFileSync(
    path.join(publicDir, 'visaDuration.json'),
    JSON.stringify(visaDuration, null, 2)
  )

  return res.status(200).json({
    ok: true,
    passports: Object.keys(visaPolicy).length,
    totalEntries: data.length,
  })
}
