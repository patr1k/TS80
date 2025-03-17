import { BYTE, Device, R8, WORD, DECOMP } from "./Utils";

function add_A_r8(dev: Device, r8: R8) {
    DECOMP(`ADD A, ${r8}`);
    const reg = r8 === '[HL]' ? dev.mem.read(dev.cpu.reg.HL) : dev.cpu.reg[r8];
    const result16 = WORD(dev.cpu.reg.A + reg);
    const result8 = BYTE(result16);
    const half = ((dev.cpu.reg.A ^ reg ^ result8) & 0x10) > 0;
    const carry = (result16 & 0x100) > 0;

    dev.cpu.reg.A = result8;
    dev.cpu.reg.flag.N = false;
    dev.cpu.reg.flag.Z = result8 === 0;
    dev.cpu.reg.flag.H = half;
    dev.cpu.reg.flag.C = carry;
}

function adc_A_r8(dev: Device, r8: R8) {
    DECOMP(`ADC A, ${r8}`);
    const reg = r8 === '[HL]' ? dev.mem.read(dev.cpu.reg.HL) : dev.cpu.reg[r8];
    const result16 = WORD(dev.cpu.reg.A + reg + (dev.cpu.reg.flag.C ? 1 : 0));
    const result8 = BYTE(result16);
    const half = ((dev.cpu.reg.A ^ reg ^ result8) & 0x10) > 0;
    const carry = (result16 & 0x100) > 0;

    dev.cpu.reg.A = result8;
    dev.cpu.reg.flag.N = false;
    dev.cpu.reg.flag.Z = result8 === 0;
    dev.cpu.reg.flag.H = Boolean(half);
    dev.cpu.reg.flag.C = Boolean(carry);
}

function sub_A_r8(dev: Device, r8: R8) {
    DECOMP(`SUB A, ${r8}`);
    const reg = r8 === '[HL]' ? dev.mem.read(dev.cpu.reg.HL) : dev.cpu.reg[r8];
    const result16 = WORD(dev.cpu.reg.A - reg);
    const result8 = BYTE(result16);
    const half = ((dev.cpu.reg.A ^ reg ^ result8) & 0x10) > 0;
    const carry = (result16 & 0x100) > 0;

    dev.cpu.reg.A = result8;
    dev.cpu.reg.flag.N = true;
    dev.cpu.reg.flag.Z = result8 === 0;
    dev.cpu.reg.flag.H = half;
    dev.cpu.reg.flag.C = carry;
}

function sbc_A_r8(dev: Device, r8: R8) {
    DECOMP(`SBC A, ${r8}`);
    const reg = r8 === '[HL]' ? dev.mem.read(dev.cpu.reg.HL) : dev.cpu.reg[r8];
    const result16 = WORD(dev.cpu.reg.A - reg - (dev.cpu.reg.flag.C ? 1 : 0));
    const result8 = BYTE(result16);
    const half = ((dev.cpu.reg.A ^ reg ^ result8) & 0x10) > 0;
    const carry = (result16 & 0x100) > 0;

    dev.cpu.reg.A = result8;
    dev.cpu.reg.flag.N = true;
    dev.cpu.reg.flag.Z = result8 === 0;
    dev.cpu.reg.flag.H = half;
    dev.cpu.reg.flag.C = carry;
}

function and_A_r8(dev: Device, r8: R8) {
    DECOMP(`AND A, ${r8}`);
    dev.cpu.reg.A &= r8 === '[HL]' ? dev.mem.read(dev.cpu.reg.HL) : dev.cpu.reg[r8];
    dev.cpu.reg.flag.N = false;
    dev.cpu.reg.flag.C = false;
    dev.cpu.reg.flag.H = true;
    dev.cpu.reg.flag.Z = dev.cpu.reg.A === 0;
}

function xor_A_r8(dev: Device, r8: R8) {
    DECOMP(`XOR A, ${r8}`);
    dev.cpu.reg.A ^= r8 === '[HL]' ? dev.mem.read(dev.cpu.reg.HL) : dev.cpu.reg[r8];
    dev.cpu.reg.flag.N = false;
    dev.cpu.reg.flag.C = false;
    dev.cpu.reg.flag.H = false;
    dev.cpu.reg.flag.Z = dev.cpu.reg.A === 0;
}

function or_A_r8(dev: Device, r8: R8) {
    DECOMP(`OR A, ${r8}`);
    dev.cpu.reg.A |= r8 === '[HL]' ? dev.mem.read(dev.cpu.reg.HL) : dev.cpu.reg[r8];
    dev.cpu.reg.flag.N = false;
    dev.cpu.reg.flag.C = false;
    dev.cpu.reg.flag.H = false;
    dev.cpu.reg.flag.Z = dev.cpu.reg.A === 0;
}

function cp_A_r8(dev: Device, r8: R8) {
    DECOMP(`CP A, ${r8}`);
    const reg = r8 === '[HL]' ? dev.mem.read(dev.cpu.reg.HL) : dev.cpu.reg[r8];
    const result16 = WORD(dev.cpu.reg.A - reg);
    const result8 = BYTE(result16);
    const half = ((dev.cpu.reg.A ^ reg ^ result8) & 0x10) > 0;
    const carry = (result16 & 0x100) > 0;

    dev.cpu.reg.flag.N = true;
    dev.cpu.reg.flag.Z = result8 === 0;
    dev.cpu.reg.flag.H = half;
    dev.cpu.reg.flag.C = carry;
}


export { 
    add_A_r8, adc_A_r8, sub_A_r8, sbc_A_r8, and_A_r8, xor_A_r8, or_A_r8, cp_A_r8
};