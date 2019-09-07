/* eslint-disable @typescript-eslint/camelcase */
import * as program from 'commander';
import * as fs from 'fs';
import * as YAML from 'yamljs';
import * as inquirer from 'inquirer';
import chalk from 'chalk';
import logger from './utilities/logger';

program
  .option('-t, --title <string>', 'title')
  .option('-s, --summary <string>', 'summary')
  .parse(process.argv);

setTimeout(async (): Promise<void> => {
  const slug = program.args[0];
  const path = `${process.cwd()}/wordbook-${slug}`;

  if (fs.existsSync(path)) {
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

    logger.info('Creating...');
    fs.mkdirSync(path);
    fs.writeFileSync(`${path}/README.md`, `# ${packageJson.name}`);
    logger.info(`Generated: ${chalk.cyan('README.md')}`);
    fs.writeFileSync(`${path}/package.json`, JSON.stringify(packageJson, null, 2));
    logger.info(`Generated: ${chalk.cyan('package.json')}`);
    fs.writeFileSync(`${path}/wordbook.yaml`, YAML.stringify(wordbook, 8, 2));
    logger.info(`Generated: ${chalk.cyan('wordbook.yaml')}`);
    logger.success(`Created ${slug} at ${path}`);
  } catch (e) {
    logger.error(e.message);
  }
});
