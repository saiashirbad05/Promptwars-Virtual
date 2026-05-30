import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, Search, Menu, Newspaper, X } from 'lucide-react';

import './Header.css';

export default function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, label: 'Go to Dashboard' },
    { name: 'Candidates', path: '/candidates', icon: Users, label: 'Search Candidates' },
    { name: 'Turnout', path: '/turnout', icon: LayoutDashboard, label: 'View Voter Turnout' },
    { name: 'Map', path: '/constituency', icon: Search, label: 'Constituency Map Explorer' },
    { name: 'Register', path: '/register', icon: UserPlus, label: 'Register as a Voter' },
    { name: 'Verify', path: '/verify', icon: Search, label: 'Verify Voter Status' },
    { name: 'News', path: '/news', icon: Newspaper, label: 'Election News Hub' },
  ];

  return (
    <header className="main-header" role="banner">
      <div className="header-inner">
        <Link to="/" className="header-logo" aria-label="ECI Voter Portal - Bharat Nirbachan Home">
          <div className="logo-container">
            <img src="/logo.png" alt="" aria-hidden="true" className="header-logo-img" />
          </div>
          <div className="logo-text">
            <span className="logo-primary">ECI</span>
            <span className="logo-secondary">Voter Portal</span>
          </div>
        </Link>

        <nav className="header-nav" aria-label="Main Navigation">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              aria-current={location.pathname === item.path ? 'page' : undefined}
              aria-label={item.label}
            >
              <item.icon size={18} aria-hidden="true" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <button 
            className="menu-mobile" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <nav 
          id="mobile-navigation" 
          className="mobile-nav-dropdown"
          aria-label="Mobile Navigation"
        >
          {navItems.map((item) => (
            <Link 
              key={`mobile-${item.path}`} 
              to={item.path} 
              className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
              aria-current={location.pathname === item.path ? 'page' : undefined}
            >
              <item.icon size={20} aria-hidden="true" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
