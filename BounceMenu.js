const {remote} = require('electron');
const {Menu, MenuItem} = remote;

const template = [
    {
        label: 'File',
        submenu: [
            {role: 'new', label: 'New'},
            {role: 'open', label: 'Open'},
            {role: 'save', label: 'Save'},
            {role: 'saveas', label: 'Save As'},
            {type: 'separator'},
            {role: 'export', label: 'Export'},
            {type: 'separator'},
            {role: 'exit', label: 'Exit'}
        ]
    }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
