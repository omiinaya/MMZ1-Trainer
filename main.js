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
  if (arg === 'One-Hit Kill') {
    OneHitKill(true)
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
  if (arg === 'One-Hit Kill') {
    OneHitKill(false)
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
  //default
  var address1 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.invincible1, memoryjs.NORMAL, 3, 0);
  var address2 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.invincible1, memoryjs.NORMAL, 8, 0);
  //
  var address3 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.invincible2, memoryjs.NORMAL, 0, 0);
  var address4 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.invincible2, memoryjs.NORMAL, 1, 0);
  var address5 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.invincible2, memoryjs.NORMAL, 2, 0);
  var address6 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.invincible2, memoryjs.NORMAL, 3, 0);
  if (on) {
    console.log("God Mode has been enabled.")
    memoryjs.writeMemory(processObject.handle, address1, 0x80, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, address2, 0x01, memoryjs.BYTE);
    //
    memoryjs.writeMemory(processObject.handle, address3, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, address4, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, address5, 0x90, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, address6, 0x90, memoryjs.BYTE);
  } else {
    console.log("God Mode has been disabled.")
    memoryjs.writeMemory(processObject.handle, address1, 0x5A, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, address2, 0x02, memoryjs.BYTE);
    //
    memoryjs.writeMemory(processObject.handle, address3, 0x41, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, address4, 0x88, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, address5, 0x40, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, address6, 0x38, memoryjs.BYTE);
  }
}

function OneHitKill(on) {
  var address1 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.onehitkill1, memoryjs.NORMAL, 5, 0);
  var address2 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.onehitkill1, memoryjs.NORMAL, 6, 0);
  var address3 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.onehitkill1, memoryjs.NORMAL, 7, 0);
  var address4 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.onehitkill1, memoryjs.NORMAL, 8, 0);
  //
  var address5 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.onehitkill2, memoryjs.NORMAL, 5, 0);
  var address6 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.onehitkill2, memoryjs.NORMAL, 6, 0);
  var address7 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.onehitkill2, memoryjs.NORMAL, 7, 0);
  var address8 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.onehitkill2, memoryjs.NORMAL, 8, 0);
  if (on) {
    console.log("One-Hit Kill has been enabled.")
    memoryjs.writeMemory(processObject.handle, address1, 0x83, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, address2, 0x6B, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, address3, 0x30, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, address4, 0x5A, memoryjs.BYTE);
  } else {
    console.log("One-Hit Kill has been disabled.")
    memoryjs.writeMemory(processObject.handle, address5, 0x66, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, address6, 0x29, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, address7, 0x43, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, address8, 0x30, memoryjs.BYTE);
  }
}


//140371CEA
function RankS(on) {
  NoPushBack()
  var address = 0x14032C251;
  const pointer = memoryjs.readMemory(processObject.handle, address, 'dword');
  if (on) {
    console.log("Rank S has been enabled.")
    console.log(pointer)
    const ptr = memoryjs.readMemory(processObject.handle, pointer, 'dword');
    console.log(ptr)
  } else {
    console.log("Rank S has been disabled.")
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
  var pattern = signatures.health;                                                      
  var address = memoryjs.findPattern(processObject.handle, processObject.szExeFile, pattern, memoryjs.NORMAL, 0, 0)
  var bytes = {
    byte1: memoryjs.readMemory(processObject.handle, address+3, memoryjs.BYTE).toString(16),
    byte2: memoryjs.readMemory(processObject.handle, address+4, memoryjs.BYTE).toString(16),
    byte3: memoryjs.readMemory(processObject.handle, address+5, memoryjs.BYTE).toString(16),
    byte4: memoryjs.readMemory(processObject.handle, address+6, memoryjs.BYTE).toString(16),
  }                                                                                     
  var ptrStr = '0x'+bytes.byte4+bytes.byte3+bytes.byte2+bytes.byte1    
  var ptrHex = parseInt(ptrStr)                                                                             
  var next = address + 8;                                                                                          
  var target = next + ptrHex;                                                                                       
  console.log(target.toString(16))
}