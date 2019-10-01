
# Electron Custom Titlebar [![NPM version](https://img.shields.io/npm/v/electron-custom-titlebar)](https://www.npmjs.com/package/electron-custom-titlebar)[![Issues](https://img.shields.io/github/issues/popzelife/electron-custom-titlebar)](https://github.com/popzelife/electron-custom-titlebar/issues)[![License](https://img.shields.io/npm/l/electron-custom-titlebar)](https://github.com/popzelife/electron-custom-titlebar/blob/master/LICENSE)

**Adds CSS-based UI title bars to any Electron-based desktop app.** Lightweight and customizable with menu implementation like VS Code. Menu can be use as remote contextMenu from electron or stylized with CSS.

Initial fork from [electron-titlebar-windows](https://github.com/sidneys/electron-titlebar-windows), now as independent version.

Electron version supported : `^1.8.8 || ^4.2.11 || >=5.0.0`.

```
yarn add electron-custom-titlebar

npm install electron-custom-titlebar --save
```

#### macOS
![screen](https://raw.githubusercontent.com/popzelife/electron-custom-titlebar/master/screen.png)
#### Windows
![screen2](https://raw.githubusercontent.com/popzelife/electron-custom-titlebar/master/screen2.png)

## Table of Content

1. [Usage](#usage)
2. [API](#api)
3. [Contributing](#contributing)
4. [Usecases](#usecases)
5. [License](#license)

## Installation


## Usage

The module takes a single optional argument `options` and exports the `TitleBar` class:

```js
import ElectronTitlebar from 'electron-custom-titlebar';

const titlebar = new ElectronTitlebar({ ...options });

const contextElement = document.querySelector('#titlebarRegion');
titlebar.appendTo(contextElement);

// Dispatch control actions to currentWindow
titlebar.on('close', () => { remote.getCurrentWindow().close(); });
titlebar.on('fullscreen', () => { remote.getCurrentWindow().maximize(); });
titlebar.on('minimize', () => { remote.getCurrentWindow().minimize(); });
titlebar.on('maximize', () => { remote.getCurrentWindow().restore(); });

// Update menu when electron contextMenu has changed
// menus files handle template and actions for app
const { menus } = remote.require('./main');

menus.on('update', () => {
    const updatedMenu = menus.getMenuTemplate();
    titlebar.update({ ...titlebar.options, menu: updatedMenu });
});
```

```html
<body>
    <div id="titlebarRegion" style="position: absolute; top: 0; left: 0; width: 100%; z-index: 5"></div>
    <div id="app"></div>
</body>
```

Properties of `options`:
 - (optional) **darkMode** - `String` - **Light titlebar buttons (for dark backgrounds)**
 - (optional) **color** - `String` - **Icon color (Hex)**
 - (optional) **backgroundColor** - `String` - **Bar color (Hex)**
 - (optional) **draggable** - `Boolean` - **Titlebar enables dragging of contained window**
 - (optional) **fullscreen** - `Boolean` - **Resize button initializes in fullscreen mode**
 - (optional) **title** - `String` - **The app name shown to the left of the menu items**
 - (optional) **icon** - `String` - **The app icon shown on the top left**
 - (optional) **menu** - `Object` - **The array of menu items following the Electron Menu Object Documentation/Template**
 - (optional) **onDoubleClick** - `Boolean` - **Double clicking on titlebar enable to resize window in fullscreen mode. Default to false**
 - (optional) **contextMenu** - `Boolean` - **Use internal contextMenu of Electron. Useful if using browserView. Default to false**

*Note:* with a remote contextMenu, there are some UI limitations. Once user first clicked on a tile and context menu opened, the main thread is hanged and user should reclick on an other tile to open the new menu options. 

## API

#### #appendTo

Add titlebar to your HTML app page. If you use several webviews, you should add it to a persistent app page.

The contextElement argument is your Titlebar region, letting you should where you want to place it.

```js
titlebar.appendTo(contextElement);
```

 - (optional) **contextElement** - `HTMLElement` - Default: `document.body` creating a context element with position absolute top left, width 100% and z-index 9999 - **Element to which to add the titlebar**
 - **Returns** - Titlebar

#### #update

Update the Title Bar. Useful to handle Electron `Menu.on('update', () => titlebar.update(menu))`.

```js
titlebar.update(options);
```

 - **options** - `Object` - default to previous configuration - **Titlebar Configuration**
 - **Returns** - Titlebar

#### #destroy

Removes the Title Bar.

```js
titlebar.destroy();
```

#### Events

`TitleBar` emits the following events:

- `minimize`
- `maximize`
- `fullscreen`
- `close`

```js
titlebar.on('close', function(e) {
    console.log('close');
});
```

## Contributing

Fork this project and make a new PR to start contributing to this project. Here are some example how to contribute.

#### CORE FEATURES

- [ ] Responsive on X axis with menu position and width
- [ ] Handle checked items

#### IMPROVEMENTS

- [ ] Include multi BrowserView support for better menu interaction (electron@^5)
- [ ] Better drag support with [electron-drag](https://www.npmjs.com/package/electron-drag)

#### DOCUMENTATION

- [ ] Complete example project

## Usecases
<a href="https://www.talkspirit.com/desktop"><img title="Talkspirit App Desktop" src="https://www.talkspirit.com/images/logo_talkspirit.png" alt="Talkspirit App Desktop" height="25"/></a>


Feel free to add yours, making a PR.

## License

MIT © [popzelife](https://taurus.sh)

#### Related

Based on [sidneys](http://sidneys.github.io)
