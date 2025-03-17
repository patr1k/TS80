import { BYTE, COND, Device, R16STK, S8, WORD, DECOMP } from "./Utils";

function add_A_imm8(dev: Device) {
    const d8 = dev.cpu.fetch_byte();
    DECOMP(`ADD A, $${d8.toString(16)}`);

    const result16 = WORD(dev.cpu.reg.A + d8);
    const result8 = BYTE(result16);
    const half = ((dev.cpu.reg.A ^ d8 ^ result8) & 0x10) > 0;
    const carry = (result16 & 0x100) > 0;

    dev.cpu.reg.A = result8;
    dev.cpu.reg.flag.N = false;
    dev.cpu.reg.flag.Z = result8 === 0;
    dev.cpu.reg.flag.H = half;
    dev.cpu.reg.flag.C = carry;
}

function adc_A_imm8(dev: Device) {
    const d8 = dev.cpu.fetch_byte();
    DECOMP(`ADC A, $${d8.toString(16)}`);

    const result16 = WORD(dev.cpu.reg.A + d8 + (dev.cpu.reg.flag.C ? 1 : 0));
    const result8 = BYTE(result16);
    const half = ((dev.cpu.reg.A ^ d8 ^ result8) & 0x10) > 0;
    const carry = (result16 & 0x100) > 0;

    dev.cpu.reg.A = result8;
    dev.cpu.reg.flag.N = false;
    dev.cpu.reg.flag.Z = result8 === 0;
    dev.cpu.reg.flag.H = half;
    dev.cpu.reg.flag.C = carry;
}

function sub_A_imm8(dev: Device) {
    const d8 = dev.cpu.fetch_byte();
    DECOMP(`SUB A, $${d8.toString(16)}`);

    const result16 = WORD(dev.cpu.reg.A - d8);
    const result8 = BYTE(result16);
    const half = ((dev.cpu.reg.A ^ d8 ^ result8) & 0x10) > 0;
    const carry = (result16 & 0x100) > 0;

    dev.cpu.reg.A = result8;
    dev.cpu.reg.flag.N = true;
    dev.cpu.reg.flag.Z = result8 === 0;
    dev.cpu.reg.flag.H = half;
    dev.cpu.reg.flag.C = carry;
}

function sbc_A_imm8(dev: Device) {
    const d8 = dev.cpu.fetch_byte();
    DECOMP(`SUB A, $${d8.toString(16)}`);

    const result16 = WORD(dev.cpu.reg.A - d8 - (dev.cpu.reg.flag.C ? 1 : 0));
    const result8 = BYTE(result16);
    const half = ((dev.cpu.reg.A ^ d8 ^ result8) & 0x10) > 0;
    const carry = (result16 & 0x100) > 0;

    dev.cpu.reg.A = result8;
    dev.cpu.reg.flag.N = true;
    dev.cpu.reg.flag.Z = result8 === 0;
    dev.cpu.reg.flag.H = half;
    dev.cpu.reg.flag.C = carry;
}

function and_A_imm8(dev: Device) {
    const d8 = dev.cpu.fetch_byte();
    DECOMP(`AND A, $${d8.toString(16)}`);

    dev.cpu.reg.A &= d8;
    dev.cpu.reg.flag.N = false;
    dev.cpu.reg.flag.C = false;
    dev.cpu.reg.flag.H = true;
    dev.cpu.reg.flag.Z = dev.cpu.reg.A === 0;
}

function xor_A_imm8(dev: Device) {
    const d8 = dev.cpu.fetch_byte();
    DECOMP(`XOR A, $${d8.toString(16)}`);

    dev.cpu.reg.A ^= d8;
    dev.cpu.reg.flag.N = false;
    dev.cpu.reg.flag.C = false;
    dev.cpu.reg.flag.H = false;
    dev.cpu.reg.flag.Z = dev.cpu.reg.A === 0;
}

function or_A_imm8(dev: Device) {
    const d8 = dev.cpu.fetch_byte();
    DECOMP(`OR A, $${d8.toString(16)}`);

    dev.cpu.reg.A |= d8;
    dev.cpu.reg.flag.N = false;
    dev.cpu.reg.flag.C = false;
    dev.cpu.reg.flag.H = false;
    dev.cpu.reg.flag.Z = dev.cpu.reg.A === 0;
}

