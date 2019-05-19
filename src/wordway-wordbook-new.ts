import * as program from 'commander';
import * as fs from 'fs';
import * as YAML from 'yamljs';
import chalk from 'chalk';
import logger from './utilities/logger';

program
  .option('-t, --title <string>', 'title')
  .option('-s, --summary <string>', 'summary')
  .parse(process.argv);

setTimeout((): void => {
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

    const wordbook = {
      wordway: '1.0.0',
      info: {
        slug,
        title: program.title || 'A wordbook example',
        summary: program.summary || '',
        tags: ['wordway', 'example'],
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
