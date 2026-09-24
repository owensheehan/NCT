import React, { useState, useEffect } from 'react';
import type { ComplianceFlag, ComplianceVariantId, VisitSession, VisitLogEntry } from '../types/compliance.ts';
import {
  switchVariant,
  randomizeVisit,
  recordVisit,
  getVisitAuditLog,
  clearVisitAuditLog,
  exportAuditLogAsJson,
} from '../utils/dynamicContent.ts';
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
  History,
  Download,
  Trash2,
  ExternalLink,
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
  const [activeDrawerTab, setActiveDrawerTab] = useState<'ground_truth' | 'audit_log'>('ground_truth');
  const [auditLogs, setAuditLogs] = useState<VisitLogEntry[]>([]);
  const [webhookInput, setWebhookInput] = useState<string>(() => localStorage.getItem('nucomply_webhook_url') || '');
  const [webhookSaved, setWebhookSaved] = useState<boolean>(false);

  // Automatically record this visit upon mounting
  useEffect((): void => {
    recordVisit(session, riskLevel, flags.length);
    setAuditLogs(getVisitAuditLog());
  }, [session, riskLevel, flags.length]);

  const handleCopyUrl = (): void => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then((): void => {
      setCopied(true);
      setTimeout((): void => setCopied(false), 2200);
    });
  };

  const handleClearLogs = (): void => {
    clearVisitAuditLog();
    setAuditLogs([]);
  };

  const handleSaveWebhook = (): void => {
    localStorage.setItem('nucomply_webhook_url', webhookInput.trim());
    setWebhookSaved(true);
    setTimeout((): void => setWebhookSaved(false), 2000);
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

          {/* Toggle Ground Truth Drawer */}
          <button
            type="button"
            className={`audit-btn ${showDrawer && activeDrawerTab === 'ground_truth' ? 'audit-btn-active' : 'audit-btn-outline'}`}
            onClick={(): void => {
              if (showDrawer && activeDrawerTab === 'ground_truth') {
                setShowDrawer(false);
              } else {
                setActiveDrawerTab('ground_truth');
                setShowDrawer(true);
              }
            }}
          >
            <span>Expected Violations ({flags.length})</span>
            {showDrawer && activeDrawerTab === 'ground_truth' ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>

          {/* Toggle Recorded Visits Drawer */}
          <button
            type="button"
            className={`audit-btn ${showDrawer && activeDrawerTab === 'audit_log' ? 'audit-btn-active' : 'audit-btn-outline'}`}
            onClick={(): void => {
              if (showDrawer && activeDrawerTab === 'audit_log') {
                setShowDrawer(false);
              } else {
                setActiveDrawerTab('audit_log');
                setAuditLogs(getVisitAuditLog());
                setShowDrawer(true);
              }
            }}
            title="View persistent history of all AI and user visits recorded"
          >
            <History size={13} className="mr-1 inline" />
            <span>Visit Audit Log ({auditLogs.length})</span>
            {showDrawer && activeDrawerTab === 'audit_log' ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      {/* Expandable Benchmark Ground-Truth & Audit Log Drawer */}
      {showDrawer && (
        <div className="audit-drawer">
          <div className="audit-drawer-inner">
            {/* Drawer Tabs */}
            <div className="audit-drawer-tabs">
              <button
                type="button"
                className={`drawer-tab-btn ${activeDrawerTab === 'ground_truth' ? 'drawer-tab-active' : ''}`}
                onClick={(): void => setActiveDrawerTab('ground_truth')}
              >
                Ground-Truth Violations ({flags.length})
              </button>
              <button
                type="button"
                className={`drawer-tab-btn ${activeDrawerTab === 'audit_log' ? 'drawer-tab-active' : ''}`}
                onClick={(): void => {
                  setActiveDrawerTab('audit_log');
                  setAuditLogs(getVisitAuditLog());
                }}
              >
                Recorded Visit History ({auditLogs.length})
              </button>
            </div>

            {/* TAB 1: Ground-Truth Violations */}
            {activeDrawerTab === 'ground_truth' && (
              <div>
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
            )}

            {/* TAB 2: Recorded Visits & Telemetry */}
            {activeDrawerTab === 'audit_log' && (
              <div className="audit-log-pane">
                <div className="audit-log-header">
                  <div>
                    <h4 className="audit-drawer-title">Persistent Visit Audit Trail</h4>
                    <p className="audit-drawer-desc">
                      Every visit is recorded in browser storage with full inspection telemetry, also accessible via{' '}
                      <code className="text-cyan-400">window.__NUCOMPLY_AUDIT__</code> or DOM meta tags.
                    </p>
                  </div>

                  <div className="audit-log-actions">
                    <button
                      type="button"
                      className="audit-btn audit-btn-primary"
                      onClick={exportAuditLogAsJson}
                    >
                      <Download size={13} className="mr-1 inline" />
                      <span>Export Audit JSON</span>
                    </button>
                    <button
                      type="button"
                      className="audit-btn audit-btn-outline text-rose-400"
                      onClick={handleClearLogs}
                    >
                      <Trash2 size={13} className="mr-1 inline" />
                      <span>Clear Log</span>
                    </button>
                  </div>
                </div>

                {/* Optional Webhook Dispatch Config */}
                <div className="webhook-config-box">
                  <div className="webhook-label-group">
                    <ExternalLink size={14} className="text-cyan-400" />
                    <strong>Webhook Live Stream (Optional):</strong>
                    <span className="text-slate-400 text-xs">
                      Forward every visit payload directly to your compliance API in real time:
                    </span>
                  </div>
                  <div className="webhook-input-group">
                    <input
                      type="url"
                      placeholder="https://your-api.nucomply.com/v1/visits"
                      value={webhookInput}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setWebhookInput(e.target.value)}
                      className="webhook-input"
                    />
                    <button
                      type="button"
                      className="audit-btn audit-btn-secondary"
                      onClick={handleSaveWebhook}
                    >
                      {webhookSaved ? 'Saved!' : 'Save Webhook'}
                    </button>
                  </div>
                </div>

                {/* Audit Log Table */}
                {auditLogs.length === 0 ? (
                  <div className="audit-clean-box">
                    <p>No recorded visits yet in this browser session.</p>
                  </div>
                ) : (
                  <div className="audit-table-wrapper">
                    <table className="audit-history-table">
                      <thead>
                        <tr>
                          <th>Timestamp (UTC)</th>
                          <th>Visit ID</th>
                          <th>Page Path</th>
                          <th>Variant</th>
                          <th>Risk Grade</th>
                          <th>Expected Flags</th>
                        </tr>
                      </thead>
                      <tbody>
                        {auditLogs.map((log: VisitLogEntry, idx: number): React.ReactNode => (
                          <tr key={idx}>
                            <td className="font-mono text-slate-300">{log.timestamp}</td>
                            <td className="font-mono text-cyan-400 font-bold">{log.visitId}</td>
                            <td className="font-mono text-amber-300">{log.path}</td>
                            <td>
                              <span className="audit-variant-tag">{log.variantId}</span>
                            </td>
                            <td>
                              <span className={`audit-badge audit-badge-${log.riskLevel === 'LOW' ? 'green' : log.riskLevel === 'MEDIUM' ? 'amber' : 'red'}`}>
                                {log.riskLevel}
                              </span>
                            </td>
                            <td className="text-center font-bold font-mono">
                              {log.expectedFlagCount === 0 ? (
                                <span className="text-emerald-400">0 (Clean)</span>
                              ) : (
                                <span className="text-rose-400">{log.expectedFlagCount}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
