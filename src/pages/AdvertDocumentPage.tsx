import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import type { AdvertDocumentData, TestCaseDefinition, ProductTierAdvert, GroundTruthDiscrepancy, AdvertLink } from '../types/testSuite.ts';
import { STANDARD_TEST_CASES } from '../utils/testSuiteGenerator.ts';
import {
  generateAdvertDocument,
  getTestCaseById,
  printSingleAdvertHtml,
} from '../utils/advertGenerator.ts';
import { isCleanMode } from '../utils/dynamicContent.ts';
import { Navbar } from '../components/Navbar.tsx';
import { Footer } from '../components/Footer.tsx';
import {
  Printer,
  Shuffle,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  QrCode,
  Sparkles,
  Download,
  Info,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Link2,
  Copy,
} from 'lucide-react';

export const AdvertDocumentPage: React.FC = (): React.ReactNode => {
  const { testId } = useParams<{ testId?: string }>();
  const navigate = useNavigate();
  useLocation();
  const clean = isCleanMode();

  // Find active test case definition, default to first test if not specified
  const activeTestCase = useMemo((): TestCaseDefinition => {
    if (testId) {
      const found = getTestCaseById(testId);
      if (found) return found;
    }
    return STANDARD_TEST_CASES[0];
  }, [testId]);

  // Base URL calculation - Never use localhost for links or QR codes
  const defaultBaseUrl = useMemo((): string => {
    if (
      window.location.hostname &&
      !window.location.hostname.includes('localhost') &&
      !window.location.hostname.includes('127.0.0.1')
    ) {
      const origin = window.location.origin;
      const pathname = window.location.pathname.startsWith('/NCT') ? '/NCT/' : '/';
      return `${origin}${pathname}`;
    }
    return 'https://owensheehan.github.io/NCT/';
  }, []);

  const [baseUrl, setBaseUrl] = useState<string>(defaultBaseUrl);
  const [advertDoc, setAdvertDoc] = useState<AdvertDocumentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [randomSeed, setRandomSeed] = useState<number>(() => Date.now());
  const [showInspectorNotes, setShowInspectorNotes] = useState<boolean>(true);
  const [copiedAllUrls, setCopiedAllUrls] = useState<boolean>(false);

  const handleCopyAllUrls = (): void => {
    if (!advertDoc || !advertDoc.links) return;
    const text = advertDoc.links
      .map((l: AdvertLink, idx: number): string => `[Link ${idx + 1}] ${l.label}: ${l.url}`)
      .join('\n');
    navigator.clipboard.writeText(text).then((): void => {
      setCopiedAllUrls(true);
      setTimeout((): void => setCopiedAllUrls(false), 2500);
    });
  };

  // Generate advert document data
  const loadAdvert = useCallback((): void => {
    setLoading(true);
    generateAdvertDocument(activeTestCase, baseUrl, randomSeed).then((doc: AdvertDocumentData): void => {
      setAdvertDoc(doc);
      setLoading(false);
    });
  }, [activeTestCase, baseUrl, randomSeed]);

  useEffect((): void => {
    loadAdvert();
  }, [loadAdvert]);

  // Handle re-rolling random text & rate variations
  const handleReroll = (): void => {
    setRandomSeed(Date.now() + Math.floor(Math.random() * 100000));
  };

  // Navigation between tests
  const currentIndex = STANDARD_TEST_CASES.findIndex(
    (tc: TestCaseDefinition): boolean => tc.id === activeTestCase.id
  );
  const prevTestCase = currentIndex > 0 ? STANDARD_TEST_CASES[currentIndex - 1] : null;
  const nextTestCase =
    currentIndex < STANDARD_TEST_CASES.length - 1 ? STANDARD_TEST_CASES[currentIndex + 1] : null;

  const handleSelectTest = (id: string): void => {
    navigate(`/advert/${id}`);
  };

  const handleDownloadQrOnly = (): void => {
    if (!advertDoc) return;
    const link = document.createElement('a');
    link.href = advertDoc.qrDataUrl;
    link.download = `${advertDoc.testId}-advert-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-shell">
      <Navbar />

      <main className="main-content">
        {/* Navigation & Controls Utility Bar */}
        {!clean && (
          <section className="advert-controls-bar">
            <div className="advert-controls-container">
            <div className="controls-top-row">
              <Link to="/test-generator" className="back-link">
                <ArrowLeft size={16} />
                <span>Back to Test Suite Matrix</span>
              </Link>

              <div className="advert-pagination">
                <button
                  type="button"
                  className="page-nav-btn"
                  disabled={!prevTestCase}
                  onClick={(): void => {
                    if (prevTestCase) navigate(`/advert/${prevTestCase.id}`);
                  }}
                  title={prevTestCase ? `Previous: ${prevTestCase.name}` : undefined}
                >
                  <ArrowLeft size={14} />
                  <span>Previous Advert</span>
                </button>

                <select
                  value={activeTestCase.id}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => handleSelectTest(e.target.value)}
                  className="test-selector-dropdown"
                >
                  {STANDARD_TEST_CASES.map((tc: TestCaseDefinition): React.ReactNode => (
                    <option key={tc.id} value={tc.id}>
                      [{tc.expectedOutcome}] {tc.id} — {tc.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="page-nav-btn"
                  disabled={!nextTestCase}
                  onClick={(): void => {
                    if (nextTestCase) navigate(`/advert/${nextTestCase.id}`);
                  }}
                  title={nextTestCase ? `Next: ${nextTestCase.name}` : undefined}
                >
                  <span>Next Advert</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            <div className="advert-base-url-toolbar">
              <span className="base-url-tag">Target Domain for Links & QR:</span>
              <input
                type="text"
                value={baseUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setBaseUrl(e.target.value)}
                className="base-url-input-field"
                placeholder="https://owensheehan.github.io/NCT/"
              />
              {baseUrl !== 'https://owensheehan.github.io/NCT/' && (
                <button
                  type="button"
                  className="reset-base-btn"
                  onClick={(): void => setBaseUrl('https://owensheehan.github.io/NCT/')}
                  title="Reset to production GitHub Pages URL"
                >
                  Reset to GitHub Pages
                </button>
              )}
            </div>

            <div className="controls-action-row">
              <div className="advert-status-meta">
                <span
                  className={`outcome-pill ${
                    activeTestCase.expectedOutcome === 'PASS' ? 'outcome-pass' : 'outcome-fail'
                  }`}
                >
                  {activeTestCase.expectedOutcome === 'PASS' ? (
                    <ShieldCheck size={14} className="inline mr-1" />
                  ) : (
                    <AlertTriangle size={14} className="inline mr-1" />
                  )}
                  Target Test Outcome: {activeTestCase.expectedOutcome}
                </span>
                <span className="meta-text">
                  Vertical: <strong>{activeTestCase.vertical}</strong>
                </span>
                <span className="meta-text text-slate-400">
                  Rule: <strong>{activeTestCase.regulatoryFramework}</strong>
                </span>
              </div>

              <div className="controls-btn-group">
                <button
                  type="button"
                  className="ctrl-btn ctrl-btn-reroll"
                  onClick={handleReroll}
                  title="Randomize marketing advert copy, rates, and test tokens"
                >
                  <Shuffle size={14} />
                  <span>Re-roll Random Copy</span>
                </button>

                <button
                  type="button"
                  className="ctrl-btn ctrl-btn-inspector"
                  onClick={(): void => setShowInspectorNotes(!showInspectorNotes)}
                  title="Toggle compliance inspector comparison guide"
                >
                  {showInspectorNotes ? <EyeOff size={14} /> : <Eye size={14} />}
                  <span>{showInspectorNotes ? 'Hide Audit Notes' : 'Show Audit Notes'}</span>
                </button>

                {advertDoc && (
                  <>
                    {advertDoc.links && advertDoc.links.length > 0 && (
                      <button
                        type="button"
                        className="ctrl-btn ctrl-btn-copy-links"
                        onClick={handleCopyAllUrls}
                        title={`Copy all ${advertDoc.links.length} URLs in this advert to clipboard`}
                      >
                        {copiedAllUrls ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        <span>{copiedAllUrls ? `Copied ${advertDoc.links.length} URLs!` : `Copy All ${advertDoc.links.length} URLs`}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      className="ctrl-btn ctrl-btn-print"
                      onClick={(): void => printSingleAdvertHtml(advertDoc)}
                      title="Open printable Letter/A4 format or save as PDF"
                    >
                      <Printer size={14} />
                      <span>Print Complete Advert</span>
                    </button>

                    <a
                      href={advertDoc.landingPageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ctrl-btn ctrl-btn-launch"
                      title="Open destination test landing page in new tab"
                    >
                      <ExternalLink size={14} />
                      <span>Launch Linked Page</span>
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
        )}

        {/* Advert Presentation Stage */}
        <section className="advert-stage-section">
          <div className="advert-stage-container">
            {loading || !advertDoc ? (
              <div className="loading-box">
                <Sparkles size={28} className="text-cyan-400 animate-spin" />
                <p>Generating complete marketing advertisement & scannable QR code...</p>
              </div>
            ) : (
              <div className="advert-presentation-wrapper">
                {/* COMPLETE BANK MARKETING ADVERTISEMENT DOCUMENT */}
                <article className="advert-document-sheet" id="advert-sheet">
                  {/* Bank Header Lockup */}
                  <header className="sheet-header">
                    <div className="brand-lockup">
                      <div className="sheet-bank-name">APEX HORIZON BANK & TRUST</div>
                      <div className="sheet-bank-sub">
                        CHARTERED COMMERCIAL & CONSUMER BANCORP • MEMBER FDIC • EQUAL HOUSING LENDER
                      </div>
                    </div>
                    <div className="sheet-header-meta">
                      <div className="sheet-token-text">DOCUMENT ID: {advertDoc.advertToken}</div>
                      <div className="sheet-token-text">PUBLISHED: {advertDoc.publishedDate}</div>
                      {!clean && (
                        <div className="sheet-badge-row">
                          <span
                            className={`sheet-status-tag ${
                              advertDoc.expectedOutcome === 'PASS' ? 'tag-pass' : 'tag-fail'
                            }`}
                          >
                            TEST BENCHMARK: [{advertDoc.expectedOutcome}]
                          </span>
                        </div>
                      )}
                    </div>
                  </header>

                  {/* Main Promotional Hero Section */}
                  <section className="sheet-hero">
                    <div className="sheet-eyebrow-tag">{advertDoc.eyebrowTag}</div>
                    <h1 className="sheet-headline">{advertDoc.headline}</h1>
                    <p className="sheet-subheadline">{advertDoc.subheadline}</p>
                  </section>

                  {/* Featured Offer Banner Card */}
                  <section className="sheet-rate-card">
                    <div className="rate-card-caption">FEATURED PROMOTIONAL OFFER</div>
                    <div className="rate-card-value">{advertDoc.advertisedRate}</div>
                    <div className="rate-card-apr">
                      {advertDoc.advertisedApr ? (
                        <span>
                          Official APR Disclosure: <strong>{advertDoc.advertisedApr}</strong>
                        </span>
                      ) : (
                        <span className="apr-omitted">
                          ⚠️ Annual Percentage Rate (APR) omitted in primary marketing circular
                        </span>
                      )}
                    </div>
                    {advertDoc.secondaryMetric && (
                      <div className="rate-card-secondary">{advertDoc.secondaryMetric}</div>
                    )}
                  </section>

                  {/* Product Options & Representative Terms Table (Summarizing Webpage) */}
                  {advertDoc.productTiers.length > 0 && (
                    <section className="sheet-table-section">
                      <h3 className="section-heading">Featured Program Options & Rate Schedule:</h3>
                      <div className="sheet-table-responsive">
                        <table className="sheet-tiers-table">
                          <thead>
                            <tr>
                              <th>Program Name</th>
                              <th>Rate Claim</th>
                              <th>Disclosed APR</th>
                              <th>Term / Limits</th>
                              <th>Repayment / Fee</th>
                              <th>Highlights</th>
                            </tr>
                          </thead>
                          <tbody>
                            {advertDoc.productTiers.map((tier: ProductTierAdvert, idx: number): React.ReactNode => (
                              <tr key={idx}>
                                <td>
                                  <strong>{tier.name}</strong>
                                </td>
                                <td className="font-mono text-emerald-700">{tier.rate}</td>
                                <td>
                                  {tier.apr ? (
                                    <span className="font-mono text-slate-800">{tier.apr}</span>
                                  ) : (
                                    <span className="text-rose-600 font-bold">Omitted</span>
                                  )}
                                </td>
                                <td>{tier.termOrLimit}</td>
                                <td>{tier.monthlyPaymentOrFee}</td>
                                <td className="text-slate-500 text-xs">{tier.keyFeature}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  )}

                  {/* Two-Column Middle Section: Key Highlights & Embedded QR CTA */}
                  <section className="sheet-content-grid">
                    {/* Left: Program Advantages */}
                    <div className="sheet-benefits-col">
                      <h3 className="section-heading">Key Program Advantages & Borrower Privileges:</h3>
                      <ul className="benefits-checklist">
                        {advertDoc.bulletPoints.map((bullet: string, idx: number): React.ReactNode => (
                          <li key={idx} className="benefit-item">
                            <span className="checkmark">✓</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Right: Scannable QR Code Response Mechanism */}
                    <div className="sheet-qr-col">
                      <div className="advert-qr-box">
                        <div className="qr-badge">PRIMARY DIGITAL ACCESS ({advertDoc.links.length} ACTIVE URLS)</div>
                        <img
                          src={advertDoc.qrDataUrl}
                          alt={`QR Code to ${advertDoc.landingPageUrl}`}
                          className="advert-qr-image"
                        />
                        <p className="qr-cta-instructions">
                          Scan with your camera to access <strong>Link 1 (Primary Application Portal)</strong>. Full statutory rate schedules, contractual terms, and regulatory filings are directly referenced below.
                        </p>
                        <div className="qr-url-display">{advertDoc.landingPageUrl}</div>
                        <div className="qr-btn-row">
                          <button
                            type="button"
                            className="qr-save-subbtn"
                            onClick={handleDownloadQrOnly}
                            title="Save high-resolution QR image for test runners"
                          >
                            <Download size={11} className="mr-1 inline" />
                            <span>Save QR Image</span>
                          </button>
                          <button
                            type="button"
                            className="qr-save-subbtn"
                            onClick={handleCopyAllUrls}
                            title="Copy all URLs in this advert to clipboard"
                          >
                            <Copy size={11} className="mr-1 inline" />
                            <span>{copiedAllUrls ? 'Copied All!' : 'Copy All URLs'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Multi-URL Regulatory & Document Disclosure Links Section */}
                  {advertDoc.links && advertDoc.links.length > 0 && (
                    <section className="sheet-multi-links-section" id="sheet-multi-links">
                      <div className="multi-links-header">
                        <div className="multi-links-title-row">
                          <Link2 size={16} className="text-sky-600 inline mr-2" />
                          <h3 className="section-heading mb-0">Official Statutory & Documentation Links</h3>
                        </div>
                        <div className="multi-links-actions-row">
                          <span className="multi-links-count">
                            {advertDoc.links.length} Disclosed URLs in Advert
                          </span>
                          <button
                            type="button"
                            className="copy-all-mini-btn"
                            onClick={handleCopyAllUrls}
                            title="Copy all URLs to clipboard"
                          >
                            {copiedAllUrls ? (
                              <CheckCircle2 size={11} className="text-emerald-500 inline mr-1" />
                            ) : (
                              <Copy size={11} className="inline mr-1" />
                            )}
                            <span>{copiedAllUrls ? 'Copied All URLs!' : 'Copy All URLs'}</span>
                          </button>
                        </div>
                      </div>
                      <p className="multi-links-lead">
                        The statutory disclosures, regulatory frameworks, and supplemental agreement schedules below are formally incorporated into this promotional circular. AI vision models and OCR scanners extract and cross-verify each URL:
                      </p>
                      <div className="sheet-multi-links-grid">
                        {advertDoc.links.map((item: AdvertLink, idx: number): React.ReactNode => (
                          <div key={idx} className="multi-link-card">
                            <div className="multi-link-main">
                              <div className="multi-link-top">
                                <span className="multi-link-idx-tag">LINK {idx + 1}</span>
                                <span className="multi-link-label">{item.label}</span>
                                {item.badge && <span className="multi-link-badge">{item.badge}</span>}
                                {item.status && (
                                  <span
                                    className={`multi-link-status-pill ${
                                      item.status === 'Captured' ? 'status-pill-pass' : 'status-pill-fail'
                                    }`}
                                  >
                                    {item.status}
                                  </span>
                                )}
                              </div>
                              {item.description && <p className="multi-link-desc">{item.description}</p>}
                              <div className="multi-link-url-container">
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="multi-link-url"
                                  title={`Open ${item.label}`}
                                >
                                  <ExternalLink size={12} className="inline mr-1 flex-shrink-0" />
                                  <span>{item.url}</span>
                                </a>
                              </div>
                            </div>
                            {item.qrDataUrl && (
                              <div className="multi-link-qr-box" title={`Scannable QR code for [Link ${idx + 1}] ${item.label}`}>
                                <img
                                  src={item.qrDataUrl}
                                  alt={`QR for ${item.label}`}
                                  className="multi-link-qr-img"
                                />
                                <span className="multi-link-qr-tag">Scan Link {idx + 1}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Representative Calculation Example Box */}
                  <section className="sheet-representative-box">
                    <h4 className="rep-heading">
                      <Info size={14} className="inline mr-1 text-slate-600" />
                      Representative Financing Terms & Repayment Basis:
                    </h4>
                    <p className="rep-body">{advertDoc.representativeExample}</p>
                  </section>

                  {/* Statutory Fine Print Footer */}
                  <footer className="sheet-footer">
                    <div className="fine-print-title">STATUTORY DISCLOSURES & REGULATORY NOTICES:</div>
                    <p className="fine-print-body">{advertDoc.legalFinePrint}</p>

                    {/* Explicit Plaintext URL Directory for Multimodal OCR and Vision Ingestion */}
                    {advertDoc.links && advertDoc.links.length > 0 && (
                      <div className="sheet-statutory-links-index">
                        <div className="statutory-links-title">
                          STATUTORY DOCUMENT LOCATORS & MULTIPLE DIRECT URLS ({advertDoc.links.length} ACTIVE URLS):
                        </div>
                        <ol className="statutory-links-list">
                          {advertDoc.links.map((link: AdvertLink, idx: number): React.ReactNode => (
                            <li key={idx} className="statutory-link-item">
                              <span className="statutory-link-num">[{idx + 1}]</span>{' '}
                              <strong className="statutory-link-title">{link.label}:</strong>{' '}
                              <span className="statutory-link-href font-mono">{link.url}</span>
                              {link.badge && <span className="statutory-link-tag"> — {link.badge}</span>}
                              {link.status && (
                                <span
                                  className={`statutory-link-status ${
                                    link.status === 'Captured' ? 'text-emerald-700' : 'text-rose-700'
                                  }`}
                                >
                                  {' '}
                                  [Expected: {link.status}]
                                </span>
                              )}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    <div className="sheet-footer-bottom">
                      <span>
                        Apex Horizon Bancorp N.A. • NMLS Unique Identifier #{advertDoc.nmlsId} •{' '}
                        {advertDoc.memberFdic ? 'Member FDIC' : 'Non-Deposit Investment'}
                        {advertDoc.equalHousingLender && ' • Equal Housing Lender'}
                      </span>
                      <span>Verified Test Document • Ref: {advertDoc.advertToken}</span>
                    </div>
                  </footer>
                </article>

                {/* Ground Truth Cross-Check Discrepancy Panel (For Compliance Auditors & AI Benchmarks) */}
                {!clean && showInspectorNotes && (
                  <div className="inspector-panel-container">
                    {advertDoc.groundTruthDiscrepancies.length > 0 ? (
                      <div className="discrepancy-audit-panel">
                        <div className="discrepancy-panel-header">
                          <AlertTriangle size={18} className="text-rose-600" />
                          <div>
                            <h4 className="discrepancy-panel-title">
                              Compliance AI Benchmark: Ground-Truth Discrepancies (Advert vs Landing Page)
                            </h4>
                            <p className="discrepancy-panel-lead">
                              In this failing test scenario, the marketing advert deliberately strays from the destination
                              landing page. Nucomply AI must detect these contradictions upon scanning the QR code:
                            </p>
                          </div>
                        </div>

                        <div className="discrepancy-table-wrapper">
                          <table className="discrepancy-audit-table">
                            <thead>
                              <tr>
                                <th>Violation Category</th>
                                <th>Marketing Advert Claim</th>
                                <th>Landing Page Reality</th>
                                <th>Statutory Mandate</th>
                              </tr>
                            </thead>
                            <tbody>
                              {advertDoc.groundTruthDiscrepancies.map(
                                (item: GroundTruthDiscrepancy, idx: number): React.ReactNode => (
                                  <tr key={idx}>
                                    <td>
                                      <strong className="text-rose-700 flex items-center gap-1">
                                        <XCircle size={13} />
                                        {item.category}
                                      </strong>
                                    </td>
                                    <td className="text-rose-900 bg-rose-50/50">{item.advertClaim}</td>
                                    <td className="text-slate-800 bg-slate-50">{item.landingPageTruth}</td>
                                    <td className="font-mono text-xs text-slate-600">{item.regulatoryStandard}</td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="aligned-audit-panel">
                        <div className="aligned-panel-header">
                          <CheckCircle2 size={18} className="text-emerald-600" />
                          <div>
                            <h4 className="aligned-panel-title">
                              Compliance AI Benchmark: Complete Disclosure Alignment (Pass Scenario)
                            </h4>
                            <p className="aligned-panel-lead">
                              This advertisement fully and accurately summarizes the destination landing page. All APRs,
                              repayment schedules, trigger terms, and statutory disclaimers are in 100% agreement.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Technical Guidance Section */}
        {!clean && (
          <section className="compliance-guidance-section">
            <div className="guidance-container">
              <div className="guidance-box">
                <div className="guidance-header">
                  <QrCode size={20} className="text-cyan-400" />
                  <h3>How to Test Marketing Adverts with the Nucomply Platform:</h3>
                </div>
                <ul className="guidance-list">
                  <li>
                    <strong>Multimodal Cross-Inspection:</strong> Ingest the complete marketing advert via OCR or vision model,
                    extract advertised claims (rates, APRs, fees, guarantees), resolve the destination page via the embedded QR code,
                    and verify that all terms are consistent.
                  </li>
                  <li>
                    <strong>Bait-and-Switch Detection:</strong> In failing test cases, verify whether the AI flags contradictions
                    between promotional print promises and the live digital contract.
                  </li>
                  <li>
                    <strong>Randomization Testing:</strong> Click <strong>"Re-roll Random Copy"</strong> in the top toolbar to generate
                    new randomized claim values and rates to test your compliance model’s robustness against variable text.
                  </li>
                </ul>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AdvertDocumentPage;
