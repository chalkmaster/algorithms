package TP3;

import java.io.*;

/**
 * Classe que fornece método de importar dados de um arquivo texto
 * @author Charles.Fortes
 */
public abstract class LoadData {
    protected abstract String getCaminhoArquivo();
    protected abstract void adicionar(String linha);
    protected abstract String[][] getData();

    public String[][] load() throws Exception
    {
        InputStream in = new FileInputStream(getCaminhoArquivo());
        InputStreamReader reader = new InputStreamReader(in);
        BufferedReader data = new BufferedReader(reader);

        while (data.ready())
        {
            adicionar(data.readLine());
        }

        return getData();
    }
}
