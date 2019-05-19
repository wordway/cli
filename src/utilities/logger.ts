/* eslint-disable @typescript-eslint/no-explicit-any,no-console */
import chalk from 'chalk';

const logger = {
  log(msg: string): void {
    console.log(msg);
  },
  success(msg: string): void {
    console.log(chalk.green('success ') + msg);
  },
  error(msg: string | any): void {
    let errors = [];
    if (typeof msg === 'object' && msg.response) {
      const { response } = msg;
      // eslint-disable-next-line
      errors = response.data.errors;
    }
    if (errors.length > 0) {
      for (let i = 0; i < errors.length; i += 1) {
        console.log(chalk.red('error ') + errors[i].message);
      }
    } else {
      console.log(chalk.red('error ') + msg);
    }
  },
  info(msg: any): void {
    console.log(chalk.blue('info ') + msg);
  },
  warn(msg: any): void {
    console.log(chalk.yellow('warning ') + msg);
  },
};

export default logger;
