import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TricolorBar from './components/layout/TricolorBar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Chatbot from './components/chatbot/Chatbot';
import CommandPalette from './components/common/CommandPalette';
import './styles/global.css';

// Lazy load pages for performance
const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const CandidatesPage = lazy(() => import('./pages/CandidatesPage/CandidatesPage'));
const ConstituencyPage = lazy(() => import('./pages/ConstituencyPage/ConstituencyPage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage/ResultsPage'));
const TurnoutPage = lazy(() => import('./pages/TurnoutPage/TurnoutPage'));
const NewsPage = lazy(() => import('./pages/NewsPage/NewsPage'));
const GrievancePage = lazy(() => import('./pages/GrievancePage/GrievancePage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage/RegisterPage'));
const VerifyPage = lazy(() => import('./pages/VerifyPage/VerifyPage'));

// Loading component
const PageLoader = () => (
  <div style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      style={{ width: 40, height: 40, border: '4px solid #f3f3f3', borderTop: '4px solid #0f62fe', borderRadius: '50%' }}
    />
  </div>
);

function AppContent() {
  const location = useLocation();

  return (
    <div className="app-container">
      <TricolorBar />
      <Header />
      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.2, 0, 0.38, 0.9] }}
          >
            <Suspense fallback={<PageLoader />}>
              <Routes location={location}>
                <Route path="/" element={<HomePage />} />
                <Route path="/candidates" element={<CandidatesPage />} />
                <Route path="/constituency" element={<ConstituencyPage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/turnout" element={<TurnoutPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/grievance" element={<GrievancePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify" element={<VerifyPage />} />
              </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <Chatbot />
      <CommandPalette />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
