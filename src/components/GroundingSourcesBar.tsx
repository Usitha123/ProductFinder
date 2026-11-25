import React, { useState } from 'react';
import { Globe, ExternalLink, ChevronDown, ChevronUp, Sparkles, ShieldCheck } from 'lucide-react';
import { GroundingSource } from '../types';

interface GroundingSourcesBarProps {
  sources: GroundingSource[];
  webSearchQueries?: string[];
}

export const GroundingSourcesBar: React.FC<GroundingSourcesBarProps> = ({
  sources,
  webSearchQueries = [],
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100/80 text-blue-700 flex items-center justify-center">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Google Search Grounding Citations
              </h4>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {sources.length} Verified Web Sources
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live websites queried by Gemini to verify authentic product specifications and suppliers
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto px-2.5 py-1 rounded-lg hover:bg-white transition-colors"
        >
          <span>{isExpanded ? 'Hide Sources' : 'View Discovered Sources'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded list of grounding citations */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-200 space-y-3 animate-in fade-in duration-150">
          {webSearchQueries.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Grounding Queries Used:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {webSearchQueries.map((q, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-mono"
                  >
                    "{q}"
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Discovered Web Domains & Listings:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {sources.map((source, index) => {
                let domain = 'Website';
                try {
                  domain = new URL(source.uri).hostname.replace(/^www\./, '');
                } catch {
                  // ignore
                }
                return (
                  <a
                    key={`${source.uri}-${index}`}
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-white border border-slate-200/90 rounded-xl hover:border-blue-300 hover:shadow-xs transition-all flex items-center justify-between gap-2 group text-xs text-slate-800"
                  >
                    <div className="truncate">
                      <span className="font-semibold block truncate group-hover:text-blue-600">
                        {source.title || domain}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono block truncate">
                        {domain}
                      </span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
