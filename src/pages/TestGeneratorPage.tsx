import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { TestCaseWithQr, TestSuiteExport } from '../types/testSuite.ts';
import {
  buildTestSuiteWithQrs,
  exportTestSuiteJson,
  exportTestSuiteCsv,
  printTestSheetHtml,
} from '../utils/testSuiteGenerator.ts';
import {
  buildAllAdvertDocuments,
  printAdvertBookletHtml,
} from '../utils/advertGenerator.ts';
import { ComplianceAuditBar } from '../components/ComplianceAuditBar.tsx';
import { Navbar } from '../components/Navbar.tsx';
import { Footer } from '../components/Footer.tsx';
import { getVisitSession } from '../utils/dynamicContent.ts';
import {
  QrCode,
  Download,
  Printer,
  Copy,
  Check,
  ExternalLink,
  Filter,
  Layers,
  Sparkles,
  FileSpreadsheet,
  FileText,
  BookOpen,
} from 'lucide-react';

export const TestGeneratorPage: React.FC = (): React.ReactNode => {
  const session = useMemo(() => getVisitSession(), []);

  // Compute default base URL
  const defaultBaseUrl = useMemo((): string => {
    // If on GitHub pages, default to https://owensheehan.github.io/NCT/
    if (window.location.hostname.includes('github.io')) {
      return 'https://owensheehan.github.io/NCT/';
    }
    return `${window.location.origin}${window.location.pathname}`;
  }, []);

  const [baseUrl, setBaseUrl] = useState<string>(defaultBaseUrl);
  const [testCases, setTestCases] = useState<TestCaseWithQr[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filters
  const [selectedVertical, setSelectedVertical] = useState<string>('All');
  const [selectedOutcome, setSelectedOutcome] = useState<'All' | 'PASS' | 'FAIL'>('All');

  useEffect((): (() => void) => {
    let isMounted = true;
    setLoading(true);
    buildTestSuiteWithQrs(baseUrl).then((cases: TestCaseWithQr[]): void => {
      if (isMounted) {
        setTestCases(cases);
        setLoading(false);
      }
    });
    return (): void => {
      isMounted = false;
    };
  }, [baseUrl]);

  // Filtered test cases
  const filteredCases = useMemo((): TestCaseWithQr[] => {
    return testCases.filter((tc: TestCaseWithQr): boolean => {
      const matchVertical = selectedVertical === 'All' || tc.vertical === selectedVertical;
      const matchOutcome = selectedOutcome === 'All' || tc.expectedOutcome === selectedOutcome;
      return matchVertical && matchOutcome;
    });
  }, [testCases, selectedVertical, selectedOutcome]);

  const testSuiteExportData = useMemo((): TestSuiteExport => {
    const passingCount = testCases.filter((t): boolean => t.expectedOutcome === 'PASS').length;
    return {
      suiteTitle: 'Nucomply Banking Compliance AI Test Suite',
      suiteVersion: '2.0.0',
      generatedAt: new Date().toISOString(),
      baseUrl,
      totalTests: testCases.length,
      passingTests: passingCount,
      failingTests: testCases.length - passingCount,
      tests: filteredCases,
    };
  }, [baseUrl, testCases, filteredCases]);

  const handleCopyUrl = (id: string, url: string): void => {
    navigator.clipboard.writeText(url).then((): void => {
      setCopiedId(id);
      setTimeout((): void => setCopiedId(null), 2000);
    });
  };

  const handleDownloadSingleQr = (tc: TestCaseWithQr): void => {
    const link = document.createElement('a');
    link.href = tc.qrDataUrl;
    link.download = `${tc.id}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [printingAdverts, setPrintingAdverts] = useState<boolean>(false);

  const handlePrintAllAdverts = async (): Promise<void> => {
    setPrintingAdverts(true);
    try {
      const docs = await buildAllAdvertDocuments(baseUrl);
      printAdvertBookletHtml(docs, baseUrl);
    } finally {
      setPrintingAdverts(false);
    }
  };

  return (
    <div className="page-shell">
      <ComplianceAuditBar
        session={session}
        flags={[]}
        complianceRating="A (Fully Compliant)"
        riskLevel="LOW"
        variantSummary="Test Suite Generator for Automated AI Compliance Platforms"
      />

      <Navbar />

      <main className="main-content">
        {/* Page Hero */}
        <section className="page-hero">
          <div className="page-hero-container">
            <div className="hero-badge">
              <QrCode size={14} className="inline mr-1 text-cyan-400" />
              <span>Automated Testing Suite</span>
            </div>
            <h1 className="page-hero-title">Compliance AI Test File & QR Code Suite Generator</h1>
            <p className="page-hero-lead">
              Generate standardized test fixture files, scannable QR codes, and target test URLs across
              all banking verticals. Use this testbed to kick off automated audits and benchmark your
              compliance AI against ground-truth statutory violations.
            </p>

            {/* Base URL Configuration */}
            <div className="generator-config-card">
              <div className="config-row">
                <div className="config-input-group">
                  <label htmlFor="base-url-input" className="config-label">
                    Target Site Base URL:
                  </label>
                  <input
                    id="base-url-input"
                    type="url"
                    value={baseUrl}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setBaseUrl(e.target.value)}
                    className="config-url-input"
                    placeholder="https://owensheehan.github.io/NCT/"
                  />
                </div>
                <div className="config-metrics">
                  <span className="config-pill">
                    <strong>{testCases.length}</strong> Total Tests
                  </span>
                  <span className="config-pill text-emerald-400">
                    <strong>{testCases.filter((t): boolean => t.expectedOutcome === 'PASS').length}</strong> PASS Cases
                  </span>
                  <span className="config-pill text-rose-400">
                    <strong>{testCases.filter((t): boolean => t.expectedOutcome === 'FAIL').length}</strong> FAIL Cases
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Action Bar & Filters */}
        <section className="generator-actions-section">
          <div className="generator-actions-container">
            <div className="actions-header-bar">
              {/* Filter Controls */}
              <div className="filters-group">
                <div className="filter-item">
                  <Filter size={14} className="text-slate-400 mr-1 inline" />
                  <label htmlFor="filter-vertical" className="filter-label">Vertical:</label>
                  <select
                    id="filter-vertical"
                    value={selectedVertical}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => setSelectedVertical(e.target.value)}
                    className="filter-select"
                  >
                    <option value="All">All Verticals (15 Tests)</option>
                    <option value="Mortgages">Mortgages</option>
                    <option value="Credit Cards">Credit Cards</option>
                    <option value="Savings & Deposits">Savings & Deposits</option>
                    <option value="Wealth Advisory">Wealth Advisory</option>
                    <option value="Commercial Credit">Commercial Credit</option>
                    <option value="Statutory Disclosures">Statutory Disclosures</option>
                  </select>
                </div>

                <div className="filter-item">
                  <label htmlFor="filter-outcome" className="filter-label">Expected Result:</label>
                  <select
                    id="filter-outcome"
                    value={selectedOutcome}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>): void =>
                      setSelectedOutcome(e.target.value as 'All' | 'PASS' | 'FAIL')
                    }
                    className="filter-select"
                  >
                    <option value="All">All Outcomes (Pass & Fail)</option>
                    <option value="PASS">Pass Only (Compliant)</option>
                    <option value="FAIL">Fail Only (Violations)</option>
                  </select>
                </div>
              </div>

              {/* Export Buttons */}
              <div className="exports-group">
                <button
                  type="button"
                  className="export-btn export-btn-booklet"
                  onClick={handlePrintAllAdverts}
                  disabled={printingAdverts}
                  title="Generate and print full booklet of individual advert documents for all test cases"
                >
                  <BookOpen size={15} />
                  <span>{printingAdverts ? 'Building Booklet...' : 'Print All Adverts Booklet'}</span>
                </button>

                <button
                  type="button"
                  className="export-btn export-btn-primary"
                  onClick={(): void => exportTestSuiteJson(testSuiteExportData)}
                  title="Download test manifest with URLs and expected results for automated test runners"
                >
                  <Download size={15} />
                  <span>Download Test File (JSON)</span>
                </button>

                <button
                  type="button"
                  className="export-btn export-btn-secondary"
                  onClick={(): void => exportTestSuiteCsv(filteredCases)}
                  title="Download CSV spreadsheet for Excel, Jira, or Postman runner"
                >
                  <FileSpreadsheet size={15} />
                  <span>Download CSV</span>
                </button>

                <button
                  type="button"
                  className="export-btn export-btn-accent"
                  onClick={(): void => printTestSheetHtml(testSuiteExportData)}
                  title="Open formatted printable sheet with scannable QR codes"
                >
                  <Printer size={15} />
                  <span>Print / PDF QR Sheet</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* QR Code Cards Grid */}
        <section className="test-grid-section">
          <div className="test-grid-container">
            {loading ? (
              <div className="loading-box">
                <Sparkles size={24} className="text-cyan-400 animate-spin" />
                <p>Generating high-resolution QR codes and test cases...</p>
              </div>
            ) : filteredCases.length === 0 ? (
              <div className="audit-clean-box">
                <p>No test cases match your selected filter criteria.</p>
              </div>
            ) : (
              <div className="test-cards-grid">
                {filteredCases.map((tc: TestCaseWithQr): React.ReactNode => (
                  <div key={tc.id} className="test-case-card">
                    {/* QR Code Column */}
                    <div className="tc-qr-col">
                      <div className="tc-qr-frame">
                        <img src={tc.qrDataUrl} alt={`QR Code for ${tc.name}`} className="tc-qr-img" />
                      </div>
                      <button
                        type="button"
                        className="tc-qr-download-btn"
                        onClick={(): void => handleDownloadSingleQr(tc)}
                        title="Download this QR code PNG"
                      >
                        <Download size={11} className="mr-1 inline" />
                        <span>Save QR</span>
                      </button>
                    </div>

                    {/* Test Info Column */}
                    <div className="tc-info-col">
                      <div className="tc-top-row">
                        <span
                          className={`tc-outcome-badge ${
                            tc.expectedOutcome === 'PASS' ? 'tc-outcome-pass' : 'tc-outcome-fail'
                          }`}
                        >
                          EXPECTED: {tc.expectedOutcome}
                        </span>
                        <span className="tc-id-tag">{tc.id}</span>
                        <span className="tc-vertical-tag">{tc.vertical}</span>
                      </div>

                      <h3 className="tc-title">{tc.name}</h3>
                      <div className="tc-rule-tag">{tc.regulatoryFramework}</div>
                      <p className="tc-desc">{tc.description}</p>

                      {tc.expectedViolations.length > 0 && (
                        <div className="tc-violations-box">
                          <strong className="text-rose-400 text-xs block mb-1">
                            Expected AI Violations to Detect ({tc.expectedViolations.length}):
                          </strong>
                          <ul className="tc-violations-list">
                            {tc.expectedViolations.map((v: string, idx: number): React.ReactNode => (
                              <li key={idx}>• {v}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Card Action Buttons */}
                      <div className="tc-card-actions">
                        <Link
                          to={`/advert/${tc.id}`}
                          className="tc-btn-advert"
                          title="View complete dedicated marketing advertisement for this test"
                        >
                          <FileText size={13} />
                          <span>View Complete Advert</span>
                        </Link>
                        <a
                          href={tc.fullUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tc-btn-launch"
                          title="Open target test page in new tab"
                        >
                          <ExternalLink size={13} />
                          <span>Launch Page</span>
                        </a>
                      </div>

                      {/* URL Bar with Copy Button */}
                      <div className="tc-url-bar">
                        <span className="tc-url-text" title={tc.fullUrl}>
                          {tc.fullUrl}
                        </span>
                        <button
                          type="button"
                          className="tc-copy-btn"
                          onClick={(): void => handleCopyUrl(tc.id, tc.fullUrl)}
                          title="Copy target test URL to clipboard"
                        >
                          {copiedId === tc.id ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                          <span>{copiedId === tc.id ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Automated Testing Documentation */}
        <section className="compliance-guidance-section">
          <div className="guidance-container">
            <div className="guidance-box">
              <div className="guidance-header">
                <Layers size={20} className="text-cyan-400" />
                <h3>How to Integrate the Test File with Nucomply Platform:</h3>
              </div>
              <ul className="guidance-list">
                <li>
                  <strong>Automated Batch Audits:</strong> Click <strong>"Download Test File (JSON)"</strong> to obtain a machine-readable array of all test URLs, expected outcomes, and expected violation strings to feed into your test runner.
                </li>
                <li>
                  <strong>Mobile & OCR Inspection:</strong> Use the <strong>"Print / PDF QR Sheet"</strong> button to display or print high-density QR codes for camera-based scanning, automated OCR validation, or QA review.
                </li>
                <li>
                  <strong>Deterministic & Dynamic Testing:</strong> All URLs ending in <code>?outcome=pass</code> guarantee compliant conditions, while URLs ending in <code>?outcome=fail</code> guarantee non-compliant conditions, while generating fresh dynamic visit tokens on each scan.
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
