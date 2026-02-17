import { useState, useEffect, useContext, useMemo, useCallback } from 'react'
import { DimensionsContext } from '../logic/context/DimensionsContext'
import { LanguageContext } from '../logic/context/LanguageContext'
import Head from 'next/head'

const COUNTRIES: string[] = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina',
  'Armenia','Australia','Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados',
  'Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana',
  'Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','Cambodia','Cameroon','Canada',
  'Cape Verde','Central African Republic','Chad','Chile','China','Colombia','Comoros',
  'Costa Rica','Croatia','Cuba','Cyprus','Czech Republic','Denmark','Djibouti','Dominica',
  'Dominican Republic','East Timor','Ecuador','Egypt','El Salvador','Equatorial Guinea',
  'Eritrea','Estonia','Eswatini','Ethiopia','Fiji','Finland','France','Gabon','Gambia',
  'Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea','Guinea Bissau',
  'Guyana','Haiti','Honduras','Hong Kong','Hungary','Iceland','India','Indonesia','Iran',
  'Iraq','Ireland','Israel','Italy','Ivory Coast','Jamaica','Japan','Jordan','Kazakhstan',
  'Kenya','Kiribati','Kosovo','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho',
  'Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','Macao','Madagascar','Malawi',
  'Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico',
  'Micronesia','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar',
  'Namibia','Nauru','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria',
  'North Korea','North Macedonia','Norway','Oman','Pakistan','Palau','Palestine','Panama',
  'Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal','Qatar',
  'Republic of the Congo','Romania','Russia','Rwanda','Saint Kitts and Nevis','Saint Lucia',
  'Saint Vincent and the Grenadines','Samoa','San Marino','Sao Tome and Principe',
  'Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia',
  'Slovenia','Solomon Islands','Somalia','South Africa','South Korea','South Sudan','Spain',
  'Sri Lanka','Sudan','Suriname','Sweden','Switzerland','Syria','Taiwan','Tajikistan',
  'Tanzania','Thailand','Togo','Tonga','Trinidad and Tobago','Tunisia','Turkey',
  'Turkmenistan','Tuvalu','Uganda','Ukraine','United Arab Emirates','United Kingdom',
  'United States','Uruguay','Uzbekistan','Vanuatu','Vatican City','Venezuela','Vietnam',
  'Yemen','Zambia','Zimbabwe'
]

const VISA_POLICIES: string[] = [
  'visa free',
  'visa on arrival',
  'e-visa',
  'visa required',
  'freedom of movement',
  'no admission'
]

interface PassportEntry {
  from: string
  to: string
  policy: string
  duration: string
}

interface BlogPost {
  id: string
  title: string
  author: string
  content: string
  date: string
}

interface Props {
  setSelectorLoad: Function
}

