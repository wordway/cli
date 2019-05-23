import * as program from 'commander';
import * as fs from 'fs';
import * as YAML from 'yamljs';
import chalk from 'chalk';
import { sharedApiClient as apiClient } from './networking';
import logger from './utilities/logger';
import { checkIsAuthorized } from './globals';

program
  .parse(process.argv);

const path = `${process.cwd()}`;

const loadWordbook = () => {
  const wordbook = YAML.load(`${path}/wordbook.yaml`);

  let chapters = [];
  if (fs.existsSync(`${path}/chapters`)) {
    const files = fs.readdirSync(`${path}/chapters`);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const chapter = YAML.load(`${path}/chapters/${files[i]}`);
      if (!chapter.slug) {
        chapter.slug = file.replace('.yaml', '');
      }
      chapters = [...chapters, chapter];
    }
  }

  if (chapters.length > 0) {
    return Object.assign(wordbook, { chapters });
  }

  return wordbook;
}

setTimeout(async (): Promise<void> => {
  if (!checkIsAuthorized()) return;

  logger.info('Publishing...');
  try {
    const wordbook = loadWordbook();
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
    logger.error(JSON.stringify(e.response.data));
    logger.error(e.message);
  }
});
