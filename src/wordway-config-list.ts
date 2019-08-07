import * as program from 'commander';
import logger from './utilities/logger';
import { getConfig } from './globals';

program
  .action((): void => {
    const config = getConfig();
    logger.log(JSON.stringify(config, null, 2));
  })
  .parse(process.argv);
