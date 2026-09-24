import React, { useMemo } from 'react';
import { disclosuresVariants } from '../data/disclosuresData.ts';
import { getVisitSession, getActiveVariant } from '../utils/dynamicContent.ts';
import { ComplianceAuditBar } from '../components/ComplianceAuditBar.tsx';
import { Navbar } from '../components/Navbar.tsx';
import { Footer } from '../components/Footer.tsx';
import { ShieldCheck, FileText, AlertTriangle, Scale } from 'lucide-react';

export const DisclosuresPage: React.FC = (): React.ReactNode => {
  const session = useMemo(() => getVisitSession(), []);
  const activeVariant = useMemo(
    () => getActiveVariant(disclosuresVariants, session.activeVariantId),
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
              <Scale size={14} className="inline mr-1 text-emerald-400" />
              <span>Statutory Compliance Archive</span>
            </div>
            <h1 className="page-hero-title">{content.headline}</h1>
            <p className="page-hero-lead">{content.subheadline}</p>
          </div>
        </section>

        {/* Public Disclosures Documents */}
        <section className="product-offers-section">
          <div className="offers-container">
            <div className="disclosures-document-grid">
              <div className="disclosure-doc-card">
                <div className="doc-icon">
                  <FileText size={20} className="text-emerald-400" />
                </div>
                <h3 className="doc-title">Community Reinvestment Act (CRA) Notice</h3>
                <p className="doc-body">{content.craStatement}</p>
              </div>

              <div className="disclosure-doc-card">
                <div className="doc-icon">
                  <ShieldCheck size={20} className="text-emerald-400" />
                </div>
                <h3 className="doc-title">FDIC Deposit Insurance Statement</h3>
                <p className="doc-body">{content.fdicStatement}</p>
              </div>

              <div className="disclosure-doc-card">
                <div className="doc-icon">
                  <Scale size={20} className="text-emerald-400" />
                </div>
                <h3 className="doc-title">Equal Housing & Equal Credit Opportunity</h3>
                <p className="doc-body">{content.equalHousingStatement}</p>
              </div>

              <div className="disclosure-doc-card">
                <div className="doc-icon">
                  <FileText size={20} className="text-amber-400" />
                </div>
                <h3 className="doc-title">Schedule of Account Fees</h3>
                <p className="doc-body">{content.feeScheduleExcerpt}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Regulatory Governance Matrix */}
        {content.regulatoryFrameworks.length > 0 ? (
          <section className="frameworks-section">
            <div className="offers-container">
              <div className="section-header">
                <h2 className="section-title">Federal & State Banking Governance Frameworks</h2>
                <p className="section-subtitle">
                  Primary compliance mandates inspected by automated compliance auditing platforms.
                </p>
              </div>

              <div className="frameworks-grid">
                {content.regulatoryFrameworks.map((fw, idx: number): React.ReactNode => (
                  <div key={idx} className="framework-card">
                    <div className="framework-top">
                      <span className="framework-code">{fw.code}</span>
                      <span className="framework-auth">{fw.authority}</span>
                    </div>
                    <h3 className="framework-name">{fw.name}</h3>
                    <p className="framework-rule">{fw.keyRule}</p>

                    <div className="framework-violations">
                      <strong className="text-rose-400 text-xs uppercase tracking-wider block mb-2">
                        Common Marketing Pitfalls Flagged by AI:
                      </strong>
                      <ul>
                        {fw.commonViolations.map((v, vIdx: number): React.ReactNode => (
                          <li key={vIdx} className="violation-item">
                            <AlertTriangle size={12} className="text-rose-400 mr-2 flex-shrink-0 inline" />
                            <span>{v}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="frameworks-section">
            <div className="offers-container">
              <div className="schumer-omitted-banner">
                <AlertTriangle size={24} className="text-rose-400" />
                <div>
                  <h4 className="schumer-omitted-title">Regulatory Archive Cleared / Non-Disclosed</h4>
                  <p className="schumer-omitted-desc">
                    In this high-risk test scenario, statutory frameworks, fee schedules, and mandatory
                    filing statements are completely missing from the bank's portal.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};
