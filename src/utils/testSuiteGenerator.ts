import QRCode from 'qrcode';
import type { TestCaseDefinition, TestCaseWithQr, TestSuiteExport } from '../types/testSuite.ts';

export const STANDARD_TEST_CASES: TestCaseDefinition[] = [
  {
    id: 'TC-MTG-01-PASS',
    name: 'Mortgage Conforming APR Full Disclosure',
    vertical: 'Mortgages',
    subpath: '#/mortgages?outcome=pass',
    expectedOutcome: 'PASS',
    variantId: 'compliant',
    regulatoryFramework: 'TILA / 12 CFR Part 1026 (Reg Z)',
    description: 'Fully compliant mortgage advertising: Clear note rates adjacent to APRs, Equal Housing Lender notice, and complete repayment trigger terms.',
    expectedViolations: [],
  },
  {
    id: 'TC-MTG-02-FAIL',
    name: 'Mortgage Trigger Term Omission & Buried Footnote',
    vertical: 'Mortgages',
    subpath: '#/mortgages?variant=minor_omissions',
    expectedOutcome: 'FAIL',
    variantId: 'minor_omissions',
    regulatoryFramework: 'TILA / 12 CFR § 1026.24(d)',
    description: 'Promotes exact monthly payments ($1,750/mo) but buries APR in faint footer text. Omission of required adjacent APR.',
    expectedViolations: ['APR Less Prominent Than Note Rate', 'Ambiguous "No Fee" Promotion'],
  },
  {
    id: 'TC-MTG-03-FAIL',
    name: 'Mortgage UDAAP: Guaranteed Approval & Zero Down Claim',
    vertical: 'Mortgages',
    subpath: '#/mortgages?variant=high_risk_udaap',
    expectedOutcome: 'FAIL',
    variantId: 'high_risk_udaap',
    regulatoryFramework: 'CFPB UDAAP / 12 U.S.C. § 5536 & Reg Z',
    description: 'Claims "100% Guaranteed Approval with No Credit Checks", complete omission of APR with trigger terms, and omitted Equal Housing logo.',
    expectedViolations: [
      'Complete Absence of Required APR with Trigger Terms',
      'Deceptive "100% Guaranteed Approval" Claim',
      'Deceptive "Free Mortgage / Zero Closing Costs" Misrepresentation',
    ],
  },
  {
    id: 'TC-MTG-04-FAIL',
    name: 'Mortgage 0.99% Teaser Rate Trap with Prepayment Lock',
    vertical: 'Mortgages',
    subpath: '#/mortgages?variant=teaser_trap',
    expectedOutcome: 'FAIL',
    variantId: 'teaser_trap',
    regulatoryFramework: 'TILA 12 CFR § 1026.24(f)(2) & CFPB UDAAP',
    description: 'Promotes 0.99% introductory rate without disclosing immediate reset to 10.45% variable APR and hidden 5% exit prepayment penalty.',
    expectedViolations: ['Misleading Discount / Teaser Rate Advertising', 'Hidden Prepayment Penalty and Balloon Payment'],
  },
  {
    id: 'TC-CRD-01-PASS',
    name: 'Credit Card Full CARD Act Schumer Box Disclosure',
    vertical: 'Credit Cards',
    subpath: '#/credit-cards?outcome=pass',
    expectedOutcome: 'PASS',
    variantId: 'compliant',
    regulatoryFramework: 'Credit CARD Act of 2009 / 12 CFR § 1026.60',
    description: 'Compliant tabular Schumer Box provided, transparent balance transfer fee (3% / $5 min), penalty APR disclosure, and clear 15-month intro period duration.',
    expectedViolations: [],
  },
  {
    id: 'TC-CRD-02-FAIL',
    name: 'Credit Card Omitted Schumer Box & Deferred Interest',
    vertical: 'Credit Cards',
    subpath: '#/credit-cards?variant=high_risk_udaap',
    expectedOutcome: 'FAIL',
    variantId: 'high_risk_udaap',
    regulatoryFramework: 'CARD Act 12 CFR § 1026.60 & CFPB UDAAP',
    description: 'Mandatory Schumer Box omitted. Claims "Guaranteed $15,000 Credit Limit for Everyone" and conceals retroactive 32.99% deferred interest.',
    expectedViolations: [
      'Omission of Mandatory Schumer Box Disclosures',
      'Deceptive Deferred Interest Trap',
      'Guaranteed Unconditional Credit Limit Claim',
    ],
  },
  {
    id: 'TC-SAV-01-PASS',
    name: 'High-Yield Savings TISA Reg DD & FDIC $250k Cap',
    vertical: 'Savings & Deposits',
    subpath: '#/savings?outcome=pass',
    expectedOutcome: 'PASS',
    variantId: 'compliant',
    regulatoryFramework: 'Truth in Savings Act (TISA / 12 CFR Part 1030) & FDIC',
    description: 'Annual Percentage Yield (APY) accurately stated, minimum balance disclosed, "fees could reduce earnings" warning included, and accurate FDIC $250k protection limits.',
    expectedViolations: [],
  },
  {
    id: 'TC-SAV-02-FAIL',
    name: 'Savings Fictitious 8.5% Govt Guarantee & Infinite FDIC',
    vertical: 'Savings & Deposits',
    subpath: '#/savings?variant=high_risk_udaap',
    expectedOutcome: 'FAIL',
    variantId: 'high_risk_udaap',
    regulatoryFramework: '12 U.S.C. 1828(a)(4), 12 CFR Part 328 & Reg DD',
    description: 'Claims deposits are "100% FDIC Insured up to $100 Million with Zero Risk" and claims 8.5% APY is guaranteed by the Federal Reserve.',
    expectedViolations: [
      'Misleading FDIC Coverage Representation',
      'Fictitious "Government-Guaranteed 8.5% Rate" Claim',
      'Deceptive Concealment of Yield-Eradicating Fees',
    ],
  },
  {
    id: 'TC-SAV-03-FAIL',
    name: 'Savings 9% Flash Teaser with Early Exit Penalty',
    vertical: 'Savings & Deposits',
    subpath: '#/savings?variant=teaser_trap',
    expectedOutcome: 'FAIL',
    variantId: 'teaser_trap',
    regulatoryFramework: '12 CFR § 1030.8(c)(2) & CFPB UDAAP',
    description: 'Omission of introductory 30-day period limit on 9.00% APY and concealed $250 early account closure penalty.',
    expectedViolations: ['Deceptive Promotional Rate Duration Omission', 'Predatory Early Exit Fee Trap'],
  },
  {
    id: 'TC-WLTH-01-PASS',
    name: 'Wealth Management SEC/FINRA Risk Disclosures',
    vertical: 'Wealth Advisory',
    subpath: '#/wealth?outcome=pass',
    expectedOutcome: 'PASS',
    variantId: 'compliant',
    regulatoryFramework: 'FINRA Rule 2210 & SEC Investment Advisers Act',
    description: 'Prominent "Not FDIC Insured • No Bank Guarantee • May Lose Value" banner, past performance caveats, and transparent advisory fee breakdown.',
    expectedViolations: [],
  },
  {
    id: 'TC-WLTH-02-FAIL',
    name: 'Wealth 20% Guaranteed Returns & False FDIC Claims',
    vertical: 'Wealth Advisory',
    subpath: '#/wealth?variant=high_risk_udaap',
    expectedOutcome: 'FAIL',
    variantId: 'high_risk_udaap',
    regulatoryFramework: 'FINRA Rule 2210(d)(1)(D) & Interagency Statement',
    description: 'Directly promises "Guaranteed 20% Annual Profit with Zero Downside" and claims securities investments are backed by bank FDIC insurance.',
    expectedViolations: [
      'Prohibited Prediction / Guarantee of Investment Performance',
      'Fraudulent Claim of FDIC Insurance on Nondeposit Investment Securities',
    ],
  },
  {
    id: 'TC-BIZ-01-PASS',
    name: 'Commercial Credit CA SB 1235 APR Transparency',
    vertical: 'Commercial Credit',
    subpath: '#/business-loans?outcome=pass',
    expectedOutcome: 'PASS',
    variantId: 'compliant',
    regulatoryFramework: 'CA SB 1235 & NY Commercial Finance Disclosure Law',
    description: 'Standardized commercial APR disclosed, itemized finance charges, and clear personal guarantee requirements for >=20% business owners.',
    expectedViolations: [],
  },
  {
    id: 'TC-BIZ-02-FAIL',
    name: 'Commercial Predatory MCA Disguised as 9% Bank Loan',
    vertical: 'Commercial Credit',
    subpath: '#/business-loans?variant=high_risk_udaap',
    expectedOutcome: 'FAIL',
    variantId: 'high_risk_udaap',
    regulatoryFramework: 'CFPB UDAAP & State Commercial Financing Laws',
    description: 'Conceals effective 88.5% APR behind deceptive "9% Flat Fee" claim and falsely asserts "No Personal Guarantee Needed".',
    expectedViolations: [
      'Deceptive Factor Rate Masked as Low-Interest APR',
      'Deceptive "No Personal Guarantee" Representation',
    ],
  },
  {
    id: 'TC-DISC-01-PASS',
    name: 'Regulatory Archive CRA Notice & Master Fee Schedule',
    vertical: 'Statutory Disclosures',
    subpath: '#/disclosures?outcome=pass',
    expectedOutcome: 'PASS',
    variantId: 'compliant',
    regulatoryFramework: 'CRA 12 CFR Part 25 & Statutory Disclosure Mandates',
    description: 'Complete Community Reinvestment Act public file notice, itemized account fee schedule, and federal governance matrix.',
    expectedViolations: [],
  },
  {
    id: 'TC-DISC-02-FAIL',
    name: 'Regulatory Exemption Falsehood & Concealed Fees',
    vertical: 'Statutory Disclosures',
    subpath: '#/disclosures?variant=high_risk_udaap',
    expectedOutcome: 'FAIL',
    variantId: 'high_risk_udaap',
    regulatoryFramework: 'Federal Depository Charter Rules & CFPB UDAAP',
    description: 'Bank fraudulently asserts sovereign charter exemption from CFPB, TILA, and FDIC oversight, refusing to publish account fee schedules.',
    expectedViolations: ['Fraudulent Assertion of Regulatory Exemption'],
  },
];

