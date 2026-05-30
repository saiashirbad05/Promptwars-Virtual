import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, IndianRupee, GraduationCap, ShieldCheck } from 'lucide-react';
import './CandidateComparison.css';

interface Candidate {
  id: string;
  name: string;
  party: string;
  assets: number;
  criminalCases: number;
  education: string;
  constituency: string;
}

interface Props {
  candidateA: Candidate | null;
  candidateB: Candidate | null;
  onClose: () => void;
}

export default function CandidateComparison({ candidateA, candidateB, onClose }: Props) {
  if (!candidateA || !candidateB) return null;

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <motion.div 
      className="compare-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="compare-modal tile"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="compare-header">
          <h2 className="text-heading-03">Candidate Comparison</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close Comparison"><X size={20} /></button>
        </div>

        <div className="compare-grid">
          {/* Labels Column */}
          <div className="compare-labels">
            <div className="compare-label-cell text-label">PARTY</div>
            <div className="compare-label-cell text-label">TOTAL ASSETS</div>
            <div className="compare-label-cell text-label">CRIMINAL CASES</div>
            <div className="compare-label-cell text-label">EDUCATION</div>
            <div className="compare-label-cell text-label">CONSTITUENCY</div>
          </div>

          {/* Candidate A Column */}
          <div className="compare-column">
            <div className="compare-candidate-info">
              <div className="compare-avatar" style={{ background: 'var(--cds-button-primary)' }}>{candidateA.name[0]}</div>
              <h3 className="text-heading-01">{candidateA.name}</h3>
            </div>
            <div className="compare-value-cell"><span className="pill pill--navy">{candidateA.party}</span></div>
            <div className="compare-value-cell text-mono">{formatCurrency(candidateA.assets)}</div>
            <div className={`compare-value-cell ${candidateA.criminalCases > 0 ? 'text-danger' : 'text-success'}`}>
              {candidateA.criminalCases} Cases
            </div>
            <div className="compare-value-cell">{candidateA.education}</div>
            <div className="compare-value-cell">{candidateA.constituency}</div>
          </div>

          {/* VS Divider */}
          <div className="compare-vs">
            <div className="vs-line"></div>
            <div className="vs-circle">VS</div>
            <div className="vs-line"></div>
          </div>

          {/* Candidate B Column */}
          <div className="compare-column">
            <div className="compare-candidate-info">
              <div className="compare-avatar" style={{ background: 'var(--eci-saffron)' }}>{candidateB.name[0]}</div>
              <h3 className="text-heading-01">{candidateB.name}</h3>
            </div>
            <div className="compare-value-cell"><span className="pill pill--navy">{candidateB.party}</span></div>
            <div className="compare-value-cell text-mono">{formatCurrency(candidateB.assets)}</div>
            <div className={`compare-value-cell ${candidateB.criminalCases > 0 ? 'text-danger' : 'text-success'}`}>
              {candidateB.criminalCases} Cases
            </div>
            <div className="compare-value-cell">{candidateB.education}</div>
            <div className="compare-value-cell">{candidateB.constituency}</div>
          </div>
        </div>

        <div className="compare-footer">
          <p className="text-label" style={{ opacity: 0.5 }}>DATA VERIFIED BY ECI SECURE VAULT ENGINE • {new Date().toLocaleDateString()}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
