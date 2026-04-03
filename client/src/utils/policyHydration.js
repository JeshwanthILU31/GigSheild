export const normalizeObjectPayload = (payload) => {
  if (!payload || Array.isArray(payload)) return null;
  if (payload.data && !Array.isArray(payload.data)) return payload.data;
  return payload;
};

export const normalizePolicyHistory = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
};

/**
 * Loads current policy: active from /me, or latest from /history on 404.
 */
export async function loadPolicyWithFallback(api, ENDPOINTS) {
  const policyRes = await api.get(ENDPOINTS.POLICIES.ME, {
    validateStatus: (status) => status === 200 || status === 404
  });

  if (policyRes.status === 200) {
    return {
      policy: normalizeObjectPayload(policyRes.data),
      historyEmpty: false
    };
  }

  if (policyRes.status === 404) {
    try {
      const historyResponse = await api.get(ENDPOINTS.POLICIES.HISTORY);
      const historyList = normalizePolicyHistory(historyResponse?.data);
      const latest =
        historyResponse?.data?.data?.[0] ?? historyList[0] ?? null;
      return {
        policy: latest,
        historyEmpty: historyList.length === 0
      };
    } catch {
      return { policy: null, historyEmpty: false };
    }
  }

  return { policy: null, historyEmpty: false };
}

/** Display multiplier for tier (matches marketing tiers on Policy page). */
export function getTierMultiplierDisplay(tier) {
  const t = String(tier || '').toLowerCase();
  if (t.includes('ultra') || t.includes('global')) return '1.4';
  if (t.includes('premium') || t.includes('elite')) return '1.2';
  if (t.includes('basic')) return '0.8';
  return '1.0';
}

export function formatRenewalDate(value) {
  if (value == null || value === '') return '—';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
