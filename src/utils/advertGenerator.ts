import QRCode from 'qrcode';
import type {
  TestCaseDefinition,
  AdvertDocumentData,
  ProductTierAdvert,
} from '../types/testSuite.ts';
import { STANDARD_TEST_CASES } from './testSuiteGenerator.ts';

/**
 * Retrieves a test case definition by its ID.
 */
export const getTestCaseById = (id: string): TestCaseDefinition | undefined => {
  return STANDARD_TEST_CASES.find((tc: TestCaseDefinition): boolean => tc.id === id);
};

/**
 * Helper to generate random number within a range.
 */
const randomBetween = (min: number, max: number, decimals: number = 2): string => {
  const rand = Math.random() * (max - min) + min;
  return rand.toFixed(decimals);
};

/**
 * Generates a complete marketing advertisement document data object for a given test case.
 * In PASS cases: perfectly aligned summary of the linked webpage with full statutory disclosures.
 * In FAIL cases: realistic advertisement that deliberately strays from the linked webpage (wrong APRs,
 * omitted trigger terms, deceptive guarantees, contradictory payments) with randomized values.
 */
export const generateAdvertDocument = async (
  tc: TestCaseDefinition,
  baseUrl: string,
  randomSeed: number = Date.now()
): Promise<AdvertDocumentData> => {
  const sanitizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const landingPageUrl = `${sanitizedBase}${tc.subpath}`;

  // Generate scannable QR code
  const qrDataUrl = await QRCode.toDataURL(landingPageUrl, {
    width: 320,
    margin: 2,
    color: {
      dark: '#0a0f1d',
      light: '#ffffff',
    },
  });

  const now = new Date(randomSeed);
  const publishedDate = now.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const advertToken = `AD-${tc.id.replace('TC-', '')}-${Math.floor(1000 + Math.random() * 9000)}`;

  // =========================================================================
  // 1. MORTGAGES VERTICAL
  // =========================================================================
  if (tc.vertical === 'Mortgages') {
    if (tc.expectedOutcome === 'PASS') {
      // COMPLIANT: Full disclosure, accurate APRs, trigger terms, Equal Housing logo
      const productTiers: ProductTierAdvert[] = [
        {
          name: '30-Year Fixed Conforming',
          rate: '6.125% Note Rate',
          apr: '6.240% APR',
          termOrLimit: '360 Months • Max $766,550',
          monthlyPaymentOrFee: '$607.61 per $100k borrowed',
          keyFeature: '0 Points • 60-Day Complimentary Rate Lock',
        },
        {
          name: '15-Year Fixed Conforming',
          rate: '5.625% Note Rate',
          apr: '5.760% APR',
          termOrLimit: '180 Months • Max $766,550',
          monthlyPaymentOrFee: '$823.75 per $100k borrowed',
          keyFeature: 'Accelerated Equity • Lower Lifetime Finance Charge',
        },
        {
          name: '5/1 Conforming ARM',
          rate: '5.875% Initial Rate',
          apr: '6.850% Variable APR',
          termOrLimit: '60 Mo Fixed • Adj. Annually',
          monthlyPaymentOrFee: '$591.85 initial per $100k',
          keyFeature: '2/1/5 Rate Caps • Indexed to 30-Day SOFR',
        },
        {
          name: 'Jumbo 30-Year Fixed',
          rate: '6.450% Note Rate',
          apr: '6.580% APR',
          termOrLimit: '360 Months • Up to $3,000,000',
          monthlyPaymentOrFee: '$628.70 per $100k borrowed',
          keyFeature: 'Custom Underwriting for Luxury Residences',
        },
      ];

      return {
        testId: tc.id,
        testName: tc.name,
        vertical: tc.vertical,
        campaignTitle: 'Spring 2026 Residential Home Financing Campaign',
        eyebrowTag: 'SPECIAL LENDER PROMOTION • NATIONWIDE CONFORMING RATES',
        headline: 'Transparent Home Financing Built for Your Financial Future',
        subheadline:
          'Whether you are purchasing your dream home or refinancing an existing property, Apex Horizon Bank delivers predictable payments, competitive conforming rates, and zero hidden broker markups.',
        featuredBadge: 'TILA REG Z CERTIFIED COMPLIANT',
        featuredOffer: '30-Year Conforming Fixed Home Loan',
        advertisedRate: '6.125% Note Rate',
        advertisedApr: '6.240% Annual Percentage Rate (APR)',
        secondaryMetric: '$1,944.94 Monthly Payment (P&I on $320,000 loan balance)',
        landingPageUrl,
        qrDataUrl,
        expectedOutcome: 'PASS',
        alignmentStatus: 'ALIGNED_WITH_LANDING_PAGE',
        discrepancies: [],
        groundTruthDiscrepancies: [],
        bulletPoints: [
          'Guaranteed 60-Day Rate Lock: Protect your rate against market volatility at zero upfront cost.',
          'Upfront Loan Estimate: Complete itemization of lender, escrow, and title charges within 3 business days.',
          'Seamless Digital Pre-Approval: Instant conditional pre-approval letter delivered in under 15 minutes online.',
          'Dedicated Mortgage Advisor: Personal direct guidance from application through closing day.',
        ],
        productTiers,
        representativeExample:
          'Representative Example: Based on a $400,000 purchase price with 20% ($80,000) down payment, a 30-year fixed loan amount of $320,000 at a note rate of 6.125% (6.240% APR) requires 360 monthly payments of $1,944.94. Total finance charges of $384,178.40. Closing costs estimated at $4,200. Payments do not include homeowners insurance, property taxes, or HOA dues; actual obligation will be greater.',
        qrCalloutText:
          'Scan with your smartphone camera to access our digital loan portal, calculate personalized monthly payments, and secure your 60-day rate lock.',
        legalFinePrint:
          'Apex Horizon Bank N.A. Member FDIC. Equal Housing Lender. NMLS Unique Identifier #491022. All loans subject to credit and collateral approval under CFPB Ability-to-Repay standards. Rates and terms accurate as of publication and subject to market movement without notice.',
        advertToken,
        publishedDate,
        nmlsId: '491022',
        equalHousingLender: true,
        memberFdic: true,
      };
    }

    // FAILING MORTGAGE SCENARIOS: Deliberately stray from webpage with wrong details
    if (tc.id === 'TC-MTG-02-FAIL') {
      // Omission of APR & Contradictory Payment
      const randomRate = randomBetween(4.15, 4.45);
      const randomPayment = randomBetween(1380, 1490, 0);

      const productTiers: ProductTierAdvert[] = [
        {
          name: '30-Year Refinance Special',
          rate: `${randomRate}% Fixed Rate`,
          apr: null, // OMITTED APR
          termOrLimit: '30-Year Term',
          monthlyPaymentOrFee: `Only $${randomPayment}/mo`,
          keyFeature: 'Zero Lender Fees Guaranteed',
        },
        {
          name: '15-Year Home Purchase',
          rate: '3.990% Promo Rate',
          apr: null,
          termOrLimit: '15-Year Term',
          monthlyPaymentOrFee: '$1,250/mo',
          keyFeature: 'Fast 14-Day Priority Closing',
        },
        {
          name: 'Adjustable Rate Option',
          rate: '2.850% First Year',
          apr: null,
          termOrLimit: 'Special ARM',
          monthlyPaymentOrFee: '$999/mo',
          keyFeature: 'Lowest Initial Out-of-Pocket Payment',
        },
      ];

      return {
        testId: tc.id,
        testName: tc.name,
        vertical: tc.vertical,
        campaignTitle: 'Refinance Savings Circular — Regional Homeowner Edition',
        eyebrowTag: 'FLASH REFINANCE SAVINGS • UNBEATABLE RATES',
        headline: `Refinance for Just $${randomPayment}/Month — ${randomRate}% Fixed Rate!`,
        subheadline:
          'Cut your monthly mortgage bill in half! Lock in our exclusive below-market promotional rate and eliminate lender closing fees completely.',
        featuredBadge: 'LOWEST PAYMENT GUARANTEE',
        featuredOffer: '30-Year Refinance Promo Loan',
        advertisedRate: `${randomRate}% Note Rate`,
        advertisedApr: null, // Complete omission of APR in primary advert
        secondaryMetric: `Pay Just $${randomPayment}/Month Locked for 30 Years`,
        landingPageUrl,
        qrDataUrl,
        expectedOutcome: 'FAIL',
        alignmentStatus: 'CONFLICTING_RATES_OR_TERMS',
        discrepancies: [
          `Advert displays "${randomRate}% Fixed Rate" with completely omitted APR, directly violating TILA 12 CFR § 1026.24(d).`,
          `Advert claims "$${randomPayment}/month payment" without disclosing loan amount, down payment, or repayment basis.`,
          `Advert claims "Zero Closing Fees", while landing page assesses $4,850 in third-party origination and escrow fees.`,
        ],
        groundTruthDiscrepancies: [
          {
            category: 'Annual Percentage Rate (APR) Omission',
            advertClaim: `Featured Rate: ${randomRate}% Fixed Note Rate (APR completely omitted)`,
            landingPageTruth: 'Actual Landing Page Rate: 6.125% Note Rate with 6.240% – 6.850% APR in buried footnote',
            regulatoryStandard: 'TILA / 12 CFR § 1026.24(d)(2) — APR must be stated with equal prominence to note rate',
          },
          {
            category: 'Contradictory Monthly Repayment Claim',
            advertClaim: `Monthly Payment: $${randomPayment}/month for 30 years`,
            landingPageTruth: 'True Payment: $1,944.94/mo on standard $320,000 conforming loan (a $500+/mo discrepancy)',
            regulatoryStandard: 'TILA / 12 CFR § 1026.24(d)(1) Trigger Terms — Required terms of repayment must be stated',
          },
        ],
        bulletPoints: [
          `Guaranteed monthly payment of only $${randomPayment}/mo on prime residential properties.`,
          'Zero lender processing fees or application charges.',
          'Skip up to two monthly mortgage payments after closing.',
          'Streamlined paperwork with closing in 14 business days.',
        ],
        productTiers,
        representativeExample: `Payments based on prime residential refinancing. Payment of $${randomPayment} does not include taxes or insurance. Rates subject to change.`,
        qrCalloutText:
          'Scan with your smartphone camera to lock in this promotional payment rate before government funding limits expire.',
        legalFinePrint:
          'Apex Horizon Bank. Equal Housing Lender. Payments based on prime credit. Rates subject to change without notice.',
        advertToken,
        publishedDate,
        nmlsId: '491022',
        equalHousingLender: true,
        memberFdic: true,
      };
    }

    if (tc.id === 'TC-MTG-03-FAIL') {
      // UDAAP Deceptive Approval & Zero Down
      const randomRate = randomBetween(1.75, 1.99);
      const productTiers: ProductTierAdvert[] = [
        {
          name: '100% Approval Home Purchase',
          rate: `${randomRate}% Fixed Rate`,
          apr: null,
          termOrLimit: 'Up to $1,500,000 Loan',
          monthlyPaymentOrFee: 'Zero Down Payment Needed',
          keyFeature: '100% Approval Guaranteed for Everyone',
        },
        {
          name: 'Zero-Credit Fresh Start Mortgage',
          rate: `${randomRate}% Fixed Rate`,
          apr: null,
          termOrLimit: 'No Limit',
          monthlyPaymentOrFee: 'Free Closing Costs Included',
          keyFeature: 'No Credit Score or Income Checks',
        },
      ];

      return {
        testId: tc.id,
        testName: tc.name,
        vertical: tc.vertical,
        campaignTitle: '100% Guaranteed Approval Universal Mortgage Direct Mailer',
        eyebrowTag: 'NO CREDIT CHECK • NO INCOME CHECKS • EVERYONE APPROVED',
        headline: `100% Guaranteed Mortgage Approval — ${randomRate}% Fixed Rate with Zero Down!`,
        subheadline:
          'Turned down by traditional banks? Apex Horizon guarantees 100% approval on every mortgage application with zero down payment and zero closing fees!',
        featuredBadge: '100% GUARANTEED APPROVAL',
        featuredOffer: 'Universal Prime Mortgage Program',
        advertisedRate: `${randomRate}% Fixed Rate`,
        advertisedApr: null,
        secondaryMetric: 'Zero Down Payment • Zero Lender Closing Costs',
        landingPageUrl,
        qrDataUrl,
        expectedOutcome: 'FAIL',
        alignmentStatus: 'DECEPTIVE_ADVERT_CLAIMS',
        discrepancies: [
          `Advert promises "100% Guaranteed Approval with Zero Down", in blatant violation of CFPB UDAAP and Dodd-Frank QM Ability-to-Repay rules.`,
          `Advert quotes fictitious ${randomRate}% rate while landing page imposes 8.25% - 11.50% high-risk subprime rates.`,
          `Advert completely omits the required Annual Percentage Rate (APR) and Equal Housing Opportunity logo.`,
        ],
        groundTruthDiscrepancies: [
          {
            category: 'Deceptive Guarantee of Credit Approval',
            advertClaim: '100% Guaranteed Mortgage Approval for Every Applicant with No Credit Verification',
            landingPageTruth: 'Landing Page: Full underwriting, minimum 680 FICO score, and 43% DTI verification required',
            regulatoryStandard: 'CFPB UDAAP / 12 U.S.C. § 5536 & 12 CFR § 1026.43 Ability-to-Repay Mandate',
          },
          {
            category: 'Fictitious Rate & Hidden Capitalized Costs',
            advertClaim: `Unconditional ${randomRate}% Fixed Rate with "Free Closing Costs Paid By Bank"`,
            landingPageTruth: 'Landing Page: 7.450% APR with $9,500 in closing costs rolled into total loan balance',
            regulatoryStandard: 'TILA / 12 CFR § 1026.24(d) & FTC Act Section 5 Deceptive Advertising',
          },
        ],
        bulletPoints: [
          'Guaranteed approval for every single applicant nationwide — bad credit or past bankruptcy welcome.',
          'Zero down payment required on primary residences, vacation homes, and luxury estates.',
          'Apex Horizon Bank pays 100% of your closing costs directly out of our own pocket.',
          'No tax returns, W-2 forms, or proof of income required.',
        ],
        productTiers,
        representativeExample:
          'Universal mortgage program valid nationwide. All applicants unconditionally approved without credit check.',
        qrCalloutText:
          'Scan with your smartphone camera to claim your guaranteed mortgage certificate and instant approval letter.',
        legalFinePrint:
          'Apex Horizon Bank. No federal disclosures needed. Terms valid for all retail consumers nationwide.',
        advertToken,
        publishedDate,
        nmlsId: '491022',
        equalHousingLender: false, // Omitted Equal Housing
        memberFdic: true,
      };
    }

    if (tc.id === 'TC-MTG-04-FAIL') {
      // Teaser Rate Trap
      const productTiers: ProductTierAdvert[] = [
        {
          name: 'The 0.99% Miracle Mortgage',
          rate: '0.990% Intro Rate',
          apr: null,
          termOrLimit: 'First 12 Months',
          monthlyPaymentOrFee: 'Only $499/Month',
          keyFeature: 'Cut Your Monthly Payment by 70%',
        },
        {
          name: 'Standard Option',
          rate: '1.490% Intro Rate',
          apr: null,
          termOrLimit: 'First 24 Months',
          monthlyPaymentOrFee: 'Only $699/Month',
          keyFeature: 'Low Introductory Cash Flow',
        },
      ];

      return {
        testId: tc.id,
        testName: tc.name,
        vertical: tc.vertical,
        campaignTitle: '0.99% Miracle Mortgage Flash Promotion',
        eyebrowTag: 'FLASH PROMOTION • PAY ONLY $499/MONTH',
        headline: 'Slash Your Mortgage to 0.99% for Your Entire First Year!',
        subheadline:
          'Why pay 6% or 7% when you can pay under 1%? Own your dream home with unbelievable $499 monthly payments on our exclusive introductory financing plan.',
        featuredBadge: '0.99% TEASER SPECIAL',
        featuredOffer: '0.99% Flash Intro Mortgage',
        advertisedRate: '0.990% Promotional Rate',
        advertisedApr: null,
        secondaryMetric: 'Pay Just $499/Month on Any Home Loan up to $600,000',
        landingPageUrl,
        qrDataUrl,
        expectedOutcome: 'FAIL',
        alignmentStatus: 'DECEPTIVE_ADVERT_CLAIMS',
        discrepancies: [
          'Advert promotes "0.99% Note Rate" without disclosing that the loan resets to 10.45% variable APR in month 7.',
          'Advert conceals a mandatory 5% ($25,000+) early payoff prepayment penalty.',
          'Monthly payment of $499 results in negative amortization, increasing the principal balance each month.',
        ],
        groundTruthDiscrepancies: [
          {
            category: 'Misleading Discount / Teaser Rate Advertising',
            advertClaim: 'Prominently features "0.99% Mortgage Rate for Entire First Year"',
            landingPageTruth: 'Landing Page: Resets after 6 months to SOFR + 5.25% (10.45% variable APR)',
            regulatoryStandard: 'TILA 12 CFR § 1026.24(f)(2) Discounted and Premium Variable-Rate Transactions',
          },
          {
            category: 'Concealed Prepayment Penalty & Negative Amortization',
            advertClaim: 'Promotes "Total Flexibility — Refinance or Pay Off Anytime"',
            landingPageTruth: 'Landing Page Contract: 5% prepayment penalty on any principal curtailment within 5 years',
            regulatoryStandard: 'Dodd-Frank Act / 12 CFR § 1026.43(g) Prepayment Penalty Restrictions',
          },
        ],
        bulletPoints: [
          'Start at only $499/month on home loans up to $600,000.',
          'Keep your cash flow open for home remodeling and renovations.',
          'Fixed 0.99% rate during the critical initial move-in period.',
          'Quick 10-day digital loan closing.',
        ],
        productTiers,
        representativeExample:
          'Payment of $499 based on initial introductory rate tier. Terms apply. Subject to lender promotional rules.',
        qrCalloutText:
          'Scan with your smartphone camera to lock in your 0.99% introductory interest rate before the promo closes.',
        legalFinePrint:
          'Apex Horizon Bancorp N.A. Terms and promotional conditions apply. Rates subject to reset per account note.',
        advertToken,
        publishedDate,
        nmlsId: '491022',
        equalHousingLender: true,
        memberFdic: true,
      };
    }
  }

  // =========================================================================
  // 2. CREDIT CARDS VERTICAL
  // =========================================================================
  if (tc.vertical === 'Credit Cards') {
    if (tc.expectedOutcome === 'PASS') {
      const productTiers: ProductTierAdvert[] = [
        {
          name: 'Apex Cash Reserve Mastercard',
          rate: '0% Intro APR for 15 Cycles',
          apr: '18.24% – 28.99% Variable Post-Promo',
          termOrLimit: 'Up to $25,000 Limit',
          monthlyPaymentOrFee: '$0 Annual Fee • 3% BT Fee',
          keyFeature: 'Unlimited 3% Cash Back on Dining & Grocery',
        },
        {
          name: 'Apex Horizon Premier Rewards',
          rate: '0% Intro APR for 12 Cycles',
          apr: '21.24% – 29.99% Variable Post-Promo',
          termOrLimit: 'Up to $50,000 Limit',
          monthlyPaymentOrFee: '$95 Annual Fee',
          keyFeature: '50,000 Welcome Miles after $3k spend',
        },
        {
          name: 'Apex Platinum Business Card',
          rate: '0% Intro APR for 9 Cycles',
          apr: '16.49% – 24.99% Variable Post-Promo',
          termOrLimit: 'Up to $100,000 Limit',
          monthlyPaymentOrFee: '$0 Annual Fee',
          keyFeature: 'Itemized Business Expense Categorization',
        },
      ];

      return {
        testId: tc.id,
        testName: tc.name,
        vertical: tc.vertical,
        campaignTitle: 'Apex Horizon Cash Reserve Mastercard Cardholder Invitation',
        eyebrowTag: 'EXCLUSIVE CARDMEMBER INVITATION • 0% INTRODUCTORY APR',
        headline: 'Earn Unlimited 3% Cash Back with Zero Annual Fee & 0% Intro APR',
        subheadline:
          'Experience purchasing power with complete CARD Act transparency. Enjoy 0% intro APR on purchases and balance transfers for 15 billing cycles, followed by a competitive variable APR.',
        featuredBadge: 'CARD ACT SCHUMER BOX DISCLOSED',
        featuredOffer: 'Apex Horizon Cash Reserve Mastercard',
        advertisedRate: '0% Intro APR for 15 Billing Cycles',
        advertisedApr: '18.24% to 28.99% Variable Standard APR',
        secondaryMetric: '$0 Annual Fee • 3% Balance Transfer Fee ($5 min)',
        landingPageUrl,
        qrDataUrl,
        expectedOutcome: 'PASS',
        alignmentStatus: 'ALIGNED_WITH_LANDING_PAGE',
        discrepancies: [],
        groundTruthDiscrepancies: [],
        bulletPoints: [
          '15 Consecutive Billing Cycles of 0% Intro APR on all purchases and eligible balance transfers.',
          'Unlimited 3% Cash Back on grocery stores, dining, and gas; 1.5% unlimited on all other purchases.',
          '$200 Cash Bonus after spending $1,000 in your first 90 days from account opening.',
          'Full CARD Act Tabular Schumer Box fee transparency: Zero foreign transaction fees, no surprise charges.',
        ],
        productTiers,
        representativeExample:
          'CARD Act Schumer Box Summary: Purchase APR: 0% intro for 15 cycles, then 18.24%–28.99% variable based on creditworthiness. Balance Transfer APR: 0% intro for 15 cycles, then 18.24%–28.99% variable; fee is 3% of amount ($5 min). Penalty APR: Up to 29.99% variable if 60 days late. Late Fee: Up to $41. Minimum Interest: $1.50.',
        qrCalloutText:
          'Scan with your smartphone camera to review the complete tabular Schumer Box disclosures and submit your 2-minute card application.',
        legalFinePrint:
          'Cards issued by Apex Horizon Bank pursuant to license by Mastercard International. Terms subject to the Credit CARD Act of 2009. Minimum credit score and income verification required.',
        advertToken,
        publishedDate,
        nmlsId: '491022',
        equalHousingLender: false,
        memberFdic: true,
      };
    }

    // FAILING CREDIT CARD SCENARIO (TC-CRD-02-FAIL)
    const productTiers: ProductTierAdvert[] = [
      {
        name: 'Free Money Gold Card',
        rate: '0% Interest for Life*',
        apr: null,
        termOrLimit: 'Guaranteed $15,000 Limit',
        monthlyPaymentOrFee: 'Zero Fees Forever',
        keyFeature: 'Guaranteed Approval for Everyone',
      },
      {
        name: 'Instant Cash Diamond Card',
        rate: '0% APR on Everything',
        apr: null,
        termOrLimit: 'Guaranteed $25,000 Limit',
        monthlyPaymentOrFee: 'No Annual Fees',
        keyFeature: 'Instant Approval in 10 Seconds',
      },
    ];

    return {
      testId: tc.id,
      testName: tc.name,
      vertical: tc.vertical,
      campaignTitle: 'Free Money Mastercard Universal Mailer',
      eyebrowTag: 'NO CREDIT CHECK • GUARANTEED $15,000 SPENDING POWER',
      headline: 'Guaranteed $15,000 Credit Limit Approved in 10 Seconds — 0% Interest!',
      subheadline:
        'Everyone qualifies! Receive an unconditional $15,000 line of credit with 0% interest on every purchase, zero credit score checks, and instant digital card activation.',
      featuredBadge: 'GUARANTEED $15,000 LINE OF CREDIT',
      featuredOffer: 'Apex Horizon Free Money Mastercard',
      advertisedRate: '0% Interest for Life*',
      advertisedApr: null,
      secondaryMetric: 'Guaranteed $15,000 Credit Line • 10% Cash Back on Everything',
      landingPageUrl,
      qrDataUrl,
      expectedOutcome: 'FAIL',
      alignmentStatus: 'DECEPTIVE_ADVERT_CLAIMS',
      discrepancies: [
        'Advert claims "0% Interest for Life" and "Guaranteed $15,000 Limit", directly violating CARD Act 12 CFR § 1026.51 ability-to-pay rules.',
        'Advert conceals retroactive 32.99% deferred interest on the entire original balance if $1 is unpaid by day 365.',
        'Advert completely omits the mandatory tabular Schumer Box required by 12 CFR § 1026.60.',
      ],
      groundTruthDiscrepancies: [
        {
          category: 'Omission of Mandatory Tabular Schumer Box',
          advertClaim: 'Promotes promotional financing without tabular APR and fee disclosures',
          landingPageTruth: 'Landing Page: Mandatory Schumer Box omitted entirely in variant',
          regulatoryStandard: 'Credit CARD Act / 12 CFR § 1026.60 Format and Content Requirements',
        },
        {
          category: 'Deceptive Deferred Interest Trap',
          advertClaim: 'Advert claims "0% Interest on All Purchases Forever"',
          landingPageTruth: 'Landing Page Contract: 32.99% variable interest assessed retroactively to Day 1 if unpaid',
          regulatoryStandard: 'CFPB UDAAP & CARD Act / 12 CFR § 1026.16 Rules for Deferred Interest',
        },
      ],
      bulletPoints: [
        'Guaranteed $15,000 credit limit with zero income documentation or credit checks.',
        '0% interest on all purchases, balance transfers, and cash advances.',
        '10% unlimited cash back rewards deposited directly to your bank account each month.',
        'Zero annual fees, zero late fees, and zero balance transfer fees ever.',
      ],
      productTiers,
      representativeExample:
        'No fees or disclosures necessary. Card valid nationwide for all applicants regardless of financial history.',
      qrCalloutText:
        'Scan with your smartphone camera to activate your guaranteed $15,000 credit card in 10 seconds.',
      legalFinePrint: 'Apex Horizon Bank. *Subject to account agreement terms and conditions.',
      advertToken,
      publishedDate,
      nmlsId: '491022',
      equalHousingLender: false,
      memberFdic: true,
    };
  }

  // =========================================================================
  // 3. SAVINGS & DEPOSITS VERTICAL
  // =========================================================================
  if (tc.vertical === 'Savings & Deposits') {
    if (tc.expectedOutcome === 'PASS') {
      const productTiers: ProductTierAdvert[] = [
        {
          name: 'Apex High-Yield Savings',
          rate: '5.15% APY',
          apr: '5.15% Annual Percentage Yield',
          termOrLimit: '$500 Minimum to Earn APY',
          monthlyPaymentOrFee: '$0 Monthly Maintenance Fee',
          keyFeature: 'Daily Compounding • Free Automated Transfers',
        },
        {
          name: 'Apex 14-Month Certificate of Deposit',
          rate: '5.35% APY',
          apr: '5.35% Annual Percentage Yield',
          termOrLimit: '14 Months • $1,000 Min Deposit',
          monthlyPaymentOrFee: 'Guaranteed Fixed Yield',
          keyFeature: 'Early Withdrawal Penalty: 90 Days Simple Interest',
        },
        {
          name: 'Apex Premier Treasury-Linked Cash',
          rate: '5.05% APY',
          apr: '5.05% Annual Percentage Yield',
          termOrLimit: '$10,000 Min Balance',
          monthlyPaymentOrFee: '$0 Account Service Fee',
          keyFeature: 'Direct Short-Duration Treasury Security Backing',
        },
      ];

      return {
        testId: tc.id,
        testName: tc.name,
        vertical: tc.vertical,
        campaignTitle: 'Apex High-Yield Deposit Growth Circular',
        eyebrowTag: 'MAXIMIZE CASH RESERVES • 10X NATIONAL AVERAGE YIELD',
        headline: 'Earn 5.15% APY with Daily Compounding & Full FDIC Insurance',
        subheadline:
          'Put your liquid cash to work. Apex Horizon High-Yield Savings delivers 10x the national average savings yield with zero monthly account maintenance fees and standard FDIC protection.',
        featuredBadge: 'TISA REG DD CERTIFIED APY',
        featuredOffer: 'Apex High-Yield Savings Account',
        advertisedRate: '5.15% Annual Percentage Yield (APY)',
        advertisedApr: '5.15% APY (5.03% Simple Interest Rate)',
        secondaryMetric: '10x National Average • FDIC Insured up to $250,000 per Depositor',
        landingPageUrl,
        qrDataUrl,
        expectedOutcome: 'PASS',
        alignmentStatus: 'ALIGNED_WITH_LANDING_PAGE',
        discrepancies: [],
        groundTruthDiscrepancies: [],
        bulletPoints: [
          'Earn 5.15% APY on all deposit balances of $500 or more, calculated and compounded daily.',
          'FDIC Insured up to the statutory maximum of $250,000 per depositor, per ownership category.',
          'Zero monthly account maintenance fees and zero minimum balance penalty charges.',
          '24/7 liquid accessibility with unlimited internal transfers and free incoming wires.',
        ],
        productTiers,
        representativeExample:
          'Representative Example: A deposit of $25,000 at 5.15% APY with daily compounding earns approximately $1,287.50 in net interest over 12 months, assuming no withdrawals or rate modifications. Fees could reduce earnings on the account. Rates are variable and subject to change after account opening.',
        qrCalloutText:
          'Scan with your smartphone camera to open and fund your high-yield savings account in under 3 minutes.',
        legalFinePrint:
          'Apex Horizon Bank N.A. Member FDIC. Annual Percentage Yield (APY) accurate as of publication date. Minimum deposit of $500 required to earn stated APY. Statutory FDIC insurance up to $250,000.',
        advertToken,
        publishedDate,
        nmlsId: '491022',
        equalHousingLender: false,
        memberFdic: true,
      };
    }

    if (tc.id === 'TC-SAV-02-FAIL') {
      // Fictitious 8.5% Federal Reserve Guarantee & Infinite FDIC
      const productTiers: ProductTierAdvert[] = [
        {
          name: 'Federal Sovereign Cash Reserve',
          rate: '8.50% APY Guaranteed',
          apr: '8.50% Sovereign Yield',
          termOrLimit: 'No Minimum Deposit',
          monthlyPaymentOrFee: 'Zero Risk of Loss',
          keyFeature: 'Backed Directly by Federal Reserve Board',
        },
        {
          name: 'Billionaire FDIC Treasury Vault',
          rate: '8.75% APY Guaranteed',
          apr: '8.75% Sovereign Yield',
          termOrLimit: 'Up to $100 Million',
          monthlyPaymentOrFee: '100% Tax Free Option',
          keyFeature: 'Unlimited FDIC Insurance Coverage',
        },
      ];

      return {
        testId: tc.id,
        testName: tc.name,
        vertical: tc.vertical,
        campaignTitle: 'Federal Reserve Sovereign Yield Deposit Insert',
        eyebrowTag: '100% US GOVERNMENT BACKED • UNLIMITED FDIC INSURANCE',
        headline: '8.50% Guaranteed APY — 100% Risk-Free Federal Reserve Backed Cash!',
        subheadline:
          'Enjoy an unprecedented 8.50% annual yield guaranteed directly by the Federal Reserve and US Treasury with unlimited $100,000,000 FDIC coverage on all personal cash deposits.',
        featuredBadge: '8.50% GOVT GUARANTEE',
        featuredOffer: 'Apex Sovereign Federal Deposit Account',
        advertisedRate: '8.50% APY Guaranteed by Federal Reserve',
        advertisedApr: '8.50% APY',
        secondaryMetric: 'Unlimited FDIC Insurance up to $100 Million per Account',
        landingPageUrl,
        qrDataUrl,
        expectedOutcome: 'FAIL',
        alignmentStatus: 'DECEPTIVE_ADVERT_CLAIMS',
        discrepancies: [
          'Advert falsely claims "8.50% APY is Guaranteed by the Federal Reserve", violating TISA Reg DD 12 CFR § 1030.8.',
          'Advert claims "Unlimited FDIC insurance up to $100M", directly violating statutory $250,000 limits under 12 U.S.C. 1828(a)(4).',
          'Advert promises "Zero Fees", while account agreement imposes an undisclosed $75/month maintenance charge.',
        ],
        groundTruthDiscrepancies: [
          {
            category: 'False Representation of FDIC Insurance Limit',
            advertClaim: 'Unlimited FDIC insurance protection up to $100,000,000 per depositor',
            landingPageTruth: 'Actual Statutory Limit: $250,000 per depositor, per insured bank',
            regulatoryStandard: 'FDIC Official Signs and Advertising Rules / 12 CFR Part 328 & 12 U.S.C. 1828(a)(4)',
          },
          {
            category: 'Fictitious Government Guarantee',
            advertClaim: '8.50% APY guaranteed by the US Federal Reserve Board and US Treasury',
            landingPageTruth: 'Landing Page: Market deposit rates are not sovereign guaranteed; actual rate is variable',
            regulatoryStandard: 'Truth in Savings Act / 12 CFR § 1030.8(a) Misleading Advertisements',
          },
        ],
        bulletPoints: [
          'Guaranteed 8.50% yield backed directly by the full faith and credit of the US Government.',
          'Special sovereign bank charter grants $100 Million FDIC deposit protection.',
          'Zero volatility, zero stock market risk, and zero drawdown risk.',
          'Instant withdrawal with zero penalties or account fees.',
        ],
        productTiers,
        representativeExample:
          'Deposits guaranteed by Federal Reserve. Instant yield distribution with zero risk.',
        qrCalloutText:
          'Scan with your smartphone camera to lock in your 8.50% government-guaranteed yield certificate.',
        legalFinePrint:
          'Apex Horizon Bank. Backed by sovereign federal reserves. Unlimited FDIC insurance applies.',
        advertToken,
        publishedDate,
        nmlsId: '491022',
        equalHousingLender: false,
        memberFdic: true,
      };
    }

    if (tc.id === 'TC-SAV-03-FAIL') {
      // 9% Flash Teaser Trap
      const productTiers: ProductTierAdvert[] = [
        {
          name: '9.00% High Yield Supercharger',
          rate: '9.00% APY*',
          apr: '9.00% APY',
          termOrLimit: 'No Minimum',
          monthlyPaymentOrFee: '$0 Fees',
          keyFeature: 'Highest Yield in United States History',
        },
      ];

      return {
        testId: tc.id,
        testName: tc.name,
        vertical: tc.vertical,
        campaignTitle: '9% Flash High Yield Savings Circular',
        eyebrowTag: 'FLASH PROMOTION • 9.00% APY SPECIAL',
        headline: 'Earn an Unstoppable 9.00% APY on All Savings Deposits!',
        subheadline:
          'Supercharge your personal cash reserve with a staggering 9.00% APY. Open your account today and watch your interest compound faster than ever before.',
        featuredBadge: 'RECORD-BREAKING 9.00% APY',
        featuredOffer: 'Apex 9.00% Flash Deposit Account',
        advertisedRate: '9.00% APY*',
        advertisedApr: '9.00% Annual Percentage Yield',
        secondaryMetric: 'Earn 20x the National Average Savings Yield',
        landingPageUrl,
        qrDataUrl,
        expectedOutcome: 'FAIL',
        alignmentStatus: 'CONFLICTING_RATES_OR_TERMS',
        discrepancies: [
          'Advert prominently features "9.00% APY", while small print reveals it expires after 30 days and drops to 0.05% APY.',
          'Advert conceals a predatory $250 account closure penalty if funds are transferred out within 180 days.',
          'Violation of 12 CFR § 1030.8(c)(2) for omitting introductory rate duration in primary marketing text.',
        ],
        groundTruthDiscrepancies: [
          {
            category: 'Promotional Teaser Duration Concealment',
            advertClaim: 'Prominently features "9.00% APY on All Savings Deposits" without duration qualifier',
            landingPageTruth: 'Landing Page: 9.00% APY valid for 30 days only; automatically drops to 0.05% APY on Day 31',
            regulatoryStandard: 'TISA / 12 CFR § 1030.8(c)(2) Time Period Stated for Introductory Rates',
          },
          {
            category: 'Predatory Exit Penalty Concealment',
            advertClaim: 'Advert promises "Complete liquidity with zero restrictions on withdrawals"',
            landingPageTruth: 'Landing Page Contract: Levies $250 fee if closed or transferred within 180 days',
            regulatoryStandard: 'CFPB UDAAP Deceptive Fee Concealment / 12 U.S.C. § 5536',
          },
        ],
        bulletPoints: [
          'Record-breaking 9.00% APY on daily balances.',
          'Daily compounding with monthly interest payouts.',
          'FDIC insured security up to $250,000.',
          'No initial deposit minimums.',
        ],
        productTiers,
        representativeExample:
          'Earn 9.00% APY. Terms and conditions apply. Rates subject to change after account opening.',
        qrCalloutText:
          'Scan with your smartphone camera to activate your 9.00% high-yield deposit account before rates close.',
        legalFinePrint:
          'Apex Horizon Bank Member FDIC. *Introductory yield conditions apply. See account agreement.',
        advertToken,
        publishedDate,
        nmlsId: '491022',
        equalHousingLender: false,
        memberFdic: true,
      };
    }
  }

  // =========================================================================
  // 4. WEALTH ADVISORY VERTICAL
  // =========================================================================
  if (tc.vertical === 'Wealth Advisory') {
    if (tc.expectedOutcome === 'PASS') {
      const productTiers: ProductTierAdvert[] = [
        {
          name: 'Apex Strategic Growth Portfolio',
          rate: 'Target Net Yield: 5.50%',
          apr: null,
          termOrLimit: '$250,000 Min Portfolio',
          monthlyPaymentOrFee: '0.65% Annual Advisory Fee',
          keyFeature: 'SEC-Registered Fiduciary Standard of Care',
        },
        {
          name: 'Tax-Advantaged Municipal Strategy',
          rate: '3.85% Tax-Free Yield',
          apr: null,
          termOrLimit: '$500,000 Min Portfolio',
          monthlyPaymentOrFee: '0.50% Annual Advisory Fee',
          keyFeature: 'Exempt from Federal & State Income Tax',
        },
        {
          name: 'Private Client Family Office',
          rate: 'Custom Mandate',
          apr: null,
          termOrLimit: '$2,000,000 Min Portfolio',
          monthlyPaymentOrFee: '0.35% Annual Advisory Fee',
          keyFeature: 'Intergenerational Estate & Trust Structuring',
        },
      ];

      return {
        testId: tc.id,
        testName: tc.name,
        vertical: tc.vertical,
        campaignTitle: 'Apex Horizon Private Wealth Advisory Client Circular',
        eyebrowTag: 'FIDUCIARY WEALTH MANAGEMENT • SEC REGISTERED ADVISER',
        headline: 'Disciplined Wealth Advisory Crafted for High-Net-Worth Families',
        subheadline:
          'Navigate complex market cycles with an SEC-registered fiduciary adviser. Apex Private Wealth creates tailored asset allocations with transparent advisory fees and comprehensive risk management.',
        featuredBadge: 'FINRA 2210 & SEC COMPLIANT',
        featuredOffer: 'Apex Strategic Growth Mandate',
        advertisedRate: 'Target Portfolio Yield: 5.50% Net of Fees',
        advertisedApr: null,
        secondaryMetric: '0.65% Transparent Advisory Fee • Zero Broker Commissions',
        landingPageUrl,
        qrDataUrl,
        expectedOutcome: 'PASS',
        alignmentStatus: 'ALIGNED_WITH_LANDING_PAGE',
        discrepancies: [],
        groundTruthDiscrepancies: [],
        bulletPoints: [
          'SEC-Registered Investment Adviser fiduciary duty: We act solely in your best financial interest.',
          'Custom asset allocation across institutional equity, fixed income, and private real estate.',
          'Quarterly rebalancing and tax-loss harvesting to optimize net after-tax returns.',
          'NOT FDIC INSURED • MAY LOSE VALUE • NO BANK GUARANTEE fully disclosed on all client communications.',
        ],
        productTiers,
        representativeExample:
          'Investment Disclosure: Investments in securities are NOT FDIC INSURED, NOT BANK GUARANTEED, and MAY LOSE VALUE. Past performance is no guarantee of future results. Target distribution yield of 5.50% is hypothetical based on current asset allocation and is not guaranteed.',
        qrCalloutText:
          'Scan with your smartphone camera to schedule a confidential portfolio consultation with a Senior Wealth Director.',
        legalFinePrint:
          'Apex Private Wealth LLC is an SEC-Registered Investment Adviser. Brokerage services offered through Apex Securities Inc., Member FINRA/SIPC. Investments: Not FDIC Insured • May Lose Value • No Bank Guarantee.',
        advertToken,
        publishedDate,
        nmlsId: '491022',
        equalHousingLender: false,
        memberFdic: false,
      };
    }

    // FAILING WEALTH SCENARIO (TC-WLTH-02-FAIL)
    const productTiers: ProductTierAdvert[] = [
      {
        name: 'Quantum Alpha Guaranteed Fund',
        rate: '+20.00% Guaranteed Annual Net Profit',
        apr: null,
        termOrLimit: '$50,000 Minimum',
        monthlyPaymentOrFee: 'Zero Advisory Fees',
        keyFeature: '100% Principal Protection Guarantee',
      },
      {
        name: 'Sovereign Bank Yield Vault',
        rate: '+25.00% Guaranteed Annual Alpha',
        apr: null,
        termOrLimit: '$100,000 Minimum',
        monthlyPaymentOrFee: 'No Downside Ever',
        keyFeature: 'FDIC Insured Securities Investment',
      },
    ];

    return {
      testId: tc.id,
      testName: tc.name,
      vertical: tc.vertical,
      campaignTitle: 'Guaranteed 20% Alpha Wealth Mailer',
      eyebrowTag: '100% RISK FREE PROFIT • ZERO MARKET DOWNSIDE',
      headline: 'Guaranteed 20.00% Annual Profit — 100% Risk-Free Quantum Alpha!',
      subheadline:
        'Never lose money in the stock market again! Apex Wealth Fund delivers an unconditional 20.00% net annual return backed directly by bank capital reserves with zero risk of capital loss.',
      featuredBadge: 'GUARANTEED 20% RETURN',
      featuredOffer: 'Apex Quantum Alpha Fund',
      advertisedRate: '+20.00% Net Annual Profit Guaranteed',
      advertisedApr: null,
      secondaryMetric: '100% Principal Protected • FDIC Insured Securities Portfolio',
      landingPageUrl,
      qrDataUrl,
      expectedOutcome: 'FAIL',
      alignmentStatus: 'DECEPTIVE_ADVERT_CLAIMS',
      discrepancies: [
        'Advert promises "Guaranteed 20% Net Annual Profit", directly violating FINRA Rule 2210(d)(1)(D).',
        'Advert fraudulently claims investment securities are "FDIC Insured like a bank checking account".',
        'Advert omits the mandatory "Not FDIC Insured • May Lose Value • No Bank Guarantee" warning.',
      ],
      groundTruthDiscrepancies: [
        {
          category: 'Prohibited Prediction / Guarantee of Performance',
          advertClaim: 'Promised "+20.00% Guaranteed Annual Profit Under All Market Conditions"',
          landingPageTruth: 'Landing Page: Securities investments fluctuate; no positive return can legally be guaranteed',
          regulatoryStandard: 'FINRA Rule 2210(d)(1)(D) Statements Regarding Future Investment Performance',
        },
        {
          category: 'Fraudulent FDIC Claim on Securities',
          advertClaim: 'Investment portfolio is "100% FDIC Insured with Principal Protection"',
          landingPageTruth: 'Landing Page: Non-deposit investment products are never covered by FDIC insurance',
          regulatoryStandard: 'Interagency Statement on Retail Sales of Nondeposit Investment Products',
        },
      ],
      bulletPoints: [
        'Guaranteed 20.00% net annual return under all market conditions — bull or bear.',
        '100% Principal Protection Guarantee: Impossible to lose your invested capital.',
        'FDIC insured portfolio backing up to $10,000,000 per investor.',
        'Zero advisory fees or fund expense ratios.',
      ],
      productTiers,
      representativeExample:
        'Guaranteed annual return of 20.00%. All investments backed by sovereign banking reserves.',
      qrCalloutText:
        'Scan with your smartphone camera to lock in your guaranteed 20% annual return allocation.',
      legalFinePrint:
        'Apex Wealth Fund guarantees positive returns across all macroeconomic cycles. Private investment product.',
      advertToken,
      publishedDate,
      nmlsId: '491022',
      equalHousingLender: false,
      memberFdic: false,
    };
  }

  // =========================================================================
  // 5. COMMERCIAL CREDIT VERTICAL
  // =========================================================================
  if (tc.vertical === 'Commercial Credit') {
    if (tc.expectedOutcome === 'PASS') {
      const productTiers: ProductTierAdvert[] = [
        {
          name: 'Commercial Working Capital Line',
          rate: 'Prime + 1.75% (10.25% Variable)',
          apr: '10.45% Annual Percentage Rate',
          termOrLimit: 'Up to $1,500,000 Line',
          monthlyPaymentOrFee: 'Interest-Only Monthly Option',
          keyFeature: 'Draw & Repay as Needed • No Inactivity Fees',
        },
        {
          name: 'Commercial Term Loan',
          rate: '8.49% Fixed Rate',
          apr: '8.75% Annual Percentage Rate',
          termOrLimit: '36 to 84 Month Terms',
          monthlyPaymentOrFee: '$1,620 per $100k borrowed',
          keyFeature: 'Equipment & Expansion Capital • No Balloon',
        },
        {
          name: 'Equipment Lease Facility',
          rate: '7.99% Fixed Rate',
          apr: '8.25% Annual Percentage Rate',
          termOrLimit: 'Up to $750,000',
          monthlyPaymentOrFee: 'Tax-Deductible Lease Payments',
          keyFeature: '100% Financing Including Freight & Setup',
        },
      ];

      return {
        testId: tc.id,
        testName: tc.name,
        vertical: tc.vertical,
        campaignTitle: 'Apex Commercial Financing Solutions Circular',
        eyebrowTag: 'TRANSPARENT BUSINESS FINANCING • CA SB 1235 COMPLIANT',
        headline: 'Fuel Your Business Expansion with Transparent Commercial Capital',
        subheadline:
          'Access flexible working capital, equipment financing, and commercial credit lines with clear standardized APR disclosures compliant with California SB 1235 and New York Commercial Finance Disclosure laws.',
        featuredBadge: 'STATE APR DISCLOSURE COMPLIANT',
        featuredOffer: 'Commercial Working Capital Facility',
        advertisedRate: '8.49% – 12.50% APR Range',
        advertisedApr: 'Standardized Annualized APR Disclosed Prior to Consummation',
        secondaryMetric: 'Lines up to $1,500,000 • Funding within 48 to 72 Business Hours',
        landingPageUrl,
        qrDataUrl,
        expectedOutcome: 'PASS',
        alignmentStatus: 'ALIGNED_WITH_LANDING_PAGE',
        discrepancies: [],
        groundTruthDiscrepancies: [],
        bulletPoints: [
          'Standardized annualized APR disclosed on every financing agreement before contract signing.',
          'No early payoff prepayment penalties: Save on unaccrued finance charges at any time.',
          'Personal guarantees clearly disclosed upfront for business owners holding 20% or greater equity.',
          'Dedicated commercial underwriter assigned to your relationship with decisions in 48 hours.',
        ],
        productTiers,
        representativeExample:
          'Commercial Disclosure: A $100,000 36-month term loan at 8.49% interest rate (8.75% APR) with a 1.0% origination fee ($1,000) requires 36 monthly payments of $3,156.75. Total finance charge is $14,643.00. Total amount repaid is $113,643.00.',
        qrCalloutText:
          'Scan with your smartphone camera to submit your business financial statements and request a customized term sheet.',
        legalFinePrint:
          'Commercial credit facilities subject to credit approval. Apex Horizon Bank Equal Opportunity Lender. Disclosures comply with California Financing Law (SB 1235) and NY Commercial Finance Disclosure Law.',
        advertToken,
        publishedDate,
        nmlsId: '491022',
        equalHousingLender: true,
        memberFdic: true,
      };
    }

    // FAILING COMMERCIAL CREDIT SCENARIO (TC-BIZ-02-FAIL)
    const productTiers: ProductTierAdvert[] = [
      {
        name: 'Flash Working Capital Advance',
        rate: '9.00% Flat Fee*',
        apr: null,
        termOrLimit: 'Up to $500,000 in 45 Mins',
        monthlyPaymentOrFee: 'Small Daily Withholding',
        keyFeature: 'Zero Personal Guarantees Needed',
      },
    ];

    return {
      testId: tc.id,
      testName: tc.name,
      vertical: tc.vertical,
      campaignTitle: 'Fast Business Cash 9% Circular',
      eyebrowTag: 'FUNDED IN 45 MINUTES • NO PERSONAL GUARANTEES',
      headline: 'Instant $500,000 Business Cash — 9% Flat Fee, No Personal Guarantees!',
      subheadline:
        'Don’t wait weeks for a slow bank loan! Get funded in 45 minutes with our exclusive 9% flat rate commercial advance. No tax returns, no personal guarantees, and 100% approval!',
      featuredBadge: '9% FLAT ADVANCE FEE',
      featuredOffer: 'Apex Instant Business Advance',
      advertisedRate: '9.00% Flat Fee*',
      advertisedApr: null,
      secondaryMetric: 'Funded in 45 Minutes • No Personal Collateral Needed Ever',
      landingPageUrl,
      qrDataUrl,
      expectedOutcome: 'FAIL',
      alignmentStatus: 'DECEPTIVE_ADVERT_CLAIMS',
      discrepancies: [
        'Advert quotes a "9% Flat Fee" for a 9-month merchant advance, disguising an effective annualized APR of 88.50%.',
        'Advert advertises "No Personal Guarantee Ever", while contract includes a hidden confession of judgment and blanket lien on personal real estate.',
        'Violates California SB 1235 and NY Commercial Finance Disclosure laws for failing to disclose annualized APR.',
      ],
      groundTruthDiscrepancies: [
        {
          category: 'Deceptive Factor Rate Masked as Low-Interest APR',
          advertClaim: 'Promotes "9% Flat Fee — Cheaper than any bank loan in the nation"',
          landingPageTruth: 'Actual Terms: 9-month daily remittance equates to 88.50% Annualized APR',
          regulatoryStandard: 'California SB 1235 & New York Commercial Finance Disclosure Law / CFPB UDAAP',
        },
        {
          category: 'False Representation of Personal Liability',
          advertClaim: 'Claims "No Personal Guarantee or Personal Collateral Needed Ever"',
          landingPageTruth: 'Landing Page Contract: Includes mandatory personal guaranty and UCC-1 blanket lien on owner residence',
          regulatoryStandard: 'CFPB UDAAP / 12 U.S.C. § 5536 Deceptive Representations of Contract Terms',
        },
      ],
      bulletPoints: [
        'Funded in 45 minutes with zero financial statement requirements or tax returns.',
        'No personal guarantee or personal collateral needed ever.',
        '9% flat rate — significantly lower than credit card processing rates.',
        'Automatic repayment tied to your daily credit card sales.',
      ],
      productTiers,
      representativeExample:
        'Private commercial financing transaction. Fast funding with simple daily remittance factor.',
      qrCalloutText:
        'Scan with your smartphone camera to receive your instant $500,000 commercial funding offer.',
      legalFinePrint:
        'Apex Commercial Finance. Private commercial transactions. No statutory state disclosures required.',
      advertToken,
      publishedDate,
      nmlsId: '491022',
      equalHousingLender: false,
      memberFdic: true,
    };
  }

  // =========================================================================
  // 6. STATUTORY DISCLOSURES VERTICAL
  // =========================================================================
  if (tc.expectedOutcome === 'PASS') {
    const productTiers: ProductTierAdvert[] = [
      {
        name: 'Community Reinvestment Act Public File',
        rate: 'Outstanding CRA Rating',
        apr: null,
        termOrLimit: 'Updated Semi-Annually',
        monthlyPaymentOrFee: 'Public Document',
        keyFeature: 'Branch Demographics & Community Development Lending',
      },
      {
        name: 'Master Retail Fee Schedule',
        rate: 'Complete Transparency',
        apr: null,
        termOrLimit: 'All 42 Fee Codes',
        monthlyPaymentOrFee: 'Zero Hidden Fees',
        keyFeature: 'Overdraft, Wire, & Account Maintenance Schedules',
      },
    ];

    return {
      testId: tc.id,
      testName: tc.name,
      vertical: tc.vertical,
      campaignTitle: 'Apex Horizon Bancorp Statutory & Governance Notice',
      eyebrowTag: 'COMMUNITY REINVESTMENT ACT • PUBLIC STATUTORY ARCHIVE',
      headline: 'Commitment to Community Investment & Fair Lending Governance',
      subheadline:
        'Apex Horizon Bank is proud to maintain an Outstanding rating under the Community Reinvestment Act (CRA). Review our statutory public files, branch assessment areas, and itemized account fee schedules.',
      featuredBadge: 'CRA & STATUTORY COMPLIANT',
      featuredOffer: 'CRA Public Examination File',
      advertisedRate: 'Outstanding CRA Rating',
      advertisedApr: null,
      secondaryMetric: '100% Itemized Fee Schedule Transparency',
      landingPageUrl,
      qrDataUrl,
      expectedOutcome: 'PASS',
      alignmentStatus: 'ALIGNED_WITH_LANDING_PAGE',
      discrepancies: [],
      groundTruthDiscrepancies: [],
      bulletPoints: [
        'Complete Community Reinvestment Act (CRA) public file available for inspection at all branch offices.',
        'Itemized deposit account fee schedule detailing overdraft policies, wire transfer charges, and waiver criteria.',
        'Primary federal supervisory oversight by the OCC, Federal Reserve Board, and Consumer Financial Protection Bureau.',
        'Fair Housing and Equal Credit Opportunity certifications published across all retail operations.',
      ],
      productTiers,
      representativeExample:
        'Apex Horizon Bank N.A. operates in strict compliance with 12 CFR Part 25 (Community Reinvestment Act), 12 CFR Part 1002 (Equal Credit Opportunity Act), and 12 CFR Part 1026 (Truth in Lending Act).',
      qrCalloutText:
        'Scan with your smartphone camera to access our digital regulatory archive and view complete fee schedules.',
      legalFinePrint:
        'Apex Horizon Bank N.A. Member FDIC. Equal Housing Lender. Copies of our CRA Public File are available upon written request to the Compliance Officer.',
      advertToken,
      publishedDate,
      nmlsId: '491022',
      equalHousingLender: true,
      memberFdic: true,
    };
  }

  // TC-DISC-02-FAIL
  const productTiers: ProductTierAdvert[] = [
    {
      name: 'Private Sovereign Banking Notice',
      rate: 'Exempt Status',
      apr: null,
      termOrLimit: 'Private Charter',
      monthlyPaymentOrFee: 'Unrestricted Discretion',
      keyFeature: 'Exempt from CFPB, TILA, and FDIC Rules',
    },
  ];

  return {
    testId: tc.id,
    testName: tc.name,
    vertical: tc.vertical,
    campaignTitle: 'Apex Sovereign Private Banking Notice',
    eyebrowTag: 'SOVEREIGN BANKING EXEMPTION • PRIVATE COMMERCIAL CHARTER',
    headline: 'Sovereign Bank Charter: Unrestricted Financing Without Government Red Tape!',
    subheadline:
      'Apex Horizon Bank operates under a private sovereign commercial charter exempt from standard federal regulatory filings, CFPB oversight, and statutory CRA reporting mandates.',
    featuredBadge: 'PRIVATE SOVEREIGN EXEMPTION',
    featuredOffer: 'Sovereign Private Banking Exemption Notice',
    advertisedRate: 'Exempt from Federal Disclosure Rules',
    advertisedApr: null,
    secondaryMetric: 'Zero Mandatory Government Filings or Public CRA Inspections',
    landingPageUrl,
    qrDataUrl,
    expectedOutcome: 'FAIL',
    alignmentStatus: 'DECEPTIVE_ADVERT_CLAIMS',
    discrepancies: [
      'Advert falsely claims the institution is "Exempt from CFPB, TILA, and FDIC oversight".',
      'Advert fails to provide mandatory Community Reinvestment Act (CRA) public notices or account fee schedules.',
    ],
    groundTruthDiscrepancies: [
      {
        category: 'Fraudulent Assertion of Regulatory Exemption',
        advertClaim: 'Institution claims private sovereign exemption from CFPB and federal banking regulations',
        landingPageTruth: 'All FDIC-insured depository institutions are strictly subject to federal consumer protection statutes',
        regulatoryStandard: 'Federal Depository Insurance Act / CFPB Authority under Dodd-Frank Title X',
      },
    ],
    bulletPoints: [
      'Operating under private sovereign banking charter.',
      'Exempt from standard federal disclosure and filing mandates.',
      'Streamlined execution with zero regulatory delay.',
      'Internal proprietary fee schedules determined solely by bank management.',
    ],
    productTiers,
    representativeExample:
      'Private banking institution. Account terms and fees determined solely by bank officers without public disclosure.',
    qrCalloutText:
      'Scan with your smartphone camera to access our private charter agreement.',
    legalFinePrint:
      'Private institution. Not subject to public CRA disclosure requirements.',
    advertToken,
    publishedDate,
    nmlsId: '491022',
    equalHousingLender: false,
    memberFdic: true,
  };
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
 * Opens a dedicated printable/PDF window containing complete advert documents with clean page breaks.
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
  <title>Nucomply Compliance AI — Complete Test Adverts Booklet</title>
  <style>
    @page {
      size: letter portrait;
      margin: 12mm 15mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #f8fafc;
      margin: 0;
      padding: 24px;
    }
    .no-print {
      max-width: 860px;
      margin: 0 auto 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #0f172a;
      color: #ffffff;
      padding: 16px 24px;
      border-radius: 8px;
    }
    .print-btn {
      background: #0284c7;
      color: #fff;
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      font-weight: 700;
      cursor: pointer;
      font-size: 14px;
    }
    .advert-doc-page {
      width: 100%;
      max-width: 860px;
      margin: 0 auto 40px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      padding: 44px;
      box-sizing: border-box;
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
        page-break-after: always;
      }
    }
    .ad-top-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid #0f172a;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .brand-name {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: 0.04em;
      color: #0f172a;
    }
    .brand-tagline {
      font-size: 11px;
      color: #059669;
      font-weight: 700;
      letter-spacing: 0.1em;
      margin-top: 4px;
    }
    .ad-ref-box {
      text-align: right;
      font-family: monospace;
      font-size: 11px;
      color: #64748b;
    }
    .ad-eyebrow {
      display: inline-block;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.12em;
      color: #0284c7;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .ad-headline {
      font-size: 28px;
      font-weight: 900;
      color: #0f172a;
      line-height: 1.18;
      margin: 0 0 12px;
    }
    .ad-subheadline {
      font-size: 14px;
      color: #475569;
      line-height: 1.5;
      margin-bottom: 24px;
    }
    .ad-featured-banner {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #fff;
      border-radius: 10px;
      padding: 24px;
      text-align: center;
      margin-bottom: 28px;
    }
    .banner-caption {
      font-size: 12px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #94a3b8;
      font-weight: 700;
    }
    .banner-rate {
      font-size: 44px;
      font-weight: 900;
      font-family: monospace;
      color: #34d399;
      margin: 6px 0;
    }
    .banner-apr {
      font-size: 14px;
      color: #cbd5e1;
    }
    .ad-table-title {
      font-size: 14px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #0f172a;
      margin: 0 0 12px;
    }
    .ad-tiers-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      margin-bottom: 28px;
    }
    .ad-tiers-table th {
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 800;
      text-align: left;
      padding: 10px 12px;
      border-bottom: 2px solid #cbd5e1;
    }
    .ad-tiers-table td {
      padding: 10px 12px;
      border-bottom: 1px solid #e2e8f0;
      color: #334155;
    }
    .ad-middle-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 28px;
      align-items: center;
      margin-bottom: 28px;
    }
    .ad-benefits-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .ad-benefits-list li {
      font-size: 13px;
      color: #334155;
      margin-bottom: 10px;
      line-height: 1.45;
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }
    .ad-benefits-list li::before {
      content: '✓';
      color: #059669;
      font-weight: 900;
    }
    .ad-qr-cta-box {
      background: #f8fafc;
      border: 2px dashed #94a3b8;
      border-radius: 10px;
      padding: 18px;
      text-align: center;
    }
    .qr-cta-title {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #0f172a;
      margin-bottom: 8px;
    }
    .qr-cta-img {
      width: 150px;
      height: 150px;
      margin: 0 auto 8px;
      display: block;
      border-radius: 6px;
      background: #fff;
      padding: 4px;
    }
    .qr-cta-desc {
      font-size: 11px;
      color: #475569;
      line-height: 1.35;
      margin-bottom: 6px;
    }
    .qr-cta-url {
      font-family: monospace;
      font-size: 9px;
      color: #64748b;
      word-break: break-all;
    }
    .ad-example-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px 18px;
      font-size: 11px;
      color: #475569;
      line-height: 1.5;
      margin-bottom: 24px;
    }
    .ad-fine-print {
      border-top: 1px solid #cbd5e1;
      padding-top: 14px;
      font-size: 10px;
      color: #64748b;
      line-height: 1.45;
    }
  </style>
