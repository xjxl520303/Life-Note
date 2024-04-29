---
tags:
  - 博客
  - Obsidian
---
DataView 是 Obsidian 社区最受欢迎的插件之一，它提供了一个在知识库上实时索引和查询的引擎，我们通过在文档中添加**属性**（Properties）或者称之**元数据**（Metadata）来为 DataView 查询语言提供检索数据来源，通过 Dataview 我们可以列出、筛选、排序和分组数据，类似于我使用数据库查询语言。

**注意**：这里我们以属性或元数据来描述文档中由官方提供、第三方插件提供或者自定义的描述变量，前者为 Obsidian 官方的叫法，后者为 Dataview 中的叫法，两者实际上为同一个实体，不同的概念，后续文章以属性来描述。

本文基于 Davaview 0.5.56 版本撰写，如果发现文章与官方内容有所出入，请以官方最新文档为参考。

考虑到读者的 Obsidian 文档的数量和内容不一定能够支撑运行 Dataview 复杂的用例，所以文章中多数据用例均以当前文档数据为依据，尽量少去造数据。

文章中使用 `文档` 来表示 Obsidian 中的笔记，指代的是以 `.md` 为后缀的 Markdown 文档，而不是任意文档。

## 快速入门

直接在官方插件搜索名称即可安装，然后在选项中将【Enable JavaScript Queries】 和【Enable Inline JavaScript Queries】开启，并将选项【Date Format】 设置为 `yyyy-MM-dd`，【Date + Time Format】设置为 `yyyy-MM-dd HH:MM:ss`，这样子更符合我们的使用习惯。

接下来我们在 Obsidian 中新建一个文档然后添加一个标签属性，使用快捷键 `CMD/CTRL+;` 来触发属性编辑。

```yaml
---
tags:
  - 博客
  - Obsidian
---
```

然后我们使用 Dataview 查询语言（DQL）在当前文档中以列表的形式将标签属性读取出来：

````
```dataview
LIST tags
WHERE file = this.file
```
````

结果：

![[Pasted image 20240425121828.png]]

%3E 这里我们遵循官方的写法，将查询语法的关键词以大写方式表示。

然后, 我们再使用 Dataview JavaScript 查询方式来同样获取当前文档的标签：

````
```dataviewjs
dv.list(dv.pages("").file.tags.distinct())
```
````

结果：

![[企业微信截图_17140459602815.png]]

## YAML 简介

在介绍具体使用之前我们先来了解一下在 Obsidian 中描述属性的 **YAML** 语言。

