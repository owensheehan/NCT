import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HomePage } from './pages/HomePage.tsx';
import { MortgagesPage } from './pages/MortgagesPage.tsx';
import { CreditCardsPage } from './pages/CreditCardsPage.tsx';
import { SavingsPage } from './pages/SavingsPage.tsx';
import { WealthPage } from './pages/WealthPage.tsx';
import { BusinessLoansPage } from './pages/BusinessLoansPage.tsx';
import { DisclosuresPage } from './pages/DisclosuresPage.tsx';

const ScrollToTop: React.FC = (): null => {
  const { pathname } = useLocation();

  useEffect((): void => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
};

export const App: React.FC = (): React.ReactNode => {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mortgages" element={<MortgagesPage />} />
        <Route path="/credit-cards" element={<CreditCardsPage />} />
        <Route path="/savings" element={<SavingsPage />} />
        <Route path="/wealth" element={<WealthPage />} />
        <Route path="/business-loans" element={<BusinessLoansPage />} />
        <Route path="/disclosures" element={<DisclosuresPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
