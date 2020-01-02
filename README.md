# wordway-cli

[![npm version][npm-image]][npm-url]
[![Join the chat][telegram-image]][telegram-url]

[npm-image]: https://img.shields.io/npm/v/wordway-cli.svg
[npm-url]: https://www.npmjs.com/package/wordway-cli
[telegram-image]:https://img.shields.io/badge/chat-on%20telegram-blue.svg
[telegram-url]: https://t.me/wordway

English | [简体中文](./README.zh_CN.md)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Installation](#installation)
  - [Usage](#usage)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

Command-line Interface (CLI) for Wordway

## Installation

Prerequisites: [Node.js](https://nodejs.org/en/) (>=4.x, 6.x preferred), npm version 3+ and [Git](https://git-scm.com/).

Install CLI globally with

```bash
$ npm install -g wordway-cli
```

Now you can run CLI using following command anywhere

```bash
$ wordway -V
```

### Usage

```bash
Usage: wordway [options] [command]

Command-line Interface (CLI) for Wordway

Options:
  -V, --version  output the version number
  -h, --help     output usage information

Commands:
  t
  extract
  gentoc
  login          Log in.
  logout         Log out.
  config         Manages the `wordway-cli` configuration files.
  wordbook       Manage wordbooks.
  help [cmd]     display help for [cmd]
```

## License

```
MIT License

Copyright (c) 2019 JianyingLi <lijy91@foxmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
