interface UpdatedLineProps {
  date: string; // YYYY-MM-DD
  className?: string;
  /** Translated pages pass their own word and date locale. */
  label?: string;
  locale?: string;
}

/** Visible last-updated line; pair with `dateModified` in the page's JSON-LD. */
export default function UpdatedLine({
  date,
  className = 'mt-2 text-sm text-gray-500',
  label = 'Updated',
  locale = 'en-US',
}: UpdatedLineProps) {
  return (
    <p className={className}>
      {label}{' '}
      <time dateTime={date}>
        {new Date(`${date}T00:00:00Z`).toLocaleDateString(locale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'UTC',
        })}
      </time>
    </p>
  );
}
