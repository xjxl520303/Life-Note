## 常见问题

在插件使用过程中或多或少会遇到些问题，下面我们搜集了一些常见问题供帮助读者排忧解难。

### 插入 HTML 代码中包含 `<img>` 标签并指定了本地图片，图片不显示问题。

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