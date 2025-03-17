interface FlagBits {
    pos: number;
    len: number;
    mask: number;
}

const LCD_CONTROL  = 0xFF40;
const LCD_STATUS   = 0xFF41;
const LCD_Y_COORD  = 0xFF44;
const LCD_LY_CMP   = 0xFF45;
const LCD_WY_COORD = 0xFF4A;
const LCD_WX_COORD = 0xFF4B;

const LCD_CTRL_PPU_ENABLE        = { pos: 7, len: 1, mask: 0b10000000 };
const LCD_CTRL_WND_TILE_MAP_AREA = { pos: 6, len: 1, mask: 0b01000000 };
const LCD_CTRL_WND_ENABLE        = { pos: 5, len: 1, mask: 0b00100000 };
const LCD_CTRL_TILE_DATA_AREA    = { pos: 4, len: 1, mask: 0b00010000 };
const LCD_CTRL_BG_TILE_MAP_AREA  = { pos: 3, len: 1, mask: 0b00001000 };
const LCD_CTRL_OBJ_SIZE          = { pos: 2, len: 1, mask: 0b00000100 };
const LCD_CTRL_OBJ_ENABLE        = { pos: 1, len: 1, mask: 0b00000010 };
const LCD_CTRL_BG_WND_ENABLE     = { pos: 0, len: 1, mask: 0b00000001 };

const LCD_STAT_LYC_INT = { pos: 6, len: 1 };
const LCD_STAT_MODE_2  = { pos: 5, len: 1 };
const LCD_STAT_MODE_1  = { pos: 4, len: 1 };
const LCD_STAT_MODE_0  = { pos: 3, len: 1 };
const LCD_LYC_LY       = { pos: 2, len: 1 };
const LCD_PPU_MODE     = { pos: 0, len: 2 };

const PPU_MODE_OAM_SCAN     = 2;
const PPU_MODE_DRAWING      = 3;
const PPU_MODE_HORIZ_BLANK  = 0;
const PPU_MODE_VERT_BLANK   = 1;

const LCD_TILE_MAP_AREA_0  = 0x9800;
const LCD_TILE_MAP_AREA_1  = 0x9C00;

const LCD_TILE_DATA_AREA_0 = 0x8000;
const LCD_TILE_DATA_AREA_1 = 0x8800;
const LCD_TILE_DATA_AREA_2 = 0x9000;

const LCD_BG_TILE_MAP_AREA_0 = 0x9800;
const LCD_BG_TILE_MAP_AREA_1 = 0x9C00;

export { 
    FlagBits, LCD_CONTROL, LCD_STATUS, LCD_Y_COORD, LCD_LY_CMP, LCD_WY_COORD, LCD_WX_COORD, LCD_CTRL_PPU_ENABLE, LCD_CTRL_WND_TILE_MAP_AREA, 
    LCD_CTRL_WND_ENABLE, LCD_CTRL_TILE_DATA_AREA, LCD_CTRL_BG_TILE_MAP_AREA, LCD_CTRL_OBJ_SIZE, LCD_CTRL_OBJ_ENABLE, LCD_CTRL_BG_WND_ENABLE, 
    LCD_STAT_LYC_INT, LCD_STAT_MODE_2, LCD_STAT_MODE_1, LCD_STAT_MODE_0, LCD_LYC_LY, LCD_PPU_MODE, PPU_MODE_OAM_SCAN, PPU_MODE_DRAWING, 
    PPU_MODE_HORIZ_BLANK, PPU_MODE_VERT_BLANK, LCD_TILE_MAP_AREA_0, LCD_TILE_MAP_AREA_1, LCD_TILE_DATA_AREA_0, LCD_TILE_DATA_AREA_1, LCD_TILE_DATA_AREA_2, 
    LCD_BG_TILE_MAP_AREA_0, LCD_BG_TILE_MAP_AREA_1
 };