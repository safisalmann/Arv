import React from 'react';
import { BookOpen, Printer, Download, Sparkles, Layers, SlidersHorizontal } from 'lucide-react';

interface NavbarProps {
  totalWords: number;
  uniqueWords: number;
  totalQuestions: number;
  onOpenPdfSettings: () => void;
  onPrint: () => void;
  onDownloadPdf: () => void;
  onOpenQuiz: () => void;
  onOpenFlashcards: () => void;
  isGeneratingPdf: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  uniqueWords,
  totalQuestions,
  onOpenPdfSettings,
  onPrint,
  onDownloadPdf,
  onOpenQuiz,
  onOpenFlashcards,
  isGeneratingPdf,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs no-print">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between gap-2">
          {/* Logo & Title */}
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <h1 className="text-base sm:text-xl font-black tracking-tight text-slate-900 truncate">
                  Target Vocab A-Z
                </h1>
                <span className="bg-blue-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider shrink-0">
                  26 Sec
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate font-bangla hidden sm:block">
                {uniqueWords}টি মার্জকৃত টার্গেট শব্দ • {totalQuestions}টি বিগত প্রশ্ন
              </p>
            </div>
          </div>

          {/* Quick Actions (Mobile Compact Bar) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Flashcards */}
            <button
              onClick={onOpenFlashcards}
              className="inline-flex items-center px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all touch-manipulation"
              title="Flashcards"
            >
              <Layers className="w-3.5 h-3.5 sm:mr-1.5 text-indigo-600" />
              <span className="hidden sm:inline">Cards</span>
            </button>

            {/* Quiz */}
            <button
              onClick={onOpenQuiz}
              className="inline-flex items-center px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all touch-manipulation"
              title="Practice Quiz"
            >
              <Sparkles className="w-3.5 h-3.5 sm:mr-1.5 text-amber-500" />
              <span className="hidden sm:inline">Quiz</span>
            </button>

            {/* PDF Settings */}
            <button
              onClick={onOpenPdfSettings}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all touch-manipulation"
              title="PDF Options"
            >
              <SlidersHorizontal className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-slate-600" />
            </button>

            {/* Print / Save PDF */}
            <button
              onClick={onPrint}
              className="hidden md:inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 active:scale-95 transition-all"
              title="Print document or Save as vector PDF"
            >
              <Printer className="w-3.5 h-3.5 mr-1 text-blue-600" />
              Print
            </button>

            {/* Download PDF (.pdf) */}
            <button
              onClick={onDownloadPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center px-3 sm:px-4 py-1.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 transition-all shadow-sm shadow-blue-600/30 disabled:opacity-50 touch-manipulation"
            >
              <Download className="w-3.5 h-3.5 sm:mr-1.5" />
              <span className="hidden sm:inline">{isGeneratingPdf ? 'Generating...' : 'PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
