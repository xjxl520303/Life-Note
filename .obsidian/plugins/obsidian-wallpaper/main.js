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
  default: () => Wallpaper
});
module.exports = __toCommonJS(main_exports);

// src/settings.ts
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  wallpaperId: "none"
};
var WallpaperSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h1", { text: "Wallpaper Board" });
    new import_obsidian.Setting(containerEl).setName("Wallpaper").setDesc("Choose a wallpaper").addDropdown((dropdown) => {
      dropdown.addOption("none", "None");
      dropdown.addOption("stars1", "Stars1");
      dropdown.addOption("stars2", "Stars2");
      dropdown.addOption("stars3", "Stars3");
      dropdown.addOption("skyandsea", "Sky and Sea");
      dropdown.addOption("campfire", "Campfire");
      dropdown.setValue(this.plugin.settings.wallpaperId);
      dropdown.onChange(async (value) => {
        if (value == this.plugin.settings.wallpaperId)
          return;
        this.plugin.paint(value);
        this.plugin.settings.wallpaperId = value;
        await this.plugin.saveSettings();
      });
    });
  }
};

// src/main.ts
var import_obsidian2 = require("obsidian");

// src/wallpaper/campfire.ts
function paintCampfire(plugin) {
  plugin.resetWallpaper();
  let wallpaper = plugin.containerEl.querySelector(".wallpaper");
  if (!wallpaper) {
    plugin.resetWallpaper();
    wallpaper = plugin.containerEl.querySelector(".wallpaper");
  }
  if (!wallpaper)
    return;
  wallpaper.classList.add("wallpaper-campfire");
  if (plugin.app.vault.getConfig("theme") === "obsidian") {
    plugin.app.setTheme("moonstone");
    plugin.app.vault.setConfig("theme", "moonstone");
    plugin.app.workspace.trigger("css-change");
  }
  const wrapper = wallpaper.createDiv("campfire-wrapper");
  wrapper.innerHTML = `
  <div class="tree-container-back">
			<div class="tree-8"></div>
			<div class="tree-9"></div>
			<div class="tree-10"></div>
		</div>
		<div class="rock-container">
			<div class="rock-big"></div>
			<div class="rock-small">
				<div class="rock-1"></div>
				<div class="rock-2"></div>
				<div class="rock-3"></div>
				<div class="rock-4"></div>
			</div>
		</div>
		<div class="smoke-container">
			<svg>
			<path d="M 150 0 Q 200 100 100 250 C 0 450 120 400 50 600  " />
		</svg>
			<div class="fire-container">

				<div class="flame-1"></div>
				<div class="flame-2"></div>
				<div class="flame-3"></div>
			</div>
		</div>
		<div class="tree-container-front">
			<div class="tree-1"></div>
			<div class="tree-2"></div>
			<div class="tree-3"></div>
			<div class="tree-4"></div>
			<div class="tree-5"></div>
			<div class="tree-6"></div>
			<div class="tree-7"></div>
		</div>
  `;
}

// src/wallpaper/skyandsea.ts
function paintSkyandSea(plugin) {
  plugin.resetWallpaper();
  let wallpaper = plugin.containerEl.querySelector(".wallpaper");
  if (!wallpaper) {
    plugin.resetWallpaper();
    wallpaper = plugin.containerEl.querySelector(".wallpaper");
  }
  if (!wallpaper)
    return;
  wallpaper.classList.add("wallpaper-skyandsea");
  if (plugin.app.vault.getConfig("theme") === "obsidian") {
    plugin.app.setTheme("moonstone");
    plugin.app.vault.setConfig("theme", "moonstone");
    plugin.app.workspace.trigger("css-change");
  }
  const sky = wallpaper.createDiv("sky");
  sky.createDiv();
  sky.createDiv();
  sky.createDiv();
  const sea = wallpaper.createDiv("sea");
  sea.createDiv("sun_set_sea");
  for (let i = 0; i < 29; i++) {
    sea.createDiv();
  }
  const mountain1 = wallpaper.createDiv("mountain1");
  const mountain2 = wallpaper.createDiv("mountain2");
  const mountain3 = wallpaper.createDiv("mountain3");
  mountain1.innerHTML = "<div></div><div></div>";
  mountain2.innerHTML = "<div></div><div></div>";
  mountain3.innerHTML = "<div></div><div></div>";
  const bird = wallpaper.createDiv("bird");
  bird.innerHTML = '<div class="bird1"><div></div><div></div><div></div></div><div class="bird2"><div></div><div></div><div></div></div><div class="bird3"><div></div><div></div><div></div></div>';
  const ship = wallpaper.createDiv("ship");
  ship.innerHTML = "<div></div><div></div><div></div>";
  const plane = wallpaper.createDiv("plane");
  plane.innerHTML = "<div></div><div></div><div></div>";
  wallpaper.createDiv("tree");
}

// src/wallpaper/stars1.ts
function paintStars1(plugin) {
  plugin.resetWallpaper();
  let wallpaper = plugin.containerEl.querySelector(".wallpaper");
  if (!wallpaper) {
    plugin.resetWallpaper();
    wallpaper = plugin.containerEl.querySelector(".wallpaper");
  }
  if (!wallpaper)
    return;
  wallpaper.classList.add("wallpaper-stars1");
  if (plugin.app.vault.getConfig("theme") === "moonstone") {
    plugin.app.setTheme("obsidian");
    plugin.app.vault.setConfig("theme", "obsidian");
    plugin.app.workspace.trigger("css-change");
  }
  wallpaper.createDiv("stars1");
  wallpaper.createDiv("stars2");
  wallpaper.createDiv("stars3");
}

