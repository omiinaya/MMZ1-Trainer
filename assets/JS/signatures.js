const signatures = {
    base: '30 8B 50 42 01 00 00 00 30 8B 50 42 01 00',
    health: '66 83 3D 42 48 1F 02 00 75 0D E8 13 84 F6 00',
    god: '2A C2 88 41 39 C3',
    rank1: '48 8B 05 B6 7B 30 02 44 8D 46 FE',
    rank2: '88 8B 28 02 00 00 48 8B 05 6A FC 22 02',
    rank3: '48 8B 05 6A FC 22 02',
    rank4: '41 3B 84 96 F8 6E D2 01 7D F0 40 0F B6 CE 45 88 41 01',
    infinitelives: '? ? BA 00 02 00 00 48 8B CB E8 AF 22 01 00',
    nopushback: '41 83 E1 01 E8 27 2C 00 00 48 8B 5C 24 40', 
    crystals1: '66 89 81 AE 02 00 00',
    codename1: '44 88 50 03 4C 8B 05 C5 55 1C 02',
    codename2: '48 8D 3D 03 0D B9 FF 45 0F B6 59 01 45 0F B6 51 02 74 0A 41 C6 41 02 12',
    codename3: '48 8B 0D 7F 55 1C 02 0F B6 41 02 88 41 05',
    weapons: '0F 10 81 38 02 00 00 0F 11 42 10',
    maxsaber1: '42 0F B6 94 10 A8 17 D1 01 0F B7 81 3E 02 00 00'
}

module.exports = signatures;
