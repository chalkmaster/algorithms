package receitas.DomainObjects;

import java.util.*;

/**
 *
 * @author Charles.Fortes
 */
public class Fatiar extends Tarefa {    
    public Fatiar(String[] nomesIngrs)
    {
        super(nomesIngrs);
    }

    @Override
    public String descrever(Ingrediente[] ingrs) {
        String ret = "";
        try {
            ret = super.descrever("Fatiar", ingrs);
        } catch (TarefaException ex) {
            ret = ex.getMessage();
        }
        return ret;
    }

    @Override
    public Ingrediente resultado() throws IngredienteException {
        if (getIngredientes().length > 1){
            List<Fatiado> f = new ArrayList<Fatiado>();
            for (Ingrediente ingr : getIngredientes())
                f.add(new Fatiado(ingr));
            return new Mistura(f.toArray(new Fatiado[f.size()]));
        }
        else
            return new Fatiado(getIngredientes()[0]);
    }

        @Override
    protected String getMsgIncompatibilidade() {
        return "Ingredientes {0} não podem ser fatiados";
    }

    @Override
    protected List<Integer> getTiposCompativeis() {
        return new ArrayList<Integer>(Arrays.asList(new Integer[]{
            Ingrediente.TIPO_SOLIDO}
        ));
    }
}
