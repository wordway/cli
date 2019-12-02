import * as program from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import logger from './utilities/logger';

const cwd = `${process.cwd()}`;

program
  .option('-i, --input [path]', '')
  .option('-o, --output [path]', '')
  .action(async (): Promise<void> => {
    try {
      const r = new RegExp(/([a-zA-Z])\w+/g);

      let map = {};

      let inputPath = program.input;
      let outputPath = program.output;

      if (inputPath.startsWith('.')) {
        inputPath = path.join(cwd, inputPath);
      }
      if (outputPath.startsWith('.')) {
        outputPath = path.join(cwd, outputPath);
      }

      console.log(inputPath);

      if (fs.existsSync(inputPath)) {
        let filePaths = [];

        if (fs.lstatSync(inputPath).isDirectory()) {
          filePaths = fs.readdirSync(inputPath).map(v => `${inputPath}/${v}`);
        } else {
          filePaths = [inputPath];
        }

        for (let i = 0; i < filePaths.length; i += 1) {
          const filePath = filePaths[i];

          if (fs.lstatSync(filePath).isDirectory()) {
            continue;
          }

          let text = fs.readFileSync(filePath).toString();
          let words = text.match(r);

          for (let i = 0; i < (words || []).length; i++) {
            const word = words[i];
            map[word] = 1 + (map[word] || 0);
          }
        }
      }

      console.log(JSON.stringify(map, null, 2));

      if (outputPath) {
        let sortedWords = Object
          .keys(map)
          .map(key => {
            return { word: key, numberOfTimes: map[key]};
          })
          .sort(((v1, v2): any => {
            return v2.numberOfTimes - v1.numberOfTimes;
           }));
        fs.writeFileSync(outputPath, JSON.stringify(sortedWords, null, 2));
      }

      logger.success(`Extracted`);
    } catch (e) {
      logger.error(e.message);
    }
  })
  .parse(process.argv);
