import React, { useRef } from 'react';
import { SynonymousGroup } from '../utils/wordExtractor.ts';

interface SynonymGroupBarProps {
  groups: SynonymousGroup[];
  selectedGroupId: string | 'ALL';
  onSelectGroup: (groupId: string | 'ALL') => void;
}

export const SynonymGroupBar: React.FC<SynonymGroupBarProps> = ({
  groups,
  selectedGroupId,
  onSelectGroup,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-white/95 backdrop-blur-md border-y border-slate-200/90 shadow-2xs py-2 px-2.5 sm:px-4 sticky top-[57px] sm:top-[65px] z-30 no-print">
      <div
        ref={scrollRef}
        className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto scrollbar-none scroll-smooth touch-pan-x py-0.5"
      >
        {/* ALL Synonymous Groups Button */}
        <button
          onClick={() => onSelectGroup('ALL')}
          className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all touch-manipulation active:scale-95 whitespace-nowrap ${
            selectedGroupId === 'ALL'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          All Synonymous Groups ({groups.length})
        </button>

        <div className="h-4 w-px bg-slate-200 shrink-0 mx-0.5" />

        {/* Synonymous Groups Pills Ordered by Lead Word (Abhor, Abstemious, Abundant, Acumen...) */}
        <div className="flex items-center space-x-1.5 shrink-0">
          {groups.map((grp) => {
            const isSelected = selectedGroupId === grp.id;

            return (
              <button
                key={grp.id}
                onClick={() => onSelectGroup(grp.id)}
                title={`${grp.leadWord} (${grp.titleBangla}) - ${grp.totalWordsCount} words`}
                className={`relative h-8 sm:h-9 px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center whitespace-nowrap touch-manipulation active:scale-95 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/30'
                    : 'bg-slate-50 text-slate-800 hover:bg-blue-50 hover:text-blue-600 border border-slate-200/80'
                }`}
              >
                <span>{grp.leadWord}</span>
                <span
                  className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected
                      ? 'bg-white/25 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {grp.totalWordsCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
