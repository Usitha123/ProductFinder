import React from 'react';
import { CheckCircle2, HelpCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { PriceVerificationStatus } from '../types';

interface PriceStatusBadgeProps {
  status: PriceVerificationStatus;
  size?: 'sm' | 'md';
}

export const PriceStatusBadge: React.FC<PriceStatusBadgeProps> = ({ status, size = 'sm' }) => {
  const isSm = size === 'sm';
  const iconSize = isSm ? 12 : 14;

  switch (status) {
    case 'verified':
      return (
        <span
          title="Verified price directly visible on the supplier's website"
          className={`inline-flex items-center gap-1 font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${
            isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
          }`}
        >
          <CheckCircle2 size={iconSize} className="text-emerald-600 flex-shrink-0" />
          <span>Verified on Source</span>
        </span>
      );

    case 'confirmation_required':
      return (
        <span
          title="Price requires direct contact or inquiry with the supplier"
          className={`inline-flex items-center gap-1 font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 ${
            isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
          }`}
        >
          <HelpCircle size={iconSize} className="text-amber-600 flex-shrink-0" />
          <span>Inquiry Required</span>
        </span>
      );

    case 'not_found':
      return (
        <span
          title="Price is not publicly published on the discovered product listing"
          className={`inline-flex items-center gap-1 font-medium rounded-full bg-slate-100 text-slate-600 border border-slate-200 ${
            isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
          }`}
        >
          <AlertCircle size={iconSize} className="text-slate-500 flex-shrink-0" />
          <span>Price Not Found</span>
        </span>
      );

    case 'cached_or_outdated':
      return (
        <span
          title="Estimated or historical pricing; verify directly with supplier"
          className={`inline-flex items-center gap-1 font-medium rounded-full bg-purple-50 text-purple-700 border border-purple-200/80 ${
            isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
          }`}
        >
          <RefreshCw size={iconSize} className="text-purple-600 flex-shrink-0" />
          <span>Outdated / Est.</span>
        </span>
      );

    default:
      return null;
  }
};
