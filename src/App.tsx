import React, { useState, useEffect, useMemo } from 'react';
import {
  ProductItem,
  LocationOption,
  PriceVerificationStatus,
  SearchResponse,
  RecentSearch,
  GroundingSource,
} from './types';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { ProductCard } from './components/ProductCard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { FilterSidebar, SortMode } from './components/FilterSidebar';
import { GroundingSourcesBar } from './components/GroundingSourcesBar';
import { NoResultsState, ErrorState, LoadingState } from './components/ErrorAndEmptyStates';
import { searchProducts } from './services/geminiService';
import {
  Globe,
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles,
  ArrowLeft,
  X,
  Package,
} from 'lucide-react';

const RECENT_SEARCHES_KEY = 'productfinder_recent_searches_v1';

export default function App() {
  // Navigation & Search State
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState<LocationOption>('Worldwide');
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Search Results
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [summary, setSummary] = useState('');
  const [groundingSources, setGroundingSources] = useState<GroundingSource[]>([]);
  const [webSearchQueries, setWebSearchQueries] = useState<string[]>([]);

  // Selected Product for Details Modal
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  // LocalStorage Recent Searches
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Filters and Sorting
  const [searchWithin, setSearchWithin] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('relevance');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [selectedPriceStatuses, setSelectedPriceStatuses] = useState<PriceVerificationStatus[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Save recent searches to LocalStorage
  const saveRecentSearch = (query: string, location: LocationOption) => {
    try {
      const filtered = recentSearches.filter(
        (item) => !(item.query.toLowerCase() === query.toLowerCase() && item.location === location)
      );
      const updated = [{ query, location, timestamp: Date.now() }, ...filtered].slice(0, 10);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  const handleRemoveRecentItem = (queryToRemove: string) => {
    const updated = recentSearches.filter((item) => item.query !== queryToRemove);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  // Perform search
  const executeSearch = async (query: string, location: LocationOption) => {
    if (!query.trim()) return;

    setCurrentQuery(query);
    setCurrentLocation(location);
    setHasSearched(true);
    setIsSearching(true);
    setSearchError(null);
    setSelectedProduct(null);

    // Reset filters
    setSearchWithin('');
    setSortMode('relevance');
    setSelectedCountries([]);
    setSelectedCurrencies([]);
    setSelectedSuppliers([]);
    setSelectedPriceStatuses([]);

    saveRecentSearch(query, location);

    try {
      const data = await searchProducts(query, location);
      setProducts(data.products || []);
      setSummary(data.summary || '');
      setGroundingSources(data.groundingSources || []);
      setWebSearchQueries(data.webSearchQueries || []);
    } catch (err: any) {
      console.error('Search error:', err);
      setSearchError(err.message || 'An unexpected error occurred while searching.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleResetToHome = () => {
    setHasSearched(false);
    setCurrentQuery('');
    setProducts([]);
    setSearchError(null);
    setSelectedProduct(null);
  };

  // Extract unique available filter lists from products
  const availableCountries = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.supplierCountry && p.supplierCountry !== 'Not available') {
        set.add(p.supplierCountry);
      }
    });
    return Array.from(set).sort();
  }, [products]);

  const availableCurrencies = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.currency && p.currency !== 'Not available') {
        set.add(p.currency);
      }
    });
    return Array.from(set).sort();
  }, [products]);

  const availableSuppliers = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.supplierName && p.supplierName !== 'Not available') {
        set.add(p.supplierName);
      }
    });
    return Array.from(set).sort();
  }, [products]);

  // Filter and sort items
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search within results
        if (searchWithin.trim()) {
          const sw = searchWithin.toLowerCase();
          const matchName = p.name.toLowerCase().includes(sw);
          const matchDesc = p.description.toLowerCase().includes(sw);
          const matchBrand = p.brand.toLowerCase().includes(sw);
          const matchMaterial = p.material.toLowerCase().includes(sw);
          const matchSupplier = p.supplierName.toLowerCase().includes(sw);
          const matchSpecs = Object.entries(p.specifications || {}).some(
            ([k, v]) => k.toLowerCase().includes(sw) || v.toLowerCase().includes(sw)
          );
          if (!matchName && !matchDesc && !matchBrand && !matchMaterial && !matchSupplier && !matchSpecs) {
            return false;
          }
        }

        // Country filter
        if (selectedCountries.length > 0) {
          if (!selectedCountries.includes(p.supplierCountry)) {
            return false;
          }
        }

        // Currency filter
        if (selectedCurrencies.length > 0) {
          if (!selectedCurrencies.includes(p.currency)) {
            return false;
          }
        }

        // Supplier filter
        if (selectedSuppliers.length > 0) {
          if (!selectedSuppliers.includes(p.supplierName)) {
            return false;
          }
        }

        // Price Status filter
        if (selectedPriceStatuses.length > 0) {
          if (!selectedPriceStatuses.includes(p.priceStatus)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortMode === 'price_asc') {
          // Items with numeric price first
          if (a.numericPrice !== null && b.numericPrice !== null) {
            return a.numericPrice - b.numericPrice;
          }
          if (a.numericPrice !== null) return -1;
          if (b.numericPrice !== null) return 1;
          return 0;
        }

        if (sortMode === 'price_desc') {
          if (a.numericPrice !== null && b.numericPrice !== null) {
            return b.numericPrice - a.numericPrice;
          }
          if (a.numericPrice !== null) return -1;
          if (b.numericPrice !== null) return 1;
          return 0;
        }

        if (sortMode === 'name_asc') {
          return a.name.localeCompare(b.name);
        }

        return 0; // relevance / original Google Search grounding rank
      });
  }, [
    products,
    searchWithin,
    selectedCountries,
    selectedCurrencies,
    selectedSuppliers,
    selectedPriceStatuses,
    sortMode,
  ]);

  const hasActiveFilters =
    searchWithin.trim() !== '' ||
    sortMode !== 'relevance' ||
    selectedCountries.length > 0 ||
    selectedCurrencies.length > 0 ||
    selectedSuppliers.length > 0 ||
    selectedPriceStatuses.length > 0;

  const handleResetFilters = () => {
    setSearchWithin('');
    setSortMode('relevance');
    setSelectedCountries([]);
    setSelectedCurrencies([]);
    setSelectedSuppliers([]);
    setSelectedPriceStatuses([]);
  };

  const toggleCountry = (country: string) => {
    setSelectedCountries((prev) =>
      prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]
    );
  };

  const toggleCurrency = (curr: string) => {
    setSelectedCurrencies((prev) =>
      prev.includes(curr) ? prev.filter((c) => c !== curr) : [...prev, curr]
    );
  };

  const toggleSupplier = (sup: string) => {
    setSelectedSuppliers((prev) =>
      prev.includes(sup) ? prev.filter((s) => s !== sup) : [...prev, sup]
    );
  };

  const togglePriceStatus = (st: PriceVerificationStatus) => {
    setSelectedPriceStatuses((prev) =>
      prev.includes(st) ? prev.filter((s) => s !== st) : [...prev, st]
    );
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Header */}
      <Header
        query={currentQuery}
        location={currentLocation}
        isSearching={isSearching}
        onSearch={executeSearch}
        onReset={handleResetToHome}
        showSearchBar={hasSearched}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!hasSearched ? (
          /* Homepage View */
          <HeroSearch
            onSearch={executeSearch}
            isSearching={isSearching}
            recentSearches={recentSearches}
            onClearRecent={handleClearRecent}
            onRemoveRecentItem={handleRemoveRecentItem}
          />
        ) : isSearching ? (
          /* Loading View */
          <LoadingState query={currentQuery} location={currentLocation} />
        ) : searchError ? (
          /* Error View */
          <ErrorState
            error={searchError}
            onRetry={() => executeSearch(currentQuery, currentLocation)}
            onReset={handleResetToHome}
          />
        ) : products.length === 0 ? (
          /* No Results View */
          <NoResultsState
            query={currentQuery}
            location={currentLocation}
            onModifyLocation={(loc) => executeSearch(currentQuery, loc)}
            onReset={handleResetToHome}
          />
        ) : (
          /* Search Results View */
          <div>
            {/* Search Summary Header */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 sm:p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <button
                      onClick={handleResetToHome}
                      className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors mr-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>New Search</span>
                    </button>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-semibold text-slate-500">Query:</span>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                      "{currentQuery}"
                    </h2>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                      <Globe className="w-3 h-3" />
                      {currentLocation}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                    {summary}
                  </p>
                </div>

                {/* Counter & Mobile Filter Toggle */}
                <div className="flex items-center gap-3 self-start md:self-center">
                  <div className="text-right">
                    <span className="text-2xl font-black text-blue-600">
                      {filteredProducts.length}
                    </span>
                    <span className="text-xs text-slate-500 font-medium block">
                      {filteredProducts.length === products.length
                        ? `products found`
                        : `of ${products.length} found`}
                    </span>
                  </div>

                  <button
                    onClick={() => setMobileFilterOpen(true)}
                    className="lg:hidden px-3.5 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 hover:bg-slate-50"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                    <span>Filters</span>
                    {hasActiveFilters && (
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Google Search Grounding Citations Bar */}
            <GroundingSourcesBar
              sources={groundingSources}
              webSearchQueries={webSearchQueries}
            />

            {/* Layout with Filters and Results Grid */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Desktop Filter Sidebar */}
              <div className="hidden lg:block">
                <FilterSidebar
                  searchWithin={searchWithin}
                  onSearchWithinChange={setSearchWithin}
                  sortMode={sortMode}
                  onSortModeChange={setSortMode}
                  availableCountries={availableCountries}
                  selectedCountries={selectedCountries}
                  onToggleCountry={toggleCountry}
                  availableCurrencies={availableCurrencies}
                  selectedCurrencies={selectedCurrencies}
                  onToggleCurrency={toggleCurrency}
                  availableSuppliers={availableSuppliers}
                  selectedSuppliers={selectedSuppliers}
                  onToggleSupplier={toggleSupplier}
                  selectedPriceStatuses={selectedPriceStatuses}
                  onTogglePriceStatus={togglePriceStatus}
                  totalCount={products.length}
                  filteredCount={filteredProducts.length}
                  onResetFilters={handleResetFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>

              {/* Product Results Grid */}
              <div className="flex-1">
                {filteredProducts.length === 0 ? (
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center">
                    <Package className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <h4 className="text-base font-bold text-slate-800 mb-1">
                      No products match your active filters
                    </h4>
                    <p className="text-xs text-slate-500 mb-4">
                      Try removing some filters or clearing the "search within results" keyword.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 text-xs font-semibold text-blue-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onSelect={setSelectedProduct}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Filters Slide-over / Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-sm bg-white h-full p-5 overflow-y-auto flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="font-bold text-slate-900 text-sm">Filter & Sort</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <FilterSidebar
                searchWithin={searchWithin}
                onSearchWithinChange={setSearchWithin}
                sortMode={sortMode}
                onSortModeChange={setSortMode}
                availableCountries={availableCountries}
                selectedCountries={selectedCountries}
                onToggleCountry={toggleCountry}
                availableCurrencies={availableCurrencies}
                selectedCurrencies={selectedCurrencies}
                onToggleCurrency={toggleCurrency}
                availableSuppliers={availableSuppliers}
                selectedSuppliers={selectedSuppliers}
                onToggleSupplier={toggleSupplier}
                selectedPriceStatuses={selectedPriceStatuses}
                onTogglePriceStatus={togglePriceStatus}
                totalCount={products.length}
                filteredCount={filteredProducts.length}
                onResetFilters={handleResetFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-xs"
              >
                Apply & View ({filteredProducts.length}) Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Details Panel / Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">ProductFinder</span>
            <span>•</span>
            <span>Internet-based supplier & product discovery engine</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Powered by Gemini 3.8 Flash & Google Search Grounding</span>
            <span>•</span>
            <span>Strict Zero-Fabrication Guarantee</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
