//dependencies
const { app, BrowserWindow } = require('electron')
const { overlayWindow } = require('electron-overlay-window')
const { exec } = require('child_process')
const memoryjs = require('memoryjs')
const ioHook = require('iohook')
const ipc = require('electron').ipcMain

//modules
const signatures = require('./assets/JS/signatures');
const init = require('./assets/JS/initialize.js');
const { memory } = require('console')

//target
var target = 'MZZXLC.exe'

//globals
var win;
var visible;
var processObject;

//timers
var waitingT;

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
  switch (arg) {
    case 'All':
      EnableAll(true)
      break;
    case 'God Mode':
      GodMode(true)
      break;
    case 'Rank S':
      RankS(true)
      break;
    case 'Codename Immortal':
      CodenameImmortal(true)
      break;
    case 'Infinite Lives':
      InfiniteLives(true)
      break;
    case 'Infinite Crystals':
      InfiniteCrystals(true)
      break;
    case 'Unlock Weapons':
      UnlockWeapons(true)
      break;
    case 'Max Weapons':
      MaxWeapons(true)
      break;
  }
  console.log(arg + " enabled.")
})

ipc.on('Disable', function (event, arg) {
  switch (arg) {
    case 'All':
      EnableAll(false)
      break;
    case 'God Mode':
      GodMode(false)
      break;
    case 'Rank S':
      RankS(false)
      break;
    case 'Codename Immortal':
      CodenameImmortal(false)
      break;
    case 'Infinite Lives':
      InfiniteLives(false)
      break;
    case 'Infinite Crystals':
      InfiniteCrystals(false)
      break;
    case 'Unlock Weapons':
      UnlockWeapons(false)
      break;
    case 'Max Weapons':
      MaxWeapons(false)
      break;
  }
  console.log(arg + " disabled.")
})

function EnableAll(on) {
  if (on) {
    GodMode(true)
    RankS(true)
    CodenameImmortal(true)
    InfiniteLives(true)
    InfiniteCrystals(true)
    UnlockWeapons(true)
    MaxWeapons(true)
  } else {
    GodMode(false)
    RankS(false)
    CodenameImmortal(false)
    InfiniteLives(false)
    InfiniteCrystals(false)
    UnlockWeapons(false)
    MaxWeapons(false)
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
    rank = memoryjs.readMemory(processObject.handle, addresses.ranks1, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks1, 0x06, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks2, 0x06, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks3, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks3 + 1, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks3 + 2, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks3 + 3, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks3 + 4, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks3 + 5, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks4, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks4 + 1, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks4 + 2, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks4 + 3, 0x90, memoryjs.BYTE);
  } else {
    memoryjs.writeMemory(processObject.handle, addresses.ranks1, rank, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks2, rank, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks3, 0x88, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks3 + 1, 0x8B, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks3 + 2, 0x28, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks3 + 3, 0x02, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks3 + 4, 0x00, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks3 + 5, 0x00, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks4, 0x45, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks4 + 1, 0x88, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks4 + 2, 0x41, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.ranks4 + 3, 0x01, memoryjs.BYTE);
  }
}

function CodenameImmortal(on) {
  if (on) {
    codename = memoryjs.readMemory(processObject.handle, addresses.codename1, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.codename1, 0x05, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.codename1 + 1, 0x05, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.codename1 + 2, 0x00, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.codename1 + 3, 0x05, memoryjs.BYTE);

    memoryjs.writeMemory(processObject.handle, addresses.codename2, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.codename2 + 1, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.codename2 + 2, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.codename2 + 3, 0x90, memoryjs.BYTE);

    memoryjs.writeMemory(processObject.handle, addresses.codename3, 0x05, memoryjs.BYTE);

    memoryjs.writeMemory(processObject.handle, addresses.codename4, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.codename4 + 1, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.codename4 + 2, 0x90, memoryjs.BYTE);
  } else {
    memoryjs.writeMemory(processObject.handle, addresses.codename1, codename, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.codename1 + 1, codename, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.codename1 + 2, 0x00, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.codename1 + 3, codename, memoryjs.BYTE);

    memoryjs.writeMemory(processObject.handle, addresses.codename2, 0x44, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.codename2 + 1, 0x88, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.codename2 + 2, 0x50, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.codename2 + 3, 0x03, memoryjs.BYTE);

    memoryjs.writeMemory(processObject.handle, addresses.codename3, 0x12, memoryjs.BYTE);

    memoryjs.writeMemory(processObject.handle, addresses.codename4, 0x88, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.codename4 + 1, 0x41, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.codename4 + 2, 0x05, memoryjs.BYTE);
  }
}

function InfiniteLives(on) {
  if (on) {
    lives = memoryjs.readMemory(processObject.handle, addresses.lives, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.lives, 0x09, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.infinitelives1, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.infinitelives1 + 1, 0x90, memoryjs.BYTE);
  } else {
    memoryjs.writeMemory(processObject.handle, addresses.lives, lives, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.infinitelives1, 0xFE, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.infinitelives1 + 1, 0x08, memoryjs.BYTE);
  }
}

function InfiniteCrystals(on) {
  if (on) {
    crystals = memoryjs.readMemory(processObject.handle, addresses.crystals2, memoryjs.INT);
    memoryjs.writeMemory(processObject.handle, addresses.crystals1, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.crystals1 + 1, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.crystals1 + 2, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.crystals1 + 3, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.crystals1 + 4, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.crystals1 + 5, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.crystals1 + 6, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.crystals2, 9999, memoryjs.INT);
  } else {
    memoryjs.writeMemory(processObject.handle, addresses.crystals2, crystals, memoryjs.INT);
    memoryjs.writeMemory(processObject.handle, addresses.crystals1, 0x66, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.crystals1 + 1, 0x89, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.crystals1 + 2, 0x81, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.crystals1 + 3, 0xAE, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.crystals1 + 4, 0x02, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.crystals1 + 5, 0x00, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.crystals1 + 6, 0x00, memoryjs.BYTE);
  }
}

function UnlockWeapons(on) {
  if (on) {
    weapons = memoryjs.readMemory(processObject.handle, addresses.weapons, memoryjs.INT);
    memoryjs.writeMemory(processObject.handle, addresses.weapons, 0x0F, memoryjs.BYTE);
  } else {
    memoryjs.writeMemory(processObject.handle, addresses.weapons, weapons, memoryjs.BYTE);
  }
}

function MaxWeapons(on) {
  if (on) {

  } else {

  }
}

function NoPushBack() {
  var address1 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.nopushback, memoryjs.NORMAL, 47, 0)
  memoryjs.writeMemory(processObject.handle, address1, 0x90, memoryjs.BYTE);
  memoryjs.writeMemory(processObject.handle, address1 + 1, 0x90, memoryjs.BYTE);
  memoryjs.writeMemory(processObject.handle, address1 + 2, 0x90, memoryjs.BYTE);
  memoryjs.writeMemory(processObject.handle, address1 + 3, 0x90, memoryjs.BYTE);
  memoryjs.writeMemory(processObject.handle, address1 + 4, 0x90, memoryjs.BYTE);
  memoryjs.writeMemory(processObject.handle, address1 + 5, 0x90, memoryjs.BYTE);
}