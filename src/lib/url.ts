export function ensureUrlProtocol(url?: string | null) {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function isExternalUrl(url?: string | null) {
  if (!url) return false;
  return /^https?:\/\//i.test(url);
}
