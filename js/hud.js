function dibujarHUD(escena) {
    let viejos = escena.children.getAll().filter(obj => obj.name === 'hudCirculo');
    viejos.forEach(obj => obj.destroy());
    let tandaActual = Math.floor((window.historialP1.length - 1) / 5);
    if (tandaActual < 0) tandaActual = 0;
    let indiceInicio = tandaActual * 5;

    // Dibujar marcadores O / X alineados abajo a la izquierda (P1)
    for (let i = indiceInicio; i < window.historialP1.length; i++) {
        let esGol = (window.historialP1[i] === "GOL");
        let textoSimbolo = esGol ? "O" : "X";
        let colorSimbolo = esGol ? "#00ff00" : "#ff0000";

        // AGRANDADO: fontSize a 34px, Y a 535 para centrar y espaciado a 28px
        let t = escena.add.text(45 + ((i % 5) * 28), 535, textoSimbolo, {
            fontSize: '34px',
            fill: colorSimbolo,
            fontStyle: 'bold',
            fontFamily: 'Courier New, monospace'
        }).setOrigin(0.5);
        
        t.setStroke('#000000', 5); // Un pelito más de borde negro para acompañar el tamaño
        t.name = 'hudCirculo';
    }
    
    // Dibujar marcadores O / X alineados abajo a la derecha (CPU)
    for (let i = indiceInicio; i < window.historialCPU.length; i++) {
        let esGol = (window.historialCPU[i] === "GOL");
        let textoSimbolo = esGol ? "O" : "X";
        let colorSimbolo = esGol ? "#00ff00" : "#ff0000";

        // AGRANDADO: Misma proporción para el lado de la CPU
        let t = escena.add.text(595 + ((i % 5) * 28), 535, textoSimbolo, {
            fontSize: '34px',
            fill: colorSimbolo,
            fontStyle: 'bold',
            fontFamily: 'Courier New, monospace'
        }).setOrigin(0.5);
        
        t.setStroke('#000000', 5);
        t.name = 'hudCirculo';
    }
}


function actualizarRetratos(escena) {
    if (window.retratoIzquierdo) { window.retratoIzquierdo.destroy(); window.retratoIzquierdo = null; }
    if (window.retratoDerecho) { window.retratoDerecho.destroy(); window.retratoDerecho = null; }

    let datosP1 = window.baseDeDatosEquipos[window.equipoSeleccionadoP1];
    let datosCPU = window.baseDeDatosEquipos[window.equipoSeleccionadoCPU];
    let idxJugador = window.ronda % 4;

    window.retratoIzquierdo = escena.add.container(75, 410);
    window.retratoDerecho = escena.add.container(725, 410);

    if (window.esTurnoP1 && !window.esperandoAtajada) {
        let nombrePateador = datosP1.pateadores[idxJugador];
        let nombreArquero = datosCPU.arquero;

        // --- IZQUIERDA: P1 PATEANDO ---
        let marcoIzq = escena.add.rectangle(0, 0, 100, 110, 0x000000, 0.65).setStrokeStyle(3, datosP1.colorRopa);
        let imgIzq = escena.add.image(0, 0, nombrePateador).setDisplaySize(94, 104);
        let cartelIzq = escena.add.rectangle(0, 75, 110, 36, 0x111111, 0.82).setStrokeStyle(1, 0xffffff);
        let txtIzq = escena.add.text(0, 75, `${nombrePateador}\n⚽`, { fontSize: '14px', fill: '#ffffff', align: 'center', fontStyle: 'bold' }).setOrigin(0.5);
        window.retratoIzquierdo.add([marcoIzq, imgIzq, cartelIzq, txtIzq]);

        // --- DERECHA: CPU ATAJANDO ---
        let marcoDer = escena.add.rectangle(0, 0, 100, 110, 0x000000, 0.65).setStrokeStyle(3, datosCPU.colorRopa);
        let imgDer = escena.add.image(0, 0, nombreArquero).setDisplaySize(94, 104);
        let cartelDer = escena.add.rectangle(0, 75, 110, 36, 0x111111, 0.82).setStrokeStyle(1, 0xffffff);
        let txtDer = escena.add.text(0, 75, `${nombreArquero}\n🧤`, { fontSize: '14px', fill: '#ffffff', align: 'center', fontStyle: 'bold' }).setOrigin(0.5);
        window.retratoDerecho.add([marcoDer, imgDer, cartelDer, txtDer]);

    } else {
        let nombreArquero = datosP1.arquero;
        let nombrePateador = datosCPU.pateadores[idxJugador];

        // --- IZQUIERDA: P1 ATAJANDO ---
        let marcoIzq = escena.add.rectangle(0, 0, 100, 110, 0x000000, 0.65).setStrokeStyle(3, datosP1.colorRopa);
        let imgIzq = escena.add.image(0, 0, nombreArquero).setDisplaySize(94, 104);
        let cartelIzq = escena.add.rectangle(0, 75, 110, 36, 0x111111, 0.82).setStrokeStyle(1, 0xffffff);
        let txtIzq = escena.add.text(0, 75, `${nombreArquero}\n🧤`, { fontSize: '14px', fill: '#ffffff', align: 'center', fontStyle: 'bold' }).setOrigin(0.5);
        window.retratoIzquierdo.add([marcoIzq, imgIzq, cartelIzq, txtIzq]);

        // --- DERECHA: CPU PATEANDO ---
        let marcoDer = escena.add.rectangle(0, 0, 100, 110, 0x000000, 0.65).setStrokeStyle(3, datosCPU.colorRopa);
        let imgDer = escena.add.image(0, 0, nombrePateador).setDisplaySize(94, 104);
        let cartelDer = escena.add.rectangle(0, 75, 110, 36, 0x111111, 0.82).setStrokeStyle(1, 0xffffff);
        let txtDer = escena.add.text(0, 75, `${nombrePateador}\n⚽`, { fontSize: '14px', fill: '#ffffff', align: 'center', fontStyle: 'bold' }).setOrigin(0.5);
        window.retratoDerecho.add([marcoDer, imgDer, cartelDer, txtDer]);
    }
}
