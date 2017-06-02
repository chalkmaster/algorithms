package receitas.DomainObjects;

import java.util.*;

/**
 *
 * @author Charles.Fortes
 */
public class Descascar extends Tarefa {    
    public Descascar(String[] nomesIngrs)
    {
        super(nomesIngrs);
    }

    @Override
    public String descrever(Ingrediente[] ingrs) {
                String ret = "";
        try {
            ret = super.descrever("Descascar", ingrs);
        } catch (TarefaException ex) {
            ret = ex.getMessage();
        }
        return ret;
    }

    @Override
    public Ingrediente resultado() throws IngredienteException {
        if (getIngredientes().length > 1){
            List<Descascado> f = new ArrayList<Descascado>();
            for (Ingrediente ingr : getIngredientes())
                f.add(new Descascado(ingr));
            return new Mistura(f.toArray(new Descascado[f.size()]));
        }
        else
            return new Descascado(getIngredientes()[0]);
        
    }

        @Override
    protected String getMsgIncompatibilidade() {
        return "Ingredientes {0} não podem ser descascados";
    }

    @Override
    protected List<Integer> getTiposCompativeis() {
        return new ArrayList<Integer>(Arrays.asList(new Integer[]{
            Ingrediente.TIPO_SOLIDO}
        ));
    }
}
