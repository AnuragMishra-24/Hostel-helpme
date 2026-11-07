import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';

/** Stand-in for modules that are built in later phases. */
export default function PlaceholderPage({ title, description, icon }) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <EmptyState
        bordered
        icon={icon}
        title={`${title} is not available yet`}
        description="This section is part of an upcoming release."
      />
    </>
  );
}
