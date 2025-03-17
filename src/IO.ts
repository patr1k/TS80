import { TAC_CLK_SPEEDS, TIMER_DIV, TIMER_TAC, TIMER_TIMA, TIMER_TMA } from "./Timer";

export default class IO 
{
    private mem: Uint8Array;

    constructor() {
        this.mem = new Uint8Array(0x4C);
    }

    write(addr: number, value: number) {
        this.mem[addr] = value;

        if (addr === TIMER_DIV) {
            this.mem[TIMER_DIV] = 0;
        }
    }

    read(addr: number) {
        return this.mem[addr];
    }

    tick() {
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
    }
}