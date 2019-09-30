'use strict';

const { app, BrowserWindow } = require('electron');

app.on('ready', () => {
    const win = new BrowserWindow({
        frame: false,
        width: 700,
        height: 450
    });

    win.on('ready-to-show', () => {
        win.focus();
        win.show();
        win.webContents.openDevTools({ mode: 'undocked' });
    });

    win.loadURL(`file://${__dirname}/main.html`);
});

app.on('activate', () => {
    BrowserWindow.getAllWindows().map(win => win.show());
});
