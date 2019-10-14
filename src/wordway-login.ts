import * as program from 'commander';
import * as inquirer from 'inquirer';
import { sharedApiClient as apiClient } from './networking';
import logger from './utilities/logger';
import { setCredential } from './globals';

program
  .action(async (): Promise<void> => {
    try {
      const result = await inquirer.prompt([
        {
          name: 'email',
          // eslint-disable-next-line
          validate: value => new Promise((resolve): void => {
            const pattern = /^([\w_\.\-\+])+\@([\w\-]+\.)+([\w]{2,10})+$/;
            resolve(pattern.test(value) || 'Not a valid email.');
          }),
        },
        {
          type: 'password',
          name: 'password',
          mask: '*',
        },
      ]);

      logger.info('Logging in...');
      const { data: { data: user } } = await apiClient.post('/accounts/login', result);
      setCredential(user);

      logger.success(`Hi ${user.name || user.email}, Welcome to Wordway!`);
    } catch (e) {
      logger.error(e.message);
    }
  })
  .parse(process.argv);
