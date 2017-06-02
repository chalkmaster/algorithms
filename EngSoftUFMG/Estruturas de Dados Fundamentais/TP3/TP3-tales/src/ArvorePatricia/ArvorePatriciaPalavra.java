package ArvorePatricia;

/**
 *
 */
public class ArvorePatriciaPalavra implements IArvorePatriciaPalavra
{
    /**
     * Nodo raiz da árvore
     */
    private NodoPatriciaPalavra raiz;

    /**
     * Caracter que representa uma chave inválida
     */
    private char invalidChar = 0x00FF;

    /**
     * Registro raiz
     */
    private Registro registroRaiz = new Registro(" ");

    /**
     * Inicializa nodoAvo árvore
     */
    public void inicializa()
    {
        //cria nodoAvo raiz da arvore
        raiz = new NodoPatriciaPalavra();
        raiz.setTipo(NodoTipo.INTERNO);

        //cria o nodo externo para setar o registro
        NodoPatriciaPalavra esq = new NodoPatriciaPalavra();
        esq.setTipo(NodoTipo.EXTERNO);
        raiz.setNodoPatEsq(esq);

        //cria um registro inicial na árvore
        esq.setItemPalavra(registroRaiz);
    }

    /**
     * Checa se nodoAvo árvore está vazia
     *
     * @return boolean
     */
    public boolean vazia()
    {
        return raiz.getNodoPatEsq().getTipo() == NodoTipo.EXTERNO;
    }

    /**
     * Checa se uma determinada chave é válida para entrar na árvore
     *
     * @param chave
     *
     * @return boolean
     */
    private boolean _checkChave(String chave)
    {
        if (chave == null) return false;
        if (chave.length() == 0) return false;
        if (chave.indexOf(invalidChar) > 0) return false;
        if (chave.equals(registroRaiz.getPalavra())) return false;

        return true;
    }

    /**
     * Recupera o bit de uma string de acordo com nodoAvo posição do mesmo
     *
     * @param str
     * @param index
     *
     * @return int 0 ou 1
     */
    private int _bit(String str, int index)
    {
        if (index <= 0) {
            return 0;
        }

        int n = (index-1) / 8;

        if (n < str.length()) {

            int j = 7 - (index-1) % 8;
            int a = str.charAt(n);

            return ((a >>> j) & 1);

        } else {

            return 1;

        }
    }

    /**
     * Insere uma palávra na árvore
     * 
     * @param item
     *
     * @return Referencia do registro inserido
     * 
     * @throws Exception Caso nodoAvo chave seja inválida
     */
    public IItemPalavra insere(IItemPalavra item) throws Exception
    {
        String chave = item.getPalavra().toLowerCase();

        //valida nodoAvo chave nodoAvo ser inserida
        if (!_checkChave(chave)) {
            throw new Exception("Chave inválida");
        }

        //representa nodoAvo posição do bit que será feita nodoAvo inserção
        int index = 0;

        //nodos de controle de inserção
        INodoPatriciaPalavra
                nodoTemp,
                nodoPai,
                nodoCorrente = raiz;

        //sistema de pilha para armazenar o caminho de volta do nodoPai
        Pilha<INodoPatriciaPalavra> pilha = new Pilha<INodoPatriciaPalavra>();

        //loop para percorrer nodoAvo árvore através dos bits da chave
        //loop será interrompido quando achar um nodo externo (folha)
        while (nodoCorrente.getTipo() == NodoTipo.INTERNO) {
            
            nodoPai = nodoCorrente;
            pilha.empilha(nodoPai);

            if (nodoPai.getIndex() == index + 1) {
                index++;
            }

            //index = nodoPai.getIndex();

            //determina nodoAvo direção por onde deve-se percorrer na árvore
            if (nodoPai.calcBit(chave) == 0) {
                nodoCorrente = nodoPai.getNodoPatEsq();
            } else {
                nodoCorrente = nodoPai.getNodoPatDir();
            }
        }

        //agora o nodoCorrente representa um nodo externo.
        //recupera nodoAvo palavra que está contida nele
        String chaveEncontrada = nodoCorrente.getItemPalavra().getPalavra().toLowerCase();

        //checa se nodoAvo palavra já existe para incrementar o número de ocorrencias da mesma
        if (chave.equalsIgnoreCase(chaveEncontrada)) {
            return nodoCorrente.getItemPalavra();
        }

        //loop para encontrar nodoAvo posição do bit diferente
        while (_bit(chave, index) == _bit(chaveEncontrada, index)) {
            index++;
        }

        //cria o nodo para ser inserido na arvore
        NodoPatriciaPalavra novoNodo = _criaParNodos(index, item, chave);

        //insere na árvore o par apontado por parNodoInterno
        try {

            nodoPai = pilha.desempilha();
            
            while (nodoPai.getIndex() > index) {
                nodoPai = pilha.desempilha();
            }

        } catch (PilhaVazia e) {
            nodoPai = raiz;
        }

        //cria um nodo temporário para guardar o nodo que vai ser realocado
        if (nodoPai.calcBit(chaveEncontrada) == 0) {
            nodoTemp = nodoPai.getNodoPatEsq();
            nodoPai.setNodoPatEsq(novoNodo);
        } else {
            nodoTemp = nodoPai.getNodoPatDir();
            nodoPai.setNodoPatDir(novoNodo);
        }

        //volta com o nodo do temporário para nodoAvo árvore
        if (novoNodo.calcBit(chave) == 0) {
            novoNodo.setNodoPatDir(nodoTemp);
        } else {
            novoNodo.setNodoPatEsq(nodoTemp);
        }

        return item;
    }

