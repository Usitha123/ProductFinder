import React, { useState } from 'react';
import {
  ExternalLink,
  Building2,
  MapPin,
  Package,
  Layers,
  Scale,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { ProductItem } from '../types';
import { PriceStatusBadge } from './PriceStatusBadge';

interface ProductCardProps {
  product: ProductItem;
  onSelect: (product: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const [imageError, setImageError] = useState(false);

  // Format display price
  const hasPrice = product.price && product.price !== 'Not available';

  return (
    <div
      onClick={() => onSelect(product)}
      className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden group"
    >
      <div>
        {/* Top Header / Image Area */}
        <div className="relative h-44 bg-slate-50 border-b border-slate-100 flex items-center justify-center p-4 overflow-hidden">
          {product.imageUrl && !imageError ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              onError={() => setImageError(true)}
              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-2 text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
                <Package className="w-6 h-6 stroke-[1.5]" />
              </div>
              <span className="text-xs font-medium text-slate-500">
                {product.brand !== 'Not available' ? product.brand : product.supplierName}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">Direct Supplier Listing</span>
            </div>
          )}

          {/* Price status floating badge */}
          <div className="absolute top-3 left-3">
            <PriceStatusBadge status={product.priceStatus} size="sm" />
          </div>

          {/* Source website tag */}
          <div className="absolute top-3 right-3">
            <span className="px-2 py-0.5 text-[11px] font-semibold bg-white/90 backdrop-blur-xs text-slate-700 rounded-md border border-slate-200/80 shadow-2xs">
              {product.sourceWebsite}
            </span>
          </div>
        </div>

        {/* Content body */}
        <div className="p-4 sm:p-5">
          {/* Supplier Info */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 gap-2">
            <span className="inline-flex items-center gap-1 font-medium text-slate-700 truncate max-w-[180px]">
              <Building2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
              <span className="truncate">{product.supplierName}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-slate-500 flex-shrink-0">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{product.supplierCountry}</span>
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2 leading-snug">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
            {product.description}
          </p>

          {/* Pricing Highlight Box */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 mb-4 flex items-baseline justify-between gap-2">
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Price
              </span>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span
                  className={`text-lg font-extrabold ${
                    hasPrice ? 'text-blue-600' : 'text-slate-700'
                  }`}
                >
                  {product.price}
                </span>
                {product.priceUnit !== 'Not available' && (
                  <span className="text-xs text-slate-500 font-medium">
                    / {product.priceUnit}
                  </span>
                )}
              </div>
            </div>

            {product.currency !== 'Not available' && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-200/60 text-slate-700">
                {product.currency}
              </span>
            )}
          </div>

          {/* Specifications Pills */}
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-2">
            <div className="flex items-center gap-1.5 bg-slate-50/80 px-2.5 py-1.5 rounded-lg border border-slate-100">
              <Package className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 block leading-tight">MOQ</span>
                <span className="font-medium text-slate-800 truncate block">
                  {product.minOrderQuantity}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50/80 px-2.5 py-1.5 rounded-lg border border-slate-100">
              <Layers className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 block leading-tight">Material</span>
                <span className="font-medium text-slate-800 truncate block">
                  {product.material}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50/80 px-2.5 py-1.5 rounded-lg border border-slate-100">
              <Scale className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 block leading-tight">Size / Capacity</span>
                <span className="font-medium text-slate-800 truncate block">
                  {product.capacityOrSize}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50/80 px-2.5 py-1.5 rounded-lg border border-slate-100">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 block leading-tight">Stock</span>
                <span className="font-medium text-slate-800 truncate block">
                  {product.availableQuantity}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between gap-2 bg-slate-50/50">
        <span className="text-[11px] text-slate-400 inline-flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>Checked: {product.lastCheckedDate}</span>
        </span>

        <div className="flex items-center gap-1.5">
          <a
            href={product.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-slate-200 transition-colors"
            title={`Visit ${product.sourceWebsite}`}
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={() => onSelect(product)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group-hover:bg-blue-600 group-hover:text-white"
          >
            <span>Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
