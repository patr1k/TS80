import { BYTE, COND, Device, R16, R16MEM, R8, S8, WORD, DECOMP } from "./Utils";

function nop() {
    DECOMP('NOP');
}

function ld_r16_imm16(dev: Device, r16: R16) {
    const d16 = dev.cpu.fetch_word();
    DECOMP(`LD ${r16}, $${d16.toString(16)}`)

    dev.cpu.reg[r16] = d16;
}

function ld_r16mem_A(dev: Device, r16mem: R16MEM) {
    DECOMP(`LD [${r16mem}], A`)

    if (r16mem === 'HL+') {
        dev.mem.write(dev.cpu.reg.HL, dev.cpu.reg.A);
        dev.cpu.reg.HL = WORD(dev.cpu.reg.HL + 1);
    } else if (r16mem === 'HL-') {
        dev.mem.write(dev.cpu.reg.HL, dev.cpu.reg.A);
        dev.cpu.reg.HL = WORD(dev.cpu.reg.HL - 1);
    } else {
        dev.mem.write(dev.cpu.reg[r16mem], dev.cpu.reg.A);
    }
}

function ld_A_r16mem(dev: Device, r16mem: R16MEM) {
    DECOMP(`LD A, [${r16mem}]`)

    if (r16mem === 'HL+') {
        dev.cpu.reg.A = dev.mem.read(dev.cpu.reg.HL);
        dev.cpu.reg.HL = WORD(dev.cpu.reg.HL + 1);
    } else if (r16mem === 'HL-') {
        dev.cpu.reg.A = dev.mem.read(dev.cpu.reg.HL);
        dev.cpu.reg.HL = WORD(dev.cpu.reg.HL - 1);
    } else {
        dev.cpu.reg.A = dev.mem.read(dev.cpu.reg[r16mem]);
    }
}

function ld_imm16_SP(dev: Device) {
    const a16 = dev.cpu.fetch_word();
    DECOMP(`LD [$${a16.toString(16)}], SP`);

    dev.mem.write(a16, dev.cpu.reg.SP);
}

function inc_r16(dev: Device, r16: R16) {
    DECOMP(`INC ${r16}`);

    dev.cpu.reg[r16] = WORD(dev.cpu.reg[r16] + 1);
}

function dec_r16(dev: Device, r16: R16) {
    DECOMP(`DEC ${r16}`);

    dev.cpu.reg[r16] = WORD(dev.cpu.reg[r16] - 1);
}

function add_HL_r16(dev: Device, r16: R16) {
    DECOMP(`ADD HL, ${r16}`);

    dev.cpu.reg.HL = WORD(dev.cpu.reg.HL + dev.cpu.reg[r16]);
}

function inc_r8(dev: Device, r8: R8) {
    DECOMP(`INC ${r8}`);
    const reg = r8 === '[HL]' ? dev.mem.read(dev.cpu.reg.HL) : dev.cpu.reg[r8];

    const result8 = BYTE(reg + 1);
    const half = (reg % 0x0F) === 0x0F;

    if (r8 === '[HL]')
        dev.mem.write(dev.cpu.reg.HL, result8);
    else
        dev.cpu.reg[r8] = result8;

    dev.cpu.reg.flag.Z = result8 === 0;
    dev.cpu.reg.flag.N = false;
    dev.cpu.reg.flag.H = half;
}

function dec_r8(dev: Device, r8: R8) {
    DECOMP(`DEC ${r8}`);
    const reg = r8 === '[HL]' ? dev.mem.read(dev.cpu.reg.HL) : dev.cpu.reg[r8];

    const result8 = BYTE(reg - 1);
    const half = (reg % 0x0F) === 0;

    if (r8 === '[HL]')
        dev.mem.write(dev.cpu.reg.HL, result8);
    else
        dev.cpu.reg[r8] = result8;

    dev.cpu.reg.flag.Z = result8 === 0;
    dev.cpu.reg.flag.N = true;
    dev.cpu.reg.flag.H = half;
}

function ld_r8_imm8(dev: Device, r8: R8) {
    const d8 = dev.cpu.fetch_byte();
    DECOMP(`LD ${r8}, $${d8.toString(16)}`);

    if (r8 === '[HL]') {
        dev.mem.write(dev.cpu.reg.HL, d8);
    } else {
        dev.cpu.reg[r8] = d8;
    }
}

function rlca(dev: Device) {
    DECOMP("RLCA");
    const carry = (dev.cpu.reg.A & 0x80) ? 1 : 0;
    dev.cpu.reg.A = BYTE(dev.cpu.reg.A << 1) | carry;

    dev.cpu.reg.F = 0;
    dev.cpu.reg.flag.C = Boolean(carry);
}

function rrca(dev: Device) {
    DECOMP("RRCA");
    const carry = (dev.cpu.reg.A) & 0x01;
    dev.cpu.reg.A = BYTE(dev.cpu.reg.A >> 1) | (carry ? 0x80 : 0);

    dev.cpu.reg.F = 0;
    dev.cpu.reg.flag.C = Boolean(carry);
}

function rla(dev: Device) {
    DECOMP("RLA");
    const carry = (dev.cpu.reg.A & 0x80) ? 1 : 0;
    dev.cpu.reg.A = BYTE(dev.cpu.reg.A << 1) | (dev.cpu.reg.flag.C ? 1 : 0);

    dev.cpu.reg.F = 0;
    dev.cpu.reg.flag.C = Boolean(carry);
}

