package TP3;

public interface INodoPatriciaPalavra {
    public void setTipo(NodoTipo t);
    public NodoTipo getTipo();
    /*para nodo INTERNO*/
    public void setNodoPatEsq(INodoPatriciaPalavra n);
    public INodoPatriciaPalavra getNodoPatEsq();
    public void setNodoPatDir (INodoPatriciaPalavra n);
    public INodoPatriciaPalavra getNodoPatDir();
    public void setIndex(int i);
    public int getIndex();
    public int calcBit(String p);
    /*para nodo externo*/
    public void setItemPalavra(IItemPalavra item);
    public IItemPalavra getItemPalavra();
}