// src/wallpaper/stars2.ts
function paintStars2(plugin) {
  plugin.resetWallpaper();
  let wallpaper = plugin.containerEl.querySelector(".wallpaper");
  if (!wallpaper) {
    plugin.resetWallpaper();
    wallpaper = plugin.containerEl.querySelector(".wallpaper");
  }
  if (!wallpaper)
    return;
  wallpaper.classList.add("wallpaper-stars2");
  if (plugin.app.vault.getConfig("theme") === "moonstone") {
    plugin.app.setTheme("obsidian");
    plugin.app.vault.setConfig("theme", "obsidian");
    plugin.app.workspace.trigger("css-change");
  }
  wallpaper.createDiv("stars");
  wallpaper.createDiv("stars1");
  wallpaper.createDiv("stars2");
  wallpaper.createDiv("shooting-stars");
}

// src/wallpaper/stars3.ts
function paintStars3(plugin) {
  plugin.resetWallpaper();
  let wallpaper = plugin.containerEl.querySelector(".wallpaper");
  if (!wallpaper) {
    plugin.resetWallpaper();
    wallpaper = plugin.containerEl.querySelector(".wallpaper");
  }
  if (!wallpaper)
    return;
  wallpaper.classList.add("wallpaper-stars3");
  const sky = wallpaper.createDiv("sky");
  if (plugin.app.vault.getConfig("theme") === "moonstone") {
    plugin.app.setTheme("obsidian");
    plugin.app.vault.setConfig("theme", "obsidian");
    plugin.app.workspace.trigger("css-change");
  }
  const Colors = ["#f5d76e", "#f7ca18", "#f4d03f", "#ececec", "#ecf0f1", "#a2ded0"];
  const numStars = 200;
  for (let i = 0; i < numStars; i++) {
    const color = Colors[Math.floor(Math.random() * Colors.length)];
    const star = sky.createSpan();
    star.style.left = Math.floor(Math.random() * 100) + "vw";
    star.style.top = Math.floor(Math.random() * 100) + "vh";
    star.style.width = Math.random() * 2 + "px";
    star.style.height = star.style.width;
    star.style.backgroundColor = color;
  }
  setTimeout(() => {
    sky.childNodes.forEach((star) => {
      star.style.top = Math.random() * 100 + "vh";
      star.style.left = Math.random() * 100 + "vw";
    });
  }, 1);
  setInterval(() => {
    sky.childNodes.forEach((star) => {
      star.style.top = Math.random() * 100 + "vh";
      star.style.left = Math.random() * 100 + "vw";
    });
  }, 1e5);
}

// src/wallpaper/wallpaperPainter.ts
var wallpaperPainter = class {
  constructor(plugin) {
    this.plugin = plugin;
    this.containerEl = plugin.containerEl;
    if (!this.containerEl)
      return;
  }
  // 每添加一张新壁纸，只需要在这里添加一个case即可，不需要修改主函数
  paint(id) {
    switch (id) {
      case "none":
        this.plugin.resetWallpaper();
        break;
      case "stars1":
        paintStars1(this.plugin);
        break;
      case "stars2":
        paintStars2(this.plugin);
        break;
      case "stars3":
        paintStars3(this.plugin);
        break;
      case "skyandsea":
        paintSkyandSea(this.plugin);
        break;
      case "campfire":
        paintCampfire(this.plugin);
        break;
      default:
        break;
    }
  }
};

