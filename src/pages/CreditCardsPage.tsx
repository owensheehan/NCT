import React, { useMemo } from 'react';
import { creditCardVariants } from '../data/creditCardsData.ts';
import { getVisitSession, getActiveVariant } from '../utils/dynamicContent.ts';
import { ComplianceAuditBar } from '../components/ComplianceAuditBar.tsx';
import { Navbar } from '../components/Navbar.tsx';
import { Footer } from '../components/Footer.tsx';
import { SchumerBox } from '../components/SchumerBox.tsx';
import { CreditCard, AlertTriangle, ShieldCheck, ArrowRight, Gift } from 'lucide-react';

export const CreditCardsPage: React.FC = (): React.ReactNode => {
  const session = useMemo(() => getVisitSession(), []);
  const activeVariant = useMemo(
    () => getActiveVariant(creditCardVariants, session.activeVariantId),
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
              <CreditCard size={14} className="inline mr-1 text-cyan-400" />
              <span>Consumer Credit Solutions</span>
            </div>
            <h1 className="page-hero-title">{content.heroHeadline}</h1>
            <p className="page-hero-lead">{content.heroSubheadline}</p>

            <div className="rates-notice-card">
              <p className="rates-notice-text">{content.promoBanner}</p>
              <p className="rates-apr-note">{content.representativeAprExample}</p>
            </div>
          </div>
        </section>

        {/* Card Offer Showcase */}
        <section className="product-offers-section">
          <div className="offers-container">
            <div className="section-header">
              <h2 className="section-title">Consumer Credit Card Portfolio</h2>
              <p className="section-subtitle">
                Compare rewards, introductory balance transfer rates, and annual fee schedules.
              </p>
            </div>

            <div className="card-offers-grid">
              {content.cards.map((card): React.ReactNode => (
                <div key={card.id} className="credit-card-item">
                  <div className="credit-card-visual">
                    <div className="card-chip-sim"></div>
                    <div className="card-brand-sim">APEX HORIZON</div>
                    <div className="card-tier-tag">{card.tier}</div>
                    <div className="card-name-display">{card.name}</div>
                  </div>

                  <div className="card-info-pane">
                    <h3 className="card-title">{card.name}</h3>
                    <p className="card-headline">{card.headline}</p>

                    <div className="card-specs-grid">
                      <div className="spec-box">
                        <span className="spec-label">Introductory APR:</span>
                        <strong className="spec-val text-emerald-400">{card.introApr}</strong>
                      </div>
                      <div className="spec-box">
                        <span className="spec-label">Standard Variable APR:</span>
                        <strong className="spec-val">{card.regularAprRange}</strong>
                      </div>
                      <div className="spec-box">
                        <span className="spec-label">Annual Fee:</span>
                        <strong className="spec-val">
                          {card.annualFee === 0 ? '$0 Intro Fee' : `$${card.annualFee}`}
                        </strong>
                      </div>
                      <div className="spec-box">
                        <span className="spec-label">Balance Transfer Fee:</span>
                        <span className="spec-val-sm">{card.balanceTransferFeeClaim}</span>
                      </div>
                    </div>

                    <div className="card-rewards-box">
                      <Gift size={16} className="text-amber-400 mr-2 flex-shrink-0" />
                      <span>{card.rewardsClaim}</span>
                    </div>

                    {card.guaranteedApprovalClaim && (
                      <div className="deceptive-guarantee-warning">
                        <AlertTriangle size={16} className="text-rose-400 mr-1 inline" />
                        <span>Deceptive Claim: CARD Act strictly forbids unconditional approval claims.</span>
                      </div>
                    )}

                    <div className="card-action-row">
                      <button type="button" className="offer-btn-primary">
                        <span>Apply Online Now</span>
                        <ArrowRight size={14} className="inline ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Standardized Schumer Box Section */}
        <section className="schumer-section">
          <div className="schumer-wrapper">
            <SchumerBox
              provided={content.cards[0]?.schumerBoxProvided ?? false}
              introApr={content.cards[0]?.introApr ?? '0% Intro'}
              regularAprRange={content.cards[0]?.regularAprRange ?? '18.24% – 28.99% Variable'}
              annualFee={content.cards[0]?.annualFee ?? 0}
              balanceTransferFee={content.cards[0]?.balanceTransferFeeClaim ?? '3% ($5 min)'}
              penaltyAprWarning={content.penaltyAprWarning}
              lateFeeDisclaimer={content.lateFeeDisclaimer}
            />
          </div>
        </section>

        {/* Regulatory Guidance Box */}
        <section className="compliance-guidance-section">
          <div className="guidance-container">
            <div className="guidance-box">
              <div className="guidance-header">
                <ShieldCheck size={20} className="text-emerald-400" />
                <h3>Credit CARD Act of 2009 Compliance Inspection Criteria:</h3>
              </div>
              <ul className="guidance-list">
                <li>
                  <strong>12 CFR § 1026.60 Tabular Disclosures:</strong> Solicitations and applications
                  must provide a prominent Schumer Box table itemizing purchase APRs, balance transfer
                  fees, penalty APR triggers, and late fees.
                </li>
                <li>
                  <strong>Ability-to-Pay Rule (12 CFR § 1026.51):</strong> Issuers cannot guarantee
                  approval or extend credit without underwriting the consumer's independent ability
                  to make required payments.
                </li>
                <li>
                  <strong>Clear Promotional Expiration:</strong> Solicitations offering 0% intro APR
                  must state the exact duration (e.g., "15 billing cycles") and the post-introductory
                  variable APR range that will take effect.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer legalFootnote={content.cardActNotice} />
    </div>
  );
};
