---
tags:
  - Blog
  - Dataview
  - Obsidian
---

## 初级篇：Dataview 基础应用

初级篇主要涉及一些比较简单的查询操作，适用于初学者练手，主要聚焦在 DQL 查询上以及基础的 JavaScript API 查询操作。

### 内联查询

内联查询适合于不需要作过多逻辑判断的属性查询，不需要指定代码块，可以在页面正文中任意位置插入查询语句。下面是 DQL 和 JavaScript API 两种语法示例。

DQL 内联查询示例：

````
topic:: basic inline queries
description:: Showcase basic syntax of DQL and JS Inline Queries

创建时间：`= this.file.ctime` %% 2024-05-13 11:05:56 %%
修改时间：`= this.file.mtime` %% 2024-05-15 12:05:44 %%
标签：`= this.tags` %% Blog, Dataview, Obsidian %%
内联字段查询：`= this.topic` %% basic inline queries %%
文本截取：`= truncate(this.description, 20, "...")` %% Showcase basic synt… %%
条件判断：`= choice(contains(this, "topic"), "Set", "Missing!")` %% Set %%
获取带有特殊字符的链接访问失败：`= [[博客/Obsidian/Obsidian 达人成长之路 #1：使用终极工具 Dataview 释放笔记库的潜力 · DQL查询语言]].file.ctime` %% - %%
需要调整为：`= link("博客/Obsidian/Obsidian 达人成长之路 #1：使用终极工具 Dataview 释放笔记库的潜力 · DQL查询语言").file.ctime` %% 2024-05-06 11:05:12 %%
文章包含的链接数量：`= length(link("博客/Obsidian/Obsidian 达人成长之路 #1：使用终极工具 Dataview 释放笔记库的潜力 · DQL查询语言").file.outlinks)` %% 27 %%
除图片以外的链接数量：`= length(filter(link("博客/Obsidian/Obsidian 达人成长之路 #1：使用终极工具 Dataview 释放笔记库的潜力 · DQL查询语言").file.outlinks, (x) => !meta(x).embed))` %% 2 %%
现在时间：`= date(now)` %% 2024-05-15 16:05:24 %%
持续时间：`= dur(1mo2d)` %% 1个月、2天 %%
格式化时间：`= dateformat(date(now), "M'月'dd'号'")` %% 5月15号 %%
````

JavaScript API 示例：

````
创建时间：`$= dv.current().file.ctime` %% 2024-05-13 11:05:56 %%
修改时间：`$= dv.current().file.mtime` %% 2024-05-15 12:05:44 %%
标签：`$= dv.current().file.tags` %% Blog, Dataview, Obsidian %%
内联字段查询：`$= dv.current().topic` %% basic inline queries %%
文本截取：`$= dv.evaluate("truncate(this.description, 20, \"…\")").value` %% Showcase basic synt… %%
或者：`$= dv.tryEvaluate("truncate(this.description, 20, \"…\")")` %% Showcase basic synt… %%
条件判断：`$= dv.current().topic ? 'Set' : 'Missing!'` %% Set %%
获取文件创建时间：`$= dv.page("博客/Obsidian/Obsidian 达人成长之路 #1：使用终极工具 Dataview 释放笔记库的潜力 · DQL查询语言").file.ctime` %% - %%
文章包含的链接数量：`$= dv.page("博客/Obsidian/Obsidian 达人成长之路 #1：使用终极工具 Dataview 释放笔记库的潜力 · DQL查询语言").file.outlinks.length` %% 27 %%
除图片以外的链接数量：`$= dv.page("博客/Obsidian/Obsidian 达人成长之路 #1：使用终极工具 Dataview 释放笔记库的潜力 · DQL查询语言").file.outlinks.where(link => !link.embed).length` %% 2 %%
现在时间：`$= dv.date('now')` %% 2024-05-15 16:05:24 %%
持续时间：`$= dv.duration('1mo2d')` %% 1个月、2天 %%
格式化时间：`$= dv.date('now').toFormat("M'月'dd'号'")` %% 5月15号 %%
````

