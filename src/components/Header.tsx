import React, { useState } from 'react';
import { Search, Globe, Info, Sparkles, X, ExternalLink, ShieldCheck } from 'lucide-react';
import { LocationOption } from '../types';

interface HeaderProps {
  query: string;
  location: LocationOption;
  isSearching: boolean;
  onSearch: (q: string, loc: LocationOption) => void;
  onReset: () => void;
  showSearchBar?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  query,
  location,
  isSearching,
  onSearch,
  onReset,
  showSearchBar = false,
}) => {
  const [headerQuery, setHeaderQuery] = useState(query);
  const [headerLocation, setHeaderLocation] = useState<LocationOption>(location);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // Sync if query changes outside
  React.useEffect(() => {
    setHeaderQuery(query);
  }, [query]);

  React.useEffect(() => {
    setHeaderLocation(location);
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerQuery.trim()) {
      onSearch(headerQuery.trim(), headerLocation);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={onReset}
            className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
            title="Return to ProductFinder Home"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
              <Search className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                Product<span className="text-blue-600">Finder</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60">
                Live Web
              </span>
            </div>
          </button>

          {/* Compact search bar for header when viewing results */}
          {showSearchBar && (
            <form onSubmit={handleSubmit} className="hidden md:flex flex-1 max-w-2xl items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={headerQuery}
                  onChange={(e) => setHeaderQuery(e.target.value)}
                  placeholder="Search products across suppliers..."
                  className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900"
                />
              </div>

              <div className="relative flex-shrink-0">
                <select
                  value={headerLocation}
                  onChange={(e) => setHeaderLocation(e.target.value as LocationOption)}
                  className="appearance-none pl-7 pr-8 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
                >
                  <option value="Worldwide">Worldwide</option>
                  <option value="Sri Lanka">Sri Lanka</option>
                  <option value="International">International</option>
                </select>
                <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
              </div>

              <button
                type="submit"
                disabled={isSearching || !headerQuery.trim()}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                {isSearching ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  'Search'
                )}
              </button>
            </form>
          )}

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHowItWorks(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors"
            >
              <Info className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">How It Works</span>
              <span className="sm:hidden">Info</span>
            </button>
          </div>
        </div>
      </header>

      {/* How it works modal */}
      {showHowItWorks && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowHowItWorks(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">How ProductFinder Works</h3>
                <p className="text-xs text-slate-500">Live internet product discovery with Google Grounding</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-600">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-blue-600" /> 1. Live Web Search Grounding
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  When you submit a search, Google Gemini queries Google Search in real-time to find actual manufacturer, distributor, and supplier product listings currently published on the internet.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> 2. Strict Zero-Fabrication Rule
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  No sample or synthetic product data is ever generated. If a price or specification is not publicly available on the source website, it is honestly labeled as <em>"Not available"</em> or <em>"Inquiry Required"</em>.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                  <ExternalLink className="w-4 h-4 text-blue-600" /> 3. Direct Source Transparency
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every product card provides the original source link and domain so you can inspect the supplier page directly and make inquiries or orders with confidence.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowHowItWorks(false)}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
