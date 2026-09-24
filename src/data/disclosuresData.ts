import type {
  ComplianceVariantId,
  PageDynamicVariant,
} from '../types/compliance.ts';

export interface RegulatoryFrameworkItem {
  code: string;
  name: string;
  authority: string;
  keyRule: string;
  commonViolations: string[];
}

export interface DisclosuresPageContent {
  headline: string;
  subheadline: string;
  craStatement: string;
  fdicStatement: string;
  equalHousingStatement: string;
  feeScheduleExcerpt: string;
  regulatoryFrameworks: RegulatoryFrameworkItem[];
}

export const disclosuresVariants: Record<
  ComplianceVariantId,
  PageDynamicVariant<DisclosuresPageContent>
> = {
  compliant: {
    id: 'compliant',
    label: 'Complete Institutional Regulatory Archive',
    complianceRating: 'A (Fully Compliant)',
    riskLevel: 'LOW',
    summary: 'Full repository of mandatory disclosures: Community Reinvestment Act (CRA) public file notice, FDIC $250k rules, Equal Housing Opportunity certification, and itemized account fee schedules.',
    flags: [],
    content: {
      headline: 'Regulatory Compliance & Statutory Disclosures Archive',
      subheadline: 'Apex Horizon Bank maintains complete transparency under federal and state banking laws. Review statutory disclosures, public filings, and fee schedules.',
      craStatement: 'Apex Horizon Bank Community Reinvestment Act (CRA) Public File is available for public inspection at any banking branch during normal business hours or by written request to Corporate Compliance, Apex Horizon Bank N.A.',
      fdicStatement: 'Apex Horizon Bank is an insured depository institution. Eligible deposits are insured by the Federal Deposit Insurance Corporation (FDIC) up to $250,000 per depositor, per insured bank, for each account ownership category.',
      equalHousingStatement: 'Apex Horizon Bank is an Equal Housing Lender. We do business in accordance with Federal Fair Housing Law and the Equal Credit Opportunity Act. We do not discriminate on the basis of race, color, religion, national origin, sex, handicap, or familial status.',
      feeScheduleExcerpt: 'Standard Account Fees: Monthly maintenance $0 on qualifying accounts; Out-of-network ATM $2.50; Domestic Wire (Outgoing) $25.00; International Wire (Outgoing) $45.00; Stop Payment $30.00; Overdraft Fee $0 (No overdraft fees charged).',
      regulatoryFrameworks: [
        {
          code: '12 CFR Part 1026 (Reg Z)',
          name: 'Truth in Lending Act (TILA)',
          authority: 'Consumer Financial Protection Bureau (CFPB)',
          keyRule: 'Mandates clear and conspicuous disclosure of Annual Percentage Rates (APR) whenever trigger terms (down payment, monthly payment, term, finance charge) are referenced in advertising.',
          commonViolations: [
            'Advertising note rate without adjacent APR',
            'Citing monthly payment without loan term and down payment basis',
            'Advertising "No Closing Costs" when fees are rolled into balance without clarification',
          ],
        },
        {
          code: '12 CFR Part 1030 (Reg DD)',
          name: 'Truth in Savings Act (TISA)',
          authority: 'CFPB / FDIC',
          keyRule: 'Requires Annual Percentage Yield (APY) to be stated with equal prominence to any interest rate; mandates statement of minimum balance required to earn APY, and statement that fees could reduce earnings.',
          commonViolations: [
            'Using "interest rate" without stating APY',
            'Failing to disclose minimum balance needed to receive advertised rate',
            'Omitting "fees could reduce earnings" notification',
          ],
        },
        {
          code: '12 CFR Part 1026.60 (CARD Act)',
          name: 'Credit CARD Act of 2009',
          authority: 'CFPB',
          keyRule: 'Requires tabular format (Schumer Box) for credit card solicitations, explicit expiration dates for introductory 0% offers, and limits on penalty fees and interest rate hikes.',
          commonViolations: [
            'Omission of tabular Schumer Box',
            'Misleading "0% Forever" or "Guaranteed Line of Credit" claims',
            'Concealing post-introductory variable APR ranges',
          ],
        },
        {
          code: '12 U.S.C. § 5531 / 5536',
          name: 'Dodd-Frank Act Title X (CFPB UDAAP)',
          authority: 'CFPB / Federal Trade Commission',
          keyRule: 'Prohibits Unfair, Deceptive, or Abusive Acts or Practices (UDAAP) in commercial and consumer financial services marketing.',
          commonViolations: [
            'Bait-and-switch introductory teaser pricing',
            'Deceptive claims of "Free" accounts that carry mandatory fees',
            'Promising guaranteed loan approval regardless of credit underwriting',
          ],
        },
        {
          code: 'FINRA Rule 2210 / SEC IA Act',
          name: 'Securities & Investment Communications',
          authority: 'SEC / FINRA',
          keyRule: 'Communications must be fair, balanced, and not promissory. Must prominently state that investments are Not FDIC Insured, May Lose Value, and Have No Bank Guarantee.',
          commonViolations: [
            'Promising guaranteed returns or zero market risk',
            'Claiming investment securities are FDIC insured',
            'Highlighting past performance without benchmark and volatility context',
          ],
        },
      ],
    },
  },

  minor_omissions: {
    id: 'minor_omissions',
    label: 'Truncated Disclosures & Missing Fee Schedule',
    complianceRating: 'C (Minor Non-Compliance)',
    riskLevel: 'MEDIUM',
    summary: 'The disclosures page omits the itemized account fee schedule and replaces the CRA public notice with a generic customer service link.',
    flags: [
      {
        category: 'TISA_REG_DD',
        severity: 'minor',
        title: 'Omission of Itemized Fee Schedule in Public Disclosure Hub',
        description: 'Deposit account fee schedules must be accessible to consumers prior to account opening.',
        expectedDisclosure: 'Full itemized schedule of deposit fees.',
        actualContentSnippet: 'Fee schedule replaced with "Fees may apply; contact branch."',
      },
    ],
    content: {
      headline: 'Legal Disclosures & Agreements',
      subheadline: 'Apex Horizon Bank general legal repository.',
      craStatement: 'CRA documentation available upon formal written request.',
      fdicStatement: 'Apex Horizon Bank Member FDIC.',
      equalHousingStatement: 'Equal Housing Opportunity.',
      feeScheduleExcerpt: 'Fee schedules are available at local branches upon request.',
      regulatoryFrameworks: [
        {
          code: 'Reg Z / Reg DD Overview',
          name: 'Banking Guidelines',
          authority: 'Various Regulators',
          keyRule: 'Standard regulatory notices applicable to consumer accounts.',
          commonViolations: ['Review state guidelines.'],
        },
      ],
    },
  },

  high_risk_udaap: {
    id: 'high_risk_udaap',
    label: 'Fraudulent Regulatory Exemption & Nullified Disclosures',
    complianceRating: 'F (High-Risk UDAAP Violation)',
    riskLevel: 'CRITICAL',
    summary: 'Claims the bank is "Exempt from CFPB, FDIC and SEC Oversight via Sovereign Banking Status", refuses to provide fee schedules, and asserts that consumers waive all statutory rights.',
    flags: [
      {
        category: 'CFPB_UDAAP',
        severity: 'critical',
        title: 'Fraudulent Assertion of Regulatory Exemption',
        description: 'Depository institutions cannot claim exemption from federal consumer protection laws, CFPB supervision, or TILA/TISA disclosure mandates.',
        expectedDisclosure: 'Mandatory statutory compliance statements.',
        actualContentSnippet: '"Apex Horizon operates under sovereign charter and is fully exempt from CFPB, TILA, and FDIC oversight."',
      },
    ],
    content: {
      headline: 'Sovereign Bank Charter Status & Regulatory Notice',
      subheadline: 'Why our bank provides unrestricted credit without bureaucratic regulatory delays.',
      craStatement: 'CRA requirements do not apply to private sovereign charters.',
      fdicStatement: 'Private reserves exceed federal limits. No government intervention required.',
      equalHousingStatement: 'Private lending institution.',
      feeScheduleExcerpt: 'Fees are assessed at the sole discretion of the bank without advance notice.',
      regulatoryFrameworks: [],
    },
  },

  teaser_trap: {
    id: 'teaser_trap',
    label: 'Promotional Terms & Conditional Disclosure Traps',
    complianceRating: 'F (High-Risk UDAAP Violation)',
    riskLevel: 'CRITICAL',
    summary: 'Features buried termination clauses and balloon interest triggers for promotional campaigns.',
    flags: [
      {
        category: 'CFPB_UDAAP',
        severity: 'critical',
        title: 'Buried Adverse Terms in Promotional Footnotes',
        description: 'Imposing severe arbitration clauses and unilateral right to alter rates retroactively.',
        expectedDisclosure: 'Fair terms and clear change-in-terms notice periods.',
        actualContentSnippet: 'Bank reserves right to change 0% promo to 35% without advance notice.',
      },
    ],
    content: {
      headline: 'Promotional Campaign Disclosures & Rate Reset Rules',
      subheadline: 'Terms governing all 0.99% and 0.00% promotional introductions.',
      craStatement: 'Apex Horizon Bank Member FDIC.',
      fdicStatement: 'FDIC insurance applies to qualifying balances.',
      equalHousingStatement: 'Equal Housing Lender.',
      feeScheduleExcerpt: 'Special promotional accounts subject to $150 annual maintenance surcharge if balance falls below $50,000.',
      regulatoryFrameworks: [
        {
          code: 'Promo Rules',
          name: 'Introductory Rate Governance',
          authority: 'Apex Horizon Legal',
          keyRule: 'Introductory pricing is contingent upon continuous account activity.',
          commonViolations: ['Account reset upon missed transaction target.'],
        },
      ],
    },
  },
};
