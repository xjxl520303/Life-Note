---
tags:
  - Blog
  - Templater
  - obsidian
---
知识管理社区 PKMer 将 Templater 称之为 Obsidian 四大金刚（Excalidraw/Dataview/Templater/QuickAdd）之一，可见其在 Obsidian 社区插件中的地位举足轻重。我们在系列文章前 3 篇介绍了 Dataview 插件的所有知识点，这篇文章我们来带领读者全面了解 Templater 的用法，掌握这个插件后将极大地减少重复工作量，提高笔记效率。

Templater 就是一个应用于 Obsidian 中的模板语法插件，它使用户可以预制模板文件然后在其中插入各种变量和函数，然后在我们创建新文档时将模板应用到当前文档中。它支持执行 JavaScript 脚本代码来操作这些变量和函数，因此有很大的想象和发挥空间，根据不同的需求来创建不同的模板文件，把一切都安排妥妥贴贴，拿捏恰到好处。

本文力争让读者一次性搞懂，学会 Templater 的使用，少走弯路，节约时间。

其实在 Obsidian 的核心插件中也有一个叫 **Templates** 的官方标配插件，只不过因其功能太过简单，所以很少有人用到，不过我们在这里也给大家介绍一下。

>[!Warning] 为了更好的理解，文章中有大量的 GIF 动画图片，建议在电脑上阅读以获得更好的体验。

## 官方 Templates 核心插件

官方提供的模板功能非常的少，只有插入文档标题、日期和时间的功能。要使用官方模板，我们需要在【选项】->【核心插件】->【模板】面板中指定【模板文件夹位置】指定提前创建好的用于放置模板文件的目录（通常为 `Templates` 或 `模板`）。

创建一个空白的仓库，我们创建好放置模板的目录，然后在目录下创建一个名为 `日记.md` 的文件，填充以下内容：

````
---
title: {{title}}
created_at: {{date}}
created_time: {{time}}
---

## 标题：{{title}}

创建日期和时间：{{date}} {{time}}
````

然后我们新建 3 个新文件，来看一下如何插入模板。

### 通过 Ribbon 按钮插入模板

如果未改变工作区的功能按钮的布局，那么默认情况下左边 Ribbon 区域第 5 个图标为插入模板的按钮，我们点击就可以触发弹出框来选择我们提前准备好的模板。

![[动画2 1.gif]]

从 GIF 动画中可以看到在 YAML 属性区域和文档正文区域都成功插入了我们模板指定的信息。

### 使用命令面板调用命令插入模板

在 Obsidian 中提供了命令（Command）可以执行一些操作，我们这里的模板也用 3 个相关的命令：

1. **模板**：插入模板。
2. **模板**：插入当前日期。
3. **模板**：插入当前时间。

插入命令的方式也有 3 种：

1. 通过 Ribbon 中的【打开命令面板】按钮（Ribbon 区域第 6 个图标）。
2. 使用快捷键 <kbd>Ctrl + P</kbd>(MacOS 为 <kbd>Cmd + P</kbd>)。
3. 启用斜杠命令（【选项】->【核心插件】->【斜杠命令】开启即可）。

>[!Tip] 建议大家使用【选项】->【命令面板】中的【置顶命令】功能，将常用的命令置顶，这样子我们打开命令面板时就可以直接 <kbd>Enter</kbd> 执行就可以了。

作者在这里提前将【插入模板】命令置顶，以方便截取操作过程。

![[动画2 2.gif]]

>[!Note] 截图动画中显示的快捷键为 <kbd>Ctrl+P</kbd>，看到 <kbd>CapsLock</kbd> 是因为我改了 Windows 系统的修饰键，将其指定为了 <kbd>Ctrl</kbd>。

