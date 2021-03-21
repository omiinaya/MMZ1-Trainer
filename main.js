//dependencies
const { app, BrowserWindow } = require('electron')
const { overlayWindow } = require('electron-overlay-window')
const { exec } = require('child_process')
const memoryjs = require('memoryjs')
const ioHook = require('iohook')
const ipc = require('electron').ipcMain

//modules
const signatures = require('./assets/JS/signatures');
const init = require('./initialize.js');
const { allowedNodeEnvironmentFlags } = require('process')
//const Addresses = require('./assets/JS/addresses')

//target
//var target = 'Craftopia.exe'
//var target = 'notepad.exe'
var target = 'MZZXLC.exe'

//globals
var win;
var visible;

//timers
var waitingT;

//static
var processObject;
var addresses;

function createWindow(title) {
  const window = new BrowserWindow({
    width: 400,
    height: 300,
    ...overlayWindow.WINDOW_OPTS,
    webPreferences: {
      nodeIntegration: true
    }
  })

  window.loadFile('./assets/HTML/index.html')
  window.setIgnoreMouseEvents(false)
  window.setContentProtection(true)
  overlayWindow.attachTo(window, title)
  win = window;
  visible = true;
  hotkeyListener()
}

function hotkeyListener() {
  ioHook.on('keydown', event => {
    if (event.rawcode == 45 || event.rawcode == 46) {
      windowToggle()
    }
  })
  ioHook.start();
}

function windowToggle() {
  if (!visible) {
    win.show()
    win.restore();
    visible = true;
  } else {
    win.minimize()
    win.hide()
    visible = false;
  }
}

function main() {
  getGameWindow()
  if (processObject) {
    clearTimeout(waitingT)
    getWindowTitle()
  } else {
    waitingT = setTimeout(main, 1000);
  }
}

function getGameWindow() {
  var processes = memoryjs.getProcesses();
  for (var i = 0; i < processes.length; i++) {
    if (processes[i].szExeFile == target) {
      processObject = memoryjs.openProcess(target);
      addresses = init(processObject)
    }
  }
}

function getWindowTitle() {
  exec('tasklist /FI "PID eq ' + processObject.th32ProcessID + '" /fo list /v', (err, stdout, stderr) => {
    var index = stdout.search("Window Title: ");
    var title = stdout.substring(index + 14, stdout.length - 2)
    createWindow(title)
  });
}

app.on('ready', () => {
  main()
})

ipc.on('Enable', function (event, arg) {
  if (arg === 'All') {
    EnableAll(true)
  }
  if (arg === 'God Mode') {
    GodMode(true)
  }
  if (arg === 'Rank S') {
    RankS(true)
  }
  if (arg === 'Infinite Lives') {
    InfiniteLives(true)
  }
  if (arg === 'Infinite Crystals') {
    InfiniteCrystals(true)
  }
  console.log(arg+" enabled.")
})

ipc.on('Disable', function (event, arg) {
  if (arg === 'All') {
    EnableAll(false)
  }
  if (arg === 'God Mode') {
    GodMode(false)
  }
  if (arg === 'Rank S') {
    RankS(false)
  }
  if (arg === 'Infinite Lives') {
    InfiniteLives(false)
  }
  if (arg === 'Infinite Crystals') {
    InfiniteCrystals(false)
  }
  console.log(arg+" disabled.")
})

function EnableAll(on) {
  if (on) {
    GodMode(true)
    RankS(true)
    InfiniteLives(true)
    InfiniteCrystals(true)
  } else {
    GodMode(false)
    RankS(false)
    InfiniteLives(false)
    InfiniteCrystals(false)
  }
}

function GodMode(on) {
  if (on) {
    memoryjs.writeMemory(processObject.handle, addresses.invincible, 0x80, memoryjs.BYTE);
  } else {
    memoryjs.writeMemory(processObject.handle, addresses.invincible, 0x00, memoryjs.BYTE);
  }
}

function RankS(on) {
  if (on) {
    memoryjs.writeMemory(processObject.handle, addresses.ranks1,     0x06, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks2,     0x06, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks3,     0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks3 + 1, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks3 + 2, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks3 + 3, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks3 + 4, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks3 + 5, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks4,     0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks4 + 1, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks4 + 2, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks4 + 3, 0x90, memoryjs.BYTE);
  } else {
    memoryjs.writeMemory(processObject.handle, addresses.ranks1,     0x03, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks2,     0x03, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks3,     0x88, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks3 + 1, 0x8B, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks3 + 2, 0x28, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks3 + 3, 0x02, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks3 + 4, 0x00, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks3 + 5, 0x00, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks4,     0x45, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks4 + 1, 0x88, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks4 + 2, 0x41, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks4 + 3, 0x01, memoryjs.BYTE);
  }
}

function InfiniteLives(on) {
  if (on) {
    lives = memoryjs.readMemory(processObject.handle, addresses.lives, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.lives,             0x09, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.infinitelives1,    0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.infinitelives1+1,  0x90, memoryjs.BYTE);
  } else {
    memoryjs.writeMemory(processObject.handle, addresses.lives, lives, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.infinitelives1, 0xFE, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.infinitelives1+1, 0x08, memoryjs.BYTE);
  }
}

function InfiniteCrystals(on) {
  if (on) {
    memoryjs.writeMemory(processObject.handle, addresses.crystals1,     0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.crystals1 + 1, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.crystals1 + 2, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.crystals1 + 3, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.crystals1 + 4, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.crystals1 + 5, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.crystals1 + 6, 0x90, memoryjs.BYTE);
    //saving current crystals to a global variable
    crystals = memoryjs.readMemory(processObject.handle, addresses.crystals2, memoryjs.INT);
    //changing current number of crystals to 9999
    memoryjs.writeMemory(processObject.handle, addresses.crystals2,     9999, memoryjs.INT);
  } else {
    memoryjs.writeMemory(processObject.handle, addresses.crystals1,     0x66, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.crystals1 + 1, 0x89, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.crystals1 + 2, 0x81, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.crystals1 + 3, 0xAE, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.crystals1 + 4, 0x02, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.crystals1 + 5, 0x00, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.crystals1 + 6, 0x00, memoryjs.BYTE);
    //setting crystals to old value after turning off
    memoryjs.writeMemory(processObject.handle, addresses.crystals2, crystals, memoryjs.INT);
  }
}

function NoPushBack() {
  var address1 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.nopushback, memoryjs.NORMAL, 47, 0)
  memoryjs.writeMemory(processObject.handle, address1,   0x90, memoryjs.BYTE);
  memoryjs.writeMemory(processObject.handle, address1+1, 0x90, memoryjs.BYTE);
  memoryjs.writeMemory(processObject.handle, address1+2, 0x90, memoryjs.BYTE);
  memoryjs.writeMemory(processObject.handle, address1+3, 0x90, memoryjs.BYTE);
  memoryjs.writeMemory(processObject.handle, address1+4, 0x90, memoryjs.BYTE);
  memoryjs.writeMemory(processObject.handle, address1+5, 0x90, memoryjs.BYTE);
}