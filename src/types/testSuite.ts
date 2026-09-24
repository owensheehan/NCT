import type { ComplianceVariantId } from './compliance.ts';

export interface TestCaseDefinition {
  id: string;
  name: string;
  vertical: 'Mortgages' | 'Credit Cards' | 'Savings & Deposits' | 'Wealth Advisory' | 'Commercial Credit' | 'Statutory Disclosures';
  subpath: string;
  expectedOutcome: 'PASS' | 'FAIL';
  variantId: ComplianceVariantId;
  regulatoryFramework: string;
  description: string;
  expectedViolations: string[];
}

export interface TestCaseWithQr extends TestCaseDefinition {
  fullUrl: string;
  qrDataUrl: string;
}

export interface TestSuiteExport {
  suiteTitle: string;
  suiteVersion: string;
  generatedAt: string;
  baseUrl: string;
  totalTests: number;
  passingTests: number;
  failingTests: number;
  tests: TestCaseWithQr[];
}

export interface AdvertDocumentData {
  testId: string;
  testName: string;
  vertical: string;
  campaignTitle: string;
  headline: string;
  subheadline: string;
  featuredOffer: string;
  advertisedRate: string;
  advertisedApr: string | null;
  landingPageUrl: string;
  qrDataUrl: string;
  expectedOutcome: 'PASS' | 'FAIL';
  alignmentStatus: 'ALIGNED_WITH_LANDING_PAGE' | 'CONFLICTING_RATES_OR_TERMS' | 'DECEPTIVE_ADVERT_CLAIMS';
  discrepancies: string[];
  bulletPoints: string[];
  legalFinePrint: string;
  advertToken: string;
  publishedDate: string;
}
