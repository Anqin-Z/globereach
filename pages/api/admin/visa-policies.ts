import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../lib/supabase'

function checkAuth(req: NextApiRequest): boolean {
  const pw = req.headers['x-admin-password'] as string
  return !!process.env.ADMIN_PASSWORD && pw === process.env.ADMIN_PASSWORD
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET: read visa policies (filtered by passport, optionally destination)
  if (req.method === 'GET') {
    const { passport, destination } = req.query
    let query = supabase.from('visa_policies').select('*')

    if (passport) query = query.eq('passport', passport as string)
    if (destination) query = query.eq('destination', destination as string)

    query = query.order('destination', { ascending: true })

    const { data, error } = await query
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  // All write operations require auth
  if (!checkAuth(req)) return res.status(401).json({ error: 'Unauthorized' })

  // PUT: update a single visa policy entry
  if (req.method === 'PUT') {
    const { passport, destination, policy, duration } = req.body
    if (!passport || !destination) {
      return res.status(400).json({ error: 'passport and destination are required' })
    }

    const { data, error } = await supabase
      .from('visa_policies')
      .upsert(
        { passport, destination, policy: Number(policy), duration: Number(duration) },
        { onConflict: 'passport,destination' }
      )
      .select()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  // DELETE: remove a visa policy entry
  if (req.method === 'DELETE') {
    const { passport, destination } = req.body
    if (!passport || !destination) {
      return res.status(400).json({ error: 'passport and destination are required' })
    }

    const { error } = await supabase
      .from('visa_policies')
      .delete()
      .eq('passport', passport)
      .eq('destination', destination)

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ ok: true })
  }

  return res.status(405).end()
}
