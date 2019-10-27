/* eslint-disable @typescript-eslint/no-explicit-any,no-console */
import * as program from 'commander';
import chalk from 'chalk';
import { sharedApiClient as apiClient } from './networking';
import logger from './utilities/logger';

program
  .option('-r, --renew', 'renew this word.')
  .action(async (source): Promise<void> => {
    try {
      let wordCreated = true;
      let resp;
      try {
        resp = await apiClient.get(`/words/${source}`);
      } catch (e) {
        if (e.response && e.response.status === 404) {
          wordCreated = false;
        } else {
          throw e;
        }
      }

      if (!wordCreated || program.renew) {
        resp = await apiClient.post(`/words/${source}`, { word: source });
      }

      const { data: { data: word }} = resp;

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
      console.log((word.definitions || []).join('\n'));
    } catch (e) {
      logger.error(e.message);
    }
  })
  .parse(process.argv);

