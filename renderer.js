const electron = require('electron')
const ipc = electron.ipcRenderer

function ipcSend() {
    alert('clicked')
    ipc.send('test', 'xd')
}

function xd() {
    ipc.send('test', 'xd')
    //alert('lol')
}