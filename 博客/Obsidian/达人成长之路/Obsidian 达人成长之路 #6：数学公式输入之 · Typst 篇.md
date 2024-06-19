---
tags:
  - 博客
  - Obsidian
  - Typst
  - MathLinks
created_at: 2024-06-18 15:18:43
platforms:
  - name: 知乎
    url: ""
    date: ""
    last_update: ""
  - name: 掘金
    url: ""
    date: ""
    last_update: ""
plugins:
  - Obsidian-typst
  - Obsidian-MathLinks
updated_at: 2024-06-18 18:06:35
---

| 平台                          | 发布时间                                | 更新时间                                       | 文章地址                           |
| :-------------------------- | :---------------------------------- | :----------------------------------------- | :----------------------------- |
| `VIEW[{platforms[0].name}]` | `INPUT[dateTime:platforms[0].date]` | `INPUT[dateTime:platforms[0].last_update]` | `INPUT[text:platforms[0].url]` |
| `VIEW[{platforms[1].name}]` | `INPUT[dateTime:platforms[1].date]` | `INPUT[dateTime:platforms[1].last_update]` | `INPUT[text:platforms[1].url]` |

Typst 是可用于出版的可编程标记语言，拥有变量、函数与包管理等现代编程语言的特性，注重于科学写作 (science writing)，定位与 LaTeX 相似。

Typst 的排版功能非常的强大，与 Obsidian 结合使用无疑是双赢的局面。由于 Typst 功能很多，这篇文章中我们主要聚焦于它的数学排版功能，也就是使用它在 Obsidian 中高效地输入数学公式。

读者看到文章标题可能会想，难道还有别的“篇”？

没错，后续我们会介绍 **LaTex** 和 **Asciimath** 这二种数学公式输入方式，只不过和读者见面时间会相对较长时间，因为作者需要边学习边写作，期待中...

目前所使用的插件为 Typst Renderer，当前版本为 0.10.0。

由于插件还在迭代中，下载量也不是很高，所以会存在一些问题，比如在 Obsidian 中中文字体渲染不出来。所以作者会结合 VSCode 安装插件 **Typst LSP** 和 **Typst Preview** 在本地或者使用官方提供的在线应用来举例并截图。

## 快速入门

在插件市场搜索关键词 Typst Renderer 并安装，然后在选项中开启【Override Math Blocks】，这样在输入 `$ 公式 $` 时会使用 Typst 来渲染。

## 一些使用问题

作者在 Obsidian 中使用 Typst 时遇到的一些问题在此作一个简单的记录，有的是插件本身的问题，有的是和别的插件冲突了。

1. Typest 的标题语法和 Dataview 的内联查询语法冲突。
2. 插入图片时无法指定图片路径（嵌套目录），无法识别 PNG 图（报签名错误）。
3. 字体颜色不会适配 Obsidian 主题切换。

## 总结

最后，动动你发财的小手，关注，点赞一键三连，你的鼓励是我坚持下去的动力。有任何问题欢迎加作者微信（`jenemy_xl`）沟通交流一起成长或者加入读者交流微信群一起探讨 Obsidian 的使用技巧和资源分享。

更多内容，请关注我的专栏：[Obsidian 达人成长之路 - 知乎 (zhihu.com)](https://www.zhihu.com/column/c_1776563728286670848)

## 参考

- [fenjalien/obsidian-typst: Renders typst code blocks in Obsidian into images using Typst through the power of WASM! (github.com)](https://github.com/fenjalien/obsidian-typst)
- [zhaoshenzhai/obsidian-mathlinks: An Obsidian.md plugin to render MathJax in your links. (github.com)](https://github.com/zhaoshenzhai/obsidian-mathlinks)
- [typst/typst: A new markup-based typesetting system that is powerful and easy to learn. (github.com)](https://github.com/typst/typst)
- [概览 – Typst 中文文档 (typst-doc-cn.github.io)](https://typst-doc-cn.github.io/docs/)
- [如何看待 typst? - 知乎 (zhihu.com)](https://www.zhihu.com/question/591143170/answer/3304601296)
- [（大学）数学试卷模板 （Typst） - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/688745925)
- [typst教程和模版 - 知乎 (zhihu.com)](https://www.zhihu.com/column/c_1663858318866124801)
- [General Symbols – Typst Documentation](https://typst.app/docs/reference/symbols/sym/)
- [Typst: Universe](https://typst.app/universe)
- [gaoachao/uniquecv-typst: A simple resume template written in Typst (github.com)](https://github.com/gaoachao/uniquecv-typst)
- [TideDra/seu-thesis-typst: 东南大学Typst论文模板库 (github.com)](https://github.com/TideDra/seu-thesis-typst/)
- [nju-lug/modern-nju-thesis: 南京大学学位论文 Typst 模板 modern-nju-thesis (github.com)](https://github.com/nju-lug/modern-nju-thesis)
- [werifu/HUST-typst-template: 华科毕业论文（本科）的 typst 模板 (github.com)](https://github.com/werifu/HUST-typst-template)
- [howardlau1999/sysu-thesis-typst: 中山大学学位论文 Typst 模板 (github.com)](https://github.com/howardlau1999/sysu-thesis-typst)
- [pku-typst/pkuthss-typst: Typst template for dissertations in Peking University (PKU). (github.com)](https://github.com/pku-typst/pkuthss-typst)