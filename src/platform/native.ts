// Thin wrappers over Capacitor plugins. Every call is safe on the web build:
// it either uses the plugin's web fallback or does nothing.
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { StatusBar, Style } from '@capacitor/status-bar';
import { KeepAwake } from '@capacitor-community/keep-awake';

export const isNative = Capacitor.isNativePlatform();
export const platform = Capacitor.getPlatform(); // 'android' | 'ios' | 'web'

const quiet = <T,>(p: Promise<T>) => p.catch(() => undefined);

/** Keep the screen on while a brew is running. */
export function setKeepAwake(on: boolean) {
  if (!isNative) return;
  quiet(on ? KeepAwake.keepAwake() : KeepAwake.allowSleep());
}

/** Short tap when a step changes; stronger pattern when the brew finishes. */
export function hapticStep() {
  if (isNative) quiet(Haptics.impact({ style: ImpactStyle.Medium }));
  else if ('vibrate' in navigator) navigator.vibrate?.(40);
}
export function hapticDone() {
  if (isNative) quiet(Haptics.notification({ type: NotificationType.Success }));
  else if ('vibrate' in navigator) navigator.vibrate?.([60, 60, 120]);
}
export function hapticTap() {
  if (isNative) quiet(Haptics.impact({ style: ImpactStyle.Light }));
}

export type OrientationLock = 'auto' | 'portrait' | 'landscape';

/** Lock or release the device orientation. Web: no-op (layout still follows the setting). */
export function lockOrientation(mode: OrientationLock) {
  if (!isNative) return;
  quiet(mode === 'auto' ? ScreenOrientation.unlock() : ScreenOrientation.lock({ orientation: mode }));
}

/**
 * Match the system bar icons to the theme. Capacitor's naming is by background:
 * Style.Light = dark icons for light grounds, Style.Dark = light icons for dark grounds.
 */
export function setSystemBars(darkIcons: boolean) {
  if (!isNative) return;
  quiet(StatusBar.setStyle({ style: darkIcons ? Style.Light : Style.Dark }));
}

type BackHandler = () => boolean; // return true when handled
const backHandlers: BackHandler[] = [];

/**
 * Register a handler for the Android back gesture/button. The most recently
 * registered handler runs first; if none handles it, the app goes to the background.
 */
export function onBack(handler: BackHandler) {
  backHandlers.push(handler);
  return () => {
    const i = backHandlers.lastIndexOf(handler);
    if (i >= 0) backHandlers.splice(i, 1);
  };
}

if (isNative) {
  App.addListener('backButton', () => {
    for (let i = backHandlers.length - 1; i >= 0; i--) {
      if (backHandlers[i]()) return;
    }
    quiet(App.minimizeApp());
  });
}
