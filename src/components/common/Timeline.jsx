import { Check } from 'lucide-react';
import { formatDateTime } from '@/utils/format';
import { cn } from '@/utils/cn';

/**
 * Vertical history. items: [{ id, title, description?, actor?, at?, state: 'done' | 'current' | 'upcoming' }]
 * Upcoming steps have no date and are muted. Each item is a list entry, so screen readers announce position.
 */
export default function Timeline({ items, label }) {
  return (
    <ol className="timeline" aria-label={label}>
      {items.map((item) => (
        <li key={item.id} className={cn('timeline__item', `timeline__item--${item.state}`)} aria-current={item.state === 'current' ? 'step' : undefined}>
          <span className="timeline__marker" aria-hidden="true">
            {item.state === 'done' && <Check size={12} />}
          </span>
          <div className="timeline__content">
            <p className="timeline__title">
              {item.title}
              {item.state === 'upcoming' && <span className="sr-only"> (upcoming)</span>}
            </p>
            {item.description && <p className="timeline__description">{item.description}</p>}
            {(item.at || item.actor) && (
              <p className="timeline__meta">
                {item.at && <time dateTime={item.at}>{formatDateTime(item.at)}</time>}
                {item.at && item.actor && ' · '}
                {item.actor}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
