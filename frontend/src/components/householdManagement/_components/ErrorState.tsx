import React from 'react';

interface ErrorStateProps {
  error: any;
  onRetry?: () => void;
  onBack?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry, onBack }) => {
  const getErrorMessage = () => {
    if (!error) return 'Unable to load data.';
    
    if (error?.message?.includes('404') || error?.message?.includes('not found')) {
      return 'The requested resource was not found.';
    }
    
    if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
      return 'Unable to connect to server. Please check your connection.';
    }
    
    if (error?.message?.includes('Invalid') || error?.message?.includes('invalid')) {
      return error.message;
    }
    
    return 'An error occurred while loading data.';
  };

  const isNotFound = error?.message?.includes('404') || error?.message?.includes('not found');

  return (
    <main className="p-6 bg-gray-50 min-h-screen flex justify-center items-center">
      <div className="text-center max-w-md">
        <div className="mb-6">
          {isNotFound ? (
            <>
              <h1 className="text-6xl font-bold text-gray-400 mb-2">404</h1>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Not Found</h2>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Error</h2>
            </>
          )}
          <p className="text-gray-600 mb-6">{getErrorMessage()}</p>
        </div>
        <div className="space-y-3">
          {onBack && (
            <button
              onClick={onBack}
              className="w-full px-6 py-3 bg-smblue-400 text-white rounded-lg hover:bg-smblue-300 transition-colors"
            >
              Go Back
            </button>
          )}
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default ErrorState;