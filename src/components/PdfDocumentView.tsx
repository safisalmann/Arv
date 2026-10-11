import React from 'react';
import { SynonymousGroup, MergedTargetWord } from '../utils/wordExtractor.ts';

export interface PdfViewOptions {
  columns: 1 | 2 | 3;
  fontSize: 'compact' | 'normal' | 'spacious';
  showExamTags: boolean;
  showAntonyms: boolean;
  filterGroupId: string | 'ALL';
}

interface PdfDocumentViewProps {
  groups: SynonymousGroup[];
  allWords: MergedTargetWord[];
  totalUniqueWords: number;
  totalExamAppearances: number;
  options: PdfViewOptions;
}

export const PdfDocumentView: React.FC<PdfDocumentViewProps> = ({
  groups,
  allWords,
  totalUniqueWords,
  totalExamAppearances,
  options,
}) => {
  const filteredGroups = React.useMemo(() => {
    if (options.filterGroupId === 'ALL') return groups;
    return groups.filter((g) => g.id === options.filterGroupId);
  }, [groups, options.filterGroupId]);

  const columnClass =
    options.columns === 1
      ? 'space-y-3'
      : options.columns === 3
      ? 'pdf-columns-3'
      : 'pdf-columns-2';

  const fontClass =
    options.fontSize === 'compact'
      ? 'text-[12px]'
      : options.fontSize === 'spacious'
      ? 'text-base'
      : 'text-sm';

  return (
    <div id="pdf-printable-document" className="bg-white text-slate-900 mx-auto max-w-[210mm] p-4 sm:p-10 shadow-sm print:shadow-none print:p-0">
      {/* ================= COVER PAGE ================= */}
      {options.filterGroupId === 'ALL' && (
        <div className="pdf-cover-page text-center py-8 sm:py-12 px-4 sm:px-6 border-b-2 border-slate-900 mb-8 print:border-none">
          <div className="inline-block px-3 py-1 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-md mb-4">
            Synonymous & Antonymous Target Vocabulary Book
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight mb-2">
            Target Vocabulary Masterbook
          </h1>
          <h2 className="text-lg sm:text-2xl font-bold text-blue-700 font-bangla mb-4">
            সমার্থক শব্দগুচ্ছ ও বিপরীত শব্দ সহ সাজানো শব্দভাণ্ডার (Synonyms & Antonyms)
          </h2>

          <p className="max-w-xl mx-auto text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-bangla">
            বিসিএস, সরকারি ব্যাংক ও বিশ্ববিদ্যালয় ভর্তি পরীক্ষার টার্গেট শব্দসমূহকে <strong>সমার্থক ভাবার্থের ক্রম অনুসারে (Synonymous Sequence)</strong> সাজানো হয়েছে (যেমন: <em>Abhor, Despise &rarr; Antonym: Love</em>; <em>Abstemious, Frugal, Parsimonious</em>; <em>Abundant</em>; <em>Acumen, Adroit, Astute, Dexterous, Efficient, Ingenious, Sagacious</em>; <em>Adequate</em>...)। সমার্থক শব্দের পরেই বিগত প্রশ্ন থেকে সঠিক বিপরীত শব্দ (Antonyms) সংযুক্ত করা হয়েছে।
          </p>

          {/* Highlights Box */}
          <div className="grid grid-cols-3 gap-2.5 max-w-lg mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 text-center">
            <div>
              <div className="text-2xl font-black text-blue-600">{groups.length}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Synonym Groups</div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{totalUniqueWords}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Target Words</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-600">{totalExamAppearances}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Questions</div>
            </div>
          </div>

          {/* Table of Contents Synonymous Matrix */}
          <div className="border border-slate-200 rounded-xl p-3 bg-white max-w-xl mx-auto">
            <h4 className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-2.5 text-left">
              Table of Contents • Synonymous Word Progression:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs text-left">
              {groups.map((grp) => (
                <div
                  key={grp.id}
                  className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 truncate"
                >
                  <span className="font-bold text-slate-900 mr-1">#{String(grp.groupNumber).padStart(2, '0')}</span>
                  <span className="font-bold text-blue-700">{grp.leadWord}</span>
                  <span className="text-[10px] text-slate-400 ml-1">({grp.totalWordsCount}w)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= SYNONYMOUS GROUPS SEQUENCE ================= */}
      <div className="space-y-8">
        <div className="text-center mb-6 no-print">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Vocabulary Serialized by Synonymous Word Groups
          </h2>
          <p className="text-xs text-slate-500 font-bangla mt-1">
            সমার্থক শব্দগুলো ক্রমানুসারে সাজানো এবং প্রতিটি গ্রুপের পর বিপরীত শব্দ সংযোজিত
          </p>
        </div>

        {filteredGroups.map((grp) => {
          return (
            <div
              key={grp.id}
              id={`group-${grp.id}`}
              className="pdf-section-break border-b border-slate-200 pb-6 last:border-b-0"
            >
              {/* Synonymous Group Header Banner */}
              <div className="flex items-center justify-between bg-slate-900 text-white px-4 py-2.5 rounded-xl mb-4 pdf-avoid-break">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500 text-white font-black text-sm flex items-center justify-center shrink-0">
                    {String(grp.groupNumber).padStart(2, '0')}
                  </div>
                  <div>
                    <h3 className="font-black text-sm sm:text-base tracking-wide flex items-center gap-2">
                      <span>{grp.leadWord} Group</span>
                      <span className="text-xs text-blue-300 font-medium font-bangla hidden sm:inline">• {grp.titleBangla}</span>
                    </h3>
                    <p className="text-[11px] text-slate-300 font-bangla">
                      {grp.titleBangla} ({grp.titleEnglish})
                    </p>
                  </div>
                </div>
                <div>
                  <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full shrink-0">
                    {grp.totalWordsCount} {grp.totalWordsCount === 1 ? 'Word' : 'Words'}
                  </span>
                </div>
              </div>

              {/* Group Words in Columns */}
              <div className={columnClass}>
                {grp.words.map((entry) => (
                  <div
                    key={`word-${entry.id}`}
                    className="pdf-avoid-break bg-slate-50/70 border border-slate-200/90 rounded-xl p-3 sm:p-3.5 mb-2.5 hover:bg-slate-100/80 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <div className="flex items-baseline space-x-2 flex-wrap">
                        <span className="font-mono text-[11px] font-black text-slate-400">
                          #{String(entry.serialNumber).padStart(3, '0')}
                        </span>
                        <span className={`font-black text-slate-950 ${fontClass}`}>
                          {entry.displayWord}
                        </span>
                      </div>

                      {entry.occurrences > 1 && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md font-mono shrink-0">
                          {entry.occurrences}x questions
                        </span>
                      )}
                    </div>

                    {/* Bangla Meanings (No label) */}
                    <div className="mt-1 font-bangla font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      {entry.combinedMeaningText}
                    </div>

                    {/* Antonyms for this word from question set */}
                    {options.showAntonyms && entry.antonyms && entry.antonyms.length > 0 && (
                      <div className="mt-2 pt-1.5 border-t border-rose-100 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase text-rose-700 tracking-wider">Antonym:</span>
                        {entry.antonyms.map((ant) => (
                          <span
                            key={ant.word}
                            className="font-bold text-xs sm:text-sm text-rose-950 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md flex items-center gap-1"
                          >
                            <span>{ant.word}</span>
                            {ant.meaningBangla && ant.meaningBangla !== 'বিপরীত শব্দ' && (
                              <span className="text-[11px] text-rose-700 font-bangla font-semibold">({ant.meaningBangla})</span>
                            )}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Exam Tags */}
                    {options.showExamTags && entry.examTags.length > 0 && (
                      <div className="mt-1.5 text-[10px] text-slate-500 font-medium truncate" title={entry.examTags.join(', ')}>
                        <span className="text-slate-400 font-normal">Exams: </span>
                        {entry.examTags.slice(0, 3).join('; ')}
                        {entry.examTags.length > 3 && ' ...'}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Antonymous Words after the synonymous words for this group */}
              {options.showAntonyms && grp.groupAntonyms && grp.groupAntonyms.length > 0 && (
                <div className="pdf-avoid-break mt-3.5 bg-rose-50/80 border border-rose-200/90 rounded-xl p-3 sm:p-3.5">
                  <div className="flex items-center gap-1.5 mb-2 text-rose-800">
                    <span className="text-[11px] font-black uppercase tracking-wider">
                      Antonymous Words (বিপরীত শব্দ • {grp.leadWord} Group)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {grp.groupAntonyms.map((ant) => (
                      <span
                        key={ant.word}
                        className="bg-white border border-rose-200 text-rose-950 font-bold text-xs sm:text-sm px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs"
                      >
                        <span className="font-black text-rose-900">{ant.word}</span>
                        {ant.meaningBangla && ant.meaningBangla !== 'বিপরীত শব্দ' && (
                          <span className="text-xs text-rose-700 font-bangla font-semibold">
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
          );
        })}
      </div>

      {/* Footer info for print */}
      <div className="mt-12 pt-4 border-t border-slate-300 text-center text-xs text-slate-500 pdf-avoid-break">
        <p className="font-bold text-slate-700">
          Target Vocabulary Masterbook — Serialized by Synonymous Word Groups & Antonyms
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5 font-bangla">
          বিসিএস, সরকারি ব্যাংক ও বিশ্ববিদ্যালয় ভর্তি পরীক্ষার প্রস্তুতিমূলক শব্দভাণ্ডার
        </p>
      </div>
    </div>
  );
};
