import React, { useMemo } from 'react';
import { wealthVariants } from '../data/wealthData.ts';
import { getVisitSession, getActiveVariant } from '../utils/dynamicContent.ts';
import { ComplianceAuditBar } from '../components/ComplianceAuditBar.tsx';
import { Navbar } from '../components/Navbar.tsx';
import { Footer } from '../components/Footer.tsx';
import { TrendingUp, AlertTriangle, ShieldCheck, ArrowRight, Briefcase } from 'lucide-react';

export const WealthPage: React.FC = (): React.ReactNode => {
  const session = useMemo(() => getVisitSession(), []);
  const activeVariant = useMemo(
    () => getActiveVariant(wealthVariants, session.activeVariantId),
    [session.activeVariantId]
  );
  const content = activeVariant.content;

  return (
    <div className="page-shell">
      <ComplianceAuditBar
        session={session}
        flags={activeVariant.flags}
        complianceRating={activeVariant.complianceRating}
        riskLevel={activeVariant.riskLevel}
        variantSummary={activeVariant.summary}
      />

      <Navbar />

      <main className="main-content">
        {/* Page Hero */}
        <section className="page-hero">
          <div className="page-hero-container">
            <div className="hero-badge">
              <TrendingUp size={14} className="inline mr-1 text-indigo-400" />
              <span>{content.advisoryTitle}</span>
            </div>
            <h1 className="page-hero-title">{content.heroHeadline}</h1>
            <p className="page-hero-lead">{content.heroSubheadline}</p>

            {/* Prominent Capital At Risk Banner */}
            <div
              className={`risk-disclosure-banner ${
                activeVariant.id === 'high_risk_udaap'
                  ? 'risk-banner-egregious'
                  : 'risk-banner-compliant'
              }`}
            >
              <div className="risk-banner-icon">
                {activeVariant.id === 'high_risk_udaap' ? (
                  <AlertTriangle size={20} className="text-rose-400" />
                ) : (
                  <ShieldCheck size={20} className="text-amber-400" />
                )}
              </div>
              <div>
                <strong className="risk-banner-title">MANDATORY REGULATORY RISK NOTICE:</strong>
                <p className="risk-banner-text">{content.capitalAtRiskWarning}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Strategies Grid */}
        <section className="product-offers-section">
          <div className="offers-container">
            <div className="section-header">
              <h2 className="section-title">Institutional Wealth Portfolios</h2>
              <p className="section-subtitle">
                Fiduciary advisory strategies designed for asset preservation, cash flow, and growth.
              </p>
            </div>

            <div className="offers-grid">
              {content.portfolios.map((port): React.ReactNode => (
                <div key={port.id} className="offer-card">
                  <div className="offer-card-top">
                    <span className="offer-term-pill">{port.riskProfile} Profile</span>
                    <h3 className="offer-name">{port.strategyName}</h3>
                    <p className="offer-headline">{port.projectedReturnClaim}</p>
                  </div>

                  <div className="offer-rate-box">
                    <div className="rate-col">
                      <span className="rate-col-label">Historical Track Record</span>
                      <span className="rate-col-apr text-indigo-400 text-lg font-bold">
                        {port.historicalPerformanceSnippet}
                      </span>
                    </div>
                  </div>

                  <div className="offer-details-list">
                    <div className="detail-row">
                      <span>Minimum Investment:</span>
                      <strong>${port.minimumInvestment.toLocaleString()}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Advisory Fee:</span>
                      <strong>
                        {port.managementFeePercent === 0
                          ? '$0 Promo Management'
                          : `${port.managementFeePercent.toFixed(2)}% AUM Annual`}
                      </strong>
                    </div>
                    <div className="detail-row">
                      <span>Guarantee Status:</span>
                      <span
                        className={
                          port.guaranteeClaim.includes('Impossible')
                            ? 'text-rose-400 font-bold'
                            : 'text-slate-300'
                        }
                      >
                        {port.guaranteeClaim}
                      </span>
                    </div>
                  </div>

                  <div className="rep-example-box">
                    <p className="closing-disclaimer-text">{content.pastPerformanceCaveat}</p>
                  </div>

                  <div className="offer-action-row">
                    <button type="button" className="offer-btn-primary">
                      <span>Consult Private Wealth Advisor</span>
                      <ArrowRight size={14} className="inline ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEC / FINRA Compliance Guidance */}
        <section className="compliance-guidance-section">
          <div className="guidance-container">
            <div className="guidance-box">
              <div className="guidance-header">
                <Briefcase size={20} className="text-indigo-400" />
                <h3>FINRA Rule 2210 & SEC Investment Communications Checklist:</h3>
              </div>
              <ul className="guidance-list">
                <li>
                  <strong>Prohibition of Performance Guarantees:</strong> Under FINRA Rule 2210(d)(1)(D),
                  no financial marketing material may promise guaranteed returns or claim that investments
                  are "risk-free".
                </li>
                <li>
                  <strong>Interagency Nondeposit Investment Statement:</strong> Retail sales of securities
                  and wealth products MUST clearly state that they are NOT FDIC insured, NOT bank
                  guaranteed, and MAY lose value.
                </li>
                <li>
                  <strong>Past Performance Disclosure:</strong> Any historical performance or backtested
                  projection must be accompanied by the mandatory disclosure: "Past performance is no
                  guarantee of future results."
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer
        fdicText="Nondeposit investment and wealth management products are NOT FDIC INSURED, HAVE NO BANK GUARANTEE, and MAY LOSE VALUE."
        legalFootnote={content.secFinraDisclosure}
      />
    </div>
  );
};
