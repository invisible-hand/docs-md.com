'use client';

import CopyButton from './CopyButton';

interface ShareActionsProps {
  content: string;
}

export default function ShareActions({ content }: ShareActionsProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handlePrint}
        className="px-4 py-2 text-sm text-gray-700 hover:text-gray-950 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        Export PDF
      </button>
      <CopyButton content={content} />
    </div>
  );
}

