const arbol = new BinarySearchTree();
let raizEstablecida = false;
let historialInserciones = [];
let valorResaltado = null;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnAgregarRaiz').addEventListener('click', insertarRaiz);
    document.getElementById('btnAgregarNodo').addEventListener('click', insertarNodo);
    document.getElementById('btnGenerarAleatorios').addEventListener('click', generarAleatorios);
    document.getElementById('btnDeshacer').addEventListener('click', deshacerUltimaInsercion);
    document.getElementById('nodoInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            raizEstablecida ? insertarNodo() : insertarRaiz();
        }
    });
    document.getElementById('buscarInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') buscarNodo();
    });
    dibujarArbol();
    actualizarReportes();

    window.addEventListener('resize', () => {
        dibujarArbol();
    });
});

function insertarRaiz() {
    const input = document.getElementById('nodoInput');
    const valor = parseInt(input.value);
    if (isNaN(valor)) { mostrarNotificacion('Ingrese un valor válido', 'error'); return; }
    if (arbol.raiz !== null) {
        mostrarNotificacion('La raíz ya existe. Use "Insertar Nodo".', 'error');
        return;
    }
    arbol.insertar(valor);
    historialInserciones.push(valor);
    document.getElementById('btnDeshacer').disabled = false;
    
    input.value = '';
    raizEstablecida = true;
    document.getElementById('btnAgregarRaiz').disabled = true;
    document.getElementById('btnAgregarNodo').disabled = false;
    actualizarDisplayNodos();
    dibujarArbol();
    actualizarReportes();
    
    resaltarNodo(valor, 1000);
    mostrarNotificacion('Raíz insertada correctamente', 'success');
}

function insertarNodo() {
    const input = document.getElementById('nodoInput');
    const valor = parseInt(input.value);
    if (isNaN(valor)) { mostrarNotificacion('Ingrese un valor válido', 'error'); return; }
    const insertado = arbol.insertar(valor);
    if (insertado) {
        historialInserciones.push(valor);
        document.getElementById('btnDeshacer').disabled = false;
        
        input.value = '';
        actualizarDisplayNodos();
        dibujarArbol();
        actualizarReportes();
        
        resaltarNodo(valor, 1000);
        mostrarNotificacion(`Nodo ${valor} insertado`, 'success');
    } else {
        mostrarNotificacion('El valor ya existe en el árbol', 'error');
    }
}

function generarAleatorios() {
    if (!raizEstablecida) {
        const raizVal = Math.floor(Math.random() * 50) + 10;
        arbol.insertar(raizVal);
        historialInserciones.push(raizVal);
        raizEstablecida = true;
        document.getElementById('btnAgregarRaiz').disabled = true;
        document.getElementById('btnAgregarNodo').disabled = false;
    }
    const cantidad = 5 + Math.floor(Math.random() * 6);
    for (let i = 0; i < cantidad; i++) {
        const valorAleatorio = Math.floor(Math.random() * 100) + 1;
        const insertado = arbol.insertar(valorAleatorio);
        if (insertado) historialInserciones.push(valorAleatorio);
    }
    document.getElementById('btnDeshacer').disabled = (historialInserciones.length === 0);
    
    actualizarDisplayNodos();
    dibujarArbol();
    actualizarReportes();
    mostrarNotificacion(`${cantidad} nodos aleatorios agregados`, 'success');
}

function actualizarDisplayNodos() {
    const div = document.getElementById('nodosActuales');
    if (!arbol.raiz) {
        div.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>No hay nodos</p></div>';
        return;
    }
    const pre = arbol.preorden();
    div.innerHTML = pre.recorrido.map(v => `<span class="numero-tag">${v}</span>`).join('');
}

function buscarNodo() {
    const input = document.getElementById('buscarInput');
    const valor = parseInt(input.value);
    if (isNaN(valor)) { mostrarNotificacion('Ingrese valor a buscar', 'error'); return; }
    const resultado = arbol.buscar(valor);
    const contenedor = document.getElementById('resultadoBusqueda');
    
    if (resultado.encontrado) {
        resaltarNodo(valor, 2000);
        contenedor.innerHTML = `
            <div class="search-found">
                <i class="fas fa-check-circle"></i>
                <div>
                    <h3>Nodo ${valor} encontrado</h3>
                    <p>Se recorrieron <strong>${resultado.pasos}</strong> nodos para hallarlo.</p>
                </div>
            </div>`;
    } else {
        contenedor.innerHTML = `
            <div class="search-not-found">
                <i class="fas fa-times-circle"></i>
                <div>
                    <h3>Nodo ${valor} no encontrado</h3>
                    <p>Se recorrieron <strong>${resultado.pasos}</strong> nodos sin éxito.</p>
                </div>
            </div>`;
    }
    input.value = '';
}

function actualizarReportes() {
    const pre = arbol.preorden();
    const ino = arbol.inorden();
    const post = arbol.postorden();
    const desc = arbol.inordenDescendente();

    document.getElementById('preordenResult').textContent = pre.recorrido.join(' → ') || '(vacío)';
    document.getElementById('inordenResult').textContent = ino.recorrido.join(' → ') || '(vacío)';
    document.getElementById('postordenResult').textContent = post.recorrido.join(' → ') || '(vacío)';
    document.getElementById('inordenDescResult').textContent = desc.recorrido.join(' → ') || '(vacío)';
    document.getElementById('pasosInorden').innerHTML = `<small>Pasos: ${ino.pasos}</small>`;
    document.getElementById('pasosInordenDesc').innerHTML = `<small>Pasos: ${desc.pasos}</small>`;

    // Reanimar tarjetas
    document.querySelectorAll('.report-card').forEach(card => {
        card.classList.remove('report-card');
        void card.offsetWidth;
        card.classList.add('report-card');
    });
}

function dibujarArbol() {
    const vis = new TreeVisualizer('treeCanvas');
    vis.dibujar(arbol, valorResaltado);
}

function resaltarNodo(valor, duracion) {
    const canvas = document.getElementById('treeCanvas');
    valorResaltado = valor;
    canvas.classList.add('canvas-highlight');
    dibujarArbol();
    setTimeout(() => {
        valorResaltado = null;
        canvas.classList.remove('canvas-highlight');
        dibujarArbol();
    }, duracion);
}

function deshacerUltimaInsercion() {
    if (historialInserciones.length === 0) return;
    historialInserciones.pop();
    
    arbol.raiz = null;
    arbol.totalNodos = 0;
    raizEstablecida = false;
    document.getElementById('btnAgregarRaiz').disabled = false;
    document.getElementById('btnAgregarNodo').disabled = true;

    for (let val of historialInserciones) {
        arbol.insertar(val);
        if (!raizEstablecida) {
            raizEstablecida = true;
            document.getElementById('btnAgregarRaiz').disabled = true;
            document.getElementById('btnAgregarNodo').disabled = false;
        }
    }

    if (historialInserciones.length === 0) {
        document.getElementById('btnDeshacer').disabled = true;
    }

    actualizarDisplayNodos();
    dibujarArbol();
    actualizarReportes();
    mostrarNotificacion('Última inserción deshecha', 'success');
}

function mostrarNotificacion(mensaje, tipo) {
    const notif = document.createElement('div');
    notif.className = 'notificacion';
    notif.innerHTML = `<i class="fas fa-${tipo === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${mensaje}`;
    notif.style.background = tipo === 'success' ?
        'linear-gradient(135deg, #10b981, #059669)' :
        'linear-gradient(135deg, #ef4444, #dc2626)';
    document.body.appendChild(notif);
    setTimeout(() => {
        notif.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => notif.remove(), 500);
    }, 3000);
}
