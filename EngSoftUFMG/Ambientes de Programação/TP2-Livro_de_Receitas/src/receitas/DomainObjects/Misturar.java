package receitas.DomainObjects;

import java.util.*;

/**
 *
 * @author Charles.Fortes
 */
public class Misturar extends Tarefa {    
    public Misturar(String[] nomesIngrs)
    {
        super(nomesIngrs);
    }

    @Override
    public String descrever(Ingrediente[] ingrs) {
        String ret = "";
        try {
            ret = super.descrever("Misturar", ingrs);
        } catch (TarefaException ex) {
            ret = ex.getMessage();
        }
        return ret;
    }

    @Override
    public Ingrediente resultado() throws IngredienteException {
        return new Mistura(getIngredientes());
    }

        @Override
    protected String getMsgIncompatibilidade() {
        return "Ingredientes {0} não podem ser misturados";
    }

    @Override
    protected List<Integer> getTiposCompativeis() {
        return new ArrayList<Integer>(Arrays.asList(new Integer[]{
            Ingrediente.TIPO_LIQUIDO,
            Ingrediente.TIPO_PO,
            Ingrediente.TIPO_SOLIDO,
            Ingrediente.TIPO_MISTO}
        ));
    }
}
