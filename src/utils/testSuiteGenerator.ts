import QRCode from 'qrcode';
import type { TestCaseDefinition, TestCaseWithQr, TestSuiteExport } from '../types/testSuite.ts';

export const STANDARD_TEST_CASES: TestCaseDefinition[] = [
  {
    id: 'TC-MTG-01-PASS',
    name: 'Mortgage Conforming APR Full Disclosure',
    vertical: 'Mortgages',
    subpath: 'mortgages?outcome=pass&chrome=off',
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
    subpath: 'mortgages?variant=minor_omissions&chrome=off',
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
    subpath: 'mortgages?variant=high_risk_udaap&chrome=off',
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
    subpath: 'mortgages?variant=teaser_trap&chrome=off',
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
    subpath: 'credit-cards?outcome=pass&chrome=off',
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
    subpath: 'credit-cards?variant=high_risk_udaap&chrome=off',
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
    subpath: 'savings?outcome=pass&chrome=off',
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
    subpath: 'savings?variant=high_risk_udaap&chrome=off',
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
    subpath: 'savings?variant=teaser_trap&chrome=off',
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
    subpath: 'wealth?outcome=pass&chrome=off',
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
    subpath: 'wealth?variant=high_risk_udaap&chrome=off',
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
    subpath: 'business-loans?outcome=pass&chrome=off',
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
    subpath: 'business-loans?variant=high_risk_udaap&chrome=off',
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
    subpath: 'disclosures?outcome=pass&chrome=off',
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
    subpath: 'disclosures?variant=high_risk_udaap&chrome=off',
    expectedOutcome: 'FAIL',
    variantId: 'high_risk_udaap',
    regulatoryFramework: 'Federal Depository Charter Rules & CFPB UDAAP',
    description: 'Bank fraudulently asserts sovereign charter exemption from CFPB, TILA, and FDIC oversight, refusing to publish account fee schedules.',
    expectedViolations: ['Fraudulent Assertion of Regulatory Exemption'],
  },

  // =========================================================================
  // LINKED FILE & DOWNLOAD TEST CASES (LLM-4188 TEST BED EXERCISES)
  // =========================================================================
  {
    id: 'TC-FILE-B01-PASS',
    name: 'Linked File B1: 3-Page Text PDF Disclosure',
    vertical: 'Linked Files & Downloads',
    subpath: 'files/llm-4188/disclosure-text.pdf',
    expectedOutcome: 'PASS',
    variantId: 'teaser_trap',
    regulatoryFramework: 'PDF Text-Layer Ingestion & Contradiction Detection',
    description: 'Multi-page rate disclosure PDF with a real text layer matching 0.99% teaser mortgage terms. Exercises direct text-layer extraction.',
    fileExercise: 'B1',
    captureExpectedBadge: 'Captured',
    captureExpectedMessage: 'PDF text layer read directly. Chromium screenshot rendered of page 1.',
    expectedViolations: [
      'Contradiction: Advert promises zero lender closing fees while PDF Schedule lists $3,450 underwriting and origination fees.',
      'Contradiction: Advert promises no prepayment penalty while PDF Section 4 levies mandatory 5% ($15,000) penalty on payoffs within 60 months.',
      'Contradiction: Advert advertises 12-month lock while PDF states introductory rate resets on month 7 to 10.450% APR.',
    ],
  },
  {
    id: 'TC-FILE-B02-PASS',
    name: 'Linked File B2: Scanned Image-Only PDF Disclosure',
    vertical: 'Linked Files & Downloads',
    subpath: 'files/llm-4188/disclosure-scan.pdf',
    expectedOutcome: 'PASS',
    variantId: 'teaser_trap',
    regulatoryFramework: 'Azure Document Intelligence & Tesseract OCR Fallback',
    description: 'Same rate disclosure content rendered purely as raster images with zero text layer. Exercises OCR fallback pipelines.',
    fileExercise: 'B2',
    captureExpectedBadge: 'Captured',
    captureExpectedMessage: 'PDF has no text layer; OCR pipeline invoked. Page 1 screenshot rendered.',
    expectedViolations: [
      'Contradiction: Advert promises zero lender closing fees while scanned PDF lists $3,450 origination charges.',
      'Contradiction: Advert promises no prepayment penalty while scanned PDF Section 4 levies 5% lockout fee.',
    ],
  },
  {
    id: 'TC-FILE-B03-FAIL',
    name: 'Linked File B3: Blank PDF (Zero Readable Text)',
    vertical: 'Linked Files & Downloads',
    subpath: 'files/llm-4188/disclosure-blank.pdf',
    expectedOutcome: 'FAIL',
    variantId: 'high_risk_udaap',
    regulatoryFramework: 'Empty PDF Verification Failure',
    description: 'One blank white PDF page. Capture fails gracefully with explicit message.',
    fileExercise: 'B3',
    captureExpectedBadge: 'Failed',
    captureExpectedMessage: 'No readable text was found in the linked PDF.',
    expectedViolations: [
      'Capture Status: Failed',
      'Expected Error Message: "No readable text was found in the linked PDF."',
      'AI Review must report destination could not be verified due to empty document.',
    ],
  },
  {
    id: 'TC-FILE-B04-PASS',
    name: 'Linked File B4: Untyped Binary PDF (.bin Extension)',
    vertical: 'Linked Files & Downloads',
    subpath: 'files/llm-4188/disclosure-download.bin',
    expectedOutcome: 'PASS',
    variantId: 'teaser_trap',
    regulatoryFramework: 'Magic Byte Detection (%PDF- Header)',
    description: 'PDF served as application/octet-stream (.bin). Backend inspects magic bytes and processes as PDF.',
    fileExercise: 'B4',
    captureExpectedBadge: 'Captured',
    captureExpectedMessage: 'Recognized as PDF from magic bytes (%PDF-). Captured and text extracted.',
    expectedViolations: [
      'Contradiction: Advert promises zero fees while binary PDF lists $3,450 origination charge.',
      'Contradiction: Advert promises no prepayment penalty while binary PDF specifies 5% penalty.',
    ],
  },
  {
    id: 'TC-FILE-B05-FAIL',
    name: 'Linked File B5: Non-PDF Binary (.bin Zip Archive)',
    vertical: 'Linked Files & Downloads',
    subpath: 'files/llm-4188/not-a-pdf.bin',
    expectedOutcome: 'FAIL',
    variantId: 'high_risk_udaap',
    regulatoryFramework: 'Unsupported Binary Rejection',
    description: 'Zip archive served with .bin extension. Fails with clear non-webpage/non-PDF error message.',
    fileExercise: 'B5',
    captureExpectedBadge: 'Failed',
    captureExpectedMessage: 'The link opens a file (application/octet-stream) rather than a web page. Only web pages and PDFs can be captured.',
    expectedViolations: [
      'Capture Status: Failed',
      'Expected Error Message: "The link opens a file (application/octet-stream) rather than a web page. Only web pages and PDFs can be captured."',
    ],
  },
  {
    id: 'TC-FILE-B06-FAIL',
    name: 'Linked File B6: Microsoft Word Document (.docx)',
    vertical: 'Linked Files & Downloads',
    subpath: 'files/llm-4188/terms.docx',
    expectedOutcome: 'FAIL',
    variantId: 'high_risk_udaap',
    regulatoryFramework: 'Unsupported Document Rejection',
    description: 'Word .docx document containing terms. Fails capture with clear content-type error message.',
    fileExercise: 'B6',
    captureExpectedBadge: 'Failed',
    captureExpectedMessage: 'The link opens a file (application/vnd.openxmlformats-officedocument.wordprocessingml.document) rather than a web page. Only web pages and PDFs can be captured.',
    expectedViolations: [
      'Capture Status: Failed',
      'Expected Error Message: "The link opens a file (application/vnd.openxmlformats-officedocument.wordprocessingml.document) rather than a web page. Only web pages and PDFs can be captured."',
    ],
  },
  {
    id: 'TC-FILE-B07-FAIL',
    name: 'Linked File B7: Oversized PDF (>10 MB Payload)',
    vertical: 'Linked Files & Downloads',
    subpath: 'files/llm-4188/disclosure-large.pdf',
    expectedOutcome: 'FAIL',
    variantId: 'high_risk_udaap',
    regulatoryFramework: 'File Size Limit Guardrail (10 MB)',
    description: 'Valid PDF file exceeding 10 MB limit (10.8 MB). Fails capture immediately with size guardrail message.',
    fileExercise: 'B7',
    captureExpectedBadge: 'Failed',
    captureExpectedMessage: 'The linked file is too large to capture.',
    expectedViolations: [
      'Capture Status: Failed',
      'Expected Error Message: "The linked file is too large to capture."',
    ],
  },
  {
    id: 'TC-FILE-B08-FAIL',
    name: 'Linked File B8: Corrupt PDF (%PDF- Header with Garbage Body)',
    vertical: 'Linked Files & Downloads',
    subpath: 'files/llm-4188/corrupt.pdf',
    expectedOutcome: 'FAIL',
    variantId: 'high_risk_udaap',
    regulatoryFramework: 'Corrupt PDF Parsing Guardrail',
    description: 'File starts with %PDF-1.7 but remainder is unparseable garbage. Fails capture gracefully.',
    fileExercise: 'B8',
    captureExpectedBadge: 'Failed',
    captureExpectedMessage: 'The linked PDF couldn\'t be read.',
    expectedViolations: [
      'Capture Status: Failed',
      'Expected Error Message: "The linked PDF couldn\'t be read."',
    ],
  },
  {
    id: 'TC-FILE-B09-FAIL',
    name: 'Linked File B9: Blank HTML (Flat Background, No Text)',
    vertical: 'Linked Files & Downloads',
    subpath: 'files/llm-4188/blank.html',
    expectedOutcome: 'FAIL',
    variantId: 'high_risk_udaap',
    regulatoryFramework: 'Empty Page Capture Guardrail',
    description: 'HTML page with flat dark background (#222) and no text elements. Fails capture with clear message.',
    fileExercise: 'B9',
    captureExpectedBadge: 'Failed',
    captureExpectedMessage: 'The page loaded, but nothing readable was on it.',
    expectedViolations: [
      'Capture Status: Failed',
      'Expected Error Message: "The page loaded, but nothing readable was on it."',
    ],
  },
  {
    id: 'TC-FILE-B10-PASS',
    name: 'Linked File B10: Image-Only HTML Page',
    vertical: 'Linked Files & Downloads',
    subpath: 'files/llm-4188/image-only.html',
    expectedOutcome: 'PASS',
    variantId: 'compliant',
    regulatoryFramework: 'Vision Model Image Content Review',
    description: 'HTML page containing only an <img> of an advert with rates in the artwork, no HTML text. Must stay Captured and quote rates from vision description.',
    fileExercise: 'B10',
    captureExpectedBadge: 'Captured',
    captureExpectedMessage: 'Page captured successfully; vision model reads image text and rates.',
    expectedViolations: [
      'Vision Model extraction: Must quote rates from image artwork ($499/mo, 0.99% intro rate).',
    ],
  },
  {
    id: 'TC-FILE-B11-PASS',
    name: 'Linked File B11: Direct Link to Ad Image (.png)',
    vertical: 'Linked Files & Downloads',
    subpath: 'files/llm-4188/ad-image.png',
    expectedOutcome: 'PASS',
    variantId: 'compliant',
    regulatoryFramework: 'Direct Image Navigation Capture',
    description: 'Direct URL to PNG image. Chromium renders image as page; captured and described by vision model.',
    fileExercise: 'B11',
    captureExpectedBadge: 'Captured',
    captureExpectedMessage: 'Image loaded in Chromium viewer; described by vision model.',
    expectedViolations: [
      'Vision Model extraction: Must describe the marketing artwork and verify promotional terms.',
    ],
  },
  {
    id: 'TC-FILE-B12-PASS',
    name: 'Linked File B12: HTML Page with Embedded PDF (iframe)',
    vertical: 'Linked Files & Downloads',
    subpath: 'files/llm-4188/embedded-pdf.html',
    expectedOutcome: 'PASS',
    variantId: 'compliant',
    regulatoryFramework: 'Iframe PDF Isolation',
    description: 'HTML page with text containing an iframe loading disclosure-text.pdf. The HTML page is captured, not the PDF.',
    fileExercise: 'B12',
    captureExpectedBadge: 'Captured',
    captureExpectedMessage: 'HTML parent page captured. PDF in iframe does not replace page.',
    expectedViolations: [
      'Review must evaluate parent HTML page text rather than replacing with the PDF.',
    ],
  },
  {
    id: 'TC-FILE-B13-PASS',
    name: 'Linked File B13: JavaScript Redirect to PDF',
    vertical: 'Linked Files & Downloads',
    subpath: 'files/llm-4188/go-to-pdf.html',
    expectedOutcome: 'PASS',
    variantId: 'teaser_trap',
    regulatoryFramework: 'Client-Side Navigation & Redirect Chain',
    description: 'HTML page that performs location.replace("disclosure-text.pdf"). Chromium follows redirect to PDF.',
    fileExercise: 'B13',
    captureExpectedBadge: 'Captured',
    captureExpectedMessage: 'Redirect followed to disclosure-text.pdf. Redirect chain recorded and PDF reviewed.',
    expectedViolations: [
      'Redirect chain ending at disclosure-text.pdf captured.',
      'Contradiction: Advert promises zero fees while redirected PDF lists $3,450 origination charge.',
    ],
  },
  {
    id: 'TC-FILE-B14-FAIL',
    name: 'Linked File B14: Meta Refresh Redirect to PDF',
    vertical: 'Linked Files & Downloads',
    subpath: 'files/llm-4188/meta-to-pdf.html',
    expectedOutcome: 'FAIL',
    variantId: 'high_risk_udaap',
    regulatoryFramework: 'Meta Refresh Known Limit',
    description: 'HTML page with <meta http-equiv="refresh" content="0;url=disclosure-text.pdf">. Known limit: stops before refresh fires.',
    fileExercise: 'B14',
    captureExpectedBadge: 'Failed',
    captureExpectedMessage: 'The page loaded, but nothing readable was on it.',
    expectedViolations: [
      'Capture Status: Failed',
      'Expected Error Message: "The page loaded, but nothing readable was on it."',
      'Demonstrates fix: previously was silently Captured and empty; now properly marked Failed.',
    ],
  },
  {
    id: 'TC-FILE-B15-PASS',
    name: 'Linked File B15: HTML Disclosures Portal with Multiple Document URLs',
    vertical: 'Linked Files & Downloads',
    subpath: 'files/llm-4188/multi-link.html',
    expectedOutcome: 'PASS',
    variantId: 'compliant',
    regulatoryFramework: 'Multi-URL Anchor Link Ingestion & Navigation',
    description: 'HTML regulatory portal containing multiple distinct document links (PDF, Word, PNG image, external CFPB URL). Tests parsing and following multiple resource links.',
    fileExercise: 'B15',
    captureExpectedBadge: 'Captured',
    captureExpectedMessage: 'HTML page loaded; multiple target document links (PDFs, docx, image, external) extracted.',
    expectedViolations: [
      'Multi-URL Discovery: Discovers 5 distinct resource links (PDF disclosure, Word terms, advert image, 10MB PDF, CFPB site).',
    ],
  },
  {
    id: 'TC-FILE-B16-PASS',
    name: 'Linked File B16: HTML Document with Multiple Embedded iFrames',
    vertical: 'Linked Files & Downloads',
    subpath: 'files/llm-4188/multi-iframe.html',
    expectedOutcome: 'PASS',
    variantId: 'compliant',
    regulatoryFramework: 'Multi-Frame Document Isolation & Inspection',
    description: 'HTML document with side-by-side embedded iframes for disclosure-text.pdf and image-only.html. Exercises multi-frame inspection.',
    fileExercise: 'B16',
    captureExpectedBadge: 'Captured',
    captureExpectedMessage: 'HTML multi-frame portal captured; iframe sources identified and extracted.',
    expectedViolations: [
      'Multi-Frame Extraction: Identifies embedded PDF frame and embedded advert image frame.',
    ],
  },
  {
    id: 'TC-FILE-B17-PASS',
    name: 'Linked File B17: PDF Document with Multiple Embedded URI Hyperlinks',
    vertical: 'Linked Files & Downloads',
    subpath: 'files/llm-4188/multi-link.pdf',
    expectedOutcome: 'PASS',
    variantId: 'compliant',
    regulatoryFramework: 'PDF Interactive Hyperlink Annotation Extraction',
    description: 'Multi-page PDF containing embedded PDF hyperlink annotations (/URI actions) pointing to CFPB, FDIC, NMLS, and supplementary disclosures.',
    fileExercise: 'B17',
    captureExpectedBadge: 'Captured',
    captureExpectedMessage: 'PDF text and 5 embedded URI hyperlink annotations extracted.',
    expectedViolations: [
      'PDF Link Annotation Extraction: Resolves interactive URI links (CFPB Reg Z, FDIC, NMLS, PDF attachments).',
    ],
  },
  {
    id: 'TC-FILE-MULTI-01-MIXED',
    name: 'Multi-URL Review: Mixed Passing & Failing Linked Files (LLM-4188)',
    vertical: 'Linked Files & Downloads',
    subpath: 'files/llm-4188/multi-link.html',
    expectedOutcome: 'PASS',
    variantId: 'compliant',
    regulatoryFramework: 'Multi-URL Concurrent Ingestion & Partial Failure Resilience',
    description: 'Ad containing multiple attached URLs (passing rate PDF + passing landing page + failing blank PDF + failing binary + failing docx). Verifies review runs with mixed results and reports failing files as unverifiable.',
    fileExercise: 'MULTI',
    captureExpectedBadge: 'Captured',
    captureExpectedMessage: 'Passing files captured (PDF text & HTML); failing files reported as unverifiable.',
    expectedViolations: [
      'Multi-URL Ingestion: 2 URLs Captured (disclosure-text.pdf, mortgages landing page)',
      'Multi-URL Failure Guardrails: 3 URLs Failed (blank.pdf, not-a-pdf.bin, terms.docx)',
      'AI Review Resilience: Review proceeds normally using captured valid evidence without crashing.',
    ],
  },
];

/**
 * Builds the test suite with generated QR codes for each test case.
 */
export const buildTestSuiteWithQrs = async (baseUrl: string): Promise<TestCaseWithQr[]> => {
  const safeBase =
    baseUrl && !baseUrl.includes('localhost') && !baseUrl.includes('127.0.0.1')
      ? baseUrl
      : 'https://owensheehan.github.io/NCT/';
  const sanitizedBase = safeBase.endsWith('/') ? safeBase : `${safeBase}/`;

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
    'Expected Capture Badge',
    'Capture Message / Note',
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
    `"${t.captureExpectedBadge ?? (t.expectedOutcome === 'PASS' ? 'Captured' : 'Failed')}"`,
    `"${(t.captureExpectedMessage ?? '').replace(/"/g, '""')}"`,
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
