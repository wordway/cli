import * as program from 'commander';
import logger from './utilities/logger';
import { getConfig, setConfig } from './globals';

const defaultEnvConfig = {
  local: {
    env: 'local',
    webURL: 'http://127.0.0.1:3000',
    apiURL: 'http://127.0.0.1:8000',
  },
  development: {
    env: 'development',
    webURL: 'https://wordway-web-dev.thecode.me',
    apiURL: 'https://wordway-api-dev.thecode.me',
  },
  production: {
    env: 'production',
    webURL: 'https://wordway.thecode.me',
    apiURL: 'https://wordway-api.thecode.me',
  },
};

program
  .action((): void => {
    const config = getConfig();

    const key: string = program.args[0];
    const value: string = program.args[1];

    let defaultConfig = {};

    if (key == 'env') {
      let env = value;
      if (env === 'dev') env = 'development';
      if (env === 'prod') env = 'production';
      defaultConfig = defaultEnvConfig[env];
    }

    setConfig(Object.assign(
      config,
      {
        [key]: value || undefined,
      },
      defaultConfig,
    ));

    logger.success(`Set "${key}" to "${value}".`);
  })
  .parse(process.argv);
