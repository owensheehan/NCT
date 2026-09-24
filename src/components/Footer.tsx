import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark, Shield, Home } from 'lucide-react';

interface FooterProps {
  fdicText?: string;
  legalFootnote?: string;
  showEqualHousingLogo?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  fdicText,
  legalFootnote,
  showEqualHousingLogo = true,
}): React.ReactNode => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-wrapper">
      <div className="footer-top-container">
        <div className="footer-grid">
          {/* Brand & Regulatory Badges */}
          <div className="footer-col footer-col-wide">
            <div className="footer-brand">
              <div className="brand-icon">
                <Landmark size={20} />
              </div>
              <span className="brand-title">APEX HORIZON BANK & TRUST</span>
            </div>
            <p className="footer-about">
              Apex Horizon Bank N.A. provides institutional-grade banking, residential mortgage
              financing, wealth management, and commercial capital solutions.
            </p>

            <div className="regulatory-badges">
              <div className="reg-badge">
                <Shield size={16} className="text-emerald-400" />
                <div>
                  <span className="reg-badge-title">MEMBER FDIC</span>
                  <span className="reg-badge-sub">Insured up to statutory limits</span>
                </div>
              </div>

              {showEqualHousingLogo && (
                <div className="reg-badge">
                  <Home size={16} className="text-amber-400" />
                  <div>
                    <span className="reg-badge-title">EQUAL HOUSING LENDER</span>
                    <span className="reg-badge-sub">NMLS ID #491022</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Links: Consumer Products */}
          <div className="footer-col">
            <h4 className="footer-heading">Consumer Products</h4>
            <ul className="footer-links">
              <li><Link to="/mortgages">Home Purchase Loans</Link></li>
              <li><Link to="/mortgages">Refinance & Cash-Out</Link></li>
              <li><Link to="/credit-cards">Cash Reserve Credit Card</Link></li>
              <li><Link to="/credit-cards">Voyage Travel Card</Link></li>
              <li><Link to="/savings">High-Yield Savings (5.15% APY)</Link></li>
              <li><Link to="/savings">Fixed-Term Certificates of Deposit</Link></li>
            </ul>
          </div>

          {/* Links: Institutional & Wealth */}
          <div className="footer-col">
            <h4 className="footer-heading">Wealth & Commercial</h4>
            <ul className="footer-links">
              <li><Link to="/wealth">Private Wealth Advisory</Link></li>
              <li><Link to="/wealth">Institutional Income Fund</Link></li>
              <li><Link to="/business-loans">Commercial Lines of Credit</Link></li>
              <li><Link to="/business-loans">Equipment Financing</Link></li>
              <li><Link to="/business-loans">SBA 7(a) & 504 Programs</Link></li>
              <li><Link to="/disclosures">CRA Public Notice</Link></li>
            </ul>
          </div>

          {/* Links: Regulatory & Compliance */}
          <div className="footer-col">
            <h4 className="footer-heading">Compliance Hub</h4>
            <ul className="footer-links">
              <li><Link to="/disclosures">Truth in Lending (Reg Z)</Link></li>
              <li><Link to="/disclosures">Truth in Savings (Reg DD)</Link></li>
              <li><Link to="/disclosures">Credit CARD Act Disclosures</Link></li>
              <li><Link to="/disclosures">Equal Credit Opportunity (Reg B)</Link></li>
              <li><Link to="/disclosures">Privacy & GLBA Notices</Link></li>
              <li><Link to="/disclosures">Master Fee Schedule</Link></li>
            </ul>
          </div>
        </div>

        {/* Dynamic Statutory & Legal Fine Print */}
        <div className="footer-statutory-box">
          <h5 className="statutory-title">Important Statutory Disclosures & Legal Notices:</h5>
          <p className="statutory-text">
            {fdicText ||
              'Apex Horizon Bank N.A. Member FDIC. Deposits are FDIC-insured up to $250,000 per depositor, per insured bank, for each account ownership category. Nondeposit investment and advisory products offered through Apex Private Wealth LLC (SEC-Registered Investment Adviser) and Apex Securities Inc. (Member FINRA/SIPC) are NOT FDIC INSURED, HAVE NO BANK GUARANTEE, and MAY LOSE VALUE.'}
          </p>
          {legalFootnote && <p className="statutory-footnote">{legalFootnote}</p>}
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p className="copyright-text">
            © {currentYear} Apex Horizon Bank N.A. All rights reserved. Operating under US National Bank Charter #88412-B.
          </p>
          <div className="footer-meta-tags">
            <span>Security Encrypted 256-bit SSL</span>
            <span>•</span>
            <Link to="/disclosures">Terms of Use</Link>
            <span>•</span>
            <Link to="/disclosures">Privacy Policy</Link>
            <span>•</span>
            <Link to="/disclosures">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