> [!Tip] 使用内联 API 查询出来的标签在结果显示上和内联 DQL 的结果略有不同，前者是可交互的结果，后者为纯文本。

> [!Warning] 在 API 中没有对应的 `truncate()` 函数使用，但是我们可以 `dv.evalute()` 或者 `dv.tryEvaluate()` 函数在 API 中执行 DQL 查询。

> [!Warning] 在文件名不要包含 `#` 符号，在使用链接时会被错误的识别为标签或者页面标题。

### 数据分组

数组分组适用于数据具有一对多或多对多的关系，例如一个作者对应多本书籍，那么我们在查询数据时就可以按作者去分组。

在使用 DQL 查询语言 `GROUP BY` 时，需要明确一点的是，我们经过分组后的数据是保存在固定变量 `rows` 中的，这是一组数据，而非单一数据。例如在 `TABLE` 中没有分组时取文件链接是通过 ` file.link ` 来获取，经过分组后就需要使用 `rows.file.link ` 来取值了。需要注意的是 `rows` 是一个数组，我们可以使用 `rows[0]` 来获取分组数据的第一项，但是我们通常不会这样做。

#### 示例一：书籍按作者分组

````
%% 属性样例 %%
---
author: Conrad C
---

%% 查询 %%
```dataview
TABLE rows.file.link AS 书籍
FROM "10 Example Data/books"
GROUP BY author AS 作者
```
````

結果：

![[Pasted image 20240516114029.png]]

#### 示例二：书籍按类型分组

````
%% 属性样例 %%
---
genres:
- Romance
- Children
- Magic
---

%% 查询 %%
```dataview
TABLE rows.file.link AS 书籍
FROM "10 Example Data/books"
FLATTEN genres
GROUP BY genres AS 类别
```
````

结果：

![[Pasted image 20240516114930.png]]

>[!Tip] 这里需要注意的是 `FLATTEN` 语句很关键，如果不使用将会得到一个错误的结果。原因是在原始数据中每一本书可以对应多个类别，而在按类别查询分组后，结果变成多个类别对应一本书。因此我们需要把每个类别对应上同一本书来修正数据，这样再使用分组时就符合预期了。

下面是一个转换过程示例图解：

![[Pasted image 20240516115704.png]]

#### 示例三：根据计算结果分组

这里对任务的 `due` 进行分组，如果在 `2022-05-12` 前没有完成就视为过期。

````
%% 属性样例 %%
---
class: history
received: 2022-03-20
due: 2022-05-05
---

%% 查询 %%
```dataview
LIST rows.file.link
FROM "10 Example Data/assignments"
GROUP BY choice(due < date("2022-05-12"), "已过期", "还有机会")
```
````

结果：

![[Pasted image 20240516121939.png]]

#### 示例四：分组后的元数据

在分组章节提到了分组后的数据属性 `rows`，实际上使用 `GROUP BY` 语句后返回的是一个对象，类似于：

```ts
{
	key: groupName;
	rows: ArrayOfDataColumns
}
```

在使用时通常不会直接去显示获取 `key` 值，默认情况下 Dataview 会直接读取了这个字段的值作为分组名。

如【示例三】所示，可以使用 `choice()` 函数来执行条件判断，返回 2 个状态描述，如果我们将 `LIST rows.file.link` 改成 `LIST`，那么读取的就是 `key` 值，这个 `key` 值就是 `choice()` 函数执行后返回的两个状态描述文本。

在 `GROUP BY` 语句后面我们可以使用 `AS` 语句定义一个别名，例如：`statusText`，我们再次将列表查询语句修改成 `LIST statusText`，观察结果会发现会显示成类似 `- 还有机会: 还有机会`，这样的结果。这个时候 `statusText` 和 `key` 其实是同一个实体，如果只想显示一个分组名，或者不显示，可以使用 `LIST WITHOUT ID` 来达到目的。

