function ejecutarDisparo(escena, colT, rowT, colA, rowA, esJugador) {
    escena.tweens.killTweensOf(window.barraTiempo);
    
    colT = Math.max(0, Math.min(4, colT));
    rowT = Math.max(0, Math.min(2, rowT));
    colA = Math.max(0, Math.min(4, colA));
    rowA = Math.max(0, Math.min(2, rowA));

    // Coordenadas normales del tiro dentro de la red
    let xT = 200 + (colT * 80) + 40;
    let yT = 50 + (rowT * 66.6) + 33;
    let xA = 200 + (colA * 80) + 40;
    let yA = 50 + (rowA * 66.6) + 33;
    
    // Cálculo probabilístico del tiro (5% Palo, 10% Afuera, 85% Normal)
    let rng = Math.random();
    let tipoResultado = "NORMAL"; 
    
    if (rng < 0.05) {
        tipoResultado = "PALO";
        let elegirPalo = Math.random();
        if (elegirPalo < 0.4) {
            xT = 200; // Palo izquierdo
        } else if (elegirPalo < 0.8) {
            xT = 600; // Palo derecho
        } else {
            // FIX: Reemplazado Math.between por matemática nativa de JS (entre 200 y 600)
            xT = Math.floor(Math.random() * (600 - 200 + 1)) + 200; // Travesaño superior
            yT = 50;
        }
    } else if (rng < 0.15) {
        tipoResultado = "AFUERA";
        let elegirAfuera = Math.random();
        if (elegirAfuera < 0.33) {
            // FIX: Reemplazado por matemática nativa (entre 100 y 170) Muy a la izquierda
            xT = Math.floor(Math.random() * (170 - 100 + 1)) + 100; 
        } else if (elegirAfuera < 0.66) {
            // FIX: Reemplazado por matemática nativa (entre 630 y 700) Muy a la derecha
            xT = Math.floor(Math.random() * (700 - 630 + 1)) + 630; 
        } else {
            // FIX: Reemplazado por matemática nativa (entre 10 y 35) Por arriba del arco
            yT = Math.floor(Math.random() * (35 - 10 + 1)) + 10; 
        }
    }

    let esAtajado = (colT === colA && rowT === rowA && tipoResultado === "NORMAL");
    
    // Dibujamos las marcas fijas en las celdas lógicas originales
    if(window.rectTiro) window.rectTiro.destroy(); 
    if(window.rectArquero) window.rectArquero.destroy();
    window.rectTiro = escena.add.rectangle(200 + (colT * 80) + 40, 50 + (rowT * 66.6) + 33, 80, 66.6).setStrokeStyle(4, 0x3366ff);
    window.rectArquero = escena.add.rectangle(xA, yA, 80, 66.6).setStrokeStyle(4, esJugador ? 0xff6666 : 0x66ff66);

    escena.tweens.add({
        targets: window.ball, x: xT, y: yT, duration: 500,
        onComplete: () => {
            if (tipoResultado === "NORMAL" && !esAtajado) {
                esJugador ? window.golesP1++ : window.golesCPU++;
                esJugador ? window.historialP1.push("GOL") : window.historialCPU.push("GOL");
            } else if (esAtajado) {
                esJugador ? window.historialP1.push("ATA") : window.historialCPU.push("ATA");
            } else {
                esJugador ? window.historialP1.push(tipoResultado) : window.historialCPU.push(tipoResultado);
            }
            
            window.marcadorTexto.setText(`P1: ${window.golesP1} - CPU: ${window.golesCPU}`);
            
            escena.time.delayedCall(1000, () => {
                window.ball.setPosition(400, 500);
                dibujarHUD(escena);

                if (esJugador) {
                    window.esperandoAtajada = true; 
                    window.esTurnoP1 = false;
                    iniciarBarra(escena, false);
                } else {
                    window.esperandoAtajada = false; 
                    window.esTurnoP1 = true; 
                    window.ronda++;
                    window.tuColA = 2; window.tuRowA = 1;
                    
                    if (verificarFinPartido()) {
                        alert(`¡Tanda Finalizada!\nResultado: P1 ${window.golesP1} - CPU ${window.golesCPU}`);
                        location.reload();
                    } else {
                        iniciarBarra(escena, true);
                    }
                }
            });
        }
    });
}

function iniciarBarra(escena, esJugador) {
    window.barraTiempo.scaleX = 1;
    escena.tweens.killTweensOf(window.barraTiempo);

    if (window.rectTiro) { window.rectTiro.destroy(); window.rectTiro = null; }
    if (window.rectArquero) { window.rectArquero.destroy(); window.rectArquero = null; }

    if (!esJugador) {
        window.zonaGolCPU = Math.floor(Math.random() * 15);
    }

    escena.tweens.add({ 
        targets: window.barraTiempo, scaleX: 0, duration: 3000, 
        onComplete: () => {
            if (esJugador) {
                ejecutarDisparo(escena, 2, 1, Math.floor(Math.random() * 5), Math.floor(Math.random() * 3), true);
            } else {
                let c = window.zonaGolCPU % 5, r = Math.floor(window.zonaGolCPU / 5);
                ejecutarDisparo(escena, c, r, window.tuColA, window.tuRowA, false);
            }
        }
    });
}

function verificarFinPartido() {
    let tirosP1 = window.historialP1.length;
    let tirosCPU = window.historialCPU.length;
    
    if (tirosP1 !== tirosCPU) return false;
    
    let restantes = Math.max(0, 5 - tirosP1);

    if (tirosP1 <= 5) {
        if (window.golesP1 > window.golesCPU + restantes) return true;
        if (window.golesCPU > window.golesP1 + restantes) return true;
        if (tirosP1 === 5 && window.golesP1 !== window.golesCPU) return true;
        return false;
    }
    
    return (window.golesP1 !== window.golesCPU);
}
