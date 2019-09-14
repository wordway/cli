/* eslint-disable @typescript-eslint/camelcase */
import * as program from 'commander';
import * as fs from 'fs';
import * as YAML from 'yamljs';
import { sharedApiClient as apiClient } from './networking';
import logger from './utilities/logger';
import { checkIsAuthorized } from './globals';

const path = `${process.cwd()}`;

const loadWordbook = (): any => {
  let wordbook = YAML.load(`${path}/wordbook.yaml`);

  const { info } = wordbook;

  if (info.repository_type === 'git' && fs.existsSync(`${path}/assets/cover.jpg`)) {
    wordbook = Object.assign(wordbook, {
      info: Object.assign(
        wordbook.info,
        {
          cover_url: `${info.repository_url}/raw/master/assets/cover.jpg`,
        },
      ),
    });
  }

  let chapters = [];
  if (fs.existsSync(`${path}/chapters`)) {
    const compareFn = (function(v1, v2){
      let v1num = parseInt(v1.replace('chapter', '').replace('.yaml', ''));
      let v2num = parseInt(v2.replace('chapter', '').replace('.yaml', ''));

      return v1num - v2num;
     });
    const files = fs.readdirSync(`${path}/chapters`).sort(compareFn);
    for (let i = 0; i < files.length; i += 1) {
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
