//dependencies
const { app, BrowserWindow, globalShortcut } = require('electron')
const { overlayWindow } = require('electron-overlay-window')
const { exec } = require('child_process')
const memoryjs = require('memoryjs')
const ioHook = require('iohook')

//target
//var target = 'notepad.exe'
var target = 'MZZXLC.exe'

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
    ...overlayWindow.WINDOW_OPTS
  })

  window.loadFile('./assets/HTML/index.html')
  window.setIgnoreMouseEvents(true)
  overlayWindow.attachTo(window, windowTitle)
  win = window;
  visible = true;
}

function listener() {
  ioHook.on('keydown', event => {
      if (event.rawcode == 45 || event.rawcode == 46) {
          toggle()
      }
  })
  ioHook.start();
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
    var title = stdout.substring(index + 14, stdout.length-2)
    windowTitle = title;
    createWindow()
  });
}

app.on('ready', () => {
  main()
  listener()
})