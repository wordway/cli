import * as program from 'commander';
import * as fs from 'fs';
import * as YAML from 'yamljs';
import chalk from 'chalk';
import { sharedApiClient as apiClient } from './networking';
import logger from './utilities/logger';
import { checkIsAuthorized } from './globals';

program
  .parse(process.argv);

const loadWordbook = (path: string) => {
  const wordbook = YAML.load(path);
  return wordbook;
}

setTimeout(async (): Promise<void> => {
  if (!checkIsAuthorized()) return;

  const path = `${process.cwd()}`;

  logger.info('Generating...');
  try {
    const wordbook = loadWordbook(`${path}/wordbook.yaml`);
    const { info } = wordbook;

    const { data: { data: { words = [] } } } = await apiClient.get(`/wordbooks/${info.slug}?include=words`);

    let wordsTableText = '';
    for (let i = 0; i < words.length; i++) {
      const word = words[i];

      wordsTableText += `| ${word.word} | UK [🔊](${word.ukAudioUrl}) [${word.ukIpa}]<br>US [🔊](${word.usAudioUrl}) [${word.usIpa}] | ${(word.definitions || []).join('<br>')} |\n`;
    }

    const readmeText = `
# wordbook-${info.slug}

${info.title}

# Words

这些是该单词本中所包含的单词。

| 单词 | 音标 | 基本释义 |
| ---- | ------- | ------- |
${wordsTableText}

Generated by [wordway-cli](https://github.com/wordway/wordway-cli).
`;

    fs.writeFileSync(`${path}/README.md`, readmeText);

    logger.success(`Generated README.md for ${wordbook.info.title} (${wordbook.info.slug})`);
  } catch (e) {
    logger.error(e.message);
  }
});
