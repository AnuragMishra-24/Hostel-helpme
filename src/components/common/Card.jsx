import { cn } from '@/utils/cn';

export default function Card({ as: Tag = 'section', padded = true, interactive = false, className, children, ...rest }) {
  return (
    <Tag className={cn('card', padded && 'card--padded', interactive && 'card--interactive', className)} {...rest}>
      {children}
    </Tag>
  );
}

export function CardHeader({ title, description, actions }) {
  return (
    <div className="card__header">
      <div>
        <h2 className="card__title">{title}</h2>
        {description && <p className="card__description">{description}</p>}
      </div>
      {actions && <div className="row">{actions}</div>}
    </div>
  );
}