    /**
     * Cria um par de nodos para incluir na árvore
     * 
     * @param index
     * @param item
     * @param chave
     * 
     * @return
     */
    private NodoPatriciaPalavra _criaParNodos(int index, IItemPalavra item, String chave)
    {
        //cria o nodo interno
        NodoPatriciaPalavra parNodoInterno = new NodoPatriciaPalavra();
        parNodoInterno.setTipo(NodoTipo.INTERNO);
        parNodoInterno.setIndex(index);

        //cria o nodo externo e "amarra" no nodo interno
        NodoPatriciaPalavra parNodoExterno = new NodoPatriciaPalavra();
        parNodoExterno.setItemPalavra(item);
        parNodoExterno.setTipo(NodoTipo.EXTERNO);

        //checa em qual lado do nodoInterno o registro irá ser armazenado
        if (parNodoInterno.calcBit(chave) == 0) {
            parNodoInterno.setNodoPatEsq(parNodoExterno);
        } else {
            parNodoInterno.setNodoPatDir(parNodoExterno);
        }

        return parNodoInterno;
    }

    /**
     * Remove um registro da árvore
     *
     * @param chave
     *
     * @return
     * 
     * @throws Exception
     */
    public IItemPalavra remove(String chave) throws Exception
    {
        if (!_checkChave(chave)) {
            throw new Exception("Chave inválida");
        }

        INodoPatriciaPalavra nodoAvo = null, nodoTemp, nodoPai, nodoCorrente = raiz;

        nodoPai = nodoCorrente;

        while (nodoCorrente.getTipo() == NodoTipo.INTERNO) {

            nodoAvo = nodoPai;
            nodoPai = nodoCorrente;

            if (nodoPai.calcBit(chave) == 0) {
                nodoCorrente = nodoPai.getNodoPatEsq();
            } else {
                nodoCorrente = nodoPai.getNodoPatDir();
            }
        }

        if (chave.equalsIgnoreCase(nodoCorrente.getItemPalavra().getPalavra())) {

            if (nodoCorrente == nodoPai.getNodoPatEsq()) {
                nodoTemp = nodoPai.getNodoPatDir();
            } else {
                nodoTemp = nodoPai.getNodoPatEsq();
            }

            if (nodoPai == nodoAvo.getNodoPatEsq()) {
                nodoAvo.setNodoPatEsq(nodoTemp);
            } else {
                nodoAvo.setNodoPatDir(nodoTemp);
            }

            return nodoCorrente.getItemPalavra();
        }

        throw new Exception("Registro com chave " + chave + " não foi encontrado");

    }

    /**
     * Pesquisa por uma palavra na árvore
     *
     * @param termo
     * 
     * @return O registro referente ao item encontrado
     */
    public IItemPalavra pesquisa(String termo)
    {
        INodoPatriciaPalavra nodoCorrente = raiz;

        termo = termo.toLowerCase();

        int index = 0;

        //Pilha<INodoPatriciaPalavra> pilha = new Pilha<INodoPatriciaPalavra>();

        while (nodoCorrente.getTipo() == NodoTipo.INTERNO) {

            //nodoPai = nodoCorrente;
            //pilha.empilha(nodoPai);
            index = nodoCorrente.getIndex();

            if (_bit(termo, index) == 0) {
                nodoCorrente = nodoCorrente.getNodoPatEsq();
            } else {
                nodoCorrente = nodoCorrente.getNodoPatDir();
            }
        }

        if (termo.equalsIgnoreCase(nodoCorrente.getItemPalavra().getPalavra())) {
            return nodoCorrente.getItemPalavra();
        }

        return null;
    }

    /**
     * Retorna nodoAvo raiz da árvore
     *
     * @return
     */
    public NodoPatriciaPalavra getRaiz()
    {
        return raiz;
    }
}
