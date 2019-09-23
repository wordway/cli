/* eslint-disable @typescript-eslint/no-explicit-any,no-console */
import * as program from 'commander';
import chalk from 'chalk';
import { sharedApiClient as apiClient } from './networking';
import logger from './utilities/logger';

program
  .action(async (source): Promise<void> => {
    try {
      const { data: { data: word } } = await apiClient.get(`/words/${source}`);

      let wordIpaFlag;
      let wordIpa;
      // let wordPronunciationUrl;

      if (word.usIpa != null || (word.usIpa == null && word.ukIpa == null)) {
        wordIpaFlag = '美';
        wordIpa = word.usIpa;
        // wordPronunciationUrl = word.usPronunciationUrl;
      } else {
        wordIpaFlag = '英';
        wordIpa = word.ukIpa;
        // wordPronunciationUrl = word.ukPronunciationUrl;
      }

      console.log(chalk.green(word.word));
      if (wordIpa) {
        console.log(chalk.gray(`${wordIpaFlag} [${wordIpa}]`));
      }
      console.log('\n');
      console.log('基本释义：');
      console.log(word.definitions.join('\n'));
    } catch (e) {
      logger.error(e.message);
    }
  })
  .parse(process.argv);

