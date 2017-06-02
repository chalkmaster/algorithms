package ArvorePatricia;

/**
 * 
 */
public class NodoPatriciaPalavra implements INodoPatriciaPalavra
{
    private NodoTipo tipo;

    private int index = 0;

    private IItemPalavra registro;

    private INodoPatriciaPalavra nodoEsquerdo;

    private INodoPatriciaPalavra nodoDireito;

    public void setTipo(NodoTipo t)
    {
        tipo = t;
    }

    public NodoTipo getTipo()
    {
        return tipo;
    }

    public void setNodoPatEsq(INodoPatriciaPalavra n)
    {
        nodoEsquerdo = n;
    }

    public INodoPatriciaPalavra getNodoPatEsq()
    {
        return nodoEsquerdo;
    }

    public void setNodoPatDir(INodoPatriciaPalavra n)
    {
        nodoDireito = n;
    }

    public INodoPatriciaPalavra getNodoPatDir()
    {
        return nodoDireito;
    }

    public void setIndex(int i)
    {
        index = i;
    }

    public int getIndex()
    {
        return index;
    }

    public int calcBit(String p)
    {
        if (index <= 0) {
            return 0;
        }

        int n = (index-1) / 8;

        if (n < p.length()) {

            int j = 7 - (index-1) % 8;
            int a = p.charAt(n);

            return ((a >>> j) & 1);

        } else {

            return 1;

        }
    }

    public void setItemPalavra(IItemPalavra item)
    {
        registro = item;
    }

    public IItemPalavra getItemPalavra()
    {
        return registro;
    }
}
