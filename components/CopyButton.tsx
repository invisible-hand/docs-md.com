'use client';

import { useState } from 'react';

interface CopyButtonProps {
  content: string;
  /** Button text for translated pages; English by default. */
  labels?: { copy: string; copied: string };
}

export default function CopyButton({ content, labels = { copy: 'Copy', copied: '✓ Copied' } }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="px-4 py-2 text-sm bg-gray-950 text-white rounded-lg hover:bg-gray-800 transition-colors"
    >
      {copied ? labels.copied : labels.copy}
    </button>
  );
}

