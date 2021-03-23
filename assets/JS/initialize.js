const signatures = require('./signatures');
const memoryjs = require('memoryjs');
const { maxsaber1 } = require('./signatures');

function init(processObject) {
    //BASE
    var base = '0x'+memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.base, memoryjs.NORMAL, 0, 0).toString(16)

    //UNIVERSAL
    var modBase = processObject.modBaseAddr; //<-----------------------------------------------------------| Base Address

    //GOD MODE
    var address = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.health, memoryjs.NORMAL, 0, 0)
    var bytes = {
        1: memoryjs.readMemory(processObject.handle, address + 3, memoryjs.BYTE).toString(16),
        2: memoryjs.readMemory(processObject.handle, address + 4, memoryjs.BYTE).toString(16),
        3: memoryjs.readMemory(processObject.handle, address + 5, memoryjs.BYTE).toString(16),
        4: memoryjs.readMemory(processObject.handle, address + 6, memoryjs.BYTE).toString(16),
    }
    var ptr = '0x' + bytes['4'] + bytes['3'] + bytes['2'] + bytes['1']
    var next = address + 8;

    var health = next + parseInt(ptr); //<--------------------------------------------------------------| Health Address
    var invincible = next + parseInt(ptr) + 8; //<------------------------------------------------------| Invincible Address

    //RANK S - 1
    var address2 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.rank1, memoryjs.NORMAL, 0, 0)
    var next2 = address2 + 7;
    var bytes2 = {
        1: memoryjs.readMemory(processObject.handle, address2 + 3, memoryjs.BYTE).toString(16),
        2: memoryjs.readMemory(processObject.handle, address2 + 4, memoryjs.BYTE).toString(16),
        3: memoryjs.readMemory(processObject.handle, address2 + 5, memoryjs.BYTE).toString(16),
        4: memoryjs.readMemory(processObject.handle, address2 + 6, memoryjs.BYTE).toString(16),
    }
    var ptr2 = '0x' + bytes2['4'] + bytes2['3'] + bytes2['2'] + bytes2['1']
    var pointer = next2 + parseInt(ptr2)
    var dword = memoryjs.readMemory(processObject.handle, pointer, memoryjs.DWORD).toString(16)
    var rel = '0x' + dword.substring(1, dword.length)
    var lives = modBase + parseInt(rel); //<------------------------------------------------------------| Lives Address
    var ranks1 = lives + 1; //<-------------------------------------------------------------------------| Rank Address

    //RANK S - 2
    var address3 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.rank2, memoryjs.NORMAL, 0, 0)
    var bytes3 = {
        1: memoryjs.readMemory(processObject.handle, address3 + 2, memoryjs.BYTE).toString(16),
        2: memoryjs.readMemory(processObject.handle, address3 + 3, memoryjs.BYTE).toString(16),
        3: memoryjs.readMemory(processObject.handle, address3 + 4, memoryjs.BYTE).toString(16),
        4: memoryjs.readMemory(processObject.handle, address3 + 5, memoryjs.BYTE).toString(16),
    }
    var ptr3 = '0x' + bytes3['2'] + bytes3['1']
    var ptr4 = parseInt(ptr3)-0x100
    var ranks2 = invincible + parseInt(ptr4) //<--------------------------------------------------------| Rank 2 Address

    //RANK S - 3
    var address4 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.rank3, memoryjs.NORMAL, 0, 0)
    var ranks3 = address4-6; //<------------------------------------------------------------------------| Rank 3 Address

    //RANK S - 4
    var address5 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.rank4, memoryjs.NORMAL, 0, 0)
    var ranks4 = address5+14 //<------------------------------------------------------------------------| Rank 4 Address
    
    //INFINITE LIVES - 1
    var address6 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.infinitelives, memoryjs.NORMAL, 0, 0)
    var infinitelives1 = address6; //<------------------------------------------------------------------| Infinite Lives 1 Address

    //INFINITE LIVES - 2
    var infinitelives2 = address6+1; //<----------------------------------------------------------------| Infinite Lives 2 Address

    //CRYSTALS
    var address7 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.crystals1, memoryjs.NORMAL, 0, 0)
    var crystals1 = address7; //<=======================================================================| Crystals Update Address
    var bytes4 = {
        1: memoryjs.readMemory(processObject.handle, crystals1+3, memoryjs.BYTE).toString(16),
        2: memoryjs.readMemory(processObject.handle, crystals1+4, memoryjs.BYTE).toString(16)
    }
    var len = '0x'+(bytes4[2]+bytes4[1]).padStart(8, '0')
    var crystals2 = parseInt(base)+parseInt(len) //<----------------------------------------------------| Crystals Owned Address

    //CODENAME
    var codename1 = lives + 2; //<----------------------------------------------------------------------| Codename Address
    var codename2 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.codename1, memoryjs.NORMAL, 0, 0)
    var codename3 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.codename2, memoryjs.NORMAL, 23, 0)
    var codename4 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.codename3, memoryjs.NORMAL, 11, 0)

    //UNLOCK WEAPONS
    var address8 = memoryjs.findPattern(processObject.handle, processObject.szExeFile, signatures.weapons, memoryjs.NORMAL, 3, 0)
    var bytes5 = {
        1: memoryjs.readMemory(processObject.handle, address8,   memoryjs.BYTE).toString(16),
        2: memoryjs.readMemory(processObject.handle, address8+1, memoryjs.BYTE).toString(16)
    }
    var len2 = '0x'+(bytes5[2]+bytes5[1]).padStart(8, '0')
    var weapons = parseInt(base)+parseInt(len2) //<---------------------------------------------------| Weapons Unlocked Adddress

    //MAX WEAPONS
    
 
    var addresses = {
        'base'          : base,
        'health'        : health,
        'invincible'    : invincible,
        'ranks1'        : ranks1,
        'ranks2'        : ranks2,
        'ranks3'        : ranks3,
        'ranks4'        : ranks4,
        'infinitelives1': infinitelives1,
        'infinitelives2': infinitelives2,
        'lives'         : lives,
        'crystals1'     : crystals1,
        'crystals2'     : crystals2,
        'codename1'     : codename1,
        'codename2'     : codename2,
        'codename3'     : codename3,
        'codename4'     : codename4,
        'weapons'       : weapons,
    }
    var readable = {
        'base'          : base.toString(16).toUpperCase(),
        'health'        : health.toString(16).toUpperCase(),
        'invincible'    : invincible.toString(16).toUpperCase(),
        'ranks1'        : ranks1.toString(16).toUpperCase(),
        'ranks2'        : ranks2.toString(16).toUpperCase(),
        'ranks3'        : ranks3.toString(16).toUpperCase(),
        'ranks4'        : ranks4.toString(16).toUpperCase(),
        'infinitelives1': infinitelives1.toString(16).toUpperCase(),
        'infinitelives2': infinitelives2.toString(16).toUpperCase(),
        'lives'         : lives.toString(16).toUpperCase(),
        'crystals1'     : crystals1.toString(16).toUpperCase(),
        'crystals2'     : crystals2.toString(16).toUpperCase(),
        'codename1'     : codename1.toString(16).toUpperCase(),
        'codename2'     : codename2.toString(16).toUpperCase(),
        'codename3'     : codename3.toString(16).toUpperCase(),
        'codename4'     : codename4.toString(16).toUpperCase(),
        'weapons'       : weapons.toString(16).toUpperCase()
    }
    console.log(readable)
    return addresses
}

module.exports = init;