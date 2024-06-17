/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => NoteDefinition
});
module.exports = __toCommonJS(main_exports);
var import_obsidian4 = require("obsidian");

// src/core/def-file-manager.ts
var import_obsidian2 = require("obsidian");

// src/editor/prefix-tree.ts
var PTreeNode = class {
  constructor() {
    this.children = /* @__PURE__ */ new Map();
    this.wordEnd = false;
  }
  add(word, ptr) {
    if (ptr === word.length) {
      this.wordEnd = true;
      return;
    }
    const currChar = word.charAt(ptr);
    let nextNode;
    nextNode = this.children.get(currChar);
    if (!nextNode) {
      nextNode = new PTreeNode();
      this.children.set(currChar, nextNode);
    }
    nextNode.add(word, ++ptr);
  }
};
var PTreeTraverser = class {
  constructor(root) {
    this.currPtr = root;
    this.wordBuf = [];
  }
  gotoNext(c) {
    if (!this.currPtr) {
      return;
    }
    const nextNode = this.currPtr.children.get(c);
    this.currPtr = nextNode;
    this.wordBuf.push(c);
  }
  isWordEnd() {
    if (!this.currPtr) {
      return false;
    }
    return this.currPtr.wordEnd;
  }
  getWord() {
    return this.wordBuf.join("");
  }
};

