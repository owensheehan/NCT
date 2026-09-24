import React, { useMemo } from 'react';
import { businessLoansVariants } from '../data/businessLoansData.ts';
import { getVisitSession, getActiveVariant } from '../utils/dynamicContent.ts';
import { ComplianceAuditBar } from '../components/ComplianceAuditBar.tsx';
import { Navbar } from '../components/Navbar.tsx';
import { Footer } from '../components/Footer.tsx';
import { Building2, ArrowRight, ShieldCheck } from 'lucide-react';

export const BusinessLoansPage: React.FC = (): React.ReactNode => {
  const session = useMemo(() => getVisitSession(), []);
  const activeVariant = useMemo(
    () => getActiveVariant(businessLoansVariants, session.activeVariantId),
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
              <Building2 size={14} className="inline mr-1 text-purple-400" />
              <span>Commercial & Small Business Finance</span>
            </div>
            <h1 className="page-hero-title">{content.heroHeadline}</h1>
            <p className="page-hero-lead">{content.heroSubheadline}</p>

            <div className="rates-notice-card">
              <p className="rates-notice-text">{content.commercialBanner}</p>
              <p className="rates-apr-note">{content.guaranteeNotice}</p>
            </div>
          </div>
        </section>

        {/* Commercial Loan Offers Grid */}
        <section className="product-offers-section">
          <div className="offers-container">
            <div className="section-header">
              <h2 className="section-title">Commercial Lending & Working Capital Facilities</h2>
              <p className="section-subtitle">
                Compare revolving lines of credit, machinery term loans, and structured business capital.
              </p>
            </div>

            <div className="offers-grid">
              {content.loans.map((loan): React.ReactNode => (
                <div key={loan.id} className="offer-card">
                  <div className="offer-card-top">
                    <span className="offer-term-pill">{loan.facilityType}</span>
                    <h3 className="offer-name">{loan.productName}</h3>
                    <p className="offer-headline">Pricing Quoted As: {loan.rateQuotedAs}</p>
                  </div>

                  <div className="offer-rate-box">
                    <div className="rate-col">
                      <span className="rate-col-label">Quoted Rate / Fee</span>
                      <span className="rate-col-apr text-purple-400 font-bold text-2xl">
                        {loan.rateDisplay}
                      </span>
                    </div>
                  </div>

                  <div className="offer-details-list">
                    <div className="detail-row">
                      <span>Effective Annual Percentage Rate:</span>
                      <strong className="text-emerald-400">{loan.estimatedEffectiveApr}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Personal Guarantee Obligation:</span>
                      <strong>
                        {loan.personalGuaranteeRequired
                          ? 'Required for ≥20% Business Owners'
                          : 'Advertised as Unsecured (Verify Recourse)'}
                      </strong>
                    </div>
                    <div className="detail-row">
                      <span>Prepayment Policy:</span>
                      <span>{loan.prepaymentPenaltyClaim}</span>
                    </div>
                    <div className="detail-row">
                      <span>Underwriting Decision Speed:</span>
                      <span>{loan.approvalSpeedClaim}</span>
                    </div>
                  </div>

                  <div className="rep-example-box">
                    <p className="closing-disclaimer-text">{content.sb1235CommercialDisclosure}</p>
                  </div>

                  <div className="offer-action-row">
                    <button type="button" className="offer-btn-primary">
                      <span>Request Commercial Proposal</span>
                      <ArrowRight size={14} className="inline ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Commercial Financing Disclosure Guidance */}
        <section className="compliance-guidance-section">
          <div className="guidance-container">
            <div className="guidance-box">
              <div className="guidance-header">
                <ShieldCheck size={20} className="text-emerald-400" />
                <h3>Commercial Financing Disclosure & ECOA Inspection Checklist:</h3>
              </div>
              <ul className="guidance-list">
                <li>
                  <strong>Commercial Financing Disclosure Laws (CA SB 1235 / NY CFDL):</strong> Lenders
                  offering commercial financing under $2,500,000 must disclose total finance charges,
                  annualized APR, and payment amounts in standardized disclosure formats.
                </li>
                <li>
                  <strong>Factor Rate Obfuscation:</strong> Advertising a "1.15 Factor Rate" as a "15% interest
                  rate" misleads borrowers because factor rates do not account for principal reduction over time,
                  often resulting in annualized APRs of 50% to 100%+.
                </li>
                <li>
                  <strong>Recourse & Personal Guarantee Transparency:</strong> Promising "Zero Personal
                  Liability" when security agreements attach personal assets is an actionable CFPB/FTC UDAAP violation.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer
        fdicText="Commercial loans and credit lines are subject to credit underwriting and approval. Apex Horizon Bank N.A. Equal Opportunity Lender."
        legalFootnote={content.sb1235CommercialDisclosure}
      />
    </div>
  );
};
