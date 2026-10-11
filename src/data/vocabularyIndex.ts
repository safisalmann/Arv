import { VocabularyQuestion, VOCABULARY_QUESTIONS_PART1 } from './vocabularyRaw1.ts';
import { VOCABULARY_QUESTIONS_PART2 } from './vocabularyRaw2.ts';
import { VOCABULARY_QUESTIONS_PART3 } from './vocabularyRaw3.ts';
import { VOCABULARY_QUESTIONS_PART4 } from './vocabularyRaw4.ts';
import { VOCABULARY_QUESTIONS_PART5 } from './vocabularyRaw5.ts';
import { VOCABULARY_QUESTIONS_PART6 } from './vocabularyRaw6.ts';
import { VOCABULARY_QUESTIONS_PART7 } from './vocabularyRaw7.ts';

export type { VocabularyQuestion };

export const ALL_VOCABULARY_QUESTIONS: VocabularyQuestion[] = [
  ...VOCABULARY_QUESTIONS_PART1,
  ...VOCABULARY_QUESTIONS_PART2,
  ...VOCABULARY_QUESTIONS_PART3,
  ...VOCABULARY_QUESTIONS_PART4,
  ...VOCABULARY_QUESTIONS_PART5,
  ...VOCABULARY_QUESTIONS_PART6,
  ...VOCABULARY_QUESTIONS_PART7,
];
