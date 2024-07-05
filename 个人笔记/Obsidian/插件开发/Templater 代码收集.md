---
created_at: 2024-07-02 17:46:43
tags:
  - Templater
---
## 在光标处插入当前日期

```js
<%_*
const view = app.workspace.getActiveViewOfType(tp.obsidian.MarkdownView)
if (view) {
    const cursor = view.editor.getCursor()
    app.workspace.activeEditor.editor.replaceRange(
        tp.date.now(),
        cursor
    )
}
_%>
```

## 将选中的内容替换为当前日期

```js
<%_*
const view = app.workspace.getActiveViewOfType(tp.obsidian.MarkdownView)
if (view) {
    // 获取选中的区域
    // const selection = view.editor.getSelection()
    // app.workspace.activeEditor.editor.replaceSelection(selection.toUpperCase())
    app.workspace.activeEditor.editor.replaceSelection(tp.date.now())
}
_%>
```