import Memory from "./Memory";

export default class PPU
{
    static WIDTH = 480;
    static HEIGHT = 432;

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private mem: Memory;

    constructor(mem: Memory) {
        this.mem = mem;

        this.canvas = document.getElementById('screen') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        
        this.ctx.fillStyle = '#CADC9F';
        this.ctx.fillRect(0, 0, PPU.WIDTH, PPU.HEIGHT);
    }

    render() {
        
    }
}