import { Link } from 'react-router-dom';
import './Footer.css';

const FOOTER_LINKS = {
  'Voter Services': [
    { label: 'Register to Vote', path: '/register' },
    { label: 'Verify Registration', path: '/verify' },
    { label: 'Find Your Booth', path: '/constituency' },
    { label: 'Download Voter ID', path: '/profile' },
  ],
  'Election Info': [
    { label: 'Candidate Directory', path: '/candidates' },
    { label: 'Election Results', path: '/results' },
    { label: 'Turnout Dashboard', path: '/turnout' },
    { label: 'News & Updates', path: '/news' },
  ],
  'Resources': [
    { label: 'Constituency Map', path: '/constituency' },
    { label: 'File Grievance', path: '/grievance' },
    { label: 'AI Assistant', path: '/chatbot' },
    { label: 'FAQs', path: '/' },
  ],
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__tricolor" aria-hidden="true">
        <div className="footer__tricolor-saffron" />
        <div className="footer__tricolor-white" />
        <div className="footer__tricolor-green" />
      </div>
      <div className="container">
        <div className="footer__grid">
          {/* Brand Column */}
          <div className="footer__brand">
            <div className="footer__brand-name">
              <span className="footer__brand-hindi">भारत निर्वाचन</span>
              <span className="footer__brand-en">ECI Voter Portal</span>
            </div>
            <p className="footer__brand-tagline">
              Your Vote. Your Democracy. Powered by High-Performance Analytics.
            </p>
            <div className="footer__brand-stats">
              <div className="footer__stat">
                <span className="footer__stat-number">1.2B+</span>
                <span className="footer__stat-label">Eligible Voters</span>
              </div>
              <div className="footer__stat">
                <span className="footer__stat-number">543</span>
                <span className="footer__stat-label">Constituencies</span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title} className="footer__column">
              <h3 className="footer__column-title">{title}</h3>
              <ul className="footer__column-links">
                {links.map(link => (
                  <li key={link.label}>
                    <Link to={link.path} className="footer__link">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © 2026 Election Commission of India. All rights reserved.
          </p>
          <div className="footer__bottom-links">
            <a href="#" className="footer__bottom-link">Privacy Policy</a>
            <a href="#" className="footer__bottom-link">Terms of Use</a>
            <a href="#" className="footer__bottom-link">Accessibility</a>
            <a href="#" className="footer__bottom-link">RTI</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
