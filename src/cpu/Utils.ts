import CPU from "../CPU";
import Memory from "../Memory";

const MAKEWORD = (H: number, L: number): number => (H << 8) | L;
const HI = (n: number): number => n >> 8;
const LO = (n: number): number => n & 0xFF;
const S8 = (n: number): number => (0x80 & n) ? (0x7F & n) - 128 : n;
const BYTE = (n: number): number => n & 0xFF;
const WORD = (n: number): number => n & 0xFFFF;

const HEX_BYTE = (n: number): string => {
    const str = n.toString(16).toUpperCase();
    return (str.length === 1) ? '0'+str : str;
};
const HEX_WORD = (n: number): string => {
    const str = n.toString(16).toUpperCase();
    return (str.length < 4) ? '0'.repeat(4 - str.length)+str : str;
};

type CoreInstr = (dev: Device) => void;

interface Device {
    cpu: CPU;
    mem: Memory;
}

type R8 = 'B'|'C'|'D'|'E'|'H'|'L'|'[HL]'|'A';
const R8_idx = ['B', 'C', 'D', 'E', 'H', 'L', '[HL]', 'A'];

type R16 = 'BC'|'DE'|'HL'|'SP';
const R16_idx = ['BC', 'DE', 'HL', 'SP'];

type R16STK = 'BC'|'DE'|'HL'|'AF';
const R16STK_idx = ['BC', 'DE', 'HL', 'AF'];

type R16MEM = 'BC'|'DE'|'HL+'|'HL-';
const R16MEM_idx = ['BC', 'DE', 'HL+', 'HL-'];

type COND = 'NZ'|'Z'|'NC'|'C';
const COND_idx = ['NZ', 'Z', 'NC', 'C'];

const DECOMP = (text: string) => {};

export { MAKEWORD, HI, LO, S8, BYTE, WORD, CoreInstr, Device, R16_idx, R8_idx, R16STK_idx, R16MEM_idx, COND_idx, R8, R16, R16STK, R16MEM, COND, DECOMP, HEX_BYTE, HEX_WORD };