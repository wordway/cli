import * as program from 'commander';
import { getConfig } from './globals';
import logger from './utilities/logger';


const config = getConfig();

if (config.env !== 'production') {
  logger.warn(`Your environment is "${config.env}"`);
}

program
  .version('1.0.5')
  .description('Command-line Interface (CLI) for Wordway')
  .command('t', ' ')
  .command('extract', ' ')
  .command('gentoc', ' ')
  .command('login', 'Log in.')
  .command('logout', 'Log out.')
  // Sub-Commands
  .command('config', 'Manages the `wordway-cli` configuration files.')
  .command('wordbook', 'Manage wordbooks.')
  .parse(process.argv);
