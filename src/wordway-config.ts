import * as program from 'commander';

program
  .command('list', '-')
  .command('get', '-')
  .command('set', '-')
  .parse(process.argv);
