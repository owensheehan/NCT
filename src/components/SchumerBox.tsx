import React from 'react';
import { Table, AlertTriangle, ShieldCheck } from 'lucide-react';

interface SchumerBoxProps {
  provided: boolean;
  introApr: string;
  regularAprRange: string;
  annualFee: number;
  balanceTransferFee: string;
  penaltyAprWarning?: string;
  lateFeeDisclaimer?: string;
}

export const SchumerBox: React.FC<SchumerBoxProps> = ({
  provided,
  introApr,
  regularAprRange,
  annualFee,
  balanceTransferFee,
  penaltyAprWarning,
  lateFeeDisclaimer,
}): React.ReactNode => {
  if (!provided) {
    return (
      <div className="schumer-omitted-banner">
        <div className="schumer-omitted-icon">
          <AlertTriangle size={24} className="text-rose-400" />
        </div>
        <div>
          <h4 className="schumer-omitted-title">
            Mandatory Schumer Box Omitted (12 CFR § 1026.60 Violation)
          </h4>
          <p className="schumer-omitted-desc">
            Federal law requires credit card marketing to provide a prominent tabular summary of
            all APRs, transaction fees, penalty rates, and minimum finance charges before application.
            This solicitation has omitted the standardized table.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="schumer-container">
      <div className="schumer-header">
        <Table size={18} className="text-emerald-400" />
        <h4 className="schumer-title">
          Standardized CARD Act Disclosure (Schumer Box Table)
        </h4>
        <span className="schumer-badge">
          <ShieldCheck size={14} className="mr-1 inline" /> 12 CFR § 1026.60 Format
        </span>
      </div>

      <div className="schumer-table-wrapper">
        <table className="schumer-table">
          <thead>
            <tr>
              <th colSpan={2}>Interest Rates and Interest Charges</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="schumer-label-col">
                <strong>Annual Percentage Rate (APR) for Purchases</strong>
              </td>
              <td>
                <p>
                  <strong>{introApr}</strong>
                </p>
                <p className="schumer-subtext">
                  After that, your APR will be <strong>{regularAprRange}</strong>, based on your
                  creditworthiness. This APR will vary with the market based on the Prime Rate.
                </p>
              </td>
            </tr>

            <tr>
              <td className="schumer-label-col">
                <strong>APR for Balance Transfers</strong>
              </td>
              <td>
                <p>{introApr}</p>
                <p className="schumer-subtext">
                  Standard variable rate of {regularAprRange} applies after promotional cycle.
                </p>
              </td>
            </tr>

            <tr>
              <td className="schumer-label-col">
                <strong>Penalty APR and When It Applies</strong>
              </td>
              <td>
                <p className="text-rose-400 font-semibold">
                  {penaltyAprWarning || 'Up to 29.99% variable APR.'}
                </p>
                <p className="schumer-subtext">
                  This APR may be applied to your account if you make a late payment or make a payment
                  that is returned unpaid.
                </p>
              </td>
            </tr>

            <tr>
              <td className="schumer-label-col">
                <strong>Paying Interest (Grace Period)</strong>
              </td>
              <td>
                Your due date is at least 25 days after the close of each billing cycle. We will not
                charge you any interest on purchases if you pay your entire balance by the due date
                each month.
              </td>
            </tr>

            <tr>
              <td className="schumer-label-col">
                <strong>Minimum Interest Charge</strong>
              </td>
              <td>If you are charged interest, the charge will be no less than $1.50.</td>
            </tr>
          </tbody>

          <thead>
            <tr>
              <th colSpan={2}>Fees</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="schumer-label-col">
                <strong>Annual Membership Fee</strong>
              </td>
              <td>{annualFee === 0 ? 'None ($0)' : `$${annualFee}`}</td>
            </tr>

            <tr>
              <td className="schumer-label-col">
                <strong>Transaction Fees (Balance Transfer & Foreign)</strong>
              </td>
              <td>
                <p>Balance Transfer: {balanceTransferFee}</p>
                <p>Foreign Transaction: None (0%) on international purchases.</p>
              </td>
            </tr>

            <tr>
              <td className="schumer-label-col">
                <strong>Penalty Fees</strong>
              </td>
              <td>
                <p>{lateFeeDisclaimer || 'Late Payment: Up to $41. Returned Payment: Up to $41.'}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
