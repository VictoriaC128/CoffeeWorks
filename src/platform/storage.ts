// Durable storage. The app reads synchronously from localStorage (fast start),
// but on Android/iOS the WebView's localStorage can be cleared by the OS.
// Native Preferences is the source of truth there: it is copied into
// localStorage before React renders, and every write goes to both.
import { Preferences } from '@capacitor/preferences';
import { isNative } from './native';

const PREFIX = 'coffeeworks_';

export async function hydrateFromNative(): Promise<void> {
  if (!isNative) return;
  try {
    const { keys } = await Preferences.keys();
    const ours = keys.filter((k) => k.startsWith(PREFIX));
    if (ours.length === 0) {
      // First native launch after an upgrade: seed native storage from the WebView copy.
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(PREFIX)) await Preferences.set({ key: k, value: localStorage.getItem(k) ?? '' });
      }
      return;
    }
    for (const key of ours) {
      const { value } = await Preferences.get({ key });
      if (value !== null) localStorage.setItem(key, value);
    }
  } catch (e) {
    console.warn('Native storage unavailable, using WebView storage only', e);
  }
}

export function saveKey(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn('localStorage write failed', e);
  }
  if (isNative) Preferences.set({ key, value }).catch(() => undefined);
}

export function loadKey<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export async function clearAll() {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(PREFIX)) keys.push(k);
  }
  keys.forEach((k) => localStorage.removeItem(k));
  if (isNative) {
    try {
      const { keys: nk } = await Preferences.keys();
      await Promise.all(nk.filter((k) => k.startsWith(PREFIX)).map((key) => Preferences.remove({ key })));
    } catch {
      /* nothing stored natively */
    }
  }
}
