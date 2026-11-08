import { cn } from '@/utils/cn';

/**
 * columns: [{ key, header, render?: (row) => node, primary?: boolean }]
 * A `primary` column (e.g. a title) is shown unlabelled and full width when rows stack.
 * On screens under 720px each row becomes a labelled stack instead of a squeezed table.
 */
export default function Table({ columns, rows, rowKey = 'id', onRowClick, caption, emptyState }) {
  if (rows.length === 0 && emptyState) return emptyState;

  return (
    <div className="table-wrap">
      <table className="table table--stack">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr>
            {columns.map((col) => <th key={col.key} scope="col">{col.header}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row[rowKey]}
              className={cn(onRowClick && 'is-clickable')}
              tabIndex={onRowClick ? 0 : undefined}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              onKeyDown={onRowClick ? (event) => { if (event.key === 'Enter') onRowClick(row); } : undefined}
            >
              {columns.map((col) => (
                <td key={col.key} data-label={col.header} className={col.primary ? 'table__cell--primary' : undefined}>{col.render ? col.render(row) : row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
