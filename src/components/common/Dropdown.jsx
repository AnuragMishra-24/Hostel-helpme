import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

/**
 * Menu button.
 *  renderTrigger(triggerProps) must spread triggerProps onto a <button>.
 *  items: { type?: 'header'|'separator', content?, label, icon, to, onSelect, tone: 'danger' }
 */
export default function Dropdown({ renderTrigger, items, align = 'end' }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  useEffect(() => {
    if (open) menuRef.current?.querySelector('[role="menuitem"]')?.focus();
  }, [open]);

  const getItems = () => Array.from(menuRef.current?.querySelectorAll('[role="menuitem"]') ?? []);

  const onMenuKeyDown = (event) => {
    const els = getItems();
    const index = els.indexOf(document.activeElement);
    if (event.key === 'ArrowDown') { event.preventDefault(); els[(index + 1) % els.length]?.focus(); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); els[(index - 1 + els.length) % els.length]?.focus(); }
    else if (event.key === 'Home') { event.preventDefault(); els[0]?.focus(); }
    else if (event.key === 'End') { event.preventDefault(); els[els.length - 1]?.focus(); }
    else if (event.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); }
    else if (event.key === 'Tab') setOpen(false);
  };

  const select = (item) => {
    setOpen(false);
    item.onSelect?.();
  };

  return (
    <div className="dropdown" ref={rootRef}>
      {renderTrigger({
        ref: triggerRef,
        onClick: () => setOpen((value) => !value),
        'aria-haspopup': 'menu',
        'aria-expanded': open,
      })}
      {open && (
        <div className={cn('dropdown__menu', `dropdown__menu--${align}`)} role="menu" ref={menuRef} onKeyDown={onMenuKeyDown}>
          {items.map((item, index) => {
            if (item.type === 'separator') return <div key={`sep-${index}`} className="dropdown__separator" role="separator" />;
            if (item.type === 'header') return <div key={`hdr-${index}`} className="dropdown__header">{item.content}</div>;
            const Icon = item.icon;
            const className = cn('dropdown__item', item.tone === 'danger' && 'dropdown__item--danger');
            const content = (<>{Icon && <Icon size={16} aria-hidden="true" />}{item.label}</>);
            return item.to ? (
              <Link key={item.label} to={item.to} role="menuitem" className={className} onClick={() => select(item)}>{content}</Link>
            ) : (
              <button key={item.label} type="button" role="menuitem" className={className} onClick={() => select(item)}>{content}</button>
            );
          })}
        </div>
      )}
    </div>
  );
}
