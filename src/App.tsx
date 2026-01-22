import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { ProCoveragePage } from './pages/ProCoveragePage';
import { GearTechPage } from './pages/GearTechPage';
import { IndustryNewsPage } from './pages/IndustryNewsPage';
import { RideInspirationPage } from './pages/RideInspirationPage';
import { Navigation } from './components/Navigation';
import { SubscriptionModal } from './components/SubscriptionModal';

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

export function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ScrollToTop />
      <Navigation onOpenModal={openModal} />

      <Routes>
        <Route path="/" element={<LandingPage onOpenModal={openModal} />} />
        <Route path="/pro-coverage" element={<ProCoveragePage onOpenModal={openModal} />} />
        <Route path="/gear-tech" element={<GearTechPage onOpenModal={openModal} />} />
        <Route path="/industry-news" element={<IndustryNewsPage onOpenModal={openModal} />} />
        <Route path="/ride-inspiration" element={<RideInspirationPage onOpenModal={openModal} />} />
      </Routes>

      <SubscriptionModal isOpen={isModalOpen} onClose={closeModal} />
    </Router>
  );
}