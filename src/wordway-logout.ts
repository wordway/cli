import * as program from 'commander';
import { sharedApiClient as apiClient } from './networking';
import logger from './utilities/logger';
import { getCredential, setCredential } from './globals';

program
  .parse(process.argv);

setTimeout(async (): Promise<void> => {
  logger.info('Logging out...');
  try {
    const credential = getCredential();
    await apiClient.post('/account/logout');
    setCredential({});

    logger.success(`Goodbye ${credential.name || credential.email}.`);
  } catch (e) {
    logger.error(e.message);
  }
});
