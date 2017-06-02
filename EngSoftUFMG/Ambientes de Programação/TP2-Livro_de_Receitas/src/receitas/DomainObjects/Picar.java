package receitas.DomainObjects;

import java.util.*;

/**
 *
 * @author Charles.Fortes
 */
public class Picar extends Tarefa {    
    public Picar(String[] nomesIngrs)
    {
        super(nomesIngrs);
    }

    @Override
    public String descrever(Ingrediente[] ingrs) {
        String ret = "";
        try {
            ret = super.descrever("Picar", ingrs);
        } catch (TarefaException ex) {
            ret = ex.getMessage();
        }
        return ret;
    }

    @Override
    public Ingrediente resultado() throws IngredienteException {
        if (getIngredientes().length > 1){
            List<Picado> f = new ArrayList<Picado>();
            for (Ingrediente ingr : getIngredientes())
                f.add(new Picado(ingr));
            return new Mistura(f.toArray(new Picado[f.size()]));
        }
        else
            return new Picado(getIngredientes()[0]);
        
    }

    @Override
    protected String getMsgIncompatibilidade() {
        return "Ingredientes {0} não podem ser picados";
    }

    @Override
    protected List<Integer> getTiposCompativeis() {
        return new ArrayList<Integer>(Arrays.asList(new Integer[]{
            Ingrediente.TIPO_SOLIDO}
        ));
    }
}
