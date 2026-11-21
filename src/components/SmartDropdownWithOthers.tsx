import React, { useState, useEffect, useId } from 'react';
import { Check, ChevronDown, Pencil, X } from 'lucide-react';
import { useCoffee } from '../context/CoffeeContext';

export interface DropdownOption {
  value: string;
  label: string;
  group?: string;
}

interface Props {
  id?: string;
  label?: string;
  value: string;
  onChange: (newValue: string) => void;
  options: DropdownOption[];
  customVariableGroup: string; // e.g. "machines", "grinders", "baskets", "papers", "waters"
  placeholder?: string;
  className?: string;
  allowNA?: boolean; // defaults to true
  naLabel?: string; // custom label for N/A option
}

export const SmartDropdownWithOthers: React.FC<Props> = ({
  id,
  label,
  value,
  onChange,
  options,
  customVariableGroup,
  placeholder = 'Select option...',
  className = '',
  allowNA = true,
  naLabel,
}) => {
  const { customVariables, addCustomVariable } = useCoffee();
  const autoId = useId();
  const [isEditingCustom, setIsEditingCustom] = useState<boolean>(false);
  const [customInputText, setCustomInputText] = useState<string>('');

  const savedCustoms: string[] = customVariables[customVariableGroup] || [];

  // Check if current value matches N/A or one of the standard options
  const isNA = value === 'N/A' || value === 'None' || value === 'none';
  const isPresetValue = isNA || options.some(opt => opt.value === value);
  const isCustomValue = !isNA && savedCustoms.includes(value);

  useEffect(() => {
    // If current value is not in presets, not N/A, and is not empty, it's a custom value
    if (value && !isPresetValue && !isNA) {
      setCustomInputText(value);
    }
  }, [value, isPresetValue, isNA]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected === '__others__') {
      setCustomInputText(isNA ? '' : (value || ''));
      setIsEditingCustom(true);
    } else {
      setIsEditingCustom(false);
      onChange(selected);
    }
  };

  const handleSaveCustom = () => {
    const trimmed = customInputText.trim();
    if (!trimmed) return;
    addCustomVariable(customVariableGroup, trimmed);
    onChange(trimmed);
    setIsEditingCustom(false);
  };

  const handleCancelCustom = () => {
    setIsEditingCustom(false);
    if (!value) {
      onChange(options[0]?.value || '');
    }
  };

  // Group options by their group tag
  const groupedOptions: Record<string, DropdownOption[]> = {};
  options.forEach(opt => {
    const groupName = opt.group || 'Standard';
    if (!groupedOptions[groupName]) groupedOptions[groupName] = [];
    groupedOptions[groupName].push(opt);
  });

  const labelText = (label || '').replace(/:\s*$/, '');
  const fieldId = id || autoId;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {labelText && (
        <label htmlFor={fieldId} className="label-caps block">
          {labelText}
        </label>
      )}

      {isEditingCustom ? (
        <div className="space-y-1.5">
          <div className="flex items-stretch gap-2">
            <input
              type="text"
              autoFocus
              id={fieldId}
              placeholder="Type a brand or your own label"
              value={customInputText}
              onChange={e => setCustomInputText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSaveCustom();
                } else if (e.key === 'Escape') {
                  handleCancelCustom();
                }
              }}
              className="flex-1 min-w-0 h-12 bg-paper border-2 border-ink px-3 text-[15px] font-semibold text-ink"
            />
            <button
              type="button"
              onClick={handleSaveCustom}
              disabled={!customInputText.trim()}
              className="w-12 h-12 shrink-0 flex items-center justify-center bg-ink text-paper border border-ink disabled:opacity-40"
              aria-label="Save custom label"
            >
              <Check className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleCancelCustom}
              className="w-12 h-12 shrink-0 flex items-center justify-center bg-paper text-ink border border-ink"
              aria-label="Cancel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[12.5px] text-mute">Type a brand or tool that isn’t listed, then save. It’s kept for next time.</p>
        </div>
      ) : (
        <div className="flex items-stretch gap-2">
          <div className="relative flex-1 min-w-0">
            <select
              id={fieldId}
              value={isNA ? 'N/A' : value}
              onChange={handleSelectChange}
              className={`w-full h-12 appearance-none bg-paper border border-ink pl-3 pr-10 text-[15px] font-semibold truncate ${isNA ? 'text-mute' : 'text-ink'}`}
            >
              <option value="" disabled>
                {placeholder}
              </option>

              {/* Universal N/A Option when user is not using this tool */}
              {allowNA && (
                <option value="N/A">
                  {naLabel || 'N/A (Not using this tool / None)'}
                </option>
              )}

              {/* User's Previously Saved Custom Values */}
              {savedCustoms.length > 0 && (
                <optgroup label="Your own labels">
                  {savedCustoms.filter(cust => cust !== 'N/A').map(cust => (
                    <option key={`custom-${cust}`} value={cust}>
                      {cust}
                    </option>
                  ))}
                </optgroup>
              )}

              {/* Grouped Standard Presets */}
              {Object.entries(groupedOptions).map(([groupName, groupList]) => (
                <optgroup key={groupName} label={groupName}>
                  {groupList.filter(opt => opt.value !== 'N/A').map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </optgroup>
              ))}

              {/* The Universal 'Others...' Entry */}
              <optgroup label="Not listed">
                <option value="__others__">Others… type a brand or label</option>
              </optgroup>
            </select>
            <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink" aria-hidden />
          </div>
          <button
            type="button"
            onClick={() => {
              setCustomInputText(isNA ? '' : (value || ''));
              setIsEditingCustom(true);
            }}
            className="w-12 h-12 shrink-0 flex items-center justify-center bg-paper text-ink border border-ink"
            aria-label={labelText ? `Type your own ${labelText.toLowerCase()}` : 'Type your own label'}
          >
            <Pencil className="w-[18px] h-[18px]" />
          </button>
        </div>
      )}
    </div>
  );
};
