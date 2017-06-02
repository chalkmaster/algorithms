package TP3;

public class Main {

    public static void main(String[] args) throws Exception {
        PatriciaLoader loader = new PatriciaLoader();
        ArvorePatriciaPalavra arvore = new ArvorePatriciaPalavra();
        arvore.inicializa();

        System.out.println("----- Inserindo texto na árvore ------ ");

        for (String[] ln : loader.load())
        {
            if (ln == null)
                break;
            
            for (String s : ln)                
                try {
                arvore.insere(new ItemPalavra(s));
            } catch (InvalidKeyException ex) {
                System.out.println("Uma ou mais chaves contem erro!\n" + ex.getMessage());
            }
        }

        System.out.println("----- Pesquisando pela palavra 'nome' ------ ");

        IItemPalavra p = arvore.pesquisa("nome");

        System.out.println("Palavra: " + p.getPalavra()
                + "\nNumero de Ocorrencias (esperado 3): " + p.numDeOcorrencias() );

        System.out.println("----- Removendo a palavra 'nome' ------ ");
        arvore.remove("nome");

        System.out.println("----- Pesquisando pela palavra 'nome' ------ ");
        p = arvore.pesquisa("nome");

        if (p == null)
            System.out.println("Nenhum item encontrado!");
        else
            System.out.println("Palavra: " + p.getPalavra()
                + "\nNumero de Ocorrencias (esperado 0): " + p.numDeOcorrencias() );
    }

    private static class PatriciaLoader extends LoadData
    {
        private String[][] data = new String[100][];
        private int lastPosition = 0;
        @Override
        protected String getCaminhoArquivo() {
            return "DeusesGregos.txt";
        }

        @Override
        protected void adicionar(String linha) {
            data[lastPosition++] = linha.split(" ");
        }

        @Override
        protected String[][] getData() {
            return data;
        }

    }

}
