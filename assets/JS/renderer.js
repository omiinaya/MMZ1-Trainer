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
        toggleA('God Mode')
        document.getElementById('One-Hit Kill').checked = true
        toggleA('One-Hit Kill')
        document.getElementById('Rank S').checked = true
        toggleA('Rank S')
        document.getElementById('Infinite Lives').checked = true
        toggleA('Inifinite Lives')
        document.getElementById('Infinite Crystals').checked = true
        toggleA('Infinite Crystals')
    } else {
        document.getElementById('God Mode').checked = false
        toggleA('God Mode')
        document.getElementById('One-Hit Kill').checked = true
        toggleA('One-Hit Kill')
        document.getElementById('Rank S').checked = false
        toggleA('Rank S')
        document.getElementById('Infinite Lives').checked = false
        toggleA('Infinite Lives')
        document.getElementById('Infinite Crystals').checked = false
        toggleA('Infinite Crystals')
    }
}