import * as program from 'commander';
import * as inquirer from 'inquirer';
import { sharedApiClient as apiClient } from './networking';
import logger from './utilities/logger';
import { getCredential, setCredential } from './globals';

program
  .action(async (): Promise<void> => {
    try {
      const { agreeToLogout } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'agreeToLogout',
          message: 'Are you sure you want to log out?'
        },
      ]);

      if (!agreeToLogout) {
        throw new Error('Operation canceled.');
      }

      const credential = getCredential();

      logger.info('Logging out...');
      try {
        await apiClient.post('/accounts/logout');
      } catch (e) {
        // ignore
      }
      setCredential({});

      logger.success(`Goodbye ${credential.name || credential.email}.`);
    } catch (e) {
      logger.error(e.message);
    }
  })
  .parse(process.argv);
