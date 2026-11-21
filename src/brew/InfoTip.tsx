import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Info } from 'lucide-react';
import { onBack } from '../platform/native';

const OPEN_EVENT = 'cw-infotip-open';

/**
 * Tap-to-read pop-up for longer explanations. The trigger is an ⓘ button, or a
 * dotted-underlined label when `label` is given. Tapping anywhere else, Escape
 * or the Android back gesture closes it; it can be reopened any number of times.
 * Only one pop-up is open at a time.
 */
export const InfoTip: React.FC<{
  /** Heading inside the pop-up */
  title: string;
  /** The longer text */
  children: React.ReactNode;
  /** Optional visible trigger text (otherwise an ⓘ icon) */
  label?: React.ReactNode;
  className?: string;
  /** Icon size in px */
  size?: number;
}> = ({ title, children, label, className = '', size = 16 }) => {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; width: number; above: boolean } | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const pop = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  const place = useCallback(() => {
    const t = trigger.current;
    if (!t) return;
    const r = t.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight;
    const width = Math.min(340, vw - 24);
    const left = Math.min(Math.max(12, r.left + r.width / 2 - width / 2), vw - width - 12);
    const h = pop.current?.offsetHeight ?? 160;
    const above = r.bottom + 8 + h > vh - 12 && r.top - 8 - h > 12;
    setPos({ top: above ? r.top - 8 - h : r.bottom + 8, left, width, above });
  }, []);

  useLayoutEffect(() => { if (open) place(); }, [open, place]);

  useEffect(() => {
    if (!open) return;
    window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: id }));
    const onOther = (e: Event) => { if ((e as CustomEvent).detail !== id) setOpen(false); };
    const onDown = (e: PointerEvent) => {
      const n = e.target as Node;
      if (pop.current?.contains(n) || trigger.current?.contains(n)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); trigger.current?.focus(); } };
    const onMove = () => place();
    window.addEventListener(OPEN_EVENT, onOther);
    document.addEventListener('pointerdown', onDown, true);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onMove);
    window.addEventListener('scroll', onMove, true);
    const offBack = onBack(() => { setOpen(false); return true; });
    return () => {
      window.removeEventListener(OPEN_EVENT, onOther);
      document.removeEventListener('pointerdown', onDown, true);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onMove);
      window.removeEventListener('scroll', onMove, true);
      offBack();
    };
  }, [open, id, place]);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={open ? `${id}-pop` : undefined}
        aria-label={label ? undefined : `About ${title}`}
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className={
          label
            ? `inline-flex items-center gap-1 min-h-[44px] underline decoration-dotted underline-offset-4 decoration-1 text-left ${className}`
            : `inline-flex items-center justify-center w-11 h-11 -m-2.5 shrink-0 text-mute hover:text-ink ${className}`
        }
      >
        {label}
        <Info style={{ width: size, height: size }} strokeWidth={2.2} aria-hidden className={label ? 'opacity-60 shrink-0' : ''} />
      </button>
      {open && createPortal(
        <div
          ref={pop}
          id={`${id}-pop`}
          role="dialog"
          aria-label={title}
          className="fixed z-[60] bg-paper text-ink border-2 border-ink px-4 py-3 text-[14.5px] leading-snug"
          style={{ top: pos?.top ?? -9999, left: pos?.left ?? 0, width: pos?.width ?? 320 }}
        >
          <b className="block text-[15px] mb-1">{title}</b>
          <div className="text-ink/85">{children}</div>
        </div>,
        document.body,
      )}
    </>
  );
};