/**
 * Builds the test suite with generated QR codes for each test case.
 */
export const buildTestSuiteWithQrs = async (baseUrl: string): Promise<TestCaseWithQr[]> => {
  const sanitizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

  const results: TestCaseWithQr[] = [];
  for (const tc of STANDARD_TEST_CASES) {
    const fullUrl = `${sanitizedBase}${tc.subpath}`;
    const qrDataUrl = await QRCode.toDataURL(fullUrl, {
      width: 220,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });

    results.push({
      ...tc,
      fullUrl,
      qrDataUrl,
    });
  }

  return results;
};

/**
 * Exports test suite as JSON format for automated test harnesses
 */
export const exportTestSuiteJson = (suite: TestSuiteExport): void => {
  const jsonString = JSON.stringify(suite, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `nucomply-test-suite-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Exports test suite as CSV format for spreadsheets and QA trackers
 */
export const exportTestSuiteCsv = (tests: TestCaseWithQr[]): void => {
  const headers = [
    'Test ID',
    'Test Name',
    'Banking Vertical',
    'Expected Outcome',
    'Regulatory Framework',
    'Full URL',
    'Variant ID',
    'Expected Violations',
    'Description',
  ];

  const rows = tests.map((t): string[] => [
    `"${t.id}"`,
    `"${t.name.replace(/"/g, '""')}"`,
    `"${t.vertical}"`,
    `"${t.expectedOutcome}"`,
    `"${t.regulatoryFramework.replace(/"/g, '""')}"`,
    `"${t.fullUrl}"`,
    `"${t.variantId}"`,
    `"${t.expectedViolations.join('; ').replace(/"/g, '""')}"`,
    `"${t.description.replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r): string => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `nucomply-test-suite-${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Opens a dedicated printable/PDF test sheet with embedded scannable QR codes
 */
export const printTestSheetHtml = (suite: TestSuiteExport): void => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Nucomply Compliance AI Test Suite & QR Code Sheet</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #0f172a;
      background: #f8fafc;
      padding: 30px;
      margin: 0;
    }
    .header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 15px;
      margin-bottom: 25px;
    }
    .header h1 {
      margin: 0 0 6px;
      font-size: 24px;
      color: #0f172a;
    }
    .header p {
      margin: 0;
      color: #475569;
      font-size: 13px;
    }
    .meta-bar {
      display: flex;
      gap: 20px;
      margin-top: 10px;
      font-size: 12px;
      font-family: monospace;
      color: #334155;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
    @media print {
      body { background: #fff; padding: 15px; }
      .grid { grid-template-columns: repeat(2, 1fr); gap: 15px; }
      .test-card { break-inside: avoid; }
      .no-print { display: none; }
    }
    .test-card {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 16px;
      background: #ffffff;
      display: flex;
      gap: 16px;
      align-items: center;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .qr-box {
      width: 130px;
      height: 130px;
      flex-shrink: 0;
      text-align: center;
    }
    .qr-box img {
      width: 100%;
      height: 100%;
      border-radius: 4px;
    }
    .info-box {
      flex: 1;
    }
    .tag-row {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 6px;
    }
    .badge {
      font-size: 11px;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .badge-pass { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
    .badge-fail { background: #ffe4e6; color: #9f1239; border: 1px solid #fda4af; }
    .tc-id {
      font-family: monospace;
      font-size: 11px;
      color: #64748b;
    }
    .tc-name {
      margin: 0 0 6px;
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
    }
    .tc-rule {
      font-size: 11px;
      font-weight: 600;
      color: #0284c7;
      margin-bottom: 6px;
    }
    .tc-url {
      font-family: monospace;
      font-size: 10px;
      word-break: break-all;
      background: #f1f5f9;
      padding: 4px 6px;
      border-radius: 4px;
      margin-top: 6px;
      display: block;
      color: #334155;
    }
    .print-btn {
      background: #0f172a;
      color: #fff;
      padding: 10px 18px;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="no-print">
    <button class="print-btn" onclick="window.print()">🖨️ Print or Save as PDF</button>
  </div>
  <div class="header">
    <h1>${suite.suiteTitle}</h1>
    <p>Automated Compliance AI Test Suite • Scannable QR Codes & Target URLs</p>
    <div class="meta-bar">
      <span>Base URL: <strong>${suite.baseUrl}</strong></span>
      <span>Generated: <strong>${suite.generatedAt}</strong></span>
      <span>Total Tests: <strong>${suite.totalTests}</strong> (${suite.passingTests} PASS, ${suite.failingTests} FAIL)</span>
    </div>
  </div>

  <div class="grid">
    ${suite.tests
      .map(
        (t): string => `
      <div class="test-card">
        <div class="qr-box">
          <img src="${t.qrDataUrl}" alt="QR code for ${t.id}">
        </div>
        <div class="info-box">
          <div class="tag-row">
            <span class="badge ${t.expectedOutcome === 'PASS' ? 'badge-pass' : 'badge-fail'}">
              EXPECTED: ${t.expectedOutcome}
            </span>
            <span class="tc-id">${t.id}</span>
          </div>
          <h3 class="tc-name">${t.name}</h3>
          <div class="tc-rule">${t.regulatoryFramework}</div>
          <div style="font-size: 11px; color: #475569; line-height: 1.4;">${t.description}</div>
          <a class="tc-url" href="${t.fullUrl}" target="_blank">${t.fullUrl}</a>
        </div>
      </div>
    `
      )
      .join('')}
  </div>
</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
};
