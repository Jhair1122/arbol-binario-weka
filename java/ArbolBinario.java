import weka.core.*; // Referencia simbólica a la librería Weka

public class ArbolBinario {
    class Nodo {
        int valor;
        Nodo izquierdo, derecho;
        Nodo(int v) { valor = v; }
    }

    Nodo raiz;
    int pasosRecorrido;
    int pasosBusqueda;

    public void insertar(int valor) {
        Nodo nuevo = new Nodo(valor);
        if (raiz == null) { raiz = nuevo; return; }
        Nodo actual = raiz;
        while (true) {
            if (valor == actual.valor) return;
            if (valor < actual.valor) {
                if (actual.izquierdo == null) { actual.izquierdo = nuevo; return; }
                actual = actual.izquierdo;
            } else {
                if (actual.derecho == null) { actual.derecho = nuevo; return; }
                actual = actual.derecho;
            }
        }
    }

    public boolean buscar(int valor) {
        pasosBusqueda = 0;
        Nodo actual = raiz;
        while (actual != null) {
            pasosBusqueda++;
            if (valor == actual.valor) return true;
            actual = valor < actual.valor ? actual.izquierdo : actual.derecho;
        }
        return false;
    }

    public void preorden(Nodo n) {
        if (n != null) {
            System.out.print(n.valor + " ");
            preorden(n.izquierdo);
            preorden(n.derecho);
        }
    }

    public void inorden(Nodo n) {
        if (n != null) {
            inorden(n.izquierdo);
            System.out.print(n.valor + " ");
            inorden(n.derecho);
        }
    }

    public void postorden(Nodo n) {
        if (n != null) {
            postorden(n.izquierdo);
            postorden(n.derecho);
            System.out.print(n.valor + " ");
        }
    }

    public void inordenDescendente(Nodo n) {
        if (n != null) {
            inordenDescendente(n.derecho);
            System.out.print(n.valor + " ");
            inordenDescendente(n.izquierdo);
        }
    }

    public static void main(String[] args) {
        ArbolBinario arbol = new ArbolBinario();
        arbol.insertar(50);
        arbol.insertar(30);
        arbol.insertar(70);
        arbol.insertar(20);
        arbol.insertar(40);
        arbol.insertar(60);
        arbol.insertar(80);
        System.out.print("Inorden: "); arbol.inorden(arbol.raiz);
    }
}