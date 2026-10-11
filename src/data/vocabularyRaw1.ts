export interface VocabularyQuestion {
  id: number;
  question: string;
  targetWord: string;
  type: 'synonym' | 'antonym' | 'meaning';
  examTag: string;
  options: string[];
  correctAnswer: 'a' | 'b' | 'c' | 'd' | 'e';
  wordMeaningBangla: string;
  explanationBangla: string;
  category?: string;
}

export const VOCABULARY_QUESTIONS_PART1: VocabularyQuestion[] = [
  {
    id: 1,
    question: "The correct meaning of the word 'deliberate' is-",
    targetWord: "deliberate",
    type: "meaning",
    examTag: "RU (E) 13-14, পরিসংখ্যান সহকারী-২০",
    options: ["known", "intentional", "familiar", "willingly"],
    correctAnswer: "b",
    wordMeaningBangla: "ইচ্ছাকৃত",
    explanationBangla: "known - পরিচিত, intentional - ইচ্ছাকৃত, familiar - পরিচিত, willingly - ইচ্ছাকৃতভাবে"
  },
  {
    id: 2,
    question: "The word 'Lately' is close in meaning to -",
    targetWord: "Lately",
    type: "meaning",
    examTag: "CU (H2) 12-13",
    options: ["late", "later", "recent", "recently"],
    correctAnswer: "d",
    wordMeaningBangla: "সাম্প্রতিককালে",
    explanationBangla: "late - বিলম্বিত, later - পরবর্তীতে, recent - সাম্প্রতিক, recently - সাম্প্রতিককালে"
  },
  {
    id: 3,
    question: "The synonym of the word 'word' is -",
    targetWord: "word",
    type: "synonym",
    examTag: "RU (B-Law) 12-13",
    options: ["vocable", "name", "noun", "initial"],
    correctAnswer: "a",
    wordMeaningBangla: "অর্থপূর্ণ শব্দ",
    explanationBangla: "vocable - অর্থপূর্ণ শব্দ, name - নাম, noun - বিশেষ্য, initial - প্রাথমিক"
  },
  {
    id: 4,
    question: "The antonym of 'different' is -",
    targetWord: "different",
    type: "antonym",
    examTag: "বিদ্যুৎ উন্নয়ন বোর্ডের হিসাব সহকারী-১২",
    options: ["indifferent", "callous", "separate", "similar"],
    correctAnswer: "d",
    wordMeaningBangla: "ভিন্ন",
    explanationBangla: "indifferent - উদাসীন, callous - অনুভূতিহীন, separate - আলাদা, similar - অনুরূপ"
  },
  {
    id: 5,
    question: "What is the synonym for the word 'indifferent'?",
    targetWord: "indifferent",
    type: "synonym",
    examTag: "NU (বিজ্ঞান) 13-14",
    options: ["Similar", "Unhappy", "Careless", "Frank"],
    correctAnswer: "c",
    wordMeaningBangla: "উদাসীন",
    explanationBangla: "similar - সদৃশ, unhappy - অসুখী, careless - অসতর্ক/উদাসীন, frank - অকপট"
  },
  {
    id: 6,
    question: "What is the antonym of 'appoint'?",
    targetWord: "appoint",
    type: "antonym",
    examTag: "NU (বিজ্ঞান) 11-12",
    options: ["disappoint", "misappoint", "promote", "sack"],
    correctAnswer: "d",
    wordMeaningBangla: "নিয়োগ করা",
    explanationBangla: "disappoint - হতাশ করা, misappoint - ভুল নিয়োগ, promote - পদোন্নতি দেওয়া, sack - বরখাস্ত করা"
  },
  {
    id: 7,
    question: "Choose the correct antonym of 'disappointment'?",
    targetWord: "disappointment",
    type: "antonym",
    examTag: "RU (B-Law) 09-10",
    options: ["satisfaction", "hope", "praise", "appointment"],
    correctAnswer: "a",
    wordMeaningBangla: "হতাশা, অসন্তুষ্টি",
    explanationBangla: "satisfaction - সন্তুষ্টি, hope - আশা, praise - প্রশংসা, appointment - নিয়োগ"
  },
  {
    id: 8,
    question: "What is the antonym of 'indifferent'?",
    targetWord: "indifferent",
    type: "antonym",
    examTag: "JnU (D) 06-07, RU (C) 16-17",
    options: ["detached", "interested", "different", "related"],
    correctAnswer: "b",
    wordMeaningBangla: "উদাসীন",
    explanationBangla: "detached - বিচ্ছিন্ন, interested - আগ্রহী, different - ভিন্ন, related - সম্পর্কিত"
  },
  {
    id: 9,
    question: "What is the synonym for the word 'indifferent'?",
    targetWord: "indifferent",
    type: "synonym",
    examTag: "DU (C) 13-14",
    options: ["similar", "unhappy", "apathetic", "frank"],
    correctAnswer: "c",
    wordMeaningBangla: "উদাসীন",
    explanationBangla: "similar - সদৃশ, unhappy - অসুখী, apathetic - উদাসীন, frank - অকপট"
  },
  {
    id: 10,
    question: "The public didn't care about the trial and was apathetic about the verdict.",
    targetWord: "apathetic",
    type: "synonym",
    examTag: "CU (E) 15-16",
    options: ["enthusiastic", "enraged", "indifferent", "suspicious"],
    correctAnswer: "c",
    wordMeaningBangla: "উদাসীন",
    explanationBangla: "enthusiastic - অতি উৎসাহী, enraged - রাগান্বিত, indifferent - উদাসীন, suspicious - সন্দেহজনক"
  },
  {
    id: 11,
    question: "What would be the right antonym for 'initiative'?",
    targetWord: "initiative",
    type: "antonym",
    examTag: "36th BCS",
    options: ["apathy", "enterprise", "indolence", "activity"],
    correctAnswer: "a",
    wordMeaningBangla: "উদ্যোগ",
    explanationBangla: "apathy - অনীহা/উদাসীনতা, enterprise - উদ্যোগ, indolence - অলসতা, activity - কর্মতৎপরতা"
  },
  {
    id: 12,
    question: "What would be the right synonym for 'initiative'?",
    targetWord: "initiative",
    type: "synonym",
    examTag: "35th BCS, পল্লী সঞ্চয় ব্যাংক",
    options: ["apathy", "enterprise", "indolence", "activity"],
    correctAnswer: "b",
    wordMeaningBangla: "প্রথম পদক্ষেপ, উদ্যোগ",
    explanationBangla: "apathy - অনীহা, enterprise - উদ্যোগ, indolence - শ্রমবিমুখতা, activity - কার্যকলাপ"
  },
  {
    id: 13,
    question: "The correct meaning of the word 'indigenous' is -",
    targetWord: "indigenous",
    type: "meaning",
    examTag: "CU (E) 02-03, JU (D) 13-14",
    options: ["native", "backward", "insider", "poor"],
    correctAnswer: "a",
    wordMeaningBangla: "স্বদেশী, স্থানীয়",
    explanationBangla: "native - স্থানীয়/দেশজ, backward - অনগ্রসর, insider - ভেতরের লোক, poor - দরিদ্র"
  },
  {
    id: 14,
    question: "Antonym of 'Indigenous' is -",
    targetWord: "Indigenous",
    type: "antonym",
    examTag: "RU 09-10, NSTU 16-17",
    options: ["alien", "international", "remote", "domestic"],
    correctAnswer: "a",
    wordMeaningBangla: "দেশী, দেশজ",
    explanationBangla: "alien - বিদেশী/বহিরাগত, international - আন্তর্জাতিক, remote - প্রত্যন্ত, domestic - ঘরোয়া"
  },
  {
    id: 15,
    question: "The antonym of the word 'domestic' is -",
    targetWord: "domestic",
    type: "antonym",
    examTag: "JnU C 11-12",
    options: ["foreign", "home", "national", "none"],
    correctAnswer: "a",
    wordMeaningBangla: "ঘরোয়া, গৃহপালিত",
    explanationBangla: "foreign - বিদেশী, home - গৃহসংক্রান্ত, national - জাতীয়, none - কোনটিই নয়"
  },
  {
    id: 16,
    question: "FOREIGN (antonym) is -",
    targetWord: "Foreign",
    type: "antonym",
    examTag: "JU (ঞ) 11-12",
    options: ["native", "habitant", "domicile", "strange"],
    correctAnswer: "a",
    wordMeaningBangla: "বিদেশী",
    explanationBangla: "native - স্থানীয়/দেশজ, habitant - অধিবাসী, domicile - বাসস্থান, strange - অপরিচিত"
  },
  {
    id: 17,
    question: "The word 'Indigenous' is meaning of -",
    targetWord: "Indigenous",
    type: "meaning",
    examTag: "বাগেরহাট ১৫",
    options: ["Foreign", "Native", "Local", "Remote"],
    correctAnswer: "b",
    wordMeaningBangla: "স্বদেশজাত",
    explanationBangla: "Foreign - বিদেশী, Native - স্বদেশী/দেশজ, Local - স্থানীয়, Remote - দূরবর্তী"
  },
  {
    id: 18,
    question: "The antonym for 'Indigenous' is -",
    targetWord: "Indigenous",
    type: "antonym",
    examTag: "IU (C) 15-16",
    options: ["Herbal", "Local", "Foreign", "Home-grown"],
    correctAnswer: "c",
    wordMeaningBangla: "দেশী, স্বদেশী",
    explanationBangla: "Herbal - ভেষজ, Local - স্থানীয়, Foreign - বিদেশী, Home-grown - নিজের বাগানে উৎপন্ন"
  },
  {
    id: 19,
    question: "The meaning 'indigenous' is:",
    targetWord: "indigenous",
    type: "meaning",
    examTag: "RU (বিজ্ঞান) 07-08",
    options: ["native", "universal", "healthy", "international"],
    correctAnswer: "a",
    wordMeaningBangla: "স্থানীয়, স্বদেশজাত",
    explanationBangla: "native - দেশজ/স্থানীয়, universal - সার্বজনীন, healthy - স্বাস্থ্যকর, international - আন্তর্জাতিক"
  },
  {
    id: 20,
    question: "Which one is antonym to 'Indigenous'?",
    targetWord: "Indigenous",
    type: "antonym",
    examTag: "IU (ঙ) 04-05",
    options: ["Existing", "Alien", "International", "intelligent"],
    correctAnswer: "b",
    wordMeaningBangla: "দেশজ",
    explanationBangla: "Existing - বিদ্যমান, Alien - বিদেশী/বহিরাগত, International - আন্তর্জাতিক, intelligent - বুদ্ধিমান"
  },
  {
    id: 21,
    question: "What is the antonym of 'native'?",
    targetWord: "native",
    type: "antonym",
    examTag: "Medical 15-16, KU (L) 16-17",
    options: ["Alien", "Congenial", "Inborn", "Local"],
    correctAnswer: "a",
    wordMeaningBangla: "স্বদেশী, স্থানীয়",
    explanationBangla: "Alien - বিদেশী, Congenial - অনুকূল/উপযোগী, Inborn - সহজাত, Local - স্থানীয়"
  },
  {
    id: 22,
    question: "The antonym of the word 'alien' is -",
    targetWord: "alien",
    type: "antonym",
    examTag: "১০ম শিক্ষক নিবন্ধন-১৪",
    options: ["new comer", "native", "adverse", "foreigner"],
    correctAnswer: "b",
    wordMeaningBangla: "বিদেশী, বহিরাগত",
    explanationBangla: "new comer - নবাগত, native - স্বদেশী/স্থানীয়, adverse - প্রতিকূল, foreigner - বিদেশী"
  },
  {
    id: 23,
    question: "The antonym of 'alien' is -",
    targetWord: "alien",
    type: "antonym",
    examTag: "CU (D) 06-07, বাংলাদেশ ব্যাংক-১৩",
    options: ["native", "foreign", "exotic", "align"],
    correctAnswer: "a",
    wordMeaningBangla: "বহিরাগত",
    explanationBangla: "native - দেশীয়, foreign - বিদেশী, exotic - বহিরাগত, align - সারিবদ্ধ করা"
  },
  {
    id: 24,
    question: "The synonym of the word 'fecund' is :",
    targetWord: "fecund",
    type: "synonym",
    examTag: "সমাজসেবা অধিদপ্তর-১৮",
    options: ["fertile", "fake", "strong", "fact"],
    correctAnswer: "a",
    wordMeaningBangla: "উর্বর, প্রচুর উৎপাদনশীল",
    explanationBangla: "fertile - উর্বর, fake - জাল/নকল, strong - শক্তিশালী, fact - সত্য ঘটনা"
  },
  {
    id: 25,
    question: "Antonym of the word 'fecund' is :",
    targetWord: "fecund",
    type: "antonym",
    examTag: "সমাজসেবা অধিদপ্তর ফিল্ড সুপারভাইজার-১৮",
    options: ["sterile", "prolific", "distress", "rich"],
    correctAnswer: "a",
    wordMeaningBangla: "উর্বর",
    explanationBangla: "sterile - বন্ধ্যা/অনুর্বর, prolific - উর্বর/ফলপ্রসূ, distress - কষ্ট/দুর্ভোগ, rich - সমৃদ্ধ"
  },
  {
    id: 26,
    question: "The synonym of 'Concord' is-",
    targetWord: "Concord",
    type: "synonym",
    examTag: "BSMRSTU (E) 18-19",
    options: ["Mesmerise", "Intrude", "Thrive", "Harmony"],
    correctAnswer: "d",
    wordMeaningBangla: "মিল, সাদৃশ্য, ঐক্য",
    explanationBangla: "Mesmerise - মুগ্ধ করা, Intrude - জোর করে প্রবেশ করা, Thrive - সমৃদ্ধি লাভ করা, Harmony - মিল/সাদৃশ্য"
  },
  {
    id: 27,
    question: "Antonym of the word 'Concord' is-",
    targetWord: "Concord",
    type: "antonym",
    examTag: "মিলিটারি ইঞ্জিনিয়ার সার্ভিসেস-১৮",
    options: ["Conflict", "Saintly", "Thrifty", "Harmony"],
    correctAnswer: "a",
    wordMeaningBangla: "ঐক্য, সমঝোতা",
    explanationBangla: "Conflict - দ্বন্দ্ব/সংঘাত, Saintly - সাধুসম, Thrifty - মিতব্যয়ী, Harmony - সম্প্রীতি"
  },
  {
    id: 28,
    question: "The synonym of the word 'endure' is :",
    targetWord: "endure",
    type: "synonym",
    examTag: "সমাজসেবা অধিদপ্তর-১৮",
    options: ["tolerate", "bear", "close", "last"],
    correctAnswer: "a",
    wordMeaningBangla: "সহ্য করা, টিকে থাকা",
    explanationBangla: "tolerate - সহ্য করা, bear - সহ্য করা, close - বন্ধ করা, last - টিকে থাকা"
  },
  {
    id: 29,
    question: "Antonym of the word 'endure' is :",
    targetWord: "endure",
    type: "antonym",
    examTag: "সমাজসেবা অধিদপ্তর-১৮",
    options: ["bear", "fade", "last", "close"],
    correctAnswer: "b",
    wordMeaningBangla: "টিকে থাকা",
    explanationBangla: "bear - বহন/সহ্য করা, fade - বিবর্ণ বা বিলুপ্ত হওয়া, last - স্থায়ী হওয়া, close - সমাপ্ত করা"
  },
  {
    id: 30,
    question: "The synonym of the word 'huge' is",
    targetWord: "huge",
    type: "synonym",
    examTag: "১৩তম শিক্ষক নিবন্ধন-১৬",
    options: ["sanctified", "tiny", "colossal", "momentary"],
    correctAnswer: "c",
    wordMeaningBangla: "বিশাল",
    explanationBangla: "sanctified - পবিত্র, tiny - অতি ক্ষুদ্র, colossal - সুবিশাল, momentary - ক্ষণস্থায়ী"
  }
];
