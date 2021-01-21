//dependencies
const { app, BrowserWindow } = require('electron')
const { overlayWindow } = require('electron-overlay-window')
const { exec } = require('child_process')
const memoryjs = require('memoryjs')
const ioHook = require('iohook')
const ipc = require('electron').ipcMain

//target
var target = 'notepad.exe'
//var target = 'MZZXLC.exe'

//globals
var win;
var visible;

//timers
var waitingT;

//static
var processObject;
var processHandle;
var processPiD;
var windowTitle;

function createWindow() {
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
  overlayWindow.attachTo(window, windowTitle)
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
      processHandle = processObject.handle;
      processPiD = processObject.th32ProcessID;
    }
  }
}

function getWindowTitle() {
  exec('tasklist /FI "PID eq ' + processPiD + '" /fo list /v', (err, stdout, stderr) => {
    var index = stdout.search("Window Title: ");
    var title = stdout.substring(index + 14, stdout.length - 2)
    windowTitle = title;
    createWindow()
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
  if (on) {
    console.log("God Mode has been enabled.")
  } else {
    console.log("God Mode has been disabled.")
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