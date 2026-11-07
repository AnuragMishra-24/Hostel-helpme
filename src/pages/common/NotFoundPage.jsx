import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import EmptyState from '@/components/common/EmptyState';
import Button from '@/components/common/Button';

export default function NotFoundPage({ homePath = '/login', standalone = false }) {
  const state = (
    <EmptyState
      icon={Compass}
      title="Page not found"
      description="The page you are looking for does not exist or has moved."
      action={<Button as={Link} to={homePath}>{standalone ? 'Go to sign in' : 'Go to dashboard'}</Button>}
    />
  );
  return standalone ? <div className="standalone">{state}</div> : state;
}
