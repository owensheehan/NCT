import QRCode from 'qrcode';
import type { TestCaseDefinition, AdvertDocumentData } from '../types/testSuite.ts';
import { STANDARD_TEST_CASES } from './testSuiteGenerator.ts';

interface DiscrepancyTemplate {
  headlineOptions: string[];
  rateClaims: string[];
  aprClaim: string | null;
  benefits: string[];
  discrepancies: string[];
  finePrint: string;
}

const DISCREPANCY_TEMPLATES: Record<string, DiscrepancyTemplate> = {
  'TC-MTG-02-FAIL': {
    headlineOptions: [
      'Refinance for Just $1,450/Month — Zero Application Fees!',
      'Buy Your Next Home for $1,600/Month Guaranteed!',
      'Special 4.25% Refi Rate — Lowest Payment of the Year!',
    ],
    rateClaims: ['4.250% Fixed Rate', '4.450% Promo Note Rate'],
    aprClaim: null, // Omitted APR in advert
    benefits: [
      'Zero upfront processing or application fees',
      'Lock your payment for 30 years',
      'Fast closing in 14 days',
    ],
    discrepancies: [
      'Advert promises "4.25% Fixed Rate with no APR", whereas landing page discloses 6.45% - 7.85% APR in buried footer.',
      'Advert promises "$1,450/mo monthly payment" without stating the required loan amount or down payment basis.',
      'Advert claims "Zero Lender Processing Fees" without stating mandatory third-party title and appraisal closing costs.',
    ],
    finePrint: 'Apex Horizon Bank. Equal Housing Lender. Payments based on prime underwriting. Rates subject to change.',
  },

  'TC-MTG-03-FAIL': {
    headlineOptions: [
      '100% Guaranteed Approval Mortgages — Zero Down, Zero Credit Checks!',
      'Everyone is Approved! 1.99% Home Loans Up to $1.5 Million!',
      'No Credit Score? No Problem! Instant Mortgage Approval Guaranteed!',
    ],
    rateClaims: ['1.990% Unconditional Fixed Rate', '1.750% Guaranteed Rate'],
    aprClaim: null, // Complete omission of APR
    benefits: [
      '100% Guaranteed approval for every applicant',
      'Zero down payment required on any property',
      'We pay 100% of your closing costs out of our own pocket',
    ],
    discrepancies: [
      'Advert claims "1.99% Fixed Rate with 100% Guaranteed Approval", directly violating CFPB UDAAP and QM credit underwriting rules.',
      'Advert promises "Zero Down Payment & Free Closing", while landing page finances capitalized closing fees into the principal.',
      'Advert completely omits the mandatory Annual Percentage Rate (APR) and Equal Housing Opportunity certification.',
    ],
    finePrint: 'Apex Horizon Bank. No disclosures necessary. Valid for all applicants nationwide.',
  },

  'TC-MTG-04-FAIL': {
    headlineOptions: [
      'Slash Your Mortgage to 0.99% for Your Entire First Year!',
      'Pay Only $499/Month on Any Dream Home with 0.99% Intro Rate!',
      'The 0.99% Miracle Mortgage — Cut Your Payment by 70%!',
    ],
    rateClaims: ['0.990% Intro Rate', '0.850% Flash Promo Rate'],
    aprClaim: null,
    benefits: [
      'Pay under 1% interest on your primary residence',
      'Start at only $499 per month',
      'Keep your cash flow flexible',
    ],
    discrepancies: [
      'Advert highlights "0.99% Mortgage Rate" in giant font, while landing page contract automatically resets to 10.45% variable APR in month 7.',
      'Advert fails to disclose a mandatory 5% ($20,000+) early payoff prepayment penalty.',
      'Negative amortization occurs because the $499 monthly payment does not cover accrued interest.',
    ],
    finePrint: 'Apex Horizon Bank N.A. Terms apply. Rate valid for initial promotional cycles.',
  },

  'TC-CRD-02-FAIL': {
    headlineOptions: [
      'Guaranteed $15,000 Credit Limit Approved in 10 Seconds!',
      'Free Money Mastercard: Guaranteed $15,000 Limit, Zero Interest!',
      'No Credit Check Needed: Instant $15,000 Spending Power!',
    ],
    rateClaims: ['0% Interest for Life*', 'Zero APR Forever*'],
    aprClaim: null,
    benefits: [
      'Guaranteed $15,000 line of credit with no income check',
      '0% interest on all purchases and balance transfers',
      '10% unlimited cash back rewards on everything',
    ],
    discrepancies: [
      'Advert claims "0% Interest for Life" and "Guaranteed $15,000 Limit", directly violating CARD Act 12 CFR § 1026.51.',
      'Advert conceals retroactive 32.99% deferred interest on the entire original balance if $1 is unpaid by day 365.',
      'Advert completely omits the mandatory tabular Schumer Box disclosure.',
    ],
    finePrint: 'Apex Horizon Bank. *Subject to account agreement terms.',
  },

  'TC-SAV-02-FAIL': {
    headlineOptions: [
      '8.50% Guaranteed APY — 100% Risk-Free Federal Reserve Backed Cash!',
      'Earn 8.50% Interest Backed Directly by the US Government!',
      'Unlimited $100 Million FDIC Guarantee with 8.50% APY!',
    ],
    rateClaims: ['8.50% APY Guaranteed', '8.75% Sovereign Yield'],
    aprClaim: '8.50% APY',
    benefits: [
      '8.50% annual yield guaranteed by the US Government',
      'Unlimited FDIC insurance coverage up to $100,000,000',
      'Zero fees and instant 24/7 liquidity',
    ],
    discrepancies: [
      'Advert falsely claims "8.50% APY is Guaranteed by the Federal Reserve", violating TISA Reg DD.',
      'Advert claims "Unlimited FDIC insurance up to $100M", violating statutory $250,000 per depositor limits under 12 U.S.C. 1828(a)(4).',
      'Advert promises "Zero Fees", while the account agreement levies an undisclosed $75/month maintenance charge.',
    ],
    finePrint: 'Apex Horizon Bank. Backed by sovereign federal reserves. No penalties apply.',
  },

  'TC-SAV-03-FAIL': {
    headlineOptions: [
      'Earn an Unstoppable 9.00% APY on All Savings Deposits!',
      'Flash 9.00% High Yield Savings — Industry Leading Returns!',
      'Supercharge Your Cash Reserve with 9.00% APY Today!',
    ],
    rateClaims: ['9.00% APY*', '9.15% APY*'],
    aprClaim: '9.00% APY',
    benefits: [
      'Record-breaking 9.00% yield on your daily cash',
      'Daily compounding with monthly interest payouts',
      'FDIC insured peace of mind',
    ],
    discrepancies: [
      'Advert prominently features "9.00% APY", while small print reveals it expires after only 30 days and plunges to 0.05% APY.',
      'Advert conceals a predatory $250 account closure penalty if funds are withdrawn within 180 days.',
      'Violation of 12 CFR § 1030.8(c)(2) for omitting introductory rate duration in primary promotional text.',
    ],
    finePrint: 'Apex Horizon Bank Member FDIC. *Introductory yield conditions apply.',
  },

  'TC-WLTH-02-FAIL': {
    headlineOptions: [
      'Guaranteed 20.00% Annual Profit — 100% Risk-Free Quantum Alpha!',
      'Never Lose Money Again: 20% Annual Return Backed by Bank Reserves!',
      'Beat Wall Street Every Single Year: Guaranteed 20% Net Return!',
    ],
    rateClaims: ['+20.00% Guaranteed Annual Profit', '+22.50% Annual Alpha'],
    aprClaim: null,
    benefits: [
      'Guaranteed 20% net annual return under all market conditions',
      '100% Principal Protection Guarantee — Impossible to lose money',
      'FDIC insured investment portfolio security',
    ],
    discrepancies: [
      'Advert promises "Guaranteed 20% Profit and Zero Downside", violating FINRA Rule 2210(d)(1)(D).',
      'Advert fraudulently asserts that securities investments are "FDIC Insured like a bank deposit".',
      'Advert omits the mandatory "Not FDIC Insured • May Lose Value • No Bank Guarantee" disclosure.',
    ],
    finePrint: 'Apex Wealth Fund guarantees positive returns across all macroeconomic cycles.',
  },

  'TC-BIZ-02-FAIL': {
    headlineOptions: [
      'Instant $500,000 Business Cash — 9% Flat Rate, No Personal Guarantees!',
      'Get Funded in 45 Minutes: 9% Low Cost Commercial Financing!',
      'Emergency Working Capital: 9% Flat Fee, 100% Approval for Every Business!',
    ],
    rateClaims: ['9.00% Flat Fee*', '8.95% Simple Rate*'],
    aprClaim: null,
    benefits: [
      'Funded in 45 minutes with zero financial statement requirements',
      'No personal guarantee or personal collateral needed ever',
      '9% flat rate — cheaper than any bank loan in the nation',
    ],
    discrepancies: [
      'Advert quotes a "9% Flat Fee" for a 9-month merchant advance, disguising an effective annualized APR of 88.50%.',
      'Advert advertises "No Personal Guarantee Ever", while the financing agreement contains a hidden confession of judgment and blanket lien on personal real estate.',
      'Violation of California SB 1235 and NY Commercial Finance Disclosure laws.',
    ],
    finePrint: 'Apex Commercial Finance. Private commercial transactions. No statutory disclosures required.',
  },

  'TC-DISC-02-FAIL': {
    headlineOptions: [
      'Sovereign Bank Charter: Unrestricted Financing Without Government Red Tape!',
      'Apex Horizon Sovereign Banking — Private Commercial Exemption Notice',
    ],
    rateClaims: ['Exempt from CFPB & FDIC Rules'],
    aprClaim: null,
    benefits: [
      'Operating under private sovereign banking charter',
      'Exempt from standard federal disclosure and filing mandates',
      'Streamlined execution with zero regulatory delay',
    ],
    discrepancies: [
      'Advert falsely claims the institution is "Exempt from CFPB, TILA, and FDIC oversight".',
      'Advert fails to provide mandatory Community Reinvestment Act (CRA) public notices or account fee schedules.',
    ],
    finePrint: 'Private institution. Account terms and fees determined solely by bank officers.',
  },
};

