const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d862d',
    scene: {
        create: create,
    }
};

const game = new Phaser.Game(config);
let ball;
let golesP1 = 0;
let golesCPU = 0;
let ronda = 0;
let marcadorTexto;
let esTurnoP1 = true;  // El jugador humano empieza
let tirosRealizadosP1 = 0;
let tirosRealizadosCPU = 0;

function create() {
    // 1. Fondo del arco
    this.add.rectangle(400, 150, 400, 200, 0xffffff).setStrokeStyle(4, 0x000000);

    // 2. Texto del marcador
    marcadorTexto = this.add.text(400, 30, 'P1: 0 - CPU: 0', { 
        fontSize: '32px', 
        fill: '#ffffff',
        fontStyle: 'bold' 
    }).setOrigin(0.5);

    // 3. Crear las 15 zonas (5 columnas x 3 filas)
    const columnas = 5;
    const filas = 3;
    const zonaAncho = 400 / columnas;
    const zonaAlto = 200 / filas;

    for (let col = 0; col < columnas; col++) {
        for (let row = 0; row < filas; row++) {
            let x = 200 + (col * zonaAncho) + (zonaAncho / 2);
            let y = 50 + (row * zonaAlto) + (zonaAlto / 2);
            
            let zona = this.add.rectangle(x, y, zonaAncho, zonaAlto, 0xff0000, 0.2);
            zona.setStrokeStyle(1, 0xffffff);
            zona.setInteractive();

            zona.on('pointerdown', () => {
            // Solo permitimos el clic si es el turno del jugador y no ha completado sus 5 tiros
            if (esTurnoP1 && tirosRealizadosP1 < 5) {
                dispararPelota(this, x, y);
            }
        });
        }
    }

    // 4. Crear la pelota
    ball = this.add.circle(400, 500, 15, 0xffffff);
    ball.setStrokeStyle(2, 0x000000);
}

function dispararPelota(escena, targetX, targetY) {
    escena.tweens.add({
        targets: ball,
        x: targetX,
        y: targetY,
        duration: 500,
        onComplete: () => {
            // 1. Registrar resultado
            if (esTurnoP1) {
                if (Math.random() > 0.5) golesP1++;
                tirosRealizadosP1++;
            } else {
                if (Math.random() > 0.5) golesCPU++;
                tirosRealizadosCPU++;
            }

            // 2. Actualizar texto
            marcadorTexto.setText(`P1: ${golesP1} - CPU: ${golesCPU}`);
            ball.setPosition(400, 500);

            // 3. Lógica de cambio de turno y fin de partido
let totalTiros = tirosRealizadosP1 + tirosRealizadosCPU;

// Verificamos si terminaron los 10 tiros básicos (5 cada uno)
if (totalTiros < 10) {
    esTurnoP1 = !esTurnoP1;
    if (!esTurnoP1) {
        setTimeout(() => CPUDispara(escena), 1000);
    }
} else {
    // Ya pasaron los 10 tiros, vemos si hay empate para muerte súbita
    if (golesP1 === golesCPU) {
        // Muerte súbita: sigue el juego, pero ahora el primero que falle pierde
        // Simplemente dejamos que el juego siga sumando tiros
        console.log("¡Empate! Vamos a muerte súbita");
        esTurnoP1 = !esTurnoP1;
        if (!esTurnoP1) {
            setTimeout(() => CPUDispara(escena), 1000);
        }
    } else {
        // No hay empate, fin del partido
        alert(`Partido terminado. Marcador final: P1 ${golesP1} - CPU ${golesCPU}`);
    }
}
        }
    });
function CPUDispara(escena) {
    // Elegimos una zona aleatoria (columna 0-4, fila 0-2)
    let col = Math.floor(Math.random() * 5);
    let row = Math.floor(Math.random() * 3);
    
    // Calculamos coordenadas (igual que en el for de create)
    let targetX = 200 + (col * 80) + 40;
    let targetY = 50 + (row * 66) + 33;
    
    dispararPelota(escena, targetX, targetY);
}

}