进一步我们还可以在 `LIST` 语句中拼接文本（包含有效果 HTML 标签），比如给结果加上 `<kbd>` 标签：`LIST WITHOUT ID "<kbd>" + statusText + "</kbd>"`，有一点需要谨记的是不能在里面使用模板字符串。

有了上面提到的技巧，对于【示例三】的结果可以进一步改成 `LIST join(rows.file.link, " | ")` 来减少空间占用。

对于 `GROUP BY` 语句我们还可以不提供分组属性，而是提供一个文本，然后只针对 `rows` 进行处理，比如获取其长度 `length(rows)`，这实际上是将所有查询的数组归为一个组了。

````
```dataview
LIST length(rows)
FROM "10 Example Data/assignments"
GROUP BY "什么也不做"
```
````

结果：

![[Pasted image 20240516180032.png]]

现在我们来把【示例三】根据上面提及的一些知识点进行一次改造：

1. 在链接后显示 `due` 的具体日期值
2. 对结果进行合并，显示在一个列表中

````
```dataview
LIST join(map(rows.file, (f) => f.link + " " + f.frontmatter.due), ", ")
FROM "10 Example Data/assignments"
FLATTEN file.frontmatter.due AS path
GROUP BY choice(due < date("2022-05-12"), "已过期", "还有机会")
```
````

结果：

![[Pasted image 20240516182930.png]]

进一步我们可以使用 `FLATTEN` 语句改造实现同样的效果，可以不用 `map()` 函数，直接将需要格式化显示的结果作为 `rows` 分组后的数据的一个属性。

````
```dataview
LIST join(rows.desc, ", ")
FROM "10 Example Data/assignments"
FLATTEN file.link + " " + file.frontmatter.due AS desc
GROUP BY choice(due < date("2022-05-12"), "已过期", "还有机会")
```
````

### `FLATTEN` 语句

`FLATTEN` 语句是 `GROUP UP` 的相反操作，但事实上它的作用不止这一点，它扮演了一个很重要的角色：声明新变量。

在介绍数据分组时有提及过 `FLATTEN` 语句的作用，现在我们再次以书籍数据为例子，将书籍的分类和话题查询出来：

````
```dataview
TABLE genres, booktopics
FROM "10 Example Data/books"
```
````

结果：

![[Pasted image 20240517160559.png]]

因为分类和话题其实是多对多的关系，因此我们可以使用 2 个 `FLATTEN` 语句对其展开成 1 维的数据列。

````
```dataview
TABLE genres, booktopics
FROM "10 Example Data/books"
FLATTEN genres
FLATTEN booktopics
LIMIT 4
```
````

结果：

![[Pasted image 20240517161616.png]]

##### 声明新属性

使用 `FLATTEN` 语句可以将数组展开成一维数组，但对于一个不能进行展开操作的数据类型如：数字、字符串、布尔值以及对象会原样输出。利用这一特点再结合 `AS` 语句可以声明属性并将 `FLATTEN` 后面的值赋值给指定的别名。

下面我们通过 `FLATTEN` 语句分别声明了一个字符串 `arr`，一个数字 `num` 和一个对象 `obj`，对象中包含一个数组 `[1, 2, 3]`，看一下结果如何：

````
```dataview
TABLE WITHOUT ID num, str, obj
FLATTEN 123 AS num
FLATTEN "hello" AS str
FLATTEN {"数字": num, "字符串": str, "数组": [1,2,3]} AS obj
WHERE file = this.file
```
````

结果：

![[Pasted image 20240517170018.png]]

现在我们再进行一点小改变，将数组 `[1, 2, 3]` 单独提取出来使用 `FLATTEN` 语句声明一个新的属性 `arr`，即：`FLATTEN [1, 2, 3] AS arr`，然后再将 `obj` 修改成：`FLATTEN {"数字": num, "字符串": str, "数组": arr} AS obj`，结果如下：

![[Pasted image 20240517170551.png]]