/**
 * Generates an Advert Document data object for a given test case.
 * In PASS cases: perfectly aligned with landing page.
 * In FAIL cases: introduces randomized marketing disparities between advert and landing page.
 */
export const generateAdvertDocument = async (
  tc: TestCaseDefinition,
  baseUrl: string,
  randomSeed: number = Date.now()
): Promise<AdvertDocumentData> => {
  const sanitizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const landingPageUrl = `${sanitizedBase}${tc.subpath}`;

  const qrDataUrl = await QRCode.toDataURL(landingPageUrl, {
    width: 260,
    margin: 2,
    color: {
      dark: '#0f172a',
      light: '#ffffff',
    },
  });

  const now = new Date(randomSeed);
  const publishedDate = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const advertToken = `AD-${tc.id.substring(3, 10)}-${Math.floor(1000 + Math.random() * 9000)}`;

  if (tc.expectedOutcome === 'PASS') {
    // PASSING CASE: Advert is 100% compliant and aligns with the landing page
    let advertisedRate = '6.125% Note Rate';
    let advertisedApr: string | null = '6.240% APR';
    let headline = 'Transparent Home Financing Built for Your Future';
    let subheadline = 'Explore competitive mortgage financing with clear upfront APR disclosures and representative loan terms.';
    let bulletPoints = [
      '30-Year Fixed Conforming Note Rate: 6.125% (6.240% APR)',
      'Based on $400,000 purchase price with 20% down payment',
      '360 predictable monthly payments of $1,944.94 (principal & interest)',
      'Closing costs itemized in official Loan Estimate within 3 business days',
    ];
    let legalFinePrint = 'Apex Horizon Bank N.A. Member FDIC. Equal Housing Lender. NMLS #491022. All loans subject to credit and property approval.';

    if (tc.vertical === 'Credit Cards') {
      advertisedRate = '0% Intro APR for 15 Billing Cycles';
      advertisedApr = '18.24% – 28.99% Variable Post-Promo';
      headline = 'Apex Horizon Cash Reserve Card';
      subheadline = 'Unlimited 3% cash back with full CARD Act Schumer Box fee transparency.';
      bulletPoints = [
        '0% Intro APR on purchases and balance transfers for 15 cycles',
        'Transparent 3% balance transfer fee ($5 minimum)',
        'Standard variable APR of 18.24% – 28.99% based on creditworthiness',
        'Penalty APR: Up to 29.99% variable if late',
      ];
      legalFinePrint = 'Cards issued by Apex Horizon Bank pursuant to CARD Act guidelines. Late fee up to $41.';
    } else if (tc.vertical === 'Savings & Deposits') {
      advertisedRate = '5.15% APY';
      advertisedApr = '5.15% Annual Percentage Yield';
      headline = 'Maximize Your Liquid Reserves with 5.15% APY';
      subheadline = 'Earn 10x national average with daily compounding and statutory FDIC protection.';
      bulletPoints = [
        '5.15% Annual Percentage Yield (APY) accurate as of publication',
        'Minimum balance to earn advertised APY: $500.00',
        'FDIC insured up to $250,000 per depositor per ownership category',
        'Fees could reduce earnings on the account',
      ];
      legalFinePrint = 'Apex Horizon Bank N.A. Member FDIC. Rates variable and may change after account opening.';
    } else if (tc.vertical === 'Wealth Advisory') {
      advertisedRate = 'Target Distribution: 5.50% Net Yield';
      advertisedApr = null;
      headline = 'Fiduciary Wealth Advisory & Institutional Portfolios';
      subheadline = 'Disciplined asset allocation crafted for high-net-worth families with complete risk disclosure.';
      bulletPoints = [
        'SEC-Registered Investment Adviser fiduciary standard of care',
        'Target distribution yield: 5.50% net of underlying fund fees',
        'INVESTMENTS ARE NOT FDIC INSURED • NO BANK GUARANTEE • MAY LOSE VALUE',
        'Past performance is no guarantee of future results',
      ];
      legalFinePrint = 'Apex Private Wealth LLC (SEC RIA). Brokerage services through Apex Securities Inc., Member FINRA/SIPC.';
    } else if (tc.vertical === 'Commercial Credit') {
      advertisedRate = '8.49% – 14.25% APR';
      advertisedApr = '8.49% to 14.25% Annual Percentage Rate';
      headline = 'Fuel Your Business Growth with Transparent Commercial Capital';
      subheadline = 'Commercial financing compliant with CA SB 1235 and NY Commercial Finance Disclosure standards.';
      bulletPoints = [
        'Standardized annualized APR disclosed prior to contract consummation',
        'No prepayment penalties: save on unaccrued interest at any time',
        'Personal guarantee required for business owners holding >=20% equity',
        'Decisions within 48 to 72 business hours',
      ];
      legalFinePrint = 'Commercial facilities subject to credit approval. Apex Horizon Bank Equal Opportunity Lender.';
    }

    return {
      testId: tc.id,
      testName: tc.name,
      vertical: tc.vertical,
      campaignTitle: `Official Marketing Document — ${tc.vertical}`,
      headline,
      subheadline,
      featuredOffer: tc.name,
      advertisedRate,
      advertisedApr,
      landingPageUrl,
      qrDataUrl,
      expectedOutcome: 'PASS',
      alignmentStatus: 'ALIGNED_WITH_LANDING_PAGE',
      discrepancies: [],
      bulletPoints,
      legalFinePrint,
      advertToken,
      publishedDate,
    };
  }

  // FAILING CASE: The advert introduces deliberate marketing discrepancies and strays from the landing page
  const template = DISCREPANCY_TEMPLATES[tc.id] || {
    headlineOptions: [`Exclusive Limited-Time Promotion: ${tc.name}`],
    rateClaims: ['1.99% Guaranteed Promotional Rate*'],
    aprClaim: null,
    benefits: [
      'Unmatched terms available this week only',
      'Fast approval with minimal documentation',
      'Exclusive member benefits',
    ],
    discrepancies: [
      'Advertised terms conflict with regulatory disclosures on destination landing page.',
      'Required trigger terms and statutory disclosures omitted from promotional advert.',
    ],
    finePrint: 'Apex Horizon Bank. Promotional terms apply. See landing page for complete rules.',
  };

  const randomHeadlineIndex = Math.floor(Math.random() * template.headlineOptions.length);
  const randomRateIndex = Math.floor(Math.random() * template.rateClaims.length);

  return {
    testId: tc.id,
    testName: tc.name,
    vertical: tc.vertical,
    campaignTitle: `Promotional Circular — ${tc.vertical}`,
    headline: template.headlineOptions[randomHeadlineIndex],
    subheadline: 'Special distribution insert delivered to prospective commercial and retail banking customers.',
    featuredOffer: tc.name,
    advertisedRate: template.rateClaims[randomRateIndex],
    advertisedApr: template.aprClaim,
    landingPageUrl,
    qrDataUrl,
    expectedOutcome: 'FAIL',
    alignmentStatus: 'CONFLICTING_RATES_OR_TERMS',
    discrepancies: template.discrepancies,
    bulletPoints: template.benefits,
    legalFinePrint: template.finePrint,
    advertToken,
    publishedDate,
  };
};

