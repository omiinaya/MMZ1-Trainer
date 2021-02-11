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
var godModeT;

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
    }
  }
}

function getWindowTitle() {
  exec('tasklist /FI "PID eq ' + processObject.th32ProcessID + '" /fo list /v', (err, stdout, stderr) => {
    var index = stdout.search("Window Title: ");
    var title = stdout.substring(index + 14, stdout.length - 2)
    createWindow(title)
    //console.log(processObject)
    testing()
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
  var address = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.health, memoryjs.NORMAL, 0, 0)
  var bytes = {
    1: memoryjs.readMemory(processObject.handle, address + 3, memoryjs.BYTE).toString(16),
    2: memoryjs.readMemory(processObject.handle, address + 4, memoryjs.BYTE).toString(16),
    3: memoryjs.readMemory(processObject.handle, address + 5, memoryjs.BYTE).toString(16),
    4: memoryjs.readMemory(processObject.handle, address + 6, memoryjs.BYTE).toString(16),
  }
  var ptrStr = '0x' + bytes['4'] + bytes['3'] + bytes['2'] + bytes['1']
  var ptrHex = parseInt(ptrStr)
  var next = address + 8;
  var health = next + ptrHex;
  var target = health+8
  if (on) {
    console.log('God Mode has been enabled.')
    console.log(target.toString(16))
    memoryjs.writeMemory(processObject.handle, target, 0x80, memoryjs.BYTE);
  } else {
    console.log('God Mode has been disabled.')
    memoryjs.writeMemory(processObject.handle, target, 0x0, memoryjs.BYTE);
  }
}

function RankS(on) {
  var address = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.rank1, memoryjs.NORMAL, 0, 0)
  var next = address + 7;
  var bytes = {
    1: memoryjs.readMemory(processObject.handle, address + 3, memoryjs.BYTE).toString(16),
    2: memoryjs.readMemory(processObject.handle, address + 4, memoryjs.BYTE).toString(16),
    3: memoryjs.readMemory(processObject.handle, address + 5, memoryjs.BYTE).toString(16),
    4: memoryjs.readMemory(processObject.handle, address + 6, memoryjs.BYTE).toString(16),
  }
  var offsetStr = '0x' + bytes['4'] + bytes['3'] + bytes['2'] + bytes['1']
  var offsetHex = parseInt(offsetStr)
  var pointer = next + offsetHex
  var dword = memoryjs.readMemory(processObject.handle, pointer, memoryjs.DWORD).toString(16)
  var offsetStr2 = '0x' + dword.substring(1, dword.length)
  var offsetHex2 = parseInt(offsetStr2)
  var base = processObject.modBaseAddr
  var func = base+offsetHex2;
  var target = func+1;
  //
  var address2 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.rank2, memoryjs.NORMAL, 0, 0)
  var bytes2 = {
    1: memoryjs.readMemory(processObject.handle, address2 + 2, memoryjs.BYTE).toString(16),
    2: memoryjs.readMemory(processObject.handle, address2 + 3, memoryjs.BYTE).toString(16),
    3: memoryjs.readMemory(processObject.handle, address2 + 4, memoryjs.BYTE).toString(16),
    4: memoryjs.readMemory(processObject.handle, address2 + 5, memoryjs.BYTE).toString(16),
  }
  var offset2Str = '0x' + bytes2['4'] + bytes2['3'] + bytes2['2'] + bytes2['1']
  var offset2Hex = parseInt(offset2Str)
  //add this offset to entity list address aka A0 aka god mode address
  if (on) {
    console.log("Rank S has been enabled.")
    memoryjs.writeMemory(processObject.handle, target, 0x06, memoryjs.BYTE);
    console.log(address2.toString(16))
    console.log(offset2Hex.toString(16))
  } else {
    console.log("Rank S has been disabled.")
    memoryjs.writeMemory(processObject.handle, target, 0x03, memoryjs.BYTE);
  }
}

function InfiniteLives(on) {
  //default
  var address1 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.infinitelives, memoryjs.NORMAL, 0, 0)
  var address2 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.infinitelives, memoryjs.NORMAL, 1, 0)
  if (on) {
    console.log("Infinite Lives has been enabled.")
    memoryjs.writeMemory(processObject.handle, address1, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, address2, 0x90, memoryjs.BYTE);
  } else {
    console.log("Infinite Lives has been disabled.")
    memoryjs.writeMemory(processObject.handle, address1, 0xFE, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, address2, 0x08, memoryjs.BYTE);
  }
}

function InfiniteCrystals(on) {
  const address = memoryjs.virtualAllocEx(
    processObject.handle,
    null,
    0x60,
    memoryjs.MEM_RESERVE | memoryjs.MEM_COMMIT,
    memoryjs.PAGE_EXECUTE_READWRITE,
  );
  if (on) {
    console.log(`Allocated address: 0x${address.toString(16).toUpperCase()}`);
    memoryjs.writeMemory(processObject.handle, address, 0x08, memoryjs.BYTE);
  } else {
    //
  }
}

function NoPushBack() {
  var address1 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.nopushback, memoryjs.NORMAL, 47, 0)
  var address2 = address1 + 1;
  var address3 = address1 + 2;
  var address4 = address1 + 3;
  var address5 = address1 + 4;
  var address6 = address1 + 5;
  memoryjs.writeMemory(processObject.handle, address1, 0x90, memoryjs.BYTE);
  memoryjs.writeMemory(processObject.handle, address2, 0x90, memoryjs.BYTE);
  memoryjs.writeMemory(processObject.handle, address3, 0x90, memoryjs.BYTE);
  memoryjs.writeMemory(processObject.handle, address4, 0x90, memoryjs.BYTE);
  memoryjs.writeMemory(processObject.handle, address5, 0x90, memoryjs.BYTE);
  memoryjs.writeMemory(processObject.handle, address6, 0x90, memoryjs.BYTE);
}

function testing() {
  var address = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.rank1, memoryjs.NORMAL, 0, 0)
  var next = address + 7;
  var bytes = {
    1: memoryjs.readMemory(processObject.handle, address + 3, memoryjs.BYTE).toString(16),
    2: memoryjs.readMemory(processObject.handle, address + 4, memoryjs.BYTE).toString(16),
    3: memoryjs.readMemory(processObject.handle, address + 5, memoryjs.BYTE).toString(16),
    4: memoryjs.readMemory(processObject.handle, address + 6, memoryjs.BYTE).toString(16),
  }
  var offsetStr = '0x' + bytes['4'] + bytes['3'] + bytes['2'] + bytes['1']
  var offsetHex = parseInt(offsetStr)
  var pointer = next + offsetHex
  var dword = memoryjs.readMemory(processObject.handle, pointer, memoryjs.DWORD).toString(16)
  var offsetStr2 = '0x' + dword.substring(1, dword.length)
  var offsetHex2 = parseInt(offsetStr2)
  var base = processObject.modBaseAddr
  var func = base+offsetHex2;
  var target = func+1;
  var rank = memoryjs.readMemory(processObject.handle, target, memoryjs.BYTE)
  
  console.log(address.toString(16))
  console.log(next.toString(16))
  console.log(pointer.toString(16))
  console.log(base.toString(16))
  console.log(target.toString(16))
  console.log(rank)
}