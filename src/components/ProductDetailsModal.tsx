import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Building2,
  MapPin,
  Calendar,
  Layers,
  Package,
  Scale,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Search,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { ProductItem, UrlInspectionResult } from '../types';
import { PriceStatusBadge } from './PriceStatusBadge';
import { inspectProductUrl } from '../services/geminiService';

interface ProductDetailsModalProps {
  product: ProductItem | null;
  onClose: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isInspecting, setIsInspecting] = useState(false);
  const [inspectionResult, setInspectionResult] = useState<UrlInspectionResult | null>(null);
  const [inspectionError, setInspectionError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  if (!product) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(product.sourceUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLiveInspect = async () => {
    setIsInspecting(true);
    setInspectionError(null);
    try {
      const result = await inspectProductUrl(product.sourceUrl, product.name);
      setInspectionResult(result);
    } catch (err: any) {
      setInspectionError(err.message || 'Error inspecting product page via URL Context.');
    } finally {
      setIsInspecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/60 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Product Discovery Sheet
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
              {product.sourceWebsite}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            title="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Top Section */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image Box */}
            <div className="w-full md:w-64 h-56 rounded-2xl bg-slate-50 border border-slate-200 flex-shrink-0 flex items-center justify-center p-4 relative overflow-hidden">
              {product.imageUrl && !imageError ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  onError={() => setImageError(true)}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="text-center p-4 text-slate-400">
                  <Package className="w-12 h-12 stroke-[1.5] mx-auto mb-2 text-slate-300" />
                  <span className="text-xs text-slate-500 font-medium block">
                    Product Listing Image
                  </span>
                  <span className="text-[10px] text-slate-400">Refer to source website</span>
                </div>
              )}
              <div className="absolute top-2 left-2">
                <PriceStatusBadge status={product.priceStatus} size="sm" />
              </div>
            </div>

            {/* Product Title & Primary Details */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5 flex-wrap">
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-blue-500" />
                    {product.supplierName}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {product.supplierCountry}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Checked: {product.lastCheckedDate}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug mb-3">
                  {product.name}
                </h2>

                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {product.description}
                </p>
              </div>

              {/* Pricing Callout Box */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-blue-600">
                    Published Pricing
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">
                      {product.price}
                    </span>
                    {product.priceUnit !== 'Not available' && (
                      <span className="text-xs text-slate-600 font-medium">
                        / {product.priceUnit}
                      </span>
                    )}
                    {product.currency !== 'Not available' && (
                      <span className="text-xs font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded">
                        {product.currency}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <PriceStatusBadge status={product.priceStatus} size="md" />
                </div>
              </div>
            </div>
          </div>

          {/* Core Product Attributes Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Standard Specifications
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Brand
                </span>
                <span className="text-sm font-semibold text-slate-800 break-words">
                  {product.brand}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Material
                </span>
                <span className="text-sm font-semibold text-slate-800 break-words">
                  {product.material}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Capacity / Size
                </span>
                <span className="text-sm font-semibold text-slate-800 break-words">
                  {product.capacityOrSize}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Min. Order (MOQ)
                </span>
                <span className="text-sm font-semibold text-slate-800 break-words">
                  {product.minOrderQuantity}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Stock Availability
                </span>
                <span className="text-sm font-semibold text-slate-800 break-words">
                  {product.availableQuantity}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Supplier Country & Region
                </span>
                <span className="text-sm font-semibold text-slate-800 break-words">
                  {product.supplierCountry}
                </span>
              </div>
            </div>
          </div>

          {/* Full Technical Specifications (if present) */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Published Supplier Specifications
              </h4>
              <div className="bg-slate-50 rounded-2xl border border-slate-100 divide-y divide-slate-100 overflow-hidden">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                    <span className="font-medium text-slate-500 sm:w-1/3">{key}</span>
                    <span className="font-semibold text-slate-800 sm:w-2/3 break-words">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Access notes if present */}
          {product.accessNotes && (
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-800 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">Supplier Access Notes:</span>
                <p className="leading-relaxed">{product.accessNotes}</p>
              </div>
            </div>
          )}

          {/* Live URL Context Inspection Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Live URL Context Inspection
                  </h4>
                  <p className="text-xs text-slate-400">
                    Use Gemini URL Context to inspect this specific supplier page live
                  </p>
                </div>
              </div>

              <button
                onClick={handleLiveInspect}
                disabled={isInspecting}
                className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                {isInspecting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Inspecting Page...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Inspect Page Live</span>
                  </>
                )}
              </button>
            </div>

            {inspectionError && (
              <div className="mt-3 p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-200 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p>
                  {inspectionError}. You can open the supplier's website directly using the button below.
                </p>
              </div>
            )}

            {inspectionResult && (
              <div className="mt-3 p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
                  <span className="text-slate-400">Access Status:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {inspectionResult.accessStatus.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Verified Price:</span>
                  <span className="font-semibold text-white">{inspectionResult.verifiedPrice}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Stock Availability:</span>
                  <span className="font-semibold text-white">{inspectionResult.stockStatus}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Minimum Order:</span>
                  <span className="font-semibold text-white">{inspectionResult.minOrderQuantity}</span>
                </div>
                {inspectionResult.supplierNotes && (
                  <div className="pt-2 border-t border-slate-700/80 text-slate-300 leading-relaxed">
                    <span className="text-slate-400 block text-[11px] mb-0.5">Inspector Notes:</span>
                    {inspectionResult.supplierNotes}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Source Transparency Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Source Transparency & Verification
              </span>
              <button
                onClick={handleCopyUrl}
                className="text-xs text-slate-600 hover:text-blue-600 flex items-center gap-1 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-medium">Copied link</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-xs space-y-1">
              <div className="text-slate-500 flex items-center gap-1">
                <span>Original Domain:</span>
                <span className="font-semibold text-slate-800">{product.sourceWebsite}</span>
              </div>
              <div className="text-slate-500">
                <span>Original Product Page:</span>
                <a
                  href={product.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] text-blue-600 hover:underline break-all block mt-0.5"
                >
                  {product.sourceUrl}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer with Prominent "Visit Supplier Website" Button */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0 z-10">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200/80 rounded-xl transition-colors"
          >
            Close
          </button>

          <a
            href={product.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
          >
            <span>Visit Supplier Website</span>
            <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
