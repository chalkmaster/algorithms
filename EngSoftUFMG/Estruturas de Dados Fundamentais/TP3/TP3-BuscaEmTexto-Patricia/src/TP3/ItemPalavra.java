
package TP3;

public class ItemPalavra implements IItemPalavra{

    private String _word = "";
    private int[] _oc = new int[5000];
    private int _lastOc = 0;

    public ItemPalavra(String s) {
        _word = s;
    }

    public String getPalavra() {
        return _word;
    }

    public int numDeOcorrencias() {
        return _lastOc;
    }

    public void addOcorrencia(int posicao) {
        _oc[_lastOc++] = posicao;
    }

    public int[] getOcorrencia() {
        return _oc;
    }

    public int getPosicaoUltimaOcorrencia()
    {
        return _lastOc;
    }

}
