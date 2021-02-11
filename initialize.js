const signatures = require('./assets/JS/signatures');
const memoryjs = require('memoryjs');

function init(processObject) {
    //UNIVERSAL
    var base = processObject.modBaseAddr; //<-----------------------------------------------------------| Base Address

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

    var health = next + parseInt(ptr); //<-------------------------------------------------------------| Health Address
    var invincible = health + 8; //<-------------------------------------------------------------------| Invincible Address

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
    var lives = base + parseInt(rel); //<--------------------------------------------------------------| Lives Address
    var ranks1 = lives + 1; //<------------------------------------------------------------------------| Rank 1 Address

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
    console.log(address6.toString(16))

    var addresses = {
        'health'        : health,
        'invincible'    : invincible,
        'ranks1'        : ranks1,
        'ranks2'        : ranks2,
        'ranks3'        : ranks3,
        'ranks4'        : ranks4,
        'infinitelives1': infinitelives1,
        'infinitelives2': infinitelives2,
        'lives'         : lives,
    }
    return addresses
}

module.exports = init;