可以看到我们得到了一个完全不同的结果，这说明在使用 `FLATTEN` 语句声明数组时会影响结果的维数，我们可以大胆的猜测，假如使用 `FLATTEN` 语句声明 3 个 2 维数组，那么结果将产生 8 种结果：

![[Pasted image 20240517172832.png]]

#### 处理嵌套

**数据嵌套** 通常指的是在数据结构或数据模型中，一个数据元素内部包含另一个或多个相同或不同类型的数据元素。这种结构使得数据能够以层次化或树状的方式组织起来，从而更好地表示复杂的数据关系。

##### 对象嵌套对象

这种情况下，不需要额外的处理，使用和不适用 `FLATTEN` 语句效果是一样的。

````
%% 属性样例 %%
---
obj:
  obj1:
    obj2:
      prop1: 1
      prop2: 2
---

%% 查询 %%
```dataview
TABLE WITHOUT ID obj
WHERE file = this.file
FLATTEN obj
```
````

结果：

![[Pasted image 20240517152437.png]]

有了上面的知识，下面我们来分析一个查询书籍中阅读进度不足 50% 的案例：

````
```dataview
TABLE pagesRead, totalPages, percentage
FROM "10 Example Data/books"
FLATTEN round((pagesRead / totalPages) * 100) AS progress
WHERE progress < 50
FLATTEN progress + "%" AS percentage
```
````

结果：

![[Pasted image 20240517173908.png]]

分析：

1. 第一个 `FLATTEN` 语句用于计算阅读进度百分比。
2. `WHERE` 语句用于对进度进行条件限定。
3. 最后一个 `FLATTEN` 语句对结果进行美化。

##### 对象和数组嵌套

这种情况下，数组项为对象或者普通类型（字符串，数字和布尔值），在对象中属性也可能为数组，相互嵌套多次。

下面是一个数组中包含了 2 个对象和一个字符，对象的属性值为数组。可以看到使用 `FLATTEN` 语句后对象依然保持不变。

````
%% 属性样例 %%
---
arr2:
  - a1:
    - a2
    - a3
  - b1:
    - b2
    - b3
  - c1
---

%% 查询 %%
```dataview
TABLE WITHOUT ID arr2
WHERE file = this.file
FLATTEN arr2
```
````

结果：

![[Pasted image 20240517153559.png]]

##### 多维数组

这种情况下，数组内部嵌套数组，可能为 2 维（示例：`[[1,2], [3, 4]]`），3 维（示例：`[[[1,2,3], [4,5, 6], [7, 8, 9]]]`）甚至多维，但是 ` FLATTEN ` 语句只能处理 2 维数组，如果是多维的数据，需要结合 `flat(array, [depth])` 函数，通过指定 `depth` 来根据实际情况指定要处理的层级。


````
%% 属性样例 %%
---
arr3:
  -
    - a1
    - b1
  -
    - c1
    -
      - e1
      -
        - f1
---

%% 查询 %%
```dataview
TABLE WITHOUT ID flat(arr3, 2)
WHERE file = this.file
FLATTEN arr3
````

结果：

![[Pasted image 20240517154843.png]]

>[!Tip] 还有一种方法来实现多维数组展开，修改上面的示例，连续使用 4 次 `FLATTEN arr3`，得到一个展开的结果。这个结果并不能推断出原始数组是由几维展开的，在显示上也没有出现列表符号，读者可以根据需求灵活选用。

![[Pasted image 20240517164859.png]]




- `FLATTEN` 语句
- 数据分组
- 数据排序
- 定制 DQL 查询输出
- 在表格中显示图片
- 属性查询

## 中级篇：Dataview 进阶应用

- 进度条
- 标签云
- 计算周期
- 根据条件显示/隐藏结果
- 文字搜索
- 根据双链查询
- 日期和时间操作

## 高级篇：Dataview 高级技巧与探索

- 和 chart.js 结合
- 日历渲染

## 总结

## 参考
