import CPU from "./CPU";
import { StackTrace } from "./cpu/Utils";
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
    m_cycle: number;

    constructor() {
        this.mem = new Memory(this);
        this.cpu = new CPU(this);
        this.ppu = new PPU(this);
        this.mode = GBMode.STOPPED;
        this.fps = 0;
        this.m_cycle = 0;
    }

    init() {
        this.mem.write(0xFF00, 0xCF);
    }

    runTetris() {
        this.init();
        this.mem.loadTetris();
    }

    start() {
        console.log('Starting Emulation');
        this.mode = GBMode.RUNNING;
        const runFrameCycle = () => {
            let t1 = performance.now();
            try {
                while (this.m_cycle++ < 17556 && this.mode === GBMode.RUNNING) {
                    this.cpu.tick();
                }
                this.m_cycle = 0;
                this.ppu.render();
            } catch (e) {
                console.error(e);
                this.stack_trace();
                const btn = document.getElementById('btnStartStop');
                if (btn)
                    btn.innerText = 'Start';
                this.stop();
            } 
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
        console.log('Stopped Emulation');
        this.mode = GBMode.STOPPED;
        if (this.fps_timer)
            clearTimeout(this.fps_timer);
        this.stack_trace();
    }

    step() {
        this.cpu.tick();
        console.log(StackTrace[StackTrace.length - 1]);
        this.m_cycle++;
        if (this.m_cycle === 17556) {
            this.m_cycle = 0;
            this.ppu.render();
        }
    }

    stack_trace() {
        for (let idx in StackTrace) {
            console.log('trace: '+StackTrace[idx]);
        }
        this.cpu.debug();
    }

    debug() {
        this.mem.debug();
    }
}