// src/main.ts
var Wallpaper = class extends import_obsidian2.Plugin {
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new WallpaperSettingTab(this.app, this));
    this.initWallpaper();
    this.paint(this.settings.wallpaperId);
  }
  onunload() {
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  initWallpaper() {
    console.log("initWallpaper called");
    this.containerEl = document.querySelector(".app-container");
    if (!this.containerEl)
      return;
    this.containerEl.createDiv("wallpaper");
  }
  resetWallpaper() {
    console.log("resetWallpaper called");
    this.clearWallpaper();
    this.containerEl.createDiv("wallpaper");
  }
  clearWallpaper() {
    console.log("clearWallpaper called");
    if (!this.containerEl.querySelector(".wallpaper"))
      return;
    this.containerEl.removeChild(this.containerEl.querySelector(".wallpaper"));
  }
  paint(id) {
    console.log("paint called");
    this.resetWallpaper();
    const painter = new wallpaperPainter(this);
    painter.paint(id);
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vLi4vb2JzaWRpYW4td2FsbHBhcGVyL3NyYy9tYWluLnRzIiwgIi4uLy4uLy4uLy4uL29ic2lkaWFuLXdhbGxwYXBlci9zcmMvc2V0dGluZ3MudHMiLCAiLi4vLi4vLi4vLi4vb2JzaWRpYW4td2FsbHBhcGVyL3NyYy93YWxscGFwZXIvY2FtcGZpcmUudHMiLCAiLi4vLi4vLi4vLi4vb2JzaWRpYW4td2FsbHBhcGVyL3NyYy93YWxscGFwZXIvc2t5YW5kc2VhLnRzIiwgIi4uLy4uLy4uLy4uL29ic2lkaWFuLXdhbGxwYXBlci9zcmMvd2FsbHBhcGVyL3N0YXJzMS50cyIsICIuLi8uLi8uLi8uLi9vYnNpZGlhbi13YWxscGFwZXIvc3JjL3dhbGxwYXBlci9zdGFyczIudHMiLCAiLi4vLi4vLi4vLi4vb2JzaWRpYW4td2FsbHBhcGVyL3NyYy93YWxscGFwZXIvc3RhcnMzLnRzIiwgIi4uLy4uLy4uLy4uL29ic2lkaWFuLXdhbGxwYXBlci9zcmMvd2FsbHBhcGVyL3dhbGxwYXBlclBhaW50ZXIudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IERFRkFVTFRfU0VUVElOR1MsIFdhbGxwYXBlclNldHRpbmdUYWIsIFdhbGxwYXBlclNldHRpbmdzIH0gZnJvbSAnLi9zZXR0aW5ncyc7XG5cbmltcG9ydCB7IFBsdWdpbiB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB7IHdhbGxwYXBlclBhaW50ZXIgfSBmcm9tICcuL3dhbGxwYXBlci93YWxscGFwZXJQYWludGVyJztcblxuZGVjbGFyZSBtb2R1bGUgXCJvYnNpZGlhblwiIHtcblx0aW50ZXJmYWNlIEFwcCB7XG5cdFx0aXNNb2JpbGU6ICgpID0+IGJvb2xlYW47XG5cdFx0ZW11bGF0ZU1vYmlsZTogKHRvZ2dsZTogYm9vbGVhbikgPT4gdm9pZDtcblx0XHRzZXRUaGVtZTogKG1vZGU6IHN0cmluZykgPT4gdm9pZDsgLy8gZGFyayBtb2RlXG5cdFx0Y3VzdG9tQ3NzOiB7XG5cdFx0XHRzZXRUaGVtZTogKHRoZW1lOiBzdHJpbmcpID0+IHZvaWQ7IC8vIHNldHMgdGhlbWVcblx0XHRcdHRoZW1lOiBzdHJpbmc7IC8vIGdldCBjdXJyZW50IHRoZW1lXG5cdFx0XHR0aGVtZXM6IHVua25vd25bXTsgLy8gZ2V0IGluc3RhbGxlZCB0aGVtZXNcblx0XHRcdG9sZFRoZW1lczogc3RyaW5nW107IC8vIGdldCBsZWdhY3kgdGhlbWVzIChwcmlvciB0byAwLjE2KVxuXHRcdH07XG5cdFx0ZG9tOiB7XG5cdFx0XHRhcHBDb250YWluZXJFbDoge1xuXHRcdFx0XHRhZGRDbGFzczogKGNzc2NsYXNzOiBzdHJpbmcpID0+IHZvaWQ7XG5cdFx0XHRcdGNsYXNzTGlzdDoge1xuXHRcdFx0XHRcdHZhbHVlOiBzdHJpbmc7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHJlbW92ZUNsYXNzOiAoY3NzY2xhc3M6IHN0cmluZykgPT4gdm9pZDtcblx0XHRcdH07XG5cdFx0fTtcblx0fVxuXHRpbnRlcmZhY2UgVmF1bHQge1xuXHRcdHNldENvbmZpZzogKGNvbmZpZzogc3RyaW5nLCBuZXdWYWx1ZTogc3RyaW5nKSA9PiB2b2lkO1xuXHRcdGdldENvbmZpZzogKGNvbmZpZzogc3RyaW5nKSA9PiBzdHJpbmc7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2FsbHBhcGVyIGV4dGVuZHMgUGx1Z2luIHtcblx0c2V0dGluZ3M6IFdhbGxwYXBlclNldHRpbmdzO1xuICBjb250YWluZXJFbDogSFRNTEVsZW1lbnQ7XG5cblx0YXN5bmMgb25sb2FkKCkge1xuXG4gICAgYXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcbiAgICB0aGlzLmFkZFNldHRpbmdUYWIobmV3IFdhbGxwYXBlclNldHRpbmdUYWIodGhpcy5hcHAsIHRoaXMpKTtcbiAgICAgICAgXG4gICAgdGhpcy5pbml0V2FsbHBhcGVyKCk7XG4gICAgdGhpcy5wYWludCh0aGlzLnNldHRpbmdzLndhbGxwYXBlcklkKTtcbiAgfVxuXG5cdG9udW5sb2FkKCkge1xuXG5cdH1cblxuXHRhc3luYyBsb2FkU2V0dGluZ3MoKSB7XG5cdFx0dGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfU0VUVElOR1MsIGF3YWl0IHRoaXMubG9hZERhdGEoKSk7XG5cdH1cblxuXHRhc3luYyBzYXZlU2V0dGluZ3MoKSB7XG5cdFx0YXdhaXQgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcblx0fVxuXG4gIGluaXRXYWxscGFwZXIoKSB7XG4gICAgY29uc29sZS5sb2coXCJpbml0V2FsbHBhcGVyIGNhbGxlZFwiKVxuICAgIHRoaXMuY29udGFpbmVyRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmFwcC1jb250YWluZXJcIikgYXMgSFRNTEVsZW1lbnQ7XG4gICAgaWYgKCF0aGlzLmNvbnRhaW5lckVsKSByZXR1cm47XG4gICAgdGhpcy5jb250YWluZXJFbC5jcmVhdGVEaXYoXCJ3YWxscGFwZXJcIik7XG4gIH1cblxuICByZXNldFdhbGxwYXBlcigpIHtcbiAgICBjb25zb2xlLmxvZyhcInJlc2V0V2FsbHBhcGVyIGNhbGxlZFwiKVxuICAgIHRoaXMuY2xlYXJXYWxscGFwZXIoKTtcbiAgICB0aGlzLmNvbnRhaW5lckVsLmNyZWF0ZURpdihcIndhbGxwYXBlclwiKTtcbiAgfVxuXG4gIGNsZWFyV2FsbHBhcGVyKCkge1xuICAgIGNvbnNvbGUubG9nKFwiY2xlYXJXYWxscGFwZXIgY2FsbGVkXCIpXG4gICAgaWYgKCF0aGlzLmNvbnRhaW5lckVsLnF1ZXJ5U2VsZWN0b3IoXCIud2FsbHBhcGVyXCIpKSByZXR1cm47XG4gICAgdGhpcy5jb250YWluZXJFbC5yZW1vdmVDaGlsZCh0aGlzLmNvbnRhaW5lckVsLnF1ZXJ5U2VsZWN0b3IoXCIud2FsbHBhcGVyXCIpIGFzIEhUTUxFbGVtZW50KTtcbiAgfVxuXG4gIHBhaW50KGlkOiBzdHJpbmcpIHtcbiAgICBjb25zb2xlLmxvZyhcInBhaW50IGNhbGxlZFwiKVxuICAgIHRoaXMucmVzZXRXYWxscGFwZXIoKTtcbiAgICBjb25zdCBwYWludGVyID0gbmV3IHdhbGxwYXBlclBhaW50ZXIodGhpcyk7XG4gICAgcGFpbnRlci5wYWludChpZCk7XG4gIH1cbn1cblxuXG4iLCAiaW1wb3J0IHsgQXBwLCBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nIH0gZnJvbSAnb2JzaWRpYW4nO1xyXG5cclxuaW1wb3J0IFdhbGxwYXBlciBmcm9tICcuL21haW4nO1xyXG5cclxuaW50ZXJmYWNlIE9iamVjdEtleXMge1xyXG4gIFtrZXk6IHN0cmluZ106IGFueVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFdhbGxwYXBlclNldHRpbmdzIGV4dGVuZHMgT2JqZWN0S2V5cyB7XHJcbiAgd2FsbHBhcGVySWQ6IHN0cmluZztcclxuXHJcbn0gXHJcblxyXG5leHBvcnQgY29uc3QgREVGQVVMVF9TRVRUSU5HUzogV2FsbHBhcGVyU2V0dGluZ3MgPSB7XHJcbiAgd2FsbHBhcGVySWQ6IFwibm9uZVwiLFxyXG59XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFdhbGxwYXBlclNldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcclxuICBwbHVnaW46IFdhbGxwYXBlcjtcclxuICBcclxuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBXYWxscGFwZXIpIHtcclxuICAgIHN1cGVyKGFwcCwgcGx1Z2luKTtcclxuICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xyXG4gIH1cclxuXHJcbiAgZGlzcGxheSgpOiB2b2lkIHtcclxuICAgIGNvbnN0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XHJcbiAgICBjb250YWluZXJFbC5lbXB0eSgpO1xyXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoJ2gxJywgeyB0ZXh0OiAnV2FsbHBhcGVyIEJvYXJkJyB9KTtcclxuXHJcbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgLnNldE5hbWUoJ1dhbGxwYXBlcicpXHJcbiAgICAgIC5zZXREZXNjKCdDaG9vc2UgYSB3YWxscGFwZXInKVxyXG4gICAgICAuYWRkRHJvcGRvd24oZHJvcGRvd24gPT4ge1xyXG4gICAgICAgIGRyb3Bkb3duLmFkZE9wdGlvbihcIm5vbmVcIiwgXCJOb25lXCIpO1xyXG4gICAgICAgIGRyb3Bkb3duLmFkZE9wdGlvbihcInN0YXJzMVwiLCBcIlN0YXJzMVwiKTtcclxuICAgICAgICBkcm9wZG93bi5hZGRPcHRpb24oXCJzdGFyczJcIiwgXCJTdGFyczJcIik7XHJcbiAgICAgICAgZHJvcGRvd24uYWRkT3B0aW9uKFwic3RhcnMzXCIsIFwiU3RhcnMzXCIpO1xyXG4gICAgICAgIGRyb3Bkb3duLmFkZE9wdGlvbihcInNreWFuZHNlYVwiLCBcIlNreSBhbmQgU2VhXCIpO1xyXG4gICAgICAgIGRyb3Bkb3duLmFkZE9wdGlvbihcImNhbXBmaXJlXCIsIFwiQ2FtcGZpcmVcIik7XHJcbiAgICAgICAgZHJvcGRvd24uc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Mud2FsbHBhcGVySWQpO1xyXG4gICAgICAgIGRyb3Bkb3duLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgaWYgKHZhbHVlID09IHRoaXMucGx1Z2luLnNldHRpbmdzLndhbGxwYXBlcklkKSByZXR1cm47XHJcbiAgICAgICAgICB0aGlzLnBsdWdpbi5wYWludCh2YWx1ZSk7XHJcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy53YWxscGFwZXJJZCA9IHZhbHVlO1xyXG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBcclxuICB9XHJcbn1cclxuIiwgImltcG9ydCBXYWxscGFwZXIgZnJvbSBcInNyYy9tYWluXCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcGFpbnRDYW1wZmlyZShwbHVnaW46IFdhbGxwYXBlcikge1xyXG4gIHBsdWdpbi5yZXNldFdhbGxwYXBlcigpO1xyXG4gIGxldCB3YWxscGFwZXIgPSBwbHVnaW4uY29udGFpbmVyRWwucXVlcnlTZWxlY3RvcignLndhbGxwYXBlcicpO1xyXG4gIGlmICghd2FsbHBhcGVyKSB7XHJcbiAgICBwbHVnaW4ucmVzZXRXYWxscGFwZXIoKTtcclxuICAgIHdhbGxwYXBlciA9IHBsdWdpbi5jb250YWluZXJFbC5xdWVyeVNlbGVjdG9yKCcud2FsbHBhcGVyJyk7XHJcbiAgfVxyXG4gIC8vIFx1N0VEOSB3YWxscGFwZXIgXHU2REZCXHU1MkEwXHU0RTAwXHU0RTJBXHU3QzdCXHJcbiAgaWYgKCF3YWxscGFwZXIpIHJldHVybjtcclxuICB3YWxscGFwZXIuY2xhc3NMaXN0LmFkZChcIndhbGxwYXBlci1jYW1wZmlyZVwiKTtcclxuXHJcbiAgLy8gU2V0IHRoZW1lIHRvIGxpZ2h0IG1vZGVcclxuICBpZiAocGx1Z2luLmFwcC52YXVsdC5nZXRDb25maWcoXCJ0aGVtZVwiKSA9PT0gXCJvYnNpZGlhblwiKSB7XHJcbiAgICBwbHVnaW4uYXBwLnNldFRoZW1lKFwibW9vbnN0b25lXCIpO1xyXG4gICAgcGx1Z2luLmFwcC52YXVsdC5zZXRDb25maWcoXCJ0aGVtZVwiLCBcIm1vb25zdG9uZVwiKTtcclxuICAgIHBsdWdpbi5hcHAud29ya3NwYWNlLnRyaWdnZXIoXCJjc3MtY2hhbmdlXCIpO1xyXG4gIH1cclxuXHJcbiAgY29uc3Qgd3JhcHBlciA9IHdhbGxwYXBlci5jcmVhdGVEaXYoXCJjYW1wZmlyZS13cmFwcGVyXCIpO1xyXG4gIHdyYXBwZXIuaW5uZXJIVE1MID0gYFxyXG4gIDxkaXYgY2xhc3M9XCJ0cmVlLWNvbnRhaW5lci1iYWNrXCI+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJ0cmVlLThcIj48L2Rpdj5cclxuXHRcdFx0PGRpdiBjbGFzcz1cInRyZWUtOVwiPjwvZGl2PlxyXG5cdFx0XHQ8ZGl2IGNsYXNzPVwidHJlZS0xMFwiPjwvZGl2PlxyXG5cdFx0PC9kaXY+XHJcblx0XHQ8ZGl2IGNsYXNzPVwicm9jay1jb250YWluZXJcIj5cclxuXHRcdFx0PGRpdiBjbGFzcz1cInJvY2stYmlnXCI+PC9kaXY+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJyb2NrLXNtYWxsXCI+XHJcblx0XHRcdFx0PGRpdiBjbGFzcz1cInJvY2stMVwiPjwvZGl2PlxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJyb2NrLTJcIj48L2Rpdj5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwicm9jay0zXCI+PC9kaXY+XHJcblx0XHRcdFx0PGRpdiBjbGFzcz1cInJvY2stNFwiPjwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdDwvZGl2PlxyXG5cdFx0PGRpdiBjbGFzcz1cInNtb2tlLWNvbnRhaW5lclwiPlxyXG5cdFx0XHQ8c3ZnPlxyXG5cdFx0XHQ8cGF0aCBkPVwiTSAxNTAgMCBRIDIwMCAxMDAgMTAwIDI1MCBDIDAgNDUwIDEyMCA0MDAgNTAgNjAwICBcIiAvPlxyXG5cdFx0PC9zdmc+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJmaXJlLWNvbnRhaW5lclwiPlxyXG5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZmxhbWUtMVwiPjwvZGl2PlxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJmbGFtZS0yXCI+PC9kaXY+XHJcblx0XHRcdFx0PGRpdiBjbGFzcz1cImZsYW1lLTNcIj48L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQ8L2Rpdj5cclxuXHRcdDxkaXYgY2xhc3M9XCJ0cmVlLWNvbnRhaW5lci1mcm9udFwiPlxyXG5cdFx0XHQ8ZGl2IGNsYXNzPVwidHJlZS0xXCI+PC9kaXY+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJ0cmVlLTJcIj48L2Rpdj5cclxuXHRcdFx0PGRpdiBjbGFzcz1cInRyZWUtM1wiPjwvZGl2PlxyXG5cdFx0XHQ8ZGl2IGNsYXNzPVwidHJlZS00XCI+PC9kaXY+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJ0cmVlLTVcIj48L2Rpdj5cclxuXHRcdFx0PGRpdiBjbGFzcz1cInRyZWUtNlwiPjwvZGl2PlxyXG5cdFx0XHQ8ZGl2IGNsYXNzPVwidHJlZS03XCI+PC9kaXY+XHJcblx0XHQ8L2Rpdj5cclxuICBgXHJcblxyXG59IiwgImltcG9ydCBXYWxscGFwZXIgZnJvbSBcInNyYy9tYWluXCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcGFpbnRTa3lhbmRTZWEocGx1Z2luOiBXYWxscGFwZXIpIHtcclxuICBwbHVnaW4ucmVzZXRXYWxscGFwZXIoKTtcclxuICBsZXQgd2FsbHBhcGVyID0gcGx1Z2luLmNvbnRhaW5lckVsLnF1ZXJ5U2VsZWN0b3IoJy53YWxscGFwZXInKTtcclxuICBpZiAoIXdhbGxwYXBlcikge1xyXG4gICAgcGx1Z2luLnJlc2V0V2FsbHBhcGVyKCk7XHJcbiAgICB3YWxscGFwZXIgPSBwbHVnaW4uY29udGFpbmVyRWwucXVlcnlTZWxlY3RvcignLndhbGxwYXBlcicpO1xyXG4gIH1cclxuICAvLyBcdTdFRDkgd2FsbHBhcGVyIFx1NkRGQlx1NTJBMFx1NEUwMFx1NEUyQVx1N0M3QlxyXG4gIGlmICghd2FsbHBhcGVyKSByZXR1cm47XHJcbiAgd2FsbHBhcGVyLmNsYXNzTGlzdC5hZGQoXCJ3YWxscGFwZXItc2t5YW5kc2VhXCIpO1xyXG5cclxuICAvLyBTZXQgdGhlbWUgdG8gbGlnaHQgbW9kZVxyXG4gIGlmIChwbHVnaW4uYXBwLnZhdWx0LmdldENvbmZpZyhcInRoZW1lXCIpID09PSBcIm9ic2lkaWFuXCIpIHtcclxuICAgIHBsdWdpbi5hcHAuc2V0VGhlbWUoXCJtb29uc3RvbmVcIik7XHJcbiAgICBwbHVnaW4uYXBwLnZhdWx0LnNldENvbmZpZyhcInRoZW1lXCIsIFwibW9vbnN0b25lXCIpO1xyXG4gICAgcGx1Z2luLmFwcC53b3Jrc3BhY2UudHJpZ2dlcihcImNzcy1jaGFuZ2VcIik7XHJcbiAgfVxyXG4gIFxyXG4gIC8vIGNyZWF0ZSBza3lcclxuICBjb25zdCBza3kgPSB3YWxscGFwZXIuY3JlYXRlRGl2KFwic2t5XCIpO1xyXG4gIHNreS5jcmVhdGVEaXYoKTtcclxuICBza3kuY3JlYXRlRGl2KCk7XHJcbiAgc2t5LmNyZWF0ZURpdigpO1xyXG5cclxuICAvLyBjcmVhdGUgc2VhXHJcbiAgY29uc3Qgc2VhID0gd2FsbHBhcGVyLmNyZWF0ZURpdihcInNlYVwiKTtcclxuICBzZWEuY3JlYXRlRGl2KFwic3VuX3NldF9zZWFcIik7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAyOTsgaSsrKSB7XHJcbiAgICBzZWEuY3JlYXRlRGl2KCk7XHJcbiAgfVxyXG4gIFxyXG4gIC8vIGNyZWF0ZSBtb3VudGFpblxyXG4gIGNvbnN0IG1vdW50YWluMSA9IHdhbGxwYXBlci5jcmVhdGVEaXYoXCJtb3VudGFpbjFcIik7XHJcbiAgY29uc3QgbW91bnRhaW4yID0gd2FsbHBhcGVyLmNyZWF0ZURpdihcIm1vdW50YWluMlwiKTtcclxuICBjb25zdCBtb3VudGFpbjMgPSB3YWxscGFwZXIuY3JlYXRlRGl2KFwibW91bnRhaW4zXCIpO1xyXG4gIG1vdW50YWluMS5pbm5lckhUTUwgPSAnPGRpdj48L2Rpdj48ZGl2PjwvZGl2Pic7XHJcbiAgbW91bnRhaW4yLmlubmVySFRNTCA9ICc8ZGl2PjwvZGl2PjxkaXY+PC9kaXY+JztcclxuICBtb3VudGFpbjMuaW5uZXJIVE1MID0gJzxkaXY+PC9kaXY+PGRpdj48L2Rpdj4nO1xyXG5cclxuICAvLyBjcmVhdGUgYmlyZFxyXG4gIGNvbnN0IGJpcmQgPSB3YWxscGFwZXIuY3JlYXRlRGl2KFwiYmlyZFwiKTtcclxuICBiaXJkLmlubmVySFRNTCA9ICc8ZGl2IGNsYXNzPVwiYmlyZDFcIj48ZGl2PjwvZGl2PjxkaXY+PC9kaXY+PGRpdj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwiYmlyZDJcIj48ZGl2PjwvZGl2PjxkaXY+PC9kaXY+PGRpdj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwiYmlyZDNcIj48ZGl2PjwvZGl2PjxkaXY+PC9kaXY+PGRpdj48L2Rpdj48L2Rpdj4nO1xyXG4gIFxyXG4gIC8vIGNyZWF0ZSBzaGlwXHJcbiAgY29uc3Qgc2hpcCA9IHdhbGxwYXBlci5jcmVhdGVEaXYoXCJzaGlwXCIpO1xyXG4gIHNoaXAuaW5uZXJIVE1MID0gJzxkaXY+PC9kaXY+PGRpdj48L2Rpdj48ZGl2PjwvZGl2Pic7XHJcbiAgXHJcbiAgLy8gY3JlYXRlIHBsYW5lXHJcbiAgY29uc3QgcGxhbmUgPSB3YWxscGFwZXIuY3JlYXRlRGl2KFwicGxhbmVcIik7XHJcbiAgcGxhbmUuaW5uZXJIVE1MID0gJzxkaXY+PC9kaXY+PGRpdj48L2Rpdj48ZGl2PjwvZGl2Pic7XHJcblxyXG4gIHdhbGxwYXBlci5jcmVhdGVEaXYoXCJ0cmVlXCIpO1xyXG59IiwgImltcG9ydCBXYWxscGFwZXIgZnJvbSAnLi4vbWFpbic7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcGFpbnRTdGFyczEocGx1Z2luOiBXYWxscGFwZXIpIHtcclxuICBwbHVnaW4ucmVzZXRXYWxscGFwZXIoKTtcclxuICBsZXQgd2FsbHBhcGVyID0gcGx1Z2luLmNvbnRhaW5lckVsLnF1ZXJ5U2VsZWN0b3IoJy53YWxscGFwZXInKTtcclxuICBpZiAoIXdhbGxwYXBlcikge1xyXG4gICAgcGx1Z2luLnJlc2V0V2FsbHBhcGVyKCk7XHJcbiAgICB3YWxscGFwZXIgPSBwbHVnaW4uY29udGFpbmVyRWwucXVlcnlTZWxlY3RvcignLndhbGxwYXBlcicpO1xyXG4gIH1cclxuICAvLyBcdTdFRDkgd2FsbHBhcGVyIFx1NkRGQlx1NTJBMFx1NEUwMFx1NEUyQVx1N0M3QlxyXG4gIGlmICghd2FsbHBhcGVyKSByZXR1cm47XHJcbiAgd2FsbHBhcGVyLmNsYXNzTGlzdC5hZGQoXCJ3YWxscGFwZXItc3RhcnMxXCIpO1xyXG5cclxuICAvLyBTZXQgdGhlbWUgdG8gZGFyayBtb2RlXHJcbiAgaWYgKHBsdWdpbi5hcHAudmF1bHQuZ2V0Q29uZmlnKFwidGhlbWVcIikgPT09IFwibW9vbnN0b25lXCIpIHtcclxuICAgIHBsdWdpbi5hcHAuc2V0VGhlbWUoXCJvYnNpZGlhblwiKTtcclxuICAgIHBsdWdpbi5hcHAudmF1bHQuc2V0Q29uZmlnKFwidGhlbWVcIiwgXCJvYnNpZGlhblwiKTtcclxuICAgIHBsdWdpbi5hcHAud29ya3NwYWNlLnRyaWdnZXIoXCJjc3MtY2hhbmdlXCIpO1xyXG4gIH1cclxuXHJcbiAgLy8gY3JlYXRlIHN0YXJzXHJcbiAgXHJcbiAgd2FsbHBhcGVyLmNyZWF0ZURpdihcInN0YXJzMVwiKTtcclxuICB3YWxscGFwZXIuY3JlYXRlRGl2KFwic3RhcnMyXCIpO1xyXG4gIHdhbGxwYXBlci5jcmVhdGVEaXYoXCJzdGFyczNcIik7XHJcbiAgXHJcbn0iLCAiaW1wb3J0IFdhbGxwYXBlciBmcm9tIFwic3JjL21haW5cIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwYWludFN0YXJzMihwbHVnaW46IFdhbGxwYXBlcikge1xyXG4gIHBsdWdpbi5yZXNldFdhbGxwYXBlcigpO1xyXG4gIGxldCB3YWxscGFwZXIgPSBwbHVnaW4uY29udGFpbmVyRWwucXVlcnlTZWxlY3RvcignLndhbGxwYXBlcicpO1xyXG4gIGlmICghd2FsbHBhcGVyKSB7XHJcbiAgICBwbHVnaW4ucmVzZXRXYWxscGFwZXIoKTtcclxuICAgIHdhbGxwYXBlciA9IHBsdWdpbi5jb250YWluZXJFbC5xdWVyeVNlbGVjdG9yKCcud2FsbHBhcGVyJyk7XHJcbiAgfVxyXG4gIC8vIFx1N0VEOSB3YWxscGFwZXIgXHU2REZCXHU1MkEwXHU0RTAwXHU0RTJBXHU3QzdCXHJcbiAgaWYgKCF3YWxscGFwZXIpIHJldHVybjtcclxuICB3YWxscGFwZXIuY2xhc3NMaXN0LmFkZChcIndhbGxwYXBlci1zdGFyczJcIik7XHJcblxyXG4gIC8vIFNldCB0aGVtZSB0byBkYXJrIG1vZGVcclxuICBpZiAocGx1Z2luLmFwcC52YXVsdC5nZXRDb25maWcoXCJ0aGVtZVwiKSA9PT0gXCJtb29uc3RvbmVcIikge1xyXG4gICAgcGx1Z2luLmFwcC5zZXRUaGVtZShcIm9ic2lkaWFuXCIpO1xyXG4gICAgcGx1Z2luLmFwcC52YXVsdC5zZXRDb25maWcoXCJ0aGVtZVwiLCBcIm9ic2lkaWFuXCIpO1xyXG4gICAgcGx1Z2luLmFwcC53b3Jrc3BhY2UudHJpZ2dlcihcImNzcy1jaGFuZ2VcIik7XHJcbiAgfVxyXG5cclxuICAvLyBjcmVhdGUgc3RhcnNcclxuICB3YWxscGFwZXIuY3JlYXRlRGl2KFwic3RhcnNcIik7XHJcbiAgd2FsbHBhcGVyLmNyZWF0ZURpdihcInN0YXJzMVwiKTtcclxuICB3YWxscGFwZXIuY3JlYXRlRGl2KFwic3RhcnMyXCIpO1xyXG4gIHdhbGxwYXBlci5jcmVhdGVEaXYoXCJzaG9vdGluZy1zdGFyc1wiKTtcclxuXHJcbn0iLCAiaW1wb3J0IFdhbGxwYXBlciBmcm9tIFwic3JjL21haW5cIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwYWludFN0YXJzMyhwbHVnaW46IFdhbGxwYXBlcikge1xyXG4gIHBsdWdpbi5yZXNldFdhbGxwYXBlcigpO1xyXG4gIGxldCB3YWxscGFwZXIgPSBwbHVnaW4uY29udGFpbmVyRWwucXVlcnlTZWxlY3RvcignLndhbGxwYXBlcicpO1xyXG4gIGlmICghd2FsbHBhcGVyKSB7XHJcbiAgICBwbHVnaW4ucmVzZXRXYWxscGFwZXIoKTtcclxuICAgIHdhbGxwYXBlciA9IHBsdWdpbi5jb250YWluZXJFbC5xdWVyeVNlbGVjdG9yKCcud2FsbHBhcGVyJyk7XHJcbiAgfVxyXG4gIC8vIFx1N0VEOSB3YWxscGFwZXIgXHU2REZCXHU1MkEwXHU0RTAwXHU0RTJBXHU3QzdCXHJcbiAgaWYgKCF3YWxscGFwZXIpIHJldHVybjtcclxuICB3YWxscGFwZXIuY2xhc3NMaXN0LmFkZChcIndhbGxwYXBlci1zdGFyczNcIik7XHJcbiAgY29uc3Qgc2t5ID0gd2FsbHBhcGVyLmNyZWF0ZURpdihcInNreVwiKTtcclxuXHJcbiAgLy8gU2V0IHRoZW1lIHRvIGRhcmsgbW9kZVxyXG4gIGlmIChwbHVnaW4uYXBwLnZhdWx0LmdldENvbmZpZyhcInRoZW1lXCIpID09PSBcIm1vb25zdG9uZVwiKSB7XHJcbiAgICBwbHVnaW4uYXBwLnNldFRoZW1lKFwib2JzaWRpYW5cIik7XHJcbiAgICBwbHVnaW4uYXBwLnZhdWx0LnNldENvbmZpZyhcInRoZW1lXCIsIFwib2JzaWRpYW5cIik7XHJcbiAgICBwbHVnaW4uYXBwLndvcmtzcGFjZS50cmlnZ2VyKFwiY3NzLWNoYW5nZVwiKTtcclxuICB9XHJcblxyXG4gIC8vIGNyZWF0ZSBzdGFyc1xyXG4gIGNvbnN0IENvbG9ycyA9IFtcIiNmNWQ3NmVcIiwgXCIjZjdjYTE4XCIsIFwiI2Y0ZDAzZlwiLCBcIiNlY2VjZWNcIiwgXCIjZWNmMGYxXCIsIFwiI2EyZGVkMFwiXTtcclxuICBjb25zdCBudW1TdGFycyA9IDIwMDtcclxuICBcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVN0YXJzOyBpKyspIHtcclxuICAgIGNvbnN0IGNvbG9yID0gQ29sb3JzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIENvbG9ycy5sZW5ndGgpXTtcclxuICAgIGNvbnN0IHN0YXIgPSBza3kuY3JlYXRlU3BhbigpO1xyXG4gICAgc3Rhci5zdHlsZS5sZWZ0ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKSArIFwidndcIjtcclxuICAgIHN0YXIuc3R5bGUudG9wID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKSArIFwidmhcIjtcclxuICAgIHN0YXIuc3R5bGUud2lkdGggPSBNYXRoLnJhbmRvbSgpICogMiArIFwicHhcIjtcclxuICAgIHN0YXIuc3R5bGUuaGVpZ2h0ID0gc3Rhci5zdHlsZS53aWR0aDtcclxuICAgIHN0YXIuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3I7XHJcbiAgfVxyXG5cclxuICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgIHNreS5jaGlsZE5vZGVzLmZvckVhY2goKHN0YXI6IEhUTUxFbGVtZW50KSA9PiB7XHJcbiAgICAgIHN0YXIuc3R5bGUudG9wID0gTWF0aC5yYW5kb20oKSAqIDEwMCArIFwidmhcIjtcclxuICAgICAgc3Rhci5zdHlsZS5sZWZ0ID0gTWF0aC5yYW5kb20oKSAqIDEwMCArIFwidndcIjtcclxuICAgIH0pO1xyXG4gIH0sIDEpO1xyXG4gIFxyXG4gIHNldEludGVydmFsKCgpID0+IHtcclxuICAgIHNreS5jaGlsZE5vZGVzLmZvckVhY2goKHN0YXI6IEhUTUxFbGVtZW50KSA9PiB7XHJcbiAgICAgIHN0YXIuc3R5bGUudG9wID0gTWF0aC5yYW5kb20oKSAqIDEwMCArIFwidmhcIjtcclxuICAgICAgc3Rhci5zdHlsZS5sZWZ0ID0gTWF0aC5yYW5kb20oKSAqIDEwMCArIFwidndcIjtcclxuICAgIH0pO1xyXG4gIH0sIDEwMDAwMCk7XHJcbn0iLCAiaW1wb3J0IFdhbGxwYXBlciBmcm9tIFwic3JjL21haW5cIjtcclxuaW1wb3J0IHsgcGFpbnRDYW1wZmlyZSB9IGZyb20gXCIuL2NhbXBmaXJlXCI7XHJcbmltcG9ydCB7IHBhaW50U2t5YW5kU2VhIH0gZnJvbSBcIi4vc2t5YW5kc2VhXCI7XHJcbmltcG9ydCB7IHBhaW50U3RhcnMxIH0gZnJvbSBcIi4vc3RhcnMxXCI7XHJcbmltcG9ydCB7IHBhaW50U3RhcnMyIH0gZnJvbSBcIi4vc3RhcnMyXCI7XHJcbmltcG9ydCB7IHBhaW50U3RhcnMzIH0gZnJvbSBcIi4vc3RhcnMzXCI7XHJcblxyXG5leHBvcnQgY2xhc3Mgd2FsbHBhcGVyUGFpbnRlciB7XHJcbiAgcGx1Z2luOiBXYWxscGFwZXI7XHJcbiAgY29udGFpbmVyRWw6IEhUTUxFbGVtZW50O1xyXG4gIFxyXG4gIGNvbnN0cnVjdG9yKHBsdWdpbjogV2FsbHBhcGVyKSB7XHJcbiAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcclxuICAgIHRoaXMuY29udGFpbmVyRWwgPSBwbHVnaW4uY29udGFpbmVyRWw7XHJcbiAgICBpZiAoIXRoaXMuY29udGFpbmVyRWwpIHJldHVybjtcclxuICB9XHJcblxyXG4gIC8vIFx1NkJDRlx1NkRGQlx1NTJBMFx1NEUwMFx1NUYyMFx1NjVCMFx1NThDMVx1N0VCOFx1RkYwQ1x1NTNFQVx1OTcwMFx1ODk4MVx1NTcyOFx1OEZEOVx1OTFDQ1x1NkRGQlx1NTJBMFx1NEUwMFx1NEUyQWNhc2VcdTUzNzNcdTUzRUZcdUZGMENcdTRFMERcdTk3MDBcdTg5ODFcdTRGRUVcdTY1MzlcdTRFM0JcdTUxRkRcdTY1NzBcclxuICBwYWludChpZDogc3RyaW5nKSB7XHJcbiAgICBzd2l0Y2ggKGlkKSB7XHJcbiAgICAgIGNhc2UgXCJub25lXCI6XHJcbiAgICAgICAgdGhpcy5wbHVnaW4ucmVzZXRXYWxscGFwZXIoKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBcInN0YXJzMVwiOlxyXG4gICAgICAgIHBhaW50U3RhcnMxKHRoaXMucGx1Z2luKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBcInN0YXJzMlwiOlxyXG4gICAgICAgIHBhaW50U3RhcnMyKHRoaXMucGx1Z2luKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBcInN0YXJzM1wiOlxyXG4gICAgICAgIHBhaW50U3RhcnMzKHRoaXMucGx1Z2luKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBcInNreWFuZHNlYVwiOlxyXG4gICAgICAgIHBhaW50U2t5YW5kU2VhKHRoaXMucGx1Z2luKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBcImNhbXBmaXJlXCI6XHJcbiAgICAgICAgcGFpbnRDYW1wZmlyZSh0aGlzLnBsdWdpbik7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG59Il0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7O0FDQUEsc0JBQStDO0FBYXhDLElBQU0sbUJBQXNDO0FBQUEsRUFDakQsYUFBYTtBQUNmO0FBR08sSUFBTSxzQkFBTixjQUFrQyxpQ0FBaUI7QUFBQSxFQUd4RCxZQUFZLEtBQVUsUUFBbUI7QUFDdkMsVUFBTSxL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
