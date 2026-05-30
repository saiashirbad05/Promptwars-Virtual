import React, { useState, useEffect, useCallback } from 'react';
import { Search, Map, Users, Newspaper, CheckSquare, Home, X, Command } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './CommandPalette.css';

const COMMANDS = [
  { id: 'home', icon: <Home size={18} />, label: 'Go to Home', path: '/' },
  { id: 'map', icon: <Map size={18} />, label: 'Explore Constituency Map', path: '/constituency' },
  { id: 'candidates', icon: <Users size={18} />, label: 'Search Candidates', path: '/candidates' },
  { id: 'news', icon: <Newspaper size={18} />, label: 'Election Breaking News', path: '/news' },
  { id: 'verify', icon: <CheckSquare size={18} />, label: 'Verify Voter ID', path: '/verify' },
  { id: 'register', icon: <Users size={18} />, label: 'New Voter Registration', path: '/register' },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const togglePalette = useCallback(() => setIsOpen(prev => !prev), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        togglePalette();
      }
      if (e.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePalette]);

  const filteredCommands = COMMANDS.filter(cmd => 
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setSearch('');
  };

  if (!isOpen) return null;

  return (
    <div className="command-palette-overlay" onClick={() => setIsOpen(false)}>
      <div className="command-palette-modal" onClick={e => e.stopPropagation()}>
        <div className="command-palette-input-wrapper">
          <Search className="palette-icon" size={20} />
          <input 
            autoFocus
            type="text" 
            placeholder="Type a command or search..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
                handleSelect(filteredCommands[selectedIndex].path);
              }
              if (e.key === 'ArrowDown') {
                setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
              }
              if (e.key === 'ArrowUp') {
                setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
              }
            }}
          />
          <div className="palette-shortcut">ESC</div>
        </div>

        <div className="command-palette-results">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, index) => (
              <div 
                key={cmd.id}
                className={`command-item ${index === selectedIndex ? 'selected' : ''}`}
                onClick={() => handleSelect(cmd.path)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <span className="command-icon">{cmd.icon}</span>
                <span className="command-label">{cmd.label}</span>
                {index === selectedIndex && <span className="command-enter">↵</span>}
              </div>
            ))
          ) : (
            <div className="no-results">No commands found.</div>
          )}
        </div>

        <div className="command-palette-footer">
          <span><Command size={12} /> + K to search</span>
          <span>↵ to select</span>
          <span>↑↓ to navigate</span>
        </div>
      </div>
    </div>
  );
}