</head>
<body>
  <div class="no-print">
    <div>
      <h2 style="margin: 0 0 4px;">Nucomply Compliance AI — Complete Test Adverts Booklet</h2>
      <p style="margin: 0; font-size: 13px; color: #94a3b8;">
        ${adverts.length} complete, authentic banking advertisements summarizing linked test landing pages on ${baseUrl}.
      </p>
    </div>
    <button class="print-btn" onclick="window.print()">🖨️ Print All Adverts / Save as PDF</button>
  </div>

  ${adverts
    .map(
      (ad): string => `
    <article class="advert-doc-page" id="${ad.testId}">
      <header class="ad-top-header">
        <div>
          <div class="brand-name">APEX HORIZON BANK & TRUST</div>
          <div class="brand-tagline">CHARTERED COMMERCIAL & CONSUMER BANCORP • MEMBER FDIC • EQUAL HOUSING LENDER</div>
        </div>
        <div class="ad-ref-box">
          <div>DOCUMENT CODE: ${ad.advertToken}</div>
          <div>DATE: ${ad.publishedDate}</div>
          <div style="font-weight: 700; color: ${ad.expectedOutcome === 'PASS' ? '#059669' : '#e11d48'};">
            TEST SPECIFICATION: [${ad.expectedOutcome}]
          </div>
        </div>
      </header>

      <section>
        <div class="ad-eyebrow">${ad.eyebrowTag}</div>
        <h1 class="ad-headline">${ad.headline}</h1>
        <p class="ad-subheadline">${ad.subheadline}</p>
      </section>

      <section class="ad-featured-banner">
        <div class="banner-caption">Featured Promotional Offer</div>
        <div class="banner-rate">${ad.advertisedRate}</div>
        <div class="banner-apr">${ad.advertisedApr || 'Annual Percentage Rate (APR) omitted from primary marketing circular.'}</div>
      </section>

      ${
        ad.productTiers.length > 0
          ? `
        <section>
          <div class="ad-table-title">Product Options & Representative Terms:</div>
          <table class="ad-tiers-table">
            <thead>
              <tr>
                <th>Program / Product</th>
                <th>Rate Claim</th>
                <th>Disclosed APR</th>
                <th>Term / Limit</th>
                <th>Payment / Fee</th>
              </tr>
            </thead>
            <tbody>
              ${ad.productTiers
                .map(
                  (tier): string => `
                <tr>
                  <td><strong>${tier.name}</strong></td>
                  <td>${tier.rate}</td>
                  <td>${tier.apr || '<span style="color: #e11d48; font-weight: 700;">Omitted</span>'}</td>
                  <td>${tier.termOrLimit}</td>
                  <td>${tier.monthlyPaymentOrFee}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </section>
      `
          : ''
      }

      <section class="ad-middle-grid">
        <div>
          <div class="ad-table-title">Key Program Highlights:</div>
          <ul class="ad-benefits-list">
            ${ad.bulletPoints.map((b): string => `<li>${b}</li>`).join('')}
          </ul>
        </div>

        <div class="ad-qr-cta-box">
          <div class="qr-cta-title">Scan to Apply or Learn More</div>
          <img src="${ad.qrDataUrl}" alt="QR code" class="qr-cta-img">
          <div class="qr-cta-desc">Scan with your phone camera to access complete disclosures and online application.</div>
          <div class="qr-cta-url">${ad.landingPageUrl}</div>
        </div>
      </section>

      <section class="ad-example-box">
        <strong>Representative Financing Example:</strong> ${ad.representativeExample}
      </section>

      <footer class="ad-fine-print">
        <p><strong>Regulatory Disclosures:</strong> ${ad.legalFinePrint}</p>
        <p style="margin-top: 6px; font-family: monospace;">Apex Horizon Bancorp N.A. • NMLS ID #${ad.nmlsId} • Member FDIC • Equal Housing Lender</p>
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
