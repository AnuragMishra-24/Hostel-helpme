import Modal from './Modal';
import Button from './Button';

/** For important or destructive actions. tone: 'danger' | 'primary' */
export default function ConfirmationModal({
  open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', tone = 'danger', loading = false, onConfirm, onCancel,
}) {
  return (
    <Modal
      open={open}
      onClose={loading ? () => {} : onCancel}
      dismissible={!loading}
      size="sm"
      title={title}
      description={message}
      footer={(
        <>
          <Button variant="secondary" onClick={onCancel} disabled={loading}>{cancelLabel}</Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
        </>
      )}
    />
  );
}
