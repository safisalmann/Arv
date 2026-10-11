import React, { useState, useMemo, useRef } from 'react';
import {
  Search,
  Download,
  Printer,
  SlidersHorizontal,
  Sparkles,
  Layers,
  ArrowUp,
  FileText,
  Grid3X3,
  HelpCircle,
  FolderKanban,
  CheckCircle2,
} from 'lucide-react';
import { extractTargetWordsBySynonyms, MergedTargetWord } from './utils/wordExtractor.ts';
import { ALL_VOCABULARY_QUESTIONS } from './data/vocabularyIndex.ts';
import { Navbar } from './components/Navbar.tsx';
import { SynonymGroupBar } from './components/SynonymGroupBar.tsx';
import { WordCard } from './components/WordCard.tsx';
import { PdfDocumentView, PdfViewOptions } from './components/PdfDocumentView.tsx';
import { PdfSettingsModal } from './components/PdfSettingsModal.tsx';
import { FlashcardModal } from './components/FlashcardModal.tsx';
import { QuizModal } from './components/QuizModal.tsx';
import { generateAndDownloadPdf, triggerBrowserPrint, PdfGenerationProgress } from './utils/pdfDownloader.ts';

export default function App() {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Extracted target vocabulary data serialized by SYNONYMOUS GROUPS
  const { synonymousGroups, allSerializedWords, totalUniqueTargetWords, totalExamAppearances } = useMemo(() => {
    return extractTargetWordsBySynonyms(ALL_VOCABULARY_QUESTIONS);
  }, []);

  // UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string | 'ALL'>('ALL');
  const [activeTab, setActiveTab] = useState<'synonym_serial' | 'groups_overview' | 'pdf_preview'>('synonym_serial');

  // Modals
  const [isPdfSettingsOpen, setIsPdfSettingsOpen] = useState(false);
  const [isFlashcardsOpen, setIsFlashcardsOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // PDF Generation State
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfProgress, setPdfProgress] = useState<PdfGenerationProgress | null>(null);

  // PDF Options
  const [pdfOptions, setPdfOptions] = useState<PdfViewOptions>({
    columns: 2,
    fontSize: 'normal',
    showExamTags: true,
    showAntonyms: true,
    filterGroupId: 'ALL',
  });

  // Filtered Target Words in Synonymous Order
  const filteredWords = useMemo(() => {
    let result = allSerializedWords;

    if (selectedGroupId !== 'ALL') {
      result = result.filter((w) => w.groupId === selectedGroupId);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (w) =>
          w.normalizedWord.includes(q) ||
          w.combinedMeaningText.includes(q) ||
          w.examTags.some((t) => t.toLowerCase().includes(q)) ||
          w.groupNameBangla.includes(q) ||
          w.antonyms.some((a) => a.word.toLowerCase().includes(q) || a.meaningBangla.includes(q))
      );
    }

    return result;
  }, [allSerializedWords, selectedGroupId, searchQuery]);

  // Handlers
  const handlePrint = () => {
    triggerBrowserPrint();
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await generateAndDownloadPdf(
        'pdf-printable-document',
        `Synonymous_Target_Vocabulary_Masterbook.pdf`,
        (progress) => {
          setPdfProgress(progress);
        }
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPdf(false);
      setTimeout(() => setPdfProgress(null), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFocusSearch = () => {
    searchInputRef.current?.focus();
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-500 selection:text-white pb-20 md:pb-6">
      {/* Navbar with stats & PDF actions */}
      <Navbar
        totalWords={totalExamAppearances}
        uniqueWords={totalUniqueTargetWords}
        totalQuestions={ALL_VOCABULARY_QUESTIONS.length}
        onOpenPdfSettings={() => setIsPdfSettingsOpen(true)}
        onPrint={handlePrint}
        onDownloadPdf={handleDownloadPdf}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenFlashcards={() => setIsFlashcardsOpen(true)}
        isGeneratingPdf={isGeneratingPdf}
      />

      {/* Synonymous Group Navigation Bar (Abhor, Abstemious, Abundant, Acumen, Adequate...) */}
      <SynonymGroupBar
        groups={synonymousGroups}
        selectedGroupId={selectedGroupId}
        onSelectGroup={(groupId) => {
          setSelectedGroupId(groupId);
          if (pdfOptions.filterGroupId !== groupId && groupId !== 'ALL') {
            setPdfOptions((prev) => ({ ...prev, filterGroupId: groupId }));
          }
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Banner Section - Synonymous Sequence Emphasis */}
        <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 rounded-3xl text-white p-5 sm:p-8 mb-5 sm:mb-6 shadow-xl relative overflow-hidden no-print">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center space-x-1.5 bg-blue-500/20 border border-blue-400/30 px-2.5 py-1 rounded-full text-[11px] font-bold text-blue-200 mb-2.5">
              <Sparkles className="w-3 h-3 text-blue-300" />
              <span>Serialized by Synonymous Words</span>
            </div>

            <h2 className="text-xl sm:text-3xl font-black tracking-tight leading-snug">
              Target Vocabulary Serialized by Synonyms
            </h2>
            <p className="mt-1.5 text-slate-300 text-xs sm:text-sm leading-relaxed font-bangla">
              শব্দগুলো সাধারণ বর্ণমালার বদলে <strong>সমার্থক শব্দের ক্রম অনুসারে</strong> পাশাপাশি সাজানো হয়েছে (যেমন: <em>Abhor</em> &rarr; <em>Abstemious, Frugal, Parsimonious, Parsimony</em> &rarr; <em>Abundant, Copious, Profusion, Surfeit</em> &rarr; <em>Acumen, Adroit, Astute, Dexterous, Efficient, Ingenious, Sagacious</em> &rarr; <em>Adequate</em>...)।
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-6">
              <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2.5 sm:p-3 border border-white/10 text-center">
                <div className="text-lg sm:text-2xl font-black text-blue-400">{synonymousGroups.length}</div>
                <div className="text-[10px] sm:text-xs text-slate-300 uppercase font-semibold">Synonym Groups</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2.5 sm:p-3 border border-white/10 text-center">
                <div className="text-lg sm:text-2xl font-black text-emerald-400">{totalUniqueTargetWords}</div>
                <div className="text-[10px] sm:text-xs text-slate-300 uppercase font-semibold">Target Words</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2.5 sm:p-3 border border-white/10 text-center">
                <div className="text-lg sm:text-2xl font-black text-amber-400">{totalExamAppearances}</div>
                <div className="text-[10px] sm:text-xs text-slate-300 uppercase font-semibold">Questions</div>
              </div>
            </div>

            {/* Top Action Row */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4 sm:mt-6">
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 active:scale-95 font-black text-xs sm:text-sm text-white transition-all shadow-md disabled:opacity-50 touch-manipulation"
              >
                <Download className="w-4 h-4 mr-2" />
                {isGeneratingPdf ? 'Generating PDF...' : 'Download Synonymous PDF'}
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 font-bold text-xs sm:text-sm text-white transition-all touch-manipulation"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print A4
              </button>

              <button
                onClick={() => setIsPdfSettingsOpen(true)}
                className="inline-flex items-center justify-center p-2.5 sm:px-3.5 sm:py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 font-medium text-xs sm:text-sm text-slate-200 transition-all touch-manipulation"
                title="Settings"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* View Mode Tabs & Filter Controls */}
        <section className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 mb-5 shadow-2xs no-print space-y-3">
          {/* Search Input */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search target word, বাংলা অর্থ, exam, similar word..."
              className="w-full pl-10 pr-9 py-2.5 sm:py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold p-1"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
            {/* View Switcher Tabs */}
            <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl overflow-x-auto scrollbar-none shrink-0">
              <button
                onClick={() => setActiveTab('synonym_serial')}
                className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap touch-manipulation ${
                  activeTab === 'synonym_serial'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Grid3X3 className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                Synonym Serial ({filteredWords.length})
              </button>

              <button
                onClick={() => setActiveTab('groups_overview')}
                className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap touch-manipulation ${
                  activeTab === 'groups_overview'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FolderKanban className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                Groups Overview ({synonymousGroups.length})
              </button>

              <button
                onClick={() => setActiveTab('pdf_preview')}
                className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap touch-manipulation ${
                  activeTab === 'pdf_preview'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5 mr-1.5 text-blue-700" />
                PDF Book View
              </button>
            </div>

            {/* Synonymous Group Selector Dropdown */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="w-full sm:w-auto px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 focus:outline-hidden"
              >
                <option value="ALL">All Synonymous Groups</option>
                {synonymousGroups.map((grp) => (
                  <option key={grp.id} value={grp.id}>
                    #{String(grp.groupNumber).padStart(2, '0')} {grp.leadWord} Group ({grp.titleBangla})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Tab 1: Synonymous Serial Words View */}
        {activeTab === 'synonym_serial' && (
          <section className="no-print">
            {filteredWords.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center">
                <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No words match your filter</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Try clearing your search query or selecting All Synonymous Groups.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedGroupId('ALL');
                  }}
                  className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="text-xs text-slate-500 font-medium font-bangla">
                    মোট <strong className="text-slate-900">{filteredWords.length}</strong>টি শব্দ সমার্থক ক্রমানুসারে প্রদর্শিত
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    Synonymous Progression
                  </div>
                </div>

                {/* Mobile Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {filteredWords.map((entry) => (
                    <WordCard
                      key={entry.id}
                      entry={entry}
                      onFilterSimilar={(simWord) => {
                        setSearchQuery(simWord);
                        window.scrollTo({ top: 220, behavior: 'smooth' });
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Tab 2: Synonymous Groups Overview */}
        {activeTab === 'groups_overview' && (
          <section className="space-y-4 no-print">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 sm:p-4 text-xs text-blue-900 flex items-center justify-between">
              <div>
                <strong className="block text-sm sm:text-base font-bold">সমার্থক ভাবার্থের গ্রুপসমূহ (Synonymous Groups)</strong>
                <span className="text-[11px] sm:text-xs">প্রতিটি গ্রুপে সমার্থক শব্দগুলো সারিবদ্ধভাবে সাজানো রয়েছে।</span>
              </div>
              <span className="font-black bg-blue-200/80 text-blue-950 px-2.5 py-1 rounded-full text-xs shrink-0">
                {synonymousGroups.length} Groups
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
              {synonymousGroups.map((grp) => (
                <div
                  key={grp.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-blue-400 transition-all"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {grp.groupNumber}
                      </span>
                      <div>
                        <h4 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                          <span>{grp.leadWord} Group</span>
                          <span className="text-xs text-blue-600 font-bangla font-semibold hidden sm:inline">• {grp.titleBangla}</span>
                        </h4>
                        <span className="text-[10px] sm:text-xs text-slate-500 font-medium font-bangla">{grp.titleBangla} ({grp.titleEnglish})</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full shrink-0">
                      {grp.totalWordsCount} Words
                    </span>
                  </div>

                  <div className="space-y-2">
                    {grp.words.map((w) => (
                      <div
                        key={w.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between text-xs"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-black text-sm text-slate-950 flex items-center gap-1.5">
                            <span className="text-slate-400 text-xs font-mono">#{String(w.serialNumber).padStart(3, '0')}</span>
                            <span>{w.displayWord}</span>
                            {w.occurrences > 1 && (
                              <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-mono font-bold">
                                {w.occurrences}x
                              </span>
                            )}
                          </div>
                          <p className="font-bangla font-bold text-slate-900 text-xs sm:text-sm mt-0.5">
                            {w.combinedMeaningText}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {grp.groupAntonyms && grp.groupAntonyms.length > 0 && (
                    <div className="mt-3 p-3 rounded-xl bg-rose-50/80 border border-rose-100">
                      <div className="flex items-center gap-1.5 mb-1.5 text-rose-800">
                        <span className="text-[10px] font-black uppercase tracking-wider">
                          Antonyms (বিপরীত শব্দ • {grp.leadWord})
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {grp.groupAntonyms.map((ant) => (
                          <span
                            key={ant.word}
                            className="px-2.5 py-1 rounded-lg bg-white border border-rose-200 text-rose-950 font-bold text-xs flex items-center gap-1.5 shadow-2xs"
                          >
                            <span className="font-black text-rose-900">{ant.word}</span>
                            {ant.meaningBangla && ant.meaningBangla !== 'বিপরীত শব্দ' && (
                              <span className="text-[11px] text-rose-700 font-bangla font-semibold">
                                ({ant.meaningBangla})
                              </span>
                            )}
                            {ant.forTargetWord && (
                              <span className="text-[10px] text-slate-400 font-medium">
                                [opp. {ant.forTargetWord}]
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tab 3: Live PDF Book View */}
        <div className={activeTab === 'pdf_preview' ? 'block' : 'print-only hidden'}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5 sm:p-4 mb-4 flex items-center justify-between no-print">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                  Synonymous Progression PDF Book View
                </h3>
                <p className="text-[11px] text-slate-500 font-bangla hidden sm:block">
                  সমার্থক শব্দগুচ্ছ ক্রমানুসারে সাজানো প্রিন্টেবল মাস্টারবুক।
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsPdfSettingsOpen(true)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Layout
              </button>
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 hover:bg-blue-100 flex items-center"
              >
                <Printer className="w-3.5 h-3.5 mr-1" />
                Print
              </button>
            </div>
          </div>

          <PdfDocumentView
            groups={synonymousGroups}
            allWords={allSerializedWords}
            totalUniqueWords={totalUniqueTargetWords}
            totalExamAppearances={totalExamAppearances}
            options={pdfOptions}
          />
        </div>
      </main>

      {/* Floating Mobile Bottom Bar */}
      <div className="fixed bottom-3 left-3 right-3 z-40 md:hidden no-print">
        <div className="bg-slate-900/95 backdrop-blur-lg text-white rounded-2xl p-2 px-3 shadow-2xl border border-slate-800 flex items-center justify-between gap-1">
          <button
            onClick={handleFocusSearch}
            className="flex flex-col items-center justify-center p-1.5 px-2 rounded-xl text-slate-300 hover:text-white active:bg-white/10 text-[10px] font-bold"
          >
            <Search className="w-4 h-4 mb-0.5 text-blue-400" />
            <span>Search</span>
          </button>

          <button
            onClick={() => setIsFlashcardsOpen(true)}
            className="flex flex-col items-center justify-center p-1.5 px-2 rounded-xl text-slate-300 hover:text-white active:bg-white/10 text-[10px] font-bold"
          >
            <Layers className="w-4 h-4 mb-0.5 text-indigo-400" />
            <span>Cards</span>
          </button>

          <button
            onClick={() => setIsQuizOpen(true)}
            className="flex flex-col items-center justify-center p-1.5 px-2 rounded-xl text-slate-300 hover:text-white active:bg-white/10 text-[10px] font-bold"
          >
            <Sparkles className="w-4 h-4 mb-0.5 text-amber-400" />
            <span>Quiz</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 text-white active:scale-95 text-xs font-black shadow-md shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>

          <button
            onClick={scrollToTop}
            className="p-2 rounded-xl bg-white/10 text-slate-300 hover:text-white active:bg-white/20"
            title="Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Desktop Floating Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="hidden md:flex fixed bottom-6 right-6 p-3.5 rounded-2xl bg-slate-900 text-white shadow-xl hover:bg-blue-600 active:scale-95 transition-all z-30 no-print"
        title="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      {/* PDF Generation Progress Notification */}
      {isGeneratingPdf && (
        <div className="fixed bottom-20 md:bottom-6 left-3 md:left-6 right-3 md:right-auto z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-3 text-xs animate-in slide-in-from-bottom duration-200 no-print">
          <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin shrink-0" />
          <div>
            <div className="font-bold">Generating Synonymous Masterbook PDF...</div>
            <div className="text-slate-300 text-[11px] mt-0.5">{pdfProgress?.message || 'Processing high-res text...'}</div>
          </div>
        </div>
      )}

      {/* Modals */}
      <PdfSettingsModal
        isOpen={isPdfSettingsOpen}
        onClose={() => setIsPdfSettingsOpen(false)}
        options={pdfOptions}
        onChangeOptions={setPdfOptions}
        groups={synonymousGroups}
        onDownloadPdf={handleDownloadPdf}
        onPrintPdf={handlePrint}
        isGeneratingPdf={isGeneratingPdf}
      />

      <FlashcardModal
        isOpen={isFlashcardsOpen}
        onClose={() => setIsFlashcardsOpen(false)}
        words={filteredWords}
      />

      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-8 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 font-bangla">
          <div className="font-medium text-slate-700">
            সমার্থক শব্দগুচ্ছ ক্রমানুসারে সাজানো টার্গেট ভোকাবুলারি মাস্টারবুক (Synonymous Serial)
          </div>
          <div>
            বিসিএস, সরকারি ব্যাংক ও বিশ্ববিদ্যালয় ভর্তি পরীক্ষার বিগত প্রশ্নাবলী
          </div>
        </div>
      </footer>
    </div>
  );
}
