import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { COUNTRY_CODES } from '../../constants/countryCodes';
import './CountryCodeSelector.css';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function CountryCodeSelector({ value, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  
  const selectedCountry = COUNTRY_CODES.find(c => c.dial_code === value) || COUNTRY_CODES.find(c => c.dial_code === '+91');

  const filteredCountries = useMemo(() => {
    if (!search) return COUNTRY_CODES;
    return COUNTRY_CODES.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) || 
      c.dial_code.includes(search)
    );
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="selector-container" ref={containerRef}>
      <button 
        type="button"
        className="selector-trigger" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <img 
          src={`https://flagcdn.com/w40/${selectedCountry?.code.toLowerCase()}.png`} 
          alt={selectedCountry?.name}
          className="cc-flag-img"
        />
        <span className="cc-code">{selectedCountry?.dial_code}</span>
        <ChevronDown size={14} className={`cc-chevron ${isOpen ? 'open' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="selector-dropdown animate-slide-up">
          <div className="selector-search">
            <input 
              type="text" 
              placeholder="Search country..." 
              autoFocus
              value={search}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="cc-options">
            {filteredCountries.map((c, idx) => (
              <button 
                type="button"
                key={`${c.code}-${idx}`} 
                className={`selector-item ${c.dial_code === value ? 'selected' : ''}`}
                onClick={() => {
                  onChange(c.dial_code);
                  setIsOpen(false);
                  setSearch('');
                }}
              >
                <img 
                  src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`} 
                  alt={c.name}
                  className="cc-flag-img"
                />
                <span className="cc-name">{c.name}</span>
                <span className="item-dial-code">{c.dial_code}</span>
              </button>
            ))}
            {filteredCountries.length === 0 && (
              <div style={{ padding: '1rem', textAlign: 'center', color: '#757575' }}>
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
