import * as program from 'commander';
import * as prompt from 'prompt';
import { sharedApiClient as apiClient } from './networking';
import logger from './utilities/logger';
import { setCredential } from './globals';

program
  .parse(process.argv);

const promptSchema = [
  {
    name: 'email',
    description: 'Email',
    required: true,
  },
  {
    name: 'password',
    description: 'Password',
    hidden: true,
    replace: '*',
  },
];

prompt.start();
prompt.get(promptSchema, async (_, result): Promise<void> => {
  logger.info('Logging in...');
  try {
    const { data: { data: user } } = await apiClient.post('/accounts/login', result);
    setCredential(user);

    logger.success(`Hi ${user.name || user.email}, Welcome to wordway!`);
  } catch (e) {
    logger.error(e.message);
  }
});
