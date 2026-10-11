import React from 'react';
import { Volume2, BookMarked, ArrowLeftRight } from 'lucide-react';
import { MergedTargetWord } from '../utils/wordExtractor.ts';

interface WordCardProps {
  entry: MergedTargetWord;
  onSelectWord?: (word: MergedTargetWord) => void;
  onFilterSimilar?: (word: string) => void;
}

export const WordCard: React.FC<WordCardProps> = ({ entry, onSelectWord }) => {
  const speakWord = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(entry.word.split('/')[0].trim());
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div
      onClick={() => onSelectWord?.(entry)}
      className="group relative bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 hover:shadow-lg hover:border-blue-500 transition-all duration-200 flex flex-col justify-between active:scale-[0.99] touch-manipulation"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-1.5 mb-2.5">
          <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
            <span className="font-mono text-[11px] font-black px-2 py-0.5 rounded-md bg-slate-900 text-white tracking-wide">
              #{String(entry.serialNumber).padStart(3, '0')}
            </span>

            {entry.occurrences > 1 && (
              <span className="inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                <BookMarked className="w-3 h-3 mr-1 text-amber-600" />
                {entry.occurrences}x Questions
              </span>
            )}

            {entry.groupNameBangla && (
              <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 font-bangla truncate max-w-[150px] sm:max-w-[200px]">
                {entry.groupNameBangla}
              </span>
            )}
          </div>

          <button
            onClick={speakWord}
            title="Listen pronunciation"
            className="p-2 -mr-1 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 active:bg-blue-100 transition-colors shrink-0 touch-manipulation"
            aria-label="Listen pronunciation"
          >
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Word Title & Bangla Meanings */}
        <div className="mb-3">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">
            {entry.displayWord}
          </h3>

          <div className="mt-2 bg-blue-50/60 rounded-xl p-3 border border-blue-100/80">
            <p className="text-base sm:text-lg font-bold text-slate-900 font-bangla leading-snug">
              {entry.combinedMeaningText}
            </p>
          </div>
        </div>

        {/* Antonymous Words (From question set correct option) */}
        {entry.antonyms && entry.antonyms.length > 0 && (
          <div className="mb-3 p-3 bg-rose-50/80 rounded-xl border border-rose-200/90">
            <div className="flex items-center gap-1.5 mb-2 text-rose-800">
              <ArrowLeftRight className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span className="text-xs font-black uppercase tracking-wider text-rose-900">
                Antonym (বিপরীত শব্দ)
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {entry.antonyms.map((ant) => (
                <span
                  key={ant.word}
                  className="px-3 py-1.5 rounded-lg bg-white border border-rose-200 text-rose-950 font-black text-sm sm:text-base tracking-tight shadow-2xs flex items-center gap-1.5"
                >
                  <span className="text-rose-950">{ant.word}</span>
                  {ant.meaningBangla && ant.meaningBangla !== 'বিপরীত শব্দ' && (
                    <span className="text-xs sm:text-sm text-rose-700 font-bangla font-bold">({ant.meaningBangla})</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Exam Tag footer */}
      <div className="pt-2.5 border-t border-slate-100 text-xs text-slate-500">
        <div className="truncate font-medium text-slate-600" title={entry.examTags.join(', ')}>
          <span className="text-[10px] text-slate-400 uppercase font-bold mr-1">Exams:</span>
          {entry.examTags.slice(0, 2).join('; ')}
          {entry.examTags.length > 2 && ` (+${entry.examTags.length - 2} more)`}
        </div>
      </div>
    </div>
  );
};
