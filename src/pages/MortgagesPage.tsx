import React, { useMemo } from 'react';
import { mortgageVariants } from '../data/mortgagesData.ts';
import { getVisitSession, getActiveVariant } from '../utils/dynamicContent.ts';
import { ComplianceAuditBar } from '../components/ComplianceAuditBar.tsx';
import { Navbar } from '../components/Navbar.tsx';
import { Footer } from '../components/Footer.tsx';
import { RateCalculator } from '../components/RateCalculator.tsx';
import { Home, Percent, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

export const MortgagesPage: React.FC = (): React.ReactNode => {
  const session = useMemo(() => getVisitSession(), []);
  const activeVariant = useMemo(
    () => getActiveVariant(mortgageVariants, session.activeVariantId),
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
              <Home size={14} className="inline mr-1 text-emerald-400" />
              <span>{content.promoBadge}</span>
            </div>
            <h1 className="page-hero-title">{content.heroHeadline}</h1>
            <p className="page-hero-lead">{content.heroSubheadline}</p>

            <div className="rates-notice-card">
              <p className="rates-notice-text">{content.ratesNotice}</p>
              <p className="rates-apr-note">{content.aprClarificationNote}</p>
            </div>
          </div>
        </section>

        {/* Product Offers Section */}
        <section className="product-offers-section">
          <div className="offers-container">
            <div className="section-header">
              <h2 className="section-title">Featured Residential Mortgage Programs</h2>
              <p className="section-subtitle">
                Compare fixed and adjustable loan programs with transparent monthly payment
                amortization schedules.
              </p>
            </div>

            <div className="offers-grid">
              {content.offers.map((offer): React.ReactNode => (
                <div key={offer.id} className="offer-card">
                  <div className="offer-card-top">
                    <span className="offer-term-pill">{offer.termYears}-Year Term</span>
                    <h3 className="offer-name">{offer.name}</h3>
                    <p className="offer-headline">{offer.headline}</p>
                  </div>

                  {/* Rate & APR Comparison Display */}
                  <div className="offer-rate-box">
                    <div className="rate-col">
                      <span className="rate-col-label">Note Rate</span>
                      <span className="rate-col-num">{offer.interestRate.toFixed(3)}%</span>
                    </div>

                    <div className="rate-col">
                      <span className="rate-col-label">Annual Percentage Rate</span>
                      {offer.apr !== null ? (
                        <span className="rate-col-apr text-emerald-400">
                          {offer.apr.toFixed(3)}% APR
                        </span>
                      ) : (
                        <span className="rate-col-apr-missing text-rose-400" title="Missing required APR">
                          [APR Not Disclosed]
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="offer-details-list">
                    <div className="detail-row">
                      <span>Monthly Payment (P&I):</span>
                      <strong>${offer.monthlyPaymentEstimate.toLocaleString('en-US', { minimumFractionDigits: 2 })}/mo</strong>
                    </div>
                    <div className="detail-row">
                      <span>Down Payment Requirement:</span>
                      <strong>{offer.downPaymentPercent}% down</strong>
                    </div>
                    <div className="detail-row">
                      <span>Closing Costs:</span>
                      <span>{offer.closingCostsClaim}</span>
                    </div>
                    {offer.closingCostsDisclaimer && (
                      <p className="closing-disclaimer-text">{offer.closingCostsDisclaimer}</p>
                    )}
                  </div>

                  {/* TILA Trigger Term Representative Example */}
                  {offer.representativeExample ? (
                    <div className="rep-example-box">
                      <div className="rep-example-title">
                        <ShieldCheck size={14} className="text-emerald-400 mr-1 inline" />
                        <span>Representative TILA Example:</span>
                      </div>
                      <p className="rep-example-text">{offer.representativeExample}</p>
                    </div>
                  ) : (
                    <div className="rep-example-omitted">
                      <AlertCircle size={14} className="text-rose-400 mr-1 inline" />
                      <span>Note: Representative repayment terms omitted from this offer card.</span>
                    </div>
                  )}

                  <div className="offer-action-row">
                    <button type="button" className="offer-btn-primary">
                      <span>Check Qualification</span>
                      <ArrowRight size={14} className="inline ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Rate & Amortization Calculator */}
        <section className="calculator-section">
          <div className="calc-container">
            <RateCalculator
              initialNoteRate={content.offers[0]?.interestRate ?? 6.125}
              initialApr={content.offers[0]?.apr ?? null}
              triggerTermsDisclosed={content.offers[0]?.triggerTermsDisclosed ?? true}
            />
          </div>
        </section>

        {/* Regulatory Examination Guidance */}
        <section className="compliance-guidance-section">
          <div className="guidance-container">
            <div className="guidance-box">
              <div className="guidance-header">
                <Percent size={20} className="text-cyan-400" />
                <h3>Truth in Lending Act (TILA / Reg Z) Compliance Inspection Checklist:</h3>
              </div>
              <ul className="guidance-list">
                <li>
                  <strong>12 CFR § 1026.24(d) Trigger Terms:</strong> Any mention of monthly payment
                  (e.g., "${content.offers[0]?.monthlyPaymentEstimate.toFixed(0)}/mo") or down payment
                  (e.g., "{content.offers[0]?.downPaymentPercent}% down") strictly triggers the requirement
                  to state the terms of repayment and the APR.
                </li>
                <li>
                  <strong>APR Conspicuousness:</strong> The Annual Percentage Rate must be stated at least
                  as conspicuously as the simple interest rate (no tiny font disparities or buried footnotes).
                </li>
                <li>
                  <strong>Equal Housing Opportunity:</strong> Depository lenders must display the Equal
                  Housing Lender logo and statement. Current state:{' '}
                  <span className={content.equalHousingLogoVisible ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                    {content.equalHousingLogoVisible ? 'Displayed' : 'Omitted (Non-Compliant)'}
                  </span>.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer
        showEqualHousingLogo={content.equalHousingLogoVisible}
        legalFootnote={content.legalFootnote}
      />
    </div>
  );
};
