/** Extrai o ID de um link do Google Drive. */
export function extractGoogleDriveId(src: string): string | null {
  const trimmed = src.trim();
  if (!trimmed) return null;

  // Já é o nosso proxy local
  const proxyMatch = trimmed.match(/\/api\/drive-image\/([a-zA-Z0-9_-]+)/);
  if (proxyMatch?.[1]) return proxyMatch[1];

  const patterns = [
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/uc\?.*?[?&]?id=([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/thumbnail\?.*?[?&]?id=([a-zA-Z0-9_-]+)/,
    /lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/,
    /[?&]id=([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

/**
 * Converte links de partilha do Drive no proxy local.
 * Assim basta colar o link do Drive no admin.
 */
export function resolveProjectImageSrc(src: string): string {
  const trimmed = src.trim();
  if (!trimmed) return trimmed;

  const id = extractGoogleDriveId(trimmed);
  if (id) {
    return `/api/drive-image/${id}`;
  }

  return trimmed;
}

export function isRemoteImage(src: string): boolean {
  return /^https?:\/\//i.test(src);
}
