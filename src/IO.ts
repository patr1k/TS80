import CPU from "./CPU";
import { HEX_BYTE, PTR_8 } from "./cpu/Utils";
import GameBoy from "./GameBoy";
import { INT_IE, INT_IF, INT_JOYPAD, INT_SERIAL, INT_STAT, INT_TIMER, INT_VBLANK } from "./Interrupt";
import { LCD_CONTROL, LCD_Y_COORD } from "./ppu/Utils";
import { TAC_CLK_SPEEDS, TIMER_DIV, TIMER_TAC, TIMER_TIMA, TIMER_TMA } from "./Timer";

export default class IO 
{
    private dev: GameBoy;
    private mem: Uint8Array;
    private ppu_dot: number;

    constructor(dev: GameBoy) {
        this.dev = dev;
        this.mem = new Uint8Array(0x4C);
        this.ppu_dot = 0;
    }

    write(addr: number, value: number) {
        this.mem[addr] = value;

        if (addr === 0x00) {
            return;
        }

        if (addr === TIMER_DIV) {
            this.mem[TIMER_DIV] = 0;
            return;
        }
    }

    read(addr: number) {
        return this.mem[addr];
    }

    tick() {
        this.ppu_dot += 4;
        if (this.ppu_dot > 70224) {
            this.ppu_dot = 0;
            this.mem[LCD_Y_COORD[PTR_8]] = 0;
            this.mem[INT_IF[PTR_8]] &= ~INT_VBLANK;
        } else {
            if ((this.ppu_dot % 456) === 0) {
                this.mem[LCD_Y_COORD[PTR_8]]++;
                if (this.mem[LCD_Y_COORD[PTR_8]] === 144) {
                    this.mem[INT_IF[PTR_8]] |= INT_VBLANK;
                }
            }
        }

        // Timer IO
        this.mem[TIMER_DIV]++;

        const TAC = this.mem[TIMER_TAC];

        if (TAC & 0x04) {
            const incr_speed = TAC_CLK_SPEEDS[TAC & 0x03];
            if (!(this.mem[TIMER_DIV] % incr_speed)) {
                this.mem[TIMER_TIMA]++;
                if (!this.mem[TIMER_TIMA]) {
                    // TODO: Trigger timer interrupt
                    this.mem[TIMER_TIMA] = this.mem[TIMER_TMA];
                }
            }
        }

        // Check interrupts
        if (this.dev.cpu.IME) {
            const IE = this.mem[INT_IE[PTR_8]];
            const IF = this.mem[INT_IF[PTR_8]];

            if ((IE & INT_VBLANK) && (IF & INT_VBLANK))
                this.dev.cpu.interrupt(0x40);
            
            if ((IE & INT_STAT) && (IF & INT_STAT))
                this.dev.cpu.interrupt(0x48);

            if ((IE & INT_TIMER) && (IF & INT_TIMER))
                this.dev.cpu.interrupt(0x50);

            if ((IE & INT_SERIAL) && (IF & INT_SERIAL))
                this.dev.cpu.interrupt(0x58);

            if ((IE & INT_JOYPAD) && (IF & INT_JOYPAD))
                this.dev.cpu.interrupt(0x60);
        }
    }
}