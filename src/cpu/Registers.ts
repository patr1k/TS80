import { HI, LO, MAKEWORD } from "./Utils";

interface Flags {
    Z: boolean,
    N: boolean,
    H: boolean,
    C: boolean
}

export default class Registers
{
    // 8-bit registers
    public A: number;
    public B: number;
    public C: number;
    public D: number;
    public E: number;
    public H: number;
    public L: number;

    // 16-bit registers
    public SP: number;
    public PC: number;

    public flag: Flags = {
        Z: false,
        N: false,
        H: false,
        C: false
    };

    constructor() {
        this.A = 0;
        this.B = 0;
        this.C = 0;
        this.D = 0;
        this.E = 0;
        this.H = 0;
        this.L = 0;

        this.SP = 0;
        this.PC = 0;
    }

    get AF() {
        return MAKEWORD(this.A, this.F);
    }

    set AF(val: number) {
        this.A = HI(val);
        this.F = LO(val);
    }

    get BC() {
        return MAKEWORD(this.B, this.C);
    }

    set BC(val: number) {
        this.B = HI(val);
        this.C = LO(val);
    }

    get DE() {
        return MAKEWORD(this.D, this.E);
    }

    set DE(val: number) {
        this.D = HI(val);
        this.E = LO(val);
    }

    get HL() {
        return MAKEWORD(this.H, this.L);
    }

    set HL(val: number) {
        this.H = HI(val);
        this.L = LO(val);
    }

    get F() {
        return (this.flag.Z ? 0x80 : 0) | (this.flag.N ? 0x40 : 0) | (this.flag.H ? 0x20 : 0) | (this.flag.C ? 0x10 : 0);
    }

    set F(val: number) {
        this.flag.Z = (val & 0x80) > 0;
        this.flag.N = (val & 0x40) > 0;
        this.flag.H = (val & 0x20) > 0;
        this.flag.C = (val & 0x10) > 0;
    }
}