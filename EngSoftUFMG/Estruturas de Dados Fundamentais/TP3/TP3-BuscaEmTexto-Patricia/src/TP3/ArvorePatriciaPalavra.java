package TP3;

public class ArvorePatriciaPalavra implements IArvorePatriciaPalavra{
    private INodoPatriciaPalavra _rootNode;
    private final char InvalidChar = 0x00FF;
    IItemPalavra reg0 = new ItemPalavra(" ");
    
    public void inicializa() {
        _rootNode = new NodoPatriciaPalavra();
        _rootNode.setTipo(NodoTipo.INTERNO);

        INodoPatriciaPalavra esq = new NodoPatriciaPalavra();
        esq.setTipo(NodoTipo.EXTERNO);
        _rootNode.setNodoPatEsq(esq);

        esq.setItemPalavra(reg0);
    }

    public boolean vazia() {
        return _rootNode.getNodoPatEsq().getTipo() == NodoTipo.EXTERNO;
    }

    public boolean insere(IItemPalavra item) throws InvalidKeyException {
        INodoPatriciaPalavra currentNode = _rootNode;
        INodoPatriciaPalavra InnerNode, OuterNode;        
        CheckWord(item.getPalavra());
        int bitIndex = 0;

        Stack<INodoPatriciaPalavra> stack = new Stack<INodoPatriciaPalavra>();
        while (currentNode.getTipo() == NodoTipo.INTERNO)
        {
            InnerNode = currentNode;
            if (InnerNode.getIndex() == bitIndex + 1) {
                bitIndex++;
            }

            stack.empilha(currentNode);
            if (bit(item.getPalavra(), InnerNode.getIndex()) == 0)
                currentNode = InnerNode.getNodoPatEsq();
            else
                currentNode = InnerNode.getNodoPatDir();
        }
        OuterNode = currentNode;
        if (item.getPalavra().equalsIgnoreCase(OuterNode.getItemPalavra().getPalavra())){
            OuterNode.getItemPalavra().addOcorrencia(bitIndex);
            return true;
        }
        else
        {
            while (bit(item.getPalavra(), bitIndex) == bit(OuterNode.getItemPalavra()
                    .getPalavra(), bitIndex)) {
                bitIndex++;
            }
            INodoPatriciaPalavra novoNodo = createNewNodo(bitIndex, item, item.getPalavra());
            item.addOcorrencia(bitIndex);
            try {
                currentNode = stack.desempilha();
                while (currentNode.getIndex() > bitIndex) {
                    currentNode = stack.desempilha();
                }

            } catch (EmptyStackException e) {
                currentNode = _rootNode;
            }

            if (currentNode.calcBit(OuterNode.getItemPalavra().getPalavra()) == 0) {
                InnerNode = currentNode.getNodoPatEsq();
                currentNode.setNodoPatEsq(novoNodo);
            } else {
                InnerNode = currentNode.getNodoPatDir();
                currentNode.setNodoPatDir(novoNodo);
            }

            if (novoNodo.calcBit(item.getPalavra()) == 0) {
                novoNodo.setNodoPatDir(InnerNode);
            } else {
                novoNodo.setNodoPatEsq(InnerNode);
            }
        }
        return true;
    }

    public boolean remove(String p)  throws InvalidKeyException {
        INodoPatriciaPalavra currentNode = _rootNode;
        INodoPatriciaPalavra InnerNode, OuterNode, parentNode;
        CheckWord(p);
        InnerNode = currentNode;
        parentNode = InnerNode;
        while (currentNode.getTipo() == NodoTipo.INTERNO)
        {
            parentNode = InnerNode;
            InnerNode = currentNode;
            if (bit(p, InnerNode.getIndex()) == 0)
                currentNode = InnerNode.getNodoPatEsq();
            else
                currentNode = InnerNode.getNodoPatDir();
        }
        OuterNode = currentNode;
        if (p.equals(OuterNode.getItemPalavra().getPalavra())){
            if (OuterNode == InnerNode.getNodoPatEsq()) {
                OuterNode = InnerNode.getNodoPatDir();
            } else {
                OuterNode = InnerNode.getNodoPatEsq();
            }

            if (InnerNode == parentNode.getNodoPatEsq()) {
                parentNode.setNodoPatEsq(OuterNode);
            } else {
                parentNode.setNodoPatDir(OuterNode);
            }
            return true;
        }
        else
            return false;
    }

    public IItemPalavra pesquisa(String p) throws InvalidKeyException {
        INodoPatriciaPalavra currentNode = _rootNode;
        INodoPatriciaPalavra InnerNode, OuterNode;        
        CheckWord(p);
        while (currentNode.getTipo() == NodoTipo.INTERNO)
        {
            InnerNode = currentNode;
            if (bit(p, InnerNode.getIndex()) == 0)
                currentNode = InnerNode.getNodoPatEsq();
            else
                currentNode = InnerNode.getNodoPatDir();
        }
        OuterNode = currentNode;
        if (p.equals(OuterNode.getItemPalavra().getPalavra()))
            return OuterNode.getItemPalavra();
        else
            return null;
    }

    private int bit(String p, int idx)
    {
        if (idx <=0) return 0;
        int n = (idx-1)/8;
        if (n < p.length()){
            int j = 7 - (idx-1) %8;
            int a = p.charAt(n);
            return ((a >>>j) & 1);
        } else return 1;
    }
    private void CheckWord(String p) throws InvalidKeyException {
        if (p == null) throw new InvalidKeyException();
        if (p.length() == 0)throw new InvalidKeyException();
        if (p.indexOf(InvalidChar) > 0)throw new InvalidKeyException();
        if (p.equals(reg0.getPalavra()))throw new InvalidKeyException();
    }

    private INodoPatriciaPalavra createNewNodo(int bitIndex, IItemPalavra item, String word) {
        INodoPatriciaPalavra innerNode = new NodoPatriciaPalavra();
        innerNode.setTipo(NodoTipo.INTERNO);
        innerNode.setIndex(bitIndex);

        INodoPatriciaPalavra outerNode = new NodoPatriciaPalavra();
        outerNode.setItemPalavra(item);
        outerNode.setTipo(NodoTipo.EXTERNO);

        if (innerNode.calcBit(word) == 0) {
            innerNode.setNodoPatEsq(outerNode);
        } else {
            innerNode.setNodoPatDir(outerNode);
        }

        return innerNode;
    }

}
