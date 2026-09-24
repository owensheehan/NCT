import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Landmark, TrendingUp, ChevronRight, Lock } from 'lucide-react';

interface NavbarProps {
  rates?: Array<{ label: string; rate: string; sub: string }>;
}

export const Navbar: React.FC<NavbarProps> = ({ rates }): React.ReactNode => {
  const location = useLocation();

  const navLinks = [
    { label: 'Overview', path: '/' },
    { label: 'Mortgages & Rates', path: '/mortgages' },
    { label: 'Credit Cards', path: '/credit-cards' },
    { label: 'Savings & CDs', path: '/savings' },
    { label: 'Wealth Advisory', path: '/wealth' },
    { label: 'Commercial Lending', path: '/business-loans' },
    { label: 'Legal Disclosures', path: '/disclosures' },
  ];

  const defaultRates = [
    { label: '30Y Conforming', rate: '6.240% APR', sub: 'Fixed' },
    { label: 'High-Yield Savings', rate: '5.15% APY', sub: 'Variable' },
    { label: '14-Mo CD', rate: '5.35% APY', sub: 'Guaranteed' },
    { label: 'Cash Rewards Card', rate: '0% Intro APR', sub: '15 billing cycles' },
    { label: 'Wall Street Prime', rate: '8.50%', sub: 'Federal Reserve' },
  ];

  const displayRates = rates && rates.length > 0 ? rates : defaultRates;

  return (
    <header className="navbar-wrapper">
      {/* Live Financial Rates Ticker Sub-bar */}
      <div className="ticker-bar">
        <div className="ticker-label">
          <TrendingUp size={12} className="inline mr-1 text-emerald-400" />
          <span>LIVE MARKET RATES:</span>
        </div>
        <div className="ticker-scroll">
          <div className="ticker-track">
            {displayRates.map((item, index: number): React.ReactNode => (
              <div key={index} className="ticker-item">
                <span className="ticker-name">{item.label}:</span>
                <span className="ticker-val">{item.rate}</span>
                <span className="ticker-sub">({item.sub})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Bank Navigation Header */}
      <nav className="navbar-main">
        <div className="navbar-container">
          <Link to="/" className="brand-logo" aria-label="Apex Horizon Bank Home">
            <div className="brand-icon">
              <Landmark size={24} />
            </div>
            <div className="brand-text">
              <span className="brand-title">APEX HORIZON</span>
              <span className="brand-subtitle">BANK & TRUST • N.A.</span>
            </div>
          </Link>

          <ul className="nav-menu">
            {navLinks.map((item): React.ReactNode => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path} className="nav-item">
                  <Link
                    to={item.path}
                    className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="nav-actions">
            <Link to="/mortgages" className="nav-btn-secondary">
              <Lock size={13} className="inline mr-1 text-slate-400" />
              <span>Lock Rate</span>
            </Link>
            <Link to="/savings" className="nav-btn-primary">
              <span>Open Account</span>
              <ChevronRight size={14} className="inline ml-1" />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};
