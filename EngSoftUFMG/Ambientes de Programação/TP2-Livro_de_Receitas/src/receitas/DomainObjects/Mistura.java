package receitas.DomainObjects;

/**
 *
 * @author Charles.Fortes
 */
public class Mistura extends Ingrediente implements IResultado{
    private Ingrediente[] _ingredientes;

    public Mistura(Ingrediente[] ingrs) throws IngredienteException
    {       
        super("Mistura_" + ingrs.length, ingrs.length, TIPO_MISTO);
        _ingredientes = ingrs;
        setNome(this.descrever());
    }
    
    @Override
    public String descrever()
    {
        StringBuilder str = new StringBuilder();

        str.append("Mistura de (");

        for (int i = 0; i < _ingredientes.length; i++)
        {
            str.append(_ingredientes[i].nome()).append((i < _ingredientes.length - 1) ? " e " : "");
        }

        str.append(")");

        return str.toString();
    }
}
