import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// Simulated Database for AccuRack Sandbox
const MOCK_INVENTORY = [
  { id: 'SKU-8829-A', name: 'AI Core Processor', stock: 45, bin: 'A-12', status: 'In Stock' },
  { id: 'SKU-4102-B', name: 'Optic Fiber Transceiver', stock: 120, bin: 'B-04', status: 'In Stock' },
  { id: 'SKU-9938-C', name: 'IoT Sensor Nodes', stock: 8, bin: 'C-09', status: 'Low Stock' },
]

export default function App() {
  // Navigation active state
  const [activeSection, setActiveSection] = useState('home')

  // AccuRack Sandbox State
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'querying' | 'success'>('idle')
  const [scannedItem, setScannedItem] = useState<typeof MOCK_INVENTORY[0] | null>(null)
  const [mockDb, setMockDb] = useState(MOCK_INVENTORY)
  const [scanLog, setScanLog] = useState<string[]>([])

  // Teach.ai Sandbox State
  const [phoneInput, setPhoneInput] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('+92')
  const [subjectsText, setSubjectsText] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordLevel, setPasswordLevel] = useState('—')
  const [isFormValid, setIsFormValid] = useState(false)
  const [payloadPreview, setPayloadPreview] = useState<any>(null)

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'work', 'experience', 'skills', 'contact']
      const scrollPos = window.scrollY + 200

      for (const section of sections) {
        const el = document.getElementById(section)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section)
            break;
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // AccuRack: Simulate Barcode Scan
  const handleSimulateScan = (skuId: string) => {
    setScanState('scanning')
    setScannedItem(null)
    const logMsg = `[Scanner] Lasers active. Reading barcode for ${skuId}...`
    setScanLog(prev => [logMsg, ...prev])

    setTimeout(() => {
      setScanState('querying')
      setScanLog(prev => [`[Database] API Route invoked. Query: SELECT * FROM items WHERE sku_id = '${skuId}'`, ...prev])

      setTimeout(() => {
        const item = mockDb.find(i => i.id === skuId)
        if (item) {
          // Increment scan log
          setScanLog(prev => [
            `[API] 200 OK. Item Found: "${item.name}" at Bin ${item.bin}. Deducting 1 from stock.`,
            ...prev
          ])
          // Deduct stock in mock DB
          setMockDb(prevDb => prevDb.map(i => i.id === skuId ? { ...i, stock: Math.max(0, i.stock - 1) } : i))
          setScannedItem({ ...item, stock: Math.max(0, item.stock - 1) })
          setScanState('success')
        }
      }, 1000)
    }, 1000)
  }

  // Reset AccuRack Sandbox
  const handleResetScan = () => {
    setScanState('idle')
    setScannedItem(null)
    setMockDb(MOCK_INVENTORY)
    setScanLog([])
  }

  // Teach.ai: Handle password evaluation
  useEffect(() => {
    if (passwordInput.length === 0) {
      setPasswordLevel('—')
      return
    }
    let score = 0
    if (passwordInput.length >= 8) score++
    if (/[A-Z]/.test(passwordInput)) score++
    if (/[0-9]/.test(passwordInput)) score++
    if (/[^A-Za-z0-9]/.test(passwordInput)) score++

    if (score <= 1) setPasswordLevel('Weak')
    else if (score === 2) setPasswordLevel('Fair')
    else if (score === 3) setPasswordLevel('Good')
    else setPasswordLevel('Strong')
  }, [passwordInput])

  // Teach.ai: Generate Form Payload Preview
  useEffect(() => {
    const isValid = phoneInput.trim().length >= 7 && passwordInput.length >= 8 && subjectsText.trim().length > 0
    setIsFormValid(isValid)

    if (isValid) {
      setPayloadPreview({
        fullName: "Waris Ghazi (Demo Guest)",
        phone: `${selectedCountry} ${phoneInput.trim()}`,
        subjects: subjectsText.split(',').map(s => s.trim().toLowerCase()).filter(Boolean),
        passwordHash: "$argon2id$v=19$m=65536,t=3,p=4$c2FsdHNhbHQ$..." // Signal hashing strength
      })
    } else {
      setPayloadPreview(null)
    }
  }, [phoneInput, selectedCountry, subjectsText, passwordInput])

  return (
    <>
      {/* Background Orbs */}
      <div className="glow-orb orb-violet"></div>
      <div className="glow-orb orb-cyan"></div>

      {/* Sticky Header */}
      <header className="main-header glass">
        <div className="container header-container">
          {/* Logo */}
          <a href="#home" className="logo">
            <span>Waris.</span>
            <span className="text-gradient">dev</span>
            <span className="logo-dot"></span>
          </a>

          {/* Navigation Links */}
          <nav className="nav-links">
            <a href="#home" className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}>About</a>
            <a href="#work" className={`nav-link ${activeSection === 'work' ? 'active' : ''}`}>Case Studies</a>
            <a href="#experience" className={`nav-link ${activeSection === 'experience' ? 'active' : ''}`}>Experience</a>
            <a href="#skills" className={`nav-link ${activeSection === 'skills' ? 'active' : ''}`}>Skills</a>
            <a href="#contact" className="btn btn-secondary nav-btn">Let's Talk</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="section-padding" style={{ position: 'relative' }}>
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div className="hero-content">
            <span className="badge active" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Full-Stack Developer & SDET
            </span>
            <h1 className="text-gradient-white">
              Building Web Apps <br />
              <span className="text-gradient">From Concept</span> <br />
              To Production.
            </h1>
            <p style={{ maxWidth: '540px', fontSize: '1.125rem', lineHeight: '1.7' }}>
              I am a product-focused engineer specializing in creating responsive frontends, highly optimized backend APIs, and resilient data layers. With 4+ years of hands-on experience, I bridge the gap between rapid product prototyping and strict production-level quality.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '8px' }}>
              <a href="#work" className="btn btn-primary">
                Explore Case Studies
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>
              <a href="#contact" className="btn btn-secondary">
                Get In Touch
              </a>
            </div>

            {/* Quick Tech Badge Indicator */}
            <div style={{ marginTop: '24px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '12px', fontWeight: 500 }}>
                BATTLE-TESTED CORE ARSENAL
              </span>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <span className="badge">TypeScript</span>
                <span className="badge">React / Next.js</span>
                <span className="badge">Node.js</span>
                <span className="badge">PostgreSQL</span>
                <span className="badge">Tailwind CSS</span>
                <span className="badge">Docker</span>
              </div>
            </div>
          </div>

          {/* Right Side Decorative Card */}
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div className="card glass" style={{
              width: '100%',
              maxWidth: '450px',
              padding: '2rem',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-glow-violet)',
              border: '1px solid rgba(138, 75, 241, 0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }}></span>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }}></span>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }}></span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>production_metrics.json</span>
              </div>

              <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <p style={{ color: 'var(--accent-cyan)' }}>// Professional Summary</p>
                <p style={{ marginTop: '8px' }}><span style={{ color: 'var(--accent-violet)' }}>const</span> developer = &#123;</p>
                <p style={{ paddingLeft: '16px' }}>name: <span style={{ color: 'var(--accent-cyan)' }}>'Abdulwaris Ghazi'</span>,</p>
                <p style={{ paddingLeft: '16px' }}>experience: <span style={{ color: 'var(--accent-cyan)' }}>'4+ Years'</span>,</p>
                <p style={{ paddingLeft: '16px' }}>philosophy: <span style={{ color: 'var(--accent-cyan)' }}>'Architect for the worst case, code for the user'</span>,</p>
                <p style={{ paddingLeft: '16px' }}>specialization: [</p>
                <p style={{ paddingLeft: '32px' }}><span style={{ color: 'var(--accent-cyan)' }}>'Scalable Inventory Logistics'</span>,</p>
                <p style={{ paddingLeft: '32px' }}><span style={{ color: 'var(--accent-cyan)' }}>'Multi-tenant LMS Systems'</span>,</p>
                <p style={{ paddingLeft: '32px' }}><span style={{ color: 'var(--accent-cyan)' }}>'High-Performance UI Modules'</span></p>
                <p style={{ paddingLeft: '16px' }}>]</p>
                <p>&#125;;</p>

                <div style={{
                  marginTop: '1.5rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>COMPLETED PROJECTS</span>
                    <strong style={{ fontSize: '1.5rem', color: '#ffffff', fontFamily: 'var(--font-display)' }}>12+</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>API UPTIME METRIC</span>
                    <strong style={{ fontSize: '1.5rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-display)' }}>99.98%</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section id="work" className="section-padding" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="badge cyan">CASE STUDIES</span>
            <h2 className="text-gradient-white" style={{ marginTop: '8px' }}>Architectural Case Studies</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto' }}>
              Deep-dives into actual full-stack projects built from the ground up, highlighting problems, solutions, and live technology interactive previews.
            </p>
          </div>

          <div className="grid-2">
            {/* Case Study 1: AccuRack */}
            <div className="card" style={{ background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div>
                <span className="badge success">LOGISTICS & SDET</span>
                <h3 style={{ marginTop: '12px', fontSize: '1.5rem' }}>AccuRack: Warehouse Inventory & Scan Control</h3>
                
                <div className="tags">
                  <span className="badge">Node.js</span>
                  <span className="badge">Express</span>
                  <span className="badge">PostgreSQL</span>
                  <span className="badge">Tailwind</span>
                  <span className="badge">Docker</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--accent-violet)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Context
                    </strong>
                    <p style={{ fontSize: '0.95rem', marginTop: '4px' }}>
                      Standard warehouse inventory systems break when barcode scanners trigger duplicate REST API payloads or suffer from heavy database query roundtrips under high volumes.
                    </p>
                  </div>

                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--accent-violet)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Action
                    </strong>
                    <p style={{ fontSize: '0.95rem', marginTop: '4px' }}>
                      Designed a debounced transactional workflow on the API. Consolidated inventory query lookups using optimized PostgreSQL indices and LEFT JOINs, and verified concurrency handling via automated E2E tests.
                    </p>
                  </div>

                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--accent-violet)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Result
                    </strong>
                    <p style={{ fontSize: '0.95rem', marginTop: '4px' }}>
                      Reduced inventory synchronization lag to sub-100ms and achieved 100% database transaction safety even in high-frequency concurrent scan environments.
                    </p>
                  </div>
                </div>
              </div>

              {/* AccuRack Sandbox Demo */}
              <div style={{
                marginTop: 'auto',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    SANDBOX: BARCODE SCANNER LOGIC
                  </span>
                  <button onClick={handleResetScan} className="btn-link" style={{ fontSize: '0.75rem' }}>Reset</button>
                </div>

                {/* Stock Table */}
                <div style={{ fontSize: '0.8rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', paddingBottom: '0.25rem', borderBottom: '1px solid var(--border-color)', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                    <span>SKU Code</span>
                    <span>Item Name</span>
                    <span style={{ textAlign: 'right' }}>Stock</span>
                  </div>
                  {mockDb.map(item => (
                    <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', paddingTop: '0.25rem', paddingBottom: '0.25rem', borderBottom: '1px dotted var(--border-color)' }}>
                      <span style={{ fontFamily: 'monospace' }}>{item.id}</span>
                      <span>{item.name}</span>
                      <span style={{ textAlign: 'right', color: item.stock <= 10 ? 'var(--accent-violet)' : 'var(--accent-emerald)', fontWeight: 'bold' }}>
                        {item.stock}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Scan Simulator Actions */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
                  {mockDb.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleSimulateScan(item.id)}
                      disabled={scanState !== 'idle' || item.stock === 0}
                      className="btn btn-secondary"
                      style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem', flex: 1 }}
                    >
                      Scan {item.id.split('-')[1]}
                    </button>
                  ))}
                </div>

                {/* Logs Terminal */}
                <div style={{
                  background: '#04060a',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.75rem',
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  height: '100px',
                  overflowY: 'auto',
                  border: '1px solid var(--border-color)'
                }}>
                  {scanState === 'idle' && <span style={{ color: 'var(--text-muted)' }}>// Select an item above to trigger barcode read simulation</span>}
                  
                  {scanState === 'scanning' && (
                    <div style={{ color: 'var(--accent-violet)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className="loading-spinner" style={{ width: '10px', height: '10px', border: '2px solid var(--accent-violet)', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
                      Scanning barcode barcode lasers...
                    </div>
                  )}

                  {scanState === 'querying' && (
                    <div style={{ color: 'var(--accent-cyan)' }}>
                      Querying PostgreSQL inventory tables...
                    </div>
                  )}

                  {scanLog.map((log, idx) => (
                    <div key={idx} style={{
                      color: log.startsWith('[API]') ? 'var(--accent-emerald)' : log.startsWith('[Database]') ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                      marginBottom: '4px'
                    }}>
                      {log}
                    </div>
                  ))}
                </div>
                {/* Last Scanned Item Banner */}
                {scannedItem && (
                  <div style={{
                    marginTop: '0.75rem',
                    padding: '0.5rem 0.75rem',
                    background: 'var(--accent-emerald-glow)',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.75rem'
                  }}>
                    <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>Last Scanned: {scannedItem.name}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>Stock: <strong style={{ color: '#ffffff' }}>{scannedItem.stock}</strong></span>
                  </div>
                )}
              </div>
            </div>

            {/* Case Study 2: Teach.ai */}
            <div className="card" style={{ background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div>
                <span className="badge cyan">LMS PLATFORM</span>
                <h3 style={{ marginTop: '12px', fontSize: '1.5rem' }}>Teach.ai: Multi-Tenant Tutor Registration Onboarding</h3>
                
                <div className="tags">
                  <span className="badge">Next.js</span>
                  <span className="badge">TypeScript</span>
                  <span className="badge">Firebase</span>
                  <span className="badge">REST Countries API</span>
                  <span className="badge">CSS Variables</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--accent-violet)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Context
                    </strong>
                    <p style={{ fontSize: '0.95rem', marginTop: '4px' }}>
                      Onboarding is the highest friction point in educator software. Bad validation, broken country calling codes, or weak UI responses result in drop-offs during signup.
                    </p>
                  </div>

                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--accent-violet)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Action
                    </strong>
                    <p style={{ fontSize: '0.95rem', marginTop: '4px' }}>
                      Built an atomic, state-driven registration page with dynamic country code selection (using Rest Countries data), searchable multi-select fields, and localized error feedback loops.
                    </p>
                  </div>

                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--accent-violet)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Result
                    </strong>
                    <p style={{ fontSize: '0.95rem', marginTop: '4px' }}>
                      Created a validated interface showcasing clean, decoupled styling and reactive schema structures, with secure password validation mechanisms.
                    </p>
                  </div>
                </div>
              </div>

              {/* Teach.ai Onboarding Sandbox */}
              <div style={{
                marginTop: 'auto',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem'
              }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '1rem' }}>
                  SANDBOX: REGISTRATION VALIDATOR & API PAYLOAD
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Phone Input Row */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select
                      value={selectedCountry}
                      onChange={e => setSelectedCountry(e.target.value)}
                      style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        color: '#ffffff',
                        padding: '0.35rem 0.5rem',
                        fontSize: '0.8rem'
                      }}
                    >
                      <option value="+92">+92 (PK)</option>
                      <option value="+1">+1 (US)</option>
                      <option value="+44">+44 (UK)</option>
                      <option value="+91">+91 (IN)</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Phone (e.g., 3322413277)"
                      value={phoneInput}
                      onChange={e => setPhoneInput(e.target.value.replace(/\D/g, ''))}
                      style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        color: '#ffffff',
                        padding: '0.35rem 0.5rem',
                        fontSize: '0.8rem',
                        flex: 1
                      }}
                    />
                  </div>

                  {/* Multi-Select Mock Input */}
                  <input
                    type="text"
                    placeholder="Subjects Taught (comma separated)"
                    value={subjectsText}
                    onChange={e => setSubjectsText(e.target.value)}
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#ffffff',
                      padding: '0.35rem 0.5rem',
                      fontSize: '0.8rem'
                    }}
                  />

                  {/* Password Input Row */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <input
                      type="password"
                      placeholder="Create Password"
                      value={passwordInput}
                      onChange={e => setPasswordInput(e.target.value)}
                      style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        color: '#ffffff',
                        padding: '0.35rem 0.5rem',
                        fontSize: '0.8rem'
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Heuristics Strength Indicator</span>
                      <strong style={{
                        color: passwordLevel === 'Strong' ? 'var(--accent-emerald)' : passwordLevel === 'Good' ? 'var(--accent-cyan)' : passwordLevel === 'Weak' ? 'var(--accent-violet)' : 'var(--text-muted)'
                      }}>{passwordLevel}</strong>
                    </div>
                  </div>

                  {/* Payload Terminal */}
                  <div style={{
                    background: '#04060a',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.75rem',
                    fontFamily: 'monospace',
                    fontSize: '0.7rem',
                    height: '110px',
                    overflowY: 'auto',
                    border: '1px solid var(--border-color)',
                    marginTop: '4px'
                  }}>
                    {!isFormValid ? (
                      <span style={{ color: 'var(--text-muted)' }}>
                        // Fill all fields to generate the encrypted registration API payload preview
                      </span>
                    ) : (
                      <pre style={{ color: 'var(--accent-emerald)', margin: 0 }}>
                        {JSON.stringify(payloadPreview, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="section-padding">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="badge active">TIMELINE</span>
            <h2 className="text-gradient-white" style={{ marginTop: '8px' }}>Professional Milestones</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto' }}>
              A record of scaling products, optimizing systems, and delivering user-focused software at early-stage startups and enterprise ventures.
            </p>
          </div>

          <div className="timeline-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Innova 360 */}
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-header">
                <div>
                  <span className="timeline-company">Innova 360</span>
                  <span style={{ marginLeft: '12px' }} className="badge success">Enterprise Full Stack</span>
                </div>
                <span className="timeline-date">May 2025 – Dec 2025</span>
              </div>
              <div className="timeline-role" style={{ marginBottom: '12px' }}>Full Stack Developer</div>
              
              <ul className="timeline-bullets">
                <li>Collaborated on building responsive, high-fidelity UI components in React and Tailwind for AI-powered enterprise applications.</li>
                <li>Integrated secured REST API endpoints with robust frontends under challenging sprint goals, improving responsiveness.</li>
                <li>Contributed core feature development and bug resolution to the AccuRack inventory system and job portal utilities.</li>
                <li>Participated in daily stand-ups, code reviews, and Agile release flows maintaining high standards of testing and system quality.</li>
              </ul>
              <div style={{ marginTop: '12px' }}>
                <Link to="/experience/innova-360" className="btn btn-secondary">View More</Link>
              </div>
            </div>

            {/* Freelance Work */}
            <div className="timeline-item" style={{ paddingBottom: 0 }}>
              <div className="timeline-dot"></div>
              <div className="timeline-header">
                <div>
                  <span className="timeline-company">Freelance Product Engineering</span>
                  <span style={{ marginLeft: '12px' }} className="badge cyan">Remote / Global</span>
                </div>
                <span className="timeline-date">Jun 2021 – May 2025</span>
              </div>
              <div className="timeline-role" style={{ marginBottom: '12px' }}>Full Stack Engineer & Consultant</div>
              
              <ul className="timeline-bullets">
                <li>Designed, developed, and deployed custom end-to-end web applications (LMS systems, blogging backends, and custom e-commerce engines).</li>
                <li>Engineered scalable APIs in Node/Express and Next.js utilizing Firebase and SQL relational databases.</li>
                <li>Implemented barcode scan integrations, PDF generation tools, and reporting dashboards based on client requirements.</li>
                <li>Utilized AI-accelerated workflows to decrease MVP prototyping time by up to 50%, maintaining production-level code compliance.</li>
              </ul>
              <div style={{ marginTop: '12px' }}>
                <Link to="/experience/freelance-work" className="btn btn-secondary">View More</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section-padding" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="badge active">ARSENAL</span>
            <h2 className="text-gradient-white" style={{ marginTop: '8px' }}>Technical Capabilities</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto' }}>
              My structured stack, tailored for high productivity, responsiveness, and resilient system integration.
            </p>
          </div>

          <div className="grid-3" style={{ gap: '2rem' }}>
            {/* Frontend Skills */}
            <div className="card glass">
              <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 3 19 21 5 21"></polygon><line x1="9" y1="7" x2="15" y2="7"></line><line x1="9" y1="11" x2="15" y2="11"></line><line x1="9" y1="15" x2="13" y2="15"></line></svg>
                Frontend Architecture
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span className="badge active">React.js</span>
                <span className="badge active">Next.js</span>
                <span className="badge active">React Native</span>
                <span className="badge">TypeScript</span>
                <span className="badge">JavaScript (ES6+)</span>
                <span className="badge">Tailwind CSS</span>
                <span className="badge">HTML5 / CSS3</span>
              </div>
            </div>

            {/* Backend Skills */}
            <div className="card glass">
              <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-violet)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
                Backend & Systems
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span className="badge active">Node.js</span>
                <span className="badge active">Express.js</span>
                <span className="badge active">NestJS</span>
                <span className="badge">RESTful APIs</span>
                <span className="badge">JWT & OAuth</span>
                <span className="badge">API Security Protocols</span>
              </div>
            </div>

            {/* Database & Tools */}
            <div className="card glass">
              <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-emerald)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"></path></svg>
                Database & Operations
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span className="badge active">PostgreSQL</span>
                <span className="badge active">MongoDB</span>
                <span className="badge">SQL Queries</span>
                <span className="badge">Git / GitHub</span>
                <span className="badge">Docker Containers</span>
                <span className="badge">GitHub Actions</span>
                <span className="badge">Agile / Scrum</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding" style={{ position: 'relative' }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <span className="badge active">GET IN TOUCH</span>
          <h2 className="text-gradient-white" style={{ marginTop: '12px', fontSize: '2.5rem' }}>Let's Build Something High-Impact</h2>
          <p style={{ marginTop: '16px', fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '32px' }}>
            I am currently open to new opportunities, freelance contract systems, or core development roles where technical excellence and robust execution are prioritized.
          </p>

          {/* Social CTAs */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            marginBottom: '40px'
          }}>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=a.warisghazi.work@gmail.com" target="_blank" rel="noreferrer noopener" className="btn btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              Email Me
            </a>
            <a href="https://linkedin.com/in/abdul-waris-ghazi-83b134252/" target="_blank" rel="noreferrer" className="btn btn-secondary">
              LinkedIn Profile
            </a>
            <a href="https://github.com/wariswebdev" target="_blank" rel="noreferrer" className="btn btn-secondary">
              GitHub Repositories
            </a>
          </div>

          {/* Inline Email indicator */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.5rem 1rem',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            fontSize: '0.85rem',
            fontFamily: 'monospace'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-emerald)', animation: 'pulse 2s infinite' }}></span>
            Available for remote projects globally
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '2rem 0', background: 'var(--bg-secondary)' }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.9rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} Abdulwaris Ghazi. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="https://abdulwaris-portfolio.web.app/" target="_blank" rel="noreferrer" className="btn-link" style={{ textDecoration: 'none' }}>Live Site</a>
            <span>•</span>
            <a href="#home" className="btn-link" style={{ textDecoration: 'none' }}>Back to top</a>
          </div>
        </div>
      </footer>
    </>
  )
}
