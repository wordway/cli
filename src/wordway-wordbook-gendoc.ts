import * as program from 'commander';
import * as fs from 'fs';
import * as YAML from 'yamljs';
import chalk from 'chalk';
import { sharedApiClient as apiClient } from './networking';
import logger from './utilities/logger';
import { checkIsAuthorized } from './globals';

program
  .parse(process.argv);

const path = `${process.cwd()}`;

const loadWordbook = () => {
  const wordbook = YAML.load(`${path}/wordbook.yaml`);
  return wordbook;
}

const genTableString = (chapter, words) => {
  if (words.length === 0) return '';

  let tableString = '';
  if (chapter) {
    tableString += `### ${chapter.title}\n`;
  }
  tableString +=
`
| 单词 | 音标 | 基本释义 |
| ---- | ------- | ------- |
`;
  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    tableString += `| ${word.word} | UK [🔊](${word.ukAudioUrl}) [${word.ukIpa}]<br>US [🔊](${word.usAudioUrl}) [${word.usIpa}] | ${(word.definitions || []).join('<br>')} |\n`;
  }

  return tableString;
}

setTimeout(async (): Promise<void> => {
  if (!checkIsAuthorized()) return;

  logger.info('Generating...');
  try {
    const wordbook = loadWordbook();
    const { info } = wordbook;

    const { data: { data: { chapters = [], words = [] } } } = await apiClient.get(`/wordbooks/${info.slug}`, {
      params: {
        include: ['words', 'chapters', 'chapters.words'],
      },
    });

    let tablesString = '';
    tablesString += genTableString(null, words);
    tablesString += chapters.map(v => genTableString(v, v.words)).join('\n');

    const readmeText = `
# wordbook-${info.slug}

${info.title}

## Words

这些是该单词本中所包含的单词。

${tablesString}

Generated by [wordway-cli](https://github.com/wordway/wordway-cli).
`;

    fs.writeFileSync(`${path}/README.md`, readmeText);

    logger.success(`Generated README.md for ${wordbook.info.title} (${wordbook.info.slug})`);
  } catch (e) {
    logger.error(e.message);
  }
});
