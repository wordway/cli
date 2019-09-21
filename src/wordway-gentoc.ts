import * as program from 'commander';
import * as fs from 'fs';
import { sharedApiClient as apiClient } from './networking';
import logger from './utilities/logger';

const path = `${process.cwd()}`;


const genTableString = (wordbooks): string => {
  let tableString = '';

  const theadString = `| Wordbook | Word count | Last update |
| -------- | ---------- | ----------- |`;

  let tbodyString = '';

  for (let i = 0; i < wordbooks.length; i += 1) {
    const wordbook = wordbooks[i];

    const {
      title,
      wordCount,
      updatedAt,
      repositoryUrl,
    } = wordbook;

    tbodyString += `| [${title}](${repositoryUrl}) | ![#](https://img.shields.io/badge/word%20count-${wordCount}-blue.svg) | ![#](https://img.shields.io/date/${new Date(updatedAt).getTime() / 1000}?label=last%20update) |\n`;
  }

  tableString += `
${theadString}
${tbodyString}`;

  return tableString;
}

program
  .action(async (): Promise<void> => {
    try {
      if (!path.includes('wordway-wordbooks'))
        throw new Error('Wrong directory, please change to wordway-wordbooks.');

      const { data: { items: wordbooks } } = await apiClient.get(`/wordbooks`, {
        params: {
          page: 1,
          per_page: 999,
        },
      });

      let readmeText = fs.readFileSync(`${path}/README.md`, 'utf8');
      const tableString = genTableString(wordbooks);

      const generateMarkFirstIndex = readmeText.indexOf('<!--WORDWAY-CLI-GENERATE-->');
      const generateMarkLastIndex = readmeText.lastIndexOf('<!--WORDWAY-CLI-GENERATE-->');

      readmeText = `${readmeText.substring(0, generateMarkFirstIndex + 27)}
${tableString}
${readmeText.substring(generateMarkLastIndex)}`;

      fs.writeFileSync(`${path}/README.md`, readmeText);

      logger.success(`Generated README.md`);
    } catch (e) {
      logger.error(e.message);
    }
  })
  .parse(process.argv);
