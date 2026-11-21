import React, { useEffect } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { onBack } from '../platform/native';

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost'; size?: 'md' | 'lg' };

/** Square, ruled buttons. Primary is ink; there is one primary per screen. */
export const Btn: React.FC<BtnProps> = ({ variant = 'secondary', size = 'lg', className = '', ...rest }) => {
  const base = 'inline-flex items-center justify-center gap-2 font-bold border select-none disabled:opacity-40 disabled:pointer-events-none active:translate-y-px';
  const h = size === 'lg' ? 'min-h-[56px] px-6 text-[16px]' : 'min-h-[44px] px-4 text-[14px]';
  const v = variant === 'primary'
    ? 'bg-ink text-paper border-ink'
    : variant === 'ghost'
      ? 'border-transparent underline underline-offset-4 px-2'
      : 'bg-paper text-ink border-ink hover:bg-tint';
  return <button type="button" className={`${base} ${h} ${v} ${className}`} {...rest} />;
};

/** − value + stepper with 48px targets. */
export const Stepper: React.FC<{
  label: string;
  onMinus: () => void;
  onPlus: () => void;
  children?: React.ReactNode;
  className?: string;
}> = ({ label, onMinus, onPlus, children, className = '' }) => (
  <div className={`inline-flex border border-ink h-12 ${className}`} role="group" aria-label={label}>
    <button type="button" onClick={onMinus} className="w-12 flex items-center justify-center hover:bg-tint" aria-label={`Decrease ${label}`}><Minus className="w-5 h-5" strokeWidth={2.5} /></button>
    {children && <div className="min-w-[64px] px-2 border-x border-ink flex flex-col items-center justify-center text-[16px] font-extrabold num leading-none">{children}</div>}
    <button type="button" onClick={onPlus} className={`w-12 flex items-center justify-center hover:bg-tint ${children ? '' : 'border-l border-ink'}`} aria-label={`Increase ${label}`}><Plus className="w-5 h-5" strokeWidth={2.5} /></button>
  </div>
);

/** Segmented control (radio group). */
export function Segmented<T extends string>({ value, options, onChange, label, className = '', small = false }: {
  value: T; options: { value: T; label: React.ReactNode }[]; onChange: (v: T) => void; label: string; className?: string; small?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label={label} className={`inline-flex border border-ink ${className}`}>
      {options.map((o, i) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={`${small ? 'min-h-[36px] px-2.5 text-[12px]' : 'min-h-[44px] px-3.5 text-[14px]'} font-bold flex-1 whitespace-nowrap ${i ? 'border-l border-ink' : ''} ${on ? 'bg-ink text-paper' : 'hover:bg-tint'}`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export const Caps: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', ...rest }) => (
  <div className={`label-caps ${className}`} {...rest} />
);

/** Side sheet (wide layouts) or bottom sheet (simple layout). Back closes it. */
export const Sheet: React.FC<{ title: string; sub?: React.ReactNode; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode; side?: boolean }> = ({ title, sub, onClose, children, footer, side }) => {
  useEffect(() => onBack(() => { onClose(); return true; }), [onClose]);
  return (
    <div className={`fixed inset-0 z-40 flex ${side ? 'justify-end' : 'flex-col justify-end'}`} role="dialog" aria-modal="true" aria-label={title}>
      <button className="absolute inset-0 bg-scrim/25" aria-label="Close" onClick={onClose} />
      <section className={`relative bg-paper flex flex-col ${side ? 'w-[440px] max-w-full h-full border-l-2 border-ink pt-safe pr-safe pb-safe' : 'max-h-[90dvh] border-t-2 border-ink pb-safe'}`}>
        <header className="bg-ink text-paper px-5 py-4 flex items-start gap-3">
          <div className="min-w-0">
            <h2 className="text-[21px] font-extrabold leading-tight">{title}</h2>
            {sub && <div className="text-[12.5px] opacity-80 mt-1">{sub}</div>}
          </div>
          <button onClick={onClose} className="ml-auto -mr-2 -mt-1 w-11 h-11 flex items-center justify-center" aria-label="Close"><X className="w-5 h-5" /></button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <footer className="border-t border-ink px-5 py-3 flex gap-2.5">{footer}</footer>}
      </section>
    </div>
  );
};
