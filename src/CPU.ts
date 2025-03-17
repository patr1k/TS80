import * as cpu_blk_0 from "./cpu/Block_0";
import * as cpu_blk_1 from "./cpu/Block_1";
import * as cpu_blk_2 from "./cpu/Block_2";
import * as cpu_blk_3 from "./cpu/Block_3";
import * as cpu_blk_3_ext from "./cpu/Block_3_ext";
import Registers from "./cpu/Registers";
import { CoreInstr, Device, HEX_BYTE, HEX_WORD, MAKEWORD } from "./cpu/Utils";
import Memory from "./Memory";

export default class CPU
{
    public reg: Registers;

    public HALT: boolean;
    public IME: boolean;
    
    private mem: Memory;

    public IR: number;

    private isa: CoreInstr[];
    private isa_ext: CoreInstr[];

    private dev: Device;

    constructor(mem: Memory) {
        this.mem = mem;
        this.dev = { cpu: this, mem };
        this.reg = new Registers();
        this.HALT = false;
        this.IME = false;

        this.IR = 0;

        this.isa = [
    /* 0x00 */ cpu_blk_0.nop,
    /* 0x01 */ (dev: Device) => cpu_blk_0.ld_r16_imm16(dev, 'BC'),
    /* 0x02 */ (dev: Device) => cpu_blk_0.ld_r16mem_A(dev, 'BC'),
    /* 0x03 */ (dev: Device) => cpu_blk_0.inc_r16(dev, 'BC'),
    /* 0x04 */ (dev: Device) => cpu_blk_0.inc_r8(dev, 'B'),
    /* 0x05 */ (dev: Device) => cpu_blk_0.dec_r8(dev, 'B'),
    /* 0x06 */ (dev: Device) => cpu_blk_0.ld_r8_imm8(dev, 'B'),
    /* 0x07 */ cpu_blk_0.rlca,
    /* 0x08 */ cpu_blk_0.ld_imm16_SP,
    /* 0x09 */ (dev: Device) => cpu_blk_0.add_HL_r16(dev, 'BC'),
    /* 0x0A */ (dev: Device) => cpu_blk_0.ld_A_r16mem(dev, 'BC'),
    /* 0x0B */ (dev: Device) => cpu_blk_0.dec_r16(dev, 'BC'),
    /* 0x0C */ (dev: Device) => cpu_blk_0.inc_r8(dev, 'C'),
    /* 0x0D */ (dev: Device) => cpu_blk_0.dec_r8(dev, 'C'),
    /* 0x0E */ (dev: Device) => cpu_blk_0.ld_r8_imm8(dev, 'C'),
    /* 0x0F */ cpu_blk_0.rrca,

    /* 0x10 */ cpu_blk_0.stop,
    /* 0x11 */ (dev: Device) => cpu_blk_0.ld_r16_imm16(dev, 'DE'),
    /* 0x12 */ (dev: Device) => cpu_blk_0.ld_r16mem_A(dev, 'DE'),
    /* 0x13 */ (dev: Device) => cpu_blk_0.inc_r16(dev, 'DE'),
    /* 0x14 */ (dev: Device) => cpu_blk_0.inc_r8(dev, 'D'),
    /* 0x15 */ (dev: Device) => cpu_blk_0.dec_r8(dev, 'D'),
    /* 0x16 */ (dev: Device) => cpu_blk_0.ld_r8_imm8(dev, 'D'),
    /* 0x17 */ cpu_blk_0.rla,
    /* 0x18 */ cpu_blk_0.jr_r8,
    /* 0x19 */ (dev: Device) => cpu_blk_0.add_HL_r16(dev, 'DE'),
    /* 0x1A */ (dev: Device) => cpu_blk_0.ld_A_r16mem(dev, 'DE'),
    /* 0x1B */ (dev: Device) => cpu_blk_0.dec_r16(dev, 'DE'),
    /* 0x1C */ (dev: Device) => cpu_blk_0.inc_r8(dev, 'E'),
    /* 0x1D */ (dev: Device) => cpu_blk_0.dec_r8(dev, 'E'),
    /* 0x1E */ (dev: Device) => cpu_blk_0.ld_r8_imm8(dev, 'E'),
    /* 0x1F */ cpu_blk_0.rra,

    /* 0x20 */ (dev: Device) => cpu_blk_0.jr_cond_r8(dev, 'NZ'),
    /* 0x21 */ (dev: Device) => cpu_blk_0.ld_r16_imm16(dev, 'HL'),
    /* 0x22 */ (dev: Device) => cpu_blk_0.ld_r16mem_A(dev, 'HL+'),
    /* 0x23 */ (dev: Device) => cpu_blk_0.inc_r16(dev, 'HL'),
    /* 0x24 */ (dev: Device) => cpu_blk_0.inc_r8(dev, 'H'),
    /* 0x25 */ (dev: Device) => cpu_blk_0.dec_r8(dev, 'H'),
    /* 0x26 */ (dev: Device) => cpu_blk_0.ld_r8_imm8(dev, 'H'),
    /* 0x27 */ cpu_blk_0.daa,
    /* 0x28 */ (dev: Device) => cpu_blk_0.jr_cond_r8(dev, 'Z'),
    /* 0x29 */ (dev: Device) => cpu_blk_0.add_HL_r16(dev, 'HL'),
    /* 0x2A */ (dev: Device) => cpu_blk_0.ld_A_r16mem(dev, 'HL+'),
    /* 0x2B */ (dev: Device) => cpu_blk_0.dec_r16(dev, 'HL'),
    /* 0x2C */ (dev: Device) => cpu_blk_0.inc_r8(dev, 'L'),
    /* 0x2D */ (dev: Device) => cpu_blk_0.dec_r8(dev, 'L'),
    /* 0x2E */ (dev: Device) => cpu_blk_0.ld_r8_imm8(dev, 'L'),
    /* 0x2F */ cpu_blk_0.cpl,

    /* 0x30 */ (dev: Device) => cpu_blk_0.jr_cond_r8(dev, 'NC'),
    /* 0x31 */ (dev: Device) => cpu_blk_0.ld_r16_imm16(dev, 'SP'),
    /* 0x32 */ (dev: Device) => cpu_blk_0.ld_r16mem_A(dev, 'HL-'),
    /* 0x33 */ (dev: Device) => cpu_blk_0.inc_r16(dev, 'SP'),
    /* 0x34 */ (dev: Device) => cpu_blk_0.inc_r16(dev, 'HL'),
    /* 0x35 */ (dev: Device) => cpu_blk_0.dec_r16(dev, 'HL'),
    /* 0x36 */ (dev: Device) => cpu_blk_0.ld_r8_imm8(dev, '[HL]'),
    /* 0x37 */ cpu_blk_0.scf,
    /* 0x38 */ (dev: Device) => cpu_blk_0.jr_cond_r8(dev, 'C'),
    /* 0x39 */ (dev: Device) => cpu_blk_0.add_HL_r16(dev, 'SP'),
    /* 0x3A */ (dev: Device) => cpu_blk_0.ld_A_r16mem(dev, 'HL-'),
    /* 0x3B */ (dev: Device) => cpu_blk_0.dec_r16(dev, 'SP'),
    /* 0x3C */ (dev: Device) => cpu_blk_0.inc_r8(dev, 'A'),
    /* 0x3D */ (dev: Device) => cpu_blk_0.dec_r8(dev, 'A'),
    /* 0x3E */ (dev: Device) => cpu_blk_0.ld_r8_imm8(dev, 'A'),
    /* 0x3F */ cpu_blk_0.ccf,

    /* 0x40 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'B', 'B'),
    /* 0x41 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'B', 'C'),
    /* 0x42 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'B', 'D'),
    /* 0x43 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'B', 'E'),
    /* 0x44 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'B', 'H'),
    /* 0x45 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'B', 'L'),
    /* 0x46 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'B', '[HL]'),
    /* 0x47 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'B', 'A'),
    /* 0x48 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'C', 'B'),
    /* 0x49 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'C', 'C'),
    /* 0x4A */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'C', 'D'),
    /* 0x4B */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'C', 'E'),
    /* 0x4C */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'C', 'H'),
    /* 0x4D */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'C', 'L'),
    /* 0x4E */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'C', '[HL]'),
    /* 0x4F */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'C', 'A'),

    /* 0x50 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'D', 'B'),
    /* 0x51 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'D', 'C'),
    /* 0x52 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'D', 'D'),
    /* 0x53 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'D', 'E'),
    /* 0x54 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'D', 'H'),
    /* 0x55 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'D', 'L'),
    /* 0x56 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'D', '[HL]'),
    /* 0x57 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'D', 'A'),
    /* 0x58 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'E', 'B'),
    /* 0x59 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'E', 'C'),
    /* 0x5A */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'E', 'D'),
    /* 0x5B */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'E', 'E'),
    /* 0x5C */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'E', 'H'),
    /* 0x5D */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'E', 'L'),
    /* 0x5E */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'E', '[HL]'),
    /* 0x5F */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'E', 'A'),

    /* 0x60 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'H', 'B'),
    /* 0x61 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'H', 'C'),
    /* 0x62 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'H', 'D'),
    /* 0x63 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'H', 'E'),
    /* 0x64 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'H', 'H'),
    /* 0x65 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'H', 'L'),
    /* 0x66 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'H', '[HL]'),
    /* 0x67 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'H', 'A'),
    /* 0x68 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'L', 'B'),
    /* 0x69 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'L', 'C'),
    /* 0x6A */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'L', 'D'),
    /* 0x6B */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'L', 'E'),
    /* 0x6C */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'L', 'H'),
    /* 0x6D */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'L', 'L'),
    /* 0x6E */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'L', '[HL]'),
    /* 0x6F */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'L', 'A'),

    /* 0x70 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, '[HL]', 'B'),
    /* 0x71 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, '[HL]', 'C'),
    /* 0x72 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, '[HL]', 'D'),
    /* 0x73 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, '[HL]', 'E'),
    /* 0x74 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, '[HL]', 'H'),
    /* 0x75 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, '[HL]', 'L'),
    /* 0x76 */ cpu_blk_1.halt,
    /* 0x77 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, '[HL]', 'A'),
    /* 0x78 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'A', 'B'),
    /* 0x79 */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'A', 'C'),
    /* 0x7A */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'A', 'D'),
    /* 0x7B */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'A', 'E'),
    /* 0x7C */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'A', 'H'),
    /* 0x7D */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'A', 'L'),
    /* 0x7E */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'A', '[HL]'),
    /* 0x7F */ (dev: Device) => cpu_blk_1.ld_r8_r8(dev, 'A', 'A'),

    /* 0x80 */ (dev: Device) => cpu_blk_2.add_A_r8(dev, 'B'),
    /* 0x81 */ (dev: Device) => cpu_blk_2.add_A_r8(dev, 'C'),
    /* 0x82 */ (dev: Device) => cpu_blk_2.add_A_r8(dev, 'D'),
    /* 0x83 */ (dev: Device) => cpu_blk_2.add_A_r8(dev, 'E'),
    /* 0x84 */ (dev: Device) => cpu_blk_2.add_A_r8(dev, 'H'),
    /* 0x85 */ (dev: Device) => cpu_blk_2.add_A_r8(dev, 'L'),
    /* 0x86 */ (dev: Device) => cpu_blk_2.add_A_r8(dev, '[HL]'),
    /* 0x87 */ (dev: Device) => cpu_blk_2.add_A_r8(dev, 'A'),
    /* 0x88 */ (dev: Device) => cpu_blk_2.adc_A_r8(dev, 'B'),
    /* 0x89 */ (dev: Device) => cpu_blk_2.adc_A_r8(dev, 'C'),
    /* 0x8A */ (dev: Device) => cpu_blk_2.adc_A_r8(dev, 'D'),
    /* 0x8B */ (dev: Device) => cpu_blk_2.adc_A_r8(dev, 'E'),
    /* 0x8C */ (dev: Device) => cpu_blk_2.adc_A_r8(dev, 'H'),
    /* 0x8D */ (dev: Device) => cpu_blk_2.adc_A_r8(dev, 'L'),
    /* 0x8E */ (dev: Device) => cpu_blk_2.adc_A_r8(dev, '[HL]'),
    /* 0x8F */ (dev: Device) => cpu_blk_2.adc_A_r8(dev, 'A'),

    /* 0x90 */ (dev: Device) => cpu_blk_2.sub_A_r8(dev, 'B'),
    /* 0x91 */ (dev: Device) => cpu_blk_2.sub_A_r8(dev, 'C'),
    /* 0x92 */ (dev: Device) => cpu_blk_2.sub_A_r8(dev, 'D'),
    /* 0x93 */ (dev: Device) => cpu_blk_2.sub_A_r8(dev, 'E'),
    /* 0x94 */ (dev: Device) => cpu_blk_2.sub_A_r8(dev, 'H'),
    /* 0x95 */ (dev: Device) => cpu_blk_2.sub_A_r8(dev, 'L'),
    /* 0x96 */ (dev: Device) => cpu_blk_2.sub_A_r8(dev, '[HL]'),
    /* 0x97 */ (dev: Device) => cpu_blk_2.sub_A_r8(dev, 'A'),
    /* 0x98 */ (dev: Device) => cpu_blk_2.sbc_A_r8(dev, 'B'),
    /* 0x99 */ (dev: Device) => cpu_blk_2.sbc_A_r8(dev, 'C'),
    /* 0x9A */ (dev: Device) => cpu_blk_2.sbc_A_r8(dev, 'D'),
    /* 0x9B */ (dev: Device) => cpu_blk_2.sbc_A_r8(dev, 'E'),
    /* 0x9C */ (dev: Device) => cpu_blk_2.sbc_A_r8(dev, 'H'),
    /* 0x9D */ (dev: Device) => cpu_blk_2.sbc_A_r8(dev, 'L'),
    /* 0x9E */ (dev: Device) => cpu_blk_2.sbc_A_r8(dev, '[HL]'),
    /* 0x9F */ (dev: Device) => cpu_blk_2.sbc_A_r8(dev, 'A'),

    /* 0xA0 */ (dev: Device) => cpu_blk_2.and_A_r8(dev, 'B'),
    /* 0xA1 */ (dev: Device) => cpu_blk_2.and_A_r8(dev, 'C'),
    /* 0xA2 */ (dev: Device) => cpu_blk_2.and_A_r8(dev, 'D'),
    /* 0xA3 */ (dev: Device) => cpu_blk_2.and_A_r8(dev, 'E'),
    /* 0xA4 */ (dev: Device) => cpu_blk_2.and_A_r8(dev, 'H'),
    /* 0xA5 */ (dev: Device) => cpu_blk_2.and_A_r8(dev, 'L'),
    /* 0xA6 */ (dev: Device) => cpu_blk_2.and_A_r8(dev, '[HL]'),
    /* 0xA7 */ (dev: Device) => cpu_blk_2.and_A_r8(dev, 'A'),
    /* 0xA8 */ (dev: Device) => cpu_blk_2.xor_A_r8(dev, 'B'),
    /* 0xA9 */ (dev: Device) => cpu_blk_2.xor_A_r8(dev, 'C'),
    /* 0xAA */ (dev: Device) => cpu_blk_2.xor_A_r8(dev, 'D'),
    /* 0xAB */ (dev: Device) => cpu_blk_2.xor_A_r8(dev, 'E'),
    /* 0xAC */ (dev: Device) => cpu_blk_2.xor_A_r8(dev, 'H'),
    /* 0xAD */ (dev: Device) => cpu_blk_2.xor_A_r8(dev, 'L'),
    /* 0xAE */ (dev: Device) => cpu_blk_2.xor_A_r8(dev, '[HL]'),
    /* 0xAF */ (dev: Device) => cpu_blk_2.xor_A_r8(dev, 'A'),

    /* 0xB0 */ (dev: Device) => cpu_blk_2.or_A_r8(dev, 'B'),
    /* 0xB1 */ (dev: Device) => cpu_blk_2.or_A_r8(dev, 'C'),
    /* 0xB2 */ (dev: Device) => cpu_blk_2.or_A_r8(dev, 'D'),
    /* 0xB3 */ (dev: Device) => cpu_blk_2.or_A_r8(dev, 'E'),
    /* 0xB4 */ (dev: Device) => cpu_blk_2.or_A_r8(dev, 'H'),
    /* 0xB5 */ (dev: Device) => cpu_blk_2.or_A_r8(dev, 'L'),
    /* 0xB6 */ (dev: Device) => cpu_blk_2.or_A_r8(dev, '[HL]'),
    /* 0xB7 */ (dev: Device) => cpu_blk_2.or_A_r8(dev, 'A'),
    /* 0xB8 */ (dev: Device) => cpu_blk_2.cp_A_r8(dev, 'B'),
    /* 0xB9 */ (dev: Device) => cpu_blk_2.cp_A_r8(dev, 'C'),
    /* 0xBA */ (dev: Device) => cpu_blk_2.cp_A_r8(dev, 'D'),
    /* 0xBB */ (dev: Device) => cpu_blk_2.cp_A_r8(dev, 'E'),
    /* 0xBC */ (dev: Device) => cpu_blk_2.cp_A_r8(dev, 'H'),
    /* 0xBD */ (dev: Device) => cpu_blk_2.cp_A_r8(dev, 'L'),
    /* 0xBE */ (dev: Device) => cpu_blk_2.cp_A_r8(dev, '[HL]'),
    /* 0xBF */ (dev: Device) => cpu_blk_2.cp_A_r8(dev, 'A'),

    /* 0xC0 */ (dev: Device) => cpu_blk_3.ret_cond(dev, 'NZ'),
    /* 0xC1 */ (dev: Device) => cpu_blk_3.pop_r16(dev, 'BC'),
    /* 0xC2 */ (dev: Device) => cpu_blk_3.jp_cond_imm16(dev, 'NZ'),
    /* 0xC3 */ cpu_blk_3.jp_imm16,
    /* 0xC4 */ (dev: Device) => cpu_blk_3.call_cond_imm16(dev, 'NZ'),
    /* 0xC5 */ (dev: Device) => cpu_blk_3.push_r16(dev, 'BC'),
    /* 0xC6 */ cpu_blk_3.add_A_imm8,
    /* 0xC7 */ (dev: Device) => cpu_blk_3.rst_tgt3(dev, 0x00),
    /* 0xC8 */ (dev: Device) => cpu_blk_3.ret_cond(dev, 'Z'),
    /* 0xC9 */ cpu_blk_3.ret,
    /* 0xCA */ (dev: Device) => cpu_blk_3.jp_cond_imm16(dev, 'Z'),
    /* 0xCB */ this.ext_instr.bind(this),
    /* 0xCC */ (dev: Device) => cpu_blk_3.call_cond_imm16(dev, 'Z'),
    /* 0xCD */ cpu_blk_3.call_imm16,
    /* 0xCE */ cpu_blk_3.adc_A_imm8,
    /* 0xCF */ (dev: Device) => cpu_blk_3.rst_tgt3(dev, 0x08),

    /* 0xD0 */ (dev: Device) => cpu_blk_3.ret_cond(dev, 'NC'),
    /* 0xD1 */ (dev: Device) => cpu_blk_3.pop_r16(dev, 'DE'),
    /* 0xD2 */ (dev: Device) => cpu_blk_3.jp_cond_imm16(dev, 'NC'),
    /* 0xD3 */ this.hard_lock,
    /* 0xD4 */ (dev: Device) => cpu_blk_3.call_cond_imm16(dev, 'NC'),
    /* 0xD5 */ (dev: Device) => cpu_blk_3.push_r16(dev, 'DE'),
    /* 0xD6 */ cpu_blk_3.sub_A_imm8,
    /* 0xD7 */ (dev: Device) => cpu_blk_3.rst_tgt3(dev, 0x10),
    /* 0xD8 */ (dev: Device) => cpu_blk_3.ret_cond(dev, 'C'),
    /* 0xD9 */ cpu_blk_3.reti,
    /* 0xDA */ (dev: Device) => cpu_blk_3.jp_cond_imm16(dev, 'C'),
    /* 0xDB */ this.hard_lock,
    /* 0xDC */ (dev: Device) => cpu_blk_3.call_cond_imm16(dev, 'C'),
    /* 0xDD */ this.hard_lock,
    /* 0xDE */ cpu_blk_3.sbc_A_imm8,
    /* 0xDF */ (dev: Device) => cpu_blk_3.rst_tgt3(dev, 0x18),

    /* 0xE0 */ cpu_blk_3.ldh_a8_A,
    /* 0xE1 */ (dev: Device) => cpu_blk_3.pop_r16(dev, 'HL'),
    /* 0xE2 */ cpu_blk_3.ldh_Cmem_A,
    /* 0xE3 */ this.hard_lock,
    /* 0xE4 */ this.hard_lock,
    /* 0xE5 */ (dev: Device) => cpu_blk_3.push_r16(dev, 'HL'),
    /* 0xE6 */ cpu_blk_3.and_A_imm8,
    /* 0xE7 */ (dev: Device) => cpu_blk_3.rst_tgt3(dev, 0x20),
    /* 0xE8 */ cpu_blk_3.add_SP_r8,
    /* 0xE9 */ cpu_blk_3.jp_HL,
    /* 0xEA */ cpu_blk_3.ld_a16_A,
    /* 0xEB */ this.hard_lock,
    /* 0xEC */ this.hard_lock,
    /* 0xED */ this.hard_lock,
    /* 0xEE */ cpu_blk_3.xor_A_imm8,
    /* 0xEF */ (dev: Device) => cpu_blk_3.rst_tgt3(dev, 0x28),

    /* 0xF0 */ cpu_blk_3.ldh_A_a8,
    /* 0xF1 */ (dev: Device) => cpu_blk_3.pop_r16(dev, 'AF'),
    /* 0xF2 */ cpu_blk_3.ldh_A_Cmem,
    /* 0xF3 */ cpu_blk_3.di,
    /* 0xF4 */ this.hard_lock,
    /* 0xF5 */ (dev: Device) => cpu_blk_3.push_r16(dev, 'AF'),
    /* 0xF6 */ cpu_blk_3.or_A_imm8,
    /* 0xF7 */ (dev: Device) => cpu_blk_3.rst_tgt3(dev, 0x30),
    /* 0xF8 */ cpu_blk_3.ld_HL_SPr8,
    /* 0xF9 */ cpu_blk_3.ld_SP_HL,
    /* 0xFA */ cpu_blk_3.ld_A_a16,
    /* 0xFB */ cpu_blk_3.ei,
    /* 0xFC */ this.hard_lock,
    /* 0xFD */ this.hard_lock,
    /* 0xFE */ cpu_blk_3.cp_A_imm8,
    /* 0xFF */ (dev: Device) => cpu_blk_3.rst_tgt3(dev, 0x38),
        ];

        this.isa_ext = [
    /* 0x00 */ (dev: Device) => cpu_blk_3_ext.rlc_r8(this.dev, 'B'),
    /* 0x01 */ (dev: Device) => cpu_blk_3_ext.rlc_r8(this.dev, 'C'),
    /* 0x02 */ (dev: Device) => cpu_blk_3_ext.rlc_r8(this.dev, 'D'),
    /* 0x03 */ (dev: Device) => cpu_blk_3_ext.rlc_r8(this.dev, 'E'),
    /* 0x04 */ (dev: Device) => cpu_blk_3_ext.rlc_r8(this.dev, 'H'),
    /* 0x05 */ (dev: Device) => cpu_blk_3_ext.rlc_r8(this.dev, 'L'),
    /* 0x06 */ (dev: Device) => cpu_blk_3_ext.rlc_r8(this.dev, '[HL]'),
    /* 0x07 */ (dev: Device) => cpu_blk_3_ext.rlc_r8(this.dev, 'A'),
    /* 0x08 */ (dev: Device) => cpu_blk_3_ext.rrc_r8(this.dev, 'B'),
    /* 0x09 */ (dev: Device) => cpu_blk_3_ext.rrc_r8(this.dev, 'C'),
    /* 0x0A */ (dev: Device) => cpu_blk_3_ext.rrc_r8(this.dev, 'D'),
    /* 0x0B */ (dev: Device) => cpu_blk_3_ext.rrc_r8(this.dev, 'E'),
    /* 0x0C */ (dev: Device) => cpu_blk_3_ext.rrc_r8(this.dev, 'H'),
    /* 0x0D */ (dev: Device) => cpu_blk_3_ext.rrc_r8(this.dev, 'L'),
    /* 0x0E */ (dev: Device) => cpu_blk_3_ext.rrc_r8(this.dev, '[HL]'),
    /* 0x0F */ (dev: Device) => cpu_blk_3_ext.rrc_r8(this.dev, 'A'),

    /* 0x10 */ (dev: Device) => cpu_blk_3_ext.rl_r8(this.dev, 'B'),
    /* 0x11 */ (dev: Device) => cpu_blk_3_ext.rl_r8(this.dev, 'C'),
    /* 0x12 */ (dev: Device) => cpu_blk_3_ext.rl_r8(this.dev, 'D'),
    /* 0x13 */ (dev: Device) => cpu_blk_3_ext.rl_r8(this.dev, 'E'),
    /* 0x14 */ (dev: Device) => cpu_blk_3_ext.rl_r8(this.dev, 'H'),
    /* 0x15 */ (dev: Device) => cpu_blk_3_ext.rl_r8(this.dev, 'L'),
    /* 0x16 */ (dev: Device) => cpu_blk_3_ext.rl_r8(this.dev, '[HL]'),
    /* 0x17 */ (dev: Device) => cpu_blk_3_ext.rl_r8(this.dev, 'A'),
    /* 0x18 */ (dev: Device) => cpu_blk_3_ext.rr_r8(this.dev, 'B'),
    /* 0x19 */ (dev: Device) => cpu_blk_3_ext.rr_r8(this.dev, 'C'),
    /* 0x1A */ (dev: Device) => cpu_blk_3_ext.rr_r8(this.dev, 'D'),
    /* 0x1B */ (dev: Device) => cpu_blk_3_ext.rr_r8(this.dev, 'E'),
    /* 0x1C */ (dev: Device) => cpu_blk_3_ext.rr_r8(this.dev, 'H'),
    /* 0x1D */ (dev: Device) => cpu_blk_3_ext.rr_r8(this.dev, 'L'),
    /* 0x1E */ (dev: Device) => cpu_blk_3_ext.rr_r8(this.dev, '[HL]'),
    /* 0x1F */ (dev: Device) => cpu_blk_3_ext.rr_r8(this.dev, 'A'),

    /* 0x20 */ (dev: Device) => cpu_blk_3_ext.sla_r8(this.dev, 'B'),
    /* 0x21 */ (dev: Device) => cpu_blk_3_ext.sla_r8(this.dev, 'C'),
    /* 0x22 */ (dev: Device) => cpu_blk_3_ext.sla_r8(this.dev, 'D'),
    /* 0x23 */ (dev: Device) => cpu_blk_3_ext.sla_r8(this.dev, 'E'),
    /* 0x24 */ (dev: Device) => cpu_blk_3_ext.sla_r8(this.dev, 'H'),
    /* 0x25 */ (dev: Device) => cpu_blk_3_ext.sla_r8(this.dev, 'L'),
    /* 0x26 */ (dev: Device) => cpu_blk_3_ext.sla_r8(this.dev, '[HL]'),
    /* 0x27 */ (dev: Device) => cpu_blk_3_ext.sla_r8(this.dev, 'A'),
    /* 0x28 */ (dev: Device) => cpu_blk_3_ext.sra_r8(this.dev, 'B'),
    /* 0x29 */ (dev: Device) => cpu_blk_3_ext.sra_r8(this.dev, 'C'),
    /* 0x2A */ (dev: Device) => cpu_blk_3_ext.sra_r8(this.dev, 'D'),
    /* 0x2B */ (dev: Device) => cpu_blk_3_ext.sra_r8(this.dev, 'E'),
    /* 0x2C */ (dev: Device) => cpu_blk_3_ext.sra_r8(this.dev, 'H'),
    /* 0x2D */ (dev: Device) => cpu_blk_3_ext.sra_r8(this.dev, 'L'),
    /* 0x2E */ (dev: Device) => cpu_blk_3_ext.sra_r8(this.dev, '[HL]'),
    /* 0x2F */ (dev: Device) => cpu_blk_3_ext.sra_r8(this.dev, 'A'),

    /* 0x30 */ (dev: Device) => cpu_blk_3_ext.swap_r8(this.dev, 'B'),
    /* 0x31 */ (dev: Device) => cpu_blk_3_ext.swap_r8(this.dev, 'C'),
    /* 0x32 */ (dev: Device) => cpu_blk_3_ext.swap_r8(this.dev, 'D'),
    /* 0x33 */ (dev: Device) => cpu_blk_3_ext.swap_r8(this.dev, 'E'),
    /* 0x34 */ (dev: Device) => cpu_blk_3_ext.swap_r8(this.dev, 'H'),
    /* 0x35 */ (dev: Device) => cpu_blk_3_ext.swap_r8(this.dev, 'L'),
    /* 0x36 */ (dev: Device) => cpu_blk_3_ext.swap_r8(this.dev, '[HL]'),
    /* 0x37 */ (dev: Device) => cpu_blk_3_ext.swap_r8(this.dev, 'A'),
    /* 0x38 */ (dev: Device) => cpu_blk_3_ext.srl_r8(this.dev, 'B'),
    /* 0x39 */ (dev: Device) => cpu_blk_3_ext.srl_r8(this.dev, 'C'),
    /* 0x3A */ (dev: Device) => cpu_blk_3_ext.srl_r8(this.dev, 'D'),
    /* 0x3B */ (dev: Device) => cpu_blk_3_ext.srl_r8(this.dev, 'E'),
    /* 0x3C */ (dev: Device) => cpu_blk_3_ext.srl_r8(this.dev, 'H'),
    /* 0x3D */ (dev: Device) => cpu_blk_3_ext.srl_r8(this.dev, 'L'),
    /* 0x3E */ (dev: Device) => cpu_blk_3_ext.srl_r8(this.dev, '[HL]'),
    /* 0x3F */ (dev: Device) => cpu_blk_3_ext.srl_r8(this.dev, 'A'),

    /* 0x40 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 0, 'B'),
    /* 0x41 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 0, 'C'),
    /* 0x42 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 0, 'D'),
    /* 0x43 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 0, 'E'),
    /* 0x44 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 0, 'H'),
    /* 0x45 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 0, 'L'),
    /* 0x46 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 0, '[HL]'),
    /* 0x47 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 0, 'A'),
    /* 0x48 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 1, 'B'),
    /* 0x49 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 1, 'C'),
    /* 0x4A */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 1, 'D'),
    /* 0x4B */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 1, 'E'),
    /* 0x4C */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 1, 'H'),
    /* 0x4D */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 1, 'L'),
    /* 0x4E */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 1, '[HL]'),
    /* 0x4F */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 1, 'A'),

    /* 0x50 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 2, 'B'),
    /* 0x51 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 2, 'C'),
    /* 0x52 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 2, 'D'),
    /* 0x53 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 2, 'E'),
    /* 0x54 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 2, 'H'),
    /* 0x55 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 2, 'L'),
    /* 0x56 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 2, '[HL]'),
    /* 0x57 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 2, 'A'),
    /* 0x58 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 3, 'B'),
    /* 0x59 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 3, 'C'),
    /* 0x5A */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 3, 'D'),
    /* 0x5B */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 3, 'E'),
    /* 0x5C */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 3, 'H'),
    /* 0x5D */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 3, 'L'),
    /* 0x5E */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 3, '[HL]'),
    /* 0x5F */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 3, 'A'),

    /* 0x60 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 4, 'B'),
    /* 0x61 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 4, 'C'),
    /* 0x62 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 4, 'D'),
    /* 0x63 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 4, 'E'),
    /* 0x64 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 4, 'H'),
    /* 0x65 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 4, 'L'),
    /* 0x66 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 4, '[HL]'),
    /* 0x67 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 4, 'A'),
    /* 0x68 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 5, 'B'),
    /* 0x69 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 5, 'C'),
    /* 0x6A */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 5, 'D'),
    /* 0x6B */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 5, 'E'),
    /* 0x6C */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 5, 'H'),
    /* 0x6D */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 5, 'L'),
    /* 0x6E */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 5, '[HL]'),
    /* 0x6F */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 5, 'A'),

    /* 0x70 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 6, 'B'),
    /* 0x71 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 6, 'C'),
    /* 0x72 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 6, 'D'),
    /* 0x73 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 6, 'E'),
    /* 0x74 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 6, 'H'),
    /* 0x75 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 6, 'L'),
    /* 0x76 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 6, '[HL]'),
    /* 0x77 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 6, 'A'),
    /* 0x78 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 7, 'B'),
    /* 0x79 */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 7, 'C'),
    /* 0x7A */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 7, 'D'),
    /* 0x7B */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 7, 'E'),
    /* 0x7C */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 7, 'H'),
    /* 0x7D */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 7, 'L'),
    /* 0x7E */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 7, '[HL]'),
    /* 0x7F */ (dev: Device) => cpu_blk_3_ext.bit_u3_r8(this.dev, 7, 'A'),

    /* 0x80 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 0, 'B'),
    /* 0x81 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 0, 'C'),
    /* 0x82 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 0, 'D'),
    /* 0x83 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 0, 'E'),
    /* 0x84 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 0, 'H'),
    /* 0x85 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 0, 'L'),
    /* 0x86 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 0, '[HL]'),
    /* 0x87 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 0, 'A'),
    /* 0x88 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 1, 'B'),
    /* 0x89 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 1, 'C'),
    /* 0x8A */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 1, 'D'),
    /* 0x8B */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 1, 'E'),
    /* 0x8C */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 1, 'H'),
    /* 0x8D */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 1, 'L'),
    /* 0x8E */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 1, '[HL]'),
    /* 0x8F */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 1, 'A'),

    /* 0x90 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 2, 'B'),
    /* 0x91 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 2, 'C'),
    /* 0x92 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 2, 'D'),
    /* 0x93 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 2, 'E'),
    /* 0x94 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 2, 'H'),
    /* 0x95 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 2, 'L'),
    /* 0x96 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 2, '[HL]'),
    /* 0x97 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 2, 'A'),
    /* 0x98 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 3, 'B'),
    /* 0x99 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 3, 'C'),
    /* 0x9A */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 3, 'D'),
    /* 0x9B */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 3, 'E'),
    /* 0x9C */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 3, 'H'),
    /* 0x9D */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 3, 'L'),
    /* 0x9E */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 3, '[HL]'),
    /* 0x9F */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 3, 'A'),

    /* 0xA0 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 4, 'B'),
    /* 0xA1 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 4, 'C'),
    /* 0xA2 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 4, 'D'),
    /* 0xA3 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 4, 'E'),
    /* 0xA4 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 4, 'H'),
    /* 0xA5 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 4, 'L'),
    /* 0xA6 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 4, '[HL]'),
    /* 0xA7 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 4, 'A'),
    /* 0xA8 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 5, 'B'),
    /* 0xA9 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 5, 'C'),
    /* 0xAA */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 5, 'D'),
    /* 0xAB */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 5, 'E'),
    /* 0xAC */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 5, 'H'),
    /* 0xAD */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 5, 'L'),
    /* 0xAE */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 5, '[HL]'),
    /* 0xAF */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 5, 'A'),

    /* 0xB0 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 6, 'B'),
    /* 0xB1 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 6, 'C'),
    /* 0xB2 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 6, 'D'),
    /* 0xB3 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 6, 'E'),
    /* 0xB4 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 6, 'H'),
    /* 0xB5 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 6, 'L'),
    /* 0xB6 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 6, '[HL]'),
    /* 0xB7 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 6, 'A'),
    /* 0xB8 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 7, 'B'),
    /* 0xB9 */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 7, 'C'),
    /* 0xBA */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 7, 'D'),
    /* 0xBB */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 7, 'E'),
    /* 0xBC */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 7, 'H'),
    /* 0xBD */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 7, 'L'),
    /* 0xBE */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 7, '[HL]'),
    /* 0xBF */ (dev: Device) => cpu_blk_3_ext.res_u3_r8(this.dev, 7, 'A'),

    /* 0xC0 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 0, 'B'),
    /* 0xC1 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 0, 'C'),
    /* 0xC2 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 0, 'D'),
    /* 0xC3 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 0, 'E'),
    /* 0xC4 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 0, 'H'),
    /* 0xC5 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 0, 'L'),
    /* 0xC6 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 0, '[HL]'),
    /* 0xC7 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 0, 'A'),
    /* 0xC8 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 1, 'B'),
    /* 0xC9 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 1, 'C'),
    /* 0xCA */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 1, 'D'),
    /* 0xCB */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 1, 'E'),
    /* 0xCC */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 1, 'H'),
    /* 0xCD */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 1, 'L'),
    /* 0xCE */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 1, '[HL]'),
    /* 0xCF */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 1, 'A'),

    /* 0xD0 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 2, 'B'),
    /* 0xD1 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 2, 'C'),
    /* 0xD2 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 2, 'D'),
    /* 0xD3 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 2, 'E'),
    /* 0xD4 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 2, 'H'),
    /* 0xD5 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 2, 'L'),
    /* 0xD6 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 2, '[HL]'),
    /* 0xD7 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 2, 'A'),
    /* 0xD8 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 3, 'B'),
    /* 0xD9 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 3, 'C'),
    /* 0xDA */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 3, 'D'),
    /* 0xDB */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 3, 'E'),
    /* 0xDC */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 3, 'H'),
    /* 0xDD */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 3, 'L'),
    /* 0xDE */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 3, '[HL]'),
    /* 0xDF */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 3, 'A'),

    /* 0xE0 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 4, 'B'),
    /* 0xE1 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 4, 'C'),
    /* 0xE2 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 4, 'D'),
    /* 0xE3 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 4, 'E'),
    /* 0xE4 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 4, 'H'),
    /* 0xE5 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 4, 'L'),
    /* 0xE6 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 4, '[HL]'),
    /* 0xE7 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 4, 'A'),
    /* 0xE8 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 5, 'B'),
    /* 0xE9 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 5, 'C'),
    /* 0xEA */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 5, 'D'),
    /* 0xEB */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 5, 'E'),
    /* 0xEC */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 5, 'H'),
    /* 0xED */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 5, 'L'),
    /* 0xEE */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 5, '[HL]'),
    /* 0xEF */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 5, 'A'),

    /* 0xF0 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 6, 'B'),
    /* 0xF1 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 6, 'C'),
    /* 0xF2 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 6, 'D'),
    /* 0xF3 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 6, 'E'),
    /* 0xF4 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 6, 'H'),
    /* 0xF5 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 6, 'L'),
    /* 0xF6 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 6, '[HL]'),
    /* 0xF7 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 6, 'A'),
    /* 0xF8 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 7, 'B'),
    /* 0xF9 */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 7, 'C'),
    /* 0xFA */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 7, 'D'),
    /* 0xFB */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 7, 'E'),
    /* 0xFC */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 7, 'H'),
    /* 0xFD */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 7, 'L'),
    /* 0xFE */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 7, '[HL]'),
    /* 0xFF */ (dev: Device) => cpu_blk_3_ext.set_u3_r8(this.dev, 7, 'A'),
        ];
    }

    tick() {
        this.IR = this.fetch_byte();
        
        if (this.IR > 0xFF && this.mem.IsBootRomMapped) {
            // Unmap the boot ROM once we move past it
            this.mem.IsBootRomMapped = false;
        }

        this.isa[this.IR](this.dev);

        this.mem.tick();
    }

    private ext_instr() {
        const instr = this.fetch_byte();
        this.IR = (this.IR << 8) | instr;
        this.isa_ext[instr](this.dev);
    }

    fetch_byte(): number {
        return this.mem.read(this.reg.PC++);
    }

    fetch_word(): number {
        const lo = this.mem.read(this.reg.PC++);
        const hi = this.mem.read(this.reg.PC++);
        return MAKEWORD(hi, lo);
    }

    pop_byte(): number {
        return this.mem.read(this.reg.SP++);
    }

    pop_word(): number {
        return this.mem.read(this.reg.SP++) | (this.mem.read(this.reg.SP++) << 8);
    }

    push_byte(val: number) {
        this.mem.write(--this.reg.SP, val);
    }

    push_word(val: number) {
        this.mem.write(--this.reg.SP, val >> 8);
        this.mem.write(--this.reg.SP, val & 0xFF);
    }

    hard_lock() {
        throw Error('CPU is hard locked');
    }

    debug() {
        let txt = "CPU State:\n";
        txt += 'A F = '+HEX_BYTE(this.reg.A)+' '+HEX_BYTE(this.reg.F)+"\n";
        txt += 'B C = '+HEX_BYTE(this.reg.B)+' '+HEX_BYTE(this.reg.C)+"\n";
        txt += 'D E = '+HEX_BYTE(this.reg.D)+' '+HEX_BYTE(this.reg.E)+"\n";
        txt += 'H L = '+HEX_BYTE(this.reg.H)+' '+HEX_BYTE(this.reg.L)+"\n";
        txt += 'PC = $'+HEX_WORD(this.reg.PC)+"\n";
        txt += 'SP = $'+HEX_WORD(this.reg.SP)+"\n";
        txt += 'IR = $'+(this.IR > 0xFF ? HEX_WORD(this.IR) : HEX_BYTE(this.IR))+"\n";
        txt += 'Flags = '+(this.reg.flag.Z?'Z':'-')+(this.reg.flag.N?'N':'-')+(this.reg.flag.H?'H':'-')+(this.reg.flag.C?'C':'-')+"\n";
        console.log(txt);
    }
}