import { useState, useEffect, useCallback, useContext } from 'react'
import Head from 'next/head'
import { SelectorLoadContext } from '../logic/context/SelectorLoadContext'

const POLICY_LABELS: Record<number, string> = {
  0: 'Home Country',
  1: 'Visa Required',
  2: 'OECS Freedom',
  3: 'MERCOSUR Freedom',
  4: 'EU Freedom',
  5: 'GCC Freedom',
  6: 'Freedom of Movement',
  7: 'Visa-Free',
  8: 'ETA',
  9: 'Visa on Arrival / eVisa',
  10: 'Visa on Arrival',
  11: 'eVisa',
  12: 'Special Permit',
  13: 'Simplified Visa',
  14: 'Confirmation Required',
  15: 'No Access',
}

const POLICY_COLORS: Record<number, string> = {
  0: '#FF1493', 1: '#FF0000', 2: '#FF9100', 3: '#00875D',
  4: '#003399', 5: '#997B3D', 6: '#FFB3BF', 7: '#32CD32',
  8: '#51CD7B', 9: '#A1E07B', 10: '#FFFF5C', 11: '#87CEFA',
  12: '#7641AB', 13: '#C8C8C8', 14: '#000000', 15: '#969696',
}

interface VisaEntry {
  passport: string
  destination: string
  policy: number
  duration: number
}

