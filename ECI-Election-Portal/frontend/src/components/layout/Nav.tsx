import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, User, Globe } from 'lucide-react';
import './Nav.css';

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/candidates', label: 'Candidates' },
  { path: '/constituency', label: 'Constituency Map' },
  { path: '/results', label: 'Results' },
  { path: '/turnout', label: 'Turnout' },
  { path: '/news', label: 'News' },
  { path: '/grievance', label: 'Grievance' },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      {/* Live Election Status Bar */}
      <div className="nav__live-banner">
        <div className="nav__inner">
          <div className="nav__live-tag">
            <span className="pulse-dot"></span>
            LIVE: PHASE 3
          </div>
          <div className="nav__live-ticker">
            <span className="ticker-item">Voting active in 12 States & UTs</span>
            <span className="ticker-divider">|</span>
            <span className="ticker-item">Current Turnout: 62.4%</span>
            <span className="ticker-divider">|</span>
            <span className="ticker-item">Next Phase starts in 4 Days</span>
          </div>
          <div className="nav__live-progress hide-mobile">
            <div className="progress-label">Total Progress</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '42%' }}></div>
            </div>
            <div className="progress-value">42%</div>
          </div>
        </div>
      </div>

      <div className="nav__inner">
        {/* Logo */}
        <Link to="/" className="nav__logo" aria-label="ECI Home">
          <img src="/logo.png" alt="ECI Logo" className="nav__logo-img" />
          <div className="nav__logo-text">
            <span className="nav__logo-title">ECI Voter Portal</span>
            <span className="nav__logo-subtitle">भारत निर्वाचन</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="nav__links hide-mobile">
          {NAV_LINKS.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav__link ${location.pathname === link.path ? 'nav__link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="nav__actions">
          <button className="btn--icon nav__action-btn" aria-label="Search">
            <Search size={18} />
          </button>
          <button className="btn--icon nav__action-btn hide-mobile" aria-label="Language">
            <Globe size={18} />
          </button>
          <button className="btn--icon nav__action-btn" aria-label="Account">
            <User size={18} />
          </button>
          <button
            className="btn--icon nav__action-btn nav__hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="nav__mobile-menu" role="menu">
          {NAV_LINKS.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav__mobile-link ${location.pathname === link.path ? 'nav__mobile-link--active' : ''}`}
              onClick={() => setMobileOpen(false)}
              role="menuitem"
            >
              {link.label}
            </Link>
          ))}
          <div className="nav__mobile-divider" />
          <button className="nav__mobile-link">
            <Globe size={16} /> English / हिन्दी
          </button>
          <Link to="/register" className="nav__mobile-cta" onClick={() => setMobileOpen(false)}>
            Sign in with Google
          </Link>
        </div>
      )}
    </nav>
  );
}
