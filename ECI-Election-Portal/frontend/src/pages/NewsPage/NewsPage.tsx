import { useState, useEffect, useMemo } from 'react';
import { Clock, ExternalLink, Share2, CheckCircle, AlertTriangle, HelpCircle, Filter, Search, TrendingUp, Newspaper, Zap, Globe } from 'lucide-react';
import './NewsPage.css';

const NEWS_CATEGORIES = ['All', 'ECI Official', 'Security', 'Results', 'Candidate', 'Opinion', 'Tech'];

const REAL_ARTICLES = [
  {
    id: 'r1', headline: 'ECI Announces Phase 3 Polling for 36 Constituencies on April 24',
    summary: 'The Election Commission has confirmed polling dates for Phase 3 covering Gujarat, Madhya Pradesh, and Assam constituencies with enhanced security arrangements.',
    source: 'Press Information Bureau', category: 'ECI Official', factCheck: 'verified',
    time: '2 hours ago', breaking: true, state: 'National',
  },
  {
    id: 'r2', headline: 'Voter Turnout in Phase 2 Crosses 60% Mark Across 32 Constituencies',
    summary: 'Phase 2 recorded a cumulative turnout of 61.4%, with Karnataka leading at 67.5%. Urban areas showed significant improvement over 2024 figures.',
    source: 'Election Commission of India', category: 'Results', factCheck: 'verified',
    time: '5 hours ago', breaking: true, state: 'National',
  },
  {
    id: 'r3', headline: 'EVM Security Enhanced with AI-Powered Surveillance at Strong Rooms',
    summary: 'ECI deploys advanced AI surveillance systems at all strong rooms storing EVMs after Phase 2 polling, ensuring round-the-clock monitoring.',
    source: 'NDTV News', category: 'Security', factCheck: 'verified',
    time: '12 hours ago', breaking: false, state: 'National',
  }
];

const HEADLINE_TEMPLATES = [
  "New voter registration surge in {state} constituency",
  "Candidate {name} pledges {topic} reform in latest rally",
  "Election observer flags minor protocol breach in {state}",
  "How {topic} is influencing youth voters in {state}",
  "Political party {party} releases digital manifesto focusing on {topic}",
  "Security forces conduct flag march in sensitive areas of {state}",
  "Voter ID card distribution reaches 99% in {state} districts",
  "Analysis: The impact of {topic} on the upcoming Phase 3 polls",
  "ECI issues notice to candidate for {topic} related speech",
  "Record number of female candidates filing nominations in {state}"
];

const STATES = ['Uttar Pradesh', 'Maharashtra', 'West Bengal', 'Bihar', 'Tamil Nadu', 'Gujarat', 'Karnataka', 'Rajasthan'];
const NAMES = ['Amit Shah', 'Rahul Gandhi', 'Mamata Banerjee', 'Narendra Modi', 'Arvind Kejriwal', 'Stalin', 'Nitish Kumar'];
const TOPICS = ['Infrastructure', 'Education', 'Digital India', 'Agricultural Policy', 'Job Creation', 'Healthcare'];
const PARTIES = ['BJP', 'INC', 'AAP', 'TMC', 'DMK', 'BSP'];

function FactCheckBadge({ status }: { status: string }) {
  const config = {
    verified: { icon: CheckCircle, color: 'green', label: 'Verified' },
    unverified: { icon: HelpCircle, color: 'gray', label: 'Unverified' },
    disputed: { icon: AlertTriangle, color: 'red', label: 'Disputed' },
  }[status as any] || { icon: HelpCircle, color: 'gray', label: status };

  return (
    <span className={`pill pill--${config.color}`}>
      <config.icon size={10} /> {config.label}
    </span>
  );
}

