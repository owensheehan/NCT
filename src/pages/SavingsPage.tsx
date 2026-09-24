import React, { useMemo, useState } from 'react';
import { savingsVariants } from '../data/savingsData.ts';
import { getVisitSession, getActiveVariant } from '../utils/dynamicContent.ts';
import { ComplianceAuditBar } from '../components/ComplianceAuditBar.tsx';
import { Navbar } from '../components/Navbar.tsx';
import { Footer } from '../components/Footer.tsx';
import { PiggyBank, Shield, ArrowRight, Calculator } from 'lucide-react';

export const SavingsPage: React.FC = (): React.ReactNode => {
  const session = useMemo(() => getVisitSession(), []);
  const activeVariant = useMemo(
    () => getActiveVariant(savingsVariants, session.activeVariantId),
    [session.activeVariantId]
  );
  const content = activeVariant.content;

  // Interactive Interest Calculator
  const [depositAmount, setDepositAmount] = useState<number>(25000);
  const selectedApy = 5.15;
  const annualEarned = depositAmount * (selectedApy / 100);

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
        {/* Hero */}
        <section className="page-hero">
          <div className="page-hero-container">
            <div className="hero-badge">
              <PiggyBank size={14} className="inline mr-1 text-emerald-400" />
              <span>Truth in Savings (TISA / Reg DD)</span>
            </div>
            <h1 className="page-hero-title">{content.heroHeadline}</h1>
            <p className="page-hero-lead">{content.heroSubheadline}</p>

            <div className="rates-notice-card">
              <p className="rates-notice-text">{content.urgencyBanner}</p>
              <p className="rates-apr-note">{content.fdicInsuranceNotice}</p>
            </div>
          </div>
        </section>

        {/* Deposit Products Grid */}
        <section className="product-offers-section">
          <div className="offers-container">
            <div className="section-header">
              <h2 className="section-title">High-Yield Deposit Accounts & CDs</h2>
              <p className="section-subtitle">
                Grow your liquid funds with daily compounding and statutory deposit insurance.
              </p>
            </div>

            <div className="offers-grid">
              {content.accounts.map((acct): React.ReactNode => (
                <div key={acct.id} className="offer-card">
                  <div className="offer-card-top">
                    <span className="offer-term-pill">{acct.type}</span>
                    <h3 className="offer-name">{acct.name}</h3>
                    <p className="offer-headline">{acct.headline}</p>
                  </div>

                  <div className="offer-rate-box">
                    <div className="rate-col">
                      <span className="rate-col-label">Quoted Yield</span>
                      <span className="rate-col-apr text-emerald-400 font-bold text-2xl">
                        {acct.rateDisplay}
                      </span>
                    </div>
                    <div className="rate-col">
                      <span className="rate-col-label">Rate Designation</span>
                      <span
                        className={`font-semibold ${
                          acct.rateType === 'APY' ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {acct.rateType}
                      </span>
                    </div>
                  </div>

                  <div className="offer-details-list">
                    <div className="detail-row">
                      <span>Minimum to Earn APY:</span>
                      <strong>${acct.minimumDepositToEarn.toLocaleString()}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Compounding Schedule:</span>
                      <span>{acct.compoundingFrequency}</span>
                    </div>
                    <div className="detail-row">
                      <span>Withdrawal Terms:</span>
                      <span>{acct.withdrawalRestrictions}</span>
                    </div>
                    <div className="detail-row">
                      <span>Insurance Statement:</span>
                      <strong>{acct.fdicClaim}</strong>
                    </div>
                  </div>

                  <div className="rep-example-box">
                    <p className="closing-disclaimer-text">{acct.feeDeductionWarning}</p>
                  </div>

                  <div className="offer-action-row">
                    <button type="button" className="offer-btn-primary">
                      <span>Open Account in 3 Minutes</span>
                      <ArrowRight size={14} className="inline ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Earnings Calculator */}
        <section className="calculator-section">
          <div className="calc-container">
            <div className="calculator-card">
              <div className="calc-header">
                <div className="calc-icon">
                  <Calculator size={20} className="text-emerald-400" />
                </div>
                <div>
                  <h3 className="calc-title">Interactive APY Interest Compounder</h3>
                  <p className="calc-desc">
                    Estimate annual compound interest based on initial deposit and APY.
                  </p>
                </div>
              </div>

              <div className="calc-grid">
                <div className="calc-inputs">
                  <div className="calc-input-group">
                    <label htmlFor="calc-deposit-amount" className="calc-label">
                      Initial Deposit Amount:
                      <span className="calc-val-highlight">${depositAmount.toLocaleString()}</span>
                    </label>
                    <input
                      id="calc-deposit-amount"
                      type="range"
                      min={500}
                      max={500000}
                      step={1000}
                      value={depositAmount}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                        setDepositAmount(Number(e.target.value))
                      }
                      className="calc-range"
                    />
                  </div>
                </div>

                <div className="calc-results-box">
                  <span className="calc-res-label">Estimated 1-Year Total Earnings</span>
                  <div className="calc-res-value text-emerald-400">
                    ${annualEarned.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="calc-breakdown">
                    <div className="breakdown-row">
                      <span>Total Balance After 1 Year:</span>
                      <strong>${(depositAmount + annualEarned).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                    </div>
                    <div className="breakdown-row">
                      <span>FDIC Insurance Coverage Status:</span>
                      {depositAmount <= 250000 ? (
                        <strong className="text-emerald-400">100% Fully Insured ($250k Limit)</strong>
                      ) : (
                        <strong className="text-amber-400">
                          ${(depositAmount - 250000).toLocaleString()} Exceeds Single Limit
                        </strong>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Regulatory Guidance */}
        <section className="compliance-guidance-section">
          <div className="guidance-container">
            <div className="guidance-box">
              <div className="guidance-header">
                <Shield size={20} className="text-emerald-400" />
                <h3>Truth in Savings Act (TISA / Reg DD) Compliance Criteria:</h3>
              </div>
              <ul className="guidance-list">
                <li>
                  <strong>12 CFR § 1030.8(b) APY Designation:</strong> Rates of return must be stated
                  as an Annual Percentage Yield (using the acronym "APY" and spelling out the full
                  phrase). Stating "simple rate" without the APY is a statutory violation.
                </li>
                <li>
                  <strong>12 CFR § 1030.8(c)(3) Fee Disclosures:</strong> If fees are imposed in
                  connection with the account, advertising must explicitly warn that "fees could reduce
                  earnings on the account."
                </li>
                <li>
                  <strong>FDIC Insurance Accuracy (12 CFR Part 328):</strong> Institutions are strictly
                  prohibited from misrepresenting deposit insurance boundaries or claiming government
                  backing on balances exceeding statutory $250,000 limits without disclosing sweep networks.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer
        fdicText={content.fdicInsuranceNotice}
        legalFootnote={content.regDdDisclaimer}
      />
    </div>
  );
};
