---
created_at: 2024-07-11 19:29:50
tags:
  - Codemirror
updated_at: 2024-07-16 19:44:19
---
本文以文本编辑器中一个比较常见的【下划线】功能为聚焦点来探讨一下一个小小的功能在各大笔记应用中的细节。我们以小见大、精益求精，从一个非常小的细节来看这些笔记应用（作者主要以网页版作为测评）对于功能上的打磨程度，用户体验如何。

最近几个月一直在写 Obsidian 一些重要的插件（如：Dataview，Templater,……）使用教程。在写作的过程中自己也尝试过很多插件，发现有的插件很不错可惜作者已不再维护或者说归档了——于是就开始自己去了解一些插件开发的知识。

在 Obsidian 的插件开发文档中有关**编辑器**扩展的部分文档提到了使用 Codemirror 来创建视图，还提到了很多以前没有接触过的 “State Field”、“Decorations”和“State Effect”概念。但是看了 Obsidian 的文档还是一知半解，不知道如何入手，同时通过搜索引擎查阅 Codemirror 6 相关的文章也寥寥无几，只好跟着 Codemirror 官方[示例](https://codemirror.net/examples/)来了解相关的知识。

本文不去解释有关 **State**、**Effect** 和 **Decoration** 的概念——因为写这篇文章时还处于懵懂状态，就不误导人了。文章主要是基于官方示例([Example: Decorations](https://codemirror.net/examples/decoration/))中有关 Mark Decoration 的使用进行思考和扩展，并使用 React（并不依赖于它） 来实现。

## 高能预警

因为作者现阶段只是了解了一点 Codemirror 的知识，所以文章也就局限在对通过 `Decoration.mark` 添加下划线和去除下划线的一些特殊场景的思考上，代码实现并不据有实际应用性（仅作思路参考）。目前作者还不知道如何保存操作后的结果，以及加载已标记过的内容——特别是在 Obsidian 中保存操作的结果以及获取标记后的 HTML 原始内容——希望哪位大神能指点一二。
## 主流笔记应用对下划线功能的支持程度测评

接下来我们以二段简单地，分别包含中英文的文字来作为测试样例文本：

```
基于 IKAnalyzer 字典分词器的 node.js 实现。
Lorem ipsum dolor sit amet, consectetur adipisicing elit
```

我们选取主流的几款笔记应用并设计几个测试用例点来看一下各个笔记应用地表现。

- 印象笔记
- 有道云笔记
- 语雀
- Notion
- Obsidian

测试功能主要为：

1. 对于中英文选词的支持程度（测试点：光标位于词语/单词的位置〔头、中间和尾〕、选区）
2. 如何添加和取消下划线。
3. 如何扩展、缩小下划线的范围（基于单个、多个组合在一起）。
4. 下划线的展现和编辑方式。

>注：后续我们以“「用例➊」”的形式来分别引用上述几个测试功能点。

「用例➌」我们将其分成以下几个小的分类（蓝色框表示接下来操作选中的选区）：

![[Pasted image 20240716161253.png]]

### 印象笔记

对于「用例➊」，印象笔记在选词上支持中英文在光标前后选词。以“下划线”为例：光标位于“下”前面则选中整个词语,在“线”后面同样如此，但是如果在“线”后面出现别的文本（包含空格）只会向右选择。在中文分词上，当光标位于“分词器”的“分”前面只能选中“分词”，无法选中整个词语（这个跟使用的分词词典有关，语料库越丰富就能识别更多的词语）。印象笔记在选中英文单词时会包含右侧的单词分隔符（空格），对于中文同样支持（多个空格也会选中）。

对于「用例➋」，印象笔记支持通过【工具栏】和【快捷键（<kbd>Ctrl+U</kbd>）】来操作。

接下来我们来重点看一下「用例➌」的测试结果：

![[Pasted image 20240716162503.png]]

- 图中 1）通过查看浏览器的开发者工具，会发现合并后的下划线区域文本是分开的 `"amet, "` 和 `"consectetur"` 合在一起后会变成 `"amet, "\n"consectetur"` （其中 `\n` 表示换行），而不是合并后的 `"amet, consectetur"`。
- 图中 2）这个操作可能不太符合作者的认知（如果自己设计应该是合并操作才对）。
- 图中 3）符合期望。
- 图中 4）符合期望，成功取消了单词内部部分字符的下划线。
- 图中 5、6）符合期望，成功合并在一起了，并且单词也没有被分隔成二段。
- 图中 7）应该执行合并操作才对。
- 图中 8）符合期望，成功合并了。
- 图中 9）成功取消了，但是单词前后的空格中的下划线并没有去除掉。

对于「用例➍」，印象笔记是可以通过鼠标任意选中的，编辑器内部显示为：

```html
<span style="text-decoration: underline;" data-mce-style="text-decoration: underline;">amet, consectetur</span>
```

从代码中的 `data-mce-style` 可以看出印象笔记使用了 [TonyMCE](https://github.com/tinymce/tinymce) 文本编辑器。

### 有道云笔记

对于「用例➊」，功能几乎同印象笔记一致，但是不支持单词尾部选择词语/单词——直接选中了整行文本——这或许是为了方便用户选中整行文本（用户体验优化）。在鼠标快速【双击】选中词语/单词上不包含右侧的空格，这一点作者看来更符合操作习惯。

对于「用例➋」两者支持程度也一致。

对于「用例➌」，两者是否有大的差异呢？请看结果：

![[Pasted image 20240716171530.png]]

测试结果让作者很满意（与自己的认识高度一致），只不过在最后一种单词在句中取消下划线时是否连同单词左右的空格一同去除有所差异。通过查看开发者工具中的文本合并情况，会发现并没有出现像印象笔记那样表现不致的地方，表现很完美。

「用例➍」表现和印象笔记一致，其内部表示为：

```html
<span class="underline" style="text-decoration: underline;">consectetur</span>
```

有道云的文本编辑器是自己实现的，具体可参考：

- [前端 - 有道云笔记新版编辑器架构设计（上） - 有道技术团队 - SegmentFault 思否](https://segmentfault.com/a/1190000039046174)
- [前端 - 有道云笔记新版编辑器架构设计（下） - 有道技术团队 - SegmentFault 思否](https://segmentfault.com/a/1190000039104198)

### 语雀

对于「用例➊」和有道云笔记几乎一致，除了在行末【双击】鼠标时不既不选中鼠标前的文本，也不选中整行——主打一个不响应。

对于「用例➋」支持程度一致。

同有道云笔记——都是自研的文本编辑器，对于「用例➌」是否有不同的想法呢？谜底揭晓：

![[Pasted image 20240716174920.png]]

结果居然和印象笔记出奇地一致，难道语雀自研时参考了 TonyMCE 编辑器😂？不过在合并细节处理上和有道云笔记一样保持了统一。

「用例➍」结果为：

```html
<ne-text ne-underline="true" id="u410ac03c">consecte</ne-text>
```

单从代码来看语雀的实现更加现代化和简洁。

有关语雀文本编辑器的介绍可以参考：[语雀编辑器自研之路 - 掘金 (juejin.cn)](https://juejin.cn/post/7036551063498915877)

### Notion

对于「用例➊」，Notion 在选择词语/单词时与印象笔记保持一致（会选中后面的空格）；在行末【双击】时和语雀保持一致。

对于「用例➋」支持程度一致。

对于「用例➌」，Notion 和有道云笔记保持一致。

![[Pasted image 20240716182854.png]]

「用例➍」结果为：

```html
<span style="color:inherit;border-bottom:0.05em solid;word-wrap:break-word" data-token-index="1" class="notion-enable-hover">amet, consectetur </span>
```

从代码中可以看出 Notion 使用了下边框来实现下划线，并未使用 `text-decoration: underline;`。

### Obsidian

Obsidian 很遗憾在这方面支持有点差强人意，本身没有提供添加下划线的功能，但我们可以通过在编辑器中直接输入 `<u>文本</u>` 来实现。

想要通过工具栏来实现添加下划线，我们需要使用由 PKMer 社区开发的 [Editing Toolbar](https://github.com/PKM-er/obsidian-editing-toolbar) 来实现：

![[Pasted image 20240716190032.png]]

对于快捷键我们可以为 Editing Toolbar 提供的命令【Editing Toolbar: Toggle underline】添加快捷键来实现，但是……其功能就……一言难尽了。

![[动画2 68.gif]]

可以看到操作起来并不顺畅，只能应对简单的场景。取消下划线时需要进入标签内部才能取消，好在在分词方面因为有插件 [Word Splitting for Simplified Chinese in Edit Mode and Vim Mode](https://github.com/aidenlx/cm-chs-patch) 稍微找点安慰🤔。

---

行文至此，作者发现对于在浏览器中【双击】选中文本时的分词功能可能是浏览器提供的，与这几个编辑器无关。在选中词语/单词上文本右侧的空格也是浏览器的默认行为。

此外，作者还看了一下知乎的文本编辑器对于下划线的支持情况——同印象笔记和语雀保持一致。

总的说来在处理下划线的场景下可以分为两派：

- 印象笔记、语雀和知乎
- 有道云笔记、Notion

分歧点在于：已添加下划线的文本右侧再次选中别的文本时，是将其作为下划线部分合并还是将重叠部分去除掉。

如果按照用户体验度排名，本次测评结果排名为：**Notion > 有道云笔记、语雀 > 印象笔记 > Obsidian**。

虽然 Obsidian 垫底，但是凭借其强大地开源社区插件生态，相信未来会弥补这一交互体验上的不足。

## Obsidian 插件开发准备

>[!tip] 由于文章写作时使用的是 Windows 系统，所以后面开发是基于 Windows 环境，如果读者使用的是 MacOS，请自行调整。

新建一个 Obsidian 空白仓库（作者这里取名为："cm6-underline"），然后在资源管理器中打开笔记所在的目录并进入 `.obisidan` 目录；接着创建目录 `plugins`。

开发 Obsidian 插件，我们通常选择基于社区主流的模板 [Obsidian Sample Plugin](https://github.com/obsidianmd/obsidian-sample-plugin) 作为脚手架；此外，我们还需要一个插件 [Hot-Reload](https://github.com/pjeby/hot-reload) 来实现代码变更后插件实时刷新。

因为 Hot Reloat 插件并没有发布到社区插件市场中，因此我们需要手动下载并将其放置到 `.obsidian/plugins` 目录中。要下载插件，我们需要在 Github 中直接找到其发布的最新版本，并选择下载 *hot-reload.zip* 资源到插件目录即可。

接下来我们克隆 Sample Plugin 项目到插件目录中：

```shell
git clone https://github.com/obsidianmd/obsidian-sample-plugin.git
```

当前目录结构如下：

```
E:\NOTE\CM6-UNDERLINE
└─.obsidian
    └─plugins
        ├─hot-reload
        └─obsidian-sample-plugin
```

紧接着，我们进入 `obsidian-sample-plugin` 目录中并执行 `npm i` 命令来下载 NPM 资源库。完成资源下载后，我们就可以使用 `npm run dev` 来启动插件了。

接下来打开 Obsidian，在【选项】中开启插件；此时，应该还看不到我们安装的 Hot Reloat 以及 Sample 插件。要加载插件我们需要重新启动当前仓库，但这里我们可以使用命令（<kbd>Ctrl+P</kbd> 来触发命令列表）【Reload app without saving】来重启仓库；命令执行后，我们再次进入【选项】-> 【社区插件】就可以看到安装的插件了，此时这 2 个插件还处于未开启状态——开启即可。

到此，Obsidian 插件开发地准备工作就结束了，读者可以浏览一下 Sample Plugin 插件提供的样例代码，修改内容看一下 Obsidian 会不会自动刷新插件。

## React 中 Codemirror 6 环境准备

这里可以选择任意前端框架，或者使用 Vanilla（通常指不使用任何框架的原生 JavaScript 环境） 直接开发。

在资源管理器中任意目录（你想要放置代码的目录）中使用 `npm init vite@latest` 来初始化一个 React 开发环境。根据命令行中的提示，依次输入项目名称：`cm6-underline`；框架选择 `React`；开发语言选择 `TypeScript`。完成后，根据终端中的提示进入 `cm6-underline` 目录并执行 `npm i` 来下载项目的初始依赖资源。

接下来下载 Codemirror 6 相关的资源：

```shell
npm i codemirror @codemirror/state @codemirror/view @codemirror/commands
```

现在我们使用 Visual Studio Code 打开项目，使用编辑器自带的 Git 管理工具初始化一个仓库。接下来删除（项目不需要设置样式） `src` 目录下的 App.css 和 index.css 样式文件，并且删除 App.tsc 和 main.tsx 中对于这二个样式文件的引用代码。

然后在 `src` 目录下创建目录 `components` 并添加文件 `Editor.tsx `，将下面内容复制并粘贴到目标文件中：

```tsx
import React, { useRef, useEffect } from 'react'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { defaultKeymap } from '@codemirror/commands'
import { basicSetup } from 'codemirror'

export const Editor = () => {
    const editor = useRef(null)

    useEffect(() => {
        const startState = EditorState.create({
            doc: 'Hello World',
            extensions: [basicSetup, keymap.of(defaultKeymap)],
        });

        const view = new EditorView({ state: startState, parent: editor.current! })

        return () => {
            view.destroy()
        };
    }, []);

    return <div ref={editor}></div>
};
```

修改 `App.tsx` 文件内容为：

```tsx
import { Editor } from './components/Editor'

function App() {
  return (
    <div className="App">
      <Editor />
    </div>
  );
}

export default App;
```

使用 `npm run dev` 运行后会看到以下运行结果：

![[Pasted image 20240717142051.png]]
到此，浏览器中的 Codemirror 6 开发环境准备就绪。

## 下划线功能的构思

从前面的测评章节可以看出主流笔记应用对其功能的实现和操作方式，我们既然写文章就是在此基础上想得更多，才能彰显不凡。

这里我们以 Notion 的下划线功能为参考，在此基础上我们增加以下功能：

1. 支持光标不选中文本时通过快捷键直接添加和移除下划线。
2. 添加自动分词功能。
3. 对于移除下划线时，顺带单词边界的空格也一同去掉。

## 开始编码

首先，我们根据 Codemirror 6 官方[示例](https://codemirror.net/examples/decoration/)在 `components` 目录创建一个 `Underline.ts` 文件，内容如下：

```ts
import { StateEffect, StateField } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView, keymap } from "@codemirror/view";

const addUnderline = StateEffect.define<{from: number, to: number}>({
    map: ({from, to}, change) => ({from: change.mapPos(from), to: change.mapPos(to)})
})

const underlineField = StateField.define<DecorationSet>({
    create() {
        return Decoration.none;
    },
    update(underlines, tr) {
        underlines = underlines.map(tr.changes);
        for (let e of tr.effects) {
            if (e.is(addUnderline)) {
                underlines = underlines.update({
                    add: [underlineMark.range(e.value.from, e.value.to)]
                })
            }
        }
        return underlines;
    },
    provide: f => EditorView.decorations.from(f)
})

const underlineMark = Decoration.mark({class: "cm-underline"})

const underlineTheme = EditorView.baseTheme({
    ".cm-underline": { textDecoration: "underline 3px red" }
})


export function underlineSelection(view: EditorView) {
    let effects: StateEffect<unknown>[] = view.state.selection.ranges
        .filter(r => !r.empty)
        .map(({from, to}) => addUnderline.of({from, to}))
    
    if (!effects.length) return false;

    if (!view.state.field(underlineField, false)) {
        effects.push(StateEffect.appendConfig.of([underlineField, underlineTheme]))
    }

    view.dispatch({effects})
    return true
}

export const underlineKeymap = keymap.of([{
    key: "Alt-a",
    preventDefault: true,
    run: underlineSelection
}])
```

下面我们来简单梳理一下 Codemirror 6 中相关的概念。

Codemirror 6 中有几个核心的包：

- `@codemirror/state` 定义了编辑器的状态管理和文档模型。编辑器的状态包括文本内容、光标位置、选区和编辑器的配置选项等。
- `@codemirror/view` 提供了构建编辑器用户界面的核心功能。它定义了编辑器的视图组件、输入处理和渲染逻辑等。
- `@codemirror/commands` 定义了许多编辑命令和一些快捷键地绑定。
- `codemirror` 是一个编辑器的基础配置预设包，包含了自动补全、高亮、主题等。
- `@codemirror/lang-xxx` 为特定语言提供语法高亮和解析功能。

在 Codemirror 6 中我们会看到很多关键字，如：**State**、**Effect**、**Transaction** 和 **Decoration**。

一）State 代表了编辑器的当前状态，包含文档内容、光标位置、选区、配置项等所有与编辑器相关的信息。它是不可变的，一旦创建就不会改变，除非创建新的 State 对象来替代。

二）Effect 用于表示对编辑器状态更改的一种抽象。它并不直接修改状态，而是定义了状态应如何更改。

三）Transaction 用于封装对编辑器状态更改的实体。如果了解数据库查询语言，这和里面的事务是同一个概念；它收集一组 Effect，并将它们应用到 State 上，从而生成一个新的 State 对象。

四）Decoration 提供了如何在编辑器中绘制内容和修改样式的功能。

现在我们解释一下上面的代码：

```ts
const addUnderline = StateEffect.define<{from: number, to: number}>({
    map: ({from, to}, change) => ({from: change.mapPos(from), to: change.mapPos(to)})
})
```

这段代码定义了一个名为 `addUnderline` 的 Effect。从代码看是对变化进行映射，但是作者尝试在代码中的 `map` 函数中添加 `cosnole.log` 或者断点都未触发执行，后面我们将其改成 `const addUnderline = StateEffect.define<{from: number, to: number}>()` 姑且认为这就是定义一个操作吧。

`const underlineField = StateField.define<DecorationSet>({...})` 用于定义一个状态字段，其类型为 `DecorationSet`。`DecorationSet` 表示一组 Decoration 对象，每一个 Decoration 都和编辑器中的一个特定范围相关联。

`create` 方法用于创建初始状态，这里我们一开始是不会添加下划线，因为没有可操作的选区，直接设置为 `Decoration.none`。如果是实际项目中，这里我们需要做的就是对已加载的文档进行解析，找出标记为下划线的文本的位置信息，然后使用 `Decoration.set([underlineMark.range(0, 2)])` 来标记。在当前的项目中我们需要将 `underlineField` 和 `underlineTheme` 导出并在 `Editor.tsx` 文件中引入并在 `extensions` 中添加。

`update` 方法用于更新内容。如果运行时有 `view.dispatch("xxx")` 发送，这里就可以捕捉到，接着判断关心的 Effect 就可以了。在 `update` 内部我们从 Transaction 中获取到所有的改变并遍历其中的 Effect，找到与 `addUnderline` 关联的操作，然后通过 `RangeSet.update` 方法来更新选区内容。在 `RangeSet.update` 方法中我们传递的是 `RangeSetUpdate` 类型参数，该类型定义了相关的更新方式：`add`, `sort`, `filter`, `filterFrom` 和 `filterTo` 5 种；这里我们使用 `add` 属性来添加一个带有下划线的选区。

`provide: f => EditorView.decorations.from(f)` 用于将 `underlineField` 提供的装饰集传递给 EditorView，使其能够在视图中显示这些 Decoration。如果没有这一行代码，你将无法看到效果。

`Decoration.mark({class: "cm-underline"})` 用于添加一个标记，这里默认会生成一个类似 `<span class="cm-underline">内容</span>` 的 HTML 标签。除了指定类名（`class`）外，这里还可以指定属性（`attributes`）、标签名（`tagName`）以及其它一些由 `MarkDecorationSpec` 接口定义的属性。

`EditorView.baseTheme({...})` 用于向 Codemirror 添加自己的样式。

`function underlineSelection(view: EditorView) {}` 用于定义用户操作，它是用来响应快捷键操作的。这里我们通过调用 `view.dispatch({effects})` 来应用状态的变更。`dispatch` 方法有多个定义，这里传递的是一个 `Transaction` 类实例。`Transaction` 类有多个属性，这里我们只关心 `effects` 属性，它的类型为 `StateEffect` 数组。代码中，我们判断了选区是否为空，检查了 `underlineField` 是否位于 `view.state` 中，如果不存在就将其添加到 `effects` 数组中。

现在我们切换到 `Editor.tsx` 文件中，将基变更为：

```ts
import { useRef, useEffect } from 'react'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { defaultKeymap } from '@codemirror/commands'
import { basicSetup } from 'codemirror'
import { underlineKeymap } from './Underline'

export const Editor = () => {
    const editor = useRef(null);

    useEffect(() => {
        const startState = EditorState.create({
            doc: '基于 IKAnalyzer 字典分词器的 node.js 实现。\nLorem ipsum dolor sit amet, consectetur adipisicing elit',
            extensions: [basicSetup, keymap.of(defaultKeymap), underlineKeymap],
        })

        const view = new EditorView({ state: startState, parent: editor.current! })

        return () => {
            view.destroy()
        };
    }, []);

    return <div ref={editor}></div>
};
```

然后看一下效果：

![[动画2 69.gif]]

当我们在浏览器开发工具查看应用后的效果时会发现多次应用后会出现 HTML 标签叠加现象，同时目前还无法移除已添加的下划线。

### 添加重复标记验证逻辑

对于已添加过下划线的选区我们应该取消再次标记（这里先不讨论移除逻辑）以避免标签叠加，因此我们需要实现一个过滤操作。

在 `if (e.is(addUnderline)) {}` 代码块内第一行添加以下代码：

```ts
underlines = underlines.update({
    filter: (from, to) => !(from >= e.value.from && to <= e.value.to)
})
```

这里的 `filter` 方法定义了如何过滤选区内容，如果返回 `true` 则保留选区操作，为 `false` 就丢弃。`from` 和 `to` 表示上一个状态的选区起始位置， `e.value.from` 和 `e.value.to` 表示新的状态选区的起始位置值。

在 `filter` 中的判断逻辑其实并不严谨，只适用下图中的第 2、3 两种情形，后续我们会再来改进。

![[Pasted image 20240717192708.png]]
### 添加移除下划线逻辑

在 `addUnderline` 定义位置添加一个 `removeUnderline` 的 Effect:

```ts
const removeUnderline = StateEffect.define<{from: number, to: number}>()
```

要移除下划线，我们首先得获取已添加下划线的选区——好在 `DecorationSet` （实际为：`RanageSet<Decoration>` 类）类型有一个 `between` 方法，它可以在指定的选区范围内对其包含的所有选区进行遍历操作，相当数组的 `forEach` 方法。例如我们使用：

```ts
underlines.between(e.value.from, e.value.to, (from, to) => {
    console.log(from, to)
})
```

表示在控制台输出当前选区覆盖范围内已添加过下划线的选区的起始位置值，如果包含多个选区，则会对每个选区位置进行输出。基于此逻辑，我们可以定义一个标志 `isMarked` 来作为【添加】和【移除】的判断依据，修改后的代码如下：

```ts
if (e.is(addUnderline)) {
    let isMarked = false
    underlines.between(e.value.from, e.value.to, () => {
        isMarked = true
    })

    if (isMarked) {
        underlines = underlines.update({
            filter: (from, to) => !(from >= e.value.from && to <= e.value.to)
        })
    } else {
        underlines = underlines.update({
            add: [underlineMark.range(e.value.from, e.value.to)]
        })
    }
}
```

效果如下：

![[动画2 70.gif]]

到目前为此我们的实现仅仅只能应对最简单的操作，一旦涉及多个选区或者包含部分（全部）下划线加文字的情形就会不起作用。

### 应对复杂地操作

现在我们来根据不同的场景来分析一下在实现过程中需要考虑的细节。后文为了方便表达，我们以“标记”来指代包含下划线的文本（或区域）；以“头部”表示选区左侧位置，“锚点”表示选区右侧位置。

>[!tip] 【注意】实际上选区由锚点（`anchor` 〔移动选择时不移动的一侧〕）和头部（`head` 〔移动的一侧〕）组成。

#### 选区头部不包含标记，锚点位于标记中：进行合并操作

我们用一张图来描绘这种场景：

![[Pasted image 20240718113847.png]]

图中：红色部分表示上一个标记的起始位置，绿色部分表示新的选区起始位置；其中 `e.value.to` 可以和标记的起始位置重合（图中未描绘出这二种情形）。

这里我们首先要识别出这一情形，可以通过在 `underlines.between` 函数中进行以下判断：

```ts
if ((e.value.from < from && e.value.to >= from) && e.value.to <= to) {
    // ...
}
```

接下来需要将原有的标记移除掉，并添加新的标记——新标记的锚点指向上一个标记的锚点（`to` 值）。移除标记我们可以封装一个 `removeUnderline` 的方法：

```ts
const removeUnderline = () => {
    underlines = underlines.update({
        filter: () => false
    })
}
```

下面是调整后的代码：

```ts
export const underlineField = StateField.define<DecorationSet>({
    create() {
        return Decoration.none;
    },
    update(underlines, tr) {
        underlines = underlines.map(tr.changes)

        const removeUnderline = () => {
            underlines = underlines.update({
                filter: () => false
            })
        }

        for (let e of tr.effects) {
            if (e.is(addUnderline)) {
                let isMarked = false
                underlines.between(e.value.from, e.value.to, (from, to) => {
                    if ((e.value.from < from && e.value.to >= from) && e.value.to <= to) {
                        e.value.to = to
                        removeUnderline()
                        isMarked = false
                    } else {
                        isMarked = true
                    }
                })

                if (!isMarked) {
                    underlines = underlines.update({
                        add: [underlineMark.range(e.value.from, e.value.to)]
                    })
                } else {
                    removeUnderline()
                }
            }
        }

        return underlines;
    },
    provide: f => EditorView.decorations.from(f)
})
```

验证一下：

![[动画2 71.gif]]

#### 选区头部位于标记中，锚点不包含标记：执行合并操作

![[Pasted image 20240718141643.png]]

这种情形和第一种差不多，但是在处理逻辑上——从我们前面的测评来看——各主流笔记应用出现了分歧。我们这里选择进行合并选区操作，处理逻辑上第一种类似，所以接着上面的代码添加一个 `else if` 逻辑：

```ts
// ...
} else if ((e.value.from > from && e.value.from <= to) && e.value.to > to) {
    e.value.from = from
    removeUnderline()
    isMarked = false
}
// ...
```

验证一下：

![[动画2 72.gif]]

#### 选区包含标记或者被标记包含：执行合并或移除逻辑

![[Pasted image 20240718145020.png]]

在标记内部的情形就不给出图例了。

这二种情形中“包含标记”的判断逻辑很简单，处理也不复杂，直接上代码：

```ts
// ...
} else if (e.value.from < from && e.value.to > to) {
    removeUnderline()
    isMarked = false
}
// ...
```

“在标记中”的情况因为涉及到将一个标记分成 3 部分：左右两部分需要添加标记，中间部分不需要。这里我们需要将添加标记进行封装并传入指定的起始位置来标记，而不是按前面的最新选区来标记。

```ts
const createUnderline = (from: number, to: number) => {
    return underlines.update({
        add: [underlineMark.range(from, to)]
    })
}
```

接着还需要增加一个标志位 `isRemove` 来标识是否要执行移除逻辑，因为我们在处理这种情形时已经执行过一次移除操作了，所以后面再执行就把新增加的标记给移除掉了。

下面是现阶段已完成的 `update` 部分代码：

```ts
update(underlines, tr) {
    underlines = underlines.map(tr.changes)

    const removeUnderline = () => {
        underlines = underlines.update({
            filter: () => false
        })
    }

    const createUnderline = (from: number, to: number) => {
        return underlines.update({
            add: [underlineMark.range(from, to)]
        })
    }

    for (let e of tr.effects) {
        if (e.is(addUnderline)) {
            let isMarked = false
            let isRemove = true
            underlines.between(e.value.from, e.value.to, (from, to) => {
                if ((e.value.from < from && e.value.to >= from) && e.value.to <= to) {
                    e.value.to = to
                    removeUnderline()
                    isMarked = false
                } else if ((e.value.from > from && e.value.from <= to) && e.value.to > to) {
                    e.value.from = from
                    removeUnderline()
                    isMarked = false
                } else if (e.value.from < from && e.value.to > to) {
                    removeUnderline()
                    isMarked = false
                } else if (e.value.from > from && e.value.to < to) {
                    removeUnderline()
                    underlines = createUnderline(from, e.value.from)
                    underlines = createUnderline(e.value.to, to)
                    isMarked = true
                    isRemove = false
                } else {
                    isMarked = true
                }
            })

            if (!isMarked) {
                underlines = createUnderline(e.value.from, e.value.to)
            } else {
                isRemove && removeUnderline()
            }
        }
    }

    return underlines;
}
```

结果：

![[动画2 73.gif]]

#### 两个标记之间，选择部分标记和内容：执行合并操作

![[Pasted image 20240718170448.png]]

这种情形实际上同前面介绍的前二种情形的一种特殊情况，为什么说特殊呢——是因为判断逻辑不一样。我们先看一下存在的问题：

![[动画2 74.gif]]

从 GIF 图中可以看出，在我们操作时其它标记也受到了影响，这显然是不能接受地。要解决这个问题，我们需要从 `filter` 函数着手，因为在这里控制着移除标记的逻辑。

在 `filter` 内部我们只需要增加一个判断条件：新选区的头部和锚点只要其中一个位于标记中就移除这个标记。因为我们的 `removeUnderline` 方法位于 `underlines.between()` 外部，因此还需要增加新选区的起始位置作为参数传进去以便判断，同时还要更新相关调用位置的参数。

调整后的代码如下：

```ts
update(underlines, tr) {
    underlines = underlines.map(tr.changes)

    const removeUnderline = (from: number, to: number) => {
        underlines = underlines.update({
            filter: (f: number, t: number) => !((f >= from && t <= to) || (f < from && t > to))
        })
    }

    const createUnderline = (from: number, to: number) => {
        return underlines.update({
            add: [underlineMark.range(from, to)]
        })
    }

    for (let e of tr.effects) {
        if (e.is(addUnderline)) {
            let isMarked = false
            let isRemove = true
            underlines.between(e.value.from, e.value.to, (from, to) => {
                if ((e.value.from < from && e.value.to >= from) && e.value.to <= to) {
                    e.value.to = to
                    removeUnderline(e.value.from, e.value.to)
                    isMarked = false
                } else if ((e.value.from > from && e.value.from <= to) && e.value.to > to) {
                    e.value.from = from
                    removeUnderline(e.value.from, e.value.to)
                    isMarked = false
                } else if (e.value.from < from && e.value.to > to) {
                    removeUnderline(e.value.from, e.value.to)
                    isMarked = false
                } else if (e.value.from > from && e.value.to < to) {
                    removeUnderline(e.value.from, e.value.to)
                    underlines = createUnderline(from, e.value.from)
                    underlines = createUnderline(e.value.to, to)
                    isMarked = true
                    isRemove = false
                } else {
                    isMarked = true
                }
            })

            if (!isMarked) {
                underlines = createUnderline(e.value.from, e.value.to)
            } else {
                isRemove && removeUnderline(e.value.from, e.value.to)
            }
        }
    }

    return underlines;
}
```

结果：

![[动画2 75.gif]]

#### 实现移除标记时将单词左右空白符一同去掉逻辑



