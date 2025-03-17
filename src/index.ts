import GameBoy from "./GameBoy";

window.onload = () => {
    const gb = new GameBoy();
    gb.runTetris();
    gb.start();

    const btn = document.getElementById('btnStartStop');
    btn?.addEventListener('click', () => {
        if (gb.mode === 1) {
            gb.stop();
            gb.debug();
            btn.innerText = "Start";
        } else {
            gb.start();
            btn.innerText = "Stop";
        }
    });
};