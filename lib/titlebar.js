'use strict';

/**
 * Modules
 * Node
 * @constant
 */
const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

/**
 * Modules
 * External
 * @constant
 */
const defaultCss = require('defaultcss');
const domify = require('domify');
const Menu = require('electron').remote.Menu;
const getCurrentWindow = require('electron').remote.getCurrentWindow;

/**
 * Filesystem
 * @constant
 * @default
 */
const titlebarStylesheet = fs.readFileSync(path.join(__dirname, '..', 'css', 'titlebar.css'), 'utf-8');
const titlebarView = fs.readFileSync(path.join(__dirname, '..', 'html', 'titlebar.html'), 'utf-8');

/**
 * Title Bar
 * @class TitleBar
 * @extends EventEmitter
 */
class TitleBar extends EventEmitter {
    /**
     * Create the Title bar
     * @param {Object=} options - Titlebar Configuration
     * @param {Boolean=} options.darkMode - Light titlebar buttons (for dark backgrounds)
     * @param {String=} options.color - Icon color (Hex)
     * @param {String=} options.backgroundColor - Bar color (Hex)
     * @param {Boolean=} options.draggable - Titlebar enables dragging of contained window.
     * @param {Boolean=} options.fullscreen - Resize button initializes in fullscreen mode
     * @param {Boolean=} options.onDoubleClick - Double clicking on titlebar enable to resize window in fullscreen mode. Default to false
     * @param {Boolean=} options.contextMenu - Use internal contextMenu of Electron. Useful if using browserView. Default to false
     * @param {String=} options.title - The app name shown to the left of the menu items
     * @param {String=} options.icon - The app icon shown on the top left
     * @param {Array=} options.menu - The array of menu items following the Electron Menu Object Documentation/Template
     * @param {Object=} option.theme - WIP Theme object to customize titlebar
     */
    constructor(options = {}) {
        super();
        this.acceptedOptions = [
            'color',
            'backgroundColor',
            'darkMode',
            'draggable',
            'fullscreen',
            'onDoubleClick',
            'contextMenu',
            'title',
            'icon',
            'menu',
            'theme'
        ];
        this.options = {
            color: '#33322',
            backgroundColor: '#dedede',
            darkMode: false,
            draggable: true,
            fullscreen: false,
            onDoubleClick: false,
            contextMenu: false,
            title: null,
            icon: null,
            menu: null,
            theme: null
        }

        this.init(options);
        defaultCss('titlebar', titlebarStylesheet);
    };

    /**
     * Init
     * @private
     * @param {Object=} options - Titlebar Configuration
     */
    init(options) {
        // Create DOM Titlebar Element
        this.titlebarContainer = domify(titlebarView, document);
        this.titlebarElement = this.titlebarContainer.querySelector('.titlebar');

        // Register buttons
        this.minimizeButton = this.titlebarElement.querySelector('.titlebar-minimize');
        this.resizeButton = this.titlebarElement.querySelector('.titlebar-resize');
        this.closeButton = this.titlebarElement.querySelector('.titlebar-close');

        // Add click events
        this.titlebarElement.addEventListener('dblclick', event => this.onDoubleclick(event));
        this.minimizeButton.addEventListener('click', event => this.clickMinimize(event));
        this.resizeButton.addEventListener('click', event => this.clickResize(event));
        this.closeButton.addEventListener('click', event => this.clickClose(event));

        // Set Options
        this.options = Object.assign({}, this.options, options);

        // Electron Menu reference
        this.electronMenu = this.getElectronMenu();
        this.optionElements = null;

        // Draggable
        if (this.options.draggable) {
            this.titlebarElement.classList.add('draggable');
        } else if (this.titlebarElement.classList.contains('draggable')) {
            this.titlebarElement.classList.remove('draggable');
        }
    }

    /** @fires TitleBar#EventEmitter:close */
    clickClose() { this.emit('close'); };

    /** @fires TitleBar#EventEmitter:minimize */
    clickMinimize() { this.emit('minimize'); };

    /**
     * @fires TitleBar#EventEmitter:maximize
     * @fires TitleBar#EventEmitter:fullscreen
     */
    clickResize() {
        // Resize to Maximize
        if (this.options.fullscreen) {
            this.titlebarElement.classList.remove('fullscreen');
            this.emit('maximize');
        }

        // Resize to Fullscreen
        if (!this.options.fullscreen) {
            this.titlebarElement.classList.add('fullscreen');
            this.emit('fullscreen');
        }

        // Store
        this.options.fullscreen = !this.options.fullscreen;
    };

    /**
     * @param {Event} event - Event
     * @fires TitleBar#EventEmitter:close
     */
    onDoubleclick(event) {
        if (this.options.onDoubleClick) {

            if (!(this.minimizeButton.contains(event.target) || this.resizeButton.contains(event.target) || this.closeButton.contains(event.target))) {
                this.clickResize(event);
            }

        }
    };

