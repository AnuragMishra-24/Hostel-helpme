import { Sparkles } from 'lucide-react';
import Badge from '@/components/common/Badge';
import PriorityBadge from '@/components/common/PriorityBadge';
import Card, { CardHeader } from '@/components/common/Card';
import { COMPLAINT_CATEGORIES } from '@/constants/complaints';
import { labelFor } from '@/utils/format';

/**
 * Displays the backend's AI-generated suggestions. They are advisory — the warden decides —
 * so every label says "suggested". `ai` may be null while analysis is still pending.
 */
export default function AiSuggestionPanel({ ai }) {
  return (
    <Card>
      <CardHeader
        title={<span className="ai-title"><Sparkles size={16} aria-hidden="true" /> AI suggestions</span>}
        description="These help the warden sort complaints. The warden makes the final decision."
      />
      {!ai ? (
        <p className="text-secondary">Analysis is in progress. Suggestions will appear here once ready.</p>
      ) : (
        <dl className="dl">
          <div className="dl__row"><dt>Suggested category</dt><dd><Badge variant="primary">{labelFor(COMPLAINT_CATEGORIES, ai.suggestedCategory)}</Badge></dd></div>
          <div className="dl__row"><dt>Suggested priority</dt><dd><PriorityBadge priority={ai.suggestedPriority} /></dd></div>
          <div className="dl__row dl__row--block"><dt>Reason</dt><dd>{ai.priorityReason}</dd></div>
          <div className="dl__row dl__row--block"><dt>Summary</dt><dd>{ai.simplifiedDescription}</dd></div>
        </dl>
      )}
    </Card>
  );
}
