import * as program from 'commander';
import logger from './utilities/logger';
import { getConfig } from './globals';

program
  .action((): void => {
    const config = getConfig();
    const key: string = program.args[0];
    logger.log(config[key]);
  })
  .parse(process.argv);
