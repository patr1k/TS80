import { BYTE, Device, R8, DECOMP } from "./Utils";

function bit_u3_r8(dev: Device, bit: number, r8: R8) {
    DECOMP(`BIT ${bit}, ${r8}`);
    const reg = r8 === '[HL]' ? dev.mem.read(dev.cpu.reg.HL) : dev.cpu.reg[r8];
    dev.cpu.reg.flag.Z = (reg & (1 << bit)) == 0;
    dev.cpu.reg.flag.N = false;
    dev.cpu.reg.flag.H = true;
}

function rlc_r8(dev: Device, r8: R8) {
    DECOMP(`RLC ${r8}`);
    let reg = r8 === '[HL]' ? dev.mem.read(dev.cpu.reg.HL) : dev.cpu.reg[r8];
    const carry = (reg & 0x80) ? 1 : 0;
    reg = BYTE(reg << 1) | carry;

    if (r8 === '[HL]')
        dev.mem.write(dev.cpu.reg.HL, reg);
    else
        dev.cpu.reg[r8] = reg;

    dev.cpu.reg.flag.Z = reg === 0;
    dev.cpu.reg.flag.N = false;
    dev.cpu.reg.flag.H = false;
    dev.cpu.reg.flag.C = Boolean(carry);
}

function rrc_r8(dev: Device, r8: R8) {
    DECOMP(`RRC ${r8}`);
    let reg = r8 === '[HL]' ? dev.mem.read(dev.cpu.reg.HL) : dev.cpu.reg[r8];
    const carry = reg & 0x01;
    reg = (reg >> 1) | (carry ? 0x80 : 0);

    if (r8 === '[HL]')
        dev.mem.write(dev.cpu.reg.HL, reg);
    else
        dev.cpu.reg[r8] = reg;

    dev.cpu.reg.flag.Z = reg === 0;
    dev.cpu.reg.flag.N = false;
    dev.cpu.reg.flag.H = false;
    dev.cpu.reg.flag.C = Boolean(carry);
}

function rl_r8(dev: Device, r8: R8) {
    DECOMP(`RL ${r8}`);
    let reg = r8 === '[HL]' ? dev.mem.read(dev.cpu.reg.HL) : dev.cpu.reg[r8];

    const carry = (reg & 0x80) ? 1 : 0;
    reg = BYTE(reg << 1) | (dev.cpu.reg.flag.C ? 1 : 0);

    if (r8 === '[HL]')
        dev.mem.write(dev.cpu.reg.HL, reg);
    else
        dev.cpu.reg[r8] = reg;

    dev.cpu.reg.flag.Z = reg === 0;
    dev.cpu.reg.flag.N = false;
    dev.cpu.reg.flag.H = false;
    dev.cpu.reg.flag.C = Boolean(carry);
}

function rr_r8(dev: Device, r8: R8) {
    DECOMP(`RR ${r8}`);
    let reg = r8 === '[HL]' ? dev.mem.read(dev.cpu.reg.HL) : dev.cpu.reg[r8];

    const carry = reg & 0x01;
    reg = BYTE(reg << 1) | (dev.cpu.reg.flag.C ? 0x80 : 0);

    if (r8 === '[HL]')
        dev.mem.write(dev.cpu.reg.HL, reg);
    else
        dev.cpu.reg[r8] = reg;

    dev.cpu.reg.flag.Z = reg === 0;
    dev.cpu.reg.flag.N = false;
    dev.cpu.reg.flag.H = false;
    dev.cpu.reg.flag.C = Boolean(carry);
}

function sla_r8(dev: Device, r8: R8) {
    DECOMP(`SLA ${r8}`);
    let reg = r8 === '[HL]' ? dev.mem.read(dev.cpu.reg.HL) : dev.cpu.reg[r8];

    const carry = (reg & 0x80) ? 1 : 0;
    reg = BYTE(reg << 1);

    if (r8 === '[HL]')
        dev.mem.write(dev.cpu.reg.HL, reg);
    else
        dev.cpu.reg[r8] = reg;

    dev.cpu.reg.flag.Z = reg === 0;
    dev.cpu.reg.flag.N = false;
    dev.cpu.reg.flag.H = false;
    dev.cpu.reg.flag.C = Boolean(carry);
}

function sra_r8(dev: Device, r8: R8) {
    DECOMP(`SRA ${r8}`);
    let reg = r8 === '[HL]' ? dev.mem.read(dev.cpu.reg.HL) : dev.cpu.reg[r8];

    reg = (reg >> 1) | (reg & 0x80);

    if (r8 === '[HL]')
        dev.mem.write(dev.cpu.reg.HL, reg);
    else
        dev.cpu.reg[r8] = reg;

    dev.cpu.reg.flag.Z = reg === 0;
    dev.cpu.reg.flag.N = false;
    dev.cpu.reg.flag.H = false;
    dev.cpu.reg.flag.C = false;
}

function swap_r8(dev: Device, r8: R8) {
    DECOMP(`SWAP ${r8}`);
    let reg = r8 === '[HL]' ? dev.mem.read(dev.cpu.reg.HL) : dev.cpu.reg[r8];

    reg = (reg >> 4) | (reg << 4);

    if (r8 === '[HL]')
        dev.mem.write(dev.cpu.reg.HL, reg);
    else
        dev.cpu.reg[r8] = reg;

    dev.cpu.reg.flag.Z = reg === 0;
    dev.cpu.reg.flag.N = false;
    dev.cpu.reg.flag.H = false;
    dev.cpu.reg.flag.C = false;
}

function srl_r8(dev: Device, r8: R8) {
    DECOMP(`SRL ${r8}`);
    let reg = r8 === '[HL]' ? dev.mem.read(dev.cpu.reg.HL) : dev.cpu.reg[r8];

    const carry = reg & 0x01;
    reg >>= 1;

    if (r8 === '[HL]')
        dev.mem.write(dev.cpu.reg.HL, reg);
    else
        dev.cpu.reg[r8] = reg;

    dev.cpu.reg.flag.Z = reg === 0;
    dev.cpu.reg.flag.N = false;
    dev.cpu.reg.flag.H = false;
    dev.cpu.reg.flag.C = Boolean(carry);
}

function res_u3_r8(dev: Device, bit: number, r8: R8) {
    DECOMP(`RES ${bit}, ${r8}`);
    let reg = r8 === '[HL]' ? dev.mem.read(dev.cpu.reg.HL) : dev.cpu.reg[r8];
    reg = reg & ~(1 << bit);

    if (r8 === '[HL]')
        dev.mem.write(dev.cpu.reg.HL, reg);
    else
        dev.cpu.reg[r8] = reg;
}

function set_u3_r8(dev: Device, bit: number, r8: R8) {
    DECOMP(`RES ${bit}, ${r8}`);
    let reg = r8 === '[HL]' ? dev.mem.read(dev.cpu.reg.HL) : dev.cpu.reg[r8];
    reg = reg | (1 << bit);

    if (r8 === '[HL]')
        dev.mem.write(dev.cpu.reg.HL, reg);
    else
        dev.cpu.reg[r8] = reg;
}

export {
    bit_u3_r8, rlc_r8, rrc_r8, rl_r8, rr_r8, sla_r8, sra_r8, swap_r8, srl_r8, res_u3_r8, set_u3_r8
};