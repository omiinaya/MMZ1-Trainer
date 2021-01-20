//dependencies
const electron = require('electron')

//definitions
const ipc = electron.ipcRenderer

//send boolean as an arg depending on state of the button
function toggle(a) {
    ipc.send('test', a)
    //alert('lol')
}