import * as program from 'commander';
import logger from './utilities/logger';
import { getConfig } from './globals';

program
  .parse(process.argv);

setTimeout((): void => {
  const config = getConfig();
  logger.log(JSON.stringify(config, null, 2));
});
