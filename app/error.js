'use client';

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-3xl font-display font-bold mb-4">Something Went Wrong</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          An unexpected error occurred. Please try reloading the page.
        </p>
        <div className="space-x-4">
          <button onClick={reset} className="btn-primary">
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="btn-outline"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
}