const Admin: React.FC<Props> = ({ setSelectorLoad }) => {

  useEffect(() => {
    setSelectorLoad(false)
  }, [])

  const dimensions = useContext(DimensionsContext)
  const { language } = useContext(LanguageContext)

  // Tab state
  const [activeTab, setActiveTab] = useState<'passport' | 'blog'>('passport')

  // =====================
  // Passport Data State
  // =====================
  const [passportEntries, setPassportEntries] = useState<PassportEntry[]>([])
  const [fromFilter, setFromFilter] = useState<string>('')
  const [toFilter, setToFilter] = useState<string>('')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editPolicy, setEditPolicy] = useState<string>('')
  const [editDuration, setEditDuration] = useState<string>('')
  const [newFrom, setNewFrom] = useState<string>(COUNTRIES[0])
  const [newTo, setNewTo] = useState<string>(COUNTRIES[1])
  const [newPolicy, setNewPolicy] = useState<string>(VISA_POLICIES[0])
  const [newDuration, setNewDuration] = useState<string>('90')
  const [passportSaveStatus, setPassportSaveStatus] = useState<string>('')

  // =====================
  // Blog State
  // =====================
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [showBlogForm, setShowBlogForm] = useState<boolean>(false)
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [blogTitle, setBlogTitle] = useState<string>('')
  const [blogAuthor, setBlogAuthor] = useState<string>('')
  const [blogContent, setBlogContent] = useState<string>('')
  const [blogDate, setBlogDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [blogSaveStatus, setBlogSaveStatus] = useState<string>('')

  // Load data from localStorage
  useEffect(() => {
    try {
      const storedEntries = localStorage.getItem('globereach_passport_data')
      if (storedEntries) {
        setPassportEntries(JSON.parse(storedEntries))
      }
    } catch (e) {
      console.error('Failed to load passport data from localStorage', e)
    }

    try {
      const storedPosts = localStorage.getItem('globereach_blog_posts')
      if (storedPosts) {
        setBlogPosts(JSON.parse(storedPosts))
      }
    } catch (e) {
      console.error('Failed to load blog posts from localStorage', e)
    }
  }, [])

  // =====================
  // Passport Data Handlers
  // =====================
  const filteredEntries = useMemo(() => {
    return passportEntries.filter(entry => {
      const matchFrom = fromFilter === '' || entry.from.toLowerCase().includes(fromFilter.toLowerCase())
      const matchTo = toFilter === '' || entry.to.toLowerCase().includes(toFilter.toLowerCase())
      return matchFrom && matchTo
    })
  }, [passportEntries, fromFilter, toFilter])

  const handleAddEntry = useCallback(() => {
    const newEntry: PassportEntry = {
      from: newFrom,
      to: newTo,
      policy: newPolicy,
      duration: newDuration
    }
    setPassportEntries(prev => [...prev, newEntry])
    setNewDuration('90')
  }, [newFrom, newTo, newPolicy, newDuration])

  const handleStartEdit = useCallback((index: number) => {
    const realIndex = passportEntries.indexOf(filteredEntries[index])
    setEditingIndex(realIndex)
    setEditPolicy(passportEntries[realIndex].policy)
    setEditDuration(passportEntries[realIndex].duration)
  }, [passportEntries, filteredEntries])

  const handleSaveEdit = useCallback(() => {
    if (editingIndex === null) return
    setPassportEntries(prev => {
      const updated = [...prev]
      updated[editingIndex] = {
        ...updated[editingIndex],
        policy: editPolicy,
        duration: editDuration
      }
      return updated
    })
    setEditingIndex(null)
    setEditPolicy('')
    setEditDuration('')
  }, [editingIndex, editPolicy, editDuration])

  const handleCancelEdit = useCallback(() => {
    setEditingIndex(null)
    setEditPolicy('')
    setEditDuration('')
  }, [])

  const handleDeleteEntry = useCallback((index: number) => {
    const realIndex = passportEntries.indexOf(filteredEntries[index])
    setPassportEntries(prev => prev.filter((_, i) => i !== realIndex))
  }, [passportEntries, filteredEntries])

  const handleSavePassportData = useCallback(() => {
    try {
      localStorage.setItem('globereach_passport_data', JSON.stringify(passportEntries))
      setPassportSaveStatus('Saved successfully!')
      setTimeout(() => setPassportSaveStatus(''), 3000)
    } catch (e) {
      setPassportSaveStatus('Error saving data.')
      setTimeout(() => setPassportSaveStatus(''), 3000)
    }
  }, [passportEntries])

  // =====================
  // Blog Handlers
  // =====================
  const resetBlogForm = useCallback(() => {
    setBlogTitle('')
    setBlogAuthor('')
    setBlogContent('')
    setBlogDate(new Date().toISOString().split('T')[0])
    setEditingPostId(null)
    setShowBlogForm(false)
  }, [])

  const handleSaveBlogPost = useCallback(() => {
    if (!blogTitle.trim() || !blogContent.trim()) return

    if (editingPostId) {
      setBlogPosts(prev => prev.map(post =>
        post.id === editingPostId
          ? { ...post, title: blogTitle, author: blogAuthor, content: blogContent, date: blogDate }
          : post
      ))
    } else {
      const newPost: BlogPost = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        title: blogTitle,
        author: blogAuthor,
        content: blogContent,
        date: blogDate
      }
      setBlogPosts(prev => [...prev, newPost])
    }

    resetBlogForm()
  }, [editingPostId, blogTitle, blogAuthor, blogContent, blogDate, resetBlogForm])

  const handleEditBlogPost = useCallback((post: BlogPost) => {
    setEditingPostId(post.id)
    setBlogTitle(post.title)
    setBlogAuthor(post.author)
    setBlogContent(post.content)
    setBlogDate(post.date)
    setShowBlogForm(true)
  }, [])

  const handleDeleteBlogPost = useCallback((id: string) => {
    setBlogPosts(prev => prev.filter(post => post.id !== id))
  }, [])

  const handleSaveBlogData = useCallback(() => {
    try {
      localStorage.setItem('globereach_blog_posts', JSON.stringify(blogPosts))
      setBlogSaveStatus('Saved successfully!')
      setTimeout(() => setBlogSaveStatus(''), 3000)
    } catch (e) {
      setBlogSaveStatus('Error saving data.')
      setTimeout(() => setBlogSaveStatus(''), 3000)
    }
  }, [blogPosts])

  const isMobile = useMemo(() => {
    return dimensions.width < 768
  }, [dimensions.width])

  return (
    <>
      <Head>
        <title>{'GlobeReach - Admin'}</title>
        <meta name='viewport' content='width=device-width, user-scalable=no'></meta>
        <link rel='shortcut icon' href='/favicon.png' />
      </Head>
      <div className={'admin-container'}>
        <style jsx>{`
          .admin-container {
            display: flex;
            flex-direction: column;
            margin-top: 70px;
            align-items: center;
            color: #E8ECF1;
            padding: 0 20px 60px 20px;
            min-height: calc(100vh - 70px);
            background-color: #0F1420;
          }
          .admin-header {
            width: 100%;
            max-width: 1100px;
            margin-bottom: 24px;
            padding-top: 24px;
          }
          .admin-header h1 {
            margin: 0 0 4px 0;
            font-size: 1.75rem;
            color: #FFFFFF;
            font-weight: 700;
          }
          .admin-header p {
            margin: 0;
            font-size: 0.875rem;
            color: rgba(255,255,255,0.5);
          }
          .tab-bar {
            display: flex;
            gap: 0;
            width: 100%;
            max-width: 1100px;
            margin-bottom: 24px;
            border-bottom: 2px solid #1A2235;
          }
          .tab-button {
            padding: 12px 28px;
            background: none;
            border: none;
            color: rgba(255,255,255,0.5);
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            margin-bottom: -2px;
            transition: color 0.2s ease, border-color 0.2s ease;
          }
          .tab-button:hover {
            color: rgba(255,255,255,0.8);
          }
          .tab-button.active {
            color: #00D4AA;
            border-bottom-color: #00D4AA;
          }
          .content-area {
            width: 100%;
            max-width: 1100px;
          }
          .card {
            background-color: #141C2E;
            border: 1px solid rgba(0,212,170,0.1);
            border-radius: 10px;
            padding: 24px;
            margin-bottom: 20px;
          }
          .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
            flex-wrap: wrap;
            gap: 12px;
          }
          .card-header h2 {
            margin: 0;
            font-size: 1.15rem;
            color: #FFFFFF;
            font-weight: 600;
          }
          .filter-row {
            display: flex;
            gap: 12px;
            margin-bottom: 16px;
            flex-wrap: wrap;
          }
          .input-field {
            background-color: #1A2235;
            border: 1px solid rgba(0,212,170,0.2);
            border-radius: 6px;
            color: #E8ECF1;
            padding: 10px 14px;
            font-size: 0.875rem;
            outline: none;
            transition: border-color 0.2s ease;
          }
          .input-field:focus {
            border-color: #00D4AA;
          }
          .input-field::placeholder {
            color: rgba(255,255,255,0.3);
          }
          .select-field {
            background-color: #1A2235;
            border: 1px solid rgba(0,212,170,0.2);
            border-radius: 6px;
            color: #E8ECF1;
            padding: 10px 14px;
            font-size: 0.875rem;
            outline: none;
            cursor: pointer;
            transition: border-color 0.2s ease;
          }
          .select-field:focus {
            border-color: #00D4AA;
          }
          .select-field option {
            background-color: #1A2235;
            color: #E8ECF1;
          }
          .btn-primary {
            background-color: #00D4AA;
            color: #0F1420;
            border: none;
            border-radius: 6px;
            padding: 10px 20px;
            font-size: 0.875rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s ease, transform 0.1s ease;
          }
          .btn-primary:hover {
            background-color: #00F0C0;
          }
          .btn-primary:active {
            transform: scale(0.97);
          }
          .btn-secondary {
            background-color: transparent;
            color: #00D4AA;
            border: 1px solid #00D4AA;
            border-radius: 6px;
            padding: 10px 20px;
            font-size: 0.875rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s ease;
          }
          .btn-secondary:hover {
            background-color: rgba(0,212,170,0.1);
          }
          .btn-danger {
            background-color: transparent;
            color: #FF6B6B;
            border: 1px solid rgba(255,107,107,0.3);
            border-radius: 6px;
            padding: 6px 14px;
            font-size: 0.8rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s ease;
          }
          .btn-danger:hover {
            background-color: rgba(255,107,107,0.1);
          }
          .btn-small {
            padding: 6px 14px;
            font-size: 0.8rem;
          }
          .add-row {
            display: flex;
            gap: 10px;
            align-items: flex-end;
            flex-wrap: wrap;
            margin-bottom: 16px;
          }
          .add-row .field-group {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          .add-row .field-group label {
            font-size: 0.75rem;
            color: rgba(255,255,255,0.5);
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .table-wrapper {
            overflow-x: auto;
            margin-top: 8px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.875rem;
          }
          thead th {
            text-align: left;
            padding: 10px 14px;
            color: rgba(255,255,255,0.5);
            font-weight: 600;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-bottom: 1px solid rgba(0,212,170,0.15);
            white-space: nowrap;
          }
          tbody td {
            padding: 10px 14px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            vertical-align: middle;
          }
          tbody tr:hover {
            background-color: rgba(0,212,170,0.03);
          }
          .policy-badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: capitalize;
          }
          .policy-visa-free {
            background-color: rgba(0,212,170,0.15);
            color: #00D4AA;
          }
          .policy-visa-on-arrival {
            background-color: rgba(0,170,255,0.15);
            color: #00AAFF;
          }
          .policy-e-visa {
            background-color: rgba(170,130,255,0.15);
            color: #AA82FF;
          }
          .policy-visa-required {
            background-color: rgba(255,107,107,0.15);
            color: #FF6B6B;
          }
          .policy-freedom-of-movement {
            background-color: rgba(0,255,136,0.15);
            color: #00FF88;
          }
          .policy-no-admission {
            background-color: rgba(255,255,255,0.1);
            color: rgba(255,255,255,0.4);
          }
          .actions-cell {
            display: flex;
            gap: 6px;
          }
          .save-bar {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-top: 8px;
          }
          .save-status {
            font-size: 0.85rem;
            color: #00D4AA;
            font-weight: 500;
          }
          .empty-state {
            text-align: center;
            padding: 40px 20px;
            color: rgba(255,255,255,0.35);
          }
          .empty-state p {
            margin: 8px 0 0 0;
            font-size: 0.9rem;
          }
          .blog-post-card {
            background-color: #1A2235;
            border: 1px solid rgba(0,212,170,0.1);
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 12px;
            transition: border-color 0.2s ease;
          }
          .blog-post-card:hover {
            border-color: rgba(0,212,170,0.25);
          }
          .blog-post-card h3 {
            margin: 0 0 6px 0;
            font-size: 1.05rem;
            color: #FFFFFF;
          }
          .blog-meta {
            display: flex;
            gap: 16px;
            font-size: 0.8rem;
            color: rgba(255,255,255,0.45);
            margin-bottom: 10px;
          }
          .blog-excerpt {
            font-size: 0.875rem;
            color: rgba(255,255,255,0.65);
            line-height: 1.5;
            margin-bottom: 12px;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .blog-actions {
            display: flex;
            gap: 8px;
          }
          .form-card {
            background-color: #141C2E;
            border: 1px solid rgba(0,212,170,0.15);
            border-radius: 10px;
            padding: 28px;
            margin-bottom: 20px;
          }
          .form-card h2 {
            margin: 0 0 20px 0;
            font-size: 1.15rem;
            color: #FFFFFF;
            font-weight: 600;
          }
          .form-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-bottom: 16px;
          }
          .form-group label {
            font-size: 0.8rem;
            color: rgba(255,255,255,0.55);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 600;
          }
          .form-group input,
          .form-group textarea {
            background-color: #1A2235;
            border: 1px solid rgba(0,212,170,0.2);
            border-radius: 6px;
            color: #E8ECF1;
            padding: 12px 14px;
            font-size: 0.9rem;
            outline: none;
            font-family: inherit;
            transition: border-color 0.2s ease;
          }
          .form-group input:focus,
          .form-group textarea:focus {
            border-color: #00D4AA;
          }
          .form-group input::placeholder,
          .form-group textarea::placeholder {
            color: rgba(255,255,255,0.25);
          }
          .form-group textarea {
            resize: vertical;
            min-height: 180px;
            line-height: 1.6;
          }
          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
          .form-buttons {
            display: flex;
            gap: 10px;
            margin-top: 8px;
          }
          .entry-count {
            font-size: 0.8rem;
            color: rgba(255,255,255,0.35);
          }
          @media (max-width: 768px) {
            .admin-container {
              padding: 0 12px 40px 12px;
            }
            .card {
              padding: 16px;
            }
            .form-row {
              grid-template-columns: 1fr;
            }
            .add-row {
              flex-direction: column;
              align-items: stretch;
            }
            .tab-button {
              padding: 10px 16px;
              font-size: 0.85rem;
            }
          }
        `}</style>

        <div className='admin-header'>
          <h1>{'Admin Panel'}</h1>
          <p>{'Manage passport data and blog content'}</p>
        </div>

        {/* Tab Bar */}
        <div className='tab-bar'>
          <button
            className={`tab-button ${activeTab === 'passport' ? 'active' : ''}`}
            onClick={() => setActiveTab('passport')}
          >
            {'Passport Data'}
          </button>
          <button
            className={`tab-button ${activeTab === 'blog' ? 'active' : ''}`}
            onClick={() => setActiveTab('blog')}
          >
            {'Blog Management'}
          </button>
        </div>

        <div className='content-area'>

          {/* ========================= */}
          {/* PASSPORT DATA SECTION     */}
          {/* ========================= */}
          {activeTab === 'passport' && (
            <>
              {/* Add New Entry Card */}
              <div className='card'>
                <div className='card-header'>
                  <h2>{'Add Visa Policy Entry'}</h2>
                </div>
                <div className='add-row'>
                  <div className='field-group'>
                    <label>{'From Country'}</label>
                    <select
                      className='select-field'
                      value={newFrom}
                      onChange={(e) => setNewFrom(e.target.value)}
                    >
                      {COUNTRIES.map(c => (
                        <option key={`from-${c}`} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className='field-group'>
                    <label>{'To Country'}</label>
                    <select
                      className='select-field'
                      value={newTo}
                      onChange={(e) => setNewTo(e.target.value)}
                    >
                      {COUNTRIES.map(c => (
                        <option key={`to-${c}`} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className='field-group'>
                    <label>{'Visa Policy'}</label>
                    <select
                      className='select-field'
                      value={newPolicy}
                      onChange={(e) => setNewPolicy(e.target.value)}
                    >
                      {VISA_POLICIES.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div className='field-group'>
                    <label>{'Duration (days)'}</label>
                    <input
                      className='input-field'
                      type='number'
                      value={newDuration}
                      onChange={(e) => setNewDuration(e.target.value)}
                      placeholder='90'
                      style={{ width: '90px' }}
                    />
                  </div>
                  <button className='btn-primary' onClick={handleAddEntry}>
                    {'Add Entry'}
                  </button>
                </div>
              </div>

              {/* Entries Table Card */}
              <div className='card'>
                <div className='card-header'>
                  <h2>{'Visa Policy Entries'}</h2>
                  <span className='entry-count'>
                    {`${filteredEntries.length} of ${passportEntries.length} entries`}
                  </span>
                </div>

                {/* Filters */}
                <div className='filter-row'>
                  <input
                    className='input-field'
                    type='text'
                    placeholder='Filter by origin country...'
                    value={fromFilter}
                    onChange={(e) => setFromFilter(e.target.value)}
                    style={{ flex: '1', minWidth: '180px' }}
                  />
                  <input
                    className='input-field'
                    type='text'
                    placeholder='Filter by destination country...'
                    value={toFilter}
                    onChange={(e) => setToFilter(e.target.value)}
                    style={{ flex: '1', minWidth: '180px' }}
                  />
                </div>

                {filteredEntries.length === 0 ? (
                  <div className='empty-state'>
                    <p>{passportEntries.length === 0
                      ? 'No passport entries yet. Add one above to get started.'
                      : 'No entries match your filter criteria.'
                    }</p>
                  </div>
                ) : (
                  <div className='table-wrapper'>
                    <table>
                      <thead>
                        <tr>
                          <th>{'From'}</th>
                          <th>{'To'}</th>
                          <th>{'Visa Policy'}</th>
                          <th>{'Duration'}</th>
                          <th>{'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEntries.map((entry, index) => {
                          const realIndex = passportEntries.indexOf(entry)
                          const isEditing = editingIndex === realIndex
                          const policyClass = 'policy-' + entry.policy.replace(/ /g, '-')
                          return (
                            <tr key={`${entry.from}-${entry.to}-${index}`}>
                              <td>{entry.from}</td>
                              <td>{entry.to}</td>
                              <td>
                                {isEditing ? (
                                  <select
                                    className='select-field'
                                    value={editPolicy}
                                    onChange={(e) => setEditPolicy(e.target.value)}
                                    style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                                  >
                                    {VISA_POLICIES.map(p => (
                                      <option key={p} value={p}>{p}</option>
                                    ))}
                                  </select>
                                ) : (
                                  <span className={`policy-badge ${policyClass}`}>
                                    {entry.policy}
                                  </span>
                                )}
                              </td>
                              <td>
                                {isEditing ? (
                                  <input
                                    className='input-field'
                                    type='number'
                                    value={editDuration}
                                    onChange={(e) => setEditDuration(e.target.value)}
                                    style={{ width: '70px', padding: '6px 10px', fontSize: '0.8rem' }}
                                  />
                                ) : (
                                  <span>{entry.duration ? `${entry.duration} days` : '-'}</span>
                                )}
                              </td>
                              <td>
                                <div className='actions-cell'>
                                  {isEditing ? (
                                    <>
                                      <button className='btn-primary btn-small' onClick={handleSaveEdit}>
                                        {'Save'}
                                      </button>
                                      <button className='btn-secondary btn-small' onClick={handleCancelEdit}>
                                        {'Cancel'}
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button className='btn-secondary btn-small' onClick={() => handleStartEdit(index)}>
                                        {'Edit'}
                                      </button>
                                      <button className='btn-danger' onClick={() => handleDeleteEntry(index)}>
                                        {'Delete'}
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className='save-bar'>
                  <button className='btn-primary' onClick={handleSavePassportData}>
                    {'Save All Changes'}
                  </button>
                  {passportSaveStatus && (
                    <span className='save-status'>{passportSaveStatus}</span>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ========================= */}
          {/* BLOG MANAGEMENT SECTION   */}
          {/* ========================= */}
          {activeTab === 'blog' && (
            <>
              {/* Blog Form */}
              {showBlogForm && (
                <div className='form-card'>
                  <h2>{editingPostId ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>
                  <div className='form-row'>
                    <div className='form-group'>
                      <label>{'Title'}</label>
                      <input
                        type='text'
                        value={blogTitle}
                        onChange={(e) => setBlogTitle(e.target.value)}
                        placeholder='Enter post title...'
                      />
                    </div>
                    <div className='form-group'>
                      <label>{'Author'}</label>
                      <input
                        type='text'
                        value={blogAuthor}
                        onChange={(e) => setBlogAuthor(e.target.value)}
                        placeholder='Author name...'
                      />
                    </div>
                  </div>
                  <div className='form-group'>
                    <label>{'Date'}</label>
                    <input
                      type='date'
                      value={blogDate}
                      onChange={(e) => setBlogDate(e.target.value)}
                      style={{ maxWidth: '220px' }}
                    />
                  </div>
                  <div className='form-group'>
                    <label>{'Content'}</label>
                    <textarea
                      value={blogContent}
                      onChange={(e) => setBlogContent(e.target.value)}
                      placeholder='Write your blog post content here...'
                    />
                  </div>
                  <div className='form-buttons'>
                    <button className='btn-primary' onClick={handleSaveBlogPost}>
                      {editingPostId ? 'Update Post' : 'Create Post'}
                    </button>
                    <button className='btn-secondary' onClick={resetBlogForm}>
                      {'Cancel'}
                    </button>
                  </div>
                </div>
              )}

              {/* Blog Posts List Card */}
              <div className='card'>
                <div className='card-header'>
                  <h2>{'Blog Posts'}</h2>
                  {!showBlogForm && (
                    <button
                      className='btn-primary'
                      onClick={() => {
                        resetBlogForm()
                        setShowBlogForm(true)
                      }}
                    >
                      {'Create New Post'}
                    </button>
                  )}
                </div>

                {blogPosts.length === 0 ? (
                  <div className='empty-state'>
                    <p>{'No blog posts yet. Create one to get started.'}</p>
                  </div>
                ) : (
                  blogPosts.map(post => (
                    <div key={post.id} className='blog-post-card'>
                      <h3>{post.title}</h3>
                      <div className='blog-meta'>
                        <span>{post.author ? `by ${post.author}` : 'Unknown author'}</span>
                        <span>{post.date}</span>
                      </div>
                      <div className='blog-excerpt'>
                        {post.content}
                      </div>
                      <div className='blog-actions'>
                        <button className='btn-secondary btn-small' onClick={() => handleEditBlogPost(post)}>
                          {'Edit'}
                        </button>
                        <button className='btn-danger' onClick={() => handleDeleteBlogPost(post.id)}>
                          {'Delete'}
                        </button>
                      </div>
                    </div>
                  ))
                )}

                <div className='save-bar'>
                  <button className='btn-primary' onClick={handleSaveBlogData}>
                    {'Save All Changes'}
                  </button>
                  {blogSaveStatus && (
                    <span className='save-status'>{blogSaveStatus}</span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Admin