export default function Admin() {
  const { setSelectorLoad } = useContext(SelectorLoadContext) as { setSelectorLoad: Function }
  useEffect(() => { setSelectorLoad(false) }, [])

  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState('')

  const [passport, setPassport] = useState('')
  const [entries, setEntries] = useState<VisaEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [passportList, setPassportList] = useState<string[]>([])

  const [editRow, setEditRow] = useState<string | null>(null)
  const [editPolicy, setEditPolicy] = useState(0)
  const [editDuration, setEditDuration] = useState(0)

  const [addDest, setAddDest] = useState('')
  const [addPolicy, setAddPolicy] = useState(1)
  const [addDuration, setAddDuration] = useState(0)
  const [showAdd, setShowAdd] = useState(false)

  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [message, setMessage] = useState('')

  // Login
  const handleLogin = async () => {
    setAuthError('')
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      setAuthed(true)
    } else {
      const data = await res.json()
      setAuthError(data.error || 'Authentication failed')
    }
  }

  // Fetch distinct passport list
  useEffect(() => {
    if (!authed) return
    fetch('/api/admin/visa-policies?passport=__list__')
      .then(r => r.json())
      .then((data: { passports: string[] }) => {
        setPassportList(data.passports || [])
      })
      .catch(() => {})
  }, [authed])

  // Fetch entries for selected passport
  const fetchEntries = useCallback(async () => {
    if (!passport) return
    setLoading(true)
    const res = await fetch(`/api/admin/visa-policies?passport=${encodeURIComponent(passport)}`)
    const data = await res.json()
    setEntries(Array.isArray(data) ? data : [])
    setLoading(false)
    setEditRow(null)
  }, [passport])

  useEffect(() => { fetchEntries() }, [fetchEntries])

  // Save edit
  const handleSave = async (dest: string) => {
    setSaving(true)
    setMessage('')
    const res = await fetch('/api/admin/visa-policies', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ passport, destination: dest, policy: editPolicy, duration: editDuration }),
    })
    if (res.ok) {
      setMessage(`Updated ${passport} -> ${dest}`)
      setEditRow(null)
      fetchEntries()
    } else {
      const d = await res.json()
      setMessage(`Error: ${d.error}`)
    }
    setSaving(false)
  }

  // Add new entry
  const handleAdd = async () => {
    if (!addDest.trim()) return
    setSaving(true)
    setMessage('')
    const res = await fetch('/api/admin/visa-policies', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ passport, destination: addDest.toUpperCase().trim(), policy: addPolicy, duration: addDuration }),
    })
    if (res.ok) {
      setMessage(`Added ${passport} -> ${addDest.toUpperCase()}`)
      setAddDest('')
      setAddPolicy(1)
      setAddDuration(0)
      setShowAdd(false)
      fetchEntries()
    } else {
      const d = await res.json()
      setMessage(`Error: ${d.error}`)
    }
    setSaving(false)
  }

  // Delete entry
  const handleDelete = async (dest: string) => {
    if (!confirm(`Delete visa policy ${passport} -> ${dest}?`)) return
    setSaving(true)
    const res = await fetch('/api/admin/visa-policies', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ passport, destination: dest }),
    })
    if (res.ok) {
      setMessage(`Deleted ${passport} -> ${dest}`)
      fetchEntries()
    } else {
      const d = await res.json()
      setMessage(`Error: ${d.error}`)
    }
    setSaving(false)
  }

  // Publish: sync DB -> JSON files
  const handlePublish = async () => {
    if (!confirm('This will overwrite visaPolicy.json and visaDuration.json with the current database contents. Continue?')) return
    setPublishing(true)
    setMessage('')
    const res = await fetch('/api/admin/publish', {
      method: 'POST',
      headers: { 'x-admin-password': password },
    })
    const data = await res.json()
    if (res.ok) {
      setMessage(`Published! ${data.passports} passports, ${data.totalEntries} entries written to JSON files.`)
    } else {
      setMessage(`Publish error: ${data.error}`)
    }
    setPublishing(false)
  }

  // ---- LOGIN SCREEN ----
  if (!authed) {
    return (
      <>
        <Head>
          <title>GlobeReach - Admin</title>
          <link rel="shortcut icon" href="/favicon.png" />
        </Head>
        <style jsx>{`
          .login-wrap { display:flex; justify-content:center; align-items:center; min-height:100vh; }
          .login-box { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:40px; max-width:360px; width:100%; text-align:center; }
          .login-box h1 { color:#00D4AA; font-size:22px; margin:0 0 8px; }
          .login-box p { color:rgba(255,255,255,0.5); font-size:13px; margin:0 0 24px; }
          .login-box input { width:100%; box-sizing:border-box; padding:10px 14px; border-radius:8px; border:1px solid rgba(255,255,255,0.15); background:rgba(255,255,255,0.06); color:#E8ECF1; font-size:14px; outline:none; margin-bottom:12px; }
          .login-box input:focus { border-color:#00D4AA; }
          .login-box button { width:100%; padding:10px; border:none; border-radius:8px; background:#00D4AA; color:#0A0F1C; font-weight:600; font-size:14px; cursor:pointer; }
          .login-box button:hover { background:#00E8BB; }
          .err { color:#FF6B6B; font-size:13px; margin-top:8px; }
        `}</style>
        <div className="login-wrap">
          <div className="login-box">
            <h1>Admin Panel</h1>
            <p>Enter the admin password to continue</p>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
            <button onClick={handleLogin}>Log In</button>
            {authError && <p className="err">{authError}</p>}
          </div>
        </div>
      </>
    )
  }

  // ---- ADMIN PANEL ----
  return (
    <>
      <Head>
        <title>GlobeReach - Admin</title>
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      <style jsx>{`
        .admin { max-width:960px; margin:70px auto 40px; padding:0 20px; }
        .top-bar { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:12px; }
        .top-bar h1 { color:#00D4AA; font-size:22px; margin:0; }
        .publish-btn { padding:8px 20px; border:none; border-radius:8px; background:#00D4AA; color:#0A0F1C; font-weight:600; font-size:13px; cursor:pointer; }
        .publish-btn:hover { background:#00E8BB; }
        .publish-btn:disabled { opacity:0.5; cursor:wait; }

        .controls { display:flex; gap:12px; align-items:center; margin-bottom:20px; flex-wrap:wrap; }
        .controls select, .controls input { padding:8px 12px; border-radius:8px; border:1px solid rgba(255,255,255,0.15); background:rgba(255,255,255,0.06); color:#E8ECF1; font-size:13px; outline:none; }
        .controls select:focus, .controls input:focus { border-color:#00D4AA; }
        .controls select { min-width:220px; }

        .msg { padding:10px 14px; border-radius:8px; background:rgba(0,212,170,0.1); border:1px solid rgba(0,212,170,0.3); color:#00D4AA; font-size:13px; margin-bottom:16px; }

        table { width:100%; border-collapse:collapse; font-size:13px; }
        th { text-align:left; padding:8px 10px; color:rgba(255,255,255,0.5); font-weight:500; border-bottom:1px solid rgba(255,255,255,0.1); font-size:12px; text-transform:uppercase; letter-spacing:0.5px; }
        td { padding:8px 10px; border-bottom:1px solid rgba(255,255,255,0.05); }
        tr:hover td { background:rgba(255,255,255,0.02); }

        .dot { display:inline-block; width:10px; height:10px; border-radius:50%; margin-right:6px; vertical-align:middle; }

        .btn { padding:4px 12px; border-radius:6px; border:1px solid rgba(255,255,255,0.15); background:rgba(255,255,255,0.05); color:rgba(255,255,255,0.8); font-size:12px; cursor:pointer; margin-right:4px; }
        .btn:hover { border-color:rgba(0,212,170,0.4); color:#00D4AA; }
        .btn-save { border-color:#00D4AA; color:#00D4AA; }
        .btn-save:hover { background:rgba(0,212,170,0.15); }
        .btn-del { border-color:rgba(255,80,80,0.4); color:#FF6B6B; }
        .btn-del:hover { background:rgba(255,80,80,0.1); }
        .btn-cancel { }

        .edit-select, .edit-input { padding:4px 8px; border-radius:6px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.06); color:#E8ECF1; font-size:12px; outline:none; }
        .edit-select:focus, .edit-input:focus { border-color:#00D4AA; }
        .edit-input { width:60px; }

        .add-row { margin-top:12px; display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
        .add-row input, .add-row select { padding:6px 10px; border-radius:6px; border:1px solid rgba(255,255,255,0.15); background:rgba(255,255,255,0.06); color:#E8ECF1; font-size:12px; outline:none; }
        .add-row input:focus, .add-row select:focus { border-color:#00D4AA; }

        .empty { text-align:center; padding:40px; color:rgba(255,255,255,0.4); }

        .add-toggle { padding:6px 16px; border-radius:8px; border:1px dashed rgba(0,212,170,0.4); background:none; color:#00D4AA; font-size:12px; cursor:pointer; margin-top:12px; }
        .add-toggle:hover { background:rgba(0,212,170,0.05); }
      `}</style>
      <div className="admin">
        <div className="top-bar">
          <h1>Visa Policy Admin</h1>
          <button className="publish-btn" onClick={handlePublish} disabled={publishing}>
            {publishing ? 'Publishing...' : 'Publish to JSON'}
          </button>
        </div>

        {message && <div className="msg">{message}</div>}

        <div className="controls">
          <select value={passport} onChange={e => setPassport(e.target.value)}>
            <option value="">Select a passport...</option>
            {passportList.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {passport && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>{entries.length} destinations</span>}
        </div>

        {loading && <div className="empty">Loading...</div>}

        {!loading && passport && entries.length > 0 && (
          <>
            <table>
              <thead>
                <tr>
                  <th>Destination</th>
                  <th>Policy</th>
                  <th>Duration (days)</th>
                  <th style={{ width: '140px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(e => (
                  <tr key={e.destination}>
                    <td style={{ fontWeight: 500 }}>{e.destination}</td>
                    {editRow === e.destination ? (
                      <>
                        <td>
                          <select className="edit-select" value={editPolicy} onChange={ev => setEditPolicy(Number(ev.target.value))}>
                            {Object.entries(POLICY_LABELS).map(([code, label]) => (
                              <option key={code} value={code}>{code} - {label}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input className="edit-input" type="number" min={0} value={editDuration} onChange={ev => setEditDuration(Number(ev.target.value))} />
                        </td>
                        <td>
                          <button className="btn btn-save" disabled={saving} onClick={() => handleSave(e.destination)}>Save</button>
                          <button className="btn btn-cancel" onClick={() => setEditRow(null)}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>
                          <span className="dot" style={{ background: POLICY_COLORS[e.policy] || '#969696' }} />
                          {POLICY_LABELS[e.policy] || `Unknown (${e.policy})`}
                        </td>
                        <td>{e.duration}</td>
                        <td>
                          <button className="btn" onClick={() => { setEditRow(e.destination); setEditPolicy(e.policy); setEditDuration(e.duration) }}>Edit</button>
                          <button className="btn btn-del" onClick={() => handleDelete(e.destination)}>Delete</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {showAdd ? (
              <div className="add-row">
                <input placeholder="ISO code (e.g. US)" value={addDest} onChange={e => setAddDest(e.target.value)} style={{ width: '100px' }} />
                <select value={addPolicy} onChange={e => setAddPolicy(Number(e.target.value))}>
                  {Object.entries(POLICY_LABELS).map(([code, label]) => (
                    <option key={code} value={code}>{code} - {label}</option>
                  ))}
                </select>
                <input type="number" min={0} placeholder="Duration" value={addDuration} onChange={e => setAddDuration(Number(e.target.value))} style={{ width: '80px' }} />
                <button className="btn btn-save" disabled={saving} onClick={handleAdd}>Add</button>
                <button className="btn btn-cancel" onClick={() => setShowAdd(false)}>Cancel</button>
              </div>
            ) : (
              <button className="add-toggle" onClick={() => setShowAdd(true)}>+ Add Destination</button>
            )}
          </>
        )}

        {!loading && passport && entries.length === 0 && (
          <div className="empty">
            No entries found for &quot;{passport}&quot;.
            <br />
            <button className="add-toggle" style={{ marginTop: '12px' }} onClick={() => setShowAdd(true)}>+ Add First Entry</button>
            {showAdd && (
              <div className="add-row" style={{ justifyContent: 'center', marginTop: '12px' }}>
                <input placeholder="ISO code" value={addDest} onChange={e => setAddDest(e.target.value)} style={{ width: '100px' }} />
                <select value={addPolicy} onChange={e => setAddPolicy(Number(e.target.value))}>
                  {Object.entries(POLICY_LABELS).map(([code, label]) => (
                    <option key={code} value={code}>{code} - {label}</option>
                  ))}
                </select>
                <input type="number" min={0} placeholder="Duration" value={addDuration} onChange={e => setAddDuration(Number(e.target.value))} style={{ width: '80px' }} />
                <button className="btn btn-save" disabled={saving} onClick={handleAdd}>Add</button>
              </div>
            )}
          </div>
        )}

        {!passport && !loading && (
          <div className="empty">Select a passport country above to view and edit its visa policies.</div>
        )}
      </div>
    </>
  )
}
