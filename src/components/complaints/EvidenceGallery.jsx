import { FileImage, FileVideo } from 'lucide-react';
import { formatFileSize } from '@/utils/format';

/** Read-only list of evidence already attached to a complaint (metadata from the API). */
export default function EvidenceGallery({ evidence }) {
  if (evidence.length === 0) return <p className="text-secondary">No evidence was attached.</p>;
  return (
    <ul className="evidence">
      {evidence.map((file) => {
        const Icon = file.type.startsWith('video/') ? FileVideo : FileImage;
        return (
          <li className="evidence__item" key={file.id}>
            <span className="evidence__thumb">
              {file.url ? <img src={file.url} alt={`Evidence: ${file.name}`} /> : <Icon size={24} aria-hidden="true" />}
            </span>
            <span className="evidence__name">{file.name}</span>
            <span className="evidence__size">{formatFileSize(file.size)}</span>
          </li>
        );
      })}
    </ul>
  );
}
