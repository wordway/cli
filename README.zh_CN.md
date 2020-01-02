# wordway-cli

[![npm version][npm-image]][npm-url]
[![Join the chat][telegram-image]][telegram-url]

[npm-image]: https://img.shields.io/npm/v/wordway-cli.svg
[npm-url]: https://www.npmjs.com/package/wordway-cli
[telegram-image]:https://img.shields.io/badge/chat-on%20telegram-blue.svg
[telegram-url]: https://t.me/wordway

[English](./README.md) | 简体中文

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [安装](#%E5%AE%89%E8%A3%85)
  - [基本用法](#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95)
- [讨论](#%E8%AE%A8%E8%AE%BA)
- [许可证](#%E8%AE%B8%E5%8F%AF%E8%AF%81)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

Wordway 的命令行界面（CLI）

## 安装

先决条件：[Node.js](https://nodejs.org/en/) (>=4.x, 6.x preferred)，npm version 3+ 和 [Git](https://git-scm.com/)。

全局安装CLI

```bash
$ npm install -g wordway-cli
```

现在，您可以使用以下命令在任何位置运行 CLI

```bash
$ wordway -V
```

### 基本用法

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

## 讨论

欢迎加入「wordway」的微信群或 [Telegram Group](https://t.me/wordway) 与我分享你的建议和想法。

> 由于微信的限制，请先添加我的微信号并备注『加入 wordway 用户群』。

![开发者微信](https://wordway-storage.thecode.me/screenshots/wechat_qrcode.png?imageView2/2/w/280/format/png)

## 许可证

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
