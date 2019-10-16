/* eslint-disable @typescript-eslint/camelcase */
import * as program from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import * as YAML from 'yamljs';
import { sharedApiClient as apiClient, sharedApiClient, sharedQiniuClient } from './networking';
import logger from './utilities/logger';
import { checkIsAuthorized } from './globals';

const cwd = `${process.cwd()}`;

const loadWordbook = (): any => {
  let wordbook = YAML.load(`${cwd}/wordbook.yaml`);

  let chapters = [];
  if (fs.existsSync(`${cwd}/chapters`)) {
    const compareFn = ((v1, v2): any => {
      const v1num = parseInt(v1.replace('chapter', '').replace('.yaml', ''), 10);
      const v2num = parseInt(v2.replace('chapter', '').replace('.yaml', ''), 10);

      return v1num - v2num;
     });
    const files = fs.readdirSync(`${cwd}/chapters`).sort(compareFn);
    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      let chapter = YAML.load(`${cwd}/chapters/${files[i]}`);
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
        fs.writeFileSync(`${cwd}/chapters/${files[i]}`, YAML.stringify(chapter, 8, 2));
      }
      chapters = [...chapters, chapter];
    }
  }

  if (chapters.length > 0) {
    return Object.assign(wordbook, { chapters });
  }

  return wordbook;
}

const createOrUpdateWord = async (remoteWordbook: any, localWord: any): Promise<any> => {
  try {
    let resp;
    let forceUpdate = false;

    try {
      resp = await apiClient.get(`/words/${localWord.word}`);
    } catch (e) {
      if (e.response && e.response.status === 404) {
        forceUpdate = true;
      } else {
        throw e;
      }
    }

    const uploadPronunciation = async (pronunciationType, pronunciationUrl): Promise<String> => {
      if (!(pronunciationUrl && pronunciationUrl.startsWith('assets/'))) {
        return pronunciationUrl;
      }
      const fileChecksum = execSync(`git hash-object ${pronunciationUrl}` , {cwd})
        .toString().replace('\n', '').trim();

      const { data: { data: q }} = await sharedApiClient.post('/third_parties/qiniu/generate_token');

      const filepath = `${cwd}/${pronunciationUrl}`;
      const fileext = path.parse(pronunciationUrl).ext;

      const filekey = `wordbook-${remoteWordbook.slug}/${pronunciationUrl.replace(fileext, `.${fileChecksum}${fileext}`)}`;

      let fileExists = false;
      try {
        await sharedApiClient.post('/third_parties/qiniu/bucke_stat', { key: filekey })
        fileExists = true;
      } catch (e) {}

      if (!fileExists) {
        const r = await sharedQiniuClient.upload(
          q.uploadToken,
          filekey,
          filepath,
        );
      }
      return `${q.bucketDomain}/${filekey}`;
    };

    const ukPronunciationUrl = await uploadPronunciation('uk', localWord.uk_pronunciation_url);
    const usPronunciationUrl = await uploadPronunciation('us', localWord.us_pronunciation_url);
    if (localWord.custom) {
      forceUpdate = true;
    }

    if (forceUpdate) {
      let nextWord = localWord;

      if (localWord.custom) {
        nextWord = Object.assign(
          nextWord,
          {
            wordbook_id: remoteWordbook.id,
            uk_pronunciation_url: ukPronunciationUrl || undefined,
            us_pronunciation_url: usPronunciationUrl || undefined,
          }
        );
      }

      resp = await apiClient.post(`/words/${localWord.word}`, nextWord);
      logger.info(`Created a new word: "${localWord.word}"`);
    } else {
      logger.info(`Skipped a exist word: "${localWord.word}"`);
    }

    const { data: w } = resp.data;
    return w;
  } catch (e) {
    throw e;
  }
}

program
  .action(async (): Promise<void> => {
    if (!checkIsAuthorized()) return;

    logger.info('Publishing...');
    try {
      let wordbook = loadWordbook();
      const { info } = wordbook;

      let remoteWordbook;
      let remoteWordbookCreated = true;
      try {
        const r = await apiClient.get(`/wordbooks/${info.slug}`);
        remoteWordbook = r.data.data;
      } catch (e) {
        if (e.response && e.response.status === 404) {
          remoteWordbookCreated = false;
        } else {
          throw e;
        }
      }

      if (!remoteWordbookCreated) {
        const r = await apiClient.post('/wordbooks', info);
        remoteWordbook = r.data.data;
      }

      for (let i = 0; i < (wordbook.words || []).length; i++) {
        const word = wordbook.words[i];
        await createOrUpdateWord(remoteWordbook, word);
      }

      for (let i = 0; i < (wordbook.chapters || []).length; i++) {
        const chapter = wordbook.chapters[i];
        for (let j = 0; j < (chapter.words || []).length; j++) {
          const word = chapter.words[j];
          await createOrUpdateWord(remoteWordbook, word);
        }
      }

      if (info.repository_type === 'git' && fs.existsSync(`${cwd}/assets/cover.jpg`)) {
        const { data: { data: q }} = await sharedApiClient.post('/third_parties/qiniu/generate_token');

        const filename = 'assets/cover.jpg';
        const filepath = `${cwd}/${filename}`;
        const fileext = path.parse(filepath).ext;

        const fileChecksum = execSync(`git hash-object ${filename}` , {cwd})
          .toString().replace('\n', '').trim();

        const filekey = `wordbook-${remoteWordbook.slug}/${filename.replace(fileext, `.${fileChecksum}${fileext}`)}`;

        let fileExists = false;
        try {
          await sharedApiClient.post('/third_parties/qiniu/bucke_stat', { key: filekey })
          fileExists = true;
        } catch (e) {}

        if (!fileExists) {
          const r = await sharedQiniuClient.upload(
            q.uploadToken,
            filekey,
            filepath,
          );
        }

        wordbook = Object.assign(wordbook, {
          info: Object.assign(
            wordbook.info,
            { cover_url: `${q.bucketDomain}/${filekey}` },
          ),
        });
      }

      // 将单词列表数据更新到单词本
      await apiClient.patch(`/wordbooks/${info.slug}`, wordbook);

      logger.success(`Published ${wordbook.info.title} (${wordbook.info.slug})`);
    } catch (e) {
      if (e.response != null && e.response.data != null) {
        logger.error(JSON.stringify(e.response.data));
      }
      logger.error(e.message);
    }
  })
  .parse(process.argv);
