import * as program from 'commander';
import * as fs from 'fs';
import * as YAML from 'yamljs';
import chalk from 'chalk';
import { sharedApiClient as apiClient } from './networking';
import logger from './utilities/logger';
import { checkIsAuthorized } from './globals';

const path = `${process.cwd()}`;

const loadWordbook = () => {
  let wordbook = YAML.load(`${path}/wordbook.yaml`);

  const { info } = wordbook;

  if (info.repository_type == 'git' && fs.existsSync(`${path}/assets/cover.png`)) {
    wordbook = Object.assign(wordbook, {
      info: Object.assign(
        wordbook.info,
        {
          cover_url: `${info.repository_url}/raw/master/assets/cover.png`,
        },
      ),
    });
  }

  let chapters = [];
  if (fs.existsSync(`${path}/chapters`)) {
    const files = fs.readdirSync(`${path}/chapters`);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let chapter = YAML.load(`${path}/chapters/${files[i]}`);
      if (chapter.unique_id) {
        delete chapter.unique_id;
      }
      if (!chapter.slug && chapter.slug !== file.replace('.yaml', '')) {
        chapter = Object.assign(
          {
            slug: file.replace('.yaml', ''),
          },
          chapter,
        );
        fs.writeFileSync(`${path}/chapters/${files[i]}`, YAML.stringify(chapter, 8, 2));
      }
      chapters = [...chapters, chapter];
    }
  }

  if (chapters.length > 0) {
    return Object.assign(wordbook, { chapters });
  }

  return wordbook;
}

program
  .action(async (): Promise<void> => {
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
  })
  .parse(process.argv);
