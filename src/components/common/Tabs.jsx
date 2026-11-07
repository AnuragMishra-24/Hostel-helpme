import { useRef } from 'react';

/**
 * Accessible tab list (roving tabindex, arrow-key navigation).
 * tabs: [{ value, label }]. Render the panel yourself with
 *   role="tabpanel" id={`${idPrefix}-panel-${value}`} aria-labelledby={`${idPrefix}-tab-${value}`}
 */
export default function Tabs({ tabs, value, onChange, label, idPrefix = 'tabs' }) {
  const refs = useRef([]);

  const onKeyDown = (event, index) => {
    const lastIndex = tabs.length - 1;
    let next = null;
    if (event.key === 'ArrowRight') next = index === lastIndex ? 0 : index + 1;
    if (event.key === 'ArrowLeft') next = index === 0 ? lastIndex : index - 1;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = lastIndex;
    if (next === null) return;
    event.preventDefault();
    onChange(tabs[next].value);
    refs.current[next]?.focus();
  };

  return (
    <div className="tabs" role="tablist" aria-label={label}>
      {tabs.map((tab, index) => {
        const selected = tab.value === value;
        return (
          <button
            key={tab.value}
            ref={(el) => { refs.current[index] = el; }}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${tab.value}`}
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel-${tab.value}`}
            tabIndex={selected ? 0 : -1}
            className="tab"
            onClick={() => onChange(tab.value)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
