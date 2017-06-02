package TP3;
public interface IArvorePatriciaPalavra  {
    public void inicializa();
    public boolean vazia();
    public boolean insere(IItemPalavra item) throws InvalidKeyException;
    public boolean remove(String p)  throws InvalidKeyException ;
    public IItemPalavra pesquisa(String p)  throws InvalidKeyException;
}
