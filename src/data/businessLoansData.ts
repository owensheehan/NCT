import type {
  BusinessLoansPageContent,
  ComplianceVariantId,
  PageDynamicVariant,
} from '../types/compliance.ts';

export const businessLoansVariants: Record<
  ComplianceVariantId,
  PageDynamicVariant<BusinessLoansPageContent>
> = {
  compliant: {
    id: 'compliant',
    label: 'Standard Commercial Financing & APR Disclosure Compliance',
    complianceRating: 'A (Fully Compliant)',
    riskLevel: 'LOW',
    summary: 'Complies with state commercial financing disclosure regulations (CA SB 1235 / NY Commercial Finance Law): Explicitly states annualized APR alongside factor rates, specifies total dollar cost of financing, itemizes origination fees, and clearly explains personal guarantee requirements.',
    flags: [],
    content: {
      heroHeadline: 'Fuel Your Business Growth with Transparent Commercial Capital',
      heroSubheadline: 'Access working capital lines, equipment loans, and commercial real estate financing with transparent APR metrics and zero hidden surprises.',
      commercialBanner: 'Commercial Financing Disclosure Compliant: All rates reflect comprehensive Annual Percentage Rates (APR) including all mandatory fees.',
      sb1235CommercialDisclosure: 'In accordance with California Financial Code § 22800 et seq. and New York Commercial Finance Disclosure Law, commercial borrowers receive a standardized Commercial Financing Disclosure detailing the Total Cost of Financing, Annual Percentage Rate (APR), and periodic payment schedule prior to contract consummation.',
      guaranteeNotice: 'Commercial loans and credit lines over $50,000 generally require a joint personal guarantee from all business owners holding 20% or greater equity ownership.',
      loans: [
        {
          id: 'biz-working-capital',
          productName: 'Apex Commercial Working Capital Facility',
          facilityType: 'Working Capital Line',
          rateQuotedAs: 'Annual Percentage Rate (APR)',
          rateDisplay: '8.49% – 14.25% APR',
          estimatedEffectiveApr: '8.49% to 14.25% variable based on Prime Rate + 0.99% margin',
          personalGuaranteeRequired: true,
          prepaymentPenaltyClaim: 'No prepayment penalties. Pay off early at any time and save on unaccrued interest.',
          approvalSpeedClaim: 'Underwritten decisions within 48 to 72 business hours.',
        },
        {
          id: 'biz-equipment-term',
          productName: 'Commercial Equipment & Machinery Term Financing',
          facilityType: 'Equipment Financing',
          rateQuotedAs: 'Annual Percentage Rate (APR)',
          rateDisplay: '6.95% Fixed APR',
          estimatedEffectiveApr: '6.95% fixed for 60 months with 1.5% origination fee included in APR calculation',
          personalGuaranteeRequired: true,
          prepaymentPenaltyClaim: 'Declining prepayment fee structure (3% Year 1, 2% Year 2, 0% thereafter).',
          approvalSpeedClaim: 'Structured financing with dedicated commercial relationship officers.',
        },
      ],
    },
  },

  minor_omissions: {
    id: 'minor_omissions',
    label: 'Factor Rate Displayed Without APR Equivalence',
    complianceRating: 'C (Minor Non-Compliance)',
    riskLevel: 'MEDIUM',
    summary: 'The site displays a "1.18 Factor Rate" or "18% simple fee" without clearly stating the effective APR (which exceeds 42% on a 6-month term), leading commercial borrowers to confuse factor rates with annual percentage rates.',
    flags: [
      {
        category: 'ECOA_REG_B',
        severity: 'minor',
        title: 'Factor Rate Obfuscation in Commercial Advertising',
        description: 'Quoting a "1.18 Factor Rate" as "18% simple interest" conceals the true annualized cost of capital to the small business owner.',
        expectedDisclosure: 'Must provide estimated Annual Percentage Rate (APR) alongside factor rate.',
        actualContentSnippet: 'Promotes "Only 18% Flat Rate for 6 Months" without annualized APR calculation.',
      },
    ],
    content: {
      heroHeadline: 'Fast Capital for Growing Small Businesses',
      heroSubheadline: 'Secure immediate inventory and payroll funding with straightforward fee structures.',
      commercialBanner: 'Quick funding available for operational expansion.',
      sb1235CommercialDisclosure: 'Financing subject to business underwriting.',
      guaranteeNotice: 'Standard commercial underwriting covenants apply.',
      loans: [
        {
          id: 'biz-advance-minor',
          productName: 'Apex Accelerated Revenue Advance',
          facilityType: 'Revenue Advance',
          rateQuotedAs: 'Factor Rate',
          rateDisplay: '1.18 Simple Factor Rate',
          estimatedEffectiveApr: 'Effective APR not calculated on summary page; see contract.',
          personalGuaranteeRequired: true,
          prepaymentPenaltyClaim: 'Standard payoff terms apply.',
          approvalSpeedClaim: 'Instant pre-qualification.',
        },
      ],
    },
  },

  high_risk_udaap: {
    id: 'high_risk_udaap',
    label: 'Predatory Merchant Cash Advance Masked as 9% Bank Loan',
    complianceRating: 'F (High-Risk UDAAP Violation)',
    riskLevel: 'CRITICAL',
    summary: 'Conceals an effective 85.00% APR behind a deceptive "9% Flat Fee" claim, falsely promises "No Personal Guarantee Needed" while enforcing a secret confession of judgment and blanket lien on personal residences, and claims "Guaranteed 100% Approval for Every Business".',
    flags: [
      {
        category: 'CFPB_UDAAP',
        severity: 'critical',
        title: 'Deceptive Factor Rate Masked as Low-Interest APR',
        description: 'Advertising a 9-month merchant advance with a 1.25 multiplier as a "9% Low Interest Bank Loan" when the true annualized APR exceeds 85.00%.',
        expectedDisclosure: 'Accurate disclosure of annualized APR and total finance charges.',
        actualContentSnippet: '"9% Low Cost Business Loan — Cheaper Than Any Commercial Bank in the Nation!"',
      },
      {
        category: 'CFPB_UDAAP',
        severity: 'critical',
        title: 'Deceptive "No Personal Guarantee" Representation',
        description: 'Advertising loans as completely non-recourse with "Zero Personal Liability", while the contract requires a hidden personal confession of judgment.',
        expectedDisclosure: 'Explicit warning of personal recourse and collateral liens.',
        actualContentSnippet: '"Never risk your personal assets — 100% Unsecured with No Personal Guarantees Ever!"',
      },
    ],
    content: {
      heroHeadline: 'Instant $500,000 Business Cash — 9% Flat Rate, No Credit Checks!',
      heroSubheadline: 'Get funded in 60 minutes today! 100% Guaranteed Approval, No Personal Guarantee, and Zero Financial Statements Required.',
      commercialBanner: 'EMERGENCY BUSINESS RELIEF: Guaranteed Approval for Every Business Owner!',
      sb1235CommercialDisclosure: 'No disclosures required. Commercial agreements are private contracts.',
      guaranteeNotice: 'No personal guarantees, no liens, no personal risk of any kind!',
      loans: [
        {
          id: 'biz-predatory-mca',
          productName: 'Apex Instant Unconditional Business Injection',
          facilityType: 'Revenue Advance',
          rateQuotedAs: 'Flat Fee',
          rateDisplay: '9% Flat Fee (Actually 88.5% Effective APR)',
          estimatedEffectiveApr: 'Disguised: 88.5% APR',
          personalGuaranteeRequired: false, // Deceptive claim
          prepaymentPenaltyClaim: 'Pay early, but you must still pay 100% of all future unearned interest fees!',
          approvalSpeedClaim: 'Guaranteed funds deposited in 45 minutes.',
        },
      ],
    },
  },

  teaser_trap: {
    id: 'teaser_trap',
    label: 'Commercial Credit Teaser with Hidden Confession of Judgment',
    complianceRating: 'F (High-Risk UDAAP Violation)',
    riskLevel: 'CRITICAL',
    summary: 'Advertises 1.99% commercial line of credit for the first 90 days, which triples to 28.50% APR, along with a 15% mandatory draw fee.',
    flags: [
      {
        category: 'CFPB_UDAAP',
        severity: 'critical',
        title: 'Deceptive Commercial Teaser Rate Escalation',
        description: 'Promoting temporary 1.99% rate without clear disclosure of immediate escalation to high-interest commercial rate.',
        expectedDisclosure: 'Clear disclosure of duration and post-promotional commercial financing rates.',
        actualContentSnippet: 'Prominent 1.99% banner hides 28.50% jump and 15% draw fees.',
      },
    ],
    content: {
      heroHeadline: 'Supercharge Cash Flow with our 1.99% Commercial Credit Line',
      heroSubheadline: 'Borrow up to $1,000,000 at the lowest commercial borrowing rate in modern banking history.',
      commercialBanner: 'LIMITED COMMERCIAL ALLOCATION: 1.99% Introductory Financing',
      sb1235CommercialDisclosure: 'Rates reflect promotional introductory periods. Subject to bank approval.',
      guaranteeNotice: 'Standard business terms apply.',
      loans: [
        {
          id: 'biz-teaser-credit',
          productName: 'Apex 1.99% Commercial Prime Line',
          facilityType: 'Working Capital Line',
          rateQuotedAs: 'Annual Percentage Rate (APR)',
          rateDisplay: '1.99% Intro Rate*',
          estimatedEffectiveApr: '1.99% for 90 days, jumps to 28.50% APR thereafter.',
          personalGuaranteeRequired: true,
          prepaymentPenaltyClaim: '$5,000 termination fee if closed in year 1.',
          approvalSpeedClaim: 'Same-day capital reserve.',
        },
      ],
    },
  },
};
