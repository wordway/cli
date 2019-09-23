import * as program from 'commander';
import * as fs from 'fs';
import * as YAML from 'yamljs';
import * as toc from 'markdown-toc';
import { sharedApiClient as apiClient } from './networking';
import logger from './utilities/logger';
import { checkIsAuthorized } from './globals';

program
  .parse(process.argv);

const path = `${process.cwd()}`;

const loadWordbook = (): any => {
  const wordbook = YAML.load(`${path}/wordbook.yaml`);
  return wordbook;
}

const genTableString = (chapter, words): string => {
  if (words.length === 0) return '';

  let tableString = '';
  if (chapter) {
    tableString += `### ${chapter.title}\n`;
  }

  const theadString = `<thead>
    <tr>
      <td width="180px">单词</td>
      <td width="220px">音标</td>
      <td>基本释义</td>
    </tr>
  </thead>`;

  let tbodyString = `<tbody>`;

  for (let i = 0; i < words.length; i += 1) {
    const word = words[i];

    // let wordIpaFlag;
    let wordIpa;
    let wordPronunciationUrl;

    if (word.usIpa != null || (word.usIpa == null && word.ukIpa == null)) {
      // wordIpaFlag = '美';
      wordIpa = word.usIpa;
      wordPronunciationUrl = word.usPronunciationUrl;
    } else {
      // wordIpaFlag = '英';
      wordIpa = word.ukIpa;
      wordPronunciationUrl = word.ukPronunciationUrl;
    }

    tbodyString += `
    <tr>
      <td>${word.word}</td>
      <td>
        <a href="${wordPronunciationUrl}">🔊</a>${wordIpa ? `[${wordIpa}]` : ''}
      </td>
      <td>${(word.definitions || []).join('<br>')}</td>
    </tr>`;
  }
  tbodyString += `
  </tbody>`;

  tableString += `
<table>
  ${theadString}
  ${tbodyString}
</table>
  `;

  return tableString;
}

setTimeout(async (): Promise<void> => {
  if (!checkIsAuthorized()) return;

  logger.info('Generating...');
  try {
    const wordbook = loadWordbook();
    const { info } = wordbook;

    const {
      data: {
        data: {
          wordCount,
          updatedAt,
          chapters = [],
          words = [],
        },
      },
    } = await apiClient.get(`/wordbooks/${info.slug}`, {
      params: {
        include: ['words', 'chapters', 'chapters.words'],
      },
    });

    let tablesString = '';
    tablesString += genTableString(null, words);
    tablesString += chapters.map(v => genTableString(v, v.words)).join('\n');

    let readmeText = `
# wordbook-${info.slug}

![#](https://img.shields.io/badge/word%20count-${wordCount}-blue.svg)
![#](https://img.shields.io/date/${new Date(updatedAt).getTime() / 1000}?label=last%20update)

${info.title}

MARKDOWN_TOC

## 单词

这些是该单词本中所包含的单词。

${tablesString}

Generated by [wordway-cli](https://github.com/wordway/wordway-cli).
`;

    let tocString = '';
    if (chapters.length > 0) {
      tocString = `## 目录\n\n${toc(readmeText.replace(`# wordbook-${info.slug}`, '')).content}`;
    }

    readmeText = readmeText.replace('MARKDOWN_TOC', tocString);

    fs.writeFileSync(`${path}/README.md`, readmeText);

    logger.success(`Generated README.md for ${wordbook.info.title} (${wordbook.info.slug})`);
  } catch (e) {
    logger.error(e.message);
  }
});