YAML 其实更多时候是用于编写配置文件，其文件以 `.yml` 为后缀，它的语法简洁直观，比 JOSN 输入起来要快。如果熟悉 JSON 格式我们可以直接使用网站 [JSON to YAML Converter: Best Free Tool (jsonformatter.org)](https://jsonformatter.org/json-to-yaml) 将其转成 YAML 表示形式，看图就能直观掌握其写法。

![[Pasted image 20240425113911.png]]

关于 YAML 简单使用只需要记住：

- 用 `#` 表示注释。
- 用缩进表示层级关系，并且只能使用空格来缩进，同一层级在空格数量上需要保持一致。
- 变量是大小写敏感的。
- 数据使用 `变量名: 变量值` 的形式来表示数据。
- 使用 `|` 来保留数据的换行，每行的缩进和行尾空白都会被去掉，而额外的缩进会被保留。
- 使用 `>` 来表示折叠换行，只有空白行才识别为换行。
- 只使用 `true` 和 `false` 来表示布尔值。
- `null`、`Null` 和 `~` 以及不指定值默认都为空。

## 认识属性

Obsidian 官方为属性描述提供了 6 种数据类型：

- 文本（Text）：普通的文本以及文档链接（示例：`link: "[[Link]]"`）文本。
- 列表（List）：包含多个普通文本的数组。
- 数字（Number）：包含整数，小数及负数。
- 布尔值（Checkbox）：要么是 `true` 或者 `false`，空值默认为 `false`。
- 日期（Date）和时间（Time）：以格式 `YYYY-MM[-DDTHH:mm:ss.nnn+ZZ]` 的形式表示，比如：`2024-04-25`。

Dataview 在则在此基础上额外提供了 2 种数据类型持续时间（`Duration` ）和对象（`Object`）。

持续时间的语法为 `%3Ctime> <unit>`，例如：`6 hours` 或者 `4 minutes`，下面是更多的表达场景：

```
Example:: 7 hours
Example:: 16days
Example:: 4min
Example:: 6hr7min
Example:: 9 years, 8 months, 4 days, 16 hours, 2 minutes
Example:: 9 yrs 8 min
```

> 注意：这些时间值是可以在代码中进行运算的，后面实例部分会讲解。

对象就是在一个父字段下多个字段的映射，只能定义在 YAML 中，例如：

```
---
obj:
  key1: "Val"
  key2: 3
  key3: 
    - "List1"
    - "List2"
    - "List3"
---
```

Dataview 提供了一种内联字段，让我们可以在文档内容中任意位置定义数据，其语法为：`变量名:: 变量值`。

```
Basic Field:: Some random Value
**Bold Field**:: Nice!
带❤变量:: 我是表情+非拉丁字母
I would rate this a [rating:: 9]! It was [mood:: acceptable].
- [ ] Send an mail to David about the deadline [due:: 2022-04-05].
This will not show the (longKeyIDontNeedWhenReading:: key).

基础字段：`= this.basic-field`
加粗字段：`= this.bold-field`
在语句中：Rating: `= this.rating`, Mood: `= this.mood`
在任务列表中：`= this.due`
不显示变量名：`= this.longkeyidontneedwhenreading`
非常规变量：`= this.带❤变量`
```

结果：

![[Pasted image 20240425155428.png]]

注意如果内联字段独占一行可以不加 `[]`，如果在文本内部必须加上，此外可通过 `()` 来包裹内联字段可以在渲染时只显示值，不显示变量名。如果变量名使用空格来分隔的，在内部会被表示成小写字母+连字符的方式，驼峰命名会表示成全小写的（**实际运行发现并不能成功读取**）。

### 文档中的默认属性

Obsidian 中每个文档都有一系列默认的属性，最常见的就是 `tags`, `aliases` 和 `cssclasses`，分别表示页面的标签、别名和样式类名。此外，还有一些和发布相关的，暂时我们不关注，可自行查阅官方文档。

Dataview 为每个文档自动生成了一个 `file` 的属性，用于访问文件相关的信息。

| 文件属性               | 字段类型           | 属性说明                                                                             |
| :----------------- | :------------- | :------------------------------------------------------------------------------- |
| `file.name`        | Text           | 文件名                                                                              |
| `file.folder`      | Text           | 所在文件夹                                                                            |
| `file.path`        | Text           | 文件路径（包含文件名）                                                                      |
| `file.ext`         | Text           | 扩展名                                                                              |
| `file.link`        | Link           | 文件的链接地址                                                                          |
| `file.size`        | Number         | 文件大小 (bytes)                                                                     |
| `file.ctime`       | Date with Time | 创建时间                                                                             |
| `file.cday`        | Date           | 创建日期                                                                             |
| `file.mtime`       | Date with Time | 最后修改时间                                                                           |
| `file.mday`        | Date           | 最后修改日期                                                                           |
| `file.tags`        | List           | 文档中所有标签的数组。子标签按每个级别细分，因此 `#Tag/1/A` &nbsp;将存储在数组中，作为 `[#Tag, #Tag/1, #Tag/1/A]`。 |
| `file.etags`       | List           | 同上，但是只存储最终的 `[#Tag/1/A]`                                                         |
| `file.inlinks`     | List           | 反向链接                                                                             |
| `file.outlinks`    | List           | 正向链接                                                                             |
| `file.tasks`       | List           | 文中的任务列表                                                                          |
| `file.lists`       | List           | 文中的列表 (包含任务列表)                                                                   |
| `file.frontmatter` | List           | 文件中的 YAML 块内容                                                                    |
| `file.day`         | Date           | 如果文件名使用日期定义（格式为 `yyyy-mm-dd`&nbsp;或者 `yyymmdd`），则返回其日期值。                         |
| `file.starred`     | Boolean        | 是否使用核心插件 "Bookmarks"&nbsp;标记过。                                                   |

示例：

````
```dataview
TABLE file.name AS 文件名, file.ctime AS 创建时间, file.mtime AS 修改时间, file.tags AS 标签
WHERE file = this.file
```
````

结果：

![[Pasted image 20240425180855.png]]

### 任务相关属性

使用 `TASK` 查询类型，我们可以查询所有文档中的任务（又叫待办事项）。下面我们创建几个不同类型的任务，并使用内联属性指定创建日期（`created`），开始日期（`start`），计划日期 （`scheduled`），截止日期（`due`），取消日期（`cancelled`）和完成日期（` completion `）几个属性。

```
- [ ] 任务创建 [created:: 2024-04-25]
- [ ] 任务开始 [start:: 2024-04-26]
- [ ] 任务开始2 [start:: 2024-04-22]
- [x] 任务完成
	- [x] 子任务完成 1 
	- [ ] 子任务未完成 1
	- [x] 子任务完成 2 [completion:: 2024-04-28]
- [x] 任务全部完成
	- [x] 完成 1
	- [x] 完成 2
```

下面我们来查询任务开始日期为 `2024-04-22` 的任务：

````
```dataview
TASK
WHERE start = date("2024-04-22")
```
````

结果：

![[Pasted image 20240425191442.png]]

其它几个属性也可以使用类似的方法来判断，这里就不举例了，然后我们接下来使用 Dataview 提供的任务相关的属性 `completed` 和 `fullyCompleted` 来过滤任务，两者的区别请参考后续表格。

````
```dataview
TASK
WHERE completed
```
````

`completed` 过滤结果：

![[Pasted image 20240425192540.png]]


````
```dataview
TASK
WHERE fullyCompleted
```
````

`fullyCompleted` 过滤结果：

![[Pasted image 20240425193026.png]]

下面给出 Dataview 为列表和任务提供的内置属性，更多操作参考后面的综合实例部分。

| 字段名              | 数据类型    | 描述                                                                       |
| :--------------- | :------ | :----------------------------------------------------------------------- |
| `status`         | Text    | 返回完成状态文本（`[]`中的文本）`" "`&nbsp;表示未完成，`[x]`&nbsp;表示已完成，也支持自定状态来替代默认的。       |
| `checked`        | Boolean | 用于判断当前状态是否为空，也就是说 `[]`&nbsp;中有内容，但不一定是 `x`，也排除 `[ ]`                     |
| `completed`      | Boolean | 判断任务是否完成，不要求所有子任务都完成，如果使用非 `[x]`&nbsp;来标记完成，例如 `[-]` ，那么不会被包含在结果中。       |
| `fullyCompleted` | Boolean | 同上，但要求所有子任务完成才算完成。                                                       |
| `text`           | Text    | 任务的纯文本，包含属性和批注。                                                          |
| `visual`         | Text    | 由 Dataview&nbsp;渲染出的任务文本，可以使用 Dataviewjs&nbsp;来覆盖实现自定义渲染效果，同时保留验证逻辑的正确性。 |
| `line`           | Number  | 任务在文档中所在的行数。                                                             |
| `lineCount`      | Number  | 任务占据的行数，包含子任务的任务会占用多行。                                                   |
| `path`           | Text    | 任务所在的文档路径。                                                               |
| `section`        | Link    | 任务所在章节链接。                                                                |
| `tags`           | List    | 任务中包含的标签。                                                                |
| `outlinks`       | Link    | 任务中定义的任何链接。                                                              |
| `link`           | Link    | 指向任务最近可被链接的区域的链接，对于通过链接指向到当前任务十分有用。                                      |
| `children`       | List    | 当前任务的子任务列表。                                                              |
| `task`           | Boolean | 通过这个属性来判断当前项是否为任务。                                                       |
| `annotated`      | Boolean | 用于判断当前任务项是否包含属性。                                                         |
| `parent`         | Number  | 用于获取子任务的父任务所在行号，如果当前任务为根任务则为空值。                                          |
| `blockId`        | Text    | 如果使用 `^blockId`&nbsp;语法定义了块ID，则返回其对应的任务或者列表。                             |

### Tasks 插件提供的属性

[obsidian-tasks](https://github.com/obsidian-tasks-group/obsidian-tasks) 是综合管理任务的第三方插件，后续文章会专门探讨，现在我们只需要关注它提供的任务分类状态表情速记符（emoji-shorthands），让我们不用自己来使用内联属性定义任务状态，它直接开箱即用提供了以下几种速记语法：

| 属性名       | 速记语法       | 解释     |
|:------------ |:-------------- |:-------- |
| `due`        | `🗓️YYYY-MM-DD` | 截止日期 |
| `completion` | `✅YYYY-MM-DD` | 完成日期 |
| `created`    | `➕YYYY-MM-DD` | 创建日期 |
| `start`      | `🛫YYYY-MM-DD` | 开始日期 |
| `scheduled`  | `⏳YYYY-MM-DD` | 计划日期 |

除此之外，还有优先级等速记符，这里不再展开。

我们下载插件后，使用 【Ctrl/CMD + P】打开命令面板，然后输入命令 `Tasks: Create or edit`，会弹出一个对话框让你输入任务描述，优先级，是否循环等，下面是我创建的 3 个任务：

```
- [ ] 早上跑步 🔁 every day ➕ 2024-04-26 🛫 2024-04-27 📅 2024-04-27
- [x] 早上跑步 🔁 every day ➕ 2024-04-26 🛫 2024-04-26 📅 2024-04-26 ✅ 2024-04-26
- [ ] 看书 ➕ 2024-04-26
- [ ] 上班 ⏫ ➕ 2024-04-26 🛫 2024-04-26 📅 2024-04-26
```

现在我们来查询当前文档中 4 月 26 日完成的任务：

````
```dataview
TASK
WHERE completion = date("2024-04-26") AND file = this.file
```
````

结果：

![[企业微信截图_17141199186147.png]]

## 数据查询方式

上一章节我们了解了如何使用 YAML 和内联属性来定义属性，现在我们来看一下 Dataview 中如何查询这些属性。

### DQL 查询语言

Dataview 查询语言（Dataview Query Language 简称 **DQL**）类似于数据库查询语言，它支持 4 种查询类型（`TABLE` / `LIST` / `TASK` / `CALENDAR`）来生成不同的输出，例如对结果进行选择、优化和分组，得到你想要的结果。

要使用 DQL，只需要在文档中的代码块中将类型指定为 `dataview` 并加上查询代码即可：

````
```dataview
TABLE rating AS "Rating", summary AS "Summary" FROM #games
SORT rating DESC
```
````

### 内联 DQL 查询

这种方式使用内联块格式（而不是代码块）和可配置的前缀来将内联代码块标记为 DQL 块，语法如下：

```
`= <变量名>`
```

>注意：这里的 ` = ` 是可以在 DataView 选项中指定为其它符号的，例如：`dv:` 或者 `~`，但通常我们保持默认。

我们可以在文档中任意位置插入内联 DQL：

```
今天是：`= date(today)` 我还有 < `= [[打造极致体验笔记：Obsidian Meta Bind 插件使用]].file.name` > 计划要去写！
```

结果：

```
今天是：2024-04-26 我还有 <打造极致体验笔记：Obsidian Meta Bind 插件使用> 计划要去写！
```

> 注意：DataView 提供的各种函数我们同样也可以在内联 DQL 中使用，后续会介绍各种函数的使用。

### 使用 Dataview JS 查询

使用 DataView 提供的 JavaScript API 可以实现复杂的功能，结合 Obsidian 的 API 一起使用可以极大的发挥创造性。

在使用时只需要将代码块的类型设置为 `dataviewjs` 即可：

````
```dataviewjs
let currentFilename = dv.current().file.name
dv.list([currentFilename])
```
````

上面的示例直接将当前文档的文件名作为列表查询结果显示。

### 使用内联 Dataview JS 查询

内联 JavaScript 的写法如下，同样也可以通过选项来更改语法前缀为 `dvjs:` 或 `$~`。

```
`$= dv.current().file.name`
```

下面是一个显示当前任务进度的进度条代码：

```
[任务完成度:: `$= const value = Math.round(((dv.page("打造极致体验笔记：Obsidian Dataview 插件使用").file.tasks.where(t => t.completed).length) / (dv.page("打造极致体验笔记：Obsidian Dataview 插件使用").file.tasks).length || 0) * 100); "<progress value='" + value + "' max='100'></progress>" + " " + value + "%"`]
```

结果：

![[Pasted image 20240428193814.png]]

## DQL 查询语言详解

现在开始我们将深入了解 DQL 查询语言的一切，从小白到熟练工转变。

### 语法结构

DQL 查询语言的语法定义如下：

````
```dataview
TABLE or LIST or TASK or CALENDER [WITHOUT ID] <field> or <field AS alias>
FROM <source>
WHERE <clause>
SORT field1 [ASCENDING/DESCENDING/ASC/DESC], ..., fieldN [ASC/DESC]
GROUP BY <value> [AS <name>]
LIMIT <value>
FLATTEN <value> [AS <name>]
...
```
````

> **注意**：这个语法定义非官方提供，在文章中仅为了方便描述。除了查询类型和 `FROM` 语句位置固定外，其它语句统称数据命令（Data Command），可以多次使用，位置不固定。
#### 查询类型 `TABLE` / `LIST` / `TASK` / `CALENDAR`

 官方提供了 4 种类型：

- `TABLE`: 以表格方式显示结果。
- `LIST`: 以列表方式显示结果。
- `TASK`: 显示满足过滤条件的交互式任务（对过滤结果的操作状态会同步到原始文档中对应的任务）。
- `CALENDAR`：在日历中对应的日期中标记点。

#### 排除默认值 `WITHOUT ID`

`<WITHOUT ID>` 用于 `LIST` 类型中，表示在查询的结果中不显示文件名或者分组名。

![[Pasted image 20240426192402.png]]

`<WITHOUT ID>` 用于 `TABLE` 类型中，表示在查询的结果中不显示第一列文件名。

![[Pasted image 20240426193451.png]]

如果用于分组后的数据，则不显示分组名。

![[Pasted image 20240428175319.png]]

#### `FROM` 语句

`<FROM>` 语句表示查询来源，如果不指定则查询当前 Obsidian 仓库中的所有文档。

如果指定在当前文档中进行查询，可以将 `<FROM>` 来源指定为文档的路径：

````
```dataview
TABLE file.name, file.ctime
FROM "博客/Obsidian/打造极致体验笔记：Obsidian Dataview 插件使用"
```
````

上面我们从指定的**文档**获取数据源，当然也可以指定**目录**，例如：`FROM "博客/Obsidian"`，此外，也可以指定**标签**，再结合运算符来过滤数据源，例如：`FROM #博客 AND "Go"`，结果为博客中 Go 目录下的所有文件。

除了从标签、文档和目录中获取内容外，还可以从 Obsidian 的双向**链接**中获取数据源，这里我们简单的补充一下链接的知识。

在文档中插入的 URL 图片地址，网页 URL 地址，我们称之为**外部链接**。如果在 Obsidian 文档中想要引用其它文档，或者其文档中的标题，部分段落，我们需要创建**内部链接**。在 Obsidian 中我们通常将内部链接称作**双链**或者**双向链接**，然后在 Obsidian 环境中我们使用**链接**（Link）指代内部链接，如果有特殊情况会单独说明。

在文档中创建链接的语法为 `[[文档名称]]`，当我们输入前两个中括号后，Obsidian 界面中会弹出文档选择下拉列表，然后自动插入文档名称和补全后面的两个中括号。一个文档内部可能会引用多个外部文档的链接，同时文档也会被别的文档引用为链接，这样就行成了一个双向的链接。我们将当前文档引入的链接称之为**出链**（Outgoing links），如果有其它文档引用了当前文档，则将其它文档称之为**外链**（Backlinks）。

在引入其它文档内容时我们可以选择指向整个文档，也可以引用文档标题，进一步还可以引用某个段落（块），此外还可以对引用的内容指定别名。下面是 4 种链接引用方式举例，其中 `x` 用来指代任意符合链接规范的文本，在 Obsidian 中输入 `[[` 后全是可视化操作选择，例如在选择文档后，在文档后输入 `|` 会加载文档内容让你选择要引用的段落。

- 链接到文档(`[[x]]`)：` [[打造极致体验笔记：Obsidian Dataview 插件使用]] `
- 链接到文档中的标题(`[[x#x]]`)：` [[打造极致体验笔记：Obsidian Dataview 插件使用#` FROM `语句]] `
- 链接到文档中的段落(`[x#^x]`)：` [[打造极致体验笔记：Obsidian Dataview 插件使用#^065c03]] `
- 链接到文档中的段落并使用别名 (`[x#^x|x]`)：` [[打造极致体验笔记：Obsidian Dataview 插件使用#^065c03|这是别名，会替换原文档名]]`

然后我们来看一下如何查询外链和出链。通常在 `FROM [[x]]` 查询的结果为外链，如果要查询出链则需要调用 `outgoing()` 函数：

````
```dataview
LIST file.name
FROM outgoing([[打造极致体验笔记：Obsidian Dataview 插件使用]])
```
````

#### `WHERE` 语句

`WHERE` 语句用于过滤数据，这里我们再次实现在 `<FROM>` 语句中查询当前文档的操作。

````
```dataview
TABLE file.name, file.ctime
WHERE file = this.file
```
````

#### `SORT` 语句

`SORT` 语句用于对结果进行排序，排序方式有升序 (`ASC` | `ASCENDING`) 和降序（`DESC` | `DESCENDING`）二种方式，如果不指定则默认按升序排序。下面的查询结果以创建时间升序显示。

````
```dataview
TABLE file.name, file.ctime
SORT file.ctime ASC
```
````

#### `GROUP BY` 语句

`GROUP BY` 语句用于对查询的结果进行分组显示，需要注意的是它的用法，如果我们在上面 `SORT` 语句示例中添加按 `file.cday` 分组的话，除了加上 `GROUP BY file.cday` 外，还需要将 `file.name, file.ctime` 修改成 `rows.file.name, rows.file.ctime`，因为我们需要从分组后的结果中获取文档信息，这个匹配的结果存储在属性 `rows` 数组中。这里我们不需要自己来处理索引，如果你想要获取分组结果数组中第 3 项的结果，可以直接这样写 `rows[2].file.name`。

````
```dataview
TABLE WITHOUT ID rows.file.name, rows.file.ctime
SORT file.ctime ASC // 使用分组时，默认会对数据进行排序，这里可以不写。
GROUP BY file.cday
```
````

结果：

![[Pasted image 20240428114126.png]]

如果我们相要获取第 3 个分组中第 3 项数据，可以写成 `TABLE WITHOUT ID rows[2].file.name, rows[2].file.ctime`

![[Pasted image 20240428114318.png]]

#### `FLATTEN` 语句

`FLATTEN` 语句的作用是展开（扁平）数组，举个例子：`[1, [2, [3, 4], 5]]` 展开后：`[1, 2, 3, 4, 5]`，但是这里并不一定恰当，因为在 DataView 中我们区分查询类型，比如说多级嵌套的任务就比较贴合前面说的展开数组的情况。现在我们就利用前面章节[[打造极致体验笔记：Obsidian Dataview 插件使用#任务相关属性]] 中的任务数据来举例。

````
```dataview
TABLE WITHOUT ID T.text as "任务名称"
FLATTEN file.tasks as T
WHERE T.completed AND file = this.file
```
````

结果：

![[Pasted image 20240428122149.png]]

> [!note] `FLATTEN` 语句的所有使用都需要结合 `TABLE` 查询类型来输出结果，并且记住其后面一定是数组类型数据才有效。

现在再来演示另一种使用 `FLATTEN` 的场景，这刚好与 `GROUP BY` 语句结果相反。现在有一个目录 `books` 放置了很多书籍，每一个文档代表一本书，文档中设置 `genres` 属性来作为分类（`Children`, `Romance`, `Magic` 等等），当我们使用 `TABLE genres` 查询时，结果是每个分类占据表格的一行，而默认文档链接会根据分类数量自动合并行，现在想要相同行不合并显示，这时就需要使用 `FLATTEN genres` 来实现。

````
```dataview
TABLE genres
FROM "10 Example Data/books"
FLATTEN genres
```
````

>[!Tip] 数据来源于网络，在【参考】中有给出链接，请自行查阅。

结果：

![[Pasted image 20240428162948.png]]

接着上面书籍的案例，现在想要根据阅读页数（`pageRead`）和总页数（`totalPages`）来计算出阅读进度，并且过滤掉进度少于 50% 的书籍，这里我们可以使用 `FLATTEN` 来声明一个新的字段 `progress` 来实现：

````
```dataview
TABLE pagesRead, totalPages, percentage
FROM "10 Example Data/books"
FLATTEN round((pagesRead / totalPages) * 100) AS progress
WHERE progress > 50
FLATTEN progress + "%" AS percentage
```
````

结果：

![[Pasted image 20240428173453.png]]

#### `LIMIT` 语句

`LIMIT` 语句的作用很简单，就是限制结果的数量，例如将结果限制为最多 5 个值：`LIMIT 5`。

### 查询类型

因为上一章基体将 DataView 提供的查询类型介绍了一遍，这里就不再细说，只补充部分内容。

1. 对于 `LIST` 和 `TASK ` 类型如果不指定 ` FROM ` 或 ` WHERE ` 条件则获取整个 Obsidian 仓库中所有列表或任务。

2. `LIST` 后面提供额外的信息来自定义输出结果，例如：`LIST "File Path: " + file.folder + " _(created: " + file.cday + ")_"`。

3. 使用 `GROUP BY` 分组后，我们获取分组后的数据需要从 `rows` 属性中读取。

4. `WITHOUT ID` 只适用于 `LIST` 和 `TABLE` 类型。

### 表达式

在 DataView 中除了查询类型和数据命令外，其它数据统称表达式。

如果会 JavaScript 语言，那么对于数字（number）、布尔值（boolean）、字符串（string）、数组（array）和对象（object）不会感到陌生，在 DataView 中只是增加了日期（date）、持续时间（duration）和链接（link）三种类型，下面举例说明：

- `1`, `0.5`, `-5` ：数字
- `true`, `false`：布尔值
- `"Lorem ..."`：文本，JavaScript 中为字符串
- `date(2024-04-28)`：日期值
- `dur(1 day)`, `dur(3 minutes)`：持续时间
- `[[Link]]`, `[[Link#xx]]`, `[[Link#^xx]]` `[[Link#xx|xx]]`：链接
- `[1, 2, 3]`：列表，JavaScript 中为数组
- `{a: 1, b: 2, c: [1, 2, 3]}`：对象

在 JavaScript 中不提供函数名称的函数称之为**匿名函数**，比如在函数中返回一个函数：`function foo() {return function() {console.log("Hello Dataview")}}`，在使用数组过滤时我们通常这样写：`arr.filter(function(item) {return item.xx > 0})`，进一步我们可以简写为 `arr.filter(item => item.xx > 0)`，这里的写法称之为**箭头函数**，它与普通函数的区别就不作说明了，对应于 DataView 中称之为 **Lambdas 表达式**，作用是一样的。

在 DataView 中读取变量值或者属性值，调用函数语法和 JavaScript 中是一样的，例如通过对象名+属性名（`obj.prop`），对象名+计算属性（obj[`item_${index}`]），函数调用 （`f(a, b)`）。

对于数字最常见就是四则运算：加（`+`）、减（`-`）、乘（`*`）和除（`/`），然后再加一个除余（`%`）运算，比较运算则为大于（`>`），小于（`<`），等于（` = `，注意在 JavaScript 中是区分 `\==`  和 `\===` 的），不等于（`!= `），大于等于（` >= `）和小于等于（` <= `）。对于文本可使用加号（` + `）来拼接字符，使用 ` 文本 * 数字 ` 可重复文本指定次数，例如：`"a" * 5 ` 结果为：`"aaaaa"`。

最后对于链接的文件中的属性我们直接使用 `[[Link]].value` 读取即可。

#### 日期类型（Dates）

日期类型的值格式需要满足 Data ISO format 规则，我们通常以 `2024-04-29 11:11:23` 或者 `2024/04/29 11:11:23` 的格式来表示日期+时间，这更符合国人的习惯。

DataView 提供了一个 `date()` 函数来构造一个日期对象，这个函数有 2 种签名：`date(any)` 和 `date(text, format)`。

##### `date(any)` 使用

需要注意的是传入 ` date() ` 函数的日期是可以不加引号的，例如：` date(2024-04-29) `，对于有具体时间的日期我们不能以：` date(2024-04-29 11:20:20) ` 这种形式传入，正确的姿势是：` date(2024-04-29T11:20:20) `，这里的 ` T ` 为日期分隔符。DataView 为 ` date() ` 函数预定义了很多具有描述性质的常量参数，例如：` date(now) ` 表示当前日期和时间，具体如下：

- `today`：表示当前日期
- `now`：表示当前日期+时间
- `tomorrow`：表示明天的日期
- `yesterday`：表示昨天的日期
- `sow` / `eow`：表示当前周的开始日期和结束日期
- `som` / `eom`：表示当前月的开始日期和结束日期
- `soy` / `eoy`：表示当前年份的开始日期和结束日期

> 注：`so` 为 `start of` 的缩写, `eo` 为 `end of` 的缩写。

下面使用内联 DQL 查询来演示：

```
日期:: 2024-04-29
时间:: 2024/04/29 11:01:20
`= this.日期` %% 2024-04-29 %%
`= this.时间` %% 2024/04/29 11:01:20 %%
现在时间：`= date(now)` %% 现在时间：2024-04-29 13:04:05 %%
指定日期1：`= date(2024-04-29)` %% 2024-04-29 %%
指定日期2：`= date("2020-04-18")` %% 2024-04-18 %%
指定日期3：`= date([[2024-04-23]])` %% 2024-04-23 %%
指定时间4：`= date(2024-04-29T11:20:20)` %% 2024-04-29 11:04:20 %%
指定日期5：`= date([[Place|2021-04]])` %% 结果 %%
昨天：`= date(yesterday)`，明天：`= date(tomorrow)` %% 昨天：2024-04-28，明天：2024-04-30 %%
周开始与结束日期：`= date(sow)` / `= date(eow)` %% 周开始与结束日期：2024-04-29 / 2024-05-05 11:05:59 %%
月开始与结束日期：`= date(som)` / `= date(eom)` %% 2024-04-01 / 2024-04-30 11:04:59 %%
年开始与结束日期：`= date(soy)` / `= date(eoy)` %%0 2024-01-01 / 2024-12-31 11:12:59 %%
```

>注：`%% %%` 部分为 Obsidian 中的注释

上面的代码中我们始终以 `xxxx-xx-xx` 或 `xxxx-xx-xxTxx:xx:xx` 的格式传入 `date()` 函数中，这也是**唯一合法的格式**，其它例如：`date(2024/04/29)`, `date(Mon Apr 29 2024 14:45:46 GMT+0800 (中国标准时间))` 以及 `data(1714366864889)` 都是不合法的。如果相要使用这些格式作为输入就需要使用第二种形式了。此外，我们在前面【快速入门】中有提过修改 Obsidian 日期输出的默认格式，如果没有修改可能得到的结果日期为 `MMMM dd, yyyy` 格式，时间为 `h:mm a - MMMM dd, yyy` 格式。
##### `date(text, format)` 使用

`date()` 函数的这种使用方式设计是有点让人产生歧义，初看以为是一种类似日期 `format` 类似的作用，实则不是。它的第 1 个参数必须是文本，不可传入变量，然后第 2 个参数你以为可以使用任何满足 Luxon 时间库格式化的字符，那就理解错了，它真正的作用是为了解决上面我们说的除唯一合法格式以外的输入，请看下面的示例：

```
日期1：`= date("12/31/2022 12:12:12", "MM/dd/yyyy HH:mm:s")` %% 2022-12-31 12:12:12 %%
日期2：`= date("2023/10/12", "yyyy/MM/dd")` %% 2023/10/12 %%
日期3：`= date("210313", "yyMMdd")` %% 2021/03/13 %%
时间缀（毫秒）：`= date("1714366864889", "x")` %% 2024-04-29 01:04:04 %%
时间缀（秒）：`= date("1407287224", "X")` %% 2014-08-06 09:08:04 %%
```

前面说的中国标准时间，暂时作者也不知道怎么来写这个 Format，所以这种格式尽量别用。

>[Tips] 日期格式化有专门的函数 `dateformat(date|datetime, string)` 来处理，后面会讲解。

#### 持续时间类型（Durations）

要表示持续时间类型需要调用 `dur(any)` 函数传入描述字面量，可以描述年、月、日、时、分、秒和周，例如：`dur(1 h)` 根据当前的语言环境会解析成：`1小时`。

- `s` / `sec` / `secs` / `second` / `seconds`：表示 `x秒钟`。
- `m` / `min` / `mins` / `minute` / `minutes`：表示 `x分钟`。
- `h` / `hr` / `hrs` / `hour` / `hours`：表示 `x小时`。
- `d` / `day` / `days`：表示 `x天`。
- `w` / `wk` / `wks` / `week` / `weeks`：表示 `x周`。
- `mo` / `month` / `months`：表示 `x个月`。
- `yr` / `yrs` / `year` / `years`：表示 `x年`。

下面是一些基础示例：

```
年：`= dur(5 yr)` %% 5年 %%
月：`= dur(5 mo)` %% 5个月 %%
日：`= dur(5 d)` %% 5天 %%
小时：`= dur(5 h)` %% 5小时 %%
分钟：`= dur(5 m)` %% 5分钟 %%
秒数：`= dur(5 s)` %% 5秒钟 %%
周：`= dur(3 w)` %% 3周 %%
```

接下来看一下复杂的组合示例，我们会发现 Dataview 会自动推算出合适的表达：

```
100天：`= dur(100 d)` %% 3个月、2周、2天 %%
36个月：`= dur(36 mo)` %% 3年 %%
50周：`= dur(50 w)` %% 1年、2周 %%
160分钟：`= dur(160 m)` %% 2小时、40分钟 %%
1500秒：`= dur(1500 s)` %% 25分钟 %%
100分钟12秒：`= dur(100 m, 12 s)` %% 1小时、40分钟、12秒钟 %%
3年5个月12天：`= dur(3 yr, 5 mo, 12 d)` %% 3年、5个月、1周、5天 %%
```

除了单独使用外，更多的场景是结合 `date()` 函数一起使用：

```
过去5天：`= date(now) - dur(5 d)` %% 2024-04-24 17:04:02 %%
过去2周：`= date(now) - dur(2 w)` %% 2024-04-15 17:04:02 %%
明天：`= date(now) + dur(1 d)` %% 2024-04-30 17:04:02 %%
往后3年：`= date(now) + dur(3 yr)` %% 2027-04-29 17:04:02 %%
十秒前：`= date(now) - dur(10 m)` %% 2024-04-29 16:04:02 %%
```

## 内置函数

DataView 提供了大量的函数来提高处理文档的效率，这里的函数官方文档将其分为：构造函数、数值计算函数、对象，数组和字符串操作函数以及工具（辅助）函数。

#### 构造函数

构造函数用于构建对象的实例，这里的对象可以是普通 JavaScript 中的对象、字符串和数字，也可以是 DataView 中的列表、日期、持续时间和链接等。接下来我们通过实例来辅助理解每个函数，就不再一一列举讲解了。

对于函数 `date(any)`，`date(text, format)` 以及 `dur(any)` 我们在章节【表达式】中有详细介绍，请自行回顾。

下面我们举例来说明 `object(key1, value1, ...)`, `list(value1, value2, ...)`, `number(string)` 和 `string(any)` 的使用，需要注意的是通过内联 DQL 查询后显示结果，对象显示为：`key: key2: key3: value` 的形式，而列表不分是否嵌套统一显示成 `value, value, ...` 的形式。

```
普通对象：`= object("a", 123)` %% a: 123 %%
获取对象的值1：`= object("a", 123).a` %% 123 %%
获取对象的值2：`= extract(object("a", 123), "a")` %% a: 123 %%
嵌套对象：`= object("a", object("b", object("c", 123)))` %% a: b: c: 123 %%

普通列表：`= list(1, 2, 3)` %% 1, 2, 3 %%
嵌套列表：`= list(list(1, 2, 3), list(4, 5, 6))` %% 1, 2, 3, 4, 5, 6 %%
对象列表：`= list(object("a", 1), object("a", 2))` %% a: 1, a: 2 %%

普通数字：`= number(123)` %% 123 %%
负数：`= number(-123)` %% -123 %%
小数：`= number(1.34)` %% 1.34 %%
字符串中包含数字1：`= number("12hhh34")` %% 12 %%
字符串中包含数字2：`= number("hhh34wer123")` %% 34 %%
字符串中包含数字3：`= number("wer123")` %% 123 %%
非数字：`= number("nonnum")` %% - %%

普通字符串：`= string("hello world")` %% hello world %%
数字字符串：`= string(123)` %% 123 %%
日期：`= string(dur(3 h))` %% 3小时 %%
```

上面的示例我们使用内联 DQL 查询，对于一个普通的对象如何在 DQL 显示呢？这里我们需要借助 `FLATTEN` 语句来实现：

````
```dataview
TABLE WITHOUT ID T.name AS 姓名, T.age AS 年龄
FLATTEN object("name", "jenemy", "age", 33) AS T
WHERE file = this.file
```
````

结果：

![[Pasted image 20240429182623.png]]

如果是列表对象，写成 `FLATTEN list(object("name", "jenemy", "age", 33), object("name", "lulu", "age", 26)) AS T` 就可以了。

接下来我们来看一下通过 `link(path, [display])` 函数如何来创建链接，有些什么需要注意的点。

假如现在我们的文档目录树如下：

```
|- Obsidian
|  |- 笔记一.md
|  |- 笔记二.md
|  └─ Dataview
|    |- 笔记一.md
|    └─ 笔记二.md
|- 笔记一.md
|- 笔记二.md
└─ 笔记三.md
```

现在我们在 `Obsidian/Dataview/笔记一.md` 中使用 `linK("笔记二")` 引用笔记二。上面的目录我最后一次编辑停留在了最外层的笔记二文档中，当我们点击链接时直接跳到了最外层和笔记二文档。然后我们再次打开同级的笔记二编辑，发现还是跳转最外面的文档二。接下来我们在 Obsidian 这一级目录的笔记一中创建同样的链接，操作后发现还是跳到了最外层的文档二。然后我们最后一次重新创建目录和文档，最后一个创建的文档二不在最外层，再次操作后还是同样的效果，删除最外面的文档后才跳转到同级的文档二。总结一下：**`link()` 函数会从最外层寻找链接的文档，然后才是同级目录下的文档。**

经过上面的实验我们需要注意的是在指定链接时一定要加是路径，如果在文档内引用了多个同名的文档，最好使用别名来标识。下面是一些使用示例：

```
`= link("笔记二)"` %% 根目录下的笔记二 %%
`= link("/笔记二)"` %% 根目录下的笔记二 %%
`= link("./笔记二")` %% 同级目录笔记二 %%
`= link("Obsidian/笔记二")` %% Obsidian 目录下的笔记二 %%
`= link("./笔记二", "别名")` %% 使用别名 %%
```

然后我们再来看一下如何使用 `embed(link, [embed?])` 嵌入图片和 `elink(url, [display])` 创建外部链接。

```
`= embed(link("bg_1.jpg"))` %% 图片位于附件默认存放路径中 %%
`= elink("www.baidu.com")` %% 创建百度外部链接 %%
`= elink("www.google.com", "谷歌搜索")` %% 显示指定的别名，而非地址 %%
```

最后我们来看一下如何判断数据类型,，这里我们使用 `typeof(any)` 函数来判断：

```
`= typeof(12)` %% "number" %%
`= typeof("abc")` %% "string" %%
`= typeof(link("笔记二"))` %% "link" %%
`= typeof(list(1, 3, 4))` %% "array" %%
`= typeof([1, 3, 4])` %% "array" %%
`= typeof(object("a", 1))` %% "object" %%
`= typeof({ a: 1 })` %% "object" %%
`= typeof(date(now))` %% "date" %%
`= typeof(dur(1 d))` %% "duration" %% 
`= typeof(true)` %% "boolean" %%
```

#### 数值操作

对于数值的操作除了前面章节介绍过的四则运算和求余运算外，比较常见的还有求最大值（`max(a, b, ..)`）、最小值（`min(a, b, ..)`）、求和（`sum(array)`）、向上取整（`ceil(number)`）、向下取整（`floor(number)`）、四舍五入（`round(number, [digits])`）、平均值（`average(array)`）以及小数位截断（`trunc(number)`）等。

```
四舍五入：`= round(16.5555)` %% 17 %%
保留2位小数：`= round(16.5555, 2)` %% 16.56 %%
小数点截断：`= -12.937` %% -12.937 %%
向下取整：`= floor(12.937)` %% 12 %%
向上取整：`= ceil(12.937)` %% 13 %%
最小值：`= min(5, 2, 4, 8)` %% 2 %%
最大值：`= max(5, 2, 4, 8)` %% 8 %%
求和：`= sum([1, 2, 3, 5])` %% 11 %%
求平均值：`= average([1, 2, 4, 5])` %% 3 %%
数字数组乘积：`= product([1, 2, 3, 5])` %% 30 %%
累加：`= reduce([1, 3, 5], "+")` %% 9 %%
累除：`= reduce([200, 10, 5], "/")` %% 4 %%
字符重复：`= reduce(["a", 3], "*")` %% aaa %%
```

## 综合实例

```dataview
TABLE WITHOUT ID T.text as "任务名称"
FLATTEN file.tasks as T
WHERE T.completed AND file = this.file
```

## 参考

- [Dataview (blacksmithgu.github.io)](https://blacksmithgu.github.io/obsidian-dataview/)
- [Properties - Obsidian Help](https://help.obsidian.md/Editing+and+formatting/Properties)
- [Dataview Example Vault (s-blu.github.io)](https://s-blu.github.io/obsidian_dataview_example_vault/)
- [Obsidian 插件之 Dataview - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/373623264)
- [Obsidian DataView 入门保姆级引导手册 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/614881764)
- [一文看懂 YAML - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/145173920)
- [obsidian插件dataview官方文档翻译 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/393550306)
- [Dataview综合文档 | obsidian文档咖啡豆版](https://obsidian.vip/zh/dataview/)
- [Dataviewjs的奇技淫巧 - 经验分享 - Obsidian 中文论坛](https://forum-zh.obsidian.md/t/topic/5954)
- [Obsidian学习从0到1 —— 双链（重点）_obsidian 双链-CSDN博客](https://blog.csdn.net/weixin_51684355/article/details/126084867)
- [dmscode/Obsidian-Templates: 我在 Obsidian 中用的各种模板（Dataview，Templater，QuickAdd） (github.com)](https://github.com/dmscode/Obsidian-Templates)
- [702573N/Obsidian-Tasks-Timeline: A custom view build with Obsidian-Dataview to display tasks from Obsidian-Tasks and from your daily notes in a highly customisable timeline (github.com)](https://github.com/702573N/Obsidian-Tasks-Timeline)
- [Aetherinox/obsidian-dataview-snippets: A collection of Obsidian.md scripts which include Tag & Page Clouds, Table of Contents / ToC, Bad / Missing Link reporting, etc. (github.com)](https://github.com/Aetherinox/obsidian-dataview-snippets)
- [Formatting (moment.github.io)](https://moment.github.io/luxon/#/formatting)