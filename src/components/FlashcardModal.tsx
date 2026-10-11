import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, RotateCw, Volume2, Sparkles } from 'lucide-react';
import { MergedTargetWord } from '../utils/wordExtractor.ts';

interface FlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  words: MergedTargetWord[];
}

export const FlashcardModal: React.FC<FlashcardModalProps> = ({ isOpen, onClose, words }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!isOpen || words.length === 0) return null;

  const currentWord = words[currentIndex % words.length];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % words.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
  };

  const speak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(currentWord.word.split('/')[0].trim());
      u.lang = 'en-US';
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">Vocabulary Flashcards</h3>
            <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-mono font-bold">
              {currentIndex + 1} / {words.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Body with Flip Animation */}
        <div className="p-4 sm:p-7 flex flex-col items-center">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer w-full min-h-[260px] rounded-2xl p-5 sm:p-6 flex flex-col justify-between items-center text-center transition-all duration-300 border-2 select-none shadow-md bg-gradient-to-br from-slate-50 to-blue-50/40 border-blue-200 hover:border-blue-400 active:scale-[0.99] touch-manipulation"
          >
            <div className="w-full flex justify-between items-center text-xs text-slate-400">
              <span className="font-mono font-black text-blue-700 text-sm">
                #{String(currentWord.serialNumber).padStart(3, '0')} • {currentWord.groupNameEnglish}
              </span>
              <button
                onClick={speak}
                className="p-2 rounded-full hover:bg-blue-100 text-slate-600 hover:text-blue-600 active:bg-blue-200"
                title="Pronounce"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="my-auto py-3">
              {!isFlipped ? (
                <div>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                    {currentWord.displayWord}
                  </h2>
                  <p className="text-xs text-slate-400 mt-3 flex items-center justify-center gap-1 font-medium">
                    <RotateCw className="w-3.5 h-3.5" /> Tap card to reveal Bangla meaning
                  </p>
                </div>
              ) : (
                <div className="animate-in fade-in zoom-in-95 duration-150">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 font-bangla leading-snug">
                    {currentWord.combinedMeaningText}
                  </h2>
                  {currentWord.antonyms && currentWord.antonyms.length > 0 && (
                    <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                      {currentWord.antonyms.map((ant) => (
                        <span
                          key={ant.word}
                          className="px-2.5 py-1 rounded-lg bg-white border border-rose-200 font-bold text-xs sm:text-sm text-rose-950 shadow-2xs flex items-center gap-1"
                        >
                          <span className="text-rose-900 font-black">{ant.word}</span>
                          {ant.meaningBangla && ant.meaningBangla !== 'বিপরীত শব্দ' && (
                            <span className="text-xs text-rose-700 font-bangla font-semibold">({ant.meaningBangla})</span>
                          )}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="w-full text-xs text-slate-400 border-t border-slate-200/60 pt-2 flex justify-between">
              <span>Tested: {currentWord.occurrences}x</span>
              <span>Tap to {isFlipped ? 'flip back' : 'reveal'}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between w-full mt-5 px-2">
            <button
              onClick={handlePrev}
              className="inline-flex items-center px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Prev
            </button>

            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors active:scale-95"
              title="Flip Card"
            >
              <RotateCw className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              className="inline-flex items-center px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-bold hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-xs"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