function cp_A_imm8(dev: Device) {
    const d8 = dev.cpu.fetch_byte();
    DECOMP(`CP A, $${d8.toString(16)}`);

    const result16 = WORD(dev.cpu.reg.A - d8);
    const result8 = BYTE(result16);
    const half = ((dev.cpu.reg.A ^ d8 ^ result8) & 0x10) > 0;
    const carry = (result16 & 0x100) > 0;

    dev.cpu.reg.flag.N = true;
    dev.cpu.reg.flag.Z = result8 == 0;
    dev.cpu.reg.flag.H = half;
    dev.cpu.reg.flag.C = carry;
}

function ret(dev: Device) {
    DECOMP('RET');
    dev.cpu.reg.PC = dev.cpu.pop_word();
}

function ret_cond(dev: Device, cond: COND) {
    DECOMP('RET');
    switch (cond) {
        case 'NZ': if (dev.cpu.reg.flag.Z) return; break;
        case 'Z': if (!dev.cpu.reg.flag.Z) return; break;
        case 'NC': if (dev.cpu.reg.flag.C) return; break;
        case 'C': if (!dev.cpu.reg.flag.C) return; break;
    }
    dev.cpu.reg.PC = dev.cpu.pop_word();
}

function reti(dev: Device) {
    DECOMP('RETI');

    dev.cpu.reg.PC = dev.mem.read(dev.cpu.reg.SP) | (dev.mem.read(dev.cpu.reg.SP + 1) << 8)
    dev.cpu.reg.SP = WORD(dev.cpu.reg.SP + 2);

    dev.cpu.IME = true;
}

function jp_cond_imm16(dev: Device, cond: COND) {
    const a16 = dev.cpu.fetch_word();
    DECOMP(`JP ${cond}, $${a16.toString(16)}`);

    switch (cond) {
        case 'NZ': if (dev.cpu.reg.flag.Z) return; break;
        case 'Z': if (!dev.cpu.reg.flag.Z) return; break;
        case 'NC': if (dev.cpu.reg.flag.C) return; break;
        case 'C': if (!dev.cpu.reg.flag.C) return; break;
    }

    dev.cpu.reg.PC = a16;
}

function jp_imm16(dev: Device) {
    const a16 = dev.cpu.fetch_word();
    DECOMP(`JP $${a16.toString(16)}`);

    dev.cpu.reg.PC = a16;
}

function jp_HL(dev: Device) {
    DECOMP('JP HL');

    dev.cpu.reg.PC = dev.cpu.reg.HL;
}

function call_cond_imm16(dev: Device, cond: COND) {
    const a16 = dev.cpu.fetch_word();
    DECOMP(`CALL ${cond}, $${a16.toString(16)}`);

    switch (cond) {
        case 'NZ': if (dev.cpu.reg.flag.Z) return; break;
        case 'Z': if (!dev.cpu.reg.flag.Z) return; break;
        case 'NC': if (dev.cpu.reg.flag.C) return; break;
        case 'C': if (!dev.cpu.reg.flag.C) return; break;
    }

    dev.cpu.push_word(dev.cpu.reg.PC);
    dev.cpu.reg.PC = a16;
}

function call_imm16(dev: Device) {
    const a16 = dev.cpu.fetch_word();
    DECOMP(`CALL $${a16.toString(16)}`);

    dev.cpu.push_word(dev.cpu.reg.PC);
    dev.cpu.reg.PC = a16;
}

function rst_tgt3(dev: Device, vec: number) {
    let a16: number = 0x0000;
    switch (vec) {
        case 0x00: a16 = 0x0000; break;
        case 0x08: a16 = 0x0040; break;
        case 0x10: a16 = 0x0080; break;
        case 0x18: a16 = 0x00C0; break;
        case 0x20: a16 = 0x0100; break;
        case 0x28: a16 = 0x0140; break;
        case 0x30: a16 = 0x0180; break;
        case 0x38: a16 = 0x01C0; break;
    }

    DECOMP(`RST $${vec.toString(16)}`);

    dev.cpu.push_word(dev.cpu.reg.PC);
    dev.cpu.reg.PC = a16;
}

