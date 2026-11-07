import { cn } from '@/utils/cn';

/**
 * variant: primary | secondary | ghost | danger   size: md | sm
 * Use `as={Link} to="..."` to render a router link styled as a button.
 */
export default function Button({
  as: Tag = 'button', variant = 'primary', size = 'md', block = false, icon = false,
  loading = false, leftIcon: LeftIcon, className, children, disabled, type, ...rest
}) {
  const isButton = Tag === 'button';
  const isDisabled = disabled || loading;
  return (
    <Tag
      className={cn('btn', `btn--${variant}`, size === 'sm' && 'btn--sm', block && 'btn--block', icon && 'btn--icon', className)}
      {...(isButton ? { type: type ?? 'button', disabled: isDisabled } : { 'aria-disabled': isDisabled || undefined })}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <span className="spinner" aria-hidden="true" /> : LeftIcon && <LeftIcon size={16} aria-hidden="true" />}
      {children}
    </Tag>
  );
}
