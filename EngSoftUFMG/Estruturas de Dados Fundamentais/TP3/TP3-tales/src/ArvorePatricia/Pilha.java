/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package ArvorePatricia;

/**
 *
 * @param <T> 
 * @author tales
 */
public class Pilha<T>
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

    public Pilha() {}

    public void empilha(T item)
    {
        Elemento<T> novo;

        novo = new Elemento<T>(item);
        novo.link = topo;
        topo = novo;
    }

    public T desempilha() throws PilhaVazia
    {
        T info;

        if (vazia()) {
            throw new PilhaVazia("a pilha está vazia");
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

class PilhaVazia extends Exception {

    PilhaVazia(String string)
    {
        super(string);
    }
}