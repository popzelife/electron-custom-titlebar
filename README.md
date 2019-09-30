
# Electron Custom Titlebar [![NPM version](https://img.shields.io/npm/v/electron-custom-titlebar)](https://www.npmjs.com/package/electron-custom-titlebar)[![Issues](https://img.shields.io/github/issues/popzelife/electron-custom-titlebar)](https://github.com/popzelife/electron-custom-titlebar/issues)[![License](https://img.shields.io/npm/l/electron-custom-titlebar)](https://github.com/popzelife/electron-custom-titlebar/blob/master/LICENSE)

**Adds CSS-based UI title bars to any Electron-based desktop app.**
Fully customizable with menu implementation. Menu can be use as remote contextMenu from electron or stylized with CSS.

Initial fork from [electron-titlebar-windows](https://github.com/sidneys/electron-titlebar-windows), now as independent version.

Electron version supported : `^1.8.8 || ^4.2.11 || >=5.0.0`.

```
yarn add electron-custom-titlebar

npm install electron-custom-titlebar --save
```

![screen](https://raw.githubusercontent.com/popzelife/electron-custom-titlebar/master/screen.png)
![screen2](https://raw.githubusercontent.com/popzelife/electron-custom-titlebar/master/screen2.png)

## Table of Content

1. [Usage](#usage)
2. [API](#api)
3. [Contributing](#contributing)
4. [License](#license)

## Installation


## Usage

The module takes a single optional argument `options` and exports the `TitleBar` class:

```js
import ElectronTitlebar from 'electron-custom-titlebar';

const titlebar = new ElectronTitlebar({ ...options });
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

## API

#### #appendTo

Add titlebar to your HTML app page. If you use several webviews, you should add it to a persistent app page.

```js
titlebar.appendTo(contextElement);
```

 - (optional) **contextElement** - `HTMLElement` - Default: `document.body` - **Element to which to add the titlebar**
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

#### TODO

- Complete example project
- Include multi BrowserView support for better menu interaction (electron@^5)
- Better drag support with [electron-drag](https://www.npmjs.com/package/electron-drag)

## License

MIT © [popzelife](https://taurus.sh)

#### Related

Based on [sidneys](http://sidneys.github.io)
