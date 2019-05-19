import * as program from 'commander';
import logger from './utilities/logger';
import { getConfig } from './globals';

program
  .parse(process.argv);

setTimeout((): void => {
  const config = getConfig();
  const key: string = program.args[0];
  logger.log(config[key]);
});
