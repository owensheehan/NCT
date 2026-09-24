import type {
  ComplianceVariantId,
  VisitSession,
  PageDynamicVariant,
  VisitLogEntry,
  DesiredOutcome,
} from '../types/compliance.ts';

const ALL_VARIANTS: ComplianceVariantId[] = [
  'compliant',
  'minor_omissions',
  'high_risk_udaap',
  'teaser_trap',
];

const FAIL_VARIANTS: ComplianceVariantId[] = [
  'minor_omissions',
  'high_risk_udaap',
  'teaser_trap',
];

const PASS_VARIANTS: ComplianceVariantId[] = [
  'compliant',
];

const AUDIT_STORAGE_KEY = 'nucomply_audit_log';

/**
 * Extracts query parameters from both window.location.search AND hash query (for GitHub Pages HashRouter).
 */
const extractUrlParam = (paramName: string): string | null => {
  const searchParams = new URLSearchParams(window.location.search);
  const searchVal = searchParams.get(paramName);
  if (searchVal) return searchVal;

  const hash = window.location.hash;
  const hashQuestionIdx = hash.indexOf('?');
  if (hashQuestionIdx !== -1) {
    const hashParams = new URLSearchParams(hash.substring(hashQuestionIdx));
    const hashVal = hashParams.get(paramName);
    if (hashVal) return hashVal;
  }

  return null;
};

/**
 * Parses caller outcome preference (?outcome=pass|fail, ?status=pass|fail, ?compliance=pass|fail, ?mode=pass|fail)
 */
export const getRequestedOutcome = (): DesiredOutcome => {
  const rawParam = (
    extractUrlParam('outcome') ||
    extractUrlParam('status') ||
    extractUrlParam('compliance') ||
    extractUrlParam('result') ||
    extractUrlParam('mode')
  )?.toLowerCase().trim();

  if (rawParam === 'pass' || rawParam === 'passing') return 'pass';
  if (rawParam === 'fail' || rawParam === 'failing') return 'fail';
  return 'random';
};

export const getVisitAuditLog = (): VisitLogEntry[] => {
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed as VisitLogEntry[];
    }
    return [];
  } catch {
    return [];
  }
};

export const clearVisitAuditLog = (): void => {
  localStorage.removeItem(AUDIT_STORAGE_KEY);
};

export const exportAuditLogAsJson = (): void => {
  const logs = getVisitAuditLog();
  const jsonString = JSON.stringify(logs, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `nucomply-audit-trail-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const recordVisit = (
  session: VisitSession,
  riskLevel: 'LOW' | 'MEDIUM' | 'CRITICAL',
  expectedFlagCount: number
): void => {
  const entry: VisitLogEntry = {
    visitId: session.visitId,
    timestamp: session.timestamp,
    path: window.location.hash || '#/',
    variantId: session.activeVariantId,
    riskLevel,
    userAgent: navigator.userAgent,
    expectedFlagCount,
    outcomeMode: session.outcomeMode,
  };

  const existingLogs = getVisitAuditLog();
  if (existingLogs.length > 0 && existingLogs[0]?.visitId === session.visitId && existingLogs[0]?.path === entry.path) {
    return;
  }

  const updatedLogs = [entry, ...existingLogs].slice(0, 100);
  try {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updatedLogs));
  } catch {
    // ignore
  }

  // 1. Expose on window object for automated AI inspection crawlers
  const customWindow = window as unknown as {
    __NUCOMPLY_AUDIT__?: {
      currentVisit: VisitLogEntry;
      historyCount: number;
      allVisits: VisitLogEntry[];
    };
  };
  customWindow.__NUCOMPLY_AUDIT__ = {
    currentVisit: entry,
    historyCount: updatedLogs.length,
    allVisits: updatedLogs,
  };

  // 2. Set DOM meta tags for HTML scrapers
  const setMeta = (name: string, content: string): void => {
    let el = document.querySelector(`meta[name="${name}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('name', name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };
  setMeta('nucomply-visit-id', entry.visitId);
  setMeta('nucomply-timestamp', entry.timestamp);
  setMeta('nucomply-variant', entry.variantId);
  setMeta('nucomply-risk-level', entry.riskLevel);
  setMeta('nucomply-expected-flags', expectedFlagCount.toString());
  setMeta('nucomply-outcome-mode', entry.outcomeMode);

  // 3. Optional Webhook dispatch
  const webhookUrl = extractUrlParam('webhook') || localStorage.getItem('nucomply_webhook_url');
  if (webhookUrl && webhookUrl.startsWith('http')) {
    try {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
        mode: 'no-cors',
      }).catch((): void => {
        // non-blocking
      });
    } catch {
      // ignore
    }
  }
};

