package receitas.DomainObjects;

import java.util.*;

/**
 *
 * @author Charles.Fortes
 */
public class Receita {
    private static final String MSG_ERRO_INGR_NAO_ENCONTRADO =
             "Ingrediente não encontrado na receita.";
    private static final String MSG_ERRO_RECEITA_INGR_INVALIDO =
            "Existem ingredientes inválidos na receita, favor verificar a lista "
            + "de ingredientes.";
    
    private List<Ingrediente> _ingredientes;
    private List<Tarefa> _tarefas;
    private String _nome;

    public Receita(String nome, List<Ingrediente> ingredientes, List<Tarefa> tarefas)
    {
        _nome = nome;
        _ingredientes = ingredientes;
        _tarefas = tarefas;
    }
    public String descrever()
    {
        StringBuilder str = new StringBuilder();

        str.append(" ").append(_nome);
        str.append("\nIngredientes:\n\n");
        for (Ingrediente ingr : _ingredientes)
        {
            if (!(ingr instanceof IResultado))
            str.append("\t").append(ingr.descrever()).append("\n\n");
        }

        str.append("\nModo de preparo:\n\n");
        try {
            for (Tarefa tarf : _tarefas)
            {
                //Verifica se todos os ingredientes estão presentes na receita
                //e retorna um arranjo com eles
                Ingrediente[] ingrs = getIngredientesTarefa(tarf);
                str.append("\t").append(tarf.descrever(ingrs)).append("\n");
            }
        } catch (Exception ex)
        {
            return ex.getMessage();
        }

        str.append("\nResultado:\n\n");
        try {
            str.append("\t").append(_tarefas.get(_tarefas.size() - 1).resultado().descrever());
        } catch (IngredienteException ex) {
            str.append(ex.getMessage());
        }
        return str.toString();
    }

    private Ingrediente[] getIngredientesTarefa(Tarefa tarefa) throws Exception
    {
        List<Ingrediente> ingrs = new ArrayList<Ingrediente>();
        try {
            for (String nomeIngr : tarefa.getNomesIngredientes())
                ingrs.add(getIngrediente(nomeIngr));
        } catch (Exception ex)
        {
           if (ex.getMessage().equals(MSG_ERRO_INGR_NAO_ENCONTRADO))
               throw new Exception(MSG_ERRO_RECEITA_INGR_INVALIDO);
           else
               throw ex;
        }
        return ingrs.toArray(new Ingrediente[ingrs.size()]);
    }

    public String nome() { return _nome; }
    public Ingrediente getIngrediente(String nomeIngrediente) throws Exception
    {
        Ingrediente ingrRetorno = null;

        for (Ingrediente ingr : _ingredientes)
        { 
            if (ingr.nome().intern() == nomeIngrediente.intern())
            {
                ingrRetorno = ingr;
                break;
            }
        }
        if (ingrRetorno == null)
            throw new Exception(MSG_ERRO_INGR_NAO_ENCONTRADO);
        
        return ingrRetorno;
    }
}
