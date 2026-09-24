import React, { useState } from 'react';
import { Calculator, Info, CheckCircle2 } from 'lucide-react';

interface RateCalculatorProps {
  initialNoteRate: number;
  initialApr: number | null;
  triggerTermsDisclosed: boolean;
}

export const RateCalculator: React.FC<RateCalculatorProps> = ({
  initialNoteRate,
  initialApr,
  triggerTermsDisclosed,
}): React.ReactNode => {
  const [homePrice, setHomePrice] = useState<number>(450000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [termYears, setTermYears] = useState<number>(30);

  const loanAmount = homePrice * (1 - downPaymentPercent / 100);
  const monthlyRate = initialNoteRate / 100 / 12;
  const numberOfPayments = termYears * 12;

  // Standard amortized monthly payment calculation
  const monthlyPayment =
    monthlyRate > 0
      ? (loanAmount *
          (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
      : loanAmount / numberOfPayments;

  const totalPayments = monthlyPayment * numberOfPayments;
  const totalInterest = totalPayments - loanAmount;

  return (
    <div className="calculator-card">
      <div className="calc-header">
        <div className="calc-icon">
          <Calculator size={20} className="text-emerald-400" />
        </div>
        <div>
          <h3 className="calc-title">Interactive Mortgage Payment & APR Estimator</h3>
          <p className="calc-desc">Calculate estimated monthly principal & interest and review loan trigger terms.</p>
        </div>
      </div>

      <div className="calc-grid">
        {/* Controls */}
        <div className="calc-inputs">
          <div className="calc-input-group">
            <label htmlFor="calc-home-price" className="calc-label">
              Home Purchase Price:
              <span className="calc-val-highlight">${homePrice.toLocaleString()}</span>
            </label>
            <input
              id="calc-home-price"
              type="range"
              min={100000}
              max={1500000}
              step={10000}
              value={homePrice}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setHomePrice(Number(e.target.value))
              }
              className="calc-range"
            />
          </div>

          <div className="calc-input-group">
            <label htmlFor="calc-down-payment" className="calc-label">
              Down Payment ({downPaymentPercent}%):
              <span className="calc-val-highlight">
                ${Math.round((homePrice * downPaymentPercent) / 100).toLocaleString()}
              </span>
            </label>
            <input
              id="calc-down-payment"
              type="range"
              min={0}
              max={50}
              step={5}
              value={downPaymentPercent}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setDownPaymentPercent(Number(e.target.value))
              }
              className="calc-range"
            />
          </div>

          <div className="calc-input-group">
            <label className="calc-label">Loan Term:</label>
            <div className="term-button-group">
              <button
                type="button"
                className={`term-btn ${termYears === 30 ? 'term-btn-active' : ''}`}
                onClick={(): void => setTermYears(30)}
              >
                30-Year Fixed
              </button>
              <button
                type="button"
                className={`term-btn ${termYears === 15 ? 'term-btn-active' : ''}`}
                onClick={(): void => setTermYears(15)}
              >
                15-Year Fixed
              </button>
            </div>
          </div>
        </div>

        {/* Results Box */}
        <div className="calc-results-box">
          <span className="calc-res-label">Estimated Monthly Payment (P&I)</span>
          <div className="calc-res-value">
            ${monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="calc-res-per">/month</span>
          </div>

          <div className="calc-breakdown">
            <div className="breakdown-row">
              <span>Loan Amount:</span>
              <strong>${Math.round(loanAmount).toLocaleString()}</strong>
            </div>
            <div className="breakdown-row">
              <span>Nominal Note Rate:</span>
              <strong>{initialNoteRate.toFixed(3)}%</strong>
            </div>
            <div className="breakdown-row">
              <span>Total Lifetime Interest:</span>
              <strong>${Math.round(totalInterest).toLocaleString()}</strong>
            </div>
            {initialApr !== null ? (
              <div className="breakdown-row breakdown-row-apr">
                <span>Calculated APR:</span>
                <strong className="text-emerald-400">{initialApr.toFixed(3)}% APR</strong>
              </div>
            ) : (
              <div className="breakdown-row breakdown-row-warning">
                <span>Calculated APR:</span>
                <strong className="text-rose-400">Omitted in current marketing</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mandatory TILA Reg Z Trigger Term Box */}
      <div className={`trigger-disclosure-box ${triggerTermsDisclosed ? 'trigger-box-compliant' : 'trigger-box-missing'}`}>
        <div className="trigger-box-header">
          {triggerTermsDisclosed ? (
            <>
              <CheckCircle2 size={16} className="text-emerald-400 mr-2 flex-shrink-0" />
              <strong className="text-emerald-400">TILA Trigger Term Disclosure (12 CFR § 1026.24):</strong>
            </>
          ) : (
            <>
              <Info size={16} className="text-rose-400 mr-2 flex-shrink-0" />
              <strong className="text-rose-400">Trigger Terms Triggered Without Mandatory APR Statement:</strong>
            </>
          )}
        </div>
        <p className="trigger-box-text">
          {triggerTermsDisclosed
            ? `Payment example: For a $${homePrice.toLocaleString()} home with ${downPaymentPercent}% ($${Math.round((homePrice * downPaymentPercent) / 100).toLocaleString()}) down payment and a loan amount of $${Math.round(loanAmount).toLocaleString()}, there are ${numberOfPayments} monthly payments of $${monthlyPayment.toFixed(2)} at ${initialNoteRate.toFixed(3)}% interest rate (${initialApr?.toFixed(3)}% APR). Example does not include taxes and insurance; actual payment will be higher.`
            : `Monthly payment of $${monthlyPayment.toFixed(2)}/mo promoted without disclosing required APR, loan balance basis, or itemized finance charges.`}
        </p>
      </div>
    </div>
  );
};
