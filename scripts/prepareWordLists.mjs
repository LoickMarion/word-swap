import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import wordListPath from 'word-list';
import { Filter } from 'bad-words';
import maleFirstNames from '@stdlib/datasets-male-first-names-en';
import femaleFirstNames from '@stdlib/datasets-female-first-names-en';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');

const VALID_MIN_LEN = 3;
const VALID_MAX_LEN = 8;
const COMMON_MIN_LEN = 5;
const COMMON_MAX_LEN = 8;

// Words to guarantee are present in both lists, regardless of dictionary source.
// Add more here as desired.
const CUSTOM_WORDS = ['pookie', 'amongus'];

const ALPHA_ONLY = /^[a-z]+$/;

function readLines(filePath) {
  return readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim().toLowerCase())
    .filter(Boolean);
}

function isCleanAlphaWord(word) {
  return ALPHA_ONLY.test(word);
}

const profanityFilter = new Filter();
const profanitySet = new Set(profanityFilter.list.map((w) => w.toLowerCase()));

function isProfane(word) {
  return profanitySet.has(word);
}

// Common first names are excluded from the *common* words list (start/goal
// candidates) since a puzzle whose start or goal is a person's name reads as
// a bug, not a word. They're left eligible as intermediate steps since a
// name colliding with a real word mid-path (e.g. "art", "grace") is fine.
const properNameSet = new Set(
  [...maleFirstNames(), ...femaleFirstNames()].map((name) => name.toLowerCase()),
);

function isProperName(word) {
  return properNameSet.has(word);
}

console.log('Reading raw word-list dictionary...');
const rawValidCandidates = readLines(wordListPath);

console.log('Reading raw google-10000-english frequency list...');
const googleWordsPath = path.join(__dirname, 'wordlist-raw', 'google-10000-english.txt');
const rawCommonCandidates = readLines(googleWordsPath);

console.log('Filtering valid words...');
const validWordsSet = new Set();
for (const word of rawValidCandidates) {
  if (!isCleanAlphaWord(word)) continue;
  if (word.length < VALID_MIN_LEN || word.length > VALID_MAX_LEN) continue;
  if (isProfane(word)) continue;
  validWordsSet.add(word);
}

for (const word of CUSTOM_WORDS) {
  validWordsSet.add(word);
}

console.log('Filtering common words (must also be valid words)...');
const commonWordsSet = new Set();
for (const word of rawCommonCandidates) {
  if (!isCleanAlphaWord(word)) continue;
  if (word.length < COMMON_MIN_LEN || word.length > COMMON_MAX_LEN) continue;
  if (isProfane(word)) continue;
  if (isProperName(word)) continue;
  if (!validWordsSet.has(word)) continue;
  commonWordsSet.add(word);
}

for (const word of CUSTOM_WORDS) {
  commonWordsSet.add(word);
  validWordsSet.add(word); // ensure custom words satisfy common ⊆ valid
}

const validWords = [...validWordsSet].sort();
const commonWords = [...commonWordsSet].sort();

const dataDir = path.join(repoRoot, 'src', 'data');
mkdirSync(dataDir, { recursive: true });

writeFileSync(path.join(dataDir, 'validWords.json'), JSON.stringify(validWords));
writeFileSync(path.join(dataDir, 'commonWords.json'), JSON.stringify(commonWords));

console.log(`Wrote ${validWords.length} valid words -> src/data/validWords.json`);
console.log(`Wrote ${commonWords.length} common words -> src/data/commonWords.json`);

for (const word of CUSTOM_WORDS) {
  const inValid = validWordsSet.has(word);
  const inCommon = commonWordsSet.has(word);
  console.log(`  custom word "${word}": valid=${inValid} common=${inCommon}`);
}
