import React, { useRef } from 'react';
import { AlphabetSection, ALPHABET_LETTERS } from '../utils/wordExtractor.ts';

interface AlphabetIndexBarProps {
  sections: AlphabetSection[];
  selectedLetter: string | 'ALL';
  onSelectLetter: (letter: string | 'ALL') => void;
}

export const AlphabetIndexBar: React.FC<AlphabetIndexBarProps> = ({
  sections,
  selectedLetter,
  onSelectLetter,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const countMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    sections.forEach((sec) => {
      map[sec.letter] = sec.words.length;
    });
    return map;
  }, [sections]);

  return (
    <div className="bg-white/95 backdrop-blur-md border-y border-slate-200/90 shadow-2xs py-2 px-2.5 sm:px-4 sticky top-[57px] sm:top-[65px] z-30 no-print">
      <div
        ref={scrollRef}
        className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto scrollbar-none scroll-smooth touch-pan-x py-0.5"
      >
        {/* ALL Sections Button */}
        <button
          onClick={() => onSelectLetter('ALL')}
          className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-black transition-all touch-manipulation active:scale-95 ${
            selectedLetter === 'ALL'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          All A-Z
        </button>

        <div className="h-4 w-px bg-slate-200 shrink-0 mx-0.5" />

        {/* 26 Letter Pills with Mobile Touch Targets */}
        <div className="flex items-center space-x-1 shrink-0">
          {ALPHABET_LETTERS.map((letter: string) => {
            const count = countMap[letter] || 0;
            const isSelected = selectedLetter === letter;
            const hasWords = count > 0;

            return (
              <button
                key={letter}
                onClick={() => onSelectLetter(letter)}
                title={`${letter} - ${count} words`}
                className={`relative min-w-[34px] sm:min-w-[38px] h-8 sm:h-9 px-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center touch-manipulation active:scale-95 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/30'
                    : hasWords
                    ? 'bg-slate-50 text-slate-800 hover:bg-blue-50 hover:text-blue-600 border border-slate-200/80'
                    : 'bg-slate-50/50 text-slate-300 pointer-events-none'
                }`}
              >
                <span>{letter}</span>
                {hasWords && (
                  <span
                    className={`ml-1 text-[9px] px-1 rounded-full font-bold ${
                      isSelected
                        ? 'bg-white/25 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
