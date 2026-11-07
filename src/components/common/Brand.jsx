import { Building2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function Brand({ subtitle, inverse = false }) {
  return (
    <div className={cn('brand', inverse && 'brand--inverse')}>
      <span className="brand__mark" aria-hidden="true"><Building2 size={18} /></span>
      <span className="brand__text">
        <span className="brand__name">Hostel HelpMe</span>
        {subtitle && <span className="brand__subtitle">{subtitle}</span>}
      </span>
    </div>
  );
}
