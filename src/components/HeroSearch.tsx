import React, { useState } from 'react';
import { Search, Globe, ArrowRight, Clock, Trash2, Sparkles, Building2, ShieldCheck, Check } from 'lucide-react';
import { LocationOption, RecentSearch } from '../types';

interface HeroSearchProps {
  onSearch: (query: string, location: LocationOption) => void;
  isSearching: boolean;
  recentSearches: RecentSearch[];
  onClearRecent: () => void;
  onRemoveRecentItem: (query: string) => void;
}

const SEARCH_EXAMPLES = [
  '500ml PET bottles',
  'Plastic bottles',
  'Laptop i7 16GB RAM',
  'DC motors 24V',
  'Stainless steel water bottles',
  'Industrial machinery',
  'Packaging materials',
  'Mobile phones',
];

export const HeroSearch: React.FC<HeroSearchProps> = ({
  onSearch,
  isSearching,
  recentSearches,
  onClearRecent,
  onRemoveRecentItem,
}) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState<LocationOption>('Worldwide');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), location);
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    onSearch(example, location);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-16 flex flex-col items-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-6 shadow-xs">
        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
        <span>Live Internet Product & Supplier Discovery Engine</span>
      </div>

      {/* Main Title & Subtitle */}
      <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight text-center mb-4 leading-tight">
        Discover Real Products & Verified Suppliers
      </h1>
      <p className="text-base sm:text-lg text-slate-600 text-center max-w-2xl mb-8 leading-relaxed">
        Search live supplier websites across Sri Lanka and worldwide with Google Search grounding. Honest prices, actual specifications, and direct manufacturer links.
      </p>

      {/* Large Central Search Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 flex flex-col md:flex-row items-stretch gap-2.5 transition-shadow hover:shadow-2xl hover:shadow-blue-500/10"
      >
        {/* Text Input */}
        <div className="relative flex-1 flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What product are you searching for? (e.g. 500ml PET bottles)"
            className="w-full pl-12 pr-4 py-3.5 text-base text-slate-900 placeholder-slate-400 bg-transparent border-0 focus:ring-0 focus:outline-hidden"
            autoFocus
          />
        </div>

        <div className="h-px md:h-10 md:w-px bg-slate-200 my-auto hidden md:block" />

        {/* Location Selector */}
        <div className="relative flex items-center min-w-[170px] bg-slate-50 md:bg-transparent rounded-xl md:rounded-none px-3 py-2 md:py-0 border md:border-0 border-slate-200">
          <Globe className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
          <div className="flex-1">
            <span className="block text-[10px] uppercase font-bold text-slate-600 tracking-wider">
              Search Scope
            </span>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value as LocationOption)}
              className="w-full text-sm font-semibold text-slate-800 bg-transparent border-0 p-0 focus:ring-0 focus:outline-hidden cursor-pointer"
            >
              <option value="Worldwide">Worldwide (Global)</option>
              <option value="Sri Lanka">Sri Lanka (Local)</option>
              <option value="International">International (Non-LK)</option>
            </select>
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          disabled={isSearching || !query.trim()}
          className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm sm:text-base rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
        >
          {isSearching ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Searching Web...</span>
            </>
          ) : (
            <>
              <span>Find Products</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      {/* Suggested Search Examples */}
      <div className="w-full mt-6">
        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>Popular Discovery Queries:</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
          {SEARCH_EXAMPLES.map((example) => (
            <button
              key={example}
              onClick={() => handleExampleClick(example)}
              className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 text-slate-700 rounded-lg border border-slate-200/80 transition-colors shadow-2xs"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Searches (Stored in LocalStorage) */}
      {recentSearches.length > 0 && (
        <div className="w-full mt-8 p-4 bg-slate-50/80 rounded-2xl border border-slate-200 max-w-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> Recent Searches
            </span>
            <button
              onClick={onClearRecent}
              className="text-xs text-slate-600 hover:text-red-700 flex items-center gap-1 transition-colors"
              title="Clear all recent searches"
            >
              <Trash2 className="w-3 h-3" /> Clear history
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.slice(0, 6).map((item, idx) => (
              <div
                key={`${item.query}-${idx}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 text-slate-800 rounded-lg text-xs font-medium hover:border-blue-400 transition-colors shadow-2xs group"
              >
                <button
                  onClick={() => {
                    setQuery(item.query);
                    setLocation(item.location);
                    onSearch(item.query, item.location);
                  }}
                  className="hover:text-blue-600 text-left"
                >
                  {item.query}
                  <span className="ml-1.5 text-[10px] text-slate-400 font-normal">
                    ({item.location})
                  </span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveRecentItem(item.query);
                  }}
                  className="text-slate-300 hover:text-slate-500 p-0.5 ml-1"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Guarantees */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-12 pt-10 border-t border-slate-200 text-left">
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <Globe className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 mb-1">Live Web Grounding</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Real internet searches powered by Google Search grounding for fresh, genuine supplier listings.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 mb-1">Authentic Information</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            No simulated products or fabricated prices. Missing data is labeled honestly as "Not available".
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
            <Building2 className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 mb-1">Direct Supplier Links</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            One-click navigation to the verified source listing to view live stock, submit RFQs, or order.
          </p>
        </div>
      </div>
    </div>
  );
};
