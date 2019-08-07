import * as program from 'commander';
import logger from './utilities/logger';
import { getConfig, setConfig } from './globals';

program
  .action((): void => {
    const config = getConfig();

    const key: string = program.args[0];
    const value: string = program.args[1];

    setConfig(Object.assign(
      config,
      {
        [key]: value || undefined,
      },
    ));

    logger.success(`Set "${key}" to "${value}".`);
  })
  .parse(process.argv);