function rra(dev: Device) {
    DECOMP("RRA");
    const carry = (dev.cpu.reg.A) & 0x01;
    dev.cpu.reg.A = BYTE(dev.cpu.reg.A >> 1) | (dev.cpu.reg.flag.C ? 0x80 : 0);

    dev.cpu.reg.F = 0;
    dev.cpu.reg.flag.C = Boolean(carry);
}

function daa(dev: Device) {
    DECOMP("DAA");

    const DAA_C = (x: number) => dev.cpu.reg.flag.C === Boolean(x);
    const DAA_H = (x: number) => dev.cpu.reg.flag.H === Boolean(x);
    const DAA_HI = (a: number, b: number) => (((dev.cpu.reg.A & 0xF0) >> 4 >= a) && ((dev.cpu.reg.A & 0xF0) >> 4 <= b));
    const DAA_LO = (a: number, b: number) => (((dev.cpu.reg.A & 0x0F) >= a) && ((dev.cpu.reg.A & 0x0F) <= b));

    if (DAA_C(0) && DAA_HI(0, 9) && DAA_H(0) && DAA_LO(0, 9)) {
        // do nothing
    } else if (DAA_C(0) && DAA_HI(0, 8) && DAA_H(0) && DAA_LO(0xA, 0xF)) {
        dev.cpu.reg.A += 0x06;
    } else if (DAA_C(0) && DAA_HI(0, 9) && DAA_H(1) && DAA_LO(0, 3)) {
        dev.cpu.reg.A += 0x06;
    } else if (DAA_C(0) && DAA_HI(0xA, 0xF) && DAA_H(0) && DAA_LO(0, 9)) {
        dev.cpu.reg.A += 0x60;
        dev.cpu.reg.flag.C = true;
    } else if (DAA_C(0) && DAA_HI(9, 0xF) && DAA_H(0) && DAA_LO(0xA, 0xF)) {
        dev.cpu.reg.A += 0x66;
        dev.cpu.reg.flag.C = true;
    } else if (DAA_C(0) && DAA_HI(0xA, 0xF) && DAA_H(1) && DAA_LO(0, 3)) {
        dev.cpu.reg.A += 0x66;
        dev.cpu.reg.flag.C = true;
    } else if (DAA_C(1) && DAA_HI(0, 2) && DAA_H(0) && DAA_LO(0, 9)) {
        dev.cpu.reg.A += 0x60;
    } else if (DAA_C(1) && DAA_HI(0, 2) && DAA_H(0) && DAA_LO(0xA, 0xF)) {
        dev.cpu.reg.A += 0x66;
    } else if (DAA_C(1) && DAA_HI(0, 3) && DAA_H(1) && DAA_LO(0, 3)) {
        dev.cpu.reg.A += 0x66;
    } else if (DAA_C(0) && DAA_HI(0, 8) && DAA_H(1) && DAA_LO(6, 0xF)) {
        dev.cpu.reg.A += 0xFA;
    } else if (DAA_C(1) && DAA_HI(7, 0xF) && DAA_H(0) && DAA_LO(0, 9)) {
        dev.cpu.reg.A += 0xA0;
    } else if (DAA_C(1) && DAA_HI(6, 7) && DAA_H(1) && DAA_LO(6, 0xF)) {
        dev.cpu.reg.A += 0x9A;
    }
    
    if (dev.cpu.reg.A == 1) dev.cpu.reg.flag.Z = true;
    dev.cpu.reg.flag.H = false;
}


function cpl(dev: Device) {
    DECOMP("CPL");
    dev.cpu.reg.A = ~dev.cpu.reg.A;

    dev.cpu.reg.flag.H = true;
    dev.cpu.reg.flag.N = true;
}

function scf(dev: Device) {
    DECOMP("SCF");

    dev.cpu.reg.flag.C = true;
    dev.cpu.reg.flag.H = false;
    dev.cpu.reg.flag.N = false;
}

function ccf(dev: Device) {
    DECOMP("CCF");
    
    dev.cpu.reg.flag.C = !Boolean(dev.cpu.reg.flag.C);
    dev.cpu.reg.flag.H = false;
    dev.cpu.reg.flag.N = false;
}

function jr_r8(dev: Device) {
    const r8 = S8(dev.cpu.fetch_byte());
    DECOMP(`JR ${r8}`);

    dev.cpu.reg.PC += r8;
}

function jr_cond_r8(dev: Device, cond: COND) {
    const r8 = S8(dev.cpu.fetch_byte());
    DECOMP(`JR ${cond}, ${r8}`);

    switch (cond) {
        case 'NZ': if (dev.cpu.reg.flag.Z) return; break;
        case 'Z': if (!dev.cpu.reg.flag.Z) return; break;
        case 'NC': if (dev.cpu.reg.flag.C) return; break;
        case 'C': if (!dev.cpu.reg.flag.C) return; break;
    }

    dev.cpu.reg.PC += r8;
}

function stop(dev: Device) {
    DECOMP("STOP");
    dev.cpu.HALT = true;
    dev.cpu.reg.PC = WORD(dev.cpu.reg.PC + 1);
}

export {
    nop, ld_r16_imm16, ld_r16mem_A, ld_A_r16mem, ld_imm16_SP, inc_r16, dec_r16, add_HL_r16, inc_r8, dec_r8, ld_r8_imm8, 
    jr_cond_r8, rlca, rrca, rla, rra, daa, cpl, scf, ccf, jr_r8, stop
};