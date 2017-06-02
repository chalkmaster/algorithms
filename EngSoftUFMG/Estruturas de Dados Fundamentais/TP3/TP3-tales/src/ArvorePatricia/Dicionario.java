/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package ArvorePatricia;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintStream;
import java.util.Scanner;

/**
 *
 * @author tales
 */
public class Dicionario
{
    private static PrintStream out = System.out;

    /**
     * Texto do dicionário
     */
    private String texto = "";

    /**
     * Árvore Patrícia para armazenar o dicionário
     */
    private ArvorePatriciaPalavra arvore = new ArvorePatriciaPalavra();

    /**
     * Construtor.
     */
    public Dicionario()
    {
        arvore.inicializa();
    }

    /**
     * Lê as palavras de um texto e adiciona na árvore
     *
     * @param texto Texto a ser lido
     */
    public void leTexto(String texto)
    {
        String palavra = "";
        texto = texto.trim();

        for (int i = 0; i < texto.length(); i++) {

            //concatena a palavra
            palavra += texto.charAt(i);
            palavra = palavra.replaceAll("[\\s,!\\.\\-]", "");

            //checa se o caracter corrente é um espaço em branco, uma quebra de linha ou atingiu o fim do texto
            if (texto.charAt(i) == ' ' || texto.charAt(i) == '\n' || texto.charAt(i) == ',' || texto.charAt(i) == '-' || i == texto.length() - 1) {

                //cria o registro para inserir na arvore
                try {
                    Registro r = (Registro)arvore.insere(new Registro(palavra));
                    r.addOcorrencia(i - palavra.length());
                } catch (Exception e) {}

                palavra = "";
            }
        }

        this.texto += texto;
    }

    /**
     * Carrega o texto a partir de um arquivo
     *
     * @param filename Nome do arquivo
     *
     * @throws FileNotFoundException
     */
    public void leArquivo(String filename) throws FileNotFoundException
    {
        //abre o arquivo para leitura
        Scanner scanner = new Scanner(new File(filename));

        StringBuilder _texto = new StringBuilder();

        //percorre linha a linha
        while (scanner.hasNextLine()) {

            //recupera a proxima linha do arquivo
            String linha = scanner.nextLine().trim();

            //checa se a linha não está vazia
            if (linha.length() > 0) {
                _texto.append(linha).append(System.getProperty("line.separator"));
            }
        }

        leTexto(_texto.toString());
    }

    /**
     * Pesquisa no dicionário referencias de uma palavra
     *
     * @param termo
     * 
     * @return
     */
    public String[] pesquisa(String termo)
    {
        String linha;

        String[] linhas;

        String[] frase = termo.split("\\s");

        IItemPalavra resultado = arvore.pesquisa(frase[0]);

        if (resultado != null) {

            linhas = new String[resultado.numDeOcorrencias()];

            int i = 0;
            
            for (int inicio : resultado.getOcorrencias()) {
                
                if (i >= resultado.numDeOcorrencias()) {
                    break;
                }

                linha = _leLinha(inicio);

                if (linha.substring(0, termo.length()).equalsIgnoreCase(termo)) {
                    linhas[i++] = linha;
                }
            }

        } else {
            linhas = new String[0];
        }

        
        return linhas;
    }

    /**
     * Remove um registro do dicionário
     *
     * @param termo
     *
     * @return Registro que foi removido para ser utilizado após a remoção
     * 
     * @throws Exception
     */
    private Registro remove(String termo) throws Exception
    {
        Registro registro = (Registro)arvore.remove(termo);

        return registro;
    }

    /**
     * Faz a leitura de uma linha a partir da posição 'inicio'
     *
     * @param inicio
     * 
     * @return
     */
    private String _leLinha(int inicio)
    {
        String linha = "";

        do {
            linha += texto.charAt(inicio);
            inicio++;
        } while (inicio < texto.length() && (int)texto.charAt(inicio) != 10);

        return linha;
    }

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args)
    {

        try {

            //cria o dicionario
            Dicionario dicionario = new Dicionario();

            //carrega o texto a partir de um arquivo
            dicionario.leArquivo("conteudo");

            //pesquisa por "cruzeiro"
            pesquisa(dicionario, "cruzeiro");

            //pesquisa por "cruzeiro atacava"
            pesquisa(dicionario, "cruzeiro atacava");

            //pesquisa por "atlético"
            pesquisa(dicionario, "atlético");
            
            //pesquisa o registro "atlético"
            remove(dicionario, "atlético");

            //pesquisa por "atlético" novamente para mostrar que não foi encontrado mais registros
            pesquisa(dicionario, "atlético");

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    /**
     * Executa rotinas de pesquisa e imprime o resultado na tela
     *
     * @param dicionario
     * 
     * @param termo
     */
    public static void pesquisa(Dicionario dicionario, String termo)
    {
        System.out.println("================== Pesquisando por: '" + termo + "' ==================\n");

        String[] resultado = dicionario.pesquisa(termo);

        if (resultado.length > 0) {

            int i = 1;

            for (String ocorrencia : resultado) {
                if (ocorrencia != null) {
                    System.out.println("Ocorrência " + (i++) + ": " + ocorrencia + "\n");
                }
            }

        } else {
            System.out.println("Nenhuma ocorrência encontrada\n");
        }

    }

    /**
     * Executa rotinas de remoção e imprime o resultado na tela
     *
     * @param dicionario
     * @param termo
     *
     * @throws Exception 
     */
    public static void remove(Dicionario dicionario, String termo) throws Exception
    {
        out.println("================== Removendo: '" + termo + "' ==================\n");
        Registro atletico = (Registro) dicionario.remove(termo);
        out.println(atletico.numDeOcorrencias() + " ocorrências foram removidas\n");
    }

    /**
     * Converte uma string em uma sequencia de bits.
     *
     * obs: utilizado apenas para depuração de código.
     *
     * @param str
     *
     * @return
     */
    public static String stringToBits(String str)
    {
        // Convert string to
        String inputfilebinary = "";

        for (int i = 0; i<str.length(); i++){
          char c = str.charAt(i);
          String binaryString = "00000000" + Integer.toBinaryString(c);
          inputfilebinary += binaryString.substring(binaryString.length()-8) + " ";
        }

        return inputfilebinary;
    }
}
