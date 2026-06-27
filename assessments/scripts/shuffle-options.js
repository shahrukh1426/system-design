#!/usr/bin/env node
/**
 * Shuffle MCQ option order so correct answers are not predictable by position.
 * Updates question files, answer keys, and remaps letter references in explanations.
 *
 * Usage: node assessments/scripts/shuffle-options.js [day ...]
 *   e.g. node assessments/scripts/shuffle-options.js 07 08 09
 *   omit days to shuffle all day-XX files (01–09)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LETTERS = ['A', 'B', 'C', 'D'];

function seededShuffle(arr, seed) {
  const a = [...arr];
  let s = seed >>> 0;
  for (let i = a.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function seedFor(day, qNum) {
  return (parseInt(day, 10) * 1000 + qNum) >>> 0;
}

function splitBySeparator(md) {
  const eol = md.includes('\r\n') ? '\r\n' : '\n';
  const parts = md.split(/\r?\n---\r?\n/);
  const header = parts[0];
  const sections = [];
  for (let i = 1; i < parts.length; i++) {
    const trimmed = parts[i].replace(/^\r?\n+/, '').replace(/\r?\n+$/, '');
    const m = trimmed.match(/^### (Q\d+[^\r\n]*)\r?\n([\s\S]*)$/);
    if (!m) continue;
    sections.push({ header: m[1], body: m[2] });
  }
  return { header, sections, eol };
}

function parseOptions(body) {
  const lines = body.split(/\r?\n/);
  const options = [];
  let firstOptionIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^- \[ \] ([A-D])\. (.+)$/);
    if (match) {
      if (firstOptionIdx === -1) firstOptionIdx = i;
      options.push({ oldLetter: match[1], text: match[2] });
    }
  }
  if (options.length < 2) {
    throw new Error(`Expected at least 2 options, got ${options.length}`);
  }
  const stem = lines.slice(0, firstOptionIdx).join('\n').replace(/\n$/, '');
  return { stem, options };
}

function parseAnswer(body) {
  const answerMatch = body.match(/\*\*Answer:\*\* (.+)/);
  const explMatch = body.match(/\*\*Explanation:\*\* ([\s\S]+)/);
  if (!answerMatch) throw new Error('Missing **Answer:**');
  if (!explMatch) throw new Error('Missing **Explanation:**');
  const correct = answerMatch[1].split(',').map((s) => s.trim());
  return { correct, explanation: explMatch[1].trim() };
}

function remapExplanationLetters(text, oldToNew) {
  return text.replace(/\(([A-D])\)/g, (_, letter) => `(${oldToNew[letter]})`);
}

function formatOptions(shuffled, eol) {
  return shuffled
    .map((o, i) => `- [ ] ${LETTERS[i]}. ${o.text}`)
    .join(eol);
}

function formatCorrect(correctLetters) {
  return LETTERS.filter((l) => correctLetters.includes(l)).join(', ');
}

function shuffleDay(day) {
  const qPath = path.join(ROOT, `day-${day}-questions.md`);
  const aPath = path.join(ROOT, 'answer-key', `day-${day}-answers.md`);
  const qFile = splitBySeparator(fs.readFileSync(qPath, 'utf8'));
  const aFile = splitBySeparator(fs.readFileSync(aPath, 'utf8'));

  if (qFile.sections.length !== aFile.sections.length) {
    throw new Error(
      `day-${day}: ${qFile.sections.length} questions vs ${aFile.sections.length} answers`
    );
  }

  const eol = qFile.eol;
  const newQSections = [];
  const newASections = [];

  for (let i = 0; i < qFile.sections.length; i++) {
    const qSec = qFile.sections[i];
    const aSec = aFile.sections[i];
    if (qSec.header !== aSec.header) {
      throw new Error(
        `day-${day} mismatch at index ${i}: ${qSec.header} vs ${aSec.header}`
      );
    }

    const qNum = parseInt(qSec.header.match(/^Q(\d+)/)[1], 10);
    const { stem, options } = parseOptions(qSec.body);
    const { correct, explanation } = parseAnswer(aSec.body);

    for (const letter of correct) {
      if (!options.some((o) => o.oldLetter === letter)) {
        throw new Error(
          `day-${day} ${qSec.header}: answer ${letter} not in options`
        );
      }
    }

    const shuffled = seededShuffle(options, seedFor(day, qNum));
    const oldToNew = {};
    shuffled.forEach((o, idx) => {
      oldToNew[o.oldLetter] = LETTERS[idx];
    });

    const newCorrect = correct.map((l) => oldToNew[l]);

    newQSections.push({
      header: qSec.header,
      body: stem ? `${stem}${eol}${eol}${formatOptions(shuffled, eol)}` : formatOptions(shuffled, eol),
    });

    newASections.push({
      header: aSec.header,
      body: `**Answer:** ${formatCorrect(newCorrect)}${eol}${eol}**Explanation:** ${remapExplanationLetters(explanation, oldToNew)}`,
    });
  }

  const sep = `${eol}---${eol}`;
  const newQMd =
    qFile.header +
    newQSections.map((s) => `${eol}${sep}${eol}### ${s.header}${eol}${eol}${s.body}`).join('') +
    eol;
  const newAMd =
    aFile.header +
    newASections.map((s) => `${eol}${sep}${eol}### ${s.header}${eol}${eol}${s.body}`).join('') +
    eol;

  fs.writeFileSync(qPath, newQMd);
  fs.writeFileSync(aPath, newAMd);

  const includesA = newASections.filter((s) => /\*\*Answer:\*\* [^\n]*\bA\b/.test(s.body)).length;
  console.log(
    `day-${day}: shuffled ${newQSections.length} questions | A correct in ${includesA}/${newQSections.length} (${Math.round((100 * includesA) / newQSections.length)}%)`
  );
}

const days =
  process.argv.length > 2
    ? process.argv.slice(2).map((d) => d.padStart(2, '0'))
    : ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];

for (const day of days) {
  shuffleDay(day);
}
