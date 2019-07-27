import * as program from 'commander';

program
  .version('1.0.0')
  .description('Command-line Interface (CLI) for Wordway')
  .command('login', 'Log in.')
  .command('logout', 'Log out.')
  // Sub-Commands
  .command('config', 'Manages the `wordway-cli` configuration files.')
  .command('wordbook', 'Manage wordbooks.')
  .parse(process.argv);
