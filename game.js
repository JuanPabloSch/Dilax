const config = {
    type: Phaser.AUTO, width: 800, height: 600, backgroundColor: '#2d862d',
    scene: { create: create }
};

const game = new Phaser.Game(config);
let ball, golesP1 = 0, golesCPU = 0, marcadorTexto, esTurnoP1 = true;
let tirosRealizadosP1 = 0, tirosRealizadosCPU = 0, zonaGolCPU = -1, esperandoAtajada = false;
let reloj, barraTiempo, fondoBarra;

function create() {
    this.add.rectangle(400, 150, 400, 200, 0xffffff).setStrokeStyle(4, 0x000000);
    marcadorTexto = this.add.text(400, 30, 'P1: 0 - CPU: 0', { fontSize: '32px', fill: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);
    
    // Barra visual
    fondoBarra = this.add.rectangle(400, 550, 200, 20, 0x555555).setVisible(false);
    barraTiempo = this.add.rectangle(300, 550, 200, 20, 0x00ff00).setOrigin(0, 0.5).setVisible(false);

    // Cuadrícula
    const columnas = 5, filas = 3, zonaAncho = 80, zonaAlto = 66.6;
    for (let col = 0; col < columnas; col++) {
        for (let row = 0; row < filas; row++) {
            let x = 200 + (col * zonaAncho) + 40, y = 50 + (row * zonaAlto) + 33;
            let zona = this.add.rectangle(x, y, zonaAncho, zonaAlto, 0xff0000, 0.2).setStrokeStyle(1, 0xffffff).setInteractive();

            zona.on('pointerdown', () => {
                if (esTurnoP1) {
                    if (reloj) reloj.remove();
                    ocultarBarra();
                    dispararPelota(this, x, y);
                } else if (esperandoAtajada) {
                    esperandoAtajada = false;
                    ocultarBarra();
                    if ((row * 5 + col) === zonaGolCPU) { console.log("¡ATAJASTE!"); zona.setFillStyle(0x00ff00, 0.5); }
                    else { console.log("¡GOL!"); zona.setFillStyle(0xff0000, 0.5); }
                }
            });
        }
    }
    ball = this.add.circle(400, 500, 15, 0xffffff).setStrokeStyle(2, 0x000000);
    iniciarTiempo(this, true); // true = turno jugador
}

function ocultarBarra() {
    fondoBarra.setVisible(false);
    barraTiempo.setVisible(false);
}

function dispararPelota(escena, targetX, targetY) {
    if (reloj) reloj.remove();
    ocultarBarra();
    
    escena.tweens.add({
        targets: ball, x: targetX, y: targetY, duration: 500,
        onComplete: () => {
            if (esTurnoP1) { if (Math.random() > 0.5) golesP1++; tirosRealizadosP1++; }
            else { if (Math.random() > 0.5) golesCPU++; tirosRealizadosCPU++; }
            marcadorTexto.setText(`P1: ${golesP1} - CPU: ${golesCPU}`);
            ball.setPosition(400, 500);

            if ((tirosRealizadosP1 + tirosRealizadosCPU) < 10 || golesP1 === golesCPU) {
                esTurnoP1 = !esTurnoP1;
                setTimeout(() => {
                    iniciarTiempo(escena, esTurnoP1);
                }, 1000);
            } else alert(`Fin. Marcador: ${golesP1} - ${golesCPU}`);
        }
    });
}

function iniciarTiempo(escena, esTurnoJugador) {
    fondoBarra.setVisible(true);
    barraTiempo.setVisible(true);
    barraTiempo.scaleX = 1;
    barraTiempo.setFillStyle(esTurnoJugador ? 0xffff00 : 0x00ffff); // Amarillo patear, azul atajar

    if (reloj) reloj.remove();
    reloj = escena.time.addEvent({
        delay: 3000,
        callback: () => {
            if (esTurnoJugador) dispararPelota(escena, 400, 150);
            else CPUDispara(escena);
        }
    });

    // Animación de la barra (independiente del reloj, solo visual)
    escena.tweens.killTweensOf(barraTiempo);
    escena.tweens.add({ targets: barraTiempo, scaleX: 0, duration: 3000, ease: 'Linear' });
}

function CPUDispara(escena) {
    let col = Math.floor(Math.random() * 5), row = Math.floor(Math.random() * 3);
    zonaGolCPU = row * 5 + col;
    esperandoAtajada = true;
    dispararPelota(escena, 200 + (col * 80) + 40, 50 + (row * 66) + 33);
}