/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from 'fs';
import logger from './utilities/logger';

if (!fs.existsSync(`${process.env.HOME}/.wordway`)) {
  fs.mkdirSync(`${process.env.HOME}/.wordway`);
}

if (!fs.existsSync(`${process.env.HOME}/.wordway/tmp`)) {
  fs.mkdirSync(`${process.env.HOME}/.wordway/tmp`);
}

const configJsonPath = `${process.env.HOME}/.wordway/config.json`;
if (!fs.existsSync(configJsonPath)) {
  const defaultConfigDev = {
    env: 'production',
    webURL: 'https://wordway.thecode.me',
    apiURL: 'https://wordway-api.thecode.me',
  };
  fs.writeFileSync(
    configJsonPath,
    JSON.stringify(defaultConfigDev, null, 2),
  );
}

export const getConfig = (): any => {
  let config;

  if (fs.existsSync(`${process.env.HOME}/.wordway/config.json`)) {
    config = JSON.parse(
      fs.readFileSync(
        `${process.env.HOME}/.wordway/config.json`
      ).toString()
    );
  }
  return config;
}

export const setConfig = (credential: any): void => {
  if (fs.existsSync(`${process.env.HOME}/.wordway/config.json`)) {
    fs.unlinkSync(`${process.env.HOME}/.wordway/config.json`);
  }
  fs.writeFileSync(
    `${process.env.HOME}/.wordway/config.json`,
    JSON.stringify(credential, null, 2),
  );
}

export const getCredential = (): any => {
  let config = getConfig();

  let credential;
  let credentialPath = `${process.env.HOME}/.wordway/credential.${config.env}.json`;

  if (fs.existsSync(credentialPath)) {
    try {
      credential = JSON.parse(fs.readFileSync(credentialPath).toString());
    } catch (error) {
      // ignore error
    }
  }
  return credential;
}

export const setCredential = (credential: any): void => {
  let config = getConfig();

  let credentialPath = `${process.env.HOME}/.wordway/credential.${config.env}.json`;

  if (fs.existsSync(credentialPath)) {
    fs.unlinkSync(credentialPath);
  }
  fs.writeFileSync(credentialPath, JSON.stringify(credential, null, 2));
}

export const checkIsAuthorized = (): boolean => {
  const credential = getCredential();

  if (!(credential && credential.jwtToken)) {
    logger.error('You need to authorize this machine using `wordway login`.');
    return false;
  }
  return true;
};