    /**
     * getAccelerator
     * @private
     * @param {String=} accelerator - Keyboard shortcut to display
     * @returns {Srtring}
     */
    getAccelerator(accelerator) {
        let res = accelerator;
        res = res.replace(/commandorcontrol/i, process.platform === 'darwin' ? '⌘' : 'Ctrl');
        res = res.replace(/command/i, process.platform === 'darwin' ? '⌘' : process.platform === 'win32' ? 'Win' : 'Cmd');
        res = res.replace(/control/i, process.platform === 'darwin' ? '⌃' : 'Ctrl');
        res = res.replace(/shift/i, process.platform === 'darwin' ? '⇧' : 'Shift');
        res = res.replace(/option/i, process.platform === 'darwin' ? '⌥' : 'Alt');
        res = res.replace(/alt/i, process.platform === 'darwin' ? '⌥' : 'Alt');
        res = res.replace(/capslock/i, process.platform === 'darwin' ? '⇪' : 'CapsLock');
        if (process.platform === 'darwin') {
            res = res.replace(/\+(?!\+)/gi, '');
        }
        return res;
    }

    /**
     * getElectronMenu
     * @private
     * @returns {Object}
     */
    getElectronMenu() {
        if (Menu && this.options.menu && this.options.menu.length) {
            return Menu.buildFromTemplate(this.options.menu);
        }
        return null;
    }

    /**
     * computeTitlebar
     * @private
     */
    computeTitlebar() {
        // Option: darkMode
        if (this.options.darkMode !== false) {
            this.titlebarContainer.classList.add('titlebar-light');
        }

        // Option: color
        if (this.options.color) {
            this.titlebarElement.querySelector('rect').style.fill = this.options.color;
            this.titlebarElement.querySelectorAll('path').forEach(elem => elem.style.fill = this.options.color);
            this.titlebarElement.querySelector('polygon').style.fill = this.options.color;
            this.titlebarElement.style.color = this.options.color;
        }

        // Option: backgroundColor
        if (this.options.backgroundColor) {
            this.titlebarContainer.style.backgroundColor = this.options.backgroundColor;
            this.titlebarElement.style.backgroundColor = this.options.backgroundColor;
        }

        // Option: title
        if (this.options.title) {
            const title = document.createTextNode(this.options.title);
            this.titlebarElement.querySelector('.titlebar-title .titlebar-title_text').appendChild(title);
        }

        // Option: icon
        if (this.options.icon) {
            this.titlebarElement.querySelector('.titlebar-title .titlebar-icon').src = this.options.icon;
        } else {
            this.titlebarElement.querySelector('.titlebar-title .titlebar-icon').style.display = 'none';
        }

        // TODO Handle checked items
        // Option: menu
        this.electronMenu = this.getElectronMenu();
        if (this.electronMenu) {
            this.options.menu.forEach(tile => this.setMenuItem(tile));
        }
    }

    /**
     * Add to DOM
     * @param {Element=} context - DOM node
     * @returns {TitleBar}
     */
    appendTo(context = document.body) {
        this.parentContext = context;

        this.computeTitlebar();
        context.appendChild(this.titlebarContainer);

        return this;
    };

    /**
     * setMenuItem
     * @private
     * @param {Object=} tile - Electron menu tile
     */
    setMenuItem(tile) {
        const titlebarMenu = this.titlebarElement.querySelector('.titlebar-menu')

        // Get Electron related item
        let electronMenuItem = this.electronMenu.items.filter(item => item.label === tile.label);
        electronMenuItem = electronMenuItem ? electronMenuItem[0] : null;

        // Visible
        if (tile.visible === false) {return;}

        const tileElement = document.createElement('div');
        tileElement.classList.add('titlebar-menu_tiles');
        tileElement.setAttribute('role', tile.label);

        // Tile label
        const labelElement = document.createElement('div');
        labelElement.appendChild(document.createTextNode(tile.label));
        labelElement.classList.add('titlebar-menu_tiles-inner');
        tileElement.appendChild(labelElement);

        // Enabled
        if (tile.enabled === false) {
            tileElement.classList.add('disabled');
            titlebarMenu.appendChild(tileElement);
            return;
        }

        this.optionElements = document.createElement('div');
        this.optionElements.classList.add('titlebar-menu_options');

        // Options
        if (tile.submenu && this.options.contextMenu) {
            const menu = Menu.buildFromTemplate(tile.submenu);

            tileElement.querySelector('.titlebar-menu_tiles-inner').onclick = (e) => {
                menu.popup({
                    window: getCurrentWindow(),
                    x: e.target.offsetLeft + 2,
                    y: e.target.offsetTop + e.target.offsetHeight + 2
                });
                this.setCurrentLabel(tile.label);
            };
        } else if (tile.submenu) {
            tile.submenu.forEach(option => this.setMenuSubItem(option, electronMenuItem));

            tileElement.querySelector('.titlebar-menu_tiles-inner').onclick = () => {
                this.setCurrentLabel(tile.label);
                this.displayActiveTile();
            };
        }

        this.optionElements.style.display = 'none';
        tileElement.appendChild(this.optionElements);
        titlebarMenu.appendChild(tileElement);
    }

