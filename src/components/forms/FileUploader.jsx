import { useEffect, useId, useRef, useState } from 'react';
import { FileImage, FileVideo, Upload, X } from 'lucide-react';
import Button from '@/components/common/Button';
import { formatFileSize } from '@/utils/format';
import { cn } from '@/utils/cn';

let counter = 0;

/**
 * Reusable evidence picker. It only selects, validates and previews files — it never uploads.
 * The owning page uploads `value` through a service, passing per-file progress back in via `progress`.
 *
 *  value:    [{ id, file, previewUrl }]       onChange(nextValue)
 *  types:    { 'image/png': 'PNG', … }        maxSizeMB, maxFiles
 *  progress: { [id]: 0–100 }                  error: message from the parent (e.g. a failed upload)
 */
export default function FileUploader({
  label, hint, types, maxSizeMB, maxFiles, value, onChange, progress = {}, error, disabled = false,
}) {
  const inputId = useId();
  const messageId = useId();
  const [rejections, setRejections] = useState([]);
  const [dragging, setDragging] = useState(false);
  const latest = useRef(value);
  latest.current = value;

  // Release preview URLs when the uploader goes away.
  useEffect(() => () => latest.current.forEach((item) => item.previewUrl && URL.revokeObjectURL(item.previewUrl)), []);

  const acceptedList = Object.keys(types);
  const typeNames = Object.values(types).join(', ');

  const addFiles = (fileList) => {
    const accepted = [];
    const problems = [];
    let slots = maxFiles - value.length;
    Array.from(fileList).forEach((file) => {
      if (!acceptedList.includes(file.type)) problems.push(`${file.name}: unsupported file type. Use ${typeNames}.`);
      else if (file.size > maxSizeMB * 1024 * 1024) problems.push(`${file.name}: larger than ${maxSizeMB} MB.`);
      else if (slots <= 0) problems.push(`${file.name}: you can attach up to ${maxFiles} files.`);
      else {
        slots -= 1;
        counter += 1;
        accepted.push({ id: `file-${counter}`, file, previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null });
      }
    });
    setRejections(problems);
    if (accepted.length) onChange([...value, ...accepted]);
  };

  const remove = (item) => {
    if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    setRejections([]);
    onChange(value.filter((entry) => entry.id !== item.id));
  };

  const full = value.length >= maxFiles;
  const messages = [...rejections, ...(error ? [error] : [])];

  return (
    <div className="field">
      <span className="field__label" id={`${inputId}-label`}>{label}</span>

      <div
        className={cn('uploader', dragging && 'is-dragging', (disabled || full) && 'is-disabled')}
        onDragOver={(event) => { event.preventDefault(); if (!disabled && !full) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => { event.preventDefault(); setDragging(false); if (!disabled && !full) addFiles(event.dataTransfer.files); }}
      >
        <input
          id={inputId}
          className="uploader__input sr-only"
          type="file"
          multiple
          accept={acceptedList.join(',')}
          disabled={disabled || full}
          aria-labelledby={`${inputId}-label`}
          aria-describedby={messages.length ? messageId : undefined}
          onChange={(event) => { addFiles(event.target.files); event.target.value = ''; }}
        />
        <label htmlFor={inputId} className="uploader__drop">
          <Upload size={20} aria-hidden="true" />
          <span className="uploader__prompt"><strong>Choose files</strong><span className="uploader__drag-text"> or drag and drop</span></span>
          <span className="uploader__hint">{hint ?? `${typeNames} · up to ${maxFiles} files · ${maxSizeMB} MB each`}</span>
        </label>
      </div>

      {messages.length > 0 && (
        <ul className="uploader__errors field__error" id={messageId} role="alert">
          {messages.map((message) => <li key={message}>{message}</li>)}
        </ul>
      )}

      {value.length > 0 && (
        <ul className="uploader__list" aria-label="Selected files">
          {value.map((item) => {
            const percent = progress[item.id];
            const Icon = item.file.type.startsWith('video/') ? FileVideo : FileImage;
            return (
              <li className="uploader__item" key={item.id}>
                <span className="uploader__thumb" aria-hidden="true">
                  {item.previewUrl ? <img src={item.previewUrl} alt="" /> : <Icon size={20} />}
                </span>
                <div className="uploader__meta">
                  <p className="uploader__name">{item.file.name}</p>
                  <p className="uploader__sub">{types[item.file.type]} · {formatFileSize(item.file.size)}</p>
                  {percent !== undefined && (
                    <div className="progress" role="progressbar" aria-label={`Uploading ${item.file.name}`} aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
                      <span style={{ width: `${percent}%` }} />
                    </div>
                  )}
                </div>
                <Button variant="ghost" size="sm" icon onClick={() => remove(item)} disabled={disabled} aria-label={`Remove ${item.file.name}`}>
                  <X size={16} aria-hidden="true" />
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
