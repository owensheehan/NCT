import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { homeVariants } from '../data/homeData.ts';
import { getVisitSession, getActiveVariant } from '../utils/dynamicContent.ts';
import { ComplianceAuditBar } from '../components/ComplianceAuditBar.tsx';
import { Navbar } from '../components/Navbar.tsx';
import { Footer } from '../components/Footer.tsx';
import {
  Home,
  PiggyBank,
  CreditCard,
  TrendingUp,
  Building2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Bot,
  SearchCheck,
  FileSpreadsheet,
} from 'lucide-react';

export const HomePage: React.FC = (): React.ReactNode => {
  const session = useMemo(() => getVisitSession(), []);
  const activeVariant = useMemo(
    () => getActiveVariant(homeVariants, session.activeVariantId),
    [session.activeVariantId]
  );
  const content = activeVariant.content;

  const renderIcon = (name: string): React.ReactNode => {
    switch (name) {
      case 'Home':
        return <Home size={24} className="text-emerald-400" />;
      case 'PiggyBank':
        return <PiggyBank size={24} className="text-amber-400" />;
      case 'CreditCard':
        return <CreditCard size={24} className="text-cyan-400" />;
      case 'TrendingUp':
        return <TrendingUp size={24} className="text-indigo-400" />;
      case 'Building2':
        return <Building2 size={24} className="text-purple-400" />;
      default:
        return <ShieldCheck size={24} className="text-emerald-400" />;
    }
  };

  return (
    <div className="page-shell">
      {/* Dynamic Compliance Auditor Bar */}
      <ComplianceAuditBar
        session={session}
        flags={activeVariant.flags}
        complianceRating={activeVariant.complianceRating}
        riskLevel={activeVariant.riskLevel}
        variantSummary={activeVariant.summary}
      />

      <Navbar rates={content.tickerRates} />

      <main className="main-content">
        {/* Dynamic Promotional / Compliance Hero */}
        <section className="hero-section">
          <div className="hero-container">
            <div className="hero-badge">
              <Sparkles size={14} className="inline mr-1 text-emerald-400" />
              <span>{content.campaignHero.badge}</span>
            </div>

            <h1 className="hero-heading">{content.campaignHero.headline}</h1>
            <p className="hero-lead">{content.campaignHero.subheadline}</p>

            <div className="hero-cta-group">
              <Link to={content.campaignHero.primaryCtaLink} className="hero-btn-primary">
                <span>{content.campaignHero.primaryCtaText}</span>
                <ArrowRight size={16} className="inline ml-1" />
              </Link>
              <Link to={content.campaignHero.secondaryCtaLink} className="hero-btn-secondary">
                <span>{content.campaignHero.secondaryCtaText}</span>
              </Link>
            </div>

            {/* Featured Hero Rate Card */}
            <div className="hero-rate-card">
              <div className="rate-card-content">
                <span className="rate-card-label">{content.campaignHero.featuredRateLabel}</span>
                <span className="rate-card-value">{content.campaignHero.featuredRateValue}</span>
                <p className="rate-card-disclaimer">{content.campaignHero.disclaimer}</p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Compliance Platform Inspection Callout */}
        <section className="inspection-callout-section">
          <div className="inspection-container">
            <div className="inspection-card">
              <div className="inspection-badge">
                <Bot size={16} className="text-cyan-400" />
                <span>AI Automated Compliance Crawler Target Ready</span>
              </div>
              <h2 className="inspection-title">
                Multi-Vertical Banking Marketing Compliance Testbed
              </h2>
              <p className="inspection-desc">
                This marketing portal dynamically rotates text, disclosures, interest rates, and
                regulatory trigger terms across multiple banking disciplines. Point your compliance
                AI bot at any of the pages below to test automated detection of TILA Reg Z, CARD Act,
                TISA Reg DD, SEC/FINRA, and CFPB UDAAP marketing violations.
              </p>

              <div className="inspection-metrics-row">
                <div className="metric-box">
                  <span className="metric-label">Active Scenario:</span>
                  <span className="metric-val">{activeVariant.label}</span>
                </div>
                <div className="metric-box">
                  <span className="metric-label">Risk Category:</span>
                  <span className={`metric-val risk-text-${activeVariant.riskLevel.toLowerCase()}`}>
                    {activeVariant.riskLevel} RISK
                  </span>
                </div>
                <div className="metric-box">
                  <span className="metric-label">Benchmark Violations:</span>
                  <span className="metric-val text-amber-400">{activeVariant.flags.length} Detectable</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Verticals Grid */}
        <section className="pillars-section">
          <div className="pillars-container">
            <div className="section-header">
              <h2 className="section-title">Core Banking & Financing Verticals</h2>
              <p className="section-subtitle">
                Each product vertical contains dynamic copy variations simulating real-world marketing
                campaigns and regulatory edge cases.
              </p>
            </div>

            <div className="pillars-grid">
              {content.pillars.map((pillar, idx: number): React.ReactNode => (
                <div key={idx} className="pillar-card">
                  <div className="pillar-top">
                    <div className="pillar-icon">{renderIcon(pillar.icon)}</div>
                    <span className="pillar-tag">{pillar.tag}</span>
                  </div>
                  <h3 className="pillar-title">{pillar.title}</h3>
                  <p className="pillar-desc">{pillar.description}</p>
                  <Link to={pillar.link} className="pillar-link">
                    <span>Inspect Vertical</span>
                    <ArrowRight size={14} className="inline ml-1" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Regulatory Scope Explanation */}
        <section className="reg-scope-section">
          <div className="reg-scope-container">
            <div className="reg-scope-card">
              <div className="scope-header">
                <SearchCheck size={24} className="text-emerald-400" />
                <h3 className="scope-title">What the AI Compliance Inspector Should Test:</h3>
              </div>
              <div className="scope-grid">
                <div className="scope-col">
                  <h4>1. Truth in Lending (TILA / Reg Z)</h4>
                  <p>
                    Check whether trigger terms (monthly payment amounts, down payment percentages,
                    loan period) are accompanied by clear and conspicuous Annual Percentage Rates
                    (APR). Ensure APR is as prominent as nominal interest rate.
                  </p>
                </div>
                <div className="scope-col">
                  <h4>2. CARD Act & Consumer Credit</h4>
                  <p>
                    Verify presence of standardized Schumer Box table, clear expiration dates on 0%
                    promotional introductory rates, and conspicuous penalty APR triggers.
                  </p>
                </div>
                <div className="scope-col">
                  <h4>3. Truth in Savings (TISA / Reg DD)</h4>
                  <p>
                    Ensure Annual Percentage Yield (APY) is used, minimum balance to obtain APY is
                    stated, fees reducing earnings are disclosed, and statutory $250k FDIC limits
                    are respected.
                  </p>
                </div>
                <div className="scope-col">
                  <h4>4. Unfair & Deceptive Acts (CFPB UDAAP)</h4>
                  <p>
                    Detect promises of "100% Guaranteed Approval", unsubstantiated claims of "Zero
                    Fees", deceptive introductory teaser traps, or calling investment products "risk-free".
                  </p>
                </div>
              </div>
              <div className="scope-footer-action">
                <Link to="/disclosures" className="scope-btn">
                  <FileSpreadsheet size={16} className="inline mr-2" />
                  <span>View Full Statutory Disclosures & Compliance Archive</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer
        showEqualHousingLogo={true}
        legalFootnote={content.campaignHero.disclaimer}
      />
    </div>
  );
};
