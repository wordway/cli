/* eslint-disable @typescript-eslint/camelcase */
import * as program from 'commander';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as YAML from 'yamljs';
import * as inquirer from 'inquirer';
import chalk from 'chalk';
import * as apkg from './utilities/apkg';
import logger from './utilities/logger';

const homeDir = os.homedir();
const cwd = `${process.cwd()}`;

const rmdir = dir => {
  let files = fs.readdirSync(dir);
  for (var i = 0; i < files.length; i++) {
    let newPath = path.join(dir, files[i]);
    let stat = fs.statSync(newPath);
    if (stat.isDirectory()) {
      rmdir(newPath);
    } else {
      fs.unlinkSync(newPath);
    }
  }
  fs.rmdirSync(dir);
}

program
  .option('-t, --title <string>', 'title')
  .option('-s, --summary <string>', 'summary')
  .option('--apkg <string>', 'apkg')
  .parse(process.argv);

setTimeout(async (): Promise<void> => {
  const slug = program.args[0];
  const wordbookPath = `${process.cwd()}/wordbook-${slug}`;

  if (fs.existsSync(wordbookPath)) {
    logger.error(`Wordbook ${slug} already exists!`);
    return;
  }

  try {
    const packageJson = {
      name: `wordbook-${slug}`,
      version: '1.0.0',
    };

    const { title, visibility, difficultyLevel } = await inquirer.prompt([
      ...((program.title || '').length > 0 ? [] : [
        {
          type: 'input',
          name: 'title',
        }
      ]),
      {
        type: 'list',
        name: 'visibility',
        choices: [
          { name: 'Public' , value: 'public' },
          { name: 'Private', value: 'private' },
        ]
      },
      {
        type: 'list',
        name: 'difficultyLevel',
        message: 'difficulty level:',
        choices: [
          { value: 'D1', name: 'D1 - Easy' },
          { value: 'D2', name: 'D2 - Moderate' },
          { value: 'D3', name: 'D3 - Hard' },
          { value: 'D4', name: 'D4 - Challenging' },
        ]
      }
    ]);

    const wordbook = {
      wordway: '1.0.0',
      info: {
        slug,
        title: program.title || title || 'A example wordbook',
        summary: program.summary || '',
        tags: ['wordway', 'example'],
        visibility,
        difficulty_level: difficultyLevel,
        repository_type: '',
        repository_url: '',
        author: '',
        author_email: '',
        author_link: '',
      },
      words: [
        { word: 'hello' },
        { word: 'world' },
      ],
    };

    if (program.apkg) {
      let apkgPath = `${program.apkg}`;
      let apkgFilename = apkgPath.substr(apkgPath.lastIndexOf('/') + 1);
      let outputPath = `${homeDir}/.wordway/tmp/${apkgFilename.substr(0, apkgFilename.lastIndexOf('.'))}`;

      if (apkgPath.startsWith('.')) {
        apkgPath = path.join(cwd, apkgPath);
      }

      let words = await apkg.extract({
        apkgPath,
        outputPath: outputPath,
      });
      wordbook.words = words;

      // 删除临时解压文件夹
      rmdir(outputPath);
    }

    logger.info('Creating...');
    fs.mkdirSync(wordbookPath);
    fs.writeFileSync(`${wordbookPath}/README.md`, `# ${packageJson.name}`);
    logger.info(`Generated: ${chalk.cyan('README.md')}`);
    fs.writeFileSync(`${wordbookPath}/package.json`, JSON.stringify(packageJson, null, 2));
    logger.info(`Generated: ${chalk.cyan('package.json')}`);
    fs.writeFileSync(`${wordbookPath}/wordbook.yaml`, YAML.stringify(wordbook, 8, 2));
    logger.info(`Generated: ${chalk.cyan('wordbook.yaml')}`);
    logger.success(`Created ${slug} at ${wordbookPath}`);
  } catch (e) {
    logger.error(e.message);
  }
});
