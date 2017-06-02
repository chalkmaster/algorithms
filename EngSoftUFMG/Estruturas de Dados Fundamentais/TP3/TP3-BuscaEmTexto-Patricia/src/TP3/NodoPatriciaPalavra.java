package TP3;

public class NodoPatriciaPalavra implements INodoPatriciaPalavra
{
    private NodoTipo _nodeType;
    private int _index = 0;
    private IItemPalavra _reg;
    private INodoPatriciaPalavra _leftNode;
    private INodoPatriciaPalavra _rightNode;


    public void setTipo(NodoTipo t) {
        _nodeType = t;
    }

    public NodoTipo getTipo() {
        return _nodeType;
    }

   public void setNodoPatEsq(INodoPatriciaPalavra n)
    {
        _leftNode = n;
    }

    public INodoPatriciaPalavra getNodoPatEsq()
    {
        return _leftNode;
    }

    public void setNodoPatDir(INodoPatriciaPalavra n)
    {
        _rightNode = n;
    }

    public INodoPatriciaPalavra getNodoPatDir()
    {
        return _rightNode;
    }

    public void setIndex(int i)
    {
        _index = i;
    }

    public int getIndex()
    {
        return _index;
    }

    public int calcBit(String p)
    {
        if (_index <= 0) {
            return 0;
        }
        int n = (_index-1) / 8;
        if (n < p.length()) {
            int j = 7 - (_index-1) % 8;
            int a = p.charAt(n);
            return ((a >>> j) & 1);
        } else {
            return 1;
        }
    }

    public void setItemPalavra(IItemPalavra item)
    {
        _reg = item;
    }

    public IItemPalavra getItemPalavra()
    {
        return _reg;
    }
}
