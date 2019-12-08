/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const fs = require('fs');
const unzipper = require('unzipper');
const sqlite3 = require('sqlite3').verbose();

const apkgUnzip = ({
  apkgPath,
  outputPath,
}) => {
  const readStream = fs.createReadStream(apkgPath);
  return new Promise((resolve, reject) => {
    readStream
      .pipe(unzipper.Extract({
        path: outputPath,
      }))
      .on('finish', (err) => {
        if (err) reject(err);
        else resolve();
      });
  });
}

const apkgExtract = async ({ apkgPath, outputPath }) => {
  if (!outputPath) {
    outputPath = apkgPath.replace('.apkg', '');
  }

  if (!fs.existsSync(outputPath)) {
    await apkgUnzip({ apkgPath, outputPath });
  }

  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(
      `${outputPath}/collection.anki2`,
      sqlite3.OPEN_READONLY,
      (e) => {
        if (e) throw e;
      },
    );

    let words = [];
    db.each(
      'SELECT sfld as word FROM notes LIMIT 0, 10000',
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        words.push(row);
      },
      (err, num) => {
        db.close();

        if (err) {
          reject(err);
          return;
        }
        words = words.map((v) => {
          if (v.word.indexOf('[sound') >= 0) {
            const fixedWord = v.word.substr(0, v.word.indexOf('['));
            return Object.assign(v, { word: fixedWord });
          }
          return v;
        })
        resolve(words);
      }
    );
  });
}

const apkg = {
  unzip: apkgUnzip,
  extract: apkgExtract,
};

module.exports = apkg;
