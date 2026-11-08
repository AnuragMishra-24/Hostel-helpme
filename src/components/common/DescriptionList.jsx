/** Label/value pairs. items: [{ label, value, block? }] — empty values show "—"; `block` stacks long text under its label. */
export default function DescriptionList({ items }) {
  return (
    <dl className="dl">
      {items.map(({ label, value, block }) => (
        <div className={block ? 'dl__row dl__row--block' : 'dl__row'} key={label}>
          <dt>{label}</dt>
          <dd>{value || value === 0 ? value : '—'}</dd>
        </div>
      ))}
    </dl>
  );
}
