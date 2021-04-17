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

//target
var target = 'MZZXLC.exe'

//globals
var win;
var visible;
var processObject;

//timers
var waitingT;
var hotkeyT;

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
  window.setContentProtection(false)
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
  logInput()
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
    memoryjs.writeMemory(processObject.handle, addresses.weapons, weapons, memoryjs.INT);
  }
}

function UnlockElements(on) {

}

function MaxWeapons(on) {
  if (on) {
    saber1 = memoryjs.readMemory(processObject.handle, addresses.saber1, memoryjs.INT);
    saber2 = memoryjs.readMemory(processObject.handle, addresses.saber2, memoryjs.INT);
    saberD = memoryjs.readMemory(processObject.handle, addresses.saberD, memoryjs.INT);
    saberJ = memoryjs.readMemory(processObject.handle, addresses.saberJ, memoryjs.INT);
    buster1 = memoryjs.readMemory(processObject.handle, addresses.buster1, memoryjs.INT);
    buster2 = memoryjs.readMemory(processObject.handle, addresses.buster2, memoryjs.INT);
    rod1 = memoryjs.readMemory(processObject.handle, addresses.rod1, memoryjs.INT);
    rod2 = memoryjs.readMemory(processObject.handle, addresses.rod2, memoryjs.INT);
    boomerang1 = memoryjs.readMemory(processObject.handle, addresses.boomerang1, memoryjs.INT);
    boomerang2 = memoryjs.readMemory(processObject.handle, addresses.boomerang2, memoryjs.INT);
    memoryjs.writeMemory(processObject.handle, addresses.saber1, 0x0F, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.saber2, 0x27, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.saberD, 0x64, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.saberJ, 0x64, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.buster1, 0xDC, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.buster2, 0x05, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.rod1, 0xB8, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.rod2, 0x0B, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.boomerang1, 0xF4, memoryjs.BYTE);
    memoryjs.writeMemory(processObject.handle, addresses.boomerang2, 0x01, memoryjs.BYTE);
  } else {
    memoryjs.writeMemory(processObject.handle, addresses.saber1, saber1, memoryjs.INT);
    memoryjs.writeMemory(processObject.handle, addresses.saber2, saber2, memoryjs.INT);
    memoryjs.writeMemory(processObject.handle, addresses.saberD, saberD, memoryjs.INT);
    memoryjs.writeMemory(processObject.handle, addresses.saberJ, saberJ, memoryjs.INT);
    memoryjs.writeMemory(processObject.handle, addresses.buster1, buster1, memoryjs.INT);
    memoryjs.writeMemory(processObject.handle, addresses.buster2, buster2, memoryjs.INT);
    memoryjs.writeMemory(processObject.handle, addresses.rod1, rod1, memoryjs.INT);
    memoryjs.writeMemory(processObject.handle, addresses.rod2, rod2, memoryjs.INT);
    memoryjs.writeMemory(processObject.handle, addresses.boomerang1, boomerang1, memoryjs.INT);
    memoryjs.writeMemory(processObject.handle, addresses.boomerang2, boomerang2, memoryjs.INT);
  }
}

