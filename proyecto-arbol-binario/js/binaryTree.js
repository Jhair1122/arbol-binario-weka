class Nodo {
    constructor(valor) {
        this.valor = valor;
        this.izquierdo = null;
        this.derecho = null;
    }
}

class BinarySearchTree {
    constructor() {
        this.raiz = null;
        this.pasosRecorrido = 0;
        this.pasosBusqueda = 0;
        this.totalNodos = 0;
    }

    insertar(valor) {
        const nuevo = new Nodo(valor);
        if (this.raiz === null) {
            this.raiz = nuevo;
            this.totalNodos++;
            return true;
        }
        let actual = this.raiz;
        while (true) {
            if (valor === actual.valor) return false;
            if (valor < actual.valor) {
                if (actual.izquierdo === null) {
                    actual.izquierdo = nuevo;
                    this.totalNodos++;
                    return true;
                }
                actual = actual.izquierdo;
            } else {
                if (actual.derecho === null) {
                    actual.derecho = nuevo;
                    this.totalNodos++;
                    return true;
                }
                actual = actual.derecho;
            }
        }
    }

    buscar(valor) {
        this.pasosBusqueda = 0;
        let actual = this.raiz;
        while (actual !== null) {
            this.pasosBusqueda++;
            if (valor === actual.valor) return { encontrado: true, nodo: actual, pasos: this.pasosBusqueda };
            if (valor < actual.valor) actual = actual.izquierdo;
            else actual = actual.derecho;
        }
        return { encontrado: false, nodo: null, pasos: this.pasosBusqueda };
    }

    preorden() {
        this.pasosRecorrido = 0;
        const resultado = [];
        const recorrer = (nodo) => {
            if (nodo) {
                this.pasosRecorrido++;
                resultado.push(nodo.valor);
                recorrer(nodo.izquierdo);
                recorrer(nodo.derecho);
            }
        };
        recorrer(this.raiz);
        return { recorrido: resultado, pasos: this.pasosRecorrido };
    }

    inorden() {
        this.pasosRecorrido = 0;
        const resultado = [];
        const recorrer = (nodo) => {
            if (nodo) {
                recorrer(nodo.izquierdo);
                this.pasosRecorrido++;
                resultado.push(nodo.valor);
                recorrer(nodo.derecho);
            }
        };
        recorrer(this.raiz);
        return { recorrido: resultado, pasos: this.pasosRecorrido };
    }

    postorden() {
        this.pasosRecorrido = 0;
        const resultado = [];
        const recorrer = (nodo) => {
            if (nodo) {
                recorrer(nodo.izquierdo);
                recorrer(nodo.derecho);
                this.pasosRecorrido++;
                resultado.push(nodo.valor);
            }
        };
        recorrer(this.raiz);
        return { recorrido: resultado, pasos: this.pasosRecorrido };
    }

    inordenDescendente() {
        this.pasosRecorrido = 0;
        const resultado = [];
        const recorrer = (nodo) => {
            if (nodo) {
                recorrer(nodo.derecho);
                this.pasosRecorrido++;
                resultado.push(nodo.valor);
                recorrer(nodo.izquierdo);
            }
        };
        recorrer(this.raiz);
        return { recorrido: resultado, pasos: this.pasosRecorrido };
    }

    obtenerArregloNodos() {
        const nodos = [];
        const recorrer = (nodo) => {
            if (nodo) {
                nodos.push(nodo);
                recorrer(nodo.izquierdo);
                recorrer(nodo.derecho);
            }
        };
        recorrer(this.raiz);
        return nodos;
    }
}