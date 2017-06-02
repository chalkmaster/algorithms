package ArvorePatricia;

/**
 *
 */
public class Registro implements IItemPalavra
{
    private String palavra;

    private int numDeOcorrencias = 0;

    private int[] ocorrencias = new int[50];

    public Registro(String p)
    {
        palavra = p;
    }

    public String getPalavra()
    {
        return palavra;
    }

    public int numDeOcorrencias()
    {
        return numDeOcorrencias;
    }

    public void addOcorrencia(int posicao)
    {
        ocorrencias[numDeOcorrencias] = posicao;
        numDeOcorrencias++;
    }

    public int[] getOcorrencias()
    {
        return ocorrencias;
    }
}
