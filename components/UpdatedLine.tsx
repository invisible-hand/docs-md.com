interface UpdatedLineProps {
  date: string; // YYYY-MM-DD
  className?: string;
}

/** Visible last-updated line; pair with `dateModified` in the page's JSON-LD. */
export default function UpdatedLine({ date, className = 'mt-2 text-sm text-gray-500' }: UpdatedLineProps) {
  return (
    <p className={className}>
      Updated{' '}
      <time dateTime={date}>
        {new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'UTC',
        })}
      </time>
    </p>
  );
}
