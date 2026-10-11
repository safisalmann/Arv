import { ALL_VOCABULARY_QUESTIONS, VocabularyQuestion } from '../data/vocabularyIndex.ts';

export interface AntonymEntry {
  word: string;
  meaningBangla: string;
  fromQuestionId: number;
  forTargetWord?: string;
}

export interface MergedTargetWord {
  id: string;
  serialNumber: number; // Global serial ordered by synonymous sequence
  groupSerial: number;  // Serial within its synonymous group
  word: string;
  normalizedWord: string;
  displayWord: string;
  letter: string;
  banglaMeanings: string[];
  combinedMeaningText: string;
  occurrences: number;
  examTags: string[];
  questionIds: number[];
  questionTypes: ('synonym' | 'antonym' | 'meaning')[];
  groupId: string;
  groupNameBangla: string;
  groupNameEnglish: string;
  antonyms: AntonymEntry[]; // Antonymous words from the question set
}

export interface SynonymousGroup {
  id: string;
  groupNumber: number;
  titleBangla: string;
  titleEnglish: string;
  leadWord: string; // e.g. 'Abhor', 'Abstemious', 'Abundant', 'Acumen', 'Adequate'
  words: MergedTargetWord[];
  groupAntonyms: AntonymEntry[]; // Combined antonyms for the group
  totalWordsCount: number;
}

export interface AlphabetSection {
  letter: string;
  letterIndex: number;
  words: MergedTargetWord[];
  totalWordsCount: number;
}

export const ALPHABET_LETTERS: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Helper to parse explanationBangla into key -> bangla meaning map
export function parseExplanationMap(explanation: string): Record<string, string> {
  const map: Record<string, string> = {};
  if (!explanation) return map;

  const parts = explanation.split(/[,;]\s*/);
  for (const part of parts) {
    const match = part.match(/^([^:—–\-]+)\s*[:—–\-]\s*(.+)$/);
    if (match) {
      const key = match[1].trim().toLowerCase();
      const val = match[2].trim();
      if (key && val) {
        map[key] = val;
      }
    }
  }
  return map;
}

