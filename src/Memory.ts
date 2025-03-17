import CPU from "./CPU";
import { HEX_BYTE, HEX_WORD } from "./cpu/Utils";
import GameBoy from "./GameBoy";
import IO from "./IO";
import MBC from "./MBC";
import BootROM from "./roms/BootROM";
import TetrisROM from "./roms/Tetris";

export default class Memory 
{
    // CPU reference
    private dev: GameBoy;

    // Cart ROM (0x0000 - 0x3FFF)
    private ROM: Uint8Array;

    // Cart ROM Banks 1-N (0x4000 - 0x7FFF)
    private ROM_Banks: Uint8Array[];

    // Video RAM (0x8000 - 0x9FFF)
    private VRAM_Banks: Uint8Array[];

    // External RAM (0xA000 - 0xBFFF)
    private XRAM_Banks: Uint8Array[];

    // Internal RAM Bank 0 (0xC000 - 0xCFFF)
    private WRAM: Uint8Array;

    // Internal RAM Banks 1-7 (0xD000 - 0xDFFF)
    private WRAM_Banks: Uint8Array[];

    // Sprite Attribute Table (0xFE00 - 0xFE9F)
    private OAM: Uint8Array;

    // I/O Ports (0xFF00 - 0xFF7F)
    private IO: IO;

    // High RAM (0xFF80 - 0xFFFE)
    private HRAM: Uint8Array;

    // Interrupt Enable Register (0xFFFF)
    private IER: number;

    // Multi-Bank Cartridge Chip
    private MBC: MBC;

    // Boot ROM Data
    private BootROM: Uint8Array;

    // Is the Boot ROM currently mapped?
    public IsBootRomMapped: boolean;

    constructor(dev: GameBoy) {
        this.dev = dev;
        this.ROM = new Uint8Array(0x4000);
        this.ROM_Banks = [new Uint8Array(0x4000)];
        this.VRAM_Banks = [new Uint8Array(0x2000)];
        this.XRAM_Banks = [];
        this.WRAM = new Uint8Array(0x1000);
        this.WRAM_Banks = [new Uint8Array(0x1000)];
        this.OAM = new Uint8Array(0xA0);
        this.IO = new IO(dev);
        this.HRAM = new Uint8Array(0x80);
        this.IER = 0;
        this.MBC = new MBC();

        this.BootROM = BootROM;
        this.IsBootRomMapped = false;
    }

    loadTetris() {
        this.IsBootRomMapped = true;
        this.ROM.set(TetrisROM.slice(0, 0x4000), 0);
        this.ROM_Banks[0].set(TetrisROM.slice(0x4000), 0);
    }

    read(addr: number): number {
        if (addr < 0x4000) {
            if (addr < 0x100 && this.IsBootRomMapped)
                return this.BootROM[addr];
            else
                return this.ROM[addr];
        } else if (addr < 0x8000) {
            return this.ROM_Banks[0][addr - 0x4000];
        } else if (addr < 0xA000) {
            return this.VRAM_Banks[0][addr - 0x8000];
        } else if (addr < 0xC000) {
            throw Error(`Cannot read from external RAM: $${HEX_WORD(addr)}`);
            return this.XRAM_Banks[0][addr - 0xA000];
        } else if (addr < 0xD000) {
            return this.WRAM[addr - 0xC000];
        } else if (addr < 0xE000) {
            return this.WRAM_Banks[0][addr - 0xD000];
        } else if (addr < 0xFE00) {
            return this.read(addr - 0x2000);
        } else if (addr < 0xFEA0) {
            return this.OAM[addr - 0xFE00];
        } else if (addr < 0xFF00) {
            throw Error(`Cannot read from unused address space: $${HEX_WORD(addr)}`);
        } else if (addr < 0xFF80) {
            return this.IO.read(addr - 0xFF00);
        } else if (addr < 0xFFFF) {
            return this.HRAM[addr - 0xFF80];
        } else if (addr === 0xFFFF) {
            return this.IER;
        }

        throw Error("Cannot read from out-of-scope address space");
    }

    write(addr: number, value: number) {
        if (addr < 0x8000) {
            this.MBC.write(addr, value);
        } else if (addr < 0xA000) {
            this.VRAM_Banks[0][addr - 0x8000] = value;
        } else if (addr < 0xC000) {
            throw Error(`Cannot write to external RAM: $${HEX_WORD(addr)}`);
            return this.XRAM_Banks[0][addr - 0xA000];
        } else if (addr < 0xD000) {
            this.WRAM[addr - 0xC000] = value;
        } else if (addr < 0xE000) {
            this.WRAM_Banks[0][addr - 0xD000] = value;
        } else if (addr < 0xFE00) {
            this.write(addr - 0x2000, value);
        } else if (addr < 0xFEA0) {
            this.OAM[addr - 0xFE00] = value;
        } else if (addr < 0xFF00) {
            // Unused space... but apparently some games write to this
        } else if (addr < 0xFF80) {
            this.IO.write(addr - 0xFF00, value);
        } else if (addr < 0xFFFF) {
            this.HRAM[addr - 0xFF80] = value;
        } else if (addr === 0xFFFF) {
            this.IER = value;
        } else {
            throw Error(`Cannot write to out-of-scope address space: $${HEX_WORD(addr)}`);
        }
    }

    inc(addr: number) {
        let val = this.read(addr);
        this.write(addr, (val + 1) & 0xFF);
    }

    dec(addr: number) {
        let val = this.read(addr);
        this.write(addr, (val - 1) & 0xFF);
    }

    vram_slice(src: number, len: number): Uint8Array {
        return this.VRAM_Banks[0].slice(src - 0x8000, (src + len) - 0x8000);
    }

    tick() {
        this.IO.tick();
    }

    debug() {
        const memtxt = document.getElementById('memdbg');
        if (!memtxt) return;

        let txt = '      0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F';
        let addr = 0x8000;
        for (let i = 0; i < 0x2000; i++) {
            if ((i % 0x10) === 0) {
                txt += "\n";
                txt += HEX_WORD(addr) + ' ';
                addr += 0x10;
            }
            txt += HEX_BYTE(this.VRAM_Banks[0][i]) + ' ';
        }
        memtxt.innerHTML = txt;
    }
}