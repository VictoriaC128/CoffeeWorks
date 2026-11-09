import React, { useState, useEffect } from 'react';
import { Plus, Check, Edit3, X } from 'lucide-react';
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
}) => {
  const { customVariables, addCustomVariable } = useCoffee();
  const [isEditingCustom, setIsEditingCustom] = useState<boolean>(false);
  const [customInputText, setCustomInputText] = useState<string>('');

  const savedCustoms: string[] = customVariables[customVariableGroup] || [];

  // Check if current value matches one of the standard options
  const isPresetValue = options.some(opt => opt.value === value);
  const isCustomValue = savedCustoms.includes(value);

  useEffect(() => {
    // If current value is not in presets and is not empty, it's a custom value
    if (value && !isPresetValue) {
      setCustomInputText(value);
    }
  }, [value, isPresetValue]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected === '__others__') {
      setCustomInputText(value || '');
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

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Header with Label and always visible 'Edit labels' button */}
      <div className="flex items-center justify-between text-xs font-mono text-stone-300">
        <span>{label || ''}</span>
        {!isEditingCustom && (
          <button
            type="button"
            onClick={() => {
              setCustomInputText(value || '');
              setIsEditingCustom(true);
            }}
            className="text-[11px] text-amber-400 hover:text-amber-300 font-mono font-medium flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all shadow-sm"
            title="Edit label or key in minority brand name"
          >
            <Edit3 className="w-3 h-3 text-amber-400" />
            <span>Edit labels</span>
          </button>
        )}
      </div>

      {isEditingCustom ? (
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5">
            <input
              type="text"
              autoFocus
              id={id}
              placeholder="Key in minority brand or custom label..."
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
              className="flex-1 bg-stone-950 border border-amber-500 rounded-xl px-3 py-2 text-xs text-amber-300 font-medium focus:outline-none placeholder-stone-600 shadow-md shadow-amber-950/30"
            />
            <button
              type="button"
              onClick={handleSaveCustom}
              disabled={!customInputText.trim()}
              className="p-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl transition-colors shadow-md"
              title="Save custom label"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleCancelCustom}
              className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white rounded-xl transition-colors"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 px-1">
            <span>Type minority brand or custom tool label and press Save</span>
            <span>Esc to cancel</span>
          </div>
        </div>
      ) : (
        <select
          id={id}
          value={!isPresetValue && value ? value : value}
          onChange={handleSelectChange}
          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {/* User's Previously Saved Custom Values */}
          {savedCustoms.length > 0 && (
            <optgroup label="⭐ Your Custom & Minority Brands">
              {savedCustoms.map(cust => (
                <option key={`custom-${cust}`} value={cust}>
                  {cust}
                </option>
              ))}
            </optgroup>
          )}

          {/* Grouped Standard Presets */}
          {Object.entries(groupedOptions).map(([groupName, groupList]) => (
            <optgroup key={groupName} label={groupName}>
              {groupList.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </optgroup>
          ))}

          {/* The Universal 'Others...' Entry */}
          <optgroup label="➕ Custom & Minority Brands">
            <option value="__others__">
              ✏️ Edit labels / Key in custom minority brand...
            </option>
          </optgroup>
        </select>
      )}
    </div>
  );
};
