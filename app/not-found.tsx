export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-10 max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-gray-950 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-950 mb-4">
          Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          This markdown file doesn't exist or has expired.
          <br />
          <span className="text-sm text-gray-500">Links expire after 30 days.</span>
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-gray-950 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
        >
          Share New Markdown
        </a>
      </div>
    </div>
  );
}