function logInput() {
  var flying = false;
  var cooldown = false;

  original1 = memoryjs.readMemory(processObject.handle, 0x140407721, memoryjs.BYTE);
  original2 = memoryjs.readMemory(processObject.handle, 0x140407722, memoryjs.BYTE);
  original3 = memoryjs.readMemory(processObject.handle, 0x140407723, memoryjs.BYTE);
  original4 = memoryjs.readMemory(processObject.handle, 0x140407724, memoryjs.BYTE);
  original5 = memoryjs.readMemory(processObject.handle, 0x140407725, memoryjs.BYTE);
  original6 = memoryjs.readMemory(processObject.handle, 0x140407726, memoryjs.BYTE);
  //
  original7 = memoryjs.readMemory(processObject.handle, 0x140407634, memoryjs.BYTE);
  original8 = memoryjs.readMemory(processObject.handle, 0x140407635, memoryjs.BYTE);
  original9 = memoryjs.readMemory(processObject.handle, 0x140407636, memoryjs.BYTE);
  original10 = memoryjs.readMemory(processObject.handle, 0x140407637, memoryjs.BYTE);
  original11 = memoryjs.readMemory(processObject.handle, 0x140407638, memoryjs.BYTE);
  original12 = memoryjs.readMemory(processObject.handle, 0x140407639, memoryjs.BYTE);

  ioHook.on('keydown', event => {
    if (event.rawcode == 164 && flying == false && cooldown == false) {
        console.log("hovering")
        flying = true
        memoryjs.writeMemory(processObject.handle, 0x140407721, 0x90, memoryjs.BYTE);
        memoryjs.writeMemory(processObject.handle, 0x140407722, 0x90, memoryjs.BYTE);
        memoryjs.writeMemory(processObject.handle, 0x140407723, 0x90, memoryjs.BYTE);
        memoryjs.writeMemory(processObject.handle, 0x140407724, 0x90, memoryjs.BYTE);
        memoryjs.writeMemory(processObject.handle, 0x140407725, 0x90, memoryjs.BYTE);
        memoryjs.writeMemory(processObject.handle, 0x140407726, 0x90, memoryjs.BYTE);
        //
        memoryjs.writeMemory(processObject.handle, 0x140407634, 0x90, memoryjs.BYTE);
        memoryjs.writeMemory(processObject.handle, 0x140407635, 0x90, memoryjs.BYTE);
        memoryjs.writeMemory(processObject.handle, 0x140407636, 0x90, memoryjs.BYTE);
        memoryjs.writeMemory(processObject.handle, 0x140407637, 0x90, memoryjs.BYTE);
        memoryjs.writeMemory(processObject.handle, 0x140407638, 0x90, memoryjs.BYTE);
        memoryjs.writeMemory(processObject.handle, 0x140407639, 0x90, memoryjs.BYTE);

        cooldown = true;
        console.log(cooldown)
      }
    //up
    else if (event.rawcode == 38 && event.altKey == true) {

        hotkeyT = setTimeout(function () {
          console.log("flying up")

        }, 100);
      }
      //down
      else if (event.rawcode == 40 && event.altKey == true) {
        hotkeyT = setTimeout(function () {
          console.log("falling down")
        }, 100);
      }
    })

  ioHook.on('keyup', event => {
    //alt
    if (event.rawcode == 164 && flying == true && cooldown == true) {
      //clearTimeout(hotkeyT)
      console.log('done')
      flying = false;
      memoryjs.writeMemory(processObject.handle, 0x140407721, original1, memoryjs.BYTE);
      memoryjs.writeMemory(processObject.handle, 0x140407722, original2, memoryjs.BYTE);
      memoryjs.writeMemory(processObject.handle, 0x140407723, original3, memoryjs.BYTE);
      memoryjs.writeMemory(processObject.handle, 0x140407724, original4, memoryjs.BYTE);
      memoryjs.writeMemory(processObject.handle, 0x140407725, original5, memoryjs.BYTE);
      memoryjs.writeMemory(processObject.handle, 0x140407726, original6, memoryjs.BYTE);

      memoryjs.writeMemory(processObject.handle, 0x140407634, original7, memoryjs.BYTE);
      memoryjs.writeMemory(processObject.handle, 0x140407635, original8, memoryjs.BYTE);
      memoryjs.writeMemory(processObject.handle, 0x140407636, original9, memoryjs.BYTE);
      memoryjs.writeMemory(processObject.handle, 0x140407637, original10, memoryjs.BYTE);
      memoryjs.writeMemory(processObject.handle, 0x140407638, original11, memoryjs.BYTE);
      memoryjs.writeMemory(processObject.handle, 0x140407639, original12, memoryjs.BYTE);
      hotkeyT = setTimeout(function () {
        cooldown = false
        console.log(cooldown)
      }, 500);
    }
    //up
    else if (event.rawcode == 38 && event.altKey == true) {
      clearTimeout(hotkeyT)
      console.log("done")
    }
    //down
    else if (event.rawcode == 40 && event.altKey == true) {
      clearTimeout(hotkeyT)
      console.log("done")
    }
  })
  ioHook.start();
}