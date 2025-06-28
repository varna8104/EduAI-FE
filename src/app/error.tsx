'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Oops!</h1>
          <h2 className="text-xl font-semibold text-gray-600 mb-4">Something went wrong</h2>
          <p className="text-gray-500 mb-8">
            We encountered an unexpected error. Don&apos;t worry, we&apos;re working to fix it!
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => reset()}
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Try Again
          </button>
          
          <div className="mt-4">
            <Link 
              href="/"
              className="text-red-600 hover:text-red-800 underline"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left">
            <h3 className="font-semibold text-sm text-gray-700 mb-2">Error Details (Development):</h3>
            <pre className="text-xs text-gray-600 whitespace-pre-wrap break-words">
              {error.message}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
