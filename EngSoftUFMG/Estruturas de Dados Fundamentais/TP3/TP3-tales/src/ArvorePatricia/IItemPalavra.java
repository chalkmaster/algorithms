package ArvorePatricia;

/**
 *
 */
public interface IItemPalavra
{
    public String getPalavra();
    public int numDeOcorrencias();
    public void addOcorrencia(int posicao);
    public int[] getOcorrencias();
}