function pop_r16(dev: Device, r16: R16STK) {
    DECOMP(`POP ${r16}`);
    dev.cpu.reg[r16] = dev.cpu.pop_word();
}

function push_r16(dev: Device, r16: R16STK) {
    DECOMP(`PUSH ${r16}`);
    dev.cpu.push_word(dev.cpu.reg[r16]);
}

function ldh_a8_A(dev: Device) {
    const a8 = dev.cpu.fetch_byte();
    DECOMP(`LDH [$FF00 + $${a8.toString(16)}], A`);

    dev.mem.write(0xFF00 | a8, dev.cpu.reg.A);
}

function ldh_Cmem_A(dev: Device) {
    DECOMP(`LDH [$FF00 + C], A`);
    dev.mem.write(0xFF00 | dev.cpu.reg.C, dev.cpu.reg.A);
}

function ld_a16_A(dev: Device) {
    const a16 = dev.cpu.fetch_word();
    DECOMP(`LD $${a16.toString(16)}, A`);

    dev.mem.write(a16, dev.cpu.reg.A);
}

function ldh_A_a8(dev: Device) {
    const a8 = dev.cpu.fetch_byte();
    DECOMP(`LDH A, [$FF00 + $${a8.toString(16)}]`);

    dev.cpu.reg.A = dev.mem.read(0xFF | a8);
}

function ldh_A_Cmem(dev: Device) {
    DECOMP(`LDH A, [$FF00 + C]`);
    dev.cpu.reg.A = dev.mem.read(0xFF00 | dev.cpu.reg.C);
}

function ld_A_a16(dev: Device) {
    const a16 = dev.cpu.fetch_word();
    DECOMP(`LD A, $${a16.toString(16)}`);

    dev.cpu.reg.A = dev.mem.read(a16);
}

function di(dev: Device) {
    DECOMP('DI');
    dev.cpu.IME = false;
}

function ei(dev: Device) {
    DECOMP('EI');
    dev.cpu.IME = false;
}

function add_SP_r8(dev: Device) {
    const r8 = S8(dev.cpu.fetch_byte());
    DECOMP(`ADD SP, ${r8}`);

    const result16 = WORD(dev.cpu.reg.SP + r8);
    const result8 = BYTE(result16);
    const half = ((dev.cpu.reg.SP  ^ r8 ^ result8) & 0x10) > 0;
    const carry = (result16 & 0x100) > 0;

    dev.cpu.reg.SP = result8;

    dev.cpu.reg.flag.Z = false;
    dev.cpu.reg.flag.N = false;
    dev.cpu.reg.flag.H = half;
    dev.cpu.reg.flag.C = carry;
}

function ld_HL_SPr8(dev: Device) {
    const r8 = S8(dev.cpu.fetch_byte());
    DECOMP(`LD HL, SP + ${r8}`);

    const result16 = WORD(dev.cpu.reg.SP + r8);
    const result8 = BYTE(result16);
    const half = ((dev.cpu.reg.SP  ^ r8 ^ result8) & 0x10) > 0;
    const carry = (result16 & 0x100) > 0;

    dev.cpu.reg.HL = result8;

    dev.cpu.reg.flag.Z = false;
    dev.cpu.reg.flag.N = false;
    dev.cpu.reg.flag.H = half;
    dev.cpu.reg.flag.C = carry;
}

function ld_SP_HL(dev: Device) {
    DECOMP('LD SP, HL');
    dev.cpu.reg.SP = dev.cpu.reg.HL;
}

export { 
    add_A_imm8, adc_A_imm8, sub_A_imm8, sbc_A_imm8, and_A_imm8, xor_A_imm8, or_A_imm8, cp_A_imm8, ret, ret_cond, reti, jp_cond_imm16, jp_imm16, 
    jp_HL, call_cond_imm16, call_imm16, rst_tgt3, pop_r16, push_r16, ldh_a8_A, ldh_Cmem_A, ld_a16_A, ldh_A_a8, ldh_A_Cmem, ld_A_a16, di, ei,
    add_SP_r8, ld_HL_SPr8, ld_SP_HL
};