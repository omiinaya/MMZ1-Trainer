//dependencies
const electron = require('electron')

//definitions
const ipc = electron.ipcRenderer

function toggleA(a) {
    if (document.getElementById(a).checked) {
        ipc.send('Enable', a)
        if (a == 'Enable/Disable All') {
            toggleAll()
        }
    } else {
        ipc.send('Disable', a)
        if (a == 'Enable/Disable All') {
            toggleAll()
        }
    }
}

function toggleAll() {
    if (document.getElementById('Enable/Disable All').checked) {
        document.getElementById('God Mode').checked = true
        document.getElementById('Rank S').checked = true
        document.getElementById('Infinite Lives').checked = true
        document.getElementById('Infinite Crystals').checked = true
    } else {
        document.getElementById('God Mode').checked = false
        document.getElementById('Rank S').checked = false
        document.getElementById('Infinite Lives').checked = false
        document.getElementById('Infinite Crystals').checked = false
    }
}