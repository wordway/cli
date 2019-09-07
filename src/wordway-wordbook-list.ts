import * as program from 'commander';
import { sharedApiClient as apiClient } from './networking';
import logger from './utilities/logger';
import { checkIsAuthorized } from './globals';

program
  .action(async (): Promise<void> => {
    if (!checkIsAuthorized()) return;

    const { data: { items } } = await apiClient.get('/wordbooks');

    for (let i = 0; i < items.length; i += 1) {
      const wordbook = items[i];

      logger.log(`\nId: ${wordbook.id}\nTitle: ${wordbook.title}\nDate: ${wordbook.createdAt}`);
    }
  })
  .parse(process.argv);


