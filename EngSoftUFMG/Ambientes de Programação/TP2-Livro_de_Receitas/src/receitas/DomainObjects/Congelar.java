package receitas.DomainObjects;

import java.util.*;

/**
 *
 * @author Charles.Fortes
 */
public class Congelar extends Tarefa {
    public Congelar(String[] nomesIngrs)
    {
        super(nomesIngrs);
    }

    @Override
    public String descrever(Ingrediente[] ingrs) {
        String ret = "";
        try {
            ret = super.descrever("Congelar", ingrs);
        } catch (TarefaException ex) {
            ret = ex.getMessage();
        }
        return ret;
    }

    @Override
    public Ingrediente resultado()throws IngredienteException {
        if (getIngredientes().length > 1){
            List<Congelado> f = new ArrayList<Congelado>();
            for (Ingrediente ingr : getIngredientes())
                f.add(new Congelado(ingr));
            return new Mistura(f.toArray(new Congelado[f.size()]));
        }
        else
            return new Congelado(getIngredientes()[0]);

    }

    @Override
    protected String getMsgIncompatibilidade() {
        return "Ingredientes {0} não podem ser congelados";
    }

    @Override
    protected List<Integer> getTiposCompativeis() {
        return new ArrayList<Integer>(Arrays.asList(new Integer[]{
            Ingrediente.TIPO_LIQUIDO,
            Ingrediente.TIPO_SOLIDO,
            Ingrediente.TIPO_MISTO}
        ));
    }
}
