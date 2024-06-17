<%*
const isDefaultTitle = tp.file.title.startsWith("Untitled") || tp.file.title.startsWith("未命名")
const defaultTags = ["博客", "Obsidian"]
let title
let titleInTags
let selectedArticleType
const articleTypes = [
    {
        name: "达人成长之路系列",
        value: 1,
        prefix: 'Obsidian 达人成长之路：',
        suffix: ' 插件使用',
        directory: '博客/Obsidian/达人成长之路'
    },
    {
        name: "小插件系列",
        value: 2,
        prefix: '小插件推荐：',
        suffix: '',
        directory: '博客/Obsidian/小插件推荐'
    }
]

if (isDefaultTitle) {
    selectedArticleType = await tp.system.suggester(item => item.name, articleTypes)
    if (!selectedArticleType) selectedArticleType = articleTypes[0]
	title = await tp.system.prompt("Title")
    if (title.trim() !== "") {
        titleInTags = title.split(" ").join("")
        const name = `${selectedArticleType.prefix}${title}${selectedArticleType.suffix}`
        await tp.file.rename(name)
        const file = tp.file.find_tfile(name)
    } else {
        title = tp.file.title
    }
} else {
	title = tp.file.title
}

const newFileName = `${selectedArticleType.directory}/${selectedArticleType.prefix}${title}${selectedArticleType.suffix}`
if (isDefaultTitle) {
    const parentPath = tp.config.active_file.parent.path
    console.log(parentPath, newFileName)
    // 如果不包含目录，或者目录不是默认目录，则移动到默认目录
    if (!parentPath.startsWith(articleTypes.directory) || parentPath === 'undefined') {
        await tp.file.move(newFileName);
    }
}
-%>

<%_ "---" %>
tags: 博客, Obsidian, <% titleInTags %>
created_at: <% tp.file.last_modified_date('YYYY-MM-DD HH:mm:ss') %>
platforms:
  - name: 知乎
    url: ''
    date: ''
    last_update: ''
  - name: 掘金
    url: ''
    date: ''
    last_update: ''
<% "---" %>

| 平台                        | 发布时间                            | 更新时间                                   | 文章地址                       |
|:--------------------------- |:----------------------------------- |:------------------------------------------ |:------------------------------ |
| `VIEW[{platforms[0].name}]` | `INPUT[dateTime:platforms[0].date]` | `INPUT[dateTime:platforms[0].last_update]` | `INPUT[text:platforms[0].url]` |
| `VIEW[{platforms[1].name}]` | `INPUT[dateTime:platforms[1].date]` | `INPUT[dateTime:platforms[1].last_update]` | `INPUT[text:platforms[1].url]` |


<% tp.file.cursor() -%>

## 总结

最后，动动你发财的小手，关注，点赞一键三连，你的鼓励是我坚持下去的动力。有任何问题欢迎加作者微信（`jenemy_xl`）沟通交流一起成长或者加入读者交流微信群一起探讨 Obsidian 的使用技巧和资源分享。

更多内容，请关注我的专栏：[Obsidian 达人成长之路 - 知乎 (zhihu.com)](https://www.zhihu.com/column/c_1776563728286670848)

## 参考

- 