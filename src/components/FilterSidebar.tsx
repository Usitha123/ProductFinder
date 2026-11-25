import React from 'react';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  Check,
  Building2,
  Globe2,
  Coins,
  ShieldCheck,
} from 'lucide-react';
import { PriceVerificationStatus } from '../types';

export type SortMode = 'relevance' | 'price_asc' | 'price_desc' | 'name_asc';

interface FilterSidebarProps {
  // Search within results
  searchWithin: string;
  onSearchWithinChange: (val: string) => void;

  // Sorting
  sortMode: SortMode;
  onSortModeChange: (val: SortMode) => void;

  // Filter options available
  availableCountries: string[];
  selectedCountries: string[];
  onToggleCountry: (country: string) => void;

  availableCurrencies: string[];
  selectedCurrencies: string[];
  onToggleCurrency: (curr: string) => void;

  availableSuppliers: string[];
  selectedSuppliers: string[];
  onToggleSupplier: (sup: string) => void;

  selectedPriceStatuses: PriceVerificationStatus[];
  onTogglePriceStatus: (status: PriceVerificationStatus) => void;

  // Counters and Reset
  totalCount: number;
  filteredCount: number;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  searchWithin,
  onSearchWithinChange,
  sortMode,
  onSortModeChange,
  availableCountries,
  selectedCountries,
  onToggleCountry,
  availableCurrencies,
  selectedCurrencies,
  onToggleCurrency,
  availableSuppliers,
  selectedSuppliers,
  onToggleSupplier,
  selectedPriceStatuses,
  onTogglePriceStatus,
  totalCount,
  filteredCount,
  onResetFilters,
  hasActiveFilters,
}) => {
  return (
    <aside className="w-full lg:w-72 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-6 flex-shrink-0 self-start">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-sm">Filters & Sorting</h3>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Search within results */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Search Within Results
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchWithin}
            onChange={(e) => onSearchWithinChange(e.target.value)}
            placeholder="Filter by keyword, spec..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 transition-colors"
          />
        </div>
      </div>

      {/* Sort By Price / Relevance */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span>Sort By</span>
        </label>
        <select
          value={sortMode}
          onChange={(e) => onSortModeChange(e.target.value as SortMode)}
          className="w-full text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
        >
          <option value="relevance">Best Match (Relevance)</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Product Name (A-Z)</option>
        </select>
      </div>

      {/* Filter by Price Verification Status */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          <span>Price Verification</span>
        </label>
        <div className="space-y-1.5 text-xs">
          {[
            { id: 'verified', label: 'Verified on Source' },
            { id: 'confirmation_required', label: 'Inquiry Required' },
            { id: 'not_found', label: 'Price Not Found' },
            { id: 'cached_or_outdated', label: 'Outdated / Estimated' },
          ].map((item) => {
            const isChecked = selectedPriceStatuses.includes(item.id as PriceVerificationStatus);
            return (
              <label
                key={item.id}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onTogglePriceStatus(item.id as PriceVerificationStatus)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
                <span className="text-slate-700">{item.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Filter by Country */}
      {availableCountries.length > 0 && (
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Supplier Country</span>
          </label>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 text-xs">
            {availableCountries.map((country) => {
              const isChecked = selectedCountries.includes(country);
              return (
                <label
                  key={country}
                  className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleCountry(country)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    />
                    <span className="text-slate-700 truncate max-w-[170px]">{country}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter by Currency */}
      {availableCurrencies.length > 0 && (
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-slate-400" />
            <span>Currency</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {availableCurrencies.map((curr) => {
              const isSelected = selectedCurrencies.includes(curr);
              return (
                <button
                  key={curr}
                  onClick={() => onToggleCurrency(curr)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {curr}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter by Supplier */}
      {availableSuppliers.length > 0 && (
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Suppliers ({availableSuppliers.length})</span>
          </label>
          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1 text-xs">
            {availableSuppliers.map((supplier) => {
              const isChecked = selectedSuppliers.includes(supplier);
              return (
                <label
                  key={supplier}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleSupplier(supplier)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 flex-shrink-0"
                  />
                  <span className="text-slate-700 truncate" title={supplier}>
                    {supplier}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
};
