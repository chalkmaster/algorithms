package receitas.DomainObjects;

import java.util.*;

/**
 *
 * @author Charles.Fortes
 */
public class Bater extends Tarefa {
    public Bater(String[] nomesIngrs)
    {
        super(nomesIngrs);
    }

    @Override
    public String descrever(Ingrediente[] ingrs) {
        String ret = "";
        try {
            ret = super.descrever("Bater", ingrs);
        } catch (TarefaException ex) {
            ret = ex.getMessage();
        }
        return ret;
    }

    @Override
    public Ingrediente resultado() throws IngredienteException {
        if (getIngredientes().length > 1){
            List<Batido> f = new ArrayList<Batido>();
            for (Ingrediente ingr : getIngredientes())
                f.add(new Batido(ingr));
            return new Mistura(f.toArray(new Batido[f.size()]));
        }
        else
            return new Batido(getIngredientes()[0]);

    }

    @Override
    protected String getMsgIncompatibilidade() {
        return "Ingredientes {0} não podem ser batidos";
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
