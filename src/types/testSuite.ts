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
