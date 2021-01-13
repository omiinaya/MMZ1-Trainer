//dependencies
const { app, BrowserWindow, globalShortcut } = require('electron')
const { overlayWindow } = require('electron-overlay-window')
const { exec } = require('child_process')

//globals
var win;
var visible;

function createWindow() {
  const window = new BrowserWindow({
    width: 400,
    height: 300,
    ...overlayWindow.WINDOW_OPTS
  })

  window.loadFile('index.html')
  window.setIgnoreMouseEvents(true)
  overlayWindow.attachTo(window, 'Untitled - Notepad')
  win = window;
  visible = true;
}

app.on('ready', () => {
  createWindow()
  listener('Delete')
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

exec('tasklist /FI "PID eq 18852" /fo list /v', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});