export const getVisitSession = (): VisitSession => {
  const paramVariant = extractUrlParam('variant') as ComplianceVariantId | null;
  const isLocked = extractUrlParam('lock') === 'true';
  const outcomeMode = getRequestedOutcome();

  const sessionVisitCount = parseInt(sessionStorage.getItem('nucomply_visit_count') ?? '0', 10) + 1;
  sessionStorage.setItem('nucomply_visit_count', sessionVisitCount.toString());

  let activeVariant: ComplianceVariantId;

  if (paramVariant && ALL_VARIANTS.includes(paramVariant)) {
    // Explicit variant requested directly in URL
    activeVariant = paramVariant;
  } else if (outcomeMode === 'pass') {
    // Caller wants a passing site (clean/compliant, but still dynamic/randomized seed)
    const passIndex = (sessionVisitCount - 1) % PASS_VARIANTS.length;
    activeVariant = PASS_VARIANTS[passIndex];
  } else if (outcomeMode === 'fail') {
    // Caller wants a failing site (randomly cycles across failing scenarios on each visit)
    const failIndex = (sessionVisitCount - 1) % FAIL_VARIANTS.length;
    activeVariant = FAIL_VARIANTS[failIndex];
  } else {
    // Default: completely random across all scenarios
    const cycleIndex = (sessionVisitCount - 1) % ALL_VARIANTS.length;
    activeVariant = ALL_VARIANTS[cycleIndex];
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
    outcomeMode,
  };
};

export const switchOutcomeMode = (outcome: DesiredOutcome): void => {
  const hash = window.location.hash;
  const hashQuestionIdx = hash.indexOf('?');
  const baseHash = hashQuestionIdx !== -1 ? hash.substring(0, hashQuestionIdx) : (hash || '#/');

  const hashParams = new URLSearchParams(hashQuestionIdx !== -1 ? hash.substring(hashQuestionIdx) : '');
  if (outcome === 'random') {
    hashParams.delete('outcome');
    hashParams.delete('status');
  } else {
    hashParams.set('outcome', outcome);
  }
  // Clear locked variant when switching outcome mode
  hashParams.delete('variant');
  hashParams.delete('lock');

  const url = new URL(window.location.href);
  url.searchParams.delete('outcome');
  url.searchParams.delete('variant');
  url.searchParams.delete('lock');
  url.hash = `${baseHash}?${hashParams.toString()}`;

  window.location.href = url.toString();
  window.location.reload();
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
  hashParams.delete('outcome');

  const url = new URL(window.location.href);
  url.searchParams.delete('variant');
  url.searchParams.delete('lock');
  url.searchParams.delete('outcome');
  url.hash = `${baseHash}?${hashParams.toString()}`;

  window.location.href = url.toString();
  window.location.reload();
};

export const randomizeVisit = (): void => {
  const hash = window.location.hash;
  const hashQuestionIdx = hash.indexOf('?');
  const baseHash = hashQuestionIdx !== -1 ? hash.substring(0, hashQuestionIdx) : (hash || '#/');

  // Keep existing outcome parameter (pass/fail) if set, so "randomize" keeps caller's pass/fail constraint
  const currentOutcome = extractUrlParam('outcome');
  const hashParams = new URLSearchParams();
  if (currentOutcome) {
    hashParams.set('outcome', currentOutcome);
  }

  const url = new URL(window.location.href);
  url.searchParams.delete('variant');
  url.searchParams.delete('lock');
  url.hash = hashParams.toString() ? `${baseHash}?${hashParams.toString()}` : baseHash;

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
