import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { AdvertDocumentData, TestCaseDefinition } from '../types/testSuite.ts';
import { STANDARD_TEST_CASES } from '../utils/testSuiteGenerator.ts';
import {
  generateAdvertDocument,
  getTestCaseById,
  printSingleAdvertHtml,
} from '../utils/advertGenerator.ts';
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
  FileText,
  QrCode,
  Sparkles,
  Download,
} from 'lucide-react';

export const AdvertDocumentPage: React.FC = (): React.ReactNode => {
  const { testId } = useParams<{ testId?: string }>();
  const navigate = useNavigate();

  // Find active test case definition, default to first test if not specified
  const activeTestCase = useMemo((): TestCaseDefinition => {
    if (testId) {
      const found = getTestCaseById(testId);
      if (found) return found;
    }
    return STANDARD_TEST_CASES[0];
  }, [testId]);

  // Compute base URL for QR codes and links
  const baseUrl = useMemo((): string => {
    if (window.location.hostname.includes('github.io')) {
      return 'https://owensheehan.github.io/NCT/';
    }
    return `${window.location.origin}${window.location.pathname}`;
  }, []);

  const [advertDoc, setAdvertDoc] = useState<AdvertDocumentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [randomSeed, setRandomSeed] = useState<number>(Date.now());

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
  const currentIndex = STANDARD_TEST_CASES.findIndex((tc: TestCaseDefinition): boolean => tc.id === activeTestCase.id);
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
        {/* Navigation & Controls Bar */}
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
                  Framework: <strong>{activeTestCase.regulatoryFramework}</strong>
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

                {advertDoc && (
                  <>
                    <button
                      type="button"
                      className="ctrl-btn ctrl-btn-print"
                      onClick={(): void => printSingleAdvertHtml(advertDoc)}
                      title="Open printable Letter/A4 format or save as PDF"
                    >
                      <Printer size={14} />
                      <span>Print / PDF Document</span>
                    </button>

                    <a
                      href={advertDoc.landingPageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ctrl-btn ctrl-btn-launch"
                      title="Open destination test landing page in new tab"
                    >
                      <ExternalLink size={14} />
                      <span>Launch Landing Page</span>
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Advert Document Sheet Area */}
        <section className="advert-stage-section">
          <div className="advert-stage-container">
            {loading || !advertDoc ? (
              <div className="loading-box">
                <Sparkles size={28} className="text-cyan-400 animate-spin" />
                <p>Generating standalone marketing advert document & QR code...</p>
              </div>
            ) : (
              <div className="advert-presentation-wrapper">
                {/* Physical-style marketing flyer document */}
                <article className="advert-document-sheet" id="advert-sheet">
                  {/* Bank Header */}
                  <header className="sheet-header">
                    <div className="brand-lockup">
                      <div className="sheet-bank-name">APEX HORIZON BANK & TRUST</div>
                      <div className="sheet-bank-sub">
                        CHARTERED COMMERCIAL & CONSUMER BANCORP • MEMBER FDIC • EQUAL HOUSING LENDER
                      </div>
                    </div>
                    <div className="sheet-header-meta">
                      <div className="sheet-badge-row">
                        <span
                          className={`sheet-status-tag ${
                            advertDoc.expectedOutcome === 'PASS' ? 'tag-pass' : 'tag-fail'
                          }`}
                        >
                          TEST SPECIFICATION: {advertDoc.expectedOutcome}
                        </span>
                      </div>
                      <div className="sheet-token-text">DOC REF: {advertDoc.advertToken}</div>
                      <div className="sheet-token-text">PUB DATE: {advertDoc.publishedDate}</div>
                    </div>
                  </header>

                  {/* Test Context Callout */}
                  <div className={`sheet-audit-callout ${advertDoc.expectedOutcome === 'FAIL' ? 'callout-fail' : ''}`}>
                    <div className="callout-title">
                      <FileText size={15} className="inline mr-1" />
                      <strong>MARKETING ADVERT DOCUMENT TEST CASE:</strong> {advertDoc.testId} — {advertDoc.testName}
                    </div>
                    <div className="callout-desc">
                      Simulated physical/digital advertisement for AI compliance inspection. The QR code links to the
                      live target landing page for cross-document consistency auditing.
                    </div>
                  </div>

                  {/* Main Promotional Headline */}
                  <div className="sheet-hero">
                    <div className="sheet-campaign-tag">{advertDoc.campaignTitle}</div>
                    <h1 className="sheet-headline">{advertDoc.headline}</h1>
                    <p className="sheet-subheadline">{advertDoc.subheadline}</p>
                  </div>

                  {/* Featured Offer Rate Card */}
                  <div className="sheet-rate-card">
                    <div className="rate-card-caption">FEATURED PROMOTIONAL RATE</div>
                    <div className="rate-card-value">{advertDoc.advertisedRate}</div>
                    <div className="rate-card-apr">
                      {advertDoc.advertisedApr ? (
                        <span>
                          Official APR: <strong>{advertDoc.advertisedApr}</strong>
                        </span>
                      ) : (
                        <span className="apr-omitted">
                          ⚠️ Annual Percentage Rate (APR) omitted in primary marketing circular
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Grid: Value Propositions & Scannable QR Code */}
                  <div className="sheet-content-grid">
                    {/* Benefits List */}
                    <div className="sheet-benefits-col">
                      <h3 className="section-heading">Promotional Details & Highlights:</h3>
                      <ul className="benefits-checklist">
                        {advertDoc.bulletPoints.map((bullet: string, idx: number): React.ReactNode => (
                          <li key={idx} className="benefit-item">
                            <span className="checkmark">✓</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* QR Code Action Box */}
                    <div className="sheet-qr-col">
                      <div className="advert-qr-box">
                        <div className="qr-badge">SCAN TO VERIFY OR APPLY</div>
                        <img
                          src={advertDoc.qrDataUrl}
                          alt={`QR Code to ${advertDoc.landingPageUrl}`}
                          className="advert-qr-image"
                        />
                        <div className="qr-url-display">{advertDoc.landingPageUrl}</div>
                        <button
                          type="button"
                          className="qr-save-subbtn"
                          onClick={handleDownloadQrOnly}
                          title="Save high-resolution QR image for test runners"
                        >
                          <Download size={11} className="mr-1 inline" />
                          <span>Save QR Image</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Ground Truth Discrepancies Panel */}
                  {advertDoc.discrepancies.length > 0 ? (
                    <div className="discrepancy-audit-panel">
                      <div className="discrepancy-panel-header">
                        <AlertTriangle size={16} className="text-rose-600" />
                        <span className="discrepancy-panel-title">
                          Expected AI Cross-Inspection Discrepancies (Advert vs Landing Page):
                        </span>
                      </div>
                      <p className="discrepancy-panel-lead">
                        In this failing test scenario, this marketing document intentionally strays from the landing
                        page. Nucomply AI should identify the following inconsistencies upon following the QR code:
                      </p>
                      <ul className="discrepancy-items-list">
                        {advertDoc.discrepancies.map((d: string, idx: number): React.ReactNode => (
                          <li key={idx} className="discrepancy-item">
                            <strong>Violation #{idx + 1}:</strong> {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="aligned-audit-panel">
                      <div className="aligned-panel-header">
                        <ShieldCheck size={16} className="text-emerald-600" />
                        <span className="aligned-panel-title">
                          Full Compliance Alignment (Pass Scenario):
                        </span>
                      </div>
                      <p className="aligned-panel-lead">
                        All rates, loan terms, trigger items, and statutory disclosures in this advertisement
                        correspond precisely to the destination landing page. No deceptive marketing or bait-and-switch
                        tactics are present.
                      </p>
                    </div>
                  )}

                  {/* Legal Fine Print */}
                  <footer className="sheet-footer">
                    <div className="fine-print-title">STATUTORY LEGAL DISCLOSURES & TERMS:</div>
                    <p className="fine-print-body">{advertDoc.legalFinePrint}</p>
                    <div className="sheet-footer-bottom">
                      <span>Apex Horizon Bancorp N.A. • Equal Opportunity Credit Provider</span>
                      <span>Document ID: {advertDoc.advertToken} • Verified Test Artifact</span>
                    </div>
                  </footer>
                </article>
              </div>
            )}
          </div>
        </section>

        {/* Guidance Section */}
        <section className="compliance-guidance-section">
          <div className="guidance-container">
            <div className="guidance-box">
              <div className="guidance-header">
                <QrCode size={20} className="text-cyan-400" />
                <h3>How Nucomply AI Tests Marketing Adverts with QR Codes:</h3>
              </div>
              <ul className="guidance-list">
                <li>
                  <strong>Cross-Document Multimodal Testing:</strong> The compliance engine ingests the marketing advert
                  (PDF, flyer, or image), scans the embedded QR code to resolve the destination URL, and fetches the
                  live digital landing page.
                </li>
                <li>
                  <strong>Bait-and-Switch Detection:</strong> The AI compares promotional promises in the advert (e.g.,
                  teaser rates, zero closing costs, unconditional approval) against the fine print and statutory disclosures
                  found on the destination webpage.
                </li>
                <li>
                  <strong>Dynamic Randomization:</strong> Use the <strong>"Re-roll Random Copy"</strong> button above to
                  generate alternative copy variants and rates, allowing stress-testing of AI tolerance and fuzzy matching.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AdvertDocumentPage;
