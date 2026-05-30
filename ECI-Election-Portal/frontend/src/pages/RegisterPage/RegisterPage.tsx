import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Shield, Fingerprint, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import CountryCodeSelector from './CountryCodeSelector';
import './RegisterPage.css';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+91',
    phoneNo: '',
    aadhaarNo: '',
    voterId: ''
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [loading, setLoading] = useState(false);

  const formatAadhaar = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 12);
    const chunks = raw.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : raw;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    // Simulate API logic for demo purposes
    setTimeout(() => {
      if (formData.aadhaarNo.replace(/\s/g, '').length === 12) {
        setStatus({ type: 'success', message: 'Registration Successful!' });
      } else {
        setStatus({ type: 'error', message: 'Aadhaar must be 12 digits.' });
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="register-container">
      <div className="register-card tile">

        <div className="register-header" style={{ marginBottom: '2.5rem' }}>
          <h1 className="text-heading-03" style={{ color: '#fff', fontSize: '2rem' }}>Voter Registration</h1>
          <p className="text-body-01" style={{ color: 'var(--eci-saffron)', fontWeight: 600 }}>भारत निर्वाचन — SECURE REGISTRATION PORTAL</p>
        </div>


        {status.type === 'success' ? (
          <div className="success-view animate-slide-up">
            <CheckCircle className="success-icon" />
            <h2 className="text-heading-02">Registration Received</h2>
            <p className="voter-name">Thank you, <strong>{formData.name}</strong>. Your application is under review.</p>
            
            <div className="status-grid" style={{ marginTop: '2rem' }}>
              <div className="status-card-lite tile">
                <Clock className="icon-blue" size={20} />
                <div className="status-card-lite__info">
                  <span className="text-label">Review Timeline</span>
                  <span className="text-heading-01">2-3 Business Days</span>
                </div>
              </div>
              <div className="status-card-lite tile">
                <Shield className="icon-green" size={20} />
                <div className="status-card-lite__info">
                  <span className="text-label">Encryption</span>
                  <span className="text-heading-01 text-green">Vault Secured</span>
                </div>
              </div>
            </div>

            <button onClick={() => setStatus({ type: null, message: '' })} className="btn btn--ghost" style={{ width: '100%', marginTop: '2rem' }}>Register Another</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label className="form-label">FULL NAME (AS PER AADHAAR)</label>
              <input 
                type="text" 
                className="form-input form-input--dark"
                required 
                placeholder="Enter your full name" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">EMAIL ADDRESS</label>
                <input 
                  type="email" 
                  className="form-input form-input--dark"
                  required 
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">PHONE NUMBER</label>
                <div className="phone-input-group">
                  <CountryCodeSelector 
                    value={formData.countryCode}
                    onChange={(val) => setFormData({...formData, countryCode: val})}
                  />
                  <input 
                    type="tel" 
                    className="form-input form-input--dark"
                    required 
                    placeholder="XXXXX XXXXX"
                    value={formData.phoneNo}
                    onChange={e => setFormData({...formData, phoneNo: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">AADHAAR NUMBER (12 DIGITS)</label>
              <input 
                type="text" 
                className="form-input form-input--dark"
                required 
                placeholder="XXXX XXXX XXXX"
                value={formData.aadhaarNo}
                onChange={e => setFormData({...formData, aadhaarNo: formatAadhaar(e.target.value)})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">VOTER CARD ID (EPIC)</label>
              <input 
                type="text" 
                className="form-input form-input--dark"
                required 
                maxLength={10}
                placeholder="ABC1234567"
                value={formData.voterId}
                onChange={e => setFormData({...formData, voterId: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')})}
              />
            </div>

            {status.type === 'error' && <div className="status-banner error">{status.message}</div>}

            <button type="submit" className="btn btn--primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
              {loading ? 'Processing...' : 'Register to Vote'}
            </button>
          </form>

        )}
      </div>
    </div>

  );
}
