import * as program from 'commander';

program
  .command('list', 'Lists all wordbooks.')
  .command('new', 'Create a new wordbook.')
  .command('publish', '-')
  .parse(process.argv);
