import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Shield } from 'lucide-react';
import './VerifyPage.css';

export default function VerifyPage() {
  const [voterId, setVoterId] = useState('');
  const [birthday, setBirthday] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate API call for demo purposes
    setTimeout(() => {
      if (voterId.length === 10) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMsg('Invalid Voter ID format. Should be 10 alphanumeric characters.');
      }
    }, 1500);
  };

  return (
    <div className="verify-page">
      <motion.div 
        className="verify-card"
        initial={{ opacity: 0, y: 20 }}

        animate={{ opacity: 1, y: 0 }}
      >
        {status !== 'success' ? (
          <>
            <div className="phase-banner animate-slide-up">
              <div className="phase-banner__content">
                <span className="phase-tag">LIVE PHASE 3</span>
                <span className="phase-text">
                  <strong>Voting for 36 constituencies</strong> on April 24, 2026. 
                  Check your booth location.
                </span>
                <a href="/constituency" className="phase-link">Find your booth →</a>
              </div>
            </div>


            <div className="holographic-card">
              <div className="security-watermark">
                <Shield size={160} color="var(--eci-saffron)" />
              </div>

              <div className="verify-header">
                <h1 className="text-heading-03">Verify Registration</h1>
                <p className="text-body-01" style={{ color: 'var(--eci-saffron)', fontWeight: 600 }}>National Voter Service Portal — Secure Verification</p>
              </div>

              <form onSubmit={handleVerify} className="verify-form">
                <div className="form-group">
                  <label className="form-label">VOTER CARD ID (EPIC)</label>
                  <input 
                    type="text" 
                    className="form-input form-input--dark input-field"
                    required 
                    maxLength={10}
                    placeholder="ABC1234567"
                    value={voterId}
                    onChange={e => setVoterId(e.target.value.toUpperCase())}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">DATE OF BIRTH</label>
                  <input 
                    type="date" 
                    className="form-input form-input--dark input-field"
                    required 
                    value={birthday}
                    onChange={e => setBirthday(e.target.value)}
                  />
                </div>

                {status === 'error' && <div className="status-banner error" style={{ marginTop: '1rem' }}>{errorMsg}</div>}

                <button type="submit" className="btn btn--primary" style={{ width: '100%', marginTop: '2rem', height: '64px', fontSize: '1.25rem' }} disabled={status === 'loading'}>
                  {status === 'loading' ? 'Searching Registry...' : 'Begin Identity Validation'}
                </button>
              </form>
            </div>


          </>
        ) : (
          <div className="success-view">
            <div className="success-header">
              <CheckCircle className="success-icon" />
              <h2 className="text-heading-02">Identity Verified</h2>
              <p className="voter-name">Records for EPIC <strong>{voterId}</strong> are active.</p>
            </div>
            
            <div className="status-grid">
              <div className="status-card-lite">
                <Clock className="icon-blue" size={20} />
                <div className="status-card-lite__info">
                  <span className="text-label">Upcoming Election</span>
                  <span className="text-heading-01">Phase 4 (In 2-3 Days)</span>
                </div>
              </div>
              
              <div className="status-card-lite">
                <Shield className="icon-green" size={20} />
                <div className="status-card-lite__info">
                  <span className="text-label">Voter Status</span>
                  <span className="text-heading-01 text-green">Eligible & Active</span>
                </div>
              </div>
            </div>

            <div className="polling-info tile" style={{ marginTop: '1.5rem', background: 'rgba(255,255,255,0.03)' }}>
              <span className="text-label">ASSIGNED POLLING STATION</span>
              <p className="text-body-01" style={{ margin: '0.25rem 0' }}>St. Mary's Secondary School, Block B</p>
              <p className="text-label">Room 4, Ground Floor</p>
            </div>

            <button onClick={() => setStatus('idle')} className="btn btn--ghost" style={{ width: '100%', marginTop: '2.5rem' }}>Verify Another ID</button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
