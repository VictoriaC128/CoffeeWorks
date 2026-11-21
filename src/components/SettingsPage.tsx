import React, { useState } from 'react';
import { useSettings, THEMES, FONTS, Units } from '../settings/SettingsContext';
import { useCoffee } from '../context/CoffeeContext';
import { useLayout } from '../shell/LayoutContext';
import { Btn, Caps, Segmented } from '../brew/ui';
import * as F from '../settings/format';
import { InfoTip } from '../brew/InfoTip';

const UNIT_ROWS: { key: keyof Units; label: string; options: { value: string; label: string }[] }[] = [
  { key: 'coffee', label: 'Coffee · dose & yield', options: [{ value: 'g', label: 'g' }, { value: 'oz', label: 'oz' }] },
  { key: 'water', label: 'Water amount', options: [{ value: 'ml', label: 'ml' }, { value: 'g', label: 'g' }, { value: 'oz', label: 'fl oz' }] },
  { key: 'temp', label: 'Temperature', options: [{ value: 'c', label: '°C' }, { value: 'f', label: '°F' }] },
  { key: 'hardness', label: 'Water hardness', options: [{ value: 'ppm', label: 'ppm' }, { value: 'dh', label: '°dH' }, { value: 'gpg', label: 'gpg' }] },
  { key: 'flow', label: 'Flow rate', options: [{ value: 'gs', label: 'g/s' }, { value: 'mls', label: 'ml/s' }] },
  { key: 'grind', label: 'Grind shown as', options: [{ value: 'dial', label: 'Grinder dial' }, { value: 'um', label: 'Microns' }] },
  { key: 'time', label: 'Timer', options: [{ value: 'ms', label: '1:44' }, { value: 's', label: '104 s' }] },
];

const LAYOUT_NOTE = {
  auto: 'Upright shows the simple one-column layout. Turn the phone or tablet sideways for the full layout with the mode rail. It switches back whenever you turn it again.',
  simple: 'Always the simple one-column layout, whichever way the device is held. Good for a phone propped by the scale.',
  full: 'Always the full layout with the mode rail. The screen stays sideways.',
};

