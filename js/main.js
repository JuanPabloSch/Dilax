const phaserConfig = {
    type: Phaser.AUTO, 
    width: 800, 
    height: 600, 
    backgroundColor: '#2d862d',
    contextOptions: {
        willReadFrequently: true
    },
    scene: { 
        preload: preload,
        create: create 
    }
};

const game = new Phaser.Game(phaserConfig);

function preload() {
    // 1. Cargar fondo de cancha
    this.load.image('fondoCancha', 'bg/penales.png');

    // 2. Carga de fotos apuntando a tus archivos físicos reales en minúsculas
    this.load.image('El Negrouu', 'players/negrouu.png');
    this.load.image('Sebu', 'players/sebu.png');
    this.load.image('Chino', 'players/chino.png');
    this.load.image('Juano', 'players/juano.png');
    this.load.image('Nahui', 'players/nahui.png');

    this.load.image('Rolo', 'players/rolo.png');
    this.load.image('El Gibe', 'players/gibe.png');
    this.load.image('Santos', 'players/santos.png');
    this.load.image('El Oscar', 'players/oscar.png');
    this.load.image('Caralucas', 'players/caralucas.png');
}

function create() {
    // Dibujar fondo estirado
    let fondo = this.add.image(400, 300, 'fondoCancha');
    fondo.setDisplaySize(800, 600);

    // Medidas definitivas del arco
    const arcoX = 200;       
    const arcoY = 95;        
    const arcoAncho = 400;   
    const arcoAlto = 135;    

    const celdaAncho = arcoAncho / 5; 
    const celdaAlto = arcoAlto / 3;   

    window.arcoConfig = {
        x: arcoX,
        y: arcoY,
        anchoCelda: celdaAncho,
        altoCelda: celdaAlto
    };

    window.marcadorTexto = this.add.text(400, 30, 'P1: 0 - CPU: 0', { fontSize: '32px', fill: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.rectangle(400, 550, 200, 20, 0x555555);
    window.barraTiempo = this.add.rectangle(300, 550, 200, 20, 0x00ff00).setOrigin(0, 0.5);
    window.ball = this.add.circle(400, 520, 15, 0xffffff).setStrokeStyle(2, 0x000000);

    // Crear las 15 zonas interactuables
    for (let col = 0; col < 5; col++) {
        for (let row = 0; row < 3; row++) {
            let x = arcoX + (col * celdaAncho) + (celdaAncho / 2);
            let y = arcoY + (row * celdaAlto) + (celdaAlto / 2);
            let zona = this.add.rectangle(x, y, celdaAncho, celdaAlto, 0xff0000, 0.01).setStrokeStyle(1, 0xffffff, 0.15).setInteractive();
            
            zona.on('pointerdown', () => {
                if (window.esTurnoP1 && !window.esperandoAtajada) {
                    let arqueroCol = Math.floor(Math.random() * 5);
                    let arqueroRow = Math.floor(Math.random() * 3);
                    ejecutarDisparo(this, col, row, arqueroCol, arqueroRow, true);
                } else if (window.esperandoAtajada) {
                    window.tuColA = col; 
                    window.tuRowA = row;
                    let c = window.zonaGolCPU % 5;
                    let r = Math.floor(window.zonaGolCPU / 5);
                    ejecutarDisparo(this, c, r, window.tuColA, window.tuRowA, false);
                }
            });
        }
    }
    
    actualizarRetratos(this);
    iniciarBarra(this, true);
}
