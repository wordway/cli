import * as program from 'commander';
import * as fs from 'fs';
import * as YAML from 'yamljs';
import chalk from 'chalk';
import { sharedApiClient as apiClient } from './networking';
import logger from './utilities/logger';
import { checkIsAuthorized } from './globals';

program
  .parse(process.argv);

const loadWordbook = (path: string) => {
  const wordbook = YAML.load(path);
  return wordbook;
}

setTimeout(async (): Promise<void> => {
  if (!checkIsAuthorized()) return;

  const wordbookYamlFilePath = `${process.cwd()}/wordbook.yaml`;

  logger.info('Publishing...');
  try {
    const wordbook = loadWordbook(wordbookYamlFilePath);
    const { info } = wordbook;

    let wordbookCreated = true;
    try {
      await apiClient.get(`/wordbooks/${info.slug}`);
    } catch (e) {
      if (e.response && e.response.status === 404) {
        wordbookCreated = false;
      } else {
        throw e;
      }
    }

    if (!wordbookCreated) {
      await apiClient.post('/wordbooks', info);
    }

    // 将单词列表数据更新到单词本
    await apiClient.patch(`/wordbooks/${info.slug}`, wordbook);

    logger.success(`Published ${wordbook.info.title} (${wordbook.info.slug})`);
  } catch (e) {
    logger.error(e.message);
  }
});
