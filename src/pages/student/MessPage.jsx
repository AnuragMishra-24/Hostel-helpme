import { useState } from 'react';
import { Utensils } from 'lucide-react';
import AsyncBoundary from '@/components/common/AsyncBoundary';
import Alert from '@/components/common/Alert';
import Card from '@/components/common/Card';
import EmptyState from '@/components/common/EmptyState';
import PageHeader from '@/components/common/PageHeader';
import Tabs from '@/components/common/Tabs';
import { useAsync } from '@/hooks/useAsync';
import { messService } from '@/services/messService';
import { MEALS, WEEKDAYS } from '@/constants/hostel';
import { formatDate } from '@/utils/format';

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);
const todayKey = () => WEEKDAYS[(new Date().getDay() + 6) % 7]; // JS Sunday = 0

export default function MessPage() {
  const state = useAsync(() => messService.getMenu(), []);
  const [selected, setSelected] = useState(todayKey);
  const today = todayKey();

  return (
    <>
      <PageHeader title="Mess" description="Weekly menu and meal timings." />
      <AsyncBoundary state={state} loadingLabel="Loading menu…" errorTitle="Unable to load the mess menu">
        {(menu) => {
          if (!menu || menu.days.length === 0) {
            return <EmptyState bordered icon={Utensils} title="Menu not available yet" description="The mess menu will appear here once it has been published." />;
          }
          const day = menu.days.find((entry) => entry.day === selected) ?? menu.days[0];
          const tabs = menu.days.map((entry) => ({ value: entry.day, label: entry.day === today ? `${capitalize(entry.day)} · Today` : capitalize(entry.day) }));
          return (
            <div className="stack">
              <p className="text-secondary">Menu effective from {formatDate(menu.effectiveFrom)}.</p>
              <Tabs tabs={tabs} value={day.day} onChange={setSelected} label="Day of the week" idPrefix="mess" />
              <div role="tabpanel" id={`mess-panel-${day.day}`} aria-labelledby={`mess-tab-${day.day}`} className="meal-grid">
                {MEALS.map(({ key, label }) => (
                  <Card key={key} as="article" aria-label={`${label} on ${capitalize(day.day)}`}>
                    <h2 className="card__title">{label}</h2>
                    <p className="meal__time">{menu.timings[key]}</p>
                    <ul className="meal__items">{day.meals[key].map((item) => <li key={item}>{item}</li>)}</ul>
                  </Card>
                ))}
              </div>
              {menu.notes && <Alert variant="info">{menu.notes}</Alert>}
            </div>
          );
        }}
      </AsyncBoundary>
    </>
  );
}
