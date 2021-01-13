//dependencies
const { app, BrowserWindow, globalShortcut } = require('electron')
const { overlayWindow } = require('electron-overlay-window')
const { exec } = require('child_process')
const memoryjs = require('memoryjs')

//target
var target = 'MZZXLC.exe'

//globals
var win;
var visible;

//static
var processObject;
var processHandle;
var processPPiD;
var processDetails;
var windowTitle;

function createWindow() {
  const window = new BrowserWindow({
    width: 400,
    height: 300,
    ...overlayWindow.WINDOW_OPTS
  })

  window.loadFile('index.html')
  window.setIgnoreMouseEvents(true)
  overlayWindow.attachTo(window, windowTitle)
  win = window;
  visible = true;
}

app.on('ready', () => {
  listener('Delete')
  getGameWindow()
})

function listener(key) {
  globalShortcut.register(key, () => {
    console.log('Hotkey was pressed.')
    toggle()
  })
}

function toggle() {
  if (!visible) {
    win.show()
    visible = true;
  } else {
    win.hide()
    visible = false;
  }
}

function getGameWindow() {
  var processes = memoryjs.getProcesses();
  for (var i = 0; i < processes.length; i++) {
    if (processes[i].szExeFile == target) {
      processObject = memoryjs.openProcess(target);
      processHandle = processObject.handle;
      processPPiD = processObject.th32ProcessID;
      getWindowTitle()
    }
  }
}

function getWindowTitle() {
  exec('tasklist /FI "PID eq ' + processPPiD + '" /fo list /v', (err, stdout, stderr) => {
    var index = stdout.search("Window Title: ");
    var title = stdout.substring(index + 14, stdout.length-2)
    windowTitle = title;
    console.log(windowTitle)
    createWindow()
  });
}