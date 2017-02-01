const {remote} = require('electron');
const {Menu, MenuItem} = remote;

var template = [
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
    },
    {
        label: 'Examples',
        submenu: [
            {role: 'example:blink.bounce', label: 'Blink An Led'},
            {role: 'example:loops.bounce', label: 'Loops'},
            {role: 'example:pin_write.bounce', label: 'Writing to an IO Pin'},
            {role: 'example:hello_world.bounce', label: 'Print Hello World'},
            {role: 'example:timers.bounce', label: 'Timers'},
            //{label: 'DH11 Temp Sensor'},
            {role: 'example:ws2812_test.bounce', label: 'WS2812 Led Demo'}
        ]
    }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
