import { ShieldCheck } from 'lucide-react';
import AsyncBoundary from '@/components/common/AsyncBoundary';
import Badge from '@/components/common/Badge';
import Card from '@/components/common/Card';
import EmptyState from '@/components/common/EmptyState';
import PageHeader from '@/components/common/PageHeader';
import { useAsync } from '@/hooks/useAsync';
import { ruleService } from '@/services/ruleService';
import { formatDate } from '@/utils/format';

export default function RulesPage() {
  const state = useAsync(() => ruleService.getRules(), []);

  return (
    <>
      <PageHeader title="Hostel rules" description="Official rules and guidelines for residents." />
      <div className="stack" style={{ '--stack-gap': 'var(--space-5)' }}>
        <AsyncBoundary state={state} loadingLabel="Loading rules…" errorTitle="Unable to load the rules">
          {(data) => (data.sections.length === 0 ? (
            <EmptyState bordered title="No rules published yet" description="The hostel rules will appear here once published." />
          ) : (
            <>
              <p className="text-secondary">Last updated {formatDate(data.updatedAt)}.</p>
              {data.sections.map((section) => (
                <Card key={section.id} as="section" aria-labelledby={`rules-${section.id}`} className="rules">
                  <h2 className="card__title" id={`rules-${section.id}`}>{section.title}</h2>
                  <ol className="rules__list">{section.rules.map((rule) => <li key={rule}>{rule}</li>)}</ol>
                </Card>
              ))}
            </>
          ))}
        </AsyncBoundary>
        <Card as="section" aria-labelledby="rules-anti-ragging">
          <div className="card__header">
            <div>
              <h2 className="card__title" id="rules-anti-ragging">Anti-ragging</h2>
              <p className="card__description">Information and reporting will be available here.</p>
            </div>
            <Badge variant="primary"><ShieldCheck size={12} aria-hidden="true" /> Coming soon</Badge>
          </div>
        </Card>
      </div>
    </>
  );
}
