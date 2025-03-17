import { HEX_BYTE, PTR_16, S8 } from "./cpu/Utils";
import GameBoy from "./GameBoy";
import Memory from "./Memory";
import { LCD_CONTROL, LCD_CTRL_BG_TILE_MAP_AREA, LCD_CTRL_BG_WND_ENABLE, LCD_CTRL_OBJ_ENABLE, LCD_CTRL_OBJ_SIZE, LCD_CTRL_PPU_ENABLE, LCD_CTRL_TILE_DATA_AREA, LCD_CTRL_WND_ENABLE, LCD_CTRL_WND_TILE_MAP_AREA } from "./ppu/Utils";

export default class PPU
{
    static WIDTH = 320;
    static HEIGHT = 288;

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private bg_layer: HTMLCanvasElement;
    private bg_ctx: CanvasRenderingContext2D;

    private mem: Memory;

    static PALLETE: string[] = [
        "#ffffff",
        "#e1f6d3",
        "#8abd72",
        "#31684f"
    ];

    constructor(dev: GameBoy) {
        this.mem = dev.mem;

        this.canvas = document.getElementById('screen') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        
        this.bg_layer = document.createElement('canvas');
        this.bg_layer.width = 320;
        this.bg_layer.height = 288;
        this.bg_ctx = this.bg_layer.getContext('2d') as CanvasRenderingContext2D;

        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(0, 0, PPU.WIDTH, PPU.HEIGHT);
    }

    render() {
        /**
         * Get the control register (we'll need all of it)
         * Render the Background layer (this layer is larger than the window, which can be moved around)
         * Render the Window layer (fixed and doesn't scroll)
         * Render the Objects (sprites)
         */
        const pallete = [];
        const FF47 = this.mem.read(0xFF47);
        pallete.push(PPU.PALLETE[FF47 & 0x03]);
        pallete.push(PPU.PALLETE[(FF47 >> 2) & 0x03]);
        pallete.push(PPU.PALLETE[(FF47 >> 4) & 0x03]);
        pallete.push(PPU.PALLETE[(FF47 >> 6) & 0x03]);

        const LCDC = this.mem.read(LCD_CONTROL[PTR_16]);
        const lcd_enable = Boolean(LCDC & LCD_CTRL_PPU_ENABLE);
        
        if (!lcd_enable) return;

        const wnd_tile_map_area = (LCDC & LCD_CTRL_WND_TILE_MAP_AREA) ? 0x9C00 : 0x9800;
        const wnd_enable = Boolean(LCDC & LCD_CTRL_WND_ENABLE);
        const tile_data_area = (LCDC & LCD_CTRL_TILE_DATA_AREA) ? 0x8000 : 0x9000;
        const bg_tile_map_area = (LCDC & LCD_CTRL_BG_TILE_MAP_AREA) ? 0x9C00 : 0x9800;
        const obj_size = (LCDC & LCD_CTRL_OBJ_SIZE) ? 8 : 16;
        const obj_enable = Boolean(LCDC & LCD_CTRL_OBJ_ENABLE);
        const bg_wnd_enable = Boolean(LCDC & LCD_CTRL_BG_WND_ENABLE);

        let tile_data: Record<number, Uint8Array> = {};
        if (bg_wnd_enable) {
            for (let tile_y = 0; tile_y < 32; tile_y++) {
                for (let tile_x = 0; tile_x < 32; tile_x++) {
                    const offset = bg_tile_map_area + (32 * tile_y) + tile_x;
                    const tile_idx = this.mem.read(offset);
                    
                    if (!(tile_idx in tile_data)) {
                        const tile_data_addr = tile_data_area == 0x8000 ? tile_data_area + (tile_idx * 16) : tile_data_area + (S8(tile_idx) * 16);
                        tile_data[tile_idx] = this.mem.vram_slice(tile_data_addr, 16);
                    }

                    const tile_pos = [tile_x * 16, tile_y * 16];
                    for (let pixel_y = 0; pixel_y < 8; pixel_y++) {
                        
                        const byte1 = tile_data[tile_idx][pixel_y * 2];
                        const byte2 = tile_data[tile_idx][(pixel_y * 2) + 1];

                        for (let pixel_x = 0; pixel_x < 8; pixel_x++) {
                            const bit_mask = 0x80 >> pixel_x;
                            const colorIdx = ((byte2 & bit_mask) ? 2 : 0) | ((byte1 & bit_mask) ? 1 : 0);
                            this.bg_ctx.fillStyle = pallete[colorIdx];
                            this.bg_ctx.fillRect(tile_pos[0] + (pixel_x * 2), tile_pos[1] + (pixel_y * 2), 2, 2);
                        }
                    }
                }
            }

            const SCY = this.mem.read(0xFF42);
            const SCX = this.mem.read(0xFF43);
            this.ctx.drawImage(this.bg_layer, -SCX, -SCY); 

            // TODO: Render window
        } else {
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.fillRect(0, 0, PPU.WIDTH, PPU.HEIGHT);
        }

        if (obj_enable) {
            tile_data = {};
            for (let i = 0; i < 40; i++) {
                const offset = 0xFE00 + (i * 4);
                const y_pos = this.mem.read(offset);
                const x_pos = this.mem.read(offset + 1);
                const tile_idx = this.mem.read(offset + 2);
                const attribs = this.mem.read(offset + 3);
    
                if (!(tile_idx in tile_data)) {
                    const tile_data_addr = 0x8000 + tile_idx;
                    tile_data[tile_idx] = this.mem.vram_slice(tile_data_addr, 16);
                }
    
                const obj_pos = [x_pos, y_pos];
                for (let pixel_y = 0; pixel_y < 8; pixel_y++) {
                    const byte1 = tile_data[tile_idx][pixel_y * 2];
                    const byte2 = tile_data[tile_idx][(pixel_y * 2) + 1];

                    for (let pixel_x = 0; pixel_x < 8; pixel_x++) {
                        const bit_mask = 0x80 >> pixel_x;
                        const colorIdx = ((byte2 & bit_mask) ? 2 : 0) | ((byte1 & bit_mask) ? 1 : 0);
                        this.ctx.fillStyle = PPU.PALLETE[colorIdx];
                        this.ctx.fillRect(obj_pos[1] + pixel_y, obj_pos[0] + pixel_x, 1, 1);
                    }
                }
            }

            console.log('OBJ Tiles Used: ' + Object.keys(tile_data).length);
        }

    }
}