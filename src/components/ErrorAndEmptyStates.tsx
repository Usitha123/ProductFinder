import React from 'react';
import { Search, AlertCircle, RefreshCw, Globe, ArrowLeft, Sparkles, Building2 } from 'lucide-react';
import { LocationOption } from '../types';

interface NoResultsStateProps {
  query: string;
  location: LocationOption;
  onModifyLocation: (loc: LocationOption) => void;
  onReset: () => void;
}

export const NoResultsState: React.FC<NoResultsStateProps> = ({
  query,
  location,
  onModifyLocation,
  onReset,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xs my-8">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-100">
        <Search className="w-8 h-8 stroke-[1.75]" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2">
        No Verified Products Discovered for "{query}"
      </h3>

      <p className="text-sm text-slate-600 leading-relaxed mb-6 max-w-lg mx-auto">
        ProductFinder strictly searches real supplier websites and does not fabricate mock listings. We couldn't find matching published products under the current search scope (<strong>{location}</strong>).
      </p>

      {/* Suggested next steps */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left mb-6 text-xs text-slate-600 space-y-2">
        <span className="font-bold text-slate-900 block">Suggestions to find products:</span>
        <ul className="list-disc list-inside space-y-1 text-slate-600">
          {location !== 'Worldwide' && (
            <li>
              Try expanding your search scope to <strong>Worldwide</strong> to discover international suppliers.
            </li>
          )}
          <li>Use broader keywords (e.g., "PET bottles" instead of a very specific custom model number).</li>
          <li>Check for generic industrial material names (e.g., "DC motor" instead of complex custom codes).</li>
        </ul>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {location !== 'Worldwide' && (
          <button
            onClick={() => onModifyLocation('Worldwide')}
            className="px-5 py-2.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Search Worldwide Instead</span>
          </button>
        )}
        <button
          onClick={onReset}
          className="px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
        >
          Try Another Search
        </button>
      </div>
    </div>
  );
};

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  onReset: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry, onReset }) => {
  return (
    <div className="bg-white rounded-3xl border border-red-200 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xs my-8">
      <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100">
        <AlertCircle className="w-8 h-8 stroke-[1.75]" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2">
        Search Request Encountered an Issue
      </h3>

      <div className="p-3.5 bg-red-50/70 border border-red-200 rounded-xl text-xs text-red-700 font-mono text-left max-w-md mx-auto mb-6 break-words">
        {error}
      </div>

      <p className="text-xs text-slate-500 mb-6 max-w-md mx-auto">
        ProductFinder operates on live Google Search grounding. If the server or external network is busy, retrying usually resolves the connection.
      </p>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={onRetry}
          className="px-5 py-2.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Search</span>
        </button>

        <button
          onClick={onReset}
          className="px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

interface LoadingStateProps {
  query: string;
  location: LocationOption;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ query, location }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-14 text-center max-w-xl mx-auto shadow-sm my-10">
      <div className="relative w-16 h-16 mx-auto mb-6">
        <div className="absolute inset-0 rounded-2xl bg-blue-100 animate-ping opacity-25" />
        <div className="relative w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Sparkles className="w-8 h-8 animate-pulse" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2">
        Searching Live Internet for "{query}"
      </h3>
      <p className="text-xs text-slate-500 mb-6">
        Target Scope: <span className="font-semibold text-blue-600">{location}</span>
      </p>

      {/* Progress steps animation */}
      <div className="space-y-3 text-left max-w-sm mx-auto text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-2 text-slate-700 font-medium">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span>Google Search grounding active across supplier networks...</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <div className="w-2 h-2 rounded-full bg-slate-300" />
          <span>Inspecting published product catalogs and spec sheets...</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <div className="w-2 h-2 rounded-full bg-slate-300" />
          <span>Extracting authentic prices, MOQ, and supplier links...</span>
        </div>
      </div>
    </div>
  );
};