export const SettingsPage: React.FC<{ onOpenSetup: () => void }> = ({ onOpenSetup }) => {
  const { settings, setTheme, setFont, setLayout, setUnit, resetSettings } = useSettings();
  const { exportDataAsJSON, importDataFromJSON, resetToDefaults } = useCoffee();
  const { mode } = useLayout();
  const u = settings.units;
  const wide = mode !== 'simple';
  const [importText, setImportText] = useState('');
  const [status, setStatus] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  const flash = (s: string) => { setStatus(s); window.setTimeout(() => setStatus(''), 3500); };

  const exportData = async () => {
    const json = exportDataAsJSON();
    try {
      await navigator.clipboard.writeText(json);
      flash('Backup copied. Paste it into a note or message to keep it.');
    } catch {
      setImportText(json);
      flash('Copy the backup text below and keep it somewhere safe.');
    }
  };
  const importData = () => {
    if (!importText.trim()) return;
    flash(importDataFromJSON(importText) ? 'Backup restored.' : 'That text is not a CoffeeWorks backup. Paste the whole backup, from the first { to the last }.');
    setImportText('');
  };

  const section = (title: string, note: string, body: React.ReactNode) => (
    <section className="mb-6">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 border-b border-ink pb-1.5 pt-3">
        <h2 className="text-[17px] font-extrabold">{title}</h2>
        <span className="text-[12.5px] text-mute">{note}</span>
      </div>
      {body}
    </section>
  );

  const preview = (
    <div className="border border-ink">
      <div className="bg-mode-filter text-[#fff] px-3.5 py-2.5">
        <div className="text-[11px] font-bold uppercase tracking-[0.12em] opacity-85">CW-004 · Filter</div>
        <div className="text-[20px] font-extrabold">Orea V4 Apex</div>
      </div>
      <div className="px-3.5 py-3 border-b border-ink">
        <Caps>Step 4 of 5 · time left</Caps>
        <div className="num font-extrabold text-[100px] leading-[0.86] my-2">{F.clock(15, u)}</div>
        <div className="text-[16px] font-semibold">Pour to {F.text(F.water(200, u))}</div>
      </div>
      <div className="grid grid-cols-2">
        {[
          ['Total', F.clock(104, u), ''],
          ['Flow', F.text(F.flow(4.2, u)), 'text-flow'],
          ['Dose', F.text(F.coffee(15, u)), ''],
          ['Water temp', F.text(F.temp(92, u)), ''],
          ['Grind', u.grind === 'um' ? '≈ 800 µm' : 'Ode #5.1', ''],
          ['Hardness', `GH ${F.text(F.hardness(45, u))}`, ''],
        ].map(([k, v, c], i) => (
          <div key={k} className={`px-3.5 py-2 border-rule ${i % 2 === 0 ? 'border-r' : ''} ${i < 4 ? 'border-b' : ''}`}>
            <div className={`label-caps !text-[10.5px] ${c ? '!text-flow' : ''}`}>{k}</div>
            <div className={`text-[21px] font-bold num ${c}`}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-full">
      <header className="bg-ink text-paper px-5 sm:px-7 py-4 flex items-end gap-4">
        <div>
          <div className="text-[12px] font-bold uppercase tracking-[0.12em] opacity-80">Settings · this device</div>
          <h1 className="text-[28px] font-black tracking-[-0.02em]">Settings</h1>
        </div>
        <button type="button" onClick={resetSettings} className="ml-auto min-h-[40px] px-3 border border-paper text-[12px] font-bold uppercase tracking-[0.08em]">Reset to defaults</button>
      </header>

      <div className={`grid ${wide ? 'grid-cols-[1fr_360px]' : 'grid-cols-1'}`}>
        <div className="px-5 sm:px-7 pb-6 min-w-0">
          {section('Units', 'Every screen uses these. You can still flip one on a single dial.',
            UNIT_ROWS.map((r) => (
              <div key={r.key} className="flex items-center justify-between gap-3 border-b border-rule min-h-[56px] py-1.5">
                <span className="text-[15px] font-semibold">{r.label}</span>
                <Segmented label={r.label} value={u[r.key] as string} options={r.options} onChange={(v) => setUnit(r.key, v as never)} />
              </div>
            )))}

          {section('Font', 'From plain and easy to read, to playful.',
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mt-3" role="radiogroup" aria-label="Font">
              {FONTS.map((f) => {
                const on = settings.font === f.id;
                return (
                  <button key={f.id} type="button" role="radio" aria-checked={on} onClick={() => setFont(f.id)} style={{ fontFamily: f.family }}
                    className={`text-left p-3 flex flex-col gap-0.5 ${on ? 'border-2 border-ink' : 'border border-rule m-px'}`}>
                    <span className="text-[34px] font-bold leading-none mb-1.5" style={f.id === 'archivo' ? { fontStretch: '82%' } : undefined}>0:15</span>
                    <b className="text-[14px]">{f.name}</b>
                    <small className="text-[12px] text-mute">{f.note}</small>
                  </button>
                );
              })}
            </div>)}

          {section('Colour theme', 'Mode colours stay put. Flow stays orange, shaded to read on each.',
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mt-3" role="radiogroup" aria-label="Colour theme">
              {THEMES.map((t) => {
                const on = settings.theme === t.id;
                return (
                  <button key={t.id} type="button" role="radio" aria-checked={on} onClick={() => setTheme(t.id)}
                    className={`text-left p-3 flex flex-col gap-0.5 ${on ? 'border-2 border-ink' : 'border border-rule m-px'}`}>
                    <span className="relative block h-12 border mb-1.5" style={{ background: t.swatch[0], borderColor: t.dark ? '#444' : '#DDD' }} aria-hidden>
                      <i className="absolute left-2 top-2 w-11 h-[7px]" style={{ background: t.swatch[1] }} />
                      <em className="absolute left-2 right-2 bottom-2 h-2 flex">
                        {['--m-espresso', '--m-lever', '--m-moka', '--m-filter', '--m-immersion', '--m-kopi'].map((c) => <span key={c} className="flex-1" style={{ background: `rgb(var(${c}))` }} />)}
                      </em>
                    </span>
                    <b className="text-[14px]">{t.name}</b>
                    <small className="text-[12px] text-mute">{t.note}</small>
                  </button>
                );
              })}
            </div>)}

          {section('Your data', 'Stored on this device. Back it up before you change phones.',
            <div className="mt-3 flex flex-col gap-3">
              <div className="flex flex-wrap gap-2.5">
                <Btn size="md" onClick={exportData}>Copy backup</Btn>
                <Btn size="md" onClick={importData} disabled={!importText.trim()}>Restore from pasted backup</Btn>
                <Btn size="md" onClick={onOpenSetup}>Customise setup & tools</Btn>
              </div>
              <textarea value={importText} onChange={(e) => setImportText(e.target.value)} rows={3} placeholder="Paste a CoffeeWorks backup here to restore it" className="w-full border border-ink p-3 text-[13px] bg-paper" aria-label="Backup text" />
              {status && <p role="status" className="text-[14px] font-semibold">{status}</p>}
              <div className="border-t border-rule pt-3">
                {!confirmReset ? (
                  <Btn size="md" variant="ghost" className="!px-0 text-bad" onClick={() => setConfirmReset(true)}>Reset recipes, beans, gear and history…</Btn>
                ) : (
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-[14px]">This replaces all your recipes, beans, gear, water and history with the starter set. It can’t be undone.</span>
                    <Btn size="md" onClick={() => setConfirmReset(false)}>Keep my data</Btn>
                    <Btn size="md" className="!bg-bad !border-bad text-[#fff]" onClick={() => { resetToDefaults(); setConfirmReset(false); flash('Starter data restored.'); }}>Reset everything</Btn>
                  </div>
                )}
              </div>
            </div>)}
        </div>

        <aside className={`${wide ? 'border-l' : 'border-t'} border-rule px-5 py-4 flex flex-col gap-3`}>
          <Caps>Live preview · mid-brew</Caps>
          {preview}
          <div><InfoTip title="Units and your recipes" label={<span className="text-[13px] font-semibold">Saved as soon as you tap</span>}>Recipes keep their real values; only how they’re shown changes, so switching units never rounds your recipes.</InfoTip></div>
          <div className="border-t border-ink pt-3 mt-1">
            <Caps className="mb-2">Screen layout</Caps>
            <Segmented label="Screen layout" value={settings.layout} onChange={setLayout} className="w-full"
              options={[{ value: 'auto', label: 'Follow tilt' }, { value: 'simple', label: 'Keep simple' }, { value: 'full', label: 'Keep full' }]} />
            <div className="mt-1.5"><InfoTip title={settings.layout === 'auto' ? 'Follow tilt' : settings.layout === 'simple' ? 'Keep simple' : 'Keep full'} label={<span className="text-[13px] font-semibold">What this does</span>}>{LAYOUT_NOTE[settings.layout]}</InfoTip></div>
          </div>
        </aside>
      </div>
    </div>
  );
};
