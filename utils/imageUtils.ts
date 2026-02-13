import { Platform } from 'react-native';

export async function captureViewAsBlob(
  element: HTMLElement | null
): Promise<Blob | null> {
  if (!element) return null;

  if (Platform.OS === 'web') {
    const { toBlob } = await import('html-to-image');
    // Capture at 2x for high quality
    const blob = await toBlob(element, {
      pixelRatio: 2,
      quality: 1.0,
      cacheBust: true,
    });
    return blob;
  }

  // For native platforms, would use react-native-view-shot
  // This is a web-first implementation
  return null;
}

export async function captureViewAsDataUrl(
  element: HTMLElement | null
): Promise<string | null> {
  if (!element) return null;

  if (Platform.OS === 'web') {
    const { toPng } = await import('html-to-image');
    const dataUrl = await toPng(element, {
      pixelRatio: 2,
      quality: 1.0,
      cacheBust: true,
    });
    return dataUrl;
  }

  return null;
}

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

export async function shareImage(blob: Blob, filename: string): Promise<boolean> {
  if (Platform.OS === 'web') {
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
            return false; // User cancelled
          }
          throw err;
        }
      }
    }

    // Fallback: just download
    await downloadImage(blob, filename);
    return true;
  }

  return false;
}
