import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, ChevronRight, Info, Calendar, UserCheck, Vote } from 'lucide-react';
import './FloatingAssistant.css';

const ELECTION_STEPS = [
  {
    id: 1,
    title: 'Voter Registration',
    desc: 'Ensure you are registered. Last date to register is 21 days before the poll.',
    icon: <UserCheck size={18} />,
    color: '#0f62fe'
  },
  {
    id: 2,
    title: 'Verification',
    desc: 'Verify your details on the electoral roll. Check for any errors early.',
    icon: <Info size={18} />,
    color: '#8a3ffc'
  },
  {
    id: 3,
    title: 'Candidate Research',
    desc: 'Browse candidates in your constituency, check their criminal records and assets.',
    icon: <Bot size={18} />,
    color: '#009d9a'
  },
  {
    id: 4,
    title: 'Polling Day',
    desc: 'Carry your EPIC card or approved ID. Visit your booth between 7 AM to 6 PM.',
    icon: <Vote size={18} />,
    color: '#ff6b00'
  }
];

export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="assistant-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="assistant-panel tile"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
          >
            <div className="assistant-header">
              <div className="assistant-header__title">
                <Bot size={20} className="text-accent" />
                <h3>ECI Virtual Assistant</h3>
              </div>
              <button className="close-btn" onClick={() => setIsOpen(false)}><X size={18} /></button>
            </div>

            <div className="assistant-content">
              <p className="text-label">ELECTION PROCESS GUIDE</p>
              <div className="steps-list">
                {ELECTION_STEPS.map(step => (
                  <div key={step.id} className="step-item">
                    <div className="step-icon" style={{ color: step.color }}>{step.icon}</div>
                    <div className="step-text">
                      <h4>{step.title}</h4>
                      <p>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="assistant-footer">
              <button className="btn btn--ghost btn--sm">View Full Timeline</button>
              <button className="btn btn--primary btn--sm">Ask a Question</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        className={`assistant-trigger ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
        {!isOpen && <span className="trigger-badge">Guide</span>}
      </button>
    </div>
  );
}
