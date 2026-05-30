import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Trophy, TrendingUp, Users } from 'lucide-react';
import './ResultsPage.css';

const PARTY_RESULTS = [
  { party: 'BJP', seats: 24, color: '#FF6B00' },
  { party: 'INC', seats: 12, color: '#00BFFF' },
  { party: 'SP', seats: 6, color: '#D32F2F' },
  { party: 'AITC', seats: 5, color: '#1B5E20' },
  { party: 'DMK', seats: 3, color: '#E53935' },
  { party: 'AAP', seats: 2, color: '#0066CC' },
  { party: 'Others', seats: 0, color: '#757575' },
];

const CONSTITUENCY_RESULTS = [
  { constituency: 'Varanasi', state: 'Uttar Pradesh', winner: 'Rajesh Kumar Singh', party: 'BJP', partyColor: '#FF6B00', margin: 125340, phase: 1 },
  { constituency: 'Rae Bareli', state: 'Uttar Pradesh', winner: 'Priya Sharma', party: 'INC', partyColor: '#00BFFF', margin: 89210, phase: 1 },
  { constituency: 'Ahmedabad East', state: 'Gujarat', winner: 'Arun Patel', party: 'AAP', partyColor: '#0066CC', margin: 15670, phase: 2 },
  { constituency: 'Secunderabad', state: 'Telangana', winner: 'Kavitha Reddy', party: 'INC', partyColor: '#00BFFF', margin: 67890, phase: 2 },
  { constituency: 'Chennai South', state: 'Tamil Nadu', winner: 'Suresh Nair', party: 'DMK', partyColor: '#E53935', margin: 112450, phase: 2 },
  { constituency: 'Kolkata Dakshin', state: 'West Bengal', winner: 'Deepa Mukherjee', party: 'AITC', partyColor: '#1B5E20', margin: 98760, phase: 1 },
];

export default function ResultsPage() {
  const [phaseFilter, setPhaseFilter] = useState(0);
  const totalDeclared = PARTY_RESULTS.reduce((sum, p) => sum + p.seats, 0);
  const filtered = phaseFilter ? CONSTITUENCY_RESULTS.filter(r => r.phase === phaseFilter) : CONSTITUENCY_RESULTS;

  return (
    <div className="results-page section">
      <div className="container">
        <h1 className="text-heading-01">Election Results</h1>
        <p className="services__subtitle" style={{ marginBottom: 'var(--spacing-07)' }}>
          Live results from declared constituencies — Phase 1 & 2 completed
        </p>

        {/* Summary Bar */}
        <div className="results-summary section--dark" style={{ padding: 'var(--spacing-07)', marginBottom: 'var(--spacing-07)' }}>
          <div className="results-summary__stats">
            <div className="results-summary__stat">
              <Trophy size={20} color="var(--eci-saffron)" />
              <div>
                <span className="text-mono results-summary__number">{totalDeclared}</span>
                <span className="text-label" style={{ color: 'var(--cds-text-placeholder)' }}>Seats Declared</span>
              </div>
            </div>
            <div className="results-summary__stat">
              <Users size={20} color="var(--cds-button-primary)" />
              <div>
                <span className="text-mono results-summary__number">{543 - totalDeclared}</span>
                <span className="text-label" style={{ color: 'var(--cds-text-placeholder)' }}>Remaining</span>
              </div>
            </div>
            <div className="results-summary__stat">
              <TrendingUp size={20} color="var(--eci-green)" />
              <div>
                <span className="text-mono results-summary__number">272</span>
                <span className="text-label" style={{ color: 'var(--cds-text-placeholder)' }}>Majority Mark</span>
              </div>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="results-progress">
            {PARTY_RESULTS.filter(p => p.seats > 0).map(p => (
              <div key={p.party} className="results-progress__segment" style={{ width: `${(p.seats / 543) * 100}%`, background: p.color }} title={`${p.party}: ${p.seats} seats`} />
            ))}
            <div className="results-progress__remaining" style={{ flex: 1 }} />
          </div>
          <div className="results-legend">
            {PARTY_RESULTS.filter(p => p.seats > 0).map(p => (
              <div key={p.party} className="results-legend__item">
                <span className="results-legend__dot" style={{ background: p.color }} />
                <span>{p.party}</span>
                <span className="text-mono" style={{ fontWeight: 600 }}>{p.seats}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid--2" style={{ gap: 'var(--spacing-05)', marginBottom: 'var(--spacing-07)' }}>
          <div className="tile" style={{ padding: 'var(--spacing-06)' }}>
            <h3 className="text-heading-03" style={{ marginBottom: 'var(--spacing-05)' }}>Seats Won by Party</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={PARTY_RESULTS.filter(p => p.seats > 0)} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--cds-text-secondary)" />
                <YAxis type="category" dataKey="party" tick={{ fontSize: 12 }} stroke="var(--cds-text-secondary)" width={50} />
                <Tooltip contentStyle={{ background: 'var(--cds-background-dark)', border: 'none', color: '#fff' }} />
                <Bar dataKey="seats" name="Seats">
                  {PARTY_RESULTS.filter(p => p.seats > 0).map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="tile" style={{ padding: 'var(--spacing-06)' }}>
            <h3 className="text-heading-03" style={{ marginBottom: 'var(--spacing-05)' }}>Seat Share Distribution</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={PARTY_RESULTS.filter(p => p.seats > 0)} dataKey="seats" nameKey="party" cx="50%" cy="50%" outerRadius={100} label={({ party, seats }) => `${party} (${seats})`}>
                  {PARTY_RESULTS.filter(p => p.seats > 0).map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--cds-background-dark)', border: 'none', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Phase Filter */}
        <div style={{ display: 'flex', gap: 2, marginBottom: 'var(--spacing-05)' }}>
          {[0, 1, 2, 3, 4, 5].map(p => (
            <button key={p} className={`news-cat-btn ${phaseFilter === p ? 'news-cat-btn--active' : ''}`} onClick={() => setPhaseFilter(p)}>
              {p === 0 ? 'All Phases' : `Phase ${p}`}
            </button>
          ))}
        </div>

        {/* Results Table */}
        <table className="data-table">
          <thead>
            <tr>
              <th>Constituency</th>
              <th>State</th>
              <th>Winner</th>
              <th>Party</th>
              <th>Margin</th>
              <th>Phase</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.constituency}>
                <td><strong>{r.constituency}</strong></td>
                <td>{r.state}</td>
                <td>{r.winner}</td>
                <td><span className="pill" style={{ background: `${r.partyColor}20`, color: r.partyColor }}>{r.party}</span></td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{r.margin.toLocaleString('en-IN')}</td>
                <td>Phase {r.phase}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