    // DYNAMIC HOVER AFTER CLICK ON MENU
    //
    // When click on menu tile, displays its option tiles
    // Handle listeners and change which menu to display hovering on other tiles
    // If click outside menu tiles removes listeners and hide menu options
    //
    setCurrentLabel(label) {
        this.currentLabel = label;
    }
    getCurrentLabel() {
        return this.currentLabel;
    }
    displayActiveTile() {
        const el = document.querySelector(`.titlebar-menu_tiles[role="${this.getCurrentLabel()}"]`);
        if (!el || !el.querySelector('.titlebar-menu_options')) {return;}
        el.querySelector('.titlebar-menu_options').style.display = 'block';

        const _listenerMouseMove = function(e) {
            const target = e.target;
            if (target.classList.contains('titlebar-menu_tiles-inner')
            && target.parentNode.getAttribute('role')
            && target.parentNode.getAttribute('role') !== this.getCurrentLabel()) {
                const el = document.querySelector(`.titlebar-menu_tiles[role="${this.getCurrentLabel()}"]`);
                if (!el || !el.querySelector('.titlebar-menu_options')
                || !target.parentNode.querySelector('.titlebar-menu_options')) {
                    return;
                }

                el.querySelector('.titlebar-menu_options').style.display = 'none';
                target.parentNode.querySelector('.titlebar-menu_options').style.display = 'block';

                this.setCurrentLabel(target.parentNode.getAttribute('role'));
            }
        }.bind(this);

        const _listenerMouseUp = function(e) {
            const container = document.querySelector('.titlebar-menu');
            const target = e.target;
            if (!container.contains(target)) {
                const el = document.querySelector(`.titlebar-menu_tiles[role="${this.getCurrentLabel()}"]`);
                if (!el || !el.querySelector('.titlebar-menu_options')) {
                    return;
                }
                el.querySelector('.titlebar-menu_options').style.display = 'none';

                document.removeEventListener('mousemove', _listenerMouseMove, false);
                this._removeListennerMouseUp();
            }
        }.bind(this);
        this._removeListennerMouseUp = function() {
            document.removeEventListener('mouseup', _listenerMouseUp, false)
        }.bind(this);

        document.addEventListener('mousemove', _listenerMouseMove, false);
        document.addEventListener('mouseup', _listenerMouseUp, false);
    }
    // DYNAMIC HOVER ON MENU

    /**
     * setMenuSubItem
     * @private
     * @param {Object=} option - Electron submenu tile
     * @param {Object=} electronMenuItem - Electron menu Items
     */
    setMenuSubItem(option, electronMenuItem) {
        // Visible
        if (option.visible === false) {return;}
        const optionElement = document.createElement('div');

        // Separator
        if (option.type && option.type === 'separator') {
            optionElement.classList.add('titlebar-menu_separator');
            this.optionElements.appendChild(optionElement);
            return;
        }

        // Get Electron related item
        let electronMenuSubItem = electronMenuItem.submenu.items.filter(subItem => {
            return (option.role
                ? subItem.role === option.role
                : subItem.label === option.label);
        });
        electronMenuSubItem = electronMenuSubItem ? electronMenuSubItem[0] : null;

        optionElement.classList.add('titlebar-menu_tile');

        // Option type : checkbox | radio
        if (option.type && (option.type === 'radio' || option.type === 'checkbox')) {
            const checkedElement = document.createElement('input');
            checkedElement.type = option.type;
            checkedElement.checked = option.checked ? 'checked' : null;
            checkedElement.classList.add(`titlebar-menu_tile_${option.type}`)
            optionElement.appendChild(checkedElement);
        }

        // Option label
        const labelElement = document.createElement('div');
        labelElement.classList.add('titlebar-menu_tile_label');
        labelElement.appendChild(document.createTextNode(option.label || electronMenuSubItem ? electronMenuSubItem.label : ''));
        optionElement.appendChild(labelElement);

        // Option accelerator
        if (option.accelerator) {
            const shortcutElement = document.createElement('div');shortcutElement.classList.add('titlebar-menu_tile_accelerator');
            shortcutElement.appendChild(document.createTextNode(electronMenuSubItem ? this.getAccelerator(electronMenuSubItem.accelerator) : null || this.getAccelerator(option.accelerator) || ''));
            optionElement.appendChild(shortcutElement);
        }

        // Enabled
        if (option.enabled === false) {
            optionElement.classList.add('disabled');
            this.optionElements.appendChild(optionElement);
            return;
        }

        // Option event
        if (option.role || option.click) {
            optionElement.onclick = () => {
                electronMenuSubItem ? electronMenuSubItem.click.call() : null;
            };
        }
        this.optionElements.appendChild(optionElement);
    }

    /**
     * update
     * @param {Object=} options - Titlebar Configuration
     * @returns {TitleBar}
     */
    update(options) {
        this.parentContext.removeChild(this.titlebarContainer);
        this.init(options);
        return this.appendTo(this.parentContext);
    }

    /**
     * Remove from DOM
     * @returns {TitleBar}
     */
    destroy() {
        parent.removeChild(this.titlebarContainer);

        return this;
    };
}

/*
 * @exports
 */
module.exports = TitleBar;
