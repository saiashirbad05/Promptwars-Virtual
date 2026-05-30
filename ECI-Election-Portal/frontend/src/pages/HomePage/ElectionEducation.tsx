import { useState } from 'react';
import { 
  BookOpen, UserPlus, Search, Vote, BarChart3, 
  ChevronRight, ChevronLeft, CheckCircle2, Info,
  ExternalLink, ArrowRight
} from 'lucide-react';
import './ElectionEducation.css';

const STEPS = [
  {
    id: 'awareness',
    icon: BookOpen,
    title: 'Phase 1: Voter Awareness',
    subtitle: 'Understand your power',
    content: 'Voting is the foundation of democracy. Every single vote counts towards shaping the future of India. As a citizen, it is your constitutional right and duty to participate in the electoral process.',
    bullets: [
      'Right to choose representatives',
      'Impact on national policy',
      'Accountability of the government',
      'Strength of democratic institutions'
    ],
    color: 'var(--eci-saffron)'
  },
  {
    id: 'registration',
    icon: UserPlus,
    title: 'Phase 2: Registration',
    subtitle: 'Get listed in the roll',
    content: 'To vote, your name must be in the Electoral Roll. If you are 18+ on the qualifying date (Jan 1st), you can register online or offline.',
    bullets: [
      'Fill Form 6 for new registration',
      'Requires Age & Address proof',
      'Online via NVSP portal or Mobile App',
      'BLO verification follow-up'
    ],
    action: '/register',
    actionText: 'Register Now',
    color: 'var(--cds-button-primary)'
  },
  {
    id: 'verification',
    icon: Search,
    title: 'Phase 3: Verification',
    subtitle: 'Confirm your identity',
    content: 'Ensure your details are correct and your name is present in the final published list. Use your EPIC (Voter ID) number to verify.',
    bullets: [
      'Check name in Electoral Roll',
      'Verify Polling Booth address',
      'Correction of entries (Form 8)',
      'Download e-EPIC card'
    ],
    action: '/verify',
    actionText: 'Verify Status',
    color: 'var(--eci-green)'
  },
  {
    id: 'polling',
    icon: Vote,
    title: 'Phase 4: Polling Day',
    subtitle: 'Cast your ballot',
    content: 'On the day of the election, visit your designated polling booth with your Voter ID or any approved photo identity proof.',
    bullets: [
      'Check your booth serial number',
      'Inked finger and ballot slip',
      'Verify selection on VVPAT screen',
      'Maintain secrecy of your vote'
    ],
    color: 'var(--eci-navy)'
  },
  {
    id: 'results',
    icon: BarChart3,
    title: 'Phase 5: Post-Voting',
    subtitle: 'Track the mandate',
    content: 'After voting is completed, wait for the counting day. The results are declared constituency-wise on the ECI results portal.',
    bullets: [
      'Real-time counting updates',
      'Constituency-wise results',
      'Party-wise performance data',
      'Candidate victory margins'
    ],
    action: '/results',
    actionText: 'View Live Results',
    color: 'var(--eci-saffron)'
  }
];

export default function ElectionEducation() {
  const [activeStep, setActiveStep] = useState(0);

  const nextStep = () => setActiveStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setActiveStep(prev => Math.max(prev - 1, 0));

  const StepIcon = STEPS[activeStep].icon;

  return (
    <div className="edu-container">
      <div className="edu-header">
        <span className="text-label">Interactive Assistant</span>
        <h2>Your Election Journey Guide</h2>
        <p>A step-by-step interactive guide to help you navigate the 2024 General Elections</p>
      </div>

      <div className="edu-workflow">
        {/* Progress Bar */}
        <div className="edu-progress">
          {STEPS.map((step, idx) => (
            <div 
              key={step.id} 
              className={`edu-progress-node ${idx <= activeStep ? 'active' : ''}`}
              onClick={() => setActiveStep(idx)}
              title={step.title}
            >
              <div className="node-dot">
                {idx < activeStep ? <CheckCircle2 size={16} /> : <span>{idx + 1}</span>}
              </div>
              <span className="node-label">{step.id}</span>
            </div>
          ))}
          <div className="edu-progress-line" style={{ width: `${(activeStep / (STEPS.length - 1)) * 100}%` }} />
        </div>

        {/* Content Card */}
        <div className="edu-card animate-fade-in" key={activeStep}>
          <div className="edu-card-header" style={{ borderColor: STEPS[activeStep].color }}>
            <div className="edu-card-icon" style={{ background: `${STEPS[activeStep].color}20`, color: STEPS[activeStep].color }}>
              <StepIcon size={32} />
            </div>
            <div>
              <span className="edu-card-subtitle">{STEPS[activeStep].subtitle}</span>
              <h3 className="edu-card-title">{STEPS[activeStep].title}</h3>
            </div>
          </div>

          <div className="edu-card-body">
            <p className="edu-card-text">{STEPS[activeStep].content}</p>
            <div className="edu-bullets">
              {STEPS[activeStep].bullets.map((bullet, i) => (
                <div key={i} className="edu-bullet">
                  <div className="bullet-dot" style={{ background: STEPS[activeStep].color }} />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="edu-card-footer">
            {STEPS[activeStep].action ? (
              <a href={STEPS[activeStep].action} className="edu-action-btn" style={{ background: STEPS[activeStep].color }}>
                {STEPS[activeStep].actionText} <ArrowRight size={18} />
              </a>
            ) : (
              <div className="edu-info-box">
                <Info size={16} />
                <span>Visit eci.gov.in for official notifications</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="edu-nav">
          <button className="nav-btn" onClick={prevStep} disabled={activeStep === 0}>
            <ChevronLeft size={20} /> Back
          </button>
          <div className="step-indicator">
            Step {activeStep + 1} of {STEPS.length}
          </div>
          <button className="nav-btn primary" onClick={nextStep} disabled={activeStep === STEPS.length - 1}>
            Next Step <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
