import GameBoy from "./GameBoy";

window.onload = () => {
    const gb = new GameBoy();
    gb.runTetris();
    gb.start();
};