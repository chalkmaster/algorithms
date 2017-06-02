package receitas.DomainObjects;

import java.util.*;

/**
 *
 * @author Charles.Fortes
 */
public abstract class Tarefa {
    private String [] nomesIngredientes;
    private Ingrediente[] ingredientes;
    private static final String MSG_ERRO_INGR_NAO_ENCONTRADO =
             "Ingrediente não encontrado na receita.";
    private static final String MSG_ERRO_RECEITA_INGR_INVALIDO =
            "Existem ingredientes inválidos na receita, favor verificar a lista "
            + "de ingredientes.";

    public Tarefa(String[] nomesIngrs){ nomesIngredientes = nomesIngrs; }

    /**
     * produx uma descrição da tarefa a partir de um conjunto de ingredientes
     * @param ingrs: Ingredientes da tarefa
     * @return descrição da tarefa
     */
    public abstract String descrever(Ingrediente[] ingrs);

    /**
     * Retorna o ingrediente resultante da tarefa
     * @return ingrediente resultante da tarefa
     */
    public abstract Ingrediente resultado() throws IngredienteException;

    protected abstract String getMsgIncompatibilidade();
    protected abstract List<Integer> getTiposCompativeis();

    /**
     * Valida se há algum ingrediente inválido na lista de ingredientes passados a tarefa
     * @param ingrs: Ingredientes a serem validados
     * @param brokenRules: Regras inválidas entre as tarefas e os ingredientes
     * @return true se não há nenhum problema com os ingredientes, false caso um ou
     * mais ingredientes não possam ser executados pela tarefa
     */
    private boolean ValidaTipos(Ingrediente[] ingrs, List<String> brokenRules)
    {
        for (Ingrediente ingr: ingrs)
        {
            if (!getTiposCompativeis().contains(ingr.tipo()))
            {
                String msg = getMsgIncompatibilidade();
                if (!msg.contains("{0}"))
                    msg = msg + ": \n\tIngredientes fo tipo: {0}";

                String descTipo;
                switch (ingr.tipo())
                {
                    case Ingrediente.TIPO_LIQUIDO:
                        descTipo = "liquidos";
                        break;
                    case Ingrediente.TIPO_SOLIDO:
                        descTipo = "solidos";
                        break;
                    case Ingrediente.TIPO_PO:
                        descTipo = "em pó";
                        break;
                    case Ingrediente.TIPO_MISTO:
                        descTipo = "misturados";
                        break;
                    default:
                        descTipo = "tipo não tratado";
                        break;
                }
                brokenRules.add(String.format(msg, descTipo));
            }
        }
        return brokenRules.isEmpty();
    }

    public String[] getNomesIngredientes() { return nomesIngredientes; }
    public Ingrediente[] getIngredientes() { return ingredientes; }

  
    /**
     * Executa uma tarefa
     * @param ingrs: Ingredientes para a execução de uma tarefa
     */
    public void executar(Ingrediente[] ingrs) throws TarefaException {

        List<String> brokenRules = new ArrayList<String>();
        if (!ValidaTipos(ingrs, brokenRules))
            throw new TarefaException(StringHelper.join(brokenRules, "\n"));

        ingredientes = ingrs;
    }

    protected String descrever(String prefixoAcao, Ingrediente[] ingrs)
            throws TarefaException {
        
        List<String> brokenRules = new ArrayList<String>();
        if (!ValidaTipos(ingrs, brokenRules))
            throw new TarefaException(StringHelper.join(brokenRules, "\n"));

        StringBuilder str = new StringBuilder();
        str.append(prefixoAcao).append(" ");

        for (int i = 0; i < ingrs.length; i++)
        {
            str.append(ingrs[i].nome());
            if (i < ingrs.length -1)
                str.append(" e ");
        }

        return str.toString();
    }

    public static Ingrediente[] getIngredientesTarefa(Tarefa tarefa,
            List<Ingrediente> lstIngrs) throws TarefaException
    {
        List<Ingrediente> ingrs = new ArrayList<Ingrediente>();
        try {
            for (String nomeIngr : tarefa.getNomesIngredientes())
                ingrs.add(getIngrediente(nomeIngr, lstIngrs));
        } catch (TarefaException ex)
        {
           if (ex.getMessage().equals(MSG_ERRO_INGR_NAO_ENCONTRADO))
               throw new TarefaException(MSG_ERRO_RECEITA_INGR_INVALIDO);
           else
               throw ex;
        }
        return ingrs.toArray(new Ingrediente[ingrs.size()]);
    }

    private static Ingrediente getIngrediente(String nomeIngrediente,
            List<Ingrediente> lstIngrs) throws TarefaException
    {
        Ingrediente ingrRetorno = null;

        for (Ingrediente ingr : lstIngrs)
        {
            if (ingr.nome().intern() == nomeIngrediente.intern())
            {
                ingrRetorno = ingr;
                break;
            }
        }
        if (ingrRetorno == null)
            throw new TarefaException(MSG_ERRO_INGR_NAO_ENCONTRADO);

        return ingrRetorno;
    }
}
