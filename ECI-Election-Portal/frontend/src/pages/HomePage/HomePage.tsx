import { useState } from 'react';
import {
  UserPlus, MapPin, BarChart3, Users, FileText,
  CheckCircle, Shield, BookOpen, ClipboardList, Vote,
  ArrowRight, Search, Calendar, AlertCircle, Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { INDIAN_STATES } from '../../constants/states';
import ElectionEducation from './ElectionEducation';
import './HomePage.css';

/* ── Election Stats ─────────────────────────────────────────────────────── */
const HERO_STATS = [
  { label: 'Registered Voters', value: '1.2B+', color: 'var(--eci-saffron)' },
  { label: 'Constituencies', value: '543', color: 'var(--cds-button-primary)' },
  { label: 'Candidate Profiles', value: '10.5M+', color: 'var(--eci-green)' },
  { label: 'Election Phases', value: '5', color: 'var(--eci-saffron)' },
];

const QUICK_ACTIONS = [
  { icon: UserPlus, label: 'Register to Vote', desc: 'New voter registration', path: '/register', color: 'var(--eci-saffron)' },
  { icon: MapPin, label: 'Find Your Booth', desc: 'Locate polling station', path: '/constituency', color: 'var(--eci-green)' },
  { icon: BarChart3, label: 'Election Results', desc: 'Live result updates', path: '/results', color: 'var(--cds-button-primary)' },
  { icon: Users, label: 'Know Candidates', desc: 'Candidate profiles', path: '/candidates', color: 'var(--eci-navy)' },
];

const VOTER_SERVICES = [
  { icon: FileText, title: 'Voter ID Services', desc: 'Apply for new voter ID, corrections, or transposition', pills: ['Form 6', 'Form 7', 'Form 8'], color: 'saffron' },
  { icon: CheckCircle, title: 'Verify Registration', desc: 'Check your name in the electoral roll using EPIC number', pills: ['EPIC Search', 'Name Search'], color: 'green' },
  { icon: Shield, title: 'Report Violation', desc: 'File complaints about electoral malpractice via cVIGIL', pills: ['MCC Violation', 'Bribery'], color: 'red' },
  { icon: BookOpen, title: 'Election Education', desc: 'Learn about your rights, the process, and how to vote', pills: ['Your Rights', 'How to Vote'], color: 'blue' },
  { icon: ClipboardList, title: 'Track Grievance', desc: 'Track the status of your filed complaint with ticket ID', pills: ['Status Check'], color: 'navy' },
  { icon: Vote, title: 'Overseas Voting', desc: 'Information for NRI voters and overseas registration', pills: ['NRI Voters', 'Form 6A'], color: 'saffron' },
];

const PHASES = [
  { phase: 1, date: 'April 10, 2026', states: 'Bihar (6), Manipur (2), Rajasthan (12)', seats: 20, status: 'completed' },
  { phase: 2, date: 'April 17, 2026', states: 'Karnataka (14), Maharashtra (10), UP (8)', seats: 32, status: 'completed' },
  { phase: 3, date: 'April 24, 2026', states: 'Gujarat (26), Madhya Pradesh (6), Assam (4)', seats: 36, status: 'active' },
  { phase: 4, date: 'May 1, 2026', states: 'West Bengal (8), Tamil Nadu (39), Kerala (20)', seats: 67, status: 'upcoming' },
  { phase: 5, date: 'May 8, 2026', states: 'Delhi (7), Punjab (13), Haryana (10)', seats: 30, status: 'upcoming' },
];

const TIMELINE_STEPS = [
  { title: 'Election Announced', desc: 'Model Code of Conduct comes into effect', status: 'done' },
  { title: 'Nominations Filed', desc: 'Candidates file papers with Returning Officer', status: 'done' },
  { title: 'Campaigning', desc: 'Political campaigning by parties and candidates', status: 'active' },
  { title: 'Polling Day', desc: 'Voters cast their ballots at designated booths', status: 'upcoming' },
  { title: 'Counting & Results', desc: 'Votes counted and results declared constituency-wise', status: 'upcoming' },
];

const VOTE_STEPS = [
  { step: 1, title: 'Carry your Voter ID', desc: 'Bring your EPIC card or any approved photo ID to the polling station' },
  { step: 2, title: 'Get inked & receive slip', desc: 'The presiding officer will mark your finger with indelible ink and issue a ballot slip' },
  { step: 3, title: 'Cast your vote', desc: 'Press the button on the EVM next to your chosen candidate. Verify on the VVPAT slip.' },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('timeline');
  const [searchTab, setSearchTab] = useState<'epic' | 'details'>('epic');
  const [epicNumber, setEpicNumber] = useState('');
  const [searchState, setSearchState] = useState('');
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* ── Notification Band ──────────────────────────────────────────── */}
      <div className="phase-banner-home animate-slide-up">
        <div className="container">
          <div className="phase-banner__content">
            <span className="phase-tag">LIVE PHASE 3</span>
            <span className="phase-text">
              <strong>Phase 3 Polling:</strong> Voting for 36 constituencies on April 24, 2026. 
              Check your booth location.
            </span>
            <a href="/constituency" className="phase-link">Find your booth →</a>
          </div>
        </div>
      </div>



      {/* ── Hero Section ───────────────────────────────────────────────── */}
      <section className="hero section--dark">
        <div className="container">
          <div className="hero__grid">
            <div className="hero__content animate-fade-in">
              <span className="hero__eyebrow text-label">भारत निर्वाचन — GENERAL ELECTIONS 2026</span>
              <h1 className="hero__title text-display">
                Your Vote.<br />
                Your <span className="hero__accent">Democracy.</span>
              </h1>
              <p className="hero__subtitle">
                India's authoritative platform for voter services, election data,
                AI-powered civic Q&A, and real-time results for 1.2B+ eligible voters.
              </p>
              <div className="hero__actions">
                <button className="btn btn--saffron" onClick={() => navigate('/register')}>
                  <UserPlus size={18} /> Register to Vote
                </button>
                <button className="btn btn--ghost" style={{ color: '#fff' }} onClick={() => navigate('/verify')}>
                  <Search size={18} /> Verify Registration
                </button>
              </div>
            </div>

            <div className="hero__stats stagger">
              {HERO_STATS.map(stat => (
                <div key={stat.label} className="hero__stat animate-slide-up">
                  <span className="hero__stat-value text-mono" style={{ color: stat.color }}>
                    {stat.value}
                  </span>
                  <span className="hero__stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick Actions ──────────────────────────────────────────────── */}
      <section className="quick-actions">
        <div className="container">
          <div className="quick-actions__grid grid grid--4 stagger">
            {QUICK_ACTIONS.map((action, idx) => (
              <a 
                key={action.label} 
                href={action.path} 
                className="quick-action tile tile--clickable stagger-item" 
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="quick-action__icon" style={{ color: action.color }}>
                  <action.icon size={24} />
                </div>
                <div className="quick-action__text">
                  <span className="quick-action__label">{action.label}</span>
                  <span className="quick-action__desc">{action.desc}</span>
                </div>
                <ArrowRight size={16} className="quick-action__arrow" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Scale & Reach ────────────────────────────────────────────────── */}
      <section className="section--light section">
        <div className="container">
          <div className="hero__grid" style={{ alignItems: 'center' }}>
            <div className="animate-fade-in">
              <h2 className="text-heading-01">Digital Infrastructure at Scale</h2>
              <p className="services__subtitle" style={{ maxWidth: '600px' }}>
                Leveraging high-performance database indexing and server-side virtualization to provide instant access to 10,500+ candidate records, 543 constituencies, and real-time turnout analytics across all 36 States and Union Territories.
              </p>
              <div style={{ marginTop: 'var(--spacing-07)' }}>
                <a href="/candidates" className="btn btn--primary">
                  Explore Candidate Directory <ArrowRight size={18} style={{ marginLeft: 8 }} />
                </a>
              </div>
            </div>
            <div className="grid grid--2" style={{ gap: 'var(--spacing-05)' }}>
              <div className="tile tile--saffron" style={{ padding: 'var(--spacing-06)', borderLeft: '4px solid var(--eci-saffron)' }}>
                <div className="text-display" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>1.2B+</div>
                <div className="text-label" style={{ fontWeight: 600 }}>REGISTERED VOTERS</div>
              </div>
              <div className="tile tile--green" style={{ padding: 'var(--spacing-06)', borderLeft: '4px solid var(--eci-green)' }}>
                <div className="text-display" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>10.5M+</div>
                <div className="text-label" style={{ fontWeight: 600 }}>CANDIDATES ANALYZED</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Election Education Assistant ────────────────────────────────── */}
      <ElectionEducation />

      {/* ── Voter Services ─────────────────────────────────────────────── */}
      <section className="services section">
        <div className="container">
          <div className="services__header">
            <h2 className="text-heading-01">Voter Services</h2>
            <p className="services__subtitle">Everything you need for a seamless voting experience</p>
          </div>
          <div className="grid grid--3 stagger" style={{ gap: '1px' }}>
            {VOTER_SERVICES.map((service, idx) => (
              <div 
                key={service.title} 
                className="service-tile tile tile--clickable stagger-item" 
                style={{ animationDelay: `${idx * 40}ms` }}
                onClick={() => {
                  if (service.title === 'Voter ID Services') navigate('/register');
                  if (service.title === 'Verify Registration') navigate('/verify');
                }}
              >
                <div className="service-tile__icon" style={{ color: `var(--eci-${service.color === 'blue' ? 'navy' : service.color === 'red' ? 'saffron' : service.color})` }}>
                  <service.icon size={24} />
                </div>
                <h3 className="service-tile__title text-heading-03">{service.title}</h3>
                <p className="service-tile__desc">{service.desc}</p>
                <div className="service-tile__pills">
                  {service.pills.map(pill => (
                    <span key={pill} className={`pill pill--${service.color === 'red' ? 'red' : service.color === 'blue' ? 'blue' : service.color === 'navy' ? 'navy' : service.color}`}>
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Registration Search ────────────────────────────────────────── */}
      <section className="search-section section--dark section">
        <div className="container">
          <div className="search-section__inner">
            <div className="search-section__header">
              <h2 className="text-heading-01" style={{ color: 'var(--cds-text-on-dark)' }}>
                Search Electoral Roll
              </h2>
              <p style={{ color: 'var(--cds-text-placeholder)' }}>
                Verify your voter registration status using your EPIC number or personal details
              </p>
            </div>

            <div className="tabs" style={{ borderColor: '#393939' }}>
              <button
                className={`tab ${searchTab === 'epic' ? 'tab--active' : ''}`}
                onClick={() => setSearchTab('epic')}
                style={{ color: searchTab === 'epic' ? '#fff' : 'var(--cds-text-placeholder)' }}
              >
                Search by EPIC Number
              </button>
              <button
                className={`tab ${searchTab === 'details' ? 'tab--active' : ''}`}
                onClick={() => setSearchTab('details')}
                style={{ color: searchTab === 'details' ? '#fff' : 'var(--cds-text-placeholder)' }}
              >
                Search by Personal Details
              </button>
            </div>

            <div className="search-form">
              {searchTab === 'epic' ? (
                <div className="search-form__row">
                  <div className="form-group" style={{ flex: 2 }}>
                    <label className="form-label" style={{ color: 'var(--cds-text-placeholder)' }}>EPIC Number</label>
                    <input
                      className="form-input form-input--dark"
                      placeholder="Enter your 10-character EPIC number"
                      value={epicNumber}
                      onChange={e => setEpicNumber(e.target.value)}
                      maxLength={10}
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label" style={{ color: 'var(--cds-text-placeholder)' }}>State</label>
                    <select className="form-select form-input--dark" value={searchState} onChange={e => setSearchState(e.target.value)}>
                      <option value="">Select State</option>
                      {INDIAN_STATES.map(state => (
                        <option key={state} value={state.toLowerCase().replace(/\s+/g, '')}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button className="btn btn--primary search-form__btn">
                    <Search size={18} /> Search
                  </button>
                </div>
              ) : (
                <div className="search-form__details">
                  <div className="search-form__row">
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label" style={{ color: 'var(--cds-text-placeholder)' }}>Full Name</label>
                      <input className="form-input form-input--dark" placeholder="Enter your full name" />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label" style={{ color: 'var(--cds-text-placeholder)' }}>Father's / Husband's Name</label>
                      <input className="form-input form-input--dark" placeholder="Enter relative's name" />
                    </div>
                  </div>
                  <div className="search-form__row">
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label" style={{ color: 'var(--cds-text-placeholder)' }}>Age</label>
                      <input className="form-input form-input--dark" placeholder="e.g. 25" type="number" />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label" style={{ color: 'var(--cds-text-placeholder)' }}>Gender</label>
                      <select className="form-select form-input--dark">
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label" style={{ color: 'var(--cds-text-placeholder)' }}>State</label>
                      <select className="form-select form-input--dark">
                        <option value="">Select State</option>
                        {INDIAN_STATES.map(state => (
                          <option key={state} value={state.toLowerCase().replace(/\s+/g, '')}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button className="btn btn--primary">
                    <Search size={18} /> Search Electoral Roll
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Election Process Education ─────────────────────────────────── */}
      <section className="education section">
        <div className="container">
          <div className="services__header">
            <h2 className="text-heading-01">Understanding the Election Process</h2>
            <p className="services__subtitle">Learn how India's democratic process works</p>
          </div>

          <div className="tabs">
            <button className={`tab ${activeTab === 'timeline' ? 'tab--active' : ''}`} onClick={() => setActiveTab('timeline')}>
              <Calendar size={14} style={{ marginRight: 6 }} /> Election Timeline
            </button>
            <button className={`tab ${activeTab === 'howtovote' ? 'tab--active' : ''}`} onClick={() => setActiveTab('howtovote')}>
              <Vote size={14} style={{ marginRight: 6 }} /> How to Vote
            </button>
            <button className={`tab ${activeTab === 'rights' ? 'tab--active' : ''}`} onClick={() => setActiveTab('rights')}>
              <Shield size={14} style={{ marginRight: 6 }} /> Your Rights
            </button>
            <button className={`tab ${activeTab === 'schedule' ? 'tab--active' : ''}`} onClick={() => setActiveTab('schedule')}>
              <ClipboardList size={14} style={{ marginRight: 6 }} /> 2026 Schedule
            </button>
          </div>

          <div className="education__content">
            {activeTab === 'timeline' && (
              <div className="education__timeline stagger">
                {TIMELINE_STEPS.map((step, i) => (
                  <div key={i} className="timeline-card animate-fade-in">
                    <div className={`timeline-card__indicator timeline-card__indicator--${step.status}`}>
                      {step.status === 'done' && <CheckCircle size={18} />}
                      {step.status === 'active' && <AlertCircle size={18} />}
                      {step.status === 'upcoming' && <span className="timeline-card__number">{i + 1}</span>}
                    </div>
                    <div className="timeline-card__content">
                      <h3 className="timeline-card__title">{step.title}</h3>
                      <p className="timeline-card__desc">{step.desc}</p>
                    </div>
                    <span className={`pill pill--${step.status === 'done' ? 'green' : step.status === 'active' ? 'blue' : 'gray'}`}>
                      {step.status === 'done' ? 'Completed' : step.status === 'active' ? 'In Progress' : 'Upcoming'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'howtovote' && (
              <div className="grid grid--3" style={{ gap: 'var(--spacing-05)' }}>
                {VOTE_STEPS.map(step => (
                  <div key={step.step} className="vote-step tile animate-fade-in">
                    <div className="vote-step__number">{step.step}</div>
                    <h3 className="vote-step__title text-heading-03">{step.title}</h3>
                    <p className="vote-step__desc">{step.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'rights' && (
              <div className="rights animate-fade-in">
                <div className="rights__grid grid grid--2" style={{ gap: 'var(--spacing-05)' }}>
                  {[
                    { title: 'Right to Vote', desc: 'Every citizen above 18 years has the right to vote regardless of caste, creed, religion, or gender.' },
                    { title: 'Secret Ballot', desc: 'Your vote is secret. No one can ask you to reveal who you voted for.' },
                    { title: 'Free & Fair Elections', desc: 'ECI ensures elections are conducted without fear, intimidation, or undue influence.' },
                    { title: 'Right to Information', desc: 'You can access candidate affidavits, criminal records, and asset declarations.' },
                    { title: 'Grievance Redressal', desc: 'File complaints about electoral malpractice through cVIGIL or the grievance portal.' },
                    { title: 'NOTA Option', desc: 'You have the right to reject all candidates using the None Of The Above (NOTA) option.' },
                  ].map(right => (
                    <div key={right.title} className="tile" style={{ padding: 'var(--spacing-06)' }}>
                      <h3 className="text-heading-03" style={{ marginBottom: 'var(--spacing-03)' }}>{right.title}</h3>
                      <p style={{ color: 'var(--cds-text-secondary)' }}>{right.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="animate-fade-in">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Phase</th>
                      <th>Polling Date</th>
                      <th>States / Constituencies</th>
                      <th>Seats</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PHASES.map(phase => (
                      <tr key={phase.phase}>
                        <td><strong>Phase {phase.phase}</strong></td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>{phase.date}</td>
                        <td>{phase.states}</td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>{phase.seats}</td>
                        <td>
                          <span className={`pill pill--${phase.status === 'completed' ? 'green' : phase.status === 'active' ? 'blue' : 'gray'}`}>
                            {phase.status === 'completed' ? 'Completed' : phase.status === 'active' ? 'Polling Today' : 'Upcoming'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
