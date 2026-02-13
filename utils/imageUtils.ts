import { Platform } from 'react-native';

/**
 * Convert a blob:// or http:// URL to a base64 data URL.
 * This is critical for reliable image export — html-to-image cannot
 * always inline blob URLs inside SVG <image> elements.
 */
export async function toDataUrl(uri: string): Promise<string> {
  if (Platform.OS !== 'web') return uri;
  // Already a data URL
  if (uri.startsWith('data:')) return uri;

  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    // If conversion fails, return the original URI as fallback
    return uri;
  }
}

/**
 * Capture a DOM element as a PNG Blob.
 * pixelRatio defaults to 1 — the element should already be rendered at
 * the desired output resolution (e.g. 1080×1350 for the hidden export frame).
 */
export async function captureViewAsBlob(
  element: HTMLElement | null,
  pixelRatio: number = 1
): Promise<Blob | null> {
  if (!element) return null;

  if (Platform.OS === 'web') {
    const { toBlob } = await import('html-to-image');
    const blob = await toBlob(element, {
      pixelRatio,
      quality: 1.0,
      cacheBust: true,
      // Skip font embedding since Nunito is already loaded in the page
      skipFonts: true,
    });
    return blob;
  }

  return null;
}

/**
 * Capture a DOM element as a PNG data URL (for thumbnails / gallery storage).
 */
export async function captureViewAsDataUrl(
  element: HTMLElement | null,
  pixelRatio: number = 1
): Promise<string | null> {
  if (!element) return null;

  if (Platform.OS === 'web') {
    const { toPng } = await import('html-to-image');
    const dataUrl = await toPng(element, {
      pixelRatio,
      quality: 0.8,
      cacheBust: true,
      skipFonts: true,
    });
    return dataUrl;
  }

  return null;
}

/**
 * Trigger a download of a Blob as a file in the browser.
 */
export async function downloadImage(blob: Blob, filename: string): Promise<void> {
  if (Platform.OS === 'web') {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = filename;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  }
}

/**
 * Share an image via the Web Share API, with a download fallback.
 * Returns true if the share/download succeeded.
 */
export async function shareImage(blob: Blob, filename: string): Promise<boolean> {
  if (Platform.OS === 'web') {
    // Try the Web Share API first (works on mobile browsers)
    if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare) {
      const file = new File([blob], filename, { type: 'image/png' });
      const shareData = {
        files: [file],
        title: 'Little Moments',
        text: 'A special memory from Little Moments 💙',
      };

      if (navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
          return true;
        } catch (err: any) {
          if (err.name === 'AbortError') {
            return false; // User cancelled — not an error
          }
          // Share failed, fall through to download
        }
      }
    }

    // Fallback: download the image directly
    await downloadImage(blob, filename);
    return true;
  }

  return false;
}
