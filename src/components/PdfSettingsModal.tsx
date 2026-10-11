import React from 'react';
import { X, SlidersHorizontal, Download, Printer } from 'lucide-react';
import { PdfViewOptions } from './PdfDocumentView.tsx';
import { SynonymousGroup } from '../utils/wordExtractor.ts';

interface PdfSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: PdfViewOptions;
  onChangeOptions: (newOptions: PdfViewOptions) => void;
  groups: SynonymousGroup[];
  onDownloadPdf: () => void;
  onPrintPdf: () => void;
  isGeneratingPdf: boolean;
}

export const PdfSettingsModal: React.FC<PdfSettingsModalProps> = ({
  isOpen,
  onClose,
  options,
  onChangeOptions,
  groups,
  onDownloadPdf,
  onPrintPdf,
  isGeneratingPdf,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">PDF & Print Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 text-xs text-slate-700">
          {/* Columns */}
          <div>
            <label className="block font-bold text-slate-900 mb-2">Column Layout</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { count: 1, label: '1 Column', desc: 'Detailed' },
                { count: 2, label: '2 Columns', desc: 'Book Format' },
                { count: 3, label: '3 Columns', desc: 'Compact Pocket' },
              ].map((col) => (
                <button
                  key={col.count}
                  onClick={() => onChangeOptions({ ...options, columns: col.count as 1 | 2 | 3 })}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    options.columns === col.count
                      ? 'border-blue-600 bg-blue-50/50 font-bold text-blue-900 ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold">{col.label}</div>
                  <span className="text-[10px] text-slate-500">{col.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <label className="block font-bold text-slate-900 mb-2">Font Size</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { size: 'compact', label: 'Compact (11pt)' },
                { size: 'normal', label: 'Standard (12pt)' },
                { size: 'spacious', label: 'Large (14pt)' },
              ].map((f) => (
                <button
                  key={f.size}
                  onClick={() => onChangeOptions({ ...options, fontSize: f.size as any })}
                  className={`py-2 px-3 rounded-xl border text-center font-semibold transition-all ${
                    options.fontSize === f.size
                      ? 'border-blue-600 bg-blue-50/50 text-blue-900 ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scope Filter: All Synonymous Groups or Specific Group */}
          <div>
            <label className="block font-bold text-slate-900 mb-1.5">Synonymous Group Scope</label>
            <select
              value={options.filterGroupId}
              onChange={(e) => onChangeOptions({ ...options, filterGroupId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50"
            >
              <option value="ALL">All {groups.length} Synonymous Groups (Full Book)</option>
              {groups.map((grp) => (
                <option key={grp.id} value={grp.id}>
                  #{String(grp.groupNumber).padStart(2, '0')} {grp.leadWord} Group ({grp.titleBangla}) - {grp.totalWordsCount}w
                </option>
              ))}
            </select>
          </div>

          {/* Toggles */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-medium text-slate-700">Display Antonymous Words (বিপরীত শব্দ)</span>
              <input
                type="checkbox"
                checked={options.showAntonyms}
                onChange={(e) => onChangeOptions({ ...options, showAntonyms: e.target.checked })}
                className="w-4 h-4 text-rose-600 rounded-sm border-slate-300 focus:ring-rose-500"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-medium text-slate-700">Display BCS & Admission Exam References</span>
              <input
                type="checkbox"
                checked={options.showExamTags}
                onChange={(e) => onChangeOptions({ ...options, showExamTags: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 text-xs"
          >
            Close
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onClose();
                onPrintPdf();
              }}
              className="inline-flex items-center px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-bold hover:bg-blue-100 text-xs"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Print
            </button>

            <button
              onClick={() => {
                onClose();
                onDownloadPdf();
              }}
              disabled={isGeneratingPdf}
              className="inline-flex items-center px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 text-xs disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              {isGeneratingPdf ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
