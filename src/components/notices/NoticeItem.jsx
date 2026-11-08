import Badge from '@/components/common/Badge';
import { formatDate } from '@/utils/format';

/** One notice. `compact` hides the body (used on the dashboard). */
export default function NoticeItem({ notice, compact = false }) {
  const scope = notice.scope === 'block' ? `Block ${notice.block}` : 'Hostel-wide';
  return (
    <article className="notice">
      <div className="notice__head">
        <h3 className="notice__title">{notice.title}</h3>
        {notice.important && <Badge variant="warning">Important</Badge>}
      </div>
      <p className="notice__meta">
        <time dateTime={notice.publishedAt}>{formatDate(notice.publishedAt)}</time> · {scope}
      </p>
      {!compact && <p className="notice__content">{notice.content}</p>}
    </article>
  );
}