/**
 * Retrieves a test case definition by its ID.
 */
export const getTestCaseById = (id: string): TestCaseDefinition | undefined => {
  return STANDARD_TEST_CASES.find((tc: TestCaseDefinition): boolean => tc.id === id);
};

/**
 * Builds all advert documents for the entire standard test suite.
 */
export const buildAllAdvertDocuments = async (
  baseUrl: string
): Promise<AdvertDocumentData[]> => {
  const docs: AdvertDocumentData[] = [];
  for (const tc of STANDARD_TEST_CASES) {
    const doc = await generateAdvertDocument(tc, baseUrl);
    docs.push(doc);
  }
  return docs;
};

/**
 * Prints a single advert document in a dedicated print window.
 */
export const printSingleAdvertHtml = (advert: AdvertDocumentData): void => {
  printAdvertBookletHtml([advert], advert.landingPageUrl);
};

/**
 * Opens a dedicated printable/PDF window containing all advert documents with clean page breaks.
 */
export const printAdvertBookletHtml = (
  adverts: AdvertDocumentData[],
  baseUrl: string
): void => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Nucomply Compliance AI — Advert Documents Testing Booklet</title>
  <style>
    @page {
      size: letter portrait;
      margin: 15mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #f1f5f9;
      margin: 0;
      padding: 20px;
    }
    .no-print {
      max-width: 800px;
      margin: 0 auto 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .print-btn {
      background: #0f172a;
      color: #fff;
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      font-weight: 700;
      cursor: pointer;
    }
    .advert-doc-page {
      width: 100%;
      max-width: 800px;
      min-height: 980px;
      margin: 0 auto 30px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      padding: 40px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      page-break-after: always;
      position: relative;
    }
    @media print {
      body { background: #fff; padding: 0; }
      .no-print { display: none; }
      .advert-doc-page {
        border: none;
        box-shadow: none;
        margin: 0;
        padding: 0;
        min-height: 100vh;
      }
    }
    .ad-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .brand-title {
      font-size: 20px;
      font-weight: 900;
      letter-spacing: 0.05em;
      color: #0f172a;
    }
    .brand-sub {
      font-size: 10px;
      color: #059669;
      font-weight: 700;
      letter-spacing: 0.12em;
    }
    .ad-badge {
      font-size: 11px;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 4px;
      font-family: monospace;
    }
    .badge-pass { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
    .badge-fail { background: #ffe4e6; color: #9f1239; border: 1px solid #fda4af; }
    .ad-audit-banner {
      background: #f8fafc;
      border-left: 4px solid #0284c7;
      padding: 10px 14px;
      margin-bottom: 24px;
      border-radius: 0 6px 6px 0;
      font-size: 12px;
    }
    .banner-fail { border-left-color: #e11d48; background: #fff1f2; }
    .ad-hero {
      text-align: center;
      margin-bottom: 28px;
    }
    .ad-headline {
      font-size: 26px;
      font-weight: 900;
      color: #0f172a;
      margin: 0 0 10px;
      line-height: 1.2;
    }
    .ad-subheadline {
      font-size: 14px;
      color: #475569;
      max-width: 600px;
      margin: 0 auto;
    }
    .ad-rate-banner {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #fff;
      border-radius: 10px;
      padding: 24px;
      text-align: center;
      margin-bottom: 28px;
    }
    .rate-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #94a3b8;
    }
    .rate-num {
      font-size: 42px;
      font-weight: 900;
      font-family: monospace;
      color: #34d399;
      margin: 6px 0;
    }
    .rate-apr {
      font-size: 14px;
      color: #cbd5e1;
    }
    .ad-body-grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 24px;
      align-items: center;
      margin-bottom: 28px;
    }
    .benefits-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .benefits-list li {
      font-size: 13px;
      color: #334155;
      margin-bottom: 10px;
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }
    .benefits-list li::before {
      content: '✓';
      color: #059669;
      font-weight: 900;
    }
    .qr-callout-card {
      border: 2px dashed #94a3b8;
      border-radius: 10px;
      padding: 16px;
      text-align: center;
      background: #f8fafc;
    }
    .qr-img {
      width: 140px;
      height: 140px;
      margin: 0 auto 8px;
      display: block;
      border-radius: 6px;
    }
    .qr-cta {
      font-size: 11px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 4px;
      text-transform: uppercase;
    }
    .qr-url-sub {
      font-family: monospace;
      font-size: 9px;
      color: #64748b;
      word-break: break-all;
    }
    .discrepancy-card {
      background: #fff1f2;
      border: 1px solid #fecdd3;
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 24px;
      font-size: 12px;
    }
    .discrepancy-title {
      font-weight: 800;
      color: #9f1239;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .discrepancy-list {
      margin: 0;
      padding-left: 18px;
      color: #881337;
    }
    .discrepancy-list li {
      margin-bottom: 4px;
    }
    .ad-footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 14px;
      font-size: 10px;
      color: #64748b;
      line-height: 1.4;
    }
  </style>
</head>
<body>
  <div class="no-print">
    <div>
      <h2 style="margin: 0 0 4px;">Nucomply Compliance Test Adverts Booklet</h2>
      <p style="margin: 0; font-size: 13px; color: #475569;">
        ${adverts.length} standalone marketing advert documents with embedded QR codes linking to test landing pages (${baseUrl}).
      </p>
    </div>
    <button class="print-btn" onclick="window.print()">🖨️ Print All Adverts / Save as PDF</button>
  </div>

  ${adverts
    .map(
      (ad): string => `
    <article class="advert-doc-page" id="${ad.testId}">
      <div>
        <header class="ad-header">
          <div>
            <div class="brand-title">APEX HORIZON BANK & TRUST</div>
            <div class="brand-sub">MEMBER FDIC • EQUAL HOUSING LENDER</div>
          </div>
          <div style="text-align: right;">
            <span class="ad-badge ${ad.expectedOutcome === 'PASS' ? 'badge-pass' : 'badge-fail'}">
              EXPECTED TEST RESULT: ${ad.expectedOutcome}
            </span>
            <div style="font-family: monospace; font-size: 10px; color: #64748b; margin-top: 4px;">
              ${ad.testId} • ${ad.advertToken}
            </div>
          </div>
        </header>

        <div class="ad-audit-banner ${ad.expectedOutcome === 'FAIL' ? 'banner-fail' : ''}">
          <strong>COMPLIANCE TEST SPECIFICATION:</strong>
          <span>${ad.testName} (${ad.vertical}) — Alignment: <strong>${ad.alignmentStatus.replace(/_/g, ' ')}</strong></span>
        </div>

        <section class="ad-hero">
          <h1 class="ad-headline">${ad.headline}</h1>
          <p class="ad-subheadline">${ad.subheadline}</p>
        </section>

        <section class="ad-rate-banner">
          <div class="rate-label">Featured Promotional Rate</div>
          <div class="rate-num">${ad.advertisedRate}</div>
          <div class="rate-apr">${ad.advertisedApr || 'Annual Percentage Rate (APR) omitted in promotional print.'}</div>
        </section>

        <section class="ad-body-grid">
          <div>
            <h4 style="margin: 0 0 12px; font-size: 14px; text-transform: uppercase; color: #0f172a;">
              Promotional Highlights:
            </h4>
            <ul class="benefits-list">
              ${ad.bulletPoints.map((b): string => `<li>${b}</li>`).join('')}
            </ul>
          </div>

          <div class="qr-callout-card">
            <div class="qr-cta">Scan to Apply Online</div>
            <img src="${ad.qrDataUrl}" alt="QR code to ${ad.landingPageUrl}" class="qr-img">
            <div class="qr-url-sub">${ad.landingPageUrl}</div>
          </div>
        </section>

        ${
          ad.discrepancies.length > 0
            ? `
          <div class="discrepancy-card">
            <div class="discrepancy-title">⚠️ Ground-Truth Cross-Check Disparities (Expected to Fail):</div>
            <ul class="discrepancy-list">
              ${ad.discrepancies.map((d): string => `<li>${d}</li>`).join('')}
            </ul>
          </div>
        `
            : `
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px; margin-bottom: 24px; font-size: 12px; color: #15803d;">
            <strong>✓ Full Disclosure Alignment:</strong> Advert promises, rates, and disclaimers align completely with the destination landing page.
          </div>
        `
        }
      </div>

      <footer class="ad-footer">
        <p><strong>Legal Notices:</strong> ${ad.legalFinePrint}</p>
        <p style="margin-top: 6px; font-family: monospace;">Distribution Date: ${ad.publishedDate} • Apex Horizon Bancorp N.A. • Marketing Document Code: ${ad.advertToken}</p>
      </footer>
    </article>
  `
    )
    .join('')}
</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
};
