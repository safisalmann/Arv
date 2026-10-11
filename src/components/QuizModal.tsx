import React, { useState } from 'react';
import { X, CheckCircle, XCircle, RotateCcw, Award } from 'lucide-react';
import { ALL_VOCABULARY_QUESTIONS, VocabularyQuestion } from '../data/vocabularyIndex.ts';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose }) => {
  const [questions, setQuestions] = useState<VocabularyQuestion[]>(() => getRandomQuestions(5));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  function getRandomQuestions(count: number): VocabularyQuestion[] {
    const shuffled = [...ALL_VOCABULARY_QUESTIONS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  const restartQuiz = () => {
    setQuestions(getRandomQuestions(5));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];
  // Map 'a' -> 0, 'b' -> 1, 'c' -> 2, 'd' -> 3
  const correctOptionIndex = currentQ.correctAnswer.charCodeAt(0) - 97;

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);
    if (index === correctOptionIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-900 text-sm">BCS & Admission Vocab Quiz</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {!quizFinished ? (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Question {currentIndex + 1} of {questions.length}</span>
                <span className="font-bold text-blue-600">Score: {score}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-4">
                <div
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Box */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-4">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Exam: {currentQ.examTag}
                </span>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                  {currentQ.question}
                </h4>
                <div className="mt-2 text-xs text-slate-600 font-bangla">
                  Target Word: <strong className="text-blue-700 capitalize">{currentQ.targetWord}</strong> ({currentQ.wordMeaningBangla})
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2 mb-4">
                {currentQ.options.map((opt, idx) => {
                  const letterPrefix = String.fromCharCode(65 + idx);
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = idx === correctOptionIndex;

                  let btnStyle = 'border-slate-200 hover:bg-slate-50 text-slate-800';
                  if (isAnswered) {
                    if (isCorrect) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                    } else if (isSelected) {
                      btnStyle = 'border-rose-500 bg-rose-50 text-rose-900';
                    } else {
                      btnStyle = 'border-slate-200 opacity-60 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex items-center justify-between ${btnStyle}`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                          {letterPrefix}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isAnswered && isCorrect && (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {isAnswered && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box when answered */}
              {isAnswered && (
                <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3 text-xs text-slate-700 font-bangla mb-4 animate-in fade-in duration-200">
                  <div className="font-bold text-blue-900 mb-1">ব্যাখ্যা ও বাংলা অর্থ:</div>
                  <div className="leading-relaxed">{currentQ.explanationBangla}</div>
                </div>
              )}

              {/* Next Button */}
              {isAnswered && (
                <button
                  onClick={handleNext}
                  className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors"
                >
                  {currentIndex + 1 === questions.length ? 'See Final Score' : 'Next Question'}
                </button>
              )}
            </div>
          ) : (
            /* Results Screen */
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Quiz Completed!</h3>
              <p className="text-sm text-slate-500 mt-1">
                You scored <strong className="text-blue-600 text-lg">{score}</strong> out of{' '}
                <strong>{questions.length}</strong>
              </p>

              <div className="mt-6 flex items-center justify-center space-x-3">
                <button
                  onClick={restartQuiz}
                  className="inline-flex items-center px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Try Another Quiz
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
                >
                  Back to Dictionary
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
