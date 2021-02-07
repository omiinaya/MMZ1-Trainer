//dependencies
const { app, BrowserWindow } = require('electron')
const { overlayWindow } = require('electron-overlay-window')
const { exec } = require('child_process')
const memoryjs = require('memoryjs')
const ioHook = require('iohook')
const ipc = require('electron').ipcMain

//modules
const signatures = require('./assets/JS/signatures');

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
var defaults = {};

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
      console.log(processObject)
    }
  }
}

function getWindowTitle() {
  exec('tasklist /FI "PID eq ' + processObject.th32ProcessID + '" /fo list /v', (err, stdout, stderr) => {
    var index = stdout.search("Window Title: ");
    var title = stdout.substring(index + 14, stdout.length - 2)
    createWindow(title)
    sigScan()
  });
}

app.on('ready', () => {
  main()
})

ipc.on('Enable', function (event, arg) {
  if (arg === 'Enable/Disable All') {
    EnableDisableAll(true)
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
})

ipc.on('Disable', function (event, arg) {
  if (arg === 'Enable/Disable All') {
    EnableDisableAll(false)
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
})

function EnableDisableAll(on) {
  if (on) {
    console.log("All features have been enabled.")
  } else {
    console.log("All features have been disabled.")
  }
}

function GodMode(on) {
  //original
  var address1 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.invincible1, memoryjs.NORMAL, 0, 0);
  var address2 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.invincible1, memoryjs.NORMAL, 1, 0);
  var address3 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.invincible1, memoryjs.NORMAL, 2, 0);
  var address4 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.invincible1, memoryjs.NORMAL, 3, 0);
  var address5 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.invincible2, memoryjs.NORMAL, 0, 0);
  var address6 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.invincible2, memoryjs.NORMAL, 1, 0);
  var address7 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.invincible2, memoryjs.NORMAL, 2, 0);
  //changed
  var address8 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.invincible3, memoryjs.NORMAL, 0, 0);
  var address9 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.invincible3, memoryjs.NORMAL, 1, 0);
  var address10 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.invincible3, memoryjs.NORMAL, 2, 0);
  var address11 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.invincible3, memoryjs.NORMAL, 3, 0);
  var address12 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.invincible4, memoryjs.NORMAL, 0, 0);
  var address13 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.invincible4, memoryjs.NORMAL, 1, 0);
  var address14 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.invincible4, memoryjs.NORMAL, 2, 0);
  if (on) {
    console.log("God Mode has been enabled.")
    //
    memoryjs.writeMemory(processObject.handle, address1, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, address2, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, address3, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, address4, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, address5, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, address6, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, address7, 0x90, memoryjs.BYTE);
  } else {
    console.log("God Mode has been disabled.")
    //
    memoryjs.writeMemory(processObject.handle, address8, 0x41, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, address9, 0x88, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, address10, 0x40, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, address11, 0x38, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, address12, 0x88, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, address13, 0x41, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, address14, 0x39, memoryjs.BYTE);
    //
  }
}

function RankS(on) {
  if (on) {
    console.log("Rank S has been enabled.")
  } else {
    console.log("Rank S has been disabled.")
  }
}

function InfiniteLives(on) {
  if (on) {
    console.log("Infinite Lives has been enabled.")
  } else {
    console.log("Infinite Lives has been disabled.")
  }
}

function InfiniteCrystals(on) {
  if (on) {
    console.log("Infinite Crystals has been enabled.")
  } else {
    console.log("Infinite Crystals has been disabled.")
  }
}

function sigScan() {
  var address1 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.invincible1, memoryjs.NORMAL, 0, 0); //finds address
  var address2 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.invincible1, memoryjs.NORMAL, 1, 0);
  var address3 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.invincible1, memoryjs.NORMAL, 2, 0);
  var address4 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.invincible1, memoryjs.NORMAL, 3, 0);
  //
  var address5 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.invincible2, memoryjs.NORMAL, 0, 0);
  var address6 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.invincible2, memoryjs.NORMAL, 1, 0);
  var address7 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.invincible2, memoryjs.NORMAL, 2, 0);
  //
  var value1 = memoryjs.readMemory(processObject.handle, address1, memoryjs.BYTE) //reads address
  var value2 = memoryjs.readMemory(processObject.handle, address2, memoryjs.BYTE)
  var value3 = memoryjs.readMemory(processObject.handle, address3, memoryjs.BYTE)
  var value4 = memoryjs.readMemory(processObject.handle, address4, memoryjs.BYTE)
  var value5 = memoryjs.readMemory(processObject.handle, address5, memoryjs.BYTE)
  var value6 = memoryjs.readMemory(processObject.handle, address6, memoryjs.BYTE)
  var value7 = memoryjs.readMemory(processObject.handle, address7, memoryjs.BYTE)
  //
  console.log(processObject.handle)
  console.log(target)
  console.log(address1.toString(16))
  console.log(address2.toString(16))
  console.log(value1.toString(16));
  console.log(value2.toString(16));
  console.log(value3.toString(16));
  console.log(value4.toString(16));
  console.log(value5.toString(16));
  console.log(value6.toString(16));
  console.log(value7.toString(16));
}