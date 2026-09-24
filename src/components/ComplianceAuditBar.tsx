import React, { useState } from 'react';
import type { ComplianceFlag, ComplianceVariantId, VisitSession } from '../types/compliance.ts';
import { switchVariant, randomizeVisit } from '../utils/dynamicContent.ts';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RotateCw,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Cpu,
} from 'lucide-react';

interface ComplianceAuditBarProps {
  session: VisitSession;
  flags: ComplianceFlag[];
  complianceRating: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'CRITICAL';
  variantSummary: string;
}

export const ComplianceAuditBar: React.FC<ComplianceAuditBarProps> = ({
  session,
  flags,
  complianceRating,
  riskLevel,
  variantSummary,
}): React.ReactNode => {
  const [copied, setCopied] = useState<boolean>(false);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);

  const handleCopyUrl = (): void => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then((): void => {
      setCopied(true);
      setTimeout((): void => setCopied(false), 2200);
    });
  };

  const getRiskBadge = (): React.ReactNode => {
    switch (riskLevel) {
      case 'LOW':
        return (
          <span className="audit-badge audit-badge-green">
            <ShieldCheck size={14} className="mr-1 inline" /> {complianceRating}
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="audit-badge audit-badge-amber">
            <AlertTriangle size={14} className="mr-1 inline" /> {complianceRating}
          </span>
        );
      case 'CRITICAL':
        return (
          <span className="audit-badge audit-badge-red">
            <ShieldAlert size={14} className="mr-1 inline" /> {complianceRating}
          </span>
        );
    }
  };

  return (
    <aside aria-label="Compliance Testing Controller" className="audit-bar-wrapper">
      <div className="audit-bar-container">
        {/* Left: Platform Inspection Details */}
        <div className="audit-bar-meta">
          <div className="audit-brand-chip">
            <Cpu size={14} />
            <span>Nucomply AI Sandbox</span>
          </div>
          <div className="audit-session-info">
            <span className="audit-token" title={session.visitId}>
              {session.visitId}
            </span>
            <span className="audit-timestamp">{session.timestamp}</span>
            <span className="audit-visit-count">Visit #{session.visitorSeed}</span>
          </div>
          {getRiskBadge()}
        </div>

        {/* Center: Quick Variant Selector */}
        <div className="audit-bar-controls">
          <label htmlFor="variant-select" className="audit-control-label">
            Active Scenario:
          </label>
          <select
            id="variant-select"
            className="audit-select"
            value={session.activeVariantId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>): void =>
              switchVariant(e.target.value as ComplianceVariantId, true)
            }
          >
            <option value="compliant">Compliant (Grade A)</option>
            <option value="minor_omissions">Minor Omissions (Grade C)</option>
            <option value="high_risk_udaap">High-Risk UDAAP (Grade F)</option>
            <option value="teaser_trap">Teaser Trap (Grade F)</option>
          </select>

          <button
            type="button"
            className="audit-btn audit-btn-primary"
            onClick={(): void => randomizeVisit()}
            title="Simulate a fresh visit to trigger dynamic content rotation"
          >
            <RotateCw size={13} className="mr-1 inline" />
            <span>Next Dynamic Visit</span>
          </button>

          <button
            type="button"
            className="audit-btn audit-btn-secondary"
            onClick={handleCopyUrl}
            title="Copy exact URL for AI crawler inspection"
          >
            {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
            <span>{copied ? 'Copied URL!' : 'Copy URL for AI'}</span>
          </button>

          <button
            type="button"
            className="audit-btn audit-btn-outline"
            onClick={(): void => setShowDrawer(!showDrawer)}
          >
            <span>AI Benchmark Ground Truth ({flags.length})</span>
            {showDrawer ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      {/* Expandable Benchmark Ground-Truth Drawer */}
      {showDrawer && (
        <div className="audit-drawer">
          <div className="audit-drawer-inner">
            <div className="audit-drawer-header">
              <div>
                <h4 className="audit-drawer-title">
                  Ground-Truth Compliance Violations for AI Verification
                </h4>
                <p className="audit-drawer-desc">{variantSummary}</p>
              </div>
              <span className="audit-drawer-status">
                Expected AI Flags: {flags.length === 0 ? 'Zero Violations (Clean)' : `${flags.length} Detected`}
              </span>
            </div>

            {flags.length === 0 ? (
              <div className="audit-clean-box">
                <ShieldCheck size={20} className="text-emerald-400" />
                <p>
                  This page variation is fully compliant. Your compliance AI should flag zero
                  statutory violations or deceptive practices.
                </p>
              </div>
            ) : (
              <div className="audit-flags-grid">
                {flags.map((flag: ComplianceFlag, idx: number): React.ReactNode => (
                  <div key={idx} className={`audit-flag-card audit-flag-${flag.severity}`}>
                    <div className="audit-flag-top">
                      <span className="audit-flag-cat">{flag.category.replace(/_/g, ' ')}</span>
                      <span className="audit-flag-sev">{flag.severity.toUpperCase()}</span>
                    </div>
                    <h5 className="audit-flag-heading">{flag.title}</h5>
                    <p className="audit-flag-body">{flag.description}</p>
                    <div className="audit-flag-comparison">
                      <div className="audit-comp-row">
                        <strong className="text-emerald-400">Required:</strong>
                        <span>{flag.expectedDisclosure}</span>
                      </div>
                      <div className="audit-comp-row">
                        <strong className="text-rose-400">Rendered Snippet:</strong>
                        <span className="audit-code-snippet">{flag.actualContentSnippet}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
