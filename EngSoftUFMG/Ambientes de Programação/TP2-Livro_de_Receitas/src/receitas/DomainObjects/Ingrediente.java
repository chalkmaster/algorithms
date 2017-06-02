package receitas.DomainObjects;

/**
 * Representa um ingrediente
 * @author Charles.Fortes
 */
public class Ingrediente {
    // -- Constantes simbólicas para tipos de ingredientes
    public static final int TIPO_LIQUIDO = 0;
    public static final int TIPO_SOLIDO = 1;
    public static final int TIPO_PO = 2;
    public static final int TIPO_MISTO = 3;
    // ------------

    private static final String ERRO_QUANTIDADE_NEGATIVA =
                           "A quantidade informada para o ingrediente não é válida:\n"
                           + "\tA quantidade deve ser maior do que zero.";
    private static final String ERRO_TIPO_INVALIDO = "O tipo do ingrediente informado"
            + "não é válido: \n\tO tipo do ingrediente deve ser Liquido, Solido ou Pó.";

    private float _quantidade;
    private String _nome;
    private int _tipo;
    
    public Ingrediente(String nome, float quantidade, int tipo)
            throws IngredienteException
    {
        if (quantidade <= 0)
            throw new IngredienteException(ERRO_QUANTIDADE_NEGATIVA);

        if (tipo < TIPO_LIQUIDO || tipo > TIPO_MISTO)
            throw new IngredienteException(ERRO_TIPO_INVALIDO);

        _quantidade = quantidade; _nome = nome; _tipo = tipo;
    }

    public int tipo() { return _tipo; };
    public float quantidade(){ return _quantidade; }
    public String nome() { return _nome; }
    protected void setNome(String nome) { _nome = nome;  }

    public String descrever() { return quantidade() + " " + nome(); }
}
