import * as program from 'commander';
import * as inquirer from 'inquirer';
import { sharedApiClient as apiClient } from './networking';
import logger from './utilities/logger';
import { setCredential } from './globals';

program
  .parse(process.argv);

setTimeout(async (): Promise<void> => {
  try {
    const result = await inquirer.prompt([
      {
        name: 'email',
        validate: value => new Promise(resolve => {
          var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
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
});
