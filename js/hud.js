function dibujarHUD(escena) {
    // 1. Eliminar círculos anteriores de la pantalla para redibujarlos
    let viejos = escena.children.getAll().filter(obj => obj.name === 'hudCirculo');
    viejos.forEach(obj => obj.destroy());
    
    // 2. Calcular en qué tanda de 5 penales estamos actualmente (0 para los primeros 5, 1 para del 6 al 10, etc.)
    // Usamos el historial de P1 como referencia de cuántos tiros van
    let tandaActual = Math.floor((window.historialP1.length - 1) / 5);
    if (tandaActual < 0) tandaActual = 0;

    let indiceInicio = tandaActual * 5;

    // 3. Dibujar historial del Jugador 1 (Solo los de la tanda actual)
    for (let i = indiceInicio; i < window.historialP1.length; i++) {
        let color = (window.historialP1[i] === "GOL") ? 0x00ff00 : 0xff0000;
        // El operador (i % 5) hace que la posición X vuelva a empezar desde 0 cada 5 círculos
        let c = escena.add.circle(50 + ((i % 5) * 25), 550, 10, color).setStrokeStyle(2, 0xffffff);
        c.name = 'hudCirculo';
    }
    
    // 4. Dibujar historial de la CPU (Solo los de la tanda actual)
    for (let i = indiceInicio; i < window.historialCPU.length; i++) {
        let color = (window.historialCPU[i] === "GOL") ? 0x00ff00 : 0xff0000;
        let c = escena.add.circle(600 + ((i % 5) * 25), 550, 10, color).setStrokeStyle(2, 0xffffff);
        c.name = 'hudCirculo';
    }
}
