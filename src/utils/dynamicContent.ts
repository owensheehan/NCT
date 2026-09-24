import type {
  ComplianceVariantId,
  VisitSession,
  PageDynamicVariant,
  VisitLogEntry,
} from '../types/compliance.ts';

const VARIANT_CYCLE: ComplianceVariantId[] = [
  'compliant',
  'minor_omissions',
  'high_risk_udaap',
  'teaser_trap',
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
  };

  const existingLogs = getVisitAuditLog();
  // Prevent duplicate continuous logging for same session on hot re-renders
  if (existingLogs.length > 0 && existingLogs[0]?.visitId === session.visitId && existingLogs[0]?.path === entry.path) {
    return;
  }

  const updatedLogs = [entry, ...existingLogs].slice(0, 100);
  try {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updatedLogs));
  } catch {
    // ignore quota errors
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

  // 3. Optional Webhook dispatch if configured via query param or storage
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

  const sessionVisitCount = parseInt(sessionStorage.getItem('nucomply_visit_count') ?? '0', 10) + 1;
  sessionStorage.setItem('nucomply_visit_count', sessionVisitCount.toString());

  let activeVariant: ComplianceVariantId;
  if (paramVariant && VARIANT_CYCLE.includes(paramVariant)) {
    activeVariant = paramVariant;
  } else {
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

  const url = new URL(window.location.href);
  url.searchParams.delete('variant');
  url.searchParams.delete('lock');
  url.hash = `${baseHash}?${hashParams.toString()}`;

  window.location.href = url.toString();
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
