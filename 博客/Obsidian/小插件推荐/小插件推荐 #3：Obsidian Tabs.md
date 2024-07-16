---
tags: 博客, Obsidian, ObsidianTabs
created_at: 2024-07-15 11:24:16
plugins: 
platforms:
  - name: 知乎
    url: https://zhuanlan.zhihu.com/p/708922449
    date: 2024-07-15 15:39:06
    last_update: 2024-07-15 15:39:14
  - name: 掘金
    url: https://juejin.cn/spost/7391693209360351268
    date: 2024-07-15 15:39:27
    last_update: 2024-07-15 15:39:30
updated_at: 2024-07-15 15:40:45
---


| 平台                          | 发布时间                                | 更新时间                                       | 文章地址                           |
| :-------------------------- | :---------------------------------- | :----------------------------------------- | :----------------------------- |
| `VIEW[{platforms[0].name}]` | `INPUT[dateTime:platforms[0].date]` | `INPUT[dateTime:platforms[0].last_update]` | `INPUT[text:platforms[0].url]` |
| `VIEW[{platforms[1].name}]` | `INPUT[dateTime:platforms[1].date]` | `INPUT[dateTime:platforms[1].last_update]` | `INPUT[text:platforms[1].url]` |

一时兴起（以前基本不看不关心的插件变更信息）在查看 Obsidian 插件更新时顺便浏览了一下 Tasks 插件版本（7.6.1）的更新内容，发现里面提及了一款新地插件 **Tabs Plugins** 在 Tasks 中的使用。好奇点开后，发现是对 [Code Tab](https://github.com/lazyloong/obsidian-code-tab) 插件的扩展，于是就有了本文。

## Code Tab 插件介绍

Code Tab 这个插件的介绍可以参考 PKMer 社区中的文章：

- [PKMer_Obsidian 插件：code tab 还能这么“玩”](https://pkmer.cn/Pkmer-Docs/10-obsidian/obsidian%E7%A4%BE%E5%8C%BA%E6%8F%92%E4%BB%B6/code-tab%E8%BF%98%E8%83%BD%E8%BF%99%E4%B9%88%E7%8E%A9/)
- [PKMer_Obsidian 插件：Code Tab 不止于混合代码块](https://pkmer.cn/Pkmer-Docs/10-obsidian/obsidian%E7%A4%BE%E5%8C%BA%E6%8F%92%E4%BB%B6/obsidian-code-tab/)

作者早期在记笔记时是使用的 [ptournet/obsidian-html-tabs](https://github.com/ptournet/obsidian-html-tabs) 这款插件（从 PKMer 社区文章《obsidian 社区插件》〔编辑增强章节〕得知），后来又从 PKMer 社区中发现了 Code Tab 这款插件——毫不犹豫就易主了。

使用 Code Tab 的原因：

1. 样式比较符合个人对 UI 的审美要求。
2. 写法相比 HTML Tabs 更简洁。

Code Tab 插件的功能比较单一——仅将内容显示为选项卡，并且作者也未将插件发布到社区，所以需要手动安装使用。使用方式为：

`````
````tab
tab: 选项卡一： 普通文本
这里选项卡内容

tab: 选项卡二：代码
```js
console.log("Hello World")
```
````
`````

效果如下：

![[动画2 67.gif]]

可以看到功能真的很简单，但是作为用户在使用的过程中总有一些想法和特定场景的需求。

- 对于复杂的内容，我们可能想要嵌套使用 Tab。
- Tab 选项是否可以动态增加和删除，而不是每次都要通过编辑块来修改内容。
- 同样，对于内容能否直接编辑。
- ......

接下来我们来看看 Obsidian Tabs 插件能带来什么样的惊喜。

## Obsidian Tabs 介绍

![[Pasted image 20240715152116.png]]

Obsidian Tabs 插件的使用方式与 Code Tab 基本一致，只不过代码块名称使用 `tabs`。插件的安装，可以去 Obsidian 的插件市场搜索 "Tabs" 直接安装即可。

Obsidian Tabs 插件有以下功能点：

- 支持 Tab 嵌套。
- 额外支持 `~~~` 的方式来创建代码块，方便嵌套。
- 提供上下文菜单来【添加】【删除】【复制】和【粘贴】选项卡。
- 支持直接编辑选项卡内容（通过在选项卡内容区域快速【双击】鼠标来切换）。
- 支持将选中内容转换为选项卡内容。
- 支持将选中的内容添加到已有的选项卡中。
- 支持自定义选项卡分隔符（默认为：`tabs:`）。

因为这个插件在使用上没有什么可探究的地方所以我们只简单介绍功能点，具体使用可以直接看官方介绍文档。这里提及一点：对于选项卡较多时横向滚动需要按住<kbd>Shift</kbd>再滚动鼠标。

在使用的过程中也发现了一些小问题，同时也期望作者能够修复和提供支持：

- 【问题】选项卡标题自动切换到“新增”内容选项卡（目前只支持内容切换，选项卡标题不会〔特别是选项卡较多时，需要自己滚动鼠标〕）
- 【问题】对于选项卡标题位于左右两侧显示不全时，点击标题自动向左/右移动来显示全部选项卡标题名称。
- 【建议】对于选项卡中内容为代码块的区域中的选区取消浮动工具栏（没有必要）。
- 【功能】提供垂直方向上的选项卡支持（非必须）。
- 【功能】标签较多时提供一个 "..." 的按钮 Hover 选择更多的选项卡。
- 【功能】选项卡位置调整（拖动实现），这个发现作者在计划支持中。
## 总结

最后，动动你发财的小手，关注，点赞一键三连，你的鼓励是我坚持下去的动力。有任何问题欢迎加作者微信（`jenemy_xl`）沟通交流一起成长或者加入读者交流微信群一起探讨 Obsidian 的使用技巧和资源分享。

更多内容，请关注我的专栏：[Obsidian 达人成长之路 - 知乎 (zhihu.com)](https://www.zhihu.com/column/c_1776563728286670848)

## 参考

- [xhuajin/obsidian-tabs (github.com)](https://github.com/xhuajin/obsidian-tabs)2024-07-15 15:31:242024-07-15 15:33:04