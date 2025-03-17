import CPU from "./CPU";
import Memory from "./Memory";
import PPU from "./PPU";

enum GBMode {
    STOPPED = 0,
    RUNNING = 1,
};

export default class GameBoy
{
    mem: Memory;
    cpu: CPU;
    ppu: PPU;
    mode: GBMode;
    fps: number;
    fps_timer: NodeJS.Timeout|null = null;

    constructor() {
        this.mem = new Memory();
        this.cpu = new CPU(this.mem);
        this.ppu = new PPU(this.mem);
        this.mode = GBMode.STOPPED;
        this.fps = 0;
    }

    runTetris() {
        this.mem.loadTetris();
    }

    start() {
        console.log('Starting Emulation');
        this.mode = GBMode.RUNNING;
        const runFrameCycle = () => {
            let t1 = performance.now();
            for (let i = 0; i < 17556; i++) {
                this.cpu.tick();
            }
            this.ppu.render();
            this.fps++;
            let elapsed = performance.now() - t1;
            while (elapsed < 16.74) {
                elapsed = performance.now() - t1;
            }
            if (this.mode === GBMode.RUNNING)
                requestAnimationFrame(runFrameCycle);
        };
        requestAnimationFrame(runFrameCycle);

        this.fps_timer = setInterval(() => {
            console.log(`FPS: ${this.fps / 3}`);
            this.fps = 0;
        }, 3000);
    }

    stop() {
        this.mode = GBMode.STOPPED;
        if (this.fps_timer)
            clearTimeout(this.fps_timer);
    }
}