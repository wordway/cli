import * as program from 'commander';

program
  .command('list', 'Lists all wordbooks.')
  .command('new', 'Create a new wordbook.')
  .command('publish', '-')
  .command('gendoc', 'Generate README.md for wordbook.')
  .parse(process.argv);