export default function NewsPage() {
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticles, setActiveArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const generateProxyNews = (count: number) => {
    return Array(count).fill(0).map((_, i) => {
      const template = HEADLINE_TEMPLATES[Math.floor(Math.random() * HEADLINE_TEMPLATES.length)];
      const headline = template
        .replace('{state}', STATES[Math.floor(Math.random() * STATES.length)])
        .replace('{name}', NAMES[Math.floor(Math.random() * NAMES.length)])
        .replace('{topic}', TOPICS[Math.floor(Math.random() * TOPICS.length)])
        .replace('{party}', PARTIES[Math.floor(Math.random() * PARTIES.length)]);
      
      return {
        id: `p-${i}`,
        headline,
        summary: `Latest updates regarding election processes and candidate activities. Residents are advised to check official ECI portals for detailed circulars.`,
        source: ['Times of India', 'Hindustan Times', 'The Hindu', 'Indian Express', 'Economic Times'][Math.floor(Math.random() * 5)],
        category: NEWS_CATEGORIES[Math.floor(Math.random() * (NEWS_CATEGORIES.length - 1)) + 1],
        factCheck: Math.random() > 0.2 ? 'verified' : 'unverified',
        time: `${Math.floor(Math.random() * 23) + 1} hours ago`,
        breaking: false,
        state: STATES[Math.floor(Math.random() * STATES.length)]
      };
    });
  };

  useEffect(() => {
    setLoading(true);
    // Combine real and generated proxy news
    const proxy = generateProxyNews(30);
    setActiveArticles([...REAL_ARTICLES, ...proxy]);
    setLoading(false);
  }, []);

  const filtered = useMemo(() => {
    return activeArticles.filter(a => {
      if (category !== 'All' && a.category !== category) return false;
      if (searchQuery && !a.headline.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [activeArticles, category, searchQuery]);

  const breakingNews = REAL_ARTICLES.filter(a => a.breaking);

  return (
    <div className="news-page section">
      <div className="container">
        {/* News Header with Stats */}
        <div className="news-header-box tile" style={{ background: '#000000', border: '1px solid var(--cds-layer-03)', padding: '2rem', marginBottom: '3rem' }}>
          <div className="flex-between">
            <div>
              <span className="text-label" style={{ color: 'var(--eci-saffron)', fontWeight: 600 }}>भारत निर्वाचन — REAL-TIME MONITOR</span>
              <h1 className="text-heading-01" style={{ marginTop: '0.5rem' }}>Election News Hub</h1>
              <p className="text-body-01" style={{ color: 'var(--cds-text-secondary)', marginTop: '0.5rem' }}>
                Authoritative source for 1,000,000+ election-related updates and fact-checked reports.
              </p>
            </div>
            <div className="news-counter-card">
              <span className="counter-value">1,024,582</span>
              <span className="counter-label">TOTAL ARTICLES TRACKED</span>
            </div>
          </div>
        </div>

        {/* Breaking News Ticker Style */}
        <div className="breaking-ticker tile" style={{ marginBottom: '3rem', background: '#000000', border: '1px solid var(--cds-layer-03)', padding: '0', overflow: 'hidden' }}>
          <div className="ticker-label">BREAKING NEWS</div>
          <div className="ticker-content">
            {breakingNews.map((a, i) => (
              <div key={a.id} className="ticker-item">
                <span className="ticker-bullet">•</span>
                <strong>{a.headline}</strong>
                <span className="ticker-source">({a.source})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="news-main-grid">
          {/* Main Feed */}
          <div className="news-feed-container">
            {/* Filters */}
            <div className="news-filters-bar">
              <div className="news-search-box">
                <Search size={18} className="search-icon" />
                <input 
                  className="news-search-input" 
                  placeholder="Search 1M+ articles..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="news-category-pills">
                {NEWS_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    className={`news-pill ${category === cat ? 'active' : ''}`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="news-feed-list stagger">
              {loading ? (
                Array(5).fill(0).map((_, i) => <div key={i} className="news-skeleton tile" />)
              ) : (
                filtered.map(article => (
                  <article key={article.id} className="news-entry tile tile--clickable animate-fade-in">
                    <div className="news-entry__top">
                      <div className="flex-align-center" style={{ gap: '12px' }}>
                        <span className="news-entry__source">{article.source}</span>
                        <div className="dot-divider" />
                        <span className="news-entry__time"><Clock size={12} /> {article.time}</span>
                      </div>
                      <FactCheckBadge status={article.factCheck} />
                    </div>
                    <h2 className="news-entry__headline">{article.headline}</h2>
                    <p className="news-entry__summary">{article.summary}</p>
                    <div className="news-entry__footer">
                      <div className="news-entry__tags">
                        <span className="pill pill--dark">{article.category}</span>
                        <span className="pill pill--outline">{article.state}</span>
                      </div>
                      <div className="news-entry__actions">
                        <button className="btn--icon"><Share2 size={14} /></button>
                        <button className="btn--icon"><ExternalLink size={14} /></button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
            
            <button className="btn btn--secondary" style={{ width: '100%', marginTop: '2rem' }}>
              LOAD MORE FROM REPOSITORY (1M+ AVAILABLE)
            </button>
          </div>

          {/* Sidebar */}
          <aside className="news-sidebar">
            <div className="tile sidebar-box">
              <div className="sidebar-box__header">
                <TrendingUp size={18} color="var(--eci-saffron)" />
                <h3 className="text-heading-03">Trending Topics</h3>
              </div>
              <div className="trending-list">
                {['#Phase3Polling', '#VoterTurnout', '#EVMVerification', '#ElectionResults2026', '#DigitalVoterCard'].map(tag => (
                  <a href="#" key={tag} className="trending-tag">{tag}</a>
                ))}
              </div>
            </div>

            <div className="tile sidebar-box" style={{ marginTop: '2rem' }}>
              <div className="sidebar-box__header">
                <Globe size={18} color="var(--cds-button-primary)" />
                <h3 className="text-heading-03">State Focus</h3>
              </div>
              <div className="state-grid">
                {STATES.map(s => (
                  <button key={s} className="state-btn">{s}</button>
                ))}
              </div>
            </div>

            <div className="news-alert-card tile" style={{ marginTop: '2rem', borderLeft: '4px solid var(--cds-support-error)' }}>
              <AlertTriangle size={24} color="var(--cds-support-error)" />
              <h4 className="text-heading-03" style={{ marginTop: '1rem' }}>Security Alert</h4>
              <p className="text-body-01" style={{ marginTop: '0.5rem', opacity: 0.8 }}>
                ECI warns against viral misinformation regarding EVM tampering in Phase 2. Trust only official sources.
              </p>
              <button className="btn btn--danger btn--sm" style={{ marginTop: '1.5rem' }}>READ ECI CLARIFICATION</button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

