---
created_at: 2024-06-12 18:29:11
tags:
  - Blog
  - Obsidian
  - NoteDefinitions
platforms:
  - name: 知乎
    url: https://zhuanlan.zhihu.com/p/703193841
    date: 2024-06-13 15:40
    last_update: 2024-06-13 15:40
  - name: 掘金
    url: https://juejin.cn/post/7379487557598003237
    date: 2024-06-13 15:48
    last_update: 2024-06-13 15:48
updated_at: 2024-06-18 16:18:13
plugins:
  - Obsidian-Note-Definitions
---

| 平台                          | 发布时间                                | 更新时间                                       | 文章地址                           |
| :-------------------------- | :---------------------------------- | :----------------------------------------- | :----------------------------- |
| `VIEW[{platforms[0].name}]` | `INPUT[dateTime:platforms[0].date]` | `INPUT[dateTime:platforms[0].last_update]` | `INPUT[text:platforms[0].url]` |
| `VIEW[{platforms[1].name}]` | `INPUT[dateTime:platforms[1].date]` | `INPUT[dateTime:platforms[1].last_update]` | `INPUT[text:platforms[1].url]` |

本篇文章向大家推荐一款新上架的小插件：[dominiclet/obsidian-note-definitions](https://github.com/dominiclet/obsidian-note-definitions)，目前版本：0.9.1。

这个插件的主要作用就是为特定的文字，比如专业术语，英文单词简写等提供一个浮框来显示其定义或者解释文字。

其实还有另外一款类似的插件 [vschroeter/obsidian-glossary](https://github.com/vschroeter/obsidian-glossary)，它是其于文件来定义术语。两者相比较，我们要介绍地这个插件它可以在单个文件中定义多个术语，所以极力推荐使用。

这个看似简单的功能，我们能玩出什么花样呢？其有哪此应用场景，相信读者看完本文后会发现本地 Obsidian 插件库又多了一员小将。


## 如何使用

插件的安装很简单，去 Obsidian 插件市场搜索关键词就可以了。

这个插件的配置选项就 2 项：

![[Pasted image 20240612185528.png]]

在根目录定义一个放置术语的文件夹，然后在这里填写上就可以了。这个插件目前作者还在持续更新中，我这里有点意外地是这个目录不能像其它插件那样自动给出一个目录列表供选择，而是手动输入，希望作者能改进一下。

这个插件的使用也非常简单，下面我在 `术语/Obsidian 插件.md` 中定义两个插件描述信息：

````
# Obsidian II Quicker

*Obsidian-II-Quicker*

The main feature of this plugin is to quickly insert common Markdown code and HTML code, including Sup, Sub, Audio, Video, Iframe, Left-Center-Right Alignment, Variables, Footnotes, Callout, Anchor Points, HTML Comments and so on.

---

# Obsidian Note Definitions

*Note Definitions*

A personal dictionary that can be easily looked-up from within your notes.
````

其中一级标题用于定义术语，紧跟标题后的加粗部分表示术语的别名，然后就是描述信息了，多个术语之前使用 `---` 水平线进行分隔，是不是很简洁，下面看一下实际效果：

![[动画2 54.gif]]

## 应用举例

下面我们来看一下这一小小地插件能给我们带哪些不一样的笔记体验。

### 示例一：为插件名称添加描述信息

这一个案例是结合作者写作 Obsidian 相关插件教程而定制的，把这些插件的名称和简单的介绍信息放置在 `术语/Obsidian 插件.md` 文件中，然后我们再结合 Templater 插件来将插件名作为选项，减少输入内容（哈哈，能偷懒就不必要苦干），如果插件有别名设置，我们进一步弹出一个 PROMPT 框让用户确认。

在定义插件时统一使用命名，并且单词首字母大写，别名通常省略掉 `Obsidian` 前缀和 `Plugin` 后缀。

例如：

- `Templater-Obsidian-Plugin` -> `Templater`
- `Obsidian-Text-expand` -> `Text Expand`
- `Obsidian-II-Quicker` -> `II Quicker`
- `Obsidian-Note-Definitions` -> `Note Definitions`

下面是具体实现参考：

````
%% 模板/插入插件名称.md %%

<%-*
const definitionFile = "术语/Obsidian 插件.md"
const tfile = tp.file.find_tfile(definitionFile)
const content = await app.vault.read(tfile)
const lines = content.split('\n')
const { headings, sections } = app.metadataCache.getFileCache(tfile)
// [标题，行数]
const pluginNames = []
const pluginAliases = []
headings.filter(h => h && h.level === 1)
   .forEach(h => {
        pluginNames.push([h.heading.trim(), h.position.start.line])
    })
const selectedHeading = await tp.system.suggester(name => name[0], pluginNames)
const aliasReg = /(?<=\*)(.+?)(?=\*)/g
const aliases = lines[selectedHeading[1] + 2]
let result
if (aliasReg.test(aliases)) {
    const ok = tp.system.prompt('使用别名？', aliases.match(aliasReg)[0])
    if (ok) {
        result = aliases.match(aliasReg)[0]
    } else {
        result = selectedHeading[0]
    }
} else {
    result = selectedHeading[0]
}
-%>

<%- result -%>
````

结果：

![[动画2 55.gif]]

### 示例二：英文学习单词注解

这个插件启发了我，让我想到了在看书学习英文地时候，面对陌生地单词我们我习惯性在单词空白处写上对应的中文意思。而电子书时代我们会使用批注，通常左边正文内容，右边生僻单词注解。有了这个插件我们在通过 Obsidian 学习英文，摘录文章时，可以优雅地处理词汇问题。当然作者目前没有去研究英文学习相关的插件，这里只是借助这个插件所能联想到的应用场景。

下面是网上摘抄的一段英文，选择了 2 个单词将其定义在了 `术语/英文单词.md` 中，定义就不展示了。

````
But science does provide us with the best available guide to the future, and it is critical that our nation and the world base important policies on the best judgments that science can provide concerning the future consequences of present actions.
````

效果如下：

![[动画2 56.gif]]

从上面的 GIF 图片来看效果还是挺不错的。

## 总结

这个插件很有用，但是也有些注意事项:

1. 英文前后需要添加空格，但是在中文 `。` 后面的英文内容添加空格又显得太宽，不加不生效。
2. 不支持多个别名设置，且别名设置所在行前不能有空白内容。

读者可以定义一个 `Templater` 的词条来测试下面的内容：

````
中文语句后。Templater 前没有空格。❌
中文语句后。 Templater 前没有空格。✔

中文括号（Templater）❌
中文括号（ Templater ）✔

插件：Templater ❌
插件： Templater ✔
插件:Templater ✔
插件 Templater。❌
插件 Templater 。✔

乔布斯那句话是怎么说的？「Templater」❌
乔布斯那句话是怎么说的？「 Templater 」✔
````

同时作者也提了一个 [ISSUE](https://github.com/dominiclet/obsidian-note-definitions/issues/38) 给插件仓库，希望能更好地支持中英文混合排版的场景。

最后，动动你发财的小手，关注，点赞一键三连，你的鼓励是我坚持下去的动力。有任何问题欢迎加作者微信（`jenemy_xl`）沟通交流一起成长或者加入读者交流微信群一起探讨 Obsidian 的使用技巧和资源分享。

更多内容，请关注我的专栏：[Obsidian 达人成长之路 - 知乎 (zhihu.com)](https://www.zhihu.com/column/c_1776563728286670848)

## 参考

- [dominiclet/obsidian-note-definitions (github.com)](https://github.com/dominiclet/obsidian-note-definitions)
- [Obs159｜Obsidian術語詞彙整合－Note Definitions外掛 – 簡睿隨筆 (jdev.tw)](https://jdev.tw/blog/8450/obsidian-definitions-plugin)
- [中英混排中的标点符号问题 | Hutrua Space](https://www.hutrua.com/blog/2018/07/22/punctuation.html)
- [mzlogin/chinese-copywriting-guidelines: Chinese Copywriting Guidelines：中文文案排版指北（简体中文版） (github.com)](https://github.com/mzlogin/chinese-copywriting-guidelines)