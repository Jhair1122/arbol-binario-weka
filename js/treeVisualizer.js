class TreeVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 900;
        this.canvas.height = 500;
    }

    dibujar(arbol) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (!arbol || !arbol.raiz) {
            this.ctx.fillStyle = 'rgba(255,255,255,0.3)';
            this.ctx.font = '18px Segoe UI';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('🌳 Ingrese nodos para visualizar', this.canvas.width/2, this.canvas.height/2);
            return;
        }

        const niveles = this.obtenerNiveles(arbol.raiz);
        const espacioVertical = 80;
        const inicioY = 60;
        const margenX = 60;

        // Calcular posiciones usando coordenadas relativas al ancho
        const posiciones = new Map();
        const asignarPos = (nodo, nivel, minX, maxX) => {
            if (!nodo) return;
            const x = (minX + maxX) / 2;
            const y = inicioY + nivel * espacioVertical;
            posiciones.set(nodo, { x, y });
            asignarPos(nodo.izquierdo, nivel + 1, minX, x - 10);
            asignarPos(nodo.derecho, nivel + 1, x + 10, maxX);
        };
        asignarPos(arbol.raiz, 0, margenX, this.canvas.width - margenX);

        // Dibujar líneas
        this.ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        this.ctx.lineWidth = 2;
        for (let [nodo, pos] of posiciones) {
            if (nodo.izquierdo && posiciones.has(nodo.izquierdo)) {
                const hijo = posiciones.get(nodo.izquierdo);
                this.ctx.beginPath();
                this.ctx.moveTo(pos.x, pos.y);
                this.ctx.lineTo(hijo.x, hijo.y);
                this.ctx.stroke();
            }
            if (nodo.derecho && posiciones.has(nodo.derecho)) {
                const hijo = posiciones.get(nodo.derecho);
                this.ctx.beginPath();
                this.ctx.moveTo(pos.x, pos.y);
                this.ctx.lineTo(hijo.x, hijo.y);
                this.ctx.stroke();
            }
        }

        // Dibujar círculos
        for (let [nodo, pos] of posiciones) {
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, 22, 0, 2 * Math.PI);
            const grad = this.ctx.createRadialGradient(pos.x-4, pos.y-4, 3, pos.x, pos.y, 22);
            grad.addColorStop(0, '#b44bff');
            grad.addColorStop(1, '#4b9fff');
            this.ctx.fillStyle = grad;
            this.ctx.fill();
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 14px Segoe UI';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(nodo.valor, pos.x, pos.y);
        }
    }

    obtenerNiveles(raiz) {
        if (!raiz) return [];
        const niveles = [];
        const cola = [{ nodo: raiz, nivel: 0 }];
        while (cola.length) {
            const { nodo, nivel } = cola.shift();
            if (!niveles[nivel]) niveles[nivel] = [];
            niveles[nivel].push(nodo);
            if (nodo.izquierdo) cola.push({ nodo: nodo.izquierdo, nivel: nivel + 1 });
            if (nodo.derecho) cola.push({ nodo: nodo.derecho, nivel: nivel + 1 });
        }
        return niveles;
    }
}
