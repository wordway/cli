# wordway-cli

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=lijy91%40live.com&currency_code=USD&source=url)

[English](./README.md) | 简体中文

Wordway 的命令行界面（CLI）

## 安装

先决条件：[Node.js](https://nodejs.org/en/) (>=4.x, 6.x preferred)，npm version 3+ 和 [Git](https://git-scm.com/)。

全局安装CLI

```bash
$ npm install -g git+https://github.com/wordway/wordway-cli.git
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
