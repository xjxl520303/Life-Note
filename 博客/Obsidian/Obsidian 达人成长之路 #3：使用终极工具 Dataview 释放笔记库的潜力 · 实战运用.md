## Obsidian Example Valut 案例集精选

[Dataview Example Vault (s-blu.github.io)](https://s-blu.github.io/obsidian_dataview_example_vault/) 提供了丰富的 Dataview 使用案例。通过这个示例仓库，用户可以学习到很多关于 Dataview 的知识，将其应用到自己的 Obsidian 工作流程中。这是一个很好的起点，但是由于其内容较多，需要花费大量时间和精力去实操，这是一个必然的过程，但是这个路不必自己去亲自走一遍，因为我已经为读者开辟了道路。

这一节我们将对其进行介绍，并挑选一部分具有代表性的典型案例来讲解，让读者感受其强大之处，并借鉴到自己的工作流程当中。

### 数据集

案例集提供了多种场景数据来展示，下面是一个简单介绍：

- assignments 目录

#### books 目录

记录了作者正在阅读的书籍的令牌，包含了书籍作者、主题、分类、总页数、书籍封面以及阅读进度（当前已阅读页数）信息。

#### dailys 目录

这是一个存放作者日记的目录，内容记录了每天的心情（高兴、紧张、悲伤、不舒服等）、健康状况（头痛、腰痛、腿痛等）、日程安排（和谁约会，见面等）、日常起居时间（起床、午餐、晚餐和入睡时间）、锻炼数据（锻炼时间，仰卧起坐个数和步行数）、好习惯（祈祷、呼吸、感恩和放松）等数据。

- food 目录

- games 目录

- people 目录

- projects 目录

- shows 目录

### 精选案例

下面是作者觉得具有一定代表性的案例甄选，代码有一定程度的修改，但功能保持不变。

#### 计算连续头痛的周期和持续时间

> 位置：20 Dataview Queries/Calculate cycle lengths and durations

通过 YAML 中的属性 `wellbeing.pain-type` 是否包含 `head` 来判断当日是否有头痛记录，然后计算持续的天数以及上一次的间隔周期。

````
```dataviewjs
const dt = dv.luxon.DateTime
const dur = dv.luxon.Duration

// 返回一个由每个页面的前一天的页面（如果存在）组成的集合，并按日期降序排序。需要注意的是，并不是所有日期都有前一天的数据。
let startDates = dv.pages('"10 Example Data/dailys"')
    .mutate(p => p.previousDay = dv.page(dt.fromMillis(p.file.day - dv.duration("1d"))
        .toFormat('yyyy-MM-dd')))
        .sort(p => p.file.name)

// 结束日期的数据：当日没有记录数据，但前一天有记录。
const endDates = dv.array(dv.clone(startDates)[0]).where(p => !checkCriteria(p) && checkCriteria(p.previousDay))

// 开始日期的数据：当日有记录数据，但前一天无记录。
startDates = startDates.where(p => checkCriteria(p) && !checkCriteria(p.previousDay))

// 存放周期数据
const cycles = []

for (let i = 0; i < endDates.length; i++) {
    cycles.push([
        startDates[i].file.link,
        endDates[i].file.link,
        dur.fromMillis(endDates[i].file.day - startDates[i].file.day),
        i === 0 ? '' : dur.fromMillis(startDates[i].file.day - endDates[i-1]?.file.day),
        i === 0 ? '' : dur.fromMillis(startDates[i].file.day - startDates[i-1]?.file.day).toFormat("d '天'")
    ])
}

// 输出为表格
dv.table(["开始", "结束", "持续时间", "间隔", "间隔周期"], cycles)

function checkCriteria(p) {
    return p && p.wellbeing && (p.wellbeing["pain-type"] || []).contains("head")
}
```
````

结果：

![[Pasted image 20240511181827.png]]

#### 根据复选框动态显示内容

>位置：20 Dataview Queries/Display or hide dataview queries based on a task selection

当前页面中以作者名为任务名，当任务完成时自动去查询在日记中有引用自该作者的语录，当取消完成时，自动移除相关语录信息。

````
- [x] Michel Foucault
- [ ] Walter Benjamin
- [ ] Karl Marx

```dataviewjs
const checklist = dv.current().file.tasks.where(t => t.completed)
const authors = ["Michel Foucault", "Walter Benjamin", "Karl Marx"]

// 这里将原来代码中的 3 段代码用一个遍历重写了
authors.forEach(author => {
    if (isActive(author)) {
        dv.header(2, `${author} quotes`)
        dv.list(dv.pages('"10 Example Data/dailys"').flatMap(p => p.file.lists)
            .where(l => l.author == author)
            .text)
    }
})

function isActive(name) {
// 原代码使用 `t.text == name` 来判断并不准确
// 因为我们安装了 tasks 插件后，任务完成会自动加上表情符号和完成日期。
    return checklist.where(t => t.text.contains(name))[0]
}
```
````

结果：

![[Pasted image 20240511193408.png]]


## 常见问题

在插件使用过程中或多或少会遇到些问题，下面我们搜集了一些常见问题供帮助读者排忧解难。

### 苹果系统中插入 HTML 代码中包含 `<img>` 标签并指定了本地图片，图片不显示问题。

下面是插入本地图片的一段常见代码，具有网页开发经验的读者觉得应该没毛病吧。

````
```dataviewjs
const attachments = this.app.vault.getConfig("attachmentFolderPath")
const basePath = this.app.vault.adapter.basePath
const image = "Pokémon-Icon_001.png"

const html = `
<img src="${basePath}/${attachments}/${image}" />
`

dv.el("div", html)
```
````

实际运行会发现图片并没有成功显示，控制台报 `net::ERR_FILE_NOT_FOUND` 错误。正确的使用姿势是在原有的路径上添加 `file:///` 前缀，即：`<img src="file://${basePath}/${attachments}/${image}" />`。

## 参考

- [Can't use HTML tag `<img>` to show local picture - Bug graveyard - Obsidian Forum](https://forum.obsidian.md/t/cant-use-html-tag-img-to-show-local-picture/34272)