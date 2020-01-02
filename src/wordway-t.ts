/* eslint-disable @typescript-eslint/no-explicit-any,no-console */
import 'isomorphic-fetch'
import * as program from 'commander'
import chalk from 'chalk'
import Translate from '@wordway/translate-api'
import BingWebEngine from '@wordway/translate-webengine-bing'
import YoudaoWebEngine from '@wordway/translate-webengine-youdao'

import logger from './utilities/logger'

program
  .option('-e, --engine <string>', 'Translate engine.')
  .action(
    async (source): Promise<void> => {
      const bingWebEngine = new BingWebEngine()
      const youdaoWebEngine = new YoudaoWebEngine()

      const client = new Translate([bingWebEngine, youdaoWebEngine])

      try {
        const lookUpResult = await client
          .engine(program.engine || 'bing-web')
          .lookUp(source)

        const {
          word,
          tip,
          usIpa,
          ukIpa,
          definitions,
          tenses,
          sentences
        } = lookUpResult

        // 单词及音标
        console.log(
          [
            chalk.white(word),
            '  ',
            usIpa ? chalk.red(`美[ ${usIpa} ]  `) : '',
            ukIpa ? chalk.red(`英[ ${ukIpa} ]  `) : ''
          ].join('')
        )
        console.log('\r')

        // 提示
        if (tip) {
          console.log(chalk.bgYellow(` ${tip} `))
          console.log('\r')
        }

        // 释义
        if (definitions) {
          const fn = (d, i): string => {
            return [
              `${chalk.green(`- ${d.type}`)} `,
              `${chalk.green(d.values.join('；'))}`,
              i < definitions.length - 1 ? '\n' : ''
            ].join('')
          }
          console.log([...definitions.map(fn)].join(''))
          console.log('\r')
        }

        // 时态
        if (lookUpResult.tenses) {
          const fn = (d): string => {
            return `${chalk.gray(d.name)}：${chalk.blue(d.values.join('；'))}  `
          }
          console.log([...tenses].map(fn).join(''))
          console.log('\r')
        }

        // 例句
        if (sentences) {
          const slicedSentences = sentences.slice(0, 6)
          const fn = (d, i): string => {
            const { source: s, target: t } = d
            return [
              `${chalk.gray(`${i + 1}. ${s}`)}\n`,
              `${chalk.cyan(`   ${t}`)}`,
              i < slicedSentences.length - 1 ? '\n' : ''
            ].join('')
          }
          console.log([...slicedSentences].map(fn).join(''))
          console.log('\r')
        }
      } catch (e) {
        logger.error(e.message)
      }
    }
  )
  .parse(process.argv)
