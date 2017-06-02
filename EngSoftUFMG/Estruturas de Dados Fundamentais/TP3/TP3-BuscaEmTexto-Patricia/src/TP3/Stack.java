
package TP3;

public class Stack<T>
{
    private static class Elemento<T>
    {
        Elemento<T> link;

        T info;

        Elemento (T info) {
            this.info = info;
        }
    }

    private Elemento<T> topo;

    public Stack() {}

    public void empilha(T item)
    {
        Elemento<T> novo;

        novo = new Elemento<T>(item);
        novo.link = topo;
        topo = novo;
    }

    public T desempilha() throws EmptyStackException
    {
        T info;

        if (vazia()) {
            throw new EmptyStackException("a pilha está vazia");
        }

        info = topo.info;
        topo = topo.link;

        return info;
    }

    public boolean vazia()
    {
        return topo == null;
    }
}
