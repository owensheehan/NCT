export type ComplianceVariantId = 'compliant' | 'minor_omissions' | 'high_risk_udaap' | 'teaser_trap';

export type RegulatoryJurisdiction = 'US_CFPB_FDIC' | 'UK_FCA' | 'EU_EBA';

export interface ComplianceFlag {
  category: 'TILA_REG_Z' | 'CARD_ACT' | 'TISA_REG_DD' | 'SEC_FINRA' | 'ECOA_REG_B' | 'CFPB_UDAAP';
  severity: 'compliant' | 'minor' | 'critical';
  title: string;
  description: string;
  expectedDisclosure: string;
  actualContentSnippet: string;
}

export interface PageDynamicVariant<T> {
  id: ComplianceVariantId;
  label: string;
  complianceRating: 'A (Fully Compliant)' | 'C (Minor Non-Compliance)' | 'F (High-Risk UDAAP Violation)';
  riskLevel: 'LOW' | 'MEDIUM' | 'CRITICAL';
  summary: string;
  flags: ComplianceFlag[];
  content: T;
}

export interface VisitSession {
  visitId: string;
  timestamp: string;
  visitorSeed: number;
  activeVariantId: ComplianceVariantId;
  isLocked: boolean;
}

export interface VisitLogEntry {
  visitId: string;
  timestamp: string;
  path: string;
  variantId: ComplianceVariantId;
  riskLevel: 'LOW' | 'MEDIUM' | 'CRITICAL';
  userAgent: string;
  expectedFlagCount: number;
}

/* Mortgage product types */
export interface MortgageOffer {
  id: string;
  name: string;
  headline: string;
  interestRate: number;
  apr: number | null; // Null in non-compliant scenarios
  termYears: number;
  monthlyPaymentEstimate: number;
  downPaymentPercent: number;
  closingCostsClaim: string;
  closingCostsDisclaimer?: string;
  triggerTermsDisclosed: boolean;
  representativeExample?: string;
}

export interface MortgagePageContent {
  heroHeadline: string;
  heroSubheadline: string;
  promoBadge: string;
  ratesNotice: string;
  offers: MortgageOffer[];
  equalHousingLogoVisible: boolean;
  aprClarificationNote: string;
  legalFootnote: string;
}

/* Credit Card product types */
export interface CreditCardOffer {
  id: string;
  name: string;
  tier: 'Standard' | 'Preferred' | 'Elite';
  headline: string;
  introApr: string;
  introPeriodMonths: number;
  regularAprRange: string;
  annualFee: number;
  balanceTransferFeeClaim: string;
  rewardsClaim: string;
  schumerBoxProvided: boolean;
  guaranteedApprovalClaim: boolean;
}

export interface CreditCardPageContent {
  heroHeadline: string;
  heroSubheadline: string;
  promoBanner: string;
  cards: CreditCardOffer[];
  representativeAprExample: string;
  penaltyAprWarning: string;
  lateFeeDisclaimer: string;
  cardActNotice: string;
}

/* Savings & Deposit product types */
export interface SavingsAccountOffer {
  id: string;
  name: string;
  type: 'High-Yield Savings' | 'Premier Money Market' | '14-Month Certificate of Deposit';
  headline: string;
  rateDisplay: string;
  rateType: 'APY' | 'Interest Rate Only';
  minimumDepositToEarn: number;
  compoundingFrequency: string;
  withdrawalRestrictions: string;
  fdicClaim: string;
  feeDeductionWarning: string;
}

export interface SavingsPageContent {
  heroHeadline: string;
  heroSubheadline: string;
  urgencyBanner: string;
  accounts: SavingsAccountOffer[];
  fdicInsuranceNotice: string;
  regDdDisclaimer: string;
}

/* Wealth & Investment product types */
export interface WealthPortfolioOffer {
  id: string;
  strategyName: string;
  riskProfile: 'Conservative' | 'Balanced' | 'Aggressive Growth' | 'Algorithmic Alpha';
  projectedReturnClaim: string;
  historicalPerformanceSnippet: string;
  guaranteeClaim: string;
  minimumInvestment: number;
  managementFeePercent: number;
}

export interface WealthPageContent {
  heroHeadline: string;
  heroSubheadline: string;
  advisoryTitle: string;
  portfolios: WealthPortfolioOffer[];
  capitalAtRiskWarning: string;
  secFinraDisclosure: string;
  pastPerformanceCaveat: string;
}

/* Commercial & Business Lending types */
export interface BusinessLoanOffer {
  id: string;
  productName: string;
  facilityType: 'Working Capital Line' | 'Equipment Financing' | 'Revenue Advance';
  rateQuotedAs: 'Annual Percentage Rate (APR)' | 'Factor Rate' | 'Flat Fee';
  rateDisplay: string;
  estimatedEffectiveApr: string;
  personalGuaranteeRequired: boolean;
  prepaymentPenaltyClaim: string;
  approvalSpeedClaim: string;
}

export interface BusinessLoansPageContent {
  heroHeadline: string;
  heroSubheadline: string;
  commercialBanner: string;
  loans: BusinessLoanOffer[];
  sb1235CommercialDisclosure: string;
  guaranteeNotice: string;
}
