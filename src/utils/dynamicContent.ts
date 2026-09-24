import type {
  ComplianceVariantId,
  VisitSession,
  PageDynamicVariant,
} from '../types/compliance.ts';

const VARIANT_CYCLE: ComplianceVariantId[] = [
  'compliant',
  'minor_omissions',
  'high_risk_udaap',
  'teaser_trap',
];

/**
 * Extracts query parameters from both window.location.search AND hash query (for GitHub Pages HashRouter).
 */
const extractUrlParam = (paramName: string): string | null => {
  // 1. Check window.location.search
  const searchParams = new URLSearchParams(window.location.search);
  const searchVal = searchParams.get(paramName);
  if (searchVal) return searchVal;

  // 2. Check hash query, e.g. #/mortgages?variant=xxx
  const hash = window.location.hash;
  const hashQuestionIdx = hash.indexOf('?');
  if (hashQuestionIdx !== -1) {
    const hashParams = new URLSearchParams(hash.substring(hashQuestionIdx));
    const hashVal = hashParams.get(paramName);
    if (hashVal) return hashVal;
  }

  return null;
};

export const getVisitSession = (): VisitSession => {
  const paramVariant = extractUrlParam('variant') as ComplianceVariantId | null;
  const isLocked = extractUrlParam('lock') === 'true';

  // Read or create visit count from sessionStorage
  const sessionVisitCount = parseInt(sessionStorage.getItem('nucomply_visit_count') ?? '0', 10) + 1;
  sessionStorage.setItem('nucomply_visit_count', sessionVisitCount.toString());

  // Determine active variant
  let activeVariant: ComplianceVariantId;
  if (paramVariant && VARIANT_CYCLE.includes(paramVariant)) {
    activeVariant = paramVariant;
  } else {
    // Dynamic cycling on each visit based on current timestamp & counter
    const cycleIndex = (sessionVisitCount - 1) % VARIANT_CYCLE.length;
    activeVariant = VARIANT_CYCLE[cycleIndex];
  }

  const visitId = `VISIT-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date();
  const timestamp = `${now.toISOString().replace('T', ' ').substring(0, 19)} UTC`;

  return {
    visitId,
    timestamp,
    visitorSeed: sessionVisitCount,
    activeVariantId: activeVariant,
    isLocked,
  };
};

export const switchVariant = (newVariant: ComplianceVariantId, lock: boolean = true): void => {
  const hash = window.location.hash;
  const hashQuestionIdx = hash.indexOf('?');
  const baseHash = hashQuestionIdx !== -1 ? hash.substring(0, hashQuestionIdx) : (hash || '#/');

  const hashParams = new URLSearchParams(hashQuestionIdx !== -1 ? hash.substring(hashQuestionIdx) : '');
  hashParams.set('variant', newVariant);
  if (lock) {
    hashParams.set('lock', 'true');
  } else {
    hashParams.delete('lock');
  }

  // Also clean search params from main url to avoid conflict
  const url = new URL(window.location.href);
  url.searchParams.delete('variant');
  url.searchParams.delete('lock');
  url.hash = `${baseHash}?${hashParams.toString()}`;

  window.location.href = url.toString();
  // Force reload if only hash changed
  window.location.reload();
};

export const randomizeVisit = (): void => {
  const hash = window.location.hash;
  const hashQuestionIdx = hash.indexOf('?');
  const baseHash = hashQuestionIdx !== -1 ? hash.substring(0, hashQuestionIdx) : (hash || '#/');

  const url = new URL(window.location.href);
  url.searchParams.delete('variant');
  url.searchParams.delete('lock');
  url.hash = baseHash;

  // increment counter to force next variation
  const currentCount = parseInt(sessionStorage.getItem('nucomply_visit_count') ?? '0', 10);
  sessionStorage.setItem('nucomply_visit_count', (currentCount + 1).toString());

  window.location.href = url.toString();
  window.location.reload();
};

export const getActiveVariant = <T>(
  variants: Record<ComplianceVariantId, PageDynamicVariant<T>>,
  activeId: ComplianceVariantId
): PageDynamicVariant<T> => {
  return variants[activeId] ?? variants.compliant;
};