因为官方这个模板的功能实在是很简单，没有什么可说的，只需要注意如何使用 `:` 符号来格式化日期和时间就好了。日期和时间默认格式为：`{{date:YYYY-MM-DD}} {{time: HH:mm}}`，更多格式符号，请参考：[Moment.js | Docs (momentjs.com)](https://momentjs.com/docs/#/displaying/format/)。

## 快速入门

关于 Templater 插件的安装我就省略了，对本文感兴趣的读者想必插件这种安装以及科学上网都不用操心。关于插件选项设置我们这里暂时只关注【Template folder location】，将目录指定为前面我们但要 Obsidian 官方模板中同样的目录。

有了前面官方模板使用方法的介绍，相信大家现在再来入手 Templater 就容易多了，废话不多说，我们将上面的模板修改成 Templater 支持的语法：

````
---
title: <% tp.file.title %>
created_at: <% tp.date.now("YYYY-MM-DD") %>
created_time: <% tp.date.now("HH:mm") %>
---

## 标题：<% tp.file.title %>

创建日期和时间：<% tp.date.now("YYYY-MM-DD HH:mm") %>

````

>[!Tip] 推荐大家在【选项】->【文件与链接】设置中将【新建笔记的存放位置】设置为**当前文件所在的文件夹**，这样子我们在创建新的笔记时不需要再去移动文件位置。同时，在快捷键中为【切换实时阅览/源码模式】指定一个快捷键 <kbd>Ctrl+\\</kbd>，为 【插入代码块】指定 <kbd>Alt+C</kbd>。最后记住默认 <kbd>Ctrl+E</kbd> 为源码模式与阅读模式的默认快捷键。

我们在安装了 Templater 插件后，会在 Ribbon 区域多一个专属图标，点击后可以直达模板选择面板。

现在删除之前创建的未命名文件，然后新建一个新的，我们来看一下插入 Templater 模板的效果：

![[动画2 3.gif]]

>[!Tip] 在安装了这个插件后，我们在 Obsidian 文档中输入模板标签时，会自动提示所支持的 API 并带有描述文字。

![[动画2 8.gif]]

## 使用命令执行模板插入

在介绍官方模板插件进我们讲过它提供了 3 个命令，同样在 Templater 中也提供了几个命令来快速操作：

- **Template**: Open Insert Template modal <kbd>Alt + E</kbd>
- **Template**: Jump to next cursor <kbd>Alt + Tab</kbd>
- **Template**: Create new note from template <kbd>Alt + N</kbd>
- **Template**: Replace templates in the active file <kbd>Alt + R</kbd>

可以看到总共有 4 个命令，并且每个任务都配备了操作快捷键。为了方便大家理解，我会给出每一个命令的操作流程过程。

### 命令：插入模板

这个命令和点击 Ribbon 中的 Templater 图标功能是一样的，同时直达 Obsidian 中【插入命令】选择【插入模板】后的面板。

![[动画2 4.gif]]

### 命令：光标跳转

这个功能很实用，让我们可以自定义模板在被插入后光标所在的位置，也可以放置多个光标埋点，按一定的顺序使用快捷键来依次跳转到定位处。

在使用这个功能时我们需要将 Templater 的【Automatic jump to cursor】 保持为打开状态。然后在模板中使用 `<% tp.file.cursor() %>` 来插入光标，要实现通过快捷键在多个光标位置跳转我们需要创建多个光标，顺序只需要将 `tp.file.cursor()` 函数中传入 `1, 2, 3, ...` 就可以了。

>[!Tip] 默认光标跳转快捷键为 <kbd>Alt + Tab</kbd>，这个在 Windows 系统中和系统快捷键冲突了，我们只能将其修改成别的，我这里是 <kbd>Alt + ;</kbd>。

我们新建一个模板来测试光标跳转：

````
这个功能很实用，让我们<% tp.file.cursor() %>可以自定义模板在被插入后光标所在的位置，也可以<% tp.file.cursor(2) %>放置多个光标埋点，按一定的顺序使用快捷键来依次跳转到<% tp.file.cursor(3) %>定位处。
````

现在我们见证奇迹：

![[动画2 5.gif]]

>[!Tip] 使用这个功能我们需要注意一点：新建文档默认情况下是会选中文档名，此时如果不将光标手动点击到正文内，插入的光标是无法定位到第一个光标位置的，后续我们可以成功执行跳转。

### 命令：从模板创建文件

这个命令的作用是在创建文件时直接基于选中的模板，而不需要像前面那样先创建文件再应用命令。

![[动画2 6.gif]]

从截图动画中可以看出，文件是创建在了目录“博客”中，如果我们笔记当前没有打开的文件，则会创建在根目录下。

### 命令：当前文件中执行模板替换

我们创建基于模板的页面不一定都是从指定的模板目录中获取模板，也可以是从别处复制过来，或者说我们想借用 Templater 强大的模板解析功能来实现单个页面注入动态内容，这个时候就是该命令发挥作用的时候了。

我们将其中一个模板文件内容拷贝一份放置在新建的一个文件中，然后我们使用快捷键来看一下执行过程：

![[动画2 7.gif]]

可以看到当前页面中的模板内容全部被替换成了执行结果。

## 内置函数详解

Templater 提供了很多内置的函数，这些函数封装了 Obsidian 内部的一些逻辑，我们只需要调用它们就可以获取仓库中所有笔记的任何信息。通过前面几篇文章的介绍和不断地熏陶，其实细想一下，和我们打交道的无外乎就是：文件信息（文件名、路径、创建时间 ...）、文档属性、链接、任务、查询等，有了经验积累，下面的内容就相对来说很容易消化吸收。

### 文件相关属性和函数

`tp.file` 模块中定义了文件操作的相关函数，我们通过它可以创建笔记/重命名/移动笔记，获取笔记信息，获取标签信息、文档选区信息等操作。

下面我们会每一个函数进行使用讲解，有的函数过于简单就一笔代过不作过多解释。

#### tp.file.content

这个属性的作用是在 Templater 执行时将当前文档内容插入到 `tp.file.content` 所在位置。

![[动画2 10.gif]]

#### tp.file.create_new()

这个函数的作用是基于模板或内容创建新的文档，其方法签名为：

```ts
tp.file.create_new(template: TFile | string, filename?: string, open_new: boolean = false, folder?: TFolder | string)
```

参数：

- `template` 模板文件或者文本内容，指定模板需要使用 `tp.file.find_tfile(name)` 来获取指定的模板。
- `filename` 新建的文件名，不设置则默认为 "Untitled"（中文："未命名"）。
- `open_new` 如果为 `true` 将会直接打开创建的文件。
- `folder` 指定新文件所在的目录。

>[!Tip] 官方文档上有说 `open_new` 这个参数有副作用，目前作者还未遇到，暂时给不出例子。

##### 示例 1：基于文本创建文档

````
<%* await tp.file.create_new("MyFileContent", "MyFilename") %>
````

结果：

![[动画2 11.gif]]

##### 示例 2：基于模板创建文档

这里需要使用 `tp.file.find_tfile()` 方法来获取我们事先创建好的模板。

````
<%* await tp.file.create_new(tp.file.find_tfile("日记2"), "MyFilename") %>
````

结果：

![[动画2 12.gif]]

##### 示例 3：创建文档后立即打开

````
<%* await tp.file.create_new("MyFileContent", "MyFilename", true) %>
````

结果：

![[动画2 13.gif]]

##### 示例 4：指定创建目录

函数的第 4 个参数 `folder` 用于指定创建文件的目录，默认情况下为【选项】->【文件与链接】中【新建笔记的存放位置】所指定的选项来决定，当前示例是选择的*当前文件所在的文件夹*。如果你的设置和我的不一样，可以使用 `tp.file.foler(true)` 来获取当前要执行模板文件的目录，也可以直接使用目录名路径字符串来指定。

下面是几种设置目录的方式：

- `tp.file.folder(true)`
- `"博客"`
- `app.vault.getAbstractFileByPath("博客")`

示例：

````
<%* await tp.file.create_new("MyFileContent", "MyFilename", true, "博客") %>
````

结果：

![[动画2 14.gif]]

#### tp.file.creation_date()

`tp.file.creation_date(format: string = "YYYY-MM-DD HH:mm")` 函数用于获取文件的创建日期和时间信息。

#### tp.file.cursor()

`tp.file.cursor(order?: number)` 函数的作用是在插入模板后，将光标设置到此位置。可以设置多个光标位置并指定好顺序，然后使用快捷键来移动光标。

关于光标的插入与使用，我们在前面有实例讲解过，这里就不再重复了。

````
// File cursor
<% tp.file.cursor() %>
// File multi-cursor
<% tp.file.cursor(1) %>Content<% tp.file.cursor(1) %>
````

#### tp.file.cursor_append()

`tp.file.cursor_append(content: string)` 函数的作用是在文件中的活动光标后追加一些内容。经过作者的实验，放置 `tp.file.cursor_append()` 的模板不能有其它内容，举个例子，如下面的内容：

````
需要 <% tp.file.cursor_append("你好，读者朋友！") %>  无可奈何花落去
````

当我们将其应用在一个新建的文档中时会得到：

````
你好，读者朋友！需要   无可奈何花落去
````

如果前后没有内容的操作如下：

![[动画2 15.gif]]

#### tp.file.exists()

`tp.file.exists(filepath: string)` 用于判断文件是否存在。

#### tp.file.find_tfile()

`tp.file.find_tfile(filename: string)` 函数用于搜索文件并返回一个 `TFile` 实例。

`TFile` 实例截图如下：

![[Pasted image 20240604181700.png]]

#### tp.file.folder()

`tp.file.folder(relative: boolean = false)` 函数用于检索文件的文件夹名称。如果 `relative` 为 `true` 会返回文档所在目录路径，为 `false` 只返回目录名。默认为 `false`。

以 `博客/Obsidian/Untitled.md` 为例：

![[动画2 16.gif]]

#### tp.file.include()

`tp.file.include(include_link: string | TFile)` 函数用于包含文件的链接内容，将解析包含的内容中的模板。

这里的参数 `include_link` 可以是链接也可以是 `TFile` 文件。关于链接的相关知识点我就不多说了，不清楚的请仔细阅读系列文章第一篇。

下面我们准备内容：

````
## Introduction

Templater is a template language that lets you insert variables and functions results into your notes. It will also let you execute JavaScript code manipulating those variables and functions.

With Templater, you will be able to create powerful templates to automate manual tasks.

## Quick Example

The following template file, that is using Templater syntax:

```
---
creation date: <% tp.file.creation_date() %>
modification date: <% tp.file.last_modified_date("dddd Do MMMM YYYY HH:mm:ss") %>
---

<< [[<% tp.date.now("YYYY-MM-DD", -1) %>]] | [[<% tp.date.now("YYYY-MM-DD", 1) %>]] >>

# <% tp.file.title %>

<% tp.web.daily_quote() %>
```
````

接下来引入模板：

````
<% tp.file.include(tp.file.find_tfile("Welcome")) %>
<% tp.file.include("[[Templater 好牛#Introduction]]") %>
<% tp.file.include("[[Templater 好牛#^0448f4]]") %>
````

结果：

![[动画2 17.gif]]

#### tp.file.last_modified_date()

`tp.file.last_modified_date(format: string = "YYYY-MM-DD HH:mm")` 函数返回文件最后一次修改日期信息。

#### tp.file.move()

`tp.file.move(new_path: string, file_to_move?: TFile)` 函数用于将文件移动到所需的库位置。

其中 `file_to_move` 为可选参数，默认为当前文件。

注意：新路径需要包含文件夹和文件名。

下面我们使用下面的模板来将当前文件移动到根目录，同时也将根目录的 `Welcome.md` 文件移动当前目录中。

````
<% tp.file.move("foo") %>
<% tp.file.move(tp.file.folder(true) + "/Welcome", tp.file.find_tfile("Welcome")) %>
````

结果：

![[动画2 18.gif]]

#### tp.file.path()

`tp.file.path(relative: boolean = false)` 函数用于获取文件基于当前磁盘的绝对路径，如果 `relative` 设置为 `true` 则返回基于当前仓库的相对路径。

![[动画2 19.gif]]

从图中可以看出系统路径和我们当前在仓库中的路径分隔符不致，我们这里仅示例不去额外处理。

#### tp.file.rename()

`tp.file.rename(new_title: string)` 函数用于重命名文件。

![[动画2 20.gif]]

#### tp.file.selection()

`tp.file.selection()` 函数用于检索活动文件的文本选择。

![[动画2 21.gif]]

>[!Tip] 我们不能跨文件去操作，因为选中另外一个文件时上一个文件的选区就失去焦点了。

#### tp.file.tags

`tp.file.tags` 属性用于获取当前文件的所有标签。

![[动画2 22.gif]]

#### tp.file.title

`tp.file.title` 属性用于获取页面标题。

### 获取 YAML 中的属性

`tp.frontmatter` 模块用于获取 YAML 中定义的属性。

语法为：`tp.frontmatter.<frontmatter_variable_name>`。

````
---
alias: myfile
note type: seedling
categories:
  - book
  - movie
---

file content
````

可通过下面的模板来获取内容：

````
File's metadata alias: <% tp.frontmatter.alias %>
Note's type: <% tp.frontmatter["note type"] %>
<% tp.frontmatter.categories.map(prop => `  - "${prop}"`).join("\n") %>
````

结果：

![[动画2 24.gif]]

### 日期和时间操作

`fn.date` 模块包含了时期和时间的相关操作。

可结合的插件：

- Day Planner
- Kanban

## 参考

- [Templates - Obsidian Help](https://help.obsidian.md/Plugins/Templates)
- [Introduction - Templater (silentvoid13.github.io)](https://silentvoid13.github.io/Templater/introduction.html)