// src/settings.ts
var import_obsidian = require("obsidian");
var DEFAULT_DEF_FOLDER = "definitions";
var DEFAULT_SETTINGS = {
  enableInReadingView: true,
  popoverEvent: "hover" /* Hover */,
  defFileParseConfig: {
    divider: {
      dash: true,
      underscore: false
    }
  }
};
var SettingsTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.settings = window.NoteDefinition.settings;
  }
  display() {
    let { containerEl } = this;
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setName("Enable in Reading View").setDesc("Allow defined phrases and definition popovers to be shown in Reading View").addToggle((component) => {
      component.setValue(this.settings.enableInReadingView);
      component.onChange(async (val) => {
        this.settings.enableInReadingView = val;
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian.Setting(containerEl).setName("Definitions folder").setDesc("Files within this folder will be parsed to register definitions (specify relative to root of vault)").addText((component) => {
      component.setValue(this.settings.defFolder);
      component.setPlaceholder(DEFAULT_DEF_FOLDER);
      component.onChange(async (value) => {
        this.settings.defFolder = value;
        await this.plugin.saveSettings();
        this.plugin.refreshDefinitions();
      });
    });
    new import_obsidian.Setting(containerEl).setName("Definition popover display event").setDesc("Choose the trigger event for displaying the definition popover").addDropdown((component) => {
      component.addOption("hover" /* Hover */, "Hover");
      component.addOption("click" /* Click */, "Click");
      component.setValue(this.settings.popoverEvent);
      component.onChange(async (value) => {
        if (value === "hover" /* Hover */ || value === "click" /* Click */) {
          this.settings.popoverEvent = value;
        }
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian.Setting(containerEl).setName("Definition file format settings").setDesc("Customise parsing rules for definition files").addExtraButton((component) => {
      component.onClick(() => {
        const modal = new import_obsidian.Modal(this.app);
        modal.setTitle("Definition file format settings");
        new import_obsidian.Setting(modal.contentEl).setName("Divider").setHeading();
        new import_obsidian.Setting(modal.contentEl).setName("Dash").setDesc("Use triple dash (---) as divider").addToggle((component2) => {
          component2.setValue(this.settings.defFileParseConfig.divider.dash);
          component2.onChange(async (value) => {
            if (!value && !this.settings.defFileParseConfig.divider.underscore) {
              new import_obsidian.Notice("At least one divider must be chosen", 2e3);
              component2.setValue(this.settings.defFileParseConfig.divider.dash);
              return;
            }
            this.settings.defFileParseConfig.divider.dash = value;
            await this.plugin.saveSettings();
          });
        });
        new import_obsidian.Setting(modal.contentEl).setName("Underscore").setDesc("Use triple underscore (___) as divider").addToggle((component2) => {
          component2.setValue(this.settings.defFileParseConfig.divider.underscore);
          component2.onChange(async (value) => {
            if (!value && !this.settings.defFileParseConfig.divider.dash) {
              new import_obsidian.Notice("At least one divider must be chosen", 2e3);
              component2.setValue(this.settings.defFileParseConfig.divider.underscore);
              return;
            }
            this.settings.defFileParseConfig.divider.underscore = value;
            await this.plugin.saveSettings();
          });
        });
        modal.open();
      });
    });
  }
};
function getSettings() {
  return window.NoteDefinition.settings;
}

// src/editor/marker.ts
var import_state = require("@codemirror/state");
var import_view = require("@codemirror/view");

// src/util/log.ts
var levelMap = {
  0: "SILENT",
  // Should not be used
  1: "ERROR",
  2: "WARN",
  3: "INFO",
  4: "DEBUG"
};
function logWithLevel(msg, logLevel) {
  if (window.NoteDefinition.LOG_LEVEL >= logLevel) {
    console.log(`${levelMap[logLevel]}: ${msg}`);
  }
}
function logDebug(msg) {
  logWithLevel(msg, 4 /* Debug */);
}
function logWarn(msg) {
  logWithLevel(msg, 2 /* Warn */);
}
function logError(msg) {
  logWithLevel(msg, 1 /* Error */);
}

// src/editor/common.ts
var triggerFunc = "event.stopPropagation();window.NoteDefinition.triggerDefPreview(this);";
var DEF_DECORATION_CLS = "def-decoration";
function getDecorationAttrs(phrase) {
  let attributes = {
    def: phrase
  };
  const settings = getSettings();
  if (settings.popoverEvent === "click" /* Click */) {
    attributes.onclick = triggerFunc;
  } else {
    attributes.onmouseenter = triggerFunc;
  }
  return attributes;
}

// src/editor/definition-search.ts
var LineScanner = class {
  constructor() {
    this.cnLangRegex = /\p{Script=Han}/u;
    this.terminatingCharRegex = /[!@#$%^&*()\+={}[\]:;"'<>,.?\/|\\\r\n （）＊＋，－／：；＜＝＞＠［＼］＾＿｀｛｜｝～｟｠｢｣､　、〃〈〉《》「」『』【】〔〕〖〗〘〙〚〛〜〝〞〟—‘’‛“”„‟…‧﹏﹑﹔·]/;
  }
  scanLine(line, offset) {
    let traversers = [];
    const defManager = getDefFileManager();
    const phraseInfos = [];
    for (let i = 0; i < line.length; i++) {
      const c = line.charAt(i).toLowerCase();
      if (this.isValidStart(line, i)) {
        traversers.push(new PTreeTraverser(defManager.prefixTree));
      }
      traversers.forEach((traverser) => {
        traverser.gotoNext(c);
        if (traverser.isWordEnd() && this.isValidEnd(line, i)) {
          const phrase = traverser.getWord();
          phraseInfos.push({
            phrase,
            from: (offset != null ? offset : 0) + i - phrase.length + 1,
            to: (offset != null ? offset : 0) + i + 1
          });
        }
      });
      traversers = traversers.filter((traverser) => {
        return !!traverser.currPtr;
      });
    }
    return phraseInfos;
  }
  isValidEnd(line, ptr) {
    const c = line.charAt(ptr).toLowerCase();
    if (this.isNonSpacedLanguage(c)) {
      return true;
    }
    if (ptr === line.length - 1) {
      return true;
    }
    return this.terminatingCharRegex.test(line.charAt(ptr + 1));
  }
  // Check if this character is a valid start of a word depending on the context
  isValidStart(line, ptr) {
    const c = line.charAt(ptr).toLowerCase();
    if (c == " ") {
      return false;
    }
    if (ptr === 0 || this.isNonSpacedLanguage(c)) {
      return true;
    }
    return this.terminatingCharRegex.test(line.charAt(ptr - 1));
  }
  isNonSpacedLanguage(c) {
    return this.cnLangRegex.test(c);
  }
};

// src/editor/marker.ts
var markedPhrases = [];
function getMarkedPhrases() {
  return markedPhrases;
}
var DefinitionMarker = class {
  constructor(view) {
    this.cnLangRegex = /\p{Script=Han}/u;
    this.terminatingCharRegex = /[!@#$%^&*()\+={}[\]:;"'<>,.?\/|\\\r\n ]/;
    this.decorations = this.buildDecorations(view);
  }
  update(update) {
    if (update.docChanged || update.viewportChanged || update.focusChanged) {
      const start = performance.now();
      this.decorations = this.buildDecorations(update.view);
      const end = performance.now();
      logDebug(`Marked definitions in ${end - start}ms`);
      return;
    }
  }
  destroy() {
  }
  buildDecorations(view) {
    const builder = new import_state.RangeSetBuilder();
    const phraseInfos = [];
    for (let { from, to } of view.visibleRanges) {
      const text = view.state.sliceDoc(from, to);
      phraseInfos.push(...this.scanText(text, from));
    }
    phraseInfos.forEach((wordPos) => {
      const attributes = getDecorationAttrs(wordPos.phrase);
      builder.add(wordPos.from, wordPos.to, import_view.Decoration.mark({
        class: DEF_DECORATION_CLS,
        attributes
      }));
    });
    markedPhrases = phraseInfos;
    return builder.finish();
  }
  // Scan text and return phrases and their positions that require decoration
  scanText(text, offset) {
    let phraseInfos = [];
    const lines = text.split("\n");
    let internalOffset = offset;
    const lineScanner = new LineScanner();
    lines.forEach((line) => {
      phraseInfos.push(...lineScanner.scanLine(line, internalOffset));
      internalOffset += line.length + 1;
    });
    phraseInfos.sort((a, b) => b.to - a.to);
    phraseInfos.sort((a, b) => a.from - b.from);
    return this.removeSubsetsAndIntersects(phraseInfos);
  }
  removeSubsetsAndIntersects(phraseInfos) {
    let cursor = 0;
    return phraseInfos.filter((phraseInfo) => {
      if (phraseInfo.from >= cursor) {
        cursor = phraseInfo.to;
        return true;
      }
      return false;
    });
  }
};
var pluginSpec = {
  decorations: (value) => value.decorations
};
var definitionMarker = import_view.ViewPlugin.fromClass(
  DefinitionMarker,
  pluginSpec
);

// src/util/editor.ts
function getMarkedWordUnderCursor(editor) {
  const currWord = getWordByOffset(editor.posToOffset(editor.getCursor()));
  return normaliseWord(currWord);
}
function normaliseWord(word) {
  return word.trimStart().trimEnd().toLowerCase();
}
function getWordByOffset(offset) {
  const markedPhrases2 = getMarkedPhrases();
  let start = 0;
  let end = markedPhrases2.length - 1;
  while (start <= end) {
    let mid = Math.floor((start + end) / 2);
    let currPhrase = markedPhrases2[mid];
    if (offset >= currPhrase.from && offset <= currPhrase.to) {
      return currPhrase.phrase;
    }
    if (offset < currPhrase.from) {
      end = mid - 1;
    }
    if (offset > currPhrase.to) {
      start = mid + 1;
    }
  }
  return "";
}

// src/core/file-parser.ts
var FileParser = class {
  constructor(app, file) {
    this.app = app;
    this.vault = app.vault;
    this.file = file;
    this.defBuffer = {};
    this.inDefinition = false;
    this.definitions = [];
  }
  async parseFile() {
    const fileContent = await this.vault.cachedRead(this.file);
    const lines = fileContent.split("\n");
    for (const line of lines) {
      if (this.isEndOfBlock(line)) {
        if (this.bufferValid()) {
          this.commitDefBuffer();
        }
        this.startNewBlock();
        continue;
      }
      if (this.inDefinition) {
        this.defBuffer.definition += line + "\n";
        continue;
      }
      if (line == "") {
        continue;
      }
      if (this.isWordDeclaration(line)) {
        this.defBuffer.word = this.extractWordDeclaration(line);
        continue;
      }
      if (this.isAliasDeclaration(line)) {
        this.defBuffer.aliases = this.extractAliases(line);
        continue;
      }
      this.inDefinition = true;
      this.defBuffer.definition = line + "\n";
    }
    if (this.bufferValid()) {
      this.commitDefBuffer();
    }
    return this.definitions;
  }
  commitDefBuffer() {
    var _a, _b, _c, _d, _e;
    this.definitions.push({
      key: (_b = (_a = this.defBuffer.word) == null ? void 0 : _a.toLowerCase()) != null ? _b : "",
      word: (_c = this.defBuffer.word) != null ? _c : "",
      aliases: (_d = this.defBuffer.aliases) != null ? _d : [],
      definition: (_e = this.defBuffer.definition) != null ? _e : "",
      file: this.file,
      linkText: `${this.file.path}${this.defBuffer.word ? "#" + this.defBuffer.word : ""}`
    });
    if (this.defBuffer.aliases && this.defBuffer.aliases.length > 0) {
      this.defBuffer.aliases.forEach((alias) => {
        var _a2, _b2, _c2;
        this.definitions.push({
          key: alias.toLowerCase(),
          word: (_a2 = this.defBuffer.word) != null ? _a2 : "",
          aliases: (_b2 = this.defBuffer.aliases) != null ? _b2 : [],
          definition: (_c2 = this.defBuffer.definition) != null ? _c2 : "",
          file: this.file,
          linkText: `${this.file.path}${this.defBuffer.word ? "#" + this.defBuffer.word : ""}`
        });
      });
    }
    this.defBuffer = {};
  }
  bufferValid() {
    return !!this.defBuffer.word;
  }
  isEndOfBlock(line) {
    const parseSettings = this.getParseSettings();
    if (parseSettings.divider.dash && line.startsWith("---")) {
      return true;
    }
    return parseSettings.divider.underscore && line.startsWith("___");
  }
  isAliasDeclaration(line) {
    line = line.trimEnd();
    return !!this.defBuffer.word && line.startsWith("*") && line.endsWith("*");
  }
  extractAliases(line) {
    {
      line = line.trimEnd().replace(/\*+/g, "");
      const aliases = line.split(",");
      return aliases.map((alias) => alias.trim());
    }
  }
  isWordDeclaration(line) {
    return line.startsWith("# ");
  }
  extractWordDeclaration(line) {
    const sepLine = line.split(" ");
    if (sepLine.length <= 1) {
      return "";
    }
    return sepLine.slice(1).join(" ");
  }
  startNewBlock() {
    this.inDefinition = false;
    this.defBuffer = {};
  }
  getParseSettings() {
    return getSettings().defFileParseConfig;
  }
};

// src/core/def-file-manager.ts
var defFileManager;
var DefManager = class {
  constructor(app) {
    this.app = app;
    this.globalDefs = /* @__PURE__ */ new Map();
    this.globalDefFiles = [];
    window.NoteDefinition.definitions.global = this.globalDefs;
    this.prefixTree = new PTreeNode();
  }
  isDefFile(file) {
    return file.path.startsWith(this.getGlobalDefFolder());
  }
  reset() {
    this.prefixTree = new PTreeNode();
    this.globalDefs.clear();
    this.globalDefFiles = [];
  }
  loadDefinitions() {
    this.reset();
    this.loadGlobals();
  }
  get(key) {
    return this.globalDefs.get(normaliseWord(key));
  }
  has(key) {
    return this.globalDefs.has(normaliseWord(key));
  }
  async loadGlobals() {
    const globalFolder = this.app.vault.getFolderByPath(this.getGlobalDefFolder());
    if (!globalFolder) {
      logWarn("Global definition folder not found, unable to load global definitions");
      return;
    }
    const definitions = await this.parseFolder(globalFolder);
    definitions.forEach((def) => {
      this.globalDefs.set(def.key, def);
    });
    const root = new PTreeNode();
    this.globalDefs.forEach((_, key) => {
      root.add(key, 0);
    });
    this.prefixTree = root;
  }
  async parseFolder(folder) {
    const definitions = [];
    for (let f of folder.children) {
      if (f instanceof import_obsidian2.TFolder) {
        let defs = await this.parseFolder(f);
        definitions.push(...defs);
      } else if (f instanceof import_obsidian2.TFile) {
        let defs = await this.parseFile(f);
        definitions.push(...defs);
      }
    }
    return definitions;
  }
  async parseFile(file) {
    this.globalDefFiles.push(file);
    let parser = new FileParser(this.app, file);
    return parser.parseFile();
  }
  getGlobalDefFolder() {
    return window.NoteDefinition.settings.defFolder || DEFAULT_DEF_FOLDER;
  }
};
function initDefFileManager(app) {
  defFileManager = new DefManager(app);
  return defFileManager;
}
function getDefFileManager() {
  return defFileManager;
}

// src/editor/definition-popover.ts
var import_obsidian3 = require("obsidian");
var DEF_POPOVER_ID = "definition-popover";
var definitionPopover;
var DefinitionPopover = class extends import_obsidian3.Component {
  constructor(plugin) {
    super();
    this.close = () => {
      this.unmount();
    };
    this.clickClose = () => {
      var _a;
      if ((_a = this.mountedPopover) == null ? void 0 : _a.matches(":hover")) {
        return;
      }
      this.close();
    };
    this.app = plugin.app;
    this.plugin = plugin;
    this.cmEditor = this.getCmEditor(this.app);
  }
  // Open at editor cursor's position
  openAtCursor(def) {
    this.unmount();
    this.mountAtCursor(def);
    if (!this.mountedPopover) {
      logError("Mounting definition popover failed");
      return;
    }
    this.registerClosePopoverListeners();
  }
  // Open at coordinates (can use for opening at mouse position)
  openAtCoords(def, coords) {
    this.unmount();
    this.mountAtCoordinates(def, coords);
    if (!this.mountedPopover) {
      logError("mounting definition popover failed");
      return;
    }
    this.registerClosePopoverListeners();
  }
  cleanUp() {
    logDebug("Cleaning popover elements");
    const popoverEls = document.getElementsByClassName(DEF_POPOVER_ID);
    for (let i = 0; i < popoverEls.length; i++) {
      popoverEls[i].remove();
    }
  }
  getCmEditor(app) {
    var _a, _b, _c;
    const activeView = app.workspace.getActiveViewOfType(import_obsidian3.MarkdownView);
    const cmEditor = (_c = (_b = (_a = activeView == null ? void 0 : activeView.editMode) == null ? void 0 : _a.editor) == null ? void 0 : _b.cm) == null ? void 0 : _c.cm;
    if (!cmEditor) {
      logDebug("cmEditor object not found, will not handle vim events for definition popover");
    }
    return cmEditor;
  }
  shouldOpenToLeft(horizontalOffset, containerStyle) {
    return horizontalOffset > parseInt(containerStyle.width) / 2;
  }
  shouldOpenUpwards(verticalOffset, containerStyle) {
    return verticalOffset > parseInt(containerStyle.height) / 2;
  }
  createElement(def) {
    var _a, _b;
    const el = this.app.workspace.containerEl.createEl("div", {
      cls: "definition-popover",
      attr: {
        id: DEF_POPOVER_ID,
        style: `visibility:hidden`
      }
    });
    el.createEl("h2", { text: def.word });
    if (def.aliases.length > 0) {
      el.createEl("i", { text: def.aliases.join(", ") });
    }
    const contentEl = el.createEl("div");
    contentEl.setAttr("ctx", "def-popup");
    const currComponent = this;
    import_obsidian3.MarkdownRenderer.render(
      this.app,
      def.definition,
      contentEl,
      (_b = (_a = this.plugin.app.workspace.getActiveFile()) == null ? void 0 : _a.path) != null ? _b : "",
      currComponent
    );
    return el;
  }
  mountAtCursor(def) {
    let cursorCoords;
    try {
      cursorCoords = this.getCursorCoords();
    } catch (e) {
      logError("Could not open definition popover - could not get cursor coordinates");
      return;
    }
    this.mountAtCoordinates(def, cursorCoords);
  }
  mountAtCoordinates(def, coords) {
    const workspaceStyle = getComputedStyle(this.app.workspace.containerEl);
    this.mountedPopover = this.createElement(def);
    const positionStyle = {
      visibility: "visible"
    };
    if (this.shouldOpenToLeft(coords.left, workspaceStyle)) {
      positionStyle.right = `${parseInt(workspaceStyle.width) - coords.left}px`;
      positionStyle.maxWidth = "max(calc(100vw / 3))";
    } else {
      positionStyle.left = `${coords.left}px`;
      positionStyle.maxWidth = "max(calc(100vw / 3))";
    }
    if (this.shouldOpenUpwards(coords.top, workspaceStyle)) {
      positionStyle.bottom = `${parseInt(workspaceStyle.height) - coords.top}px`;
      positionStyle.maxHeight = `${coords.top}px`;
    } else {
      positionStyle.top = `${coords.bottom}px`;
      positionStyle.maxHeight = `calc(100vh - ${coords.bottom}px)`;
    }
    this.mountedPopover.setCssStyles(positionStyle);
  }
  unmount() {
    if (!this.mountedPopover) {
      logDebug("Nothing to unmount, could not find popover element");
      return;
    }
    this.mountedPopover.remove();
    this.mountedPopover = void 0;
    this.unregisterClosePopoverListeners();
  }
  getCursorCoords() {
    var _a, _b;
    const editor = (_a = this.app.workspace.activeEditor) == null ? void 0 : _a.editor;
    return (_b = editor == null ? void 0 : editor.cm) == null ? void 0 : _b.coordsAtPos(editor == null ? void 0 : editor.posToOffset(editor == null ? void 0 : editor.getCursor()), -1);
  }
  registerClosePopoverListeners() {
    this.app.workspace.containerEl.addEventListener("keypress", this.close);
    this.app.workspace.containerEl.addEventListener("click", this.clickClose);
    if (this.cmEditor) {
      this.cmEditor.on("vim-keypress", this.close);
    }
    const scroller = this.getCmScroller();
    if (scroller) {
      scroller.addEventListener("scroll", this.close);
    }
  }
  unregisterClosePopoverListeners() {
    this.app.workspace.containerEl.removeEventListener("keypress", this.close);
    this.app.workspace.containerEl.removeEventListener("click", this.clickClose);
    if (this.cmEditor) {
      this.cmEditor.off("vim-keypress", this.close);
    }
    const scroller = this.getCmScroller();
    if (scroller) {
      scroller.removeEventListener("scroll", this.close);
    }
  }
  getCmScroller() {
    const scroller = document.getElementsByClassName("cm-scroller");
    if (scroller.length > 0) {
      return scroller[0];
    }
  }
  getPopoverElement() {
    return document.getElementById("definition-popover");
  }
};
function initDefinitionPopover(plugin) {
  if (definitionPopover) {
    definitionPopover.cleanUp();
  }
  definitionPopover = new DefinitionPopover(plugin);
}
function getDefinitionPopover() {
  return definitionPopover;
}

// src/globals.ts
function injectGlobals(settings) {
  var _a;
  window.NoteDefinition = {
    LOG_LEVEL: ((_a = window.NoteDefinition) == null ? void 0 : _a.LOG_LEVEL) || 1 /* Error */,
    definitions: {
      global: /* @__PURE__ */ new Map()
    },
    triggerDefPreview: (el) => {
      const word = el.getAttr("def");
      if (!word)
        return;
      const def = getDefFileManager().get(word);
      if (!def)
        return;
      const defPopover = getDefinitionPopover();
      let isOpen = false;
      if (el.onmouseenter) {
        const openPopover = setTimeout(() => {
          defPopover.openAtCoords(def, el.getBoundingClientRect());
        }, 200);
        el.onmouseleave = () => {
          if (!isOpen) {
            clearTimeout(openPopover);
          }
        };
        return;
      }
      defPopover.openAtCoords(def, el.getBoundingClientRect());
    },
    settings
  };
}

// src/editor/md-postprocessor.ts
var postProcessor = (element, context) => {
  const shouldRunPostProcessor = window.NoteDefinition.settings.enableInReadingView;
  if (!shouldRunPostProcessor) {
    return;
  }
  if (element.getAttr("ctx") === "def-popup") {
    return;
  }
  rebuildHTML(element);
};
var rebuildHTML = (parent) => {
  for (let i = 0; i < parent.childNodes.length; i++) {
    const childNode = parent.childNodes[i];
    if (childNode.nodeType === Node.TEXT_NODE && childNode.textContent) {
      if (childNode.textContent === "\n") {
        continue;
      }
      const lineScanner = new LineScanner();
      const currText = childNode.textContent;
      const phraseInfos = lineScanner.scanLine(currText);
      if (phraseInfos.length === 0) {
        continue;
      }
      phraseInfos.sort((a, b) => b.to - a.to);
      phraseInfos.sort((a, b) => a.from - b.from);
      let currCursor = 0;
      const newContainer = parent.createSpan();
      const addedMarks = [];
      phraseInfos.forEach((phraseInfo) => {
        if (phraseInfo.from < currCursor) {
          return;
        }
        newContainer.appendText(currText.slice(currCursor, phraseInfo.from));
        const attributes = getDecorationAttrs(phraseInfo.phrase);
        const span = newContainer.createSpan({
          cls: DEF_DECORATION_CLS,
          attr: attributes,
          text: currText.slice(phraseInfo.from, phraseInfo.to)
        });
        newContainer.appendChild(span);
        addedMarks.push({
          el: span,
          phraseInfo
        });
        currCursor = phraseInfo.to;
      });
      newContainer.appendText(currText.slice(currCursor));
      childNode.replaceWith(newContainer);
    }
    rebuildHTML(childNode);
  }
};

// src/main.ts
var NoteDefinition = class extends import_obsidian4.Plugin {
  constructor() {
    super(...arguments);
    this.activeEditorExtensions = [];
  }
  async onload() {
    const settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    injectGlobals(settings);
    logDebug("Load note definition plugin");
    initDefinitionPopover(this);
    this.defManager = initDefFileManager(this.app);
    this.registerCommands();
    this.registerEvents();
    this.registerEditorExtension(this.activeEditorExtensions);
    this.addSettingTab(new SettingsTab(this.app, this));
    this.registerMarkdownPostProcessor(postProcessor);
  }
  async saveSettings() {
    await this.saveData(window.NoteDefinition.settings);
  }
  registerCommands() {
    this.addCommand({
      id: "preview-definition",
      name: "Preview definition",
      editorCallback: (editor) => {
        const curWord = getMarkedWordUnderCursor(editor);
        if (!curWord)
          return;
        const def = window.NoteDefinition.definitions.global.get(curWord);
        if (!def)
          return;
        getDefinitionPopover().openAtCursor(def);
      }
    });
    this.addCommand({
      id: "goto-definition",
      name: "Go to definition",
      editorCallback: (editor) => {
        const currWord = getMarkedWordUnderCursor(editor);
        if (!currWord)
          return;
        const def = this.defManager.get(currWord);
        if (!def)
          return;
        this.app.workspace.openLinkText(def.linkText, "");
      }
    });
  }
  registerEvents() {
    this.registerEvent(this.app.workspace.on("active-leaf-change", async (leaf) => {
      if (!leaf)
        return;
      this.refreshDefinitions();
      this.registerEditorExts();
    }));
    this.registerEvent(this.app.workspace.on("editor-menu", (menu, editor) => {
      const curWord = getMarkedWordUnderCursor(editor);
      if (!curWord)
        return;
      const def = this.defManager.get(curWord);
      if (!def)
        return;
      this.registerMenuItems(menu, def);
    }));
  }
  registerMenuItems(menu, def) {
    menu.addItem((item) => {
      item.setTitle("Go to definition").setIcon("arrow-left-from-line").onClick(() => {
        this.app.workspace.openLinkText(def.linkText, "");
      });
    });
  }
  refreshDefinitions() {
    this.defManager.loadDefinitions();
  }
  registerEditorExts() {
    const currFile = this.app.workspace.getActiveFile();
    if (currFile && this.defManager.isDefFile(currFile)) {
      this.setActiveEditorExtensions([]);
    } else {
      this.setActiveEditorExtensions(definitionMarker);
    }
  }
  setActiveEditorExtensions(...ext) {
    this.activeEditorExtensions.length = 0;
    this.activeEditorExtensions.push(...ext);
    this.app.workspace.updateOptions();
  }
  onunload() {
    logDebug("Unload note definition plugin");
    getDefinitionPopover().cleanUp();
  }
};
