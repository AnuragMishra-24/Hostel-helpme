import { useEffect, useRef } from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * While `active`: moves focus into `ref`, keeps Tab inside it, calls `onEscape`
 * on Escape, and restores focus to the previously focused element on cleanup.
 */
export function useFocusTrap(ref, active, onEscape) {
  const escapeRef = useRef(onEscape);
  escapeRef.current = onEscape;

  useEffect(() => {
    const node = ref.current;
    if (!active || !node) return undefined;

    const previouslyFocused = document.activeElement;
    const getFocusable = () =>
      Array.from(node.querySelectorAll(FOCUSABLE)).filter((el) => el.getClientRects().length > 0);

    (getFocusable()[0] ?? node).focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape' && escapeRef.current) {
        event.stopPropagation();
        escapeRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = getFocusable();
      if (items.length === 0) {
        event.preventDefault();
        node.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    node.addEventListener('keydown', onKeyDown);
    return () => {
      node.removeEventListener('keydown', onKeyDown);
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') previouslyFocused.focus();
    };
  }, [active, ref]);
}
