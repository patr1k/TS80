import { Device, R8, WORD, DECOMP } from "./Utils";

function halt(dev: Device) {
    DECOMP("HALT");
    dev.cpu.HALT = true;
    dev.cpu.reg.PC = WORD(dev.cpu.reg.PC - 1);
}

function ld_r8_r8(dev: Device, r8dst: R8, r8src: R8) {
    DECOMP(`LD ${r8dst}, ${r8src}`);
    
    if (r8dst === '[HL]' && r8src === '[HL]') {
        return;
    }
    
    if (r8dst === '[HL]') {
        dev.mem.write(dev.cpu.reg.HL, dev.cpu.reg[r8src as Exclude<R8, '[HL]'>]);
    } else if (r8src === '[HL]') {
        dev.cpu.reg[r8dst as Exclude<R8, '[HL]'>] = dev.mem.read(dev.cpu.reg.HL);
    } else {
        dev.cpu.reg[r8dst] = dev.cpu.reg[r8src];
    }
}

export { 
    halt, ld_r8_r8
 };