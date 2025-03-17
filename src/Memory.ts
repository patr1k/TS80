import BootROM from "./roms/BootROM";
import TetrisROM from "./roms/Tetris";

export default class Memory 
{
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
    private IO: Uint8Array;

    // High RAM (0xFF80 - 0xFFFE)
    private HRAM: Uint8Array;

    // Interrupt Enable Register (0xFFFF)
    private IER: number;

    private BootROM: Uint8Array;
    private isBootRomMapped: boolean;

    constructor() {
        this.ROM = new Uint8Array(0x4000);
        this.ROM_Banks = [new Uint8Array(0x4000)];
        this.VRAM_Banks = [new Uint8Array(0x2000)];
        this.XRAM_Banks = [];
        this.WRAM = new Uint8Array(0x1000);
        this.WRAM_Banks = [new Uint8Array(0x1000)];
        this.OAM = new Uint8Array(0xA0);
        this.IO = new Uint8Array(0x4C);
        this.HRAM = new Uint8Array(0x80);
        this.IER = 0;

        this.BootROM = BootROM;
        this.isBootRomMapped = false;
    }

    loadTetris() {
        this.isBootRomMapped = true;
        this.ROM.set(TetrisROM.slice(0, 0x4000), 0);
        this.ROM_Banks[0].set(TetrisROM.slice(0x4000), 0);
    }

    read(addr: number): number {
        if (addr < 0x4000) {
            if (addr < 0x100 && this.isBootRomMapped)
                return this.BootROM[addr];
            else
                return this.ROM[addr];
        } else if (addr < 0x8000) {
            return this.ROM_Banks[0][addr - 0x4000];
        } else if (addr < 0xA000) {
            return this.VRAM_Banks[0][addr - 0x8000];
        } else if (addr < 0xC000) {
            throw Error("Cannot read from external RAM");
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
            throw Error("Cannot read from unused address space");
        } else if (addr < 0xFF80) {
            return this.IO[addr - 0xFF00];
        } else if (addr < 0xFFFF) {
            return this.HRAM[addr - 0xFF80];
        } else if (addr === 0xFFFF) {
            return this.IER;
        }

        throw Error("Cannot read from out-of-scope address space");
    }

    write(addr: number, value: number) {
        if (addr < 0x8000) {
            throw Error("Cannot write to ROM address space");
        } else if (addr < 0xA000) {
            this.VRAM_Banks[0][addr - 0x8000] = value;
        } else if (addr < 0xC000) {
            throw Error("Cannot write to external RAM");
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
            throw Error("Cannot read from unused address space");
        } else if (addr < 0xFF80) {
            this.IO[addr - 0xFF00] = value;
        } else if (addr < 0xFFFF) {
            this.HRAM[addr - 0xFF80] = value;
        } else if (addr === 0xFFFF) {
            this.IER = value;
        } else {
            throw Error(`Cannot write to out-of-scope address space: 0x${addr.toString(16)}`);
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
}