// Canonical word root mapping
function getCanonicalWord(rawWord: string): { canonical: string; display: string } {
  const trimmed = rawWord
    .replace(/^to\s+/i, '')
    .replace(/['"“”()]/g, '')
    .trim();

  const lower = trimmed.toLowerCase();

  const rootMap: Record<string, { canonical: string; display: string }> = {
    'adversity': { canonical: 'adverse', display: 'Adverse / Adversity' },
    'adverse': { canonical: 'adverse', display: 'Adverse' },
    'obesity': { canonical: 'obese', display: 'Obese / Obesity' },
    'obese': { canonical: 'obese', display: 'Obese' },
    'orthodoxy': { canonical: 'orthodox', display: 'Orthodox / Orthodoxy' },
    'orthodox': { canonical: 'orthodox', display: 'Orthodox' },
    'termination': { canonical: 'terminate', display: 'Terminate / Termination' },
    'terminate': { canonical: 'terminate', display: 'Terminate' },
    'transitory': { canonical: 'transient', display: 'Transient / Transitory' },
    'transient': { canonical: 'transient', display: 'Transient' },
    'dishearten': { canonical: 'hearten', display: 'Hearten / Dishearten' },
    'hearten': { canonical: 'hearten', display: 'Hearten' },
    'altruistic': { canonical: 'altruism', display: 'Altruism / Altruistic' },
    'altruism': { canonical: 'altruism', display: 'Altruism' },
    'apathetic': { canonical: 'indifferent', display: 'Indifferent / Apathetic' },
    'indifferent': { canonical: 'indifferent', display: 'Indifferent' },
    'extempore': { canonical: 'impromptu', display: 'Impromptu / Extempore' },
    'impromptu': { canonical: 'impromptu', display: 'Impromptu' },
    'obstacles': { canonical: 'impediment', display: 'Impediment / Obstacle' },
    'impediment': { canonical: 'impediment', display: 'Impediment' },
    'perpetual': { canonical: 'perpetual', display: 'Perpetual' },
    'eternal': { canonical: 'eternal', display: 'Eternal' },
    'sombre': { canonical: 'somber', display: 'Somber / Sombre' },
    'somber': { canonical: 'somber', display: 'Somber' },
  };

  if (rootMap[lower]) {
    return rootMap[lower];
  }

  const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  return { canonical: lower, display: capitalized };
}

function parseBanglaMeanings(meaningText: string): string[] {
  if (!meaningText) return [];
  return meaningText
    .split(/[,/;\n]+/)
    .map((m) => m.trim())
    .filter((m) => m.length > 0 && m !== 'none');
}

// Master Definition of Synonymous Groups ordered alphabetically by lead words:
// Abhor, Abstemious, Abundant, Acumen, Adequate, etc.
interface GroupDefinition {
  id: string;
  leadWord: string;
  titleBangla: string;
  titleEnglish: string;
  memberKeywords: string[];
}

const SYNONYMOUS_GROUP_DEFINITIONS: GroupDefinition[] = [
  {
    id: 'grp-abhor',
    leadWord: 'Abhor',
    titleBangla: 'ঘৃণা করা, অবজ্ঞা ও তীব্র অপছন্দ',
    titleEnglish: 'Hate, Detest & Despise',
    memberKeywords: ['abhor', 'despise', 'disdain', 'repugnant', 'repulsive'],
  },
  {
    id: 'grp-abstemious-frugal',
    leadWord: 'Abstemious',
    titleBangla: 'মিতব্যয়ী, হিসেবি ও সংযমী',
    titleEnglish: 'Frugal, Thrifty, Parsimonious & Temperate',
    memberKeywords: ['abstemious', 'frugal', 'parsimonious', 'parsimony', 'economical'],
  },
  {
    id: 'grp-abundant-copious',
    leadWord: 'Abundant',
    titleBangla: 'প্রচুর, অফুরন্ত ও প্রাচুর্য',
    titleEnglish: 'Abundant, Plentiful, Copious & Profuse',
    memberKeywords: ['abundant', 'copious', 'profusion', 'surfeit'],
  },
  {
    id: 'grp-acumen-dexterous',
    leadWord: 'Acumen',
    titleBangla: 'বিচক্ষণ, তীক্ষ্ণ বুদ্ধি, দক্ষ ও কুশলী',
    titleEnglish: 'Skilful, Dexterous, Astute, Ingenious & Wise',
    memberKeywords: ['acumen', 'adroit', 'astute', 'dexterous', 'efficient', 'ingenious', 'sagacious', 'judicious'],
  },
  {
    id: 'grp-adequate',
    leadWord: 'Adequate',
    titleBangla: 'পর্যাপ্ত, প্রচুর ও যথেষ্ট',
    titleEnglish: 'Adequate & Sufficient',
    memberKeywords: ['adequate'],
  },
  {
    id: 'grp-adverse-hostile',
    leadWord: 'Adverse',
    titleBangla: 'প্রতিকূল, বৈরী, শত্রুভাবাপন্ন ও সংঘাতময়',
    titleEnglish: 'Adverse, Hostile, Inimical & Belligerent',
    memberKeywords: ['adverse', 'hostile', 'inimical', 'antagonist', 'belligerent', 'bellicose', 'enmity', 'hostility'],
  },
  {
    id: 'grp-affluent-wealthy',
    leadWord: 'Affluent',
    titleBangla: 'বিত্তবান, ধনী ও প্রাচুর্যময়',
    titleEnglish: 'Affluent, Wealthy & Prosperous',
    memberKeywords: ['affluent', 'prosperity'],
  },
  {
    id: 'grp-alluring-enticing',
    leadWord: 'Alluring',
    titleBangla: 'প্রলুব্ধকর, লোভনীয় ও চিত্তাকর্ষক',
    titleEnglish: 'Alluring, Tempting & Enticing',
    memberKeywords: ['alluring', 'enticing'],
  },
  {
    id: 'grp-altruism-benevolent',
    leadWord: 'Altruism',
    titleBangla: 'পরোপকারী, দানশীল, দয়ালু ও মহৎ',
    titleEnglish: 'Altruistic, Benevolent & Philanthropic',
    memberKeywords: ['altruism', 'benevolent', 'philanthropist', 'magnanimous'],
  },
  {
    id: 'grp-ambiguous-vague',
    leadWord: 'Ambiguous',
    titleBangla: 'অস্পষ্ট, দ্ব্যর্থবোধক, দুর্বোধ্য ও কুয়াশাচ্ছন্ন',
    titleEnglish: 'Ambiguous, Equivocal, Vague & Obscure',
    memberKeywords: ['ambiguous', 'equivocal', 'equivocation', 'vague', 'nebulous', 'obscure', 'hazy', 'cryptic', 'turbid', 'recondite'],
  },
  {
    id: 'grp-amnesty-forgive',
    leadWord: 'Amnesty',
    titleBangla: 'সাধারণ ক্ষমা, মার্জনা ও দায়মুক্তি',
    titleEnglish: 'Amnesty, Exoneration & Pardon',
    memberKeywords: ['amnesty', 'exonerate', 'condone'],
  },
  {
    id: 'grp-anarchy-chaos',
    leadWord: 'Anarchy',
    titleBangla: 'নৈরাজ্য, বিশৃঙ্খলা ও তুমুল হট্টগোল',
    titleEnglish: 'Anarchy, Chaos, Commotion & Pandemonium',
    memberKeywords: ['anarchy', 'chaos', 'pandemonium', 'tumult', 'turbulence'],
  },
  {
    id: 'grp-annihilate-destroy',
    leadWord: 'Annihilate',
    titleBangla: 'সম্পূর্ণরূপে ধ্বংস করা, পতন ও বিলোপ',
    titleEnglish: 'Annihilate, Destroy, Collapse & Debacle',
    memberKeywords: ['annihilate', 'destroy', 'collapse', 'efface'],
  },
  {
    id: 'grp-apex-pinnacle',
    leadWord: 'Apex',
    titleBangla: 'চূড়া, শীর্ষবিন্দু ও সর্বোচ্চ শিখর',
    titleEnglish: 'Apex, Pinnacle, Climax & Zenith',
    memberKeywords: ['apex', 'pinnacle', 'climax', 'zenith'],
  },
  {
    id: 'grp-arduous',
    leadWord: 'Arduous',
    titleBangla: 'কঠিন, কষ্টসাধ্য ও শ্রমসাধ্য',
    titleEnglish: 'Arduous, Strenuous & Difficult',
    memberKeywords: ['arduous'],
  },
  {
    id: 'grp-arrogant-insolent',
    leadWord: 'Arrogant',
    titleBangla: 'উদ্ধত, অহংকারী ও দাম্ভিক',
    titleEnglish: 'Arrogant, Insolent, Highhanded & Proud',
    memberKeywords: ['arrogant', 'insolent', 'highhanded', 'temerity', 'pride', 'bombastic'],
  },
  {
    id: 'grp-assemble-unite',
    leadWord: 'Assemble',
    titleBangla: 'একত্র করা, জড়ো করা ও সমবেত হওয়া',
    titleEnglish: 'Assemble, Unite & Gather',
    memberKeywords: ['assemble', 'amalgamate', 'alliance'],
  },
  {
    id: 'grp-atheist',
    leadWord: 'Atheist',
    titleBangla: 'নাস্তিক ও অবিশ্বাসী',
    titleEnglish: 'Atheist & Non-believer',
    memberKeywords: ['atheist'],
  },
  {
    id: 'grp-audacious-bold',
    leadWord: 'Audacious',
    titleBangla: 'সাহসী, নির্ভীক ও দুঃসাহসী',
    titleEnglish: 'Audacious, Bold, Intrepid & Daring',
    memberKeywords: ['audacious', 'bold', 'intrepid', 'courage'],
  },
  {
    id: 'grp-authentic-genuine',
    leadWord: 'Authentic',
    titleBangla: 'খাঁটি, আসল, প্রকৃত ও সত্যনিষ্ঠ',
    titleEnglish: 'Authentic, Genuine, Bonafide & Veracious',
    memberKeywords: ['authentic', 'bonafide', 'veracious', 'veracity', 'candid', 'probity'],
  },
  {
    id: 'grp-avid-eager',
    leadWord: 'Avid',
    titleBangla: 'অতি উৎসুক, ব্যগ্র ও প্রলুব্ধ',
    titleEnglish: 'Avid, Eager, Zealous & Ardent',
    memberKeywords: ['avid', 'zealous', 'alacrity', 'yearn', 'ambition'],
  },
  {
    id: 'grp-barren-sterile',
    leadWord: 'Barren',
    titleBangla: 'অনুর্বর, বন্ধ্যা ও নিষ্ফলা',
    titleEnglish: 'Barren, Sterile & Unproductive',
    memberKeywords: ['barren'],
  },
  {
    id: 'grp-bizarre-eccentric',
    leadWord: 'Bizarre',
    titleBangla: 'অদ্ভুত, বিচিত্র ও খামখেয়ালী',
    titleEnglish: 'Bizarre, Peculiar, Queer & Eccentric',
    memberKeywords: ['bizarre', 'eccentric', 'queer'],
  },
  {
    id: 'grp-booming-flourishing',
    leadWord: 'Booming',
    titleBangla: 'দ্রুত সমৃদ্ধিশীল, বিকশিত ও উন্নতিশীল',
    titleEnglish: 'Booming, Flourishing & Thriving',
    memberKeywords: ['booming', 'thrive'],
  },
  {
    id: 'grp-brevity-concise',
    leadWord: 'Brevity',
    titleBangla: 'সংক্ষিপ্ততা ও সারসংক্ষেপ',
    titleEnglish: 'Brevity & Conciseness',
    memberKeywords: ['brevity'],
  },
  {
    id: 'grp-brittle-fragile',
    leadWord: 'Brittle',
    titleBangla: 'ভঙ্গুর, নাজুক ও সহজে বিনষ্ট',
    titleEnglish: 'Brittle & Fragile',
    memberKeywords: ['brittle', 'fragile'],
  },
  {
    id: 'grp-calm-tranquil',
    leadWord: 'Calm',
    titleBangla: 'শান্ত, স্থির, প্রশান্ত ও উপশম করা',
    titleEnglish: 'Calm, Tranquil, Placid, Serene & Soothing',
    memberKeywords: ['calm', 'tranquil', 'serene', 'pacify', 'soothing', 'assuage', 'mitigate', 'appease'],
  },
  {
    id: 'grp-clandestine-furtive',
    leadWord: 'Clandestine',
    titleBangla: 'গোপন, গুপ্ত ও অলক্ষ্যে লুকানো',
    titleEnglish: 'Clandestine, Furtive, Secret & Concealed',
    memberKeywords: ['clandestine', 'furtive', 'conceal', 'disguise', 'latent', 'tacit'],
  },
  {
    id: 'grp-custom-orthodox',
    leadWord: 'Custom',
    titleBangla: 'প্রথা, রীতি, গোঁড়ামি ও ঐতিহ্য',
    titleEnglish: 'Custom, Convention, Tradition & Orthodox',
    memberKeywords: ['custom', 'orthodox', 'dogma'],
  },
  {
    id: 'grp-curtail-shorten',
    leadWord: 'Curtail',
    titleBangla: 'সংক্ষিপ্ত করা, ছাঁটা ও কমানো',
    titleEnglish: 'Curtail, Shorten & Reduce',
    memberKeywords: ['curtail', 'reduce'],
  },
  {
    id: 'grp-dearth-scarcity',
    leadWord: 'Dearth',
    titleBangla: 'অভাব, অপ্রতুলতা, দুষ্প্রাপ্য ও স্বল্প',
    titleEnglish: 'Dearth, Scarcity, Shortage & Scanty',
    memberKeywords: ['dearth', 'scanty', 'rare'],
  },
  {
    id: 'grp-deceit-fraud',
    leadWord: 'Delude',
    titleBangla: 'প্রতারণা করা, ঠকানো, ধোঁকা ও মিথ্যাচার',
    titleEnglish: 'Delude, Defraud, Deceive, Charlatan & Spurious',
    memberKeywords: ['delude', 'defraud', 'fallacious', 'charlatan', 'spurious', 'fake', 'hypocritical', 'plagiarism'],
  },
  {
    id: 'grp-destitute-penury',
    leadWord: 'Destitute',
    titleBangla: 'নিঃস্ব, দরিদ্র, দেউলিয়া ও চরম অভাবী',
    titleEnglish: 'Destitute, Impoverished, Bankrupt & Penury',
    memberKeywords: ['destitute', 'bankrupt', 'penury'],
  },
  {
    id: 'grp-docile-compliant',
    leadWord: 'Docile',
    titleBangla: 'বাধ্য, পোষ মানা, অনুগত ও বশ্য',
    titleEnglish: 'Docile, Amenable & Compliant',
    memberKeywords: ['docile', 'amenable'],
  },
  {
    id: 'grp-dormant-sluggish',
    leadWord: 'Dormant',
    titleBangla: 'সুপ্ত, নিষ্ক্রিয়, অলস ও অসাড়',
    titleEnglish: 'Dormant, Sluggish, Indolent, Torpid & Lethargic',
    memberKeywords: ['dormant', 'sluggish', 'indolent', 'torpid', 'torpor', 'sloth', 'lethargic', 'quiescent', 'hibernate'],
  },
  {
    id: 'grp-dynamic',
    leadWord: 'Dynamic',
    titleBangla: 'গতিময়, প্রাণবন্ত ও পরিবর্তনশীল',
    titleEnglish: 'Dynamic & Energetic',
    memberKeywords: ['dynamic'],
  },
  {
    id: 'grp-elegant-exquisite',
    leadWord: 'Elegant',
    titleBangla: 'মার্জিত, সুরুচিপূর্ণ, সুন্দর ও অপূর্ব',
    titleEnglish: 'Elegant, Exquisite & Splendid',
    memberKeywords: ['elegant', 'exquisite', 'gorgeous', 'magnificent', 'terrific', 'trendy', 'cute'],
  },
  {
    id: 'grp-emancipate-liberate',
    leadWord: 'Emancipate',
    titleBangla: 'মুক্তি দেওয়া, মুক্ত করা ও স্বাধীন করা',
    titleEnglish: 'Emancipate & Liberate',
    memberKeywords: ['emancipate'],
  },
  {
    id: 'grp-eternal-perpetual',
    leadWord: 'Eternal',
    titleBangla: 'চিরস্থায়ী, অনন্ত, শাশ্বত ও অবিনশ্বর',
    titleEnglish: 'Eternal, Perpetual, Everlasting & Immortal',
    memberKeywords: ['eternal', 'perpetual', 'immortal'],
  },
  {
    id: 'grp-exodus-departure',
    leadWord: 'Exodus',
    titleBangla: 'বহির্গমন, প্রস্থান ও অপসারণ',
    titleEnglish: 'Exodus & Departure',
    memberKeywords: ['exodus', 'abscond', 'expel', 'withdraw'],
  },
  {
    id: 'grp-fecund-prolific',
    leadWord: 'Fecund',
    titleBangla: 'উর্বর, প্রচুর উৎপাদনশীল ও ফলপ্রসূ',
    titleEnglish: 'Fecund, Prolific & Fertile',
    memberKeywords: ['fecund', 'prolific', 'fertile'],
  },
  {
    id: 'grp-fickle-capricious',
    leadWord: 'Fickle',
    titleBangla: 'চঞ্চল, পরিবর্তনশীল, খামখেয়ালী ও দোদুল্যমান',
    titleEnglish: 'Fickle, Capricious, Vacillating & Wavering',
    memberKeywords: ['fickle', 'capricious', 'vacillate', 'waver', 'unstable'],
  },
  {
    id: 'grp-friendly-amicable',
    leadWord: 'Friendly',
    titleBangla: 'বন্ধুত্বপূর্ণ, সৌহার্দ্যপূর্ণ, আন্তরিক ও মিশুক',
    titleEnglish: 'Amicable, Cordial, Hospitable & Gregarious',
    memberKeywords: ['amicable', 'cordial', 'hospitality', 'gregarious', 'friendship', 'urbane'],
  },
  {
    id: 'grp-futile-abortive',
    leadWord: 'Futile',
    titleBangla: 'নিষ্ফল, ব্যর্থ ও অর্থহীন',
    titleEnglish: 'Futile, Useless & Abortive',
    memberKeywords: ['futile', 'abortive'],
  },
  {
    id: 'grp-garrulous-loquacious',
    leadWord: 'Garrulous',
    titleBangla: 'বাচাল, অতিভাষী ও প্রগলভ',
    titleEnglish: 'Garrulous & Loquacious',
    memberKeywords: ['garrulous', 'loquacious'],
  },
  {
    id: 'grp-gullible-naive',
    leadWord: 'Gullible',
    titleBangla: 'অতিবিশ্বাসী, সহজে প্রতারিত ও সরল',
    titleEnglish: 'Gullible & Ingenuous',
    memberKeywords: ['gullible', 'ingenuous'],
  },
  {
    id: 'grp-harmony-concord',
    leadWord: 'Harmony',
    titleBangla: 'ঐকতান, মিল, সাদৃশ্য ও সম্প্রীতি',
    titleEnglish: 'Harmony, Concord & Synergy',
    memberKeywords: ['harmony', 'concord', 'synergy'],
  },
  {
    id: 'grp-hearten-encourage',
    leadWord: 'Hearten',
    titleBangla: 'উৎসাহ দেওয়া ও উদ্দীপিত করা',
    titleEnglish: 'Hearten & Encourage',
    memberKeywords: ['hearten'],
  },
  {
    id: 'grp-huge-enormous',
    leadWord: 'Huge',
    titleBangla: 'বিশাল, প্রকাণ্ড, সুবিশাল ও বিরাট',
    titleEnglish: 'Huge, Enormous, Colossal, Immense & Gigantic',
    memberKeywords: ['huge', 'enormous', 'colossal', 'immense', 'gigantic', 'monumental', 'resounding'],
  },
  {
    id: 'grp-humility-modest',
    leadWord: 'Humility',
    titleBangla: 'বিনয়, নম্রতা, ভদ্র ও শিষ্ট',
    titleEnglish: 'Humility, Humble, Modest, Meek & Polite',
    memberKeywords: ['humility', 'humble', 'meek', 'polite', 'gentle'],
  },
  {
    id: 'grp-imminent-forthcoming',
    leadWord: 'Imminent',
    titleBangla: 'আসন্ন, নিকটবর্তী ও আগতপ্রায়',
    titleEnglish: 'Imminent & Forthcoming',
    memberKeywords: ['imminent', 'forthcoming'],
  },
  {
    id: 'grp-impromptu-extempore',
    leadWord: 'Impromptu',
    titleBangla: 'পূর্বপ্রস্তুতিহীন ও উপস্থিত বক্তৃতা',
    titleEnglish: 'Impromptu & Extempore',
    memberKeywords: ['impromptu'],
  },
  {
    id: 'grp-indifferent-apathetic',
    leadWord: 'Indifferent',
    titleBangla: 'উদাসীন, অনীহা, নির্লিপ্ত ও স্বার্থহীন',
    titleEnglish: 'Indifferent, Apathetic, Callous & Disinterested',
    memberKeywords: ['indifferent', 'disinterested'],
  },
  {
    id: 'grp-indigenous-native',
    leadWord: 'Indigenous',
    titleBangla: 'স্বদেশী, দেশজ ও স্থানীয়',
    titleEnglish: 'Indigenous, Native & Domestic',
    memberKeywords: ['indigenous', 'alien'],
  },
  {
    id: 'grp-insipid-tasteless',
    leadWord: 'Insipid',
    titleBangla: 'বিস্বাদ, নীরস ও একঘেয়ে',
    titleEnglish: 'Insipid, Tasteless & Monotonous',
    memberKeywords: ['insipid', 'monotonous', 'tedious'],
  },
  {
    id: 'grp-intricate-complicated',
    leadWord: 'Intricate',
    titleBangla: 'জটিল, দুর্বোধ্য ও ধাঁধাময়',
    titleEnglish: 'Intricate, Complicated & Enigma',
    memberKeywords: ['intricate', 'enigma'],
  },
  {
    id: 'grp-jovial-merry',
    leadWord: 'Jovial',
    titleBangla: 'আমুদে, হাসিখুশি ও প্রফুল্ল',
    titleEnglish: 'Jovial, Merry & Festive',
    memberKeywords: ['jovial', 'regale'],
  },
  {
    id: 'grp-knowledge-erudite',
    leadWord: 'Knowledge',
    titleBangla: 'জ্ঞান, পাণ্ডিত্যপূর্ণ ও বহুভাষাবিদ',
    titleEnglish: 'Knowledge, Erudite & Polyglot',
    memberKeywords: ['knowledge', 'erudite', 'linguist', 'dictionary'],
  },
  {
    id: 'grp-lucrative-profitable',
    leadWord: 'Lucrative',
    titleBangla: 'লাভজনক ও ফলপ্রসূ',
    titleEnglish: 'Lucrative & Profitable',
    memberKeywords: ['lucrative'],
  },
  {
    id: 'grp-lunatic-mad',
    leadWord: 'Lunatic',
    titleBangla: 'পাগল ও উন্মাদ',
    titleEnglish: 'Lunatic & Mad',
    memberKeywords: ['lunatic'],
  },
  {
    id: 'grp-malice-vindictive',
    leadWord: 'Malice',
    titleBangla: 'বিদ্বেষ, শত্রুতা, আক্রোশ ও প্রতিহিংসা',
    titleEnglish: 'Malice, Antipathy, Grudge, Vindictive & Vengeance',
    memberKeywords: ['malice', 'antipathy', 'vindictive', 'vengeance'],
  },
  {
    id: 'grp-mandatory-compulsory',
    leadWord: 'Mandatory',
    titleBangla: 'বাধ্যতামূলক, আবশ্যক ও আবশ্যিক',
    titleEnglish: 'Mandatory, Compulsory, Obligatory & Oblige',
    memberKeywords: ['mandatory', 'oblige'],
  },
  {
    id: 'grp-melancholy-morose',
    leadWord: 'Melancholy',
    titleBangla: 'বিষাদগ্রস্ত, বিষণ্ণ, মনমরা ও বিমর্ষ',
    titleEnglish: 'Melancholy, Morose, Somber, Dejection & Depressed',
    memberKeywords: ['melancholy', 'morose', 'somber', 'dejection', 'depressed'],
  },
  {
    id: 'grp-meticulous-scrupulous',
    leadWord: 'Meticulous',
    titleBangla: 'খুঁতখুঁতে, অতিনিকূট ও অতিসতর্ক',
    titleEnglish: 'Meticulous, Scrupulous, Fastidious & Vigilant',
    memberKeywords: ['meticulous', 'scrupulous', 'fastidious', 'vigilant', 'heed'],
  },
  {
    id: 'grp-nadir-lowest',
    leadWord: 'Nadir',
    titleBangla: 'সর্বনিম্ন বিন্দু ও চরম অবনতি',
    titleEnglish: 'Nadir & Lowest Point',
    memberKeywords: ['nadir'],
  },
  {
    id: 'grp-obese-corpulent',
    leadWord: 'Obese',
    titleBangla: 'অতিরিক্ত মোটা, স্থূলকায় ও মেদবহুল',
    titleEnglish: 'Obese & Corpulent',
    memberKeywords: ['obese', 'corpulent'],
  },
  {
    id: 'grp-obsolete-outdated',
    leadWord: 'Obsolete',
    titleBangla: 'অপ্রচলিত ও সেকেলে',
    titleEnglish: 'Obsolete & Antiquated',
    memberKeywords: ['obsolete'],
  },
  {
    id: 'grp-optimist-sanguine',
    leadWord: 'Optimist',
    titleBangla: 'আশাবাদী ব্যক্তি ও আশাবাদ',
    titleEnglish: 'Optimist, Sanguine & Optimism',
    memberKeywords: ['optimist', 'sanguine'],
  },
  {
    id: 'grp-perilous-jeopardy',
    leadWord: 'Perilous',
    titleBangla: 'বিপজ্জনক, ঝুঁকিপূর্ণ, চরম বিপদ ও ভীতিপ্রদ',
    titleEnglish: 'Perilous, Jeopardy, Menace, Fatal & Menacing',
    memberKeywords: ['perilous', 'jeopardy', 'menace', 'fatal', 'menacing'],
  },
  {
    id: 'grp-prodigal-spendthrift',
    leadWord: 'Prodigal',
    titleBangla: 'অপব্যয়ী, অমিতব্যয়ী ও অপচয়কারী',
    titleEnglish: 'Prodigal, Spendthrift & Squander',
    memberKeywords: ['prodigal', 'spendthrift', 'squander'],
  },
  {
    id: 'grp-repeal-abolish',
    leadWord: 'Repeal',
    titleBangla: 'রদ, বাতিল করা, বিলোপ করা ও প্রত্যাহার',
    titleEnglish: 'Repeal, Abolish, Cancel, Annul & Waive',
    memberKeywords: ['repeal', 'abolish', 'cancel', 'adjourn', 'waive', 'repudiate'],
  },
  {
    id: 'grp-reprimand-castigate',
    leadWord: 'Reprimand',
    titleBangla: 'তিরস্কার করা, ভর্ৎসনা করা ও বকাঝকা',
    titleEnglish: 'Reprimand, Chide, Castigate, Vituperate & Condemn',
    memberKeywords: ['reprimand', 'chide', 'castigate', 'vituperate', 'condemn', 'taunt', 'deride', 'vilify'],
  },
  {
    id: 'grp-resolute-tenacious',
    leadWord: 'Resolute',
    titleBangla: 'দৃঢ়সংকল্প, অবিচল ও নাছোড়বান্দা',
    titleEnglish: 'Resolute, Steadfast, Tenacious & Grit',
    memberKeywords: ['resolute', 'tenacious', 'grit'],
  },
  {
    id: 'grp-ruthless-savage',
    leadWord: 'Ruthless',
    titleBangla: 'নির্মম, নিষ্ঠুর, দয়াহীন ও বর্বর',
    titleEnglish: 'Ruthless, Savage & Coercive',
    memberKeywords: ['ruthless', 'savage', 'coercive'],
  },
  {
    id: 'grp-stubborn-obstinate',
    leadWord: 'Stubborn',
    titleBangla: 'একগুঁয়ে, জেদি, অবাধ্য ও বিদ্রোহীসুলভ',
    titleEnglish: 'Stubborn, Obstinate, Recalcitrant & Rebellious',
    memberKeywords: ['stubborn', 'obstinate', 'recalcitrant', 'rebellious'],
  },
  {
    id: 'grp-taciturn-reticent',
    leadWord: 'Taciturn',
    titleBangla: 'স্বল্পভাষী, মিতভাষী, মৌন ও অনুক্ত',
    titleEnglish: 'Taciturn, Reticent & Tacit',
    memberKeywords: ['taciturn', 'reticent'],
  },
  {
    id: 'grp-tangible-concrete',
    leadWord: 'Tangible',
    titleBangla: 'স্পর্শযোগ্য, বাস্তব ও শরীরী',
    titleEnglish: 'Tangible & Concrete',
    memberKeywords: ['tangible'],
  },
  {
    id: 'grp-terminate-end',
    leadWord: 'Terminate',
    titleBangla: 'সমাপ্ত করা, শেষ হওয়া ও বিরতি',
    titleEnglish: 'Terminate & End',
    memberKeywords: ['terminate'],
  },
  {
    id: 'grp-transient-ephemeral',
    leadWord: 'Transient',
    titleBangla: 'ক্ষণস্থায়ী, স্বল্পস্থায়ী, সাময়িক ও ক্ষণিক',
    titleEnglish: 'Transient, Transitory & Ephemeral',
    memberKeywords: ['transient', 'ephemeral'],
  },
  {
    id: 'grp-vigorous-robust',
    leadWord: 'Vigorous',
    titleBangla: 'বলিষ্ঠ, বলবান, তেজস্বী ও শক্তিশালী',
    titleEnglish: 'Vigorous & Robust',
    memberKeywords: ['vigorous', 'robust'],
  },
];

export function extractTargetWordsBySynonyms(questions: VocabularyQuestion[] = ALL_VOCABULARY_QUESTIONS): {
  synonymousGroups: SynonymousGroup[];
  allSerializedWords: MergedTargetWord[];
  totalUniqueTargetWords: number;
  totalExamAppearances: number;
} {
  const mergedMap = new Map<string, MergedTargetWord>();
  const antonymsMap = new Map<string, AntonymEntry[]>();
  let totalExamCount = 0;

  // 1. Extract Antonyms from questions where type === 'antonym'
  questions.forEach((q) => {
    if (q.type === 'antonym' && q.targetWord && q.correctAnswer && q.options) {
      const { canonical } = getCanonicalWord(q.targetWord);
      const correctIdx = q.correctAnswer.charCodeAt(0) - 97;
      const rawCorrectOption = q.options[correctIdx];

      if (rawCorrectOption) {
        const cleanedAntonym = rawCorrectOption.replace(/^to\s+/i, '').replace(/['"“”()]/g, '').trim();
        const expMap = parseExplanationMap(q.explanationBangla);
        const antonymMeaning = expMap[cleanedAntonym.toLowerCase()] || 'বিপরীত শব্দ';

        const entry: AntonymEntry = {
          word: cleanedAntonym.charAt(0).toUpperCase() + cleanedAntonym.slice(1),
          meaningBangla: antonymMeaning,
          fromQuestionId: q.id,
          forTargetWord: q.targetWord,
        };

        if (!antonymsMap.has(canonical)) {
          antonymsMap.set(canonical, [entry]);
        } else {
          const list = antonymsMap.get(canonical)!;
          if (!list.some((item) => item.word.toLowerCase() === entry.word.toLowerCase())) {
            list.push(entry);
          }
        }
      }
    }
  });

  // 2. Process Target Words
  questions.forEach((q) => {
    if (!q.targetWord) return;
    totalExamCount++;

    const { canonical, display } = getCanonicalWord(q.targetWord);
    const firstChar = display.charAt(0).toUpperCase();
    const letter = /[A-Z]/.test(firstChar) ? firstChar : '#';

    const newMeanings = parseBanglaMeanings(q.wordMeaningBangla);

    if (!mergedMap.has(canonical)) {
      mergedMap.set(canonical, {
        id: `target-${canonical}`,
        serialNumber: 0,
        groupSerial: 0,
        word: display,
        normalizedWord: canonical,
        displayWord: display,
        letter,
        banglaMeanings: newMeanings,
        combinedMeaningText: newMeanings.join(', '),
        occurrences: 1,
        examTags: [q.examTag],
        questionIds: [q.id],
        questionTypes: [q.type],
        groupId: '',
        groupNameBangla: '',
        groupNameEnglish: '',
        antonyms: antonymsMap.get(canonical) || [],
      });
    } else {
      const existing = mergedMap.get(canonical)!;
      existing.occurrences += 1;

      newMeanings.forEach((m) => {
        if (!existing.banglaMeanings.includes(m)) {
          existing.banglaMeanings.push(m);
        }
      });
      existing.combinedMeaningText = existing.banglaMeanings.join(', ');

      if (q.examTag && !existing.examTags.includes(q.examTag)) {
        existing.examTags.push(q.examTag);
      }

      existing.questionIds.push(q.id);
      if (!existing.questionTypes.includes(q.type)) {
        existing.questionTypes.push(q.type);
      }

      // Merge any antonyms found
      const extraAntonyms = antonymsMap.get(canonical);
      if (extraAntonyms) {
        extraAntonyms.forEach((ea) => {
          if (!existing.antonyms.some((a) => a.word.toLowerCase() === ea.word.toLowerCase())) {
            existing.antonyms.push(ea);
          }
        });
      }
    }
  });

  const allMergedWords = Array.from(mergedMap.values());
  const assignedWordsSet = new Set<string>();

  // 3. Build Synonymous Groups based on master synonym definitions
  const builtGroups: SynonymousGroup[] = [];

  SYNONYMOUS_GROUP_DEFINITIONS.forEach((def, gIdx) => {
    const matchedWords = allMergedWords.filter((w) =>
      def.memberKeywords.includes(w.normalizedWord)
    );

    if (matchedWords.length > 0) {
      matchedWords.sort((a, b) => a.normalizedWord.localeCompare(b.normalizedWord));

      // Gather all unique antonyms from member words in this group
      const groupAntonymsList: AntonymEntry[] = [];
      matchedWords.forEach((w) => {
        w.groupId = def.id;
        w.groupNameBangla = def.titleBangla;
        w.groupNameEnglish = def.titleEnglish;

        w.antonyms.forEach((ant) => {
          if (!groupAntonymsList.some((g) => g.word.toLowerCase() === ant.word.toLowerCase())) {
            groupAntonymsList.push(ant);
          }
        });

        assignedWordsSet.add(w.normalizedWord);
      });

      builtGroups.push({
        id: def.id,
        groupNumber: gIdx + 1,
        titleBangla: def.titleBangla,
        titleEnglish: def.titleEnglish,
        leadWord: def.leadWord,
        words: matchedWords,
        groupAntonyms: groupAntonymsList,
        totalWordsCount: matchedWords.length,
      });
    }
  });

  // 4. Handle remaining unassigned words
  const unassignedWords = allMergedWords.filter((w) => !assignedWordsSet.has(w.normalizedWord));

  if (unassignedWords.length > 0) {
    unassignedWords.sort((a, b) => a.normalizedWord.localeCompare(b.normalizedWord));

    unassignedWords.forEach((w) => {
      builtGroups.push({
        id: `grp-${w.normalizedWord}`,
        groupNumber: builtGroups.length + 1,
        titleBangla: w.combinedMeaningText,
        titleEnglish: w.displayWord,
        leadWord: w.displayWord,
        words: [w],
        groupAntonyms: w.antonyms,
        totalWordsCount: 1,
      });
      w.groupId = `grp-${w.normalizedWord}`;
      w.groupNameBangla = w.combinedMeaningText;
      w.groupNameEnglish = w.displayWord;
    });
  }

  // 5. Sort groups alphabetically by leadWord (Abhor, Abstemious, Abundant, Acumen...)
  builtGroups.sort((a, b) => a.leadWord.localeCompare(b.leadWord));

  // 6. Assign running global serial
  let runningGlobalSerial = 1;
  const flatSerializedWords: MergedTargetWord[] = [];

  builtGroups.forEach((group, gIdx) => {
    group.groupNumber = gIdx + 1;
    group.words.forEach((word, wIdx) => {
      word.serialNumber = runningGlobalSerial++;
      word.groupSerial = wIdx + 1;
      flatSerializedWords.push(word);
    });
  });

  return {
    synonymousGroups: builtGroups,
    allSerializedWords: flatSerializedWords,
    totalUniqueTargetWords: flatSerializedWords.length,
    totalExamAppearances: totalExamCount,
  };
}
