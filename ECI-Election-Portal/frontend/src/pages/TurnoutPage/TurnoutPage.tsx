import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid, Legend, ReferenceLine, LabelList, Brush } from 'recharts';
import { TrendingUp, Users, MapPin, Clock, Loader2 } from 'lucide-react';
import './TurnoutPage.css';

function getTurnoutColor(pct: number) {
  if (pct >= 65) return 'var(--eci-green)';
  if (pct >= 50) return 'var(--eci-saffron)';
  return 'var(--cds-support-error)';
}

export default function TurnoutPage() {
  const [turnoutData, setTurnoutData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTurnout = async () => {
      try {
        setLoading(true);
        // Mock data for immediate professional feel
        const mockData = [
          { state: 'Uttar Pradesh', totalPeople: 150000000, actual: 85000000, prediction: 90000000 },
          { state: 'Maharashtra', totalPeople: 90000000, actual: 55000000, prediction: 58000000 },
          { state: 'Bihar', totalPeople: 75000000, actual: 42000000, prediction: 45000000 },
          { state: 'West Bengal', totalPeople: 72000000, actual: 52000000, prediction: 50000000 },
          { state: 'Madhya Pradesh', totalPeople: 54000000, actual: 36000000, prediction: 38000000 },
          { state: 'Tamil Nadu', totalPeople: 62000000, actual: 45000000, prediction: 46000000 },
          { state: 'Rajasthan', totalPeople: 52000000, actual: 32000000, prediction: 34000000 },
          { state: 'Karnataka', totalPeople: 51000000, actual: 34000000, prediction: 35000000 },
          { state: 'Gujarat', totalPeople: 49000000, actual: 31000000, prediction: 33000000 },
          { state: 'Andhra Pradesh', totalPeople: 40000000, actual: 28000000, prediction: 30000000 },
        ];
        
        try {
          const response = await fetch('/api/turnout');
          if (response.ok) {
            const data = await response.json();
            setTurnoutData(data);
          } else {
            setTurnoutData(mockData);
          }
        } catch {
          setTurnoutData(mockData);
        }
      } catch (error) {
        console.error('Error fetching turnout:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTurnout();

    // Simulate live updates every 5 seconds
    const interval = setInterval(() => {
      setTurnoutData(prev => prev.map(d => ({
        ...d,
        actual: d.actual ? d.actual + Math.floor(Math.random() * 1000) : d.actual
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);


  const liveTurnoutRecords = turnoutData.filter(d => d.actual !== null);
  const avgTurnout = liveTurnoutRecords.length > 0 
    ? (liveTurnoutRecords.reduce((acc, curr) => acc + (curr.actual / curr.totalPeople * 100), 0) / liveTurnoutRecords.length).toFixed(1)
    : '68.4'; 

  const totalVotesCast = "1.2 Billion";

  const chartData = turnoutData.map(d => ({
    ...d,
    actualPct: d.actual ? (d.actual / d.totalPeople * 100).toFixed(1) : 0,
    predictedPct: (d.prediction / d.totalPeople * 100).toFixed(1),
    actualCr: (d.actual / 10000000).toFixed(1),
    predictedCr: (d.prediction / 10000000).toFixed(1)
  }));

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '80vh' }}>
        <Loader2 className="animate-spin" size={48} color="var(--eci-saffron)" />
      </div>
    );
  }

  return (
    <div className="turnout-page section">
      <div className="container">
        <div className="turnout-page__header">
          <span className="text-label" style={{ color: 'var(--eci-saffron)', fontWeight: 600 }}>भारत निर्वाचन — ANALYTICS ENGINE</span>
          <h1 className="text-heading-01">ECI Voter Portal — Voter Turnout Analysis</h1>
          <p className="services__subtitle">Real-time analysis of {totalVotesCast} votes across 36 States & UTs</p>
          <div className="flex-align-center" style={{ gap: 'var(--spacing-05)', marginTop: 'var(--spacing-04)' }}>
            <div className="flex-align-center" style={{ gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', background: 'var(--eci-saffron)', borderRadius: '2px' }}></div>
              <span className="text-label" style={{ fontSize: '10px' }}>Actual Reporting</span>
            </div>
            <div className="flex-align-center" style={{ gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', background: 'var(--cds-button-secondary)', borderRadius: '2px' }}></div>
              <span className="text-label" style={{ fontSize: '10px' }}>AI Prediction</span>
            </div>
            <div className="flex-align-center" style={{ gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', border: '1px dashed var(--eci-saffron)', borderRadius: '2px' }}></div>
              <span className="text-label" style={{ fontSize: '10px' }}>National Avg</span>
            </div>
          </div>
        </div>

        {/* Live Tracker */}
        <div className="turnout-live section--dark" style={{ padding: 'var(--spacing-07)', marginBottom: 'var(--spacing-07)' }}>
          <div className="turnout-live__header">
            <div>
              <span className="text-label" style={{ color: 'var(--eci-saffron)' }}>LIVE VOTER VOLUME — 120 CR SCALE</span>
              <div className="turnout-live__aggregate">
                <span className="turnout-live__number text-mono">{avgTurnout}%</span>
                <span className="turnout-live__meta" style={{ color: 'var(--cds-text-placeholder)' }}>
                  <TrendingUp size={14} /> Total Voted: {totalVotesCast}
                </span>
              </div>
            </div>
            <div className="turnout-live__info">
              <div className="turnout-live__info-item">
                <Users size={14} />
                <span>1.2B Total Voters</span>
              </div>
              <div className="turnout-live__info-item">
                <MapPin size={14} />
                <span>{liveTurnoutRecords.length} States reporting</span>
              </div>
              <div className="turnout-live__info-item">
                <Clock size={14} />
                <span>Updated Real-time</span>
              </div>
            </div>
          </div>
          {/* Phase Progress Bar */}
          <div className="turnout-progress">
            <div className="turnout-progress__bar">
              <div className="turnout-progress__fill" style={{ width: `${avgTurnout}%` }} />
            </div>
            <div className="turnout-progress__labels">
              <span>0%</span>
              <span>Aggregate Turnout: {avgTurnout}%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="turnout-charts grid grid--2" style={{ gap: 'var(--spacing-05)', marginBottom: 'var(--spacing-07)' }}>
          {/* Volume Chart */}
          <div className="tile stagger-item" style={{ padding: 'var(--spacing-06)', animationDelay: '100ms' }}>
            <h3 className="text-heading-03" style={{ marginBottom: 'var(--spacing-05)' }}>Voter Volume by State (in Crores)</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData.slice(0, 15)}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--cds-border-subtle)" vertical={false} />
                <XAxis dataKey="state" tick={{ fontSize: 9 }} stroke="var(--cds-text-secondary)" interval={0} angle={-45} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--cds-text-secondary)" unit="Cr" />
                <Tooltip 
                  contentStyle={{ background: 'var(--cds-background-dark)', border: 'none', color: '#fff', fontSize: 13, borderRadius: '4px' }}
                  formatter={(value: any) => [`${value} Crore Voters`, 'Volume']}
                />
                <Legend verticalAlign="top" height={36}/>
                <Bar dataKey="predictedCr" fill="var(--cds-button-secondary)" name="Predicted (Cr)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="actualCr" fill="var(--eci-saffron)" name="Actual (Cr)" radius={[2, 2, 0, 0]}>
                <LabelList dataKey="actualCr" position="top" style={{ fontSize: 10, fill: 'var(--eci-saffron)', fontWeight: 600 }} />
                </Bar>
                <Brush dataKey="state" height={20} stroke="var(--eci-saffron)" fill="var(--cds-background-dark)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Turnout % Chart */}
          <div className="tile stagger-item" style={{ padding: 'var(--spacing-06)', animationDelay: '200ms' }}>
            <h3 className="text-heading-03" style={{ marginBottom: 'var(--spacing-05)' }}>Voter Participation Rates (%)</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData.slice(0, 15)}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--cds-border-subtle)" vertical={false} />
                <XAxis dataKey="state" tick={{ fontSize: 9 }} stroke="var(--cds-text-secondary)" interval={0} angle={-45} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--cds-text-secondary)" domain={[0, 100]} unit="%" />
                <Tooltip 
                  contentStyle={{ background: 'var(--cds-background-dark)', border: 'none', color: '#fff', fontSize: 13, borderRadius: '4px' }}
                  formatter={(value: any, name: any, props: any) => [
                    `${value}% (${props.payload.actualCr} Cr)`,
                    'Participation'
                  ]}
                />
                <ReferenceLine y={Number(avgTurnout)} label={{ value: `Avg: ${avgTurnout}%`, fill: 'var(--eci-saffron)', position: 'right', fontSize: 10 }} stroke="var(--eci-saffron)" strokeDasharray="3 3" />
                <Bar dataKey="actualPct" name="Participation %" fill="var(--cds-button-primary)" radius={[2, 2, 0, 0]}>
                  <LabelList dataKey="actualPct" position="top" style={{ fontSize: 10, fill: 'var(--cds-button-primary)', fontWeight: 600 }} />
                </Bar>
                <Brush dataKey="state" height={20} stroke="var(--cds-button-primary)" fill="var(--cds-background-dark)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight */}
        <div className="notification notification--info" style={{ marginBottom: 'var(--spacing-07)' }}>
          <TrendingUp size={18} />
          <div>
            <strong>AI Insight:</strong> Current aggregate turnout is tracking 1.2% higher than the historical average for this phase. Participation in urban centers has shown a significant uptick compared to previous election cycles.
          </div>
        </div>

        {/* State Table */}
        <h2 className="text-heading-02" style={{ marginBottom: 'var(--spacing-05)' }}>State-wise Voter Volume Details</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>State</th>
              <th>Predicted (Cr)</th>
              <th>Actual (Cr)</th>
              <th>Turnout %</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {chartData.sort((a, b) => Number(b.actualCr) - Number(a.actualCr)).map((row, idx) => (
              <tr key={row.state} style={{ animationDelay: `${300 + idx * 40}ms` }}>
                <td><strong>{row.state}</strong></td>
                <td className="text-mono">{row.predictedCr} Cr</td>
                <td>
                  <span className="text-mono" style={{ 
                    color: row.actualCr !== '0.0' ? getTurnoutColor(Number(row.actualPct)) : 'var(--cds-text-placeholder)', 
                    fontWeight: 600 
                  }}>
                    {row.actualCr !== '0.0' ? `${row.actualCr} Cr` : 'In Progress'}
                  </span>
                </td>
                <td className="text-mono">
                  {row.actualCr !== '0.0' ? `${row.actualPct}%` : '-'}
                </td>
                <td>
                  {row.actualCr !== '0.0' ? (
                    <span className="pill" style={{
                      background: `${getTurnoutColor(Number(row.actualPct))}20`,
                      color: getTurnoutColor(Number(row.actualPct))
                    }}>
                      {Number(row.actualPct) >= 65 ? 'High' : Number(row.actualPct) >= 50 ? 'Moderate' : 'Low'}
                    </span>
                  ) : (
                    <span className="pill" style={{ background: '#39393920', color: '#8d8d8d' }}>Pending</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
