export default class MBC
{
    public BankID: number;

    constructor() {
        this.BankID = 0;
    }

    write(addr: number, value: number) {
        if (addr >= 0x2000 && addr <= 0x3FFF) {
            this.BankID = value & 0x1F;
        }
    }
}