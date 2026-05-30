import { useState } from 'react';
import { Upload, AlertCircle, CheckCircle, FileText, MapPin, Shield } from 'lucide-react';
import { INDIAN_STATES } from '../../constants/states';
import './GrievancePage.css';

const CATEGORIES = [
  'MCC Violation',
  'Voter Intimidation',
  'Booth Capture',
  'Bribery',
  'Fake News',
  'Other',
];

export default function GrievancePage() {
  const [activeView, setActiveView] = useState<'file' | 'track'>('file');
  const [submitted, setSubmitted] = useState(false);
  const [ticketId] = useState('GRV-2026-A7F3');
  const [trackInput, setTrackInput] = useState('');
  const [showTracking, setShowTracking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleTrack = () => {
    if (trackInput.length > 3) setShowTracking(true);
  };

  return (
    <div className="grievance-page section">
      <div className="container">
        <h1 className="text-heading-01">Grievance Portal</h1>
        <p className="services__subtitle" style={{ marginBottom: 'var(--spacing-07)' }}>
          Digital cVIGIL — File, track, and escalate complaints about electoral malpractice
        </p>

        {/* Toggle */}
        <div className="tabs" style={{ marginBottom: 'var(--spacing-07)' }}>
          <button className={`tab ${activeView === 'file' ? 'tab--active' : ''}`} onClick={() => { setActiveView('file'); setSubmitted(false); }}>
            <FileText size={14} style={{ marginRight: 6 }} /> File Grievance
          </button>
          <button className={`tab ${activeView === 'track' ? 'tab--active' : ''}`} onClick={() => { setActiveView('track'); setShowTracking(false); }}>
            <Shield size={14} style={{ marginRight: 6 }} /> Track Status
          </button>
        </div>

        {activeView === 'file' && !submitted && (
          <div className="grievance-form-container section--dark animate-fade-in" style={{ padding: 'var(--spacing-07)' }}>
            <div className="notification notification--info" style={{ marginBottom: 'var(--spacing-06)' }}>
              <AlertCircle size={18} />
              <span>Google Sign-In required. Your identity is protected and will not be shared with the accused party.</span>
            </div>

            <form onSubmit={handleSubmit} className="grievance-form">
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--cds-text-placeholder)' }}>Complaint Category *</label>
                <select className="form-select form-input--dark" required>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--cds-text-placeholder)' }}>Description *</label>
                <textarea className="form-textarea form-input--dark" placeholder="Describe the incident in detail (minimum 50 characters)" minLength={50} required />
              </div>

              <div className="grievance-form__row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label" style={{ color: 'var(--cds-text-placeholder)' }}>State *</label>
                  <select className="form-select form-input--dark" required>
                    <option value="">Select state</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label" style={{ color: 'var(--cds-text-placeholder)' }}>District</label>
                  <input className="form-input form-input--dark" placeholder="Enter district" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label" style={{ color: 'var(--cds-text-placeholder)' }}>Constituency</label>
                  <input className="form-input form-input--dark" placeholder="Enter constituency" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--cds-text-placeholder)' }}>Evidence (Photo/Video, max 50MB)</label>
                <div className="grievance-upload">
                  <Upload size={24} />
                  <span>Click or drag files to upload</span>
                  <span style={{ fontSize: 'var(--text-label)', color: 'var(--cds-text-placeholder)' }}>JPG, PNG, MP4 supported</span>
                </div>
              </div>

              <div className="grievance-checkbox">
                <input type="checkbox" id="anonymous" />
                <label htmlFor="anonymous" style={{ color: 'var(--cds-text-placeholder)' }}>File anonymously (your identity will be hidden from all parties)</label>
              </div>

              <button type="submit" className="btn btn--primary" style={{ marginTop: 'var(--spacing-05)' }}>
                Submit Grievance
              </button>
            </form>
          </div>
        )}

        {activeView === 'file' && submitted && (
          <div className="grievance-success animate-slide-up" style={{ textAlign: 'center', padding: 'var(--spacing-10)' }}>
            <CheckCircle size={64} color="var(--eci-green)" />
            <h2 className="text-heading-02" style={{ marginTop: 'var(--spacing-06)' }}>Grievance Filed Successfully</h2>
            <p style={{ color: 'var(--cds-text-secondary)', marginTop: 'var(--spacing-04)', marginBottom: 'var(--spacing-06)' }}>
              Your complaint has been registered. Save your ticket ID for tracking.
            </p>
            <div className="grievance-ticket">
              <span className="text-label" style={{ color: 'var(--cds-text-secondary)' }}>TICKET ID</span>
              <span className="grievance-ticket__id text-mono">{ticketId}</span>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-05)', justifyContent: 'center', marginTop: 'var(--spacing-07)' }}>
              <button className="btn btn--primary" onClick={() => { setActiveView('track'); setShowTracking(false); }}>
                Track Status
              </button>
              <button className="btn btn--secondary" onClick={() => setSubmitted(false)}>
                File Another
              </button>
            </div>
          </div>
        )}

        {activeView === 'track' && (
          <div className="animate-fade-in">
            <div className="grievance-track-input" style={{ display: 'flex', gap: 'var(--spacing-05)', maxWidth: 500, marginBottom: 'var(--spacing-07)' }}>
              <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                <input
                  className="form-input"
                  placeholder="Enter your ticket ID (e.g. GRV-2026-A7F3)"
                  value={trackInput}
                  onChange={e => setTrackInput(e.target.value)}
                  style={{ fontFamily: 'var(--font-mono)' }}
                />
              </div>
              <button className="btn btn--primary" onClick={handleTrack}>Track</button>
            </div>

            {showTracking && (
              <div className="grievance-tracking tile animate-slide-up" style={{ padding: 'var(--spacing-07)' }}>
                <div className="grievance-tracking__header">
                  <div>
                    <span className="text-label" style={{ color: 'var(--cds-text-secondary)' }}>TICKET ID</span>
                    <h2 className="text-heading-03 text-mono">{trackInput || ticketId}</h2>
                  </div>
                  <span className="pill pill--blue">Under Review</span>
                </div>

                <div className="grievance-tracking__details" style={{ marginTop: 'var(--spacing-06)' }}>
                  <div className="grievance-tracking__detail">
                    <span className="text-label" style={{ color: 'var(--cds-text-secondary)' }}>CATEGORY</span>
                    <span>MCC Violation</span>
                  </div>
                  <div className="grievance-tracking__detail">
                    <span className="text-label" style={{ color: 'var(--cds-text-secondary)' }}>FILED ON</span>
                    <span className="text-mono">April 24, 2026</span>
                  </div>
                  <div className="grievance-tracking__detail">
                    <span className="text-label" style={{ color: 'var(--cds-text-secondary)' }}>SEVERITY</span>
                    <span className="pill pill--saffron">Medium</span>
                  </div>
                  <div className="grievance-tracking__detail">
                    <span className="text-label" style={{ color: 'var(--cds-text-secondary)' }}>LOCATION</span>
                    <span><MapPin size={12} style={{ marginRight: 4 }} /> Ahmedabad East, Gujarat</span>
                  </div>
                </div>

                <h3 className="text-heading-03" style={{ marginTop: 'var(--spacing-07)', marginBottom: 'var(--spacing-05)' }}>Status Timeline</h3>
                <div className="timeline">
                  {[
                    { status: 'Filed', note: 'Complaint registered successfully', time: 'April 24, 2026, 10:32 AM', done: true },
                    { status: 'Under Review', note: 'Assigned to District Electoral Officer, Ahmedabad', time: 'April 24, 2026, 2:15 PM', done: true },
                    { status: 'Investigated', note: 'Investigation pending', time: '', done: false },
                    { status: 'Resolved', note: '', time: '', done: false },
                  ].map((step, i) => (
                    <div key={i} className="timeline-step">
                      <div className={`timeline-dot timeline-dot--${step.done ? (i === 1 ? 'active' : 'done') : 'pending'}`} />
                      {i < 3 && <div className="timeline-line" />}
                      <div>
                        <strong style={{ fontSize: 'var(--text-body-short)' }}>{step.status}</strong>
                        {step.note && <p style={{ fontSize: 'var(--text-label)', color: 'var(--cds-text-secondary)', marginTop: 2 }}>{step.note}</p>}
                        {step.time && <span style={{ fontSize: 'var(--text-label)', color: 'var(--cds-text-placeholder)', fontFamily: 'var(--font-mono)' }}>{step.time}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
