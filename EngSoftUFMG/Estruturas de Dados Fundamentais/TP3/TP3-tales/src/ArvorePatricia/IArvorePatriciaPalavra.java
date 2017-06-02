package ArvorePatricia;

/**
 *
 */
public interface IArvorePatriciaPalavra
{
    public void inicializa();
    public boolean vazia();
    public IItemPalavra insere(IItemPalavra item)  throws InvalidKeyException;
    public IItemPalavra remove(String p)  throws InvalidKeyException;
    public IItemPalavra pesquisa(String p);
}
