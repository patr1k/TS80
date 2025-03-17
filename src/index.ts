import GameBoy from "./GameBoy";

window.onload = () => {
    const gb = new GameBoy();
    gb.runTetris();
    gb.start();

    const btnStartStop = document.getElementById('btnStartStop');
    const btnStep = document.getElementById('btnStep');
    btnStartStop?.addEventListener('click', () => {
        if (gb.mode === 1) {
            gb.stop();
            gb.debug();
            btnStartStop.innerText = "Start";
        } else {
            gb.start();
            btnStartStop.innerText = "Stop";
        }
    });
    btnStep?.addEventListener('click', () => {
        if (gb.mode === 0)
            gb.step();